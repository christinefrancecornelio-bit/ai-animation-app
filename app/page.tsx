'use client';

import { useState } from 'react';

export default function App() {
  const [panel, setPanel] = useState<1 | 2 | 3>(1);

  // Panel 1 State
  const [setting, setSetting] = useState('');
  const [character, setCharacter] = useState('');
  const [style, setStyle] = useState('3D Pixar Cartoon Style');

  // Panel 2 State
  const [narrationText, setNarrationText] = useState('');

  // Panel 3 State
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [finalVideo, setFinalVideo] = useState<string | null>(null);
  const [loadingImage, setLoadingImage] = useState(false);
  const [loadingVideo, setLoadingVideo] = useState(false);

  // Panel 3 Trigger: Generate Keyframe Image
  const handleGenerateImage = async () => {
    setLoadingImage(true);
    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ setting, character, style }),
      });
      const data = await response.json();
      if (data.imageUrl) {
        setGeneratedImage(data.imageUrl);
      } else {
        alert('Image generation failed: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      alert('Failed to generate keyframe image.');
    } finally {
      setLoadingImage(false);
    }
  };

  // Video Render Trigger
  const handleGenerateVideo = async () => {
    if (!generatedImage) return alert('Please generate an image first.');
    setLoadingVideo(true);
    try {
      const response = await fetch('/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: generatedImage }),
      });
      const data = await response.json();
      if (data.videoUrl) {
        setFinalVideo(data.videoUrl);
      } else {
        alert('Video rendering failed: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      alert('Failed to render video.');
    } finally {
      setLoadingVideo(false);
    }
  };

  return (
    <main style={{ maxWidth: '800px', margin: '30px auto', fontFamily: 'sans-serif', padding: '20px', background: '#fff', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
      <h1 style={{ textAlign: 'center', color: '#111' }}>AI Animation Studio</h1>

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', borderBottom: '2px solid #eee', marginBottom: '25px' }}>
        <button onClick={() => setPanel(1)} style={tabStyle(panel === 1)}>1. Visuals</button>
        <button onClick={() => setPanel(2)} style={tabStyle(panel === 2)}>2. Narration</button>
        <button onClick={() => setPanel(3)} style={tabStyle(panel === 3)}>3. Preview & Render</button>
      </div>

      {/* PANEL 1: VISUALS */}
      {panel === 1 && (
        <section>
          <h2>Panel 1: Visual Setup</h2>
          <label style={labelStyle}>Environment / Setting Description:</label>
          <textarea
            placeholder="e.g. Cyberpunk street at night, glowing neon lights, rain reflections"
            value={setting}
            onChange={(e) => setSetting(e.target.value)}
            style={inputStyle}
            rows={3}
          />

          <label style={labelStyle}>Character Appearance:</label>
          <input
            type="text"
            placeholder="e.g. A futuristic robot wearing a red jacket"
            value={character}
            onChange={(e) => setCharacter(e.target.value)}
            style={inputStyle}
          />

          <label style={labelStyle}>Animation Style:</label>
          <select value={style} onChange={(e) => setStyle(e.target.value)} style={inputStyle}>
            <option value="3D Pixar Cartoon Style">3D Animated Movie Style</option>
            <option value="2D Anime Style">2D Anime Style</option>
            <option value="Claymation Style">Claymation</option>
            <option value="Comic Book Style">Comic / Graphic Novel Style</option>
          </select>

          <button onClick={() => setPanel(2)} style={actionBtnStyle}>Next: Add Narration &rarr;</button>
        </section>
      )}

      {/* PANEL 2: NARRATION */}
      {panel === 2 && (
        <section>
          <h2>Panel 2: Audio & Dialogue Script</h2>
          <label style={labelStyle}>Scene Script or Narration Text:</label>
          <textarea
            placeholder="Type what the narrator or character says in this scene..."
            value={narrationText}
            onChange={(e) => setNarrationText(e.target.value)}
            style={inputStyle}
            rows={4}
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
            <button onClick={() => setPanel(1)} style={secondaryBtnStyle}>&larr; Back to Visuals</button>
            <button onClick={() => { handleGenerateImage(); setPanel(3); }} style={actionBtnStyle}>
              Generate Keyframe Image &rarr;
            </button>
          </div>
        </section>
      )}

      {/* PANEL 3: PREVIEW & RENDER */}
      {panel === 3 && (
        <section>
          <h2>Panel 3: Keyframe Preview & Video Generation</h2>
          
          <div style={{ marginBottom: '20px' }}>
            <h3>Generated Storyboard Frame:</h3>
            {loadingImage && <p>🎨 Generating keyframe visual using AI...</p>}
            {generatedImage && (
              <div>
                <img src={generatedImage} alt="Keyframe Preview" style={{ width: '100%', borderRadius: '8px', maxHeight: '400px', objectFit: 'cover' }} />
                <button onClick={handleGenerateImage} style={{ ...secondaryBtnStyle, marginTop: '10px' }}>
                  🔄 Re-generate Image
                </button>
              </div>
            )}
            {!generatedImage && !loadingImage && (
              <p>No keyframe created yet. Fill out Panel 1 & 2 first.</p>
            )}
          </div>

          {narrationText && (
            <div style={{ padding: '12px', background: '#f0f4f8', borderRadius: '6px', marginBottom: '20px' }}>
              <strong>Attached Script:</strong> "{narrationText}"
            </div>
          )}

          <button
            onClick={handleGenerateVideo}
            disabled={!generatedImage || loadingVideo}
            style={{ ...actionBtnStyle, width: '100%', padding: '14px', fontSize: '16px', opacity: !generatedImage ? 0.5 : 1 }}
          >
            {loadingVideo ? '🎥 Animating Video (Takes 1-2 mins)...' : '🎬 Render Final Video'}
          </button>

          {finalVideo && (
            <div style={{ marginTop: '30px' }}>
              <h3>Your Final Animated Video:</h3>
              <video src={finalVideo} controls style={{ width: '100%', borderRadius: '8px' }} />
            </div>
          )}
        </section>
      )}
    </main>
  );
}

// Inline Styles
const tabStyle = (active: boolean) => ({
  flex: 1,
  padding: '12px',
  cursor: 'pointer',
  border: 'none',
  borderBottom: active ? '3px solid #0070f3' : 'none',
  fontWeight: active ? ('bold' as const) : ('normal' as const),
  color: active ? '#0070f3' : '#666',
  background: 'none',
  fontSize: '15px',
});

const labelStyle = { display: 'block', fontWeight: 'bold' as const, marginBottom: '6px', marginTop: '16px' };
const inputStyle = { width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' as const, fontSize: '14px' };
const actionBtnStyle = { padding: '12px 20px', background: '#0070f3', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', marginTop: '20px', fontWeight: 'bold' as const };
const secondaryBtnStyle = { padding: '12px 20px', background: '#e0e0e0', color: '#333', border: 'none', borderRadius: '6px', cursor: 'pointer', marginTop: '20px' };
