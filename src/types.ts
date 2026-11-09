export type ToolId = 'photo-generator' | 'photo-editor' | 'video-generator' | 'image-to-video' | 'dashboard' | 'home';

export type AspectRatio = '1:1' | '16:9' | '9:16' | '4:3' | '3:4';

export interface GenerationItem {
  id: string;
  tool: 'photo-generator' | 'photo-editor' | 'video-generator' | 'image-to-video';
  title: string;
  prompt: string;
  outputUrl: string;
  sourceImageUrl?: string;
  aspectRatio: string;
  style?: string;
  duration?: string;
  createdAt: string;
  isFavorite?: boolean;
  isRealCloud?: boolean;
}

export interface ApiStatus {
  status: string;
  isKeyConfigured: boolean;
  provider: string;
  models: {
    imageGeneration: string;
    imageEditing: string;
    videoGeneration: string;
    imageToVideo: string;
  };
  message: string;
}

export interface StyleOption {
  id: string;
  name: string;
  description: string;
  badge: string;
  previewUrl: string;
}
