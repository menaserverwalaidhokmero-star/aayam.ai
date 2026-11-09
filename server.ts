import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 3000;

// Increase payload limit for base64 images
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Helper to get GoogleGenAI client
function getGenAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// 1. System Status Endpoint
app.get('/api/status', (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;
  const isKeyConfigured = Boolean(apiKey && apiKey !== 'MY_GEMINI_API_KEY');

  res.json({
    status: 'online',
    isKeyConfigured,
    provider: 'Google GenAI SDK (@google/genai)',
    models: {
      imageGeneration: 'gemini-3.1-flash-lite-image / gemini-nano-banana-2.1',
      imageEditing: 'gemini-3.1-flash-lite-image',
      videoGeneration: 'gemini-omni-1.2-flash',
      imageToVideo: 'gemini-omni-1.2-flash',
    },
    message: isKeyConfigured
      ? 'Live neural synthesis engine connected and ready.'
      : 'API key is not detected in environment. Showcase demo mode available; connect GEMINI_API_KEY in AI Studio Settings > Secrets for real-time cloud generation.',
  });
});

// 2. AI Photo Generator Endpoint
app.post('/api/generate-photo', async (req, res) => {
  try {
    const { prompt, style = 'Cyberpunk Neon', aspectRatio = '1:1', quality = 'standard' } = req.body;

    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return res.status(400).json({ error: 'Text prompt is required for image generation.' });
    }

    const ai = getGenAIClient();
    if (!ai) {
      return res.status(503).json({
        error: 'API_KEY_NOT_CONFIGURED',
        message: 'No GEMINI_API_KEY configured on server. Please configure your API key in Settings > Secrets to enable live generation.',
      });
    }

    // Enhance prompt with selected futuristic artistic style
    const styledPrompt = `${prompt.trim()}, ${style} style, ultra high definition, intricate details, atmospheric lighting, volumetric depth, masterpiece 8k`;

    // Map aspect ratio to valid Gemini API values: "1:1", "3:4", "4:3", "9:16", "16:9"
    const validAspectRatios = ['1:1', '3:4', '4:3', '9:16', '16:9'];
    const chosenAspect = validAspectRatios.includes(aspectRatio) ? aspectRatio : '1:1';

    const modelName = quality === 'ultra' ? 'gemini-nano-banana-2.1' : 'gemini-3.1-flash-lite-image';

    const response = await ai.models.generateContent({
      model: modelName,
      contents: {
        parts: [{ text: styledPrompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: chosenAspect as any,
          ...(modelName === 'gemini-nano-banana-2.1' ? { imageSize: '1K' } : {}),
        },
      },
    });

    let generatedImageUrl = '';
    let responseText = '';

    for (const part of response.candidates?.[0]?.content?.parts ?? []) {
      if (part.inlineData?.data) {
        const mime = part.inlineData.mimeType || 'image/png';
        generatedImageUrl = `data:${mime};base64,${part.inlineData.data}`;
      } else if (part.text) {
        responseText += part.text;
      }
    }

    if (!generatedImageUrl) {
      return res.status(502).json({
        error: 'NO_IMAGE_RETURNED',
        message: responseText || 'The neural model did not return image data for this prompt. Try adjusting the prompt wording.',
      });
    }

    return res.json({
      success: true,
      imageUrl: generatedImageUrl,
      prompt: prompt.trim(),
      style,
      aspectRatio: chosenAspect,
      model: modelName,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error generating photo:', error);
    const errorMessage = error?.message || 'Failed to synthesize photo';
    return res.status(500).json({
      error: 'GENERATION_FAILED',
      message: errorMessage,
    });
  }
});

// Helper to resolve base64 and mimeType from data URL, raw base64, or remote URL
async function resolveImageBase64(input: string, fallbackMime = 'image/png'): Promise<{ base64: string; mimeType: string }> {
  if (input.startsWith('http://') || input.startsWith('https://')) {
    const response = await fetch(input);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const contentType = response.headers.get('content-type') || 'image/jpeg';
    return {
      base64: buffer.toString('base64'),
      mimeType: contentType,
    };
  }

  // Handle data:image/png;base64,... data URLs
  const match = input.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
  if (match) {
    return {
      mimeType: match[1],
      base64: match[2],
    };
  }

  // Strip prefix or treat as raw base64
  const cleanBase64 = input.replace(/^data:image\/[a-z]+;base64,/, '');
  return {
    base64: cleanBase64,
    mimeType: fallbackMime,
  };
}

// 3. AI Photo Editor Endpoint
app.post('/api/edit-photo', async (req, res) => {
  try {
    const { prompt, imageBase64, mimeType = 'image/png' } = req.body;

    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return res.status(400).json({ error: 'Instruction prompt is required for image editing.' });
    }
    if (!imageBase64 || typeof imageBase64 !== 'string') {
      return res.status(400).json({ error: 'Base64 image data is required.' });
    }

    const ai = getGenAIClient();
    if (!ai) {
      return res.status(503).json({
        error: 'API_KEY_NOT_CONFIGURED',
        message: 'No GEMINI_API_KEY configured on server. Please configure your API key in Settings > Secrets to enable live photo editing.',
      });
    }

    const { base64: cleanBase64, mimeType: resolvedMime } = await resolveImageBase64(imageBase64, mimeType);

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType: resolvedMime,
            },
          },
          {
            text: `Edit instruction: ${prompt.trim()}. Retain coherence with high quality photo finish.`,
          },
        ],
      },
    });

    let editedImageUrl = '';
    let responseText = '';

    for (const part of response.candidates?.[0]?.content?.parts ?? []) {
      if (part.inlineData?.data) {
        const mime = part.inlineData.mimeType || 'image/png';
        editedImageUrl = `data:${mime};base64,${part.inlineData.data}`;
      } else if (part.text) {
        responseText += part.text;
      }
    }

    if (!editedImageUrl) {
      return res.status(502).json({
        error: 'NO_IMAGE_RETURNED',
        message: responseText || 'The model did not return an edited image for this request.',
      });
    }

    return res.json({
      success: true,
      imageUrl: editedImageUrl,
      prompt: prompt.trim(),
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error editing photo:', error);
    return res.status(500).json({
      error: 'EDIT_FAILED',
      message: error?.message || 'Failed to edit photo with Gemini.',
    });
  }
});

