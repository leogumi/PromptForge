const express = require('express');
const axios = require('axios');
const { query, transaction } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Mercado Pago configuration
const MP_ACCESS_TOKEN = process.env.MERCADOPAGO_ACCESS_TOKEN;
const MP_API_URL = 'https://api.mercadopago.com';

// Create subscription preference (like Stripe checkout)
router.post('/create-subscription', authenticateToken, async (req, res) => {
  try {
    const { plan } = req.body; // 'basic', 'premium', or 'enterprise'
    const userId = req.user.userId;

    const userResult = await query(
      'SELECT email, full_name FROM users WHERE id = $1',
      [userId]
    );

    const user = userResult.rows[0];

    // Plan prices in ARS (pesos argentinos)
    // Exchange rate 2026: 1 USD = ~1200 ARS
    const planPrices = {
      basic: {
        amount: 22800, // $22,800 ARS (~$19 USD)
        title: 'Plan Básico - PromptForge',
        description: '50 prompts mensuales, venta en marketplace'
      },
      premium: {
        amount: 58800, // $58,800 ARS (~$49 USD)
        title: 'Plan Premium - PromptForge',
        description: 'Prompts ilimitados, 5% comisión'
      },
      enterprise: {
        amount: 178800, // $178,800 ARS (~$149 USD)
        title: 'Plan Enterprise - PromptForge',
        description: '0% comisión, API personalizada'
      }
    };

    const selectedPlan = planPrices[plan];

    if (!selectedPlan) {
      return res.status(400).json({ error: 'Invalid plan' });
    }

    // Create preference in Mercado Pago
    const preference = {
      items: [{
        id: `${plan}_subscription`,
        title: selectedPlan.title,
        description: selectedPlan.description,
        currency_id: 'ARS',
        unit_price: selectedPlan.amount,
        quantity: 1
      }],
      payer: {
        name: user.full_name,
        email: user.email
      },
      back_urls: {
        success: `${process.env.FRONTEND_URL}/dashboard?payment=success`,
        failure: `${process.env.FRONTEND_URL}/pricing?payment=failure`,
        pending: `${process.env.FRONTEND_URL}/dashboard?payment=pending`
      },
      auto_return: 'approved',
      notification_url: `${process.env.BACKEND_URL}/api/payments-mp/webhook`,
      metadata: {
        user_id: userId,
        plan: plan
      },
      payment_methods: {
        excluded_payment_types: [],
        installments: 1 // Suscripción mensual sin cuotas
      }
    };

    const response = await axios.post(
      `${MP_API_URL}/checkout/preferences`,
      preference,
      {
        headers: {
          'Authorization': `Bearer ${MP_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    res.json({
      preferenceId: response.data.id,
      initPoint: response.data.init_point, // URL para redirect
      sandboxInitPoint: response.data.sandbox_init_point // Para testing
    });

  } catch (error) {
    console.error('Mercado Pago error:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Failed to create payment preference',
      details: error.response?.data
    });
  }
});

// Webhook handler for Mercado Pago notifications
router.post('/webhook', express.json(), async (req, res) => {
  try {
    const { type, data } = req.body;

    // Mercado Pago sends different notification types
    if (type === 'payment') {
      const paymentId = data.id;

      // Get payment details
      const paymentResponse = await axios.get(
        `${MP_API_URL}/v1/payments/${paymentId}`,
        {
          headers: {
            'Authorization': `Bearer ${MP_ACCESS_TOKEN}`
          }
        }
      );

      const payment = paymentResponse.data;

      if (payment.status === 'approved') {
        await handlePaymentApproved(payment);
      }
    }

    res.sendStatus(200);
  } catch (error) {
    console.error('Webhook error:', error);
    res.sendStatus(500);
  }
});

async function handlePaymentApproved(payment) {
  const { user_id, plan } = payment.metadata;

  await transaction(async (client) => {
    // Update user plan
    await client.query(
      'UPDATE users SET plan = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [plan, user_id]
    );

    // Create subscription record
    await client.query(
      `INSERT INTO subscriptions 
       (user_id, plan, status, mp_payment_id, amount, current_period_start, current_period_end)
       VALUES ($1, $2, 'active', $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '1 month')`,
      [user_id, plan, payment.id, payment.transaction_amount]
    );

    // Reset prompt counter for new billing period
    await client.query(
      'UPDATE users SET prompts_used = 0 WHERE id = $1',
      [user_id]
    );

    console.log(`✅ Subscription activated for user ${user_id}, plan: ${plan}`);
  });
}

// Purchase prompt in marketplace
router.post('/purchase-prompt/:promptId', authenticateToken, async (req, res) => {
  try {
    const { promptId } = req.params;
    const buyerId = req.user.userId;

    // Get prompt details
    const promptResult = await query(
      'SELECT * FROM prompts WHERE id = $1 AND is_published = true',
      [promptId]
    );

    if (promptResult.rows.length === 0) {
      return res.status(404).json({ error: 'Prompt not found' });
    }

    const prompt = promptResult.rows[0];

    // Check if already purchased
    const existingPurchase = await query(
      'SELECT id FROM purchases WHERE buyer_id = $1 AND prompt_id = $2',
      [buyerId, promptId]
    );

    if (existingPurchase.rows.length > 0) {
      return res.status(400).json({ error: 'Already purchased' });
    }

    const userResult = await query(
      'SELECT email, full_name FROM users WHERE id = $1',
      [buyerId]
    );

    const buyer = userResult.rows[0];

    // Convert USD to ARS (2026 rate: 1 USD = ~1200 ARS)
    const priceInARS = Math.round(parseFloat(prompt.price) * 1200);

    // Create payment preference
    const preference = {
      items: [{
        id: promptId,
        title: prompt.title,
        description: prompt.description?.substring(0, 100) || 'Prompt profesional',
        currency_id: 'ARS',
        unit_price: priceInARS,
        quantity: 1
      }],
      payer: {
        name: buyer.full_name,
        email: buyer.email
      },
      back_urls: {
        success: `${process.env.FRONTEND_URL}/marketplace?purchase=success`,
        failure: `${process.env.FRONTEND_URL}/marketplace?purchase=failure`,
        pending: `${process.env.FRONTEND_URL}/marketplace?purchase=pending`
      },
      auto_return: 'approved',
      notification_url: `${process.env.BACKEND_URL}/api/payments-mp/webhook-marketplace`,
      metadata: {
        buyer_id: buyerId,
        prompt_id: promptId,
        seller_id: prompt.user_id
      }
    };

    const response = await axios.post(
      `${MP_API_URL}/checkout/preferences`,
      preference,
      {
        headers: {
          'Authorization': `Bearer ${MP_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    res.json({
      preferenceId: response.data.id,
      initPoint: response.data.init_point
    });

  } catch (error) {
    console.error('Purchase error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to create purchase' });
  }
});

// Webhook for marketplace purchases
router.post('/webhook-marketplace', express.json(), async (req, res) => {
  try {
    const { type, data } = req.body;

    if (type === 'payment') {
      const paymentId = data.id;

      const paymentResponse = await axios.get(
        `${MP_API_URL}/v1/payments/${paymentId}`,
        {
          headers: {
            'Authorization': `Bearer ${MP_ACCESS_TOKEN}`
          }
        }
      );

      const payment = paymentResponse.data;

      if (payment.status === 'approved') {
        await handleMarketplacePurchase(payment);
      }
    }

    res.sendStatus(200);
  } catch (error) {
    console.error('Marketplace webhook error:', error);
    res.sendStatus(500);
  }
});

async function handleMarketplacePurchase(payment) {
  const { buyer_id, prompt_id, seller_id } = payment.metadata;

  await transaction(async (client) => {
    // Get seller's plan for commission calculation
    const sellerResult = await client.query(
      'SELECT plan FROM users WHERE id = $1',
      [seller_id]
    );

    const commissionRates = {
      free: 0.15,
      basic: 0.15,
      premium: 0.05,
      enterprise: 0
    };

    const sellerPlan = sellerResult.rows[0].plan;
    const amount = payment.transaction_amount;
    const commission = amount * commissionRates[sellerPlan];

    // Create purchase record
    await client.query(
      `INSERT INTO purchases 
       (buyer_id, prompt_id, seller_id, amount, commission, mp_payment_id, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'completed')`,
      [buyer_id, prompt_id, seller_id, amount, commission, payment.id]
    );

    // Update prompt sales count
    await client.query(
      'UPDATE prompts SET sales_count = sales_count + 1 WHERE id = $1',
      [prompt_id]
    );

    console.log(`✅ Marketplace purchase completed: Prompt ${prompt_id}`);
  });
}

// Get current subscription
router.get('/subscription', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const result = await query(
      `SELECT * FROM subscriptions 
       WHERE user_id = $1 AND status = 'active'
       ORDER BY created_at DESC LIMIT 1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.json({ subscription: null });
    }

    res.json({ subscription: result.rows[0] });
  } catch (error) {
    console.error('Get subscription error:', error);
    res.status(500).json({ error: 'Failed to fetch subscription' });
  }
});

// Cancel subscription (user initiated)
router.post('/cancel-subscription', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    await query(
      `UPDATE subscriptions 
       SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP
       WHERE user_id = $1 AND status = 'active'`,
      [userId]
    );

    await query(
      `UPDATE users SET plan = 'free' WHERE id = $1`,
      [userId]
    );

    res.json({ message: 'Subscription cancelled successfully' });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    res.status(500).json({ error: 'Failed to cancel subscription' });
  }
});

module.exports = router;
