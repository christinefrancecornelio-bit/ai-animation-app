import { NextResponse } from 'next/server';
import Replicate from 'replicate';

export async function POST(req: Request) {
  try {
    const token = process.env.REPLICATE_API_TOKEN;
    if (!token) {
      return NextResponse.json(
        { error: 'REPLICATE_API_TOKEN environment variable is missing.' },
        { status: 500 }
      );
    }

    const { imageUrl } = await req.json();

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'imageUrl parameter is required.' },
        { status: 400 }
      );
    }

    const replicate = new Replicate({ auth: token });

    const output: any = await replicate.run(
      "stability-ai/stable-video-diffusion:3f04576731f0a84c2e21245d8208a0d4c062770519ed81e3a473d09a74421b47",
      {
        input: {
          input_image: imageUrl,
          motion_bucket_id: 127,
          cond_aug: 0.02
        }
      }
    );

    // Extract video URL safely across array, object, or FileOutput types
    let videoUrl = '';
    if (Array.isArray(output)) {
      videoUrl = typeof output[0] === 'string' ? output[0] : output[0]?.url ? output[0].url() : String(output[0]);
    } else if (typeof output === 'string') {
      videoUrl = output;
    } else if (output?.url) {
      videoUrl = output.url();
    } else {
      videoUrl = String(output);
    }

    return NextResponse.json({ videoUrl });
  } catch (error: any) {
    console.error('Video Generation Error:', error);
    return NextResponse.json({ error: error.message || 'Video generation failed.' }, { status: 500 });
  }
}
