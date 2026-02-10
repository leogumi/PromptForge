const express = require('express');
const { query } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const result = await query(
      `SELECT id, email, username, full_name, plan, prompts_used, created_at
       FROM users WHERE id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: result.rows[0] });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { username, fullName } = req.body;

    const result = await query(
      `UPDATE users 
       SET username = COALESCE($1, username),
           full_name = COALESCE($2, full_name),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $3
       RETURNING id, email, username, full_name, plan`,
      [username, fullName, userId]
    );

    res.json({
      message: 'Profile updated successfully',
      user: result.rows[0]
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Get user analytics/dashboard data
router.get('/analytics', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    // Total revenue
    const revenueResult = await query(
      `SELECT COALESCE(SUM(amount - commission), 0) as total_revenue
       FROM purchases WHERE seller_id = $1`,
      [userId]
    );

    // Total sales
    const salesResult = await query(
      `SELECT COUNT(*) as total_sales FROM purchases WHERE seller_id = $1`,
      [userId]
    );

    // Average rating
    const ratingResult = await query(
      `SELECT COALESCE(AVG(p.rating), 0) as avg_rating
       FROM prompts p WHERE p.user_id = $1 AND p.rating > 0`,
      [userId]
    );

    // Active prompts
    const promptsResult = await query(
      `SELECT COUNT(*) as active_prompts FROM prompts 
       WHERE user_id = $1 AND is_published = true`,
      [userId]
    );

    // Recent sales
    const recentSalesResult = await query(
      `SELECT p.*, pr.title, pr.price, u.username as buyer_username
       FROM purchases p
       JOIN prompts pr ON p.prompt_id = pr.id
       JOIN users u ON p.buyer_id = u.id
       WHERE p.seller_id = $1
       ORDER BY p.created_at DESC
       LIMIT 10`,
      [userId]
    );

    // Monthly revenue chart data
    const monthlyRevenueResult = await query(
      `SELECT 
         DATE_TRUNC('month', created_at) as month,
         SUM(amount - commission) as revenue,
         COUNT(*) as sales
       FROM purchases
       WHERE seller_id = $1 
         AND created_at >= NOW() - INTERVAL '12 months'
       GROUP BY DATE_TRUNC('month', created_at)
       ORDER BY month DESC`,
      [userId]
    );

    res.json({
      summary: {
        totalRevenue: parseFloat(revenueResult.rows[0].total_revenue),
        totalSales: parseInt(salesResult.rows[0].total_sales),
        averageRating: parseFloat(ratingResult.rows[0].avg_rating).toFixed(1),
        activePrompts: parseInt(promptsResult.rows[0].active_prompts)
      },
      recentSales: recentSalesResult.rows,
      monthlyRevenue: monthlyRevenueResult.rows
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// Get user's prompt usage stats
router.get('/usage', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const result = await query(
      `SELECT plan, prompts_used FROM users WHERE id = $1`,
      [userId]
    );

    const user = result.rows[0];
    const limits = {
      free: 5,
      basic: 50,
      premium: -1, // unlimited
      enterprise: -1 // unlimited
    };

    const limit = limits[user.plan];
    const remaining = limit === -1 ? -1 : Math.max(0, limit - user.prompts_used);

    res.json({
      plan: user.plan,
      used: user.prompts_used,
      limit: limit,
      remaining: remaining,
      unlimited: limit === -1
    });
  } catch (error) {
    console.error('Usage error:', error);
    res.status(500).json({ error: 'Failed to fetch usage data' });
  }
});

module.exports = router;
