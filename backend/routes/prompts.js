const express = require('express');
const { body, validationResult } = require('express-validator');
const { query } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Create prompt
router.post('/', authenticateToken,
  [
    body('title').trim().notEmpty(),
    body('content').trim().notEmpty(),
    body('category').optional().trim(),
    body('aiModel').optional().trim(),
    body('variables').optional().isArray(),
    body('price').optional().isDecimal()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { title, description, content, category, aiModel, variables, price } = req.body;
      const userId = req.user.userId;

      // Check plan limits
      const userResult = await query(
        'SELECT plan, prompts_used FROM users WHERE id = $1',
        [userId]
      );
      
      const user = userResult.rows[0];
      const limits = {
        free: 5,
        basic: 50,
        premium: Infinity,
        enterprise: Infinity
      };

      if (user.prompts_used >= limits[user.plan]) {
        return res.status(403).json({ 
          error: 'Prompt limit reached for your plan',
          plan: user.plan,
          used: user.prompts_used,
          limit: limits[user.plan]
        });
      }

      // Create prompt
      const result = await query(
        `INSERT INTO prompts (user_id, title, description, content, category, ai_model, variables, price)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING *`,
        [userId, title, description, content, category, aiModel, JSON.stringify(variables), price || 0]
      );

      // Update user's prompt count
      await query(
        'UPDATE users SET prompts_used = prompts_used + 1 WHERE id = $1',
        [userId]
      );

      res.status(201).json({
        message: 'Prompt created successfully',
        prompt: result.rows[0]
      });
    } catch (error) {
      console.error('Create prompt error:', error);
      res.status(500).json({ error: 'Failed to create prompt' });
    }
  }
);

// Get user's prompts
router.get('/my-prompts', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const result = await query(
      `SELECT * FROM prompts WHERE user_id = $1 ORDER BY created_at DESC`,
      [userId]
    );

    res.json({ prompts: result.rows });
  } catch (error) {
    console.error('Get prompts error:', error);
    res.status(500).json({ error: 'Failed to fetch prompts' });
  }
});

// Get single prompt
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query(
      `SELECT p.*, u.username, u.full_name 
       FROM prompts p 
       JOIN users u ON p.user_id = u.id 
       WHERE p.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Prompt not found' });
    }

    res.json({ prompt: result.rows[0] });
  } catch (error) {
    console.error('Get prompt error:', error);
    res.status(500).json({ error: 'Failed to fetch prompt' });
  }
});

// Update prompt
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const { title, description, content, category, aiModel, variables, price, isPublished } = req.body;

    // Verify ownership
    const ownerCheck = await query(
      'SELECT user_id FROM prompts WHERE id = $1',
      [id]
    );

    if (ownerCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Prompt not found' });
    }

    if (ownerCheck.rows[0].user_id !== userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const result = await query(
      `UPDATE prompts 
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           content = COALESCE($3, content),
           category = COALESCE($4, category),
           ai_model = COALESCE($5, ai_model),
           variables = COALESCE($6, variables),
           price = COALESCE($7, price),
           is_published = COALESCE($8, is_published),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $9
       RETURNING *`,
      [title, description, content, category, aiModel, 
       variables ? JSON.stringify(variables) : null, price, isPublished, id]
    );

    res.json({
      message: 'Prompt updated successfully',
      prompt: result.rows[0]
    });
  } catch (error) {
    console.error('Update prompt error:', error);
    res.status(500).json({ error: 'Failed to update prompt' });
  }
});

// Delete prompt
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const ownerCheck = await query(
      'SELECT user_id FROM prompts WHERE id = $1',
      [id]
    );

    if (ownerCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Prompt not found' });
    }

    if (ownerCheck.rows[0].user_id !== userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await query('DELETE FROM prompts WHERE id = $1', [id]);

    res.json({ message: 'Prompt deleted successfully' });
  } catch (error) {
    console.error('Delete prompt error:', error);
    res.status(500).json({ error: 'Failed to delete prompt' });
  }
});

module.exports = router;
