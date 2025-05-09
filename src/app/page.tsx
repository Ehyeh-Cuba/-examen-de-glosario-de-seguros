'use client';

import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import dynamic from 'next/dynamic';
import type { FlashCardData } from './FlashCard';

const FlashCard = dynamic<{ card: FlashCardData; allCards: FlashCardData[]; resetCount: number }>(
  () => import('./FlashCard').then(mod => mod.FlashCard),
  { ssr: false }
);

type FlashCard = {
  term: string;
  definition: string;
};

export default function Home() {
  const [flashcards, setFlashcards] = useState<FlashCard[] | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [resetCount, setResetCount] = useState(0);

  useEffect(() => {
    setIsClient(true);
    fetch('/glossary.json')
      .then((res) => res.json())
      .then((data) => setFlashcards(data));
  }, []);

  if (!isClient || !flashcards) {
    return null;
  }

  return (
    <main className="min-h-screen flex flex-col items-center bg-white py-8">
      <h1 className="text-3xl font-bold mb-8 text-blue-900">Examen fácil de seguros</h1>
      <button
        className="mb-6 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 font-semibold"
        onClick={() => setResetCount((c) => c + 1)}
      >
        Reset
      </button>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-6xl px-4">
        {isClient && flashcards.map((card, idx) => (
          <FlashCard key={idx} card={card as FlashCardData} allCards={flashcards as FlashCardData[]} resetCount={resetCount} />
        ))}
      </div>
    </main>
  );
}
