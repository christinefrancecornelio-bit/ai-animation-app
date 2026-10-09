import { NextResponse } from 'next/server';
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(req: Request) {
  try {
    const { imageUrl } = await req.json();

    const output: any = await replicate.run(
      "stability-ai/stable-video-diffusion:3f04576731f0a84c2e21245d8208a0d4c062770519ed81e3a473d09a74421b47",
      {
        input: {
          input_image: imageUrl,
          motion_bucket_id: 127,
          frames_per_second: 6,
        }
      }
    );

    const videoUrl = Array.isArray(output) ? output[0] : output;
    return NextResponse.json({ videoUrl });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
