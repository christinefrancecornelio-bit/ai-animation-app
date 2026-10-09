import { NextResponse } from 'next/server';
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(req: Request) {
  try {
    const { setting, character, style } = await req.json();

    const fullPrompt = `${style}, ${character} in ${setting}. High detail animation keyframe, cinematic lighting.`;

    const output: any = await replicate.run(
      "black-forest-labs/flux-schnell",
      {
        input: {
          prompt: fullPrompt,
          aspect_ratio: "16:9",
          output_format: "png"
        }
      }
    );

    const imageUrl = Array.isArray(output) ? output[0] : output;
    return NextResponse.json({ imageUrl });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
