const express = require('express');
const { query } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all published prompts
router.get('/', async (req, res) => {
  try {
    const { category, search, sortBy = 'created_at', order = 'DESC', limit = 50, offset = 0 } = req.query;

    let queryText = `
      SELECT p.*, u.username, u.full_name,
             COUNT(r.id) as review_count
      FROM prompts p
      JOIN users u ON p.user_id = u.id
      LEFT JOIN reviews r ON p.id = r.prompt_id
      WHERE p.is_published = true
    `;
    
    const params = [];
    let paramCount = 0;

    if (category) {
      paramCount++;
      queryText += ` AND p.category = $${paramCount}`;
      params.push(category);
    }

    if (search) {
      paramCount++;
      queryText += ` AND (p.title ILIKE $${paramCount} OR p.description ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }

    queryText += ` GROUP BY p.id, u.username, u.full_name`;
    queryText += ` ORDER BY ${sortBy} ${order}`;
    queryText += ` LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    params.push(limit, offset);

    const result = await query(queryText, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) FROM prompts WHERE is_published = true';
    const countParams = [];
    if (category) {
      countQuery += ' AND category = $1';
      countParams.push(category);
    }
    const countResult = await query(countQuery, countParams);

    res.json({
      prompts: result.rows,
      total: parseInt(countResult.rows[0].count),
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    console.error('Marketplace error:', error);
    res.status(500).json({ error: 'Failed to fetch marketplace prompts' });
  }
});

// Get categories with counts
router.get('/categories', async (req, res) => {
  try {
    const result = await query(`
      SELECT category, COUNT(*) as count
      FROM prompts
      WHERE is_published = true AND category IS NOT NULL
      GROUP BY category
      ORDER BY count DESC
    `);

    res.json({ categories: result.rows });
  } catch (error) {
    console.error('Categories error:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Purchase prompt
router.post('/purchase/:promptId', authenticateToken, async (req, res) => {
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
      return res.status(400).json({ error: 'Already purchased this prompt' });
    }

    // Get seller's plan to calculate commission
    const sellerResult = await query(
      'SELECT plan FROM users WHERE id = $1',
      [prompt.user_id]
    );

    const commissionRates = {
      free: 0.15,
      basic: 0.15,
      premium: 0.05,
      enterprise: 0
    };

    const sellerPlan = sellerResult.rows[0].plan;
    const commission = parseFloat(prompt.price) * commissionRates[sellerPlan];
    const sellerAmount = parseFloat(prompt.price) - commission;

    // Create purchase record
    const purchaseResult = await query(
      `INSERT INTO purchases (buyer_id, prompt_id, seller_id, amount, commission, status)
       VALUES ($1, $2, $3, $4, $5, 'completed')
       RETURNING *`,
      [buyerId, promptId, prompt.user_id, prompt.price, commission]
    );

    // Update prompt sales count
    await query(
      'UPDATE prompts SET sales_count = sales_count + 1 WHERE id = $1',
      [promptId]
    );

    res.status(201).json({
      message: 'Purchase successful',
      purchase: purchaseResult.rows[0],
      prompt: prompt
    });
  } catch (error) {
    console.error('Purchase error:', error);
    res.status(500).json({ error: 'Purchase failed' });
  }
});

// Get user purchases
router.get('/my-purchases', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const result = await query(`
      SELECT p.*, pr.title, pr.content, pr.category, u.username
      FROM purchases p
      JOIN prompts pr ON p.prompt_id = pr.id
      JOIN users u ON pr.user_id = u.id
      WHERE p.buyer_id = $1
      ORDER BY p.created_at DESC
    `, [userId]);

    res.json({ purchases: result.rows });
  } catch (error) {
    console.error('Get purchases error:', error);
    res.status(500).json({ error: 'Failed to fetch purchases' });
  }
});

// Add review
router.post('/review/:promptId', authenticateToken, async (req, res) => {
  try {
    const { promptId } = req.params;
    const userId = req.user.userId;
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    // Check if user purchased the prompt
    const purchaseCheck = await query(
      'SELECT id FROM purchases WHERE buyer_id = $1 AND prompt_id = $2',
      [userId, promptId]
    );

    if (purchaseCheck.rows.length === 0) {
      return res.status(403).json({ error: 'You must purchase the prompt to review it' });
    }

    // Check if already reviewed
    const existingReview = await query(
      'SELECT id FROM reviews WHERE user_id = $1 AND prompt_id = $2',
      [userId, promptId]
    );

    if (existingReview.rows.length > 0) {
      return res.status(400).json({ error: 'You have already reviewed this prompt' });
    }

    // Create review
    const reviewResult = await query(
      `INSERT INTO reviews (prompt_id, user_id, rating, comment)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [promptId, userId, rating, comment]
    );

    // Update prompt rating
    const ratingUpdate = await query(`
      UPDATE prompts
      SET rating = (SELECT AVG(rating) FROM reviews WHERE prompt_id = $1),
          rating_count = (SELECT COUNT(*) FROM reviews WHERE prompt_id = $1)
      WHERE id = $1
      RETURNING rating, rating_count
    `, [promptId]);

    res.status(201).json({
      message: 'Review added successfully',
      review: reviewResult.rows[0],
      updatedRating: ratingUpdate.rows[0]
    });
  } catch (error) {
    console.error('Review error:', error);
    res.status(500).json({ error: 'Failed to add review' });
  }
});

module.exports = router;
