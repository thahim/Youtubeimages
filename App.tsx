import React, { useState } from 'react';
import type { GeneratedResult, GenerationStatus } from './types';
import { generateImagesFromPrompt } from './services/geminiService';
import PromptForm from './components/PromptForm';
import ResultsDisplay from './components/ResultsDisplay';
import { LogoIcon } from './components/icons';

const App: React.FC = () => {
  const [prompts, setPrompts] = useState<string>('A futuristic cyberpunk city skyline at dusk, with flying cars and neon signs.');
  const [numImages, setNumImages] = useState<number>(1);
  const [results, setResults] = useState<GeneratedResult[]>([]);
  const [status, setStatus] = useState<GenerationStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (status === 'generating-images') return;

    setStatus('generating-images');
    setError(null);
    setResults([]);

    const promptList = prompts.split('\n').filter(p => p.trim() !== '');
    if (promptList.length === 0) {
      setError('Please enter at least one prompt.');
      setStatus('error');
      return;
    }

    try {
      const allNewResults: GeneratedResult[] = [];
      for (const prompt of promptList) {
        const images = await generateImagesFromPrompt(prompt, numImages);
        const promptResults: GeneratedResult[] = images.map((base64Image, index) => ({
          id: `${prompt}-${Date.now()}-${index}`,
          prompt,
          imageUrl: `data:image/jpeg;base64,${base64Image}`,
        }));
        allNewResults.push(...promptResults);
      }
      setResults(allNewResults);
      setStatus('complete');
    } catch (e) {
      console.error('Image generation failed:', e);
      setError(`Image generation failed: ${e instanceof Error ? e.message : String(e)}`);
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
      <main className="container mx-auto p-4 md:p-8">
        <header className="text-center mb-8">
            <div className="flex items-center justify-center gap-4 mb-4">
                <LogoIcon className="h-12 w-12 text-brand-primary" />
                <h1 className="text-4xl md:text-5xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-green-400">
                    Gemini Image Creator
                </h1>
            </div>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                Turn your ideas into stunning visuals. Enter your prompts, choose the number of images, and let Gemini bring them to life.
            </p>
        </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
                <PromptForm
                    prompts={prompts}
                    setPrompts={setPrompts}
                    numImages={numImages}
                    setNumImages={setNumImages}
                    onGenerate={handleGenerate}
                    status={status}
                />
            </div>
            <div className="lg:col-span-2">
                <ResultsDisplay results={results} status={status} error={error} />
            </div>
          </div>
      </main>
    </div>
  );
};

export default App;