// 4. AI Video Generator Endpoint (Text to Video)
app.post('/api/generate-video', async (req, res) => {
  try {
    const { prompt, duration = '5s', aspectRatio = '16:9', resolution = '720p' } = req.body;

    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return res.status(400).json({ error: 'Text prompt is required for video synthesis.' });
    }

    const ai = getGenAIClient();
    if (!ai) {
      return res.status(503).json({
        error: 'API_KEY_NOT_CONFIGURED',
        message: 'No GEMINI_API_KEY configured on server. Video generation requires an active Gemini API key with Veo / Omni Flash access.',
      });
    }

    const interaction = await ai.interactions.create({
      model: 'gemini-omni-1.2-flash',
      input: prompt.trim(),
      background: false,
      store: false,
      stream: false,
      response_format: {
        type: 'video',
        aspect_ratio: (aspectRatio === '9:16' ? '9:16' : '16:9') as any,
        duration: (duration === '10s' ? '10s' : '5s') as any,
        resolution: (resolution === '1080p' ? '1080p' : '720p') as any,
      },
    }, { timeout: 300000 });

    const videoPart = interaction.output_video;
    if (videoPart && videoPart.data) {
      const mime = videoPart.mime_type || 'video/mp4';
      return res.json({
        success: true,
        videoUrl: `data:${mime};base64,${videoPart.data}`,
        prompt: prompt.trim(),
        duration,
        aspectRatio,
        timestamp: new Date().toISOString(),
      });
    }

    return res.status(502).json({
      error: 'NO_VIDEO_DATA',
      message: 'Video model did not return video binary data.',
    });
  } catch (error: any) {
    console.error('Error synthesizing video:', error);
    return res.status(500).json({
      error: 'VIDEO_GENERATION_FAILED',
      message: error?.message || 'Video synthesis request could not be completed.',
    });
  }
});

// 5. Image to Video Endpoint
app.post('/api/image-to-video', async (req, res) => {
  try {
    const { imageBase64, motionPrompt, duration = '5s', aspectRatio = '16:9', mimeType = 'image/png' } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'Source frame image is required.' });
    }
    if (!motionPrompt || typeof motionPrompt !== 'string' || !motionPrompt.trim()) {
      return res.status(400).json({ error: 'Motion description prompt is required.' });
    }

    const ai = getGenAIClient();
    if (!ai) {
      return res.status(503).json({
        error: 'API_KEY_NOT_CONFIGURED',
        message: 'No GEMINI_API_KEY configured on server. Image-to-video requires an active Gemini API key with Veo / Omni Flash access.',
      });
    }

    const { base64: cleanBase64, mimeType: resolvedMime } = await resolveImageBase64(imageBase64, mimeType);

    const interaction = await ai.interactions.create({
      model: 'gemini-omni-1.2-flash',
      input: [
        {
          type: 'image',
          mime_type: resolvedMime,
          data: cleanBase64,
        },
        {
          type: 'text',
          text: motionPrompt.trim(),
        },
      ],
      background: false,
      store: false,
      stream: false,
      response_format: {
        type: 'video',
        aspect_ratio: (aspectRatio === '9:16' ? '9:16' : '16:9') as any,
      },
    }, { timeout: 300000 });

    const videoPart = interaction.output_video;
    if (videoPart && videoPart.data) {
      const mime = videoPart.mime_type || 'video/mp4';
      return res.json({
        success: true,
        videoUrl: `data:${mime};base64,${videoPart.data}`,
        prompt: motionPrompt.trim(),
        duration,
        timestamp: new Date().toISOString(),
      });
    }

    return res.status(502).json({
      error: 'NO_VIDEO_DATA',
      message: 'Image-to-video synthesis did not return video binary data.',
    });
  } catch (error: any) {
    console.error('Error generating image to video:', error);
    return res.status(500).json({
      error: 'IMAGE_TO_VIDEO_FAILED',
      message: error?.message || 'Image-to-video request could not be completed.',
    });
  }
});

// Start server with Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(process.cwd(), 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(process.cwd(), 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`[AAYAM AI] Server listening on http://0.0.0.0:${port}`);
  });
}

startServer().catch((err) => {
  console.error('[AAYAM AI] Fatal server startup error:', err);
  process.exit(1);
});
