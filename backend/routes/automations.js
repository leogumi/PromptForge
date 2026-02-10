const express = require('express');
const { query } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Generate n8n workflow
router.post('/generate-n8n', authenticateToken, async (req, res) => {
  try {
    const { description, triggers, actions, useCase } = req.body;

    const workflow = {
      name: req.body.name || "Generated Workflow",
      nodes: [],
      connections: {}
    };

    // Add trigger node
    const triggerNode = {
      parameters: {},
      name: "Trigger",
      type: triggers || "webhook",
      typeVersion: 1,
      position: [250, 300]
    };
    workflow.nodes.push(triggerNode);

    // Add AI processing node
    const aiNode = {
      parameters: {
        model: "gpt-4",
        prompt: `${description}\n\nContext: {{$json["body"]}}`,
        temperature: 0.7
      },
      name: "AI Processing",
      type: "n8n-nodes-base.openAi",
      typeVersion: 1,
      position: [450, 300]
    };
    workflow.nodes.push(aiNode);

    // Add action node based on use case
    const actionNode = {
      parameters: {},
      name: "Action",
      type: actions || "webhook",
      typeVersion: 1,
      position: [650, 300]
    };
    workflow.nodes.push(actionNode);

    // Connect nodes
    workflow.connections = {
      "Trigger": {
        main: [[{ node: "AI Processing", type: "main", index: 0 }]]
      },
      "AI Processing": {
        main: [[{ node: "Action", type: "main", index: 0 }]]
      }
    };

    // Save workflow to database
    const result = await query(
      `INSERT INTO automation_workflows (user_id, name, platform, workflow_data, description, use_case)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [req.user.userId, workflow.name, 'n8n', JSON.stringify(workflow), description, useCase]
    );

    res.json({
      success: true,
      workflow: workflow,
      id: result.rows[0].id,
      downloadUrl: `/api/automations/download/${result.rows[0].id}`,
      instructions: {
        step1: "Copy the workflow JSON below",
        step2: "Open n8n and go to Workflows",
        step3: "Click 'Import from JSON'",
        step4: "Paste the workflow and activate"
      }
    });
  } catch (error) {
    console.error('n8n generation error:', error);
    res.status(500).json({ error: 'Failed to generate n8n workflow' });
  }
});

// Generate Make (Integromat) scenario
router.post('/generate-make', authenticateToken, async (req, res) => {
  try {
    const { description, trigger, actions, useCase } = req.body;

    const scenario = {
      name: req.body.name || "Generated Scenario",
      flow: [
        {
          id: 1,
          module: trigger || "webhook",
          mapper: {},
          metadata: { designer: { x: 0, y: 0 } }
        },
        {
          id: 2,
          module: "openai",
          mapper: {
            prompt: description,
            model: "gpt-4"
          },
          metadata: { designer: { x: 300, y: 0 } }
        },
        {
          id: 3,
          module: actions || "webhook",
          mapper: {},
          metadata: { designer: { x: 600, y: 0 } }
        }
      ],
      connections: [
        { from: 1, to: 2 },
        { from: 2, to: 3 }
      ]
    };

    const result = await query(
      `INSERT INTO automation_workflows (user_id, name, platform, workflow_data, description, use_case)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [req.user.userId, scenario.name, 'make', JSON.stringify(scenario), description, useCase]
    );

    res.json({
      success: true,
      scenario: scenario,
      id: result.rows[0].id,
      instructions: {
        step1: "Go to Make.com and create a new scenario",
        step2: "Add modules manually following this structure",
        step3: "Configure each module with the provided settings",
        step4: "Activate the scenario"
      }
    });
  } catch (error) {
    console.error('Make generation error:', error);
    res.status(500).json({ error: 'Failed to generate Make scenario' });
  }
});

// Generate Zapier Zap template
router.post('/generate-zapier', authenticateToken, async (req, res) => {
  try {
    const { description, trigger, actions, useCase } = req.body;

    const zap = {
      title: req.body.name || "Generated Zap",
      steps: [
        {
          type: "trigger",
          app: trigger || "webhook",
          event: "catch_hook",
          fields: {}
        },
        {
          type: "action",
          app: "openai",
          event: "create_completion",
          fields: {
            prompt: description,
            model: "gpt-4",
            temperature: "0.7"
          }
        },
        {
          type: "action",
          app: actions || "webhook",
          event: "post",
          fields: {}
        }
      ]
    };

    const result = await query(
      `INSERT INTO automation_workflows (user_id, name, platform, workflow_data, description, use_case)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [req.user.userId, zap.title, 'zapier', JSON.stringify(zap), description, useCase]
    );

    res.json({
      success: true,
      zap: zap,
      id: result.rows[0].id,
      instructions: {
        step1: "Go to Zapier.com and create a new Zap",
        step2: "Configure the trigger as specified",
        step3: "Add OpenAI action with the prompt",
        step4: "Add final action and test the Zap"
      }
    });
  } catch (error) {
    console.error('Zapier generation error:', error);
    res.status(500).json({ error: 'Failed to generate Zapier zap' });
  }
});

// Generate complex AI automation with multiple steps
router.post('/generate-advanced', authenticateToken, async (req, res) => {
  try {
    const { 
      platform, 
      description, 
      steps, 
      aiOperations,
      integrations,
      useCase 
    } = req.body;

    let workflow;

    switch(platform) {
      case 'n8n':
        workflow = generateAdvancedN8n(description, steps, aiOperations, integrations);
        break;
      case 'make':
        workflow = generateAdvancedMake(description, steps, aiOperations, integrations);
        break;
      case 'zapier':
        workflow = generateAdvancedZapier(description, steps, aiOperations, integrations);
        break;
      default:
        return res.status(400).json({ error: 'Invalid platform' });
    }

    const result = await query(
      `INSERT INTO automation_workflows (user_id, name, platform, workflow_data, description, use_case, is_advanced)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [req.user.userId, req.body.name, platform, JSON.stringify(workflow), description, useCase, true]
    );

    res.json({
      success: true,
      workflow: workflow,
      id: result.rows[0].id,
      downloadUrl: `/api/automations/download/${result.rows[0].id}`,
      documentation: generateDocumentation(platform, workflow)
    });
  } catch (error) {
    console.error('Advanced workflow generation error:', error);
    res.status(500).json({ error: 'Failed to generate advanced workflow' });
  }
});

