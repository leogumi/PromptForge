const express = require('express');
const axios = require('axios');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Generate prompt using AI
router.post('/generate', authenticateToken, async (req, res) => {
  try {
    const { title, category, aiModel, goal, variables } = req.body;

    if (!goal) {
      return res.status(400).json({ error: 'Goal is required' });
    }

    // Model-specific optimizations
    const modelOptimizations = {
      // Text/Chat models
      'ChatGPT / GPT-4': 'Use clear instructions, markdown formatting, and step-by-step reasoning.',
      'Claude (Anthropic)': 'Use XML tags for structure, be conversational, provide examples.',
      'Gemini (Google)': 'Be concise, use natural language, leverage multimodal capabilities.',
      'Grok (xAI)': 'Be direct and witty, embrace humor, reference current events.',
      'LLaMA (Meta)': 'Use clear instructions, format with markdown, be explicit about output format.',
      'Mistral AI': 'Be concise and efficient, use French when appropriate, technical precision.',
      'Perplexity AI': 'Include sources, be factual, use citations.',
      
      // Image generation models
      'DALL-E (OpenAI)': 'Describe style, composition, lighting, colors in detail. Use photography terms.',
      'Midjourney': 'Use --parameters, descriptive style words, aspect ratios, version flags.',
      'Leonardo.AI': 'Specify art style, quality settings, negative prompts, alchemy settings.',
      'Stable Diffusion': 'Use weighted prompts (word:1.5), negative prompts, sampling steps.',
      'Ideogram': 'Focus on text generation in images, specify fonts and placement.',
      'Adobe Firefly': 'Describe commercial-safe images, style references, color palettes.',
      'Playground AI': 'Use detailed descriptions, style modifiers, quality parameters.',
      
      // Video models
      'Runway Gen-2': 'Describe motion, camera movement, scene progression, duration.',
      'Pika Labs': 'Specify camera motion, scene dynamics, aspect ratio, motion strength.',
      'Synthesia': 'Define avatar, script, background, gestures, language.',
      
      // Audio/Music models
      'ElevenLabs': 'Describe voice characteristics, emotion, pacing, pronunciation.',
      'Suno AI': 'Specify genre, mood, instruments, tempo, lyrics structure.',
      'Mubert': 'Define mood, genre, intensity, duration, use case.',
      
      // Code models
      'GitHub Copilot': 'Provide context, describe desired functionality, include examples.',
      'Cursor AI': 'Be specific about code changes, reference files, describe architecture.',
      'Replit AI': 'Describe the app functionality, tech stack, deployment requirements.',
      
      // Universal
      'Universal (Cualquier IA)': 'Use clear, platform-agnostic instructions that work everywhere.'
    };

    const optimization = modelOptimizations[aiModel] || modelOptimizations['Universal (Cualquier IA)'];

    // Build the prompt for the AI
    const systemPrompt = `You are an expert prompt engineer specializing in ${aiModel || 'all AI platforms'}. 

Create a highly effective, professional prompt based on these requirements:

Title: ${title || 'Untitled'}
Category: ${category || 'General'}
Target AI Model: ${aiModel || 'Universal'}
Goal: ${goal}
${variables && variables.length > 0 ? `Variables: ${variables.join(', ')}` : ''}

Model-specific optimization: ${optimization}

Create a complete, production-ready prompt that:
1. Is optimized specifically for ${aiModel || 'universal use'}
2. Follows best practices for this AI platform
3. Includes necessary context and structure
4. Uses the appropriate formatting and syntax
5. Incorporates variables as placeholders if provided

Return ONLY the generated prompt text, no explanations.`;

    let generatedPrompt;

    // Use OpenAI API (you can switch to Anthropic/Claude API)
    if (process.env.OPENAI_API_KEY) {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4',
          messages: [
            { role: 'system', content: 'You are an expert prompt engineer for all AI platforms.' },
            { role: 'user', content: systemPrompt }
          ],
          temperature: 0.7,
          max_tokens: 1500
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      generatedPrompt = response.data.choices[0].message.content;
    } 
    // Fallback to Anthropic Claude API
    else if (process.env.ANTHROPIC_API_KEY) {
      const response = await axios.post(
        'https://api.anthropic.com/v1/messages',
        {
          model: 'claude-3-sonnet-20240229',
          max_tokens: 1500,
          messages: [
            { role: 'user', content: systemPrompt }
          ]
        },
        {
          headers: {
            'x-api-key': process.env.ANTHROPIC_API_KEY,
            'anthropic-version': '2023-06-01',
            'Content-Type': 'application/json'
          }
        }
      );

      generatedPrompt = response.data.content[0].text;
    }
    // Demo mode - generate platform-specific template prompt
    else {
      generatedPrompt = generateTemplatePrompt(aiModel, category, goal, variables);
    }

    res.json({
      success: true,
      prompt: generatedPrompt,
      metadata: {
        title,
        category,
        aiModel,
        variables,
        optimization
      }
    });

  } catch (error) {
    console.error('AI generation error:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Failed to generate prompt',
      details: error.response?.data?.error?.message || error.message
    });
  }
});

