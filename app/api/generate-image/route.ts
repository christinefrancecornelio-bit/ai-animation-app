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

    const { setting, character, style } = await req.json();

    const replicate = new Replicate({ auth: token });

    const fullPrompt = `${style || '3D Animated Style'}, ${character || 'character'} in ${setting || 'scenery'}. High detail keyframe illustration.`;

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

    // Extract image URL safely across array, object, or FileOutput types
    let imageUrl = '';
    if (Array.isArray(output)) {
      imageUrl = typeof output[0] === 'string' ? output[0] : output[0]?.url ? output[0].url() : String(output[0]);
    } else if (typeof output === 'string') {
      imageUrl = output;
    } else if (output?.url) {
      imageUrl = output.url();
    } else {
      imageUrl = String(output);
    }

    return NextResponse.json({ imageUrl });
  } catch (error: any) {
    console.error('Image Generation Error:', error);
    return NextResponse.json({ error: error.message || 'Image generation failed.' }, { status: 500 });
  }
}
