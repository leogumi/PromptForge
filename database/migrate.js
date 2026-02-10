const { pool } = require('../config/database');

const createTables = async () => {
  const client = await pool.connect();
  
  try {
    console.log('🔨 Creating database tables...');

    // Users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        username VARCHAR(100) UNIQUE NOT NULL,
        full_name VARCHAR(255),
        plan VARCHAR(50) DEFAULT 'free',
        prompts_used INTEGER DEFAULT 0,
        stripe_customer_id VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Prompts table
    await client.query(`
      CREATE TABLE IF NOT EXISTS prompts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(500) NOT NULL,
        description TEXT,
        content TEXT NOT NULL,
        category VARCHAR(100),
        ai_model VARCHAR(50),
        variables JSONB,
        price DECIMAL(10, 2) DEFAULT 0.00,
        is_published BOOLEAN DEFAULT false,
        sales_count INTEGER DEFAULT 0,
        rating DECIMAL(3, 2) DEFAULT 0.00,
        rating_count INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Purchases table
    await client.query(`
      CREATE TABLE IF NOT EXISTS purchases (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        buyer_id UUID REFERENCES users(id) ON DELETE CASCADE,
        prompt_id UUID REFERENCES prompts(id) ON DELETE CASCADE,
        seller_id UUID REFERENCES users(id) ON DELETE CASCADE,
        amount DECIMAL(10, 2) NOT NULL,
        commission DECIMAL(10, 2) NOT NULL,
        stripe_payment_id VARCHAR(255),
        mp_payment_id VARCHAR(255),
        status VARCHAR(50) DEFAULT 'completed',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Subscriptions table
    await client.query(`
      CREATE TABLE IF NOT EXISTS subscriptions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        plan VARCHAR(50) NOT NULL,
        status VARCHAR(50) DEFAULT 'active',
        stripe_subscription_id VARCHAR(255),
        mp_payment_id VARCHAR(255),
        amount DECIMAL(10, 2),
        current_period_start TIMESTAMP,
        current_period_end TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Reviews table
    await client.query(`
      CREATE TABLE IF NOT EXISTS reviews (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        prompt_id UUID REFERENCES prompts(id) ON DELETE CASCADE,
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        rating INTEGER CHECK (rating >= 1 AND rating <= 5),
        comment TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Templates table
    await client.query(`
      CREATE TABLE IF NOT EXISTS templates (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        description TEXT,
        category VARCHAR(100),
        content TEXT NOT NULL,
        variables JSONB,
        is_premium BOOLEAN DEFAULT false,
        usage_count INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Analytics table
    await client.query(`
      CREATE TABLE IF NOT EXISTS analytics (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        event_type VARCHAR(100) NOT NULL,
        event_data JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Automation workflows table
    await client.query(`
      CREATE TABLE IF NOT EXISTS automation_workflows (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        platform VARCHAR(50) NOT NULL,
        workflow_data JSONB NOT NULL,
        description TEXT,
        use_case VARCHAR(255),
        is_advanced BOOLEAN DEFAULT false,
        is_published BOOLEAN DEFAULT false,
        downloads_count INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Automation templates table
    await client.query(`
      CREATE TABLE IF NOT EXISTS automation_templates (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        platform VARCHAR(50) NOT NULL,
        category VARCHAR(100),
        description TEXT,
        workflow_data JSONB NOT NULL,
        preview_image_url VARCHAR(500),
        usage_count INTEGER DEFAULT 0,
        is_premium BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create indexes
    await client.query('CREATE INDEX IF NOT EXISTS idx_prompts_user_id ON prompts(user_id);');
    await client.query('CREATE INDEX IF NOT EXISTS idx_prompts_category ON prompts(category);');
    await client.query('CREATE INDEX IF NOT EXISTS idx_prompts_published ON prompts(is_published);');
    await client.query('CREATE INDEX IF NOT EXISTS idx_purchases_buyer_id ON purchases(buyer_id);');
    await client.query('CREATE INDEX IF NOT EXISTS idx_purchases_seller_id ON purchases(seller_id);');
    await client.query('CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);');
    await client.query('CREATE INDEX IF NOT EXISTS idx_automation_workflows_user_id ON automation_workflows(user_id);');
    await client.query('CREATE INDEX IF NOT EXISTS idx_automation_workflows_platform ON automation_workflows(platform);');

    console.log('✅ All tables created successfully!');

    // Insert sample templates
    await client.query(`
      INSERT INTO templates (name, description, category, content, variables, is_premium)
      VALUES 
        ('Generador de Contenido', 'Template para crear contenido de blog optimizado para SEO', 'Marketing', 'Eres un experto en marketing de contenidos...', '["topic", "tone", "length"]'::jsonb, false),
        ('Análisis de Datos', 'Analiza datasets y genera insights visuales', 'Analytics', 'Actúa como un analista de datos experto...', '["data_type", "focus_area"]'::jsonb, false),
        ('Customer Support Bot', 'Responde preguntas de clientes con empatía', 'Support', 'Eres un asistente de soporte al cliente...', '["product", "issue_type"]'::jsonb, false),
        ('Email Marketing', 'Crea campañas de email personalizadas', 'Marketing', 'Crea un email de marketing profesional...', '["audience", "goal", "product"]'::jsonb, true),
        ('Social Media Planner', 'Planifica contenido para redes sociales', 'Marketing', 'Actúa como un estratega de redes sociales...', '["platform", "brand_voice", "frequency"]'::jsonb, true),
        ('Code Documentation', 'Genera documentación técnica clara', 'Development', 'Eres un desarrollador experto en documentación...', '["language", "complexity"]'::jsonb, false)
      ON CONFLICT DO NOTHING;
    `);

    console.log('✅ Sample templates inserted!');

    // Insert automation templates
    await client.query(`
      INSERT INTO automation_templates (name, platform, category, description, workflow_data, is_premium)
      VALUES 
        (
          'Email to CRM with AI Summary',
          'n8n',
          'Sales',
          'Automatically process incoming emails, extract key info with AI, and create CRM entries',
          '{"name":"Email to CRM","nodes":[{"name":"Email Trigger","type":"n8n-nodes-base.emailReadImap","position":[250,300]},{"name":"AI Extract","type":"n8n-nodes-base.openAi","position":[450,300]},{"name":"Create Contact","type":"n8n-nodes-base.hubspot","position":[650,300]}]}'::jsonb,
          false
        ),
        (
          'Social Media Content Generator',
          'make',
          'Marketing',
          'Generate personalized social media posts from blog articles using AI',
          '{"name":"Content Generator","flow":[{"id":1,"module":"rss"},{"id":2,"module":"openai"},{"id":3,"module":"twitter"}]}'::jsonb,
          true
        ),
        (
          'Customer Support AI Assistant',
          'zapier',
          'Support',
          'Route support tickets through AI for smart categorization and responses',
          '{"title":"Support AI","steps":[{"type":"trigger","app":"zendesk"},{"type":"action","app":"openai"},{"type":"action","app":"slack"}]}'::jsonb,
          false
        ),
        (
          'Lead Scoring with AI',
          'n8n',
          'Sales',
          'Analyze leads with AI and score them automatically in your CRM',
          '{"name":"Lead Scoring","nodes":[{"name":"Webhook","type":"n8n-nodes-base.webhook"},{"name":"AI Score","type":"n8n-nodes-base.openAi"},{"name":"Update CRM","type":"n8n-nodes-base.salesforce"}]}'::jsonb,
          true
        ),
        (
          'Invoice Processing Automation',
          'make',
          'Finance',
          'Extract data from invoices using AI and update accounting software',
          '{"name":"Invoice Processing","flow":[{"id":1,"module":"email"},{"id":2,"module":"openai"},{"id":3,"module":"quickbooks"}]}'::jsonb,
          false
        ),
        (
          'Content Moderation Pipeline',
          'zapier',
          'Moderation',
          'AI-powered content moderation for user submissions',
          '{"title":"Moderation","steps":[{"type":"trigger","app":"webhook"},{"type":"action","app":"openai"},{"type":"action","app":"database"}]}'::jsonb,
          true
        )
      ON CONFLICT DO NOTHING;
    `);

    console.log('✅ Automation templates inserted!');

  } catch (error) {
    console.error('❌ Error creating tables:', error);
    throw error;
  } finally {
    client.release();
  }
};

// Run migration
createTables()
  .then(() => {
    console.log('🎉 Database migration completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed to migrate database:', error);
    process.exit(1);
  });