// Helper function to generate template prompts when no AI API is available
function generateTemplatePrompt(aiModel, category, goal, variables) {
  const modelType = getModelType(aiModel);
  
  let template = '';
  
  switch(modelType) {
    case 'image':
      template = `${goal}

Style: [Specify art style - realistic, anime, oil painting, etc.]
Composition: [Describe framing, perspective, focal point]
Lighting: [Describe lighting - soft, dramatic, golden hour, etc.]
Colors: [Specify color palette - vibrant, muted, monochrome, etc.]
Details: [Additional specific elements to include]

${variables?.length > 0 ? `Variables:\n${variables.map(v => `{${v}}: [Specify ${v}]`).join('\n')}` : ''}

Negative prompt: [Things to avoid in the image]`;
      break;
      
    case 'video':
      template = `${goal}

Scene: [Describe the main scene]
Camera: [Camera movement - pan, zoom, static, tracking shot]
Motion: [Describe movement and dynamics]
Duration: [Specify length - 3s, 5s, etc.]
Style: [Visual style - cinematic, documentary, artistic]

${variables?.length > 0 ? `Variables:\n${variables.map(v => `{${v}}: [Specify ${v}]`).join('\n')}` : ''}`;
      break;
      
    case 'audio':
      template = `${goal}

Voice/Sound: [Describe characteristics - warm, energetic, professional]
Emotion: [Tone and feeling - calm, excited, serious]
Pacing: [Speed - slow, moderate, fast]
Style: [Genre or style specifics]

${variables?.length > 0 ? `Variables:\n${variables.map(v => `{${v}}: [Specify ${v}]`).join('\n')}` : ''}`;
      break;
      
    case 'code':
      template = `${goal}

Context: [Describe the codebase or project context]
Requirements:
- [Specific functionality needed]
- [Technical constraints]
- [Performance requirements]

Tech Stack: [Languages, frameworks, libraries]
Output Format: [Code structure, comments, tests]

${variables?.length > 0 ? `Variables:\n${variables.map(v => `{${v}}: [Specify ${v}]`).join('\n')}` : ''}`;
      break;
      
    default: // text/chat
      template = `You are an expert in ${category?.toLowerCase() || 'the requested field'}. ${goal}

Context:
- Target AI Model: ${aiModel || 'Universal'}
- Category: ${category || 'General'}
${variables?.length > 0 ? `- Variables: ${variables.join(', ')}` : ''}

Instructions:
1. Understand the request thoroughly
2. Provide a structured and detailed response
3. Use examples when helpful
4. Maintain a professional yet accessible tone
5. Follow best practices for ${aiModel || 'AI interactions'}

${variables?.length > 0 ? `Variables to customize:\n${variables.map(v => `{${v}}: [Specify ${v} here]`).join('\n')}` : ''}

Expected Output:
Deliver a comprehensive response optimized for ${aiModel || 'the target AI model'}.`;
  }
  
  return template;
}

// Determine model type from model name
function getModelType(aiModel) {
  const imageModels = ['DALL-E', 'Midjourney', 'Leonardo', 'Stable Diffusion', 'Ideogram', 'Firefly', 'Playground'];
  const videoModels = ['Runway', 'Pika', 'Synthesia'];
  const audioModels = ['ElevenLabs', 'Suno', 'Mubert'];
  const codeModels = ['Copilot', 'Cursor', 'Replit'];
  
  if (imageModels.some(m => aiModel?.includes(m))) return 'image';
  if (videoModels.some(m => aiModel?.includes(m))) return 'video';
  if (audioModels.some(m => aiModel?.includes(m))) return 'audio';
  if (codeModels.some(m => aiModel?.includes(m))) return 'code';
  
  return 'text';
}

// Optimize existing prompt
router.post('/optimize', authenticateToken, async (req, res) => {
  try {
    const { prompt, targetModel } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const optimizationRequest = `Analyze and optimize this prompt for better performance on ${targetModel || 'AI models'}:

Original Prompt:
${prompt}

Provide an optimized version that:
1. Is more clear and specific
2. Has better structure
3. Includes relevant context
4. Uses effective formatting
5. Follows best practices

Return ONLY the optimized prompt, no explanations.`;

    // Similar API call logic as above
    let optimizedPrompt = prompt; // Fallback to original

    if (process.env.OPENAI_API_KEY) {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4',
          messages: [
            { role: 'system', content: 'You are an expert prompt engineer specializing in optimization.' },
            { role: 'user', content: optimizationRequest }
          ],
          temperature: 0.7,
          max_tokens: 1500
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      optimizedPrompt = response.data.choices[0].message.content;
    }

    res.json({
      success: true,
      original: prompt,
      optimized: optimizedPrompt
    });

  } catch (error) {
    console.error('Optimization error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to optimize prompt' });
  }
});

module.exports = router;
