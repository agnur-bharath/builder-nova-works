// Hugging Face FLUX.1-dev integration for avatar generation
export interface AvatarGenerationParams {
  prompt: string;
  seed?: number;
  randomizeSeed?: boolean;
  width?: number;
  height?: number;
  guidanceScale?: number;
  numInferenceSteps?: number;
}

export class AvatarGenerator {
  private static instance: AvatarGenerator;
  private client: any; // Will be initialized when gradio_client is available

  private constructor() {
    // Singleton pattern
  }

  public static getInstance(): AvatarGenerator {
    if (!AvatarGenerator.instance) {
      AvatarGenerator.instance = new AvatarGenerator();
    }
    return AvatarGenerator.instance;
  }

  async initializeClient() {
    try {
      // Dynamic import when gradio_client is available
      const { Client } = await import('@gradio/client');
      this.client = await Client.connect("black-forest-labs/FLUX.1-dev");
      return true;
    } catch (error) {
      console.error('Failed to initialize Gradio client:', error);
      return false;
    }
  }

  async generateAvatar(params: AvatarGenerationParams): Promise<string | null> {
    if (!this.client) {
      const initialized = await this.initializeClient();
      if (!initialized) {
        throw new Error('Failed to initialize avatar generation client');
      }
    }

    try {
      const result = await this.client.predict('/infer', {
        prompt: params.prompt,
        seed: params.seed || 0,
        randomize_seed: params.randomizeSeed ?? true,
        width: params.width || 1024,
        height: params.height || 1024,
        guidance_scale: params.guidanceScale || 3.5,
        num_inference_steps: params.numInferenceSteps || 28,
      });

      // Extract the generated image URL from the result
      if (result && result.data && result.data[0]) {
        return result.data[0].url || result.data[0];
      }
      return null;
    } catch (error) {
      console.error('Avatar generation failed:', error);
      throw error;
    }
  }

  // Generate avatar based on character description
  async generateCharacterAvatar(description: string): Promise<string | null> {
    const enhancedPrompt = `High-quality digital art portrait of ${description}, 
    fantasy character, detailed face, expressive eyes, professional artwork, 
    8k resolution, trending on artstation`;
    
    return this.generateAvatar({
      prompt: enhancedPrompt,
      randomizeSeed: true,
      width: 512,
      height: 512,
    });
  }
}

export const avatarGenerator = AvatarGenerator.getInstance();