// Get user's workflows
router.get('/my-workflows', authenticateToken, async (req, res) => {
  try {
    const { platform } = req.query;
    
    let queryText = 'SELECT * FROM automation_workflows WHERE user_id = $1';
    const params = [req.user.userId];

    if (platform) {
      queryText += ' AND platform = $2';
      params.push(platform);
    }

    queryText += ' ORDER BY created_at DESC';

    const result = await query(queryText, params);

    res.json({ workflows: result.rows });
  } catch (error) {
    console.error('Get workflows error:', error);
    res.status(500).json({ error: 'Failed to fetch workflows' });
  }
});

// Download workflow
router.get('/download/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      'SELECT * FROM automation_workflows WHERE id = $1 AND user_id = $2',
      [id, req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Workflow not found' });
    }

    const workflow = result.rows[0];
    
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="${workflow.name}.json"`);
    res.send(workflow.workflow_data);
  } catch (error) {
    console.error('Download workflow error:', error);
    res.status(500).json({ error: 'Failed to download workflow' });
  }
});

// Get workflow templates
router.get('/templates', async (req, res) => {
  try {
    const { platform, category } = req.query;

    let queryText = 'SELECT * FROM automation_templates WHERE 1=1';
    const params = [];
    let paramCount = 0;

    if (platform) {
      paramCount++;
      queryText += ` AND platform = $${paramCount}`;
      params.push(platform);
    }

    if (category) {
      paramCount++;
      queryText += ` AND category = $${paramCount}`;
      params.push(category);
    }

    queryText += ' ORDER BY usage_count DESC';

    const result = await query(queryText, params);

    res.json({ templates: result.rows });
  } catch (error) {
    console.error('Get templates error:', error);
    res.status(500).json({ error: 'Failed to fetch templates' });
  }
});

// Helper functions for advanced workflow generation
function generateAdvancedN8n(description, steps, aiOperations, integrations) {
  const workflow = {
    name: "Advanced AI Workflow",
    nodes: [],
    connections: {}
  };

  let xPos = 250;
  const yPos = 300;

  steps.forEach((step, index) => {
    const node = {
      parameters: step.parameters || {},
      name: step.name || `Step ${index + 1}`,
      type: step.type,
      typeVersion: 1,
      position: [xPos, yPos]
    };

    // Add AI prompts to nodes that need them
    if (aiOperations && aiOperations[step.name]) {
      node.parameters.prompt = aiOperations[step.name];
    }

    workflow.nodes.push(node);
    xPos += 200;
  });

  // Create connections
  for (let i = 0; i < workflow.nodes.length - 1; i++) {
    const currentNode = workflow.nodes[i].name;
    const nextNode = workflow.nodes[i + 1].name;
    
    workflow.connections[currentNode] = {
      main: [[{ node: nextNode, type: "main", index: 0 }]]
    };
  }

  return workflow;
}

function generateAdvancedMake(description, steps, aiOperations, integrations) {
  const scenario = {
    name: "Advanced AI Scenario",
    flow: [],
    connections: []
  };

  steps.forEach((step, index) => {
    scenario.flow.push({
      id: index + 1,
      module: step.type,
      mapper: {
        ...step.parameters,
        ...(aiOperations && aiOperations[step.name] ? { prompt: aiOperations[step.name] } : {})
      },
      metadata: { designer: { x: index * 300, y: 0 } }
    });

    if (index > 0) {
      scenario.connections.push({ from: index, to: index + 1 });
    }
  });

  return scenario;
}

function generateAdvancedZapier(description, steps, aiOperations, integrations) {
  const zap = {
    title: "Advanced AI Zap",
    steps: []
  };

  steps.forEach((step, index) => {
    zap.steps.push({
      type: index === 0 ? "trigger" : "action",
      app: step.app || step.type,
      event: step.event || "default",
      fields: {
        ...step.parameters,
        ...(aiOperations && aiOperations[step.name] ? { prompt: aiOperations[step.name] } : {})
      }
    });
  });

  return zap;
}

function generateDocumentation(platform, workflow) {
  return {
    overview: `This ${platform} workflow automates complex AI operations`,
    setup: [
      "Import the workflow JSON",
      "Configure API keys and credentials",
      "Test each step individually",
      "Activate the workflow"
    ],
    notes: "Make sure to configure all AI prompts according to your use case",
    troubleshooting: {
      "Connection errors": "Check API credentials",
      "AI errors": "Verify prompt format and model availability",
      "Timeout issues": "Consider adding delays between steps"
    }
  };
}

module.exports = router;
