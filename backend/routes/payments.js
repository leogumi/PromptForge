const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { query } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Create checkout session for subscription
router.post('/create-subscription', authenticateToken, async (req, res) => {
  try {
    const { plan } = req.body; // 'basic', 'premium', or 'enterprise'
    const userId = req.user.userId;

    const userResult = await query(
      'SELECT email, stripe_customer_id FROM users WHERE id = $1',
      [userId]
    );

    const user = userResult.rows[0];

    // Price IDs (you'll need to create these in Stripe Dashboard)
    const priceIds = {
      basic: process.env.STRIPE_PRICE_BASIC || 'price_basic',
      premium: process.env.STRIPE_PRICE_PREMIUM || 'price_premium',
      enterprise: process.env.STRIPE_PRICE_ENTERPRISE || 'price_enterprise'
    };

    let customerId = user.stripe_customer_id;

    // Create customer if doesn't exist
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { userId }
      });
      customerId = customer.id;
      
      await query(
        'UPDATE users SET stripe_customer_id = $1 WHERE id = $2',
        [customerId, userId]
      );
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [{
        price: priceIds[plan],
        quantity: 1
      }],
      mode: 'subscription',
      success_url: `${process.env.FRONTEND_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/pricing`,
      metadata: {
        userId,
        plan
      }
    });

    res.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Create subscription error:', error);
    res.status(500).json({ error: 'Failed to create subscription' });
  }
});

// Webhook handler for Stripe events
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      await handleCheckoutComplete(session);
      break;

    case 'customer.subscription.updated':
      const subscription = event.data.object;
      await handleSubscriptionUpdate(subscription);
      break;

    case 'customer.subscription.deleted':
      const deletedSubscription = event.data.object;
      await handleSubscriptionCancel(deletedSubscription);
      break;

    case 'invoice.payment_succeeded':
      const invoice = event.data.object;
      await handlePaymentSuccess(invoice);
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

async function handleCheckoutComplete(session) {
  const { userId, plan } = session.metadata;

  // Update user plan
  await query(
    'UPDATE users SET plan = $1 WHERE id = $2',
    [plan, userId]
  );

  // Create subscription record
  await query(
    `INSERT INTO subscriptions (user_id, plan, stripe_subscription_id, status, current_period_start, current_period_end)
     VALUES ($1, $2, $3, 'active', to_timestamp($4), to_timestamp($5))`,
    [userId, plan, session.subscription, session.current_period_start, session.current_period_end]
  );

  console.log(`Subscription created for user ${userId}, plan: ${plan}`);
}

async function handleSubscriptionUpdate(subscription) {
  await query(
    `UPDATE subscriptions 
     SET status = $1, 
         current_period_start = to_timestamp($2), 
         current_period_end = to_timestamp($3)
     WHERE stripe_subscription_id = $4`,
    [subscription.status, subscription.current_period_start, subscription.current_period_end, subscription.id]
  );

  console.log(`Subscription updated: ${subscription.id}`);
}

async function handleSubscriptionCancel(subscription) {
  await query(
    `UPDATE subscriptions SET status = 'canceled' WHERE stripe_subscription_id = $1`,
    [subscription.id]
  );

  // Downgrade user to free plan
  const subResult = await query(
    'SELECT user_id FROM subscriptions WHERE stripe_subscription_id = $1',
    [subscription.id]
  );

  if (subResult.rows.length > 0) {
    await query(
      'UPDATE users SET plan = $1 WHERE id = $2',
      ['free', subResult.rows[0].user_id]
    );
  }

  console.log(`Subscription canceled: ${subscription.id}`);
}

async function handlePaymentSuccess(invoice) {
  console.log(`Payment succeeded for invoice: ${invoice.id}`);
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

// Cancel subscription
router.post('/cancel-subscription', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const subResult = await query(
      `SELECT stripe_subscription_id FROM subscriptions 
       WHERE user_id = $1 AND status = 'active'
       ORDER BY created_at DESC LIMIT 1`,
      [userId]
    );

    if (subResult.rows.length === 0) {
      return res.status(404).json({ error: 'No active subscription found' });
    }

    const stripeSubId = subResult.rows[0].stripe_subscription_id;

    // Cancel at period end
    await stripe.subscriptions.update(stripeSubId, {
      cancel_at_period_end: true
    });

    res.json({ message: 'Subscription will be canceled at the end of the billing period' });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    res.status(500).json({ error: 'Failed to cancel subscription' });
  }
});

module.exports = router;
