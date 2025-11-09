export type GenerationStatus = 'idle' | 'generating-images' | 'complete' | 'error';

export interface GeneratedResult {
  id: string;
  prompt: string;
  imageUrl: string;
}