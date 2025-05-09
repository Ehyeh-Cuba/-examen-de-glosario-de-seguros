'use client';

import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

export type FlashCardData = {
  term: string;
  definition: string;
};

type FlashCardProps = {
  card: FlashCardData;
  allCards: FlashCardData[];
  resetCount: number;
};

function getRandomOptions(cards: FlashCardData[], correct: FlashCardData, n = 4) {
  const others = cards.filter(c => c.term !== correct.term);
  const shuffled = others.sort(() => 0.5 - Math.random()).slice(0, n - 1);
  const options = [...shuffled, correct].sort(() => 0.5 - Math.random());
  return options;
}

const termMarkdownComponents = {
  strong: (props: any) => <strong style={{ textDecoration: 'underline', textDecorationColor: 'white', fontWeight: 'bold' }}>{props.children}</strong>,
};

export const FlashCard: React.FC<FlashCardProps> = ({ card, allCards, resetCount }) => {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);
  const [showPopup, setShowPopup] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [locked, setLocked] = useState(false);
  const [options, setOptions] = useState<FlashCardData[] | null>(null);
  const [relatedTermIdx, setRelatedTermIdx] = useState<number | null>(null);

  useEffect(() => {
    setShowPopup(false);
    setSelected(null);
    setLocked(false);
    setOptions(null);
    setRelatedTermIdx(null);
  }, [resetCount]);

  const borderColor =
    selected === null
      ? 'border-blue-500'
      : options && selected !== null && options[selected]?.definition === card.definition
      ? 'border-green-500'
      : 'border-red-500';

  const handleOpen = () => {
    setShowPopup(true);
    setSelected(null);
    setLocked(false);
    setOptions(getRandomOptions(allCards, card));
    setRelatedTermIdx(null);
  };

  const handleSelect = (idx: number) => {
    setRelatedTermIdx(idx);
    if (selected === null && !locked) {
      setSelected(idx);
      setLocked(true);
    }
  };

  if (!isClient) return null;

  return (
    <>
      <div
        className={`border-4 ${borderColor} rounded-lg p-6 bg-black text-white shadow-md transition-transform hover:scale-105 cursor-pointer select-none`}
        onClick={handleOpen}
      >
        <h2 className="text-xl font-bold mb-2 text-center">
          <ReactMarkdown components={termMarkdownComponents}>{card.term}</ReactMarkdown>
        </h2>
      </div>
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-black text-2xl"
              onClick={() => setShowPopup(false)}
              aria-label="Cerrar"
            >
              ×
            </button>
            <h3 className="text-lg font-bold mb-4 text-center text-blue-900">
              <ReactMarkdown components={termMarkdownComponents}>{card.term}</ReactMarkdown>
            </h3>
            <div className="flex flex-col gap-3">
              {options && options.map((opt, idx) => (
                <button
                  key={idx}
                  className={`text-left rounded border px-3 py-2 transition-colors
                    ${selected === idx && locked
                      ? opt.definition === card.definition
                        ? 'border-green-500 bg-green-100 text-green-900'
                        : 'border-red-500 bg-red-100 text-red-900'
                      : 'border-blue-300 bg-gray-100 text-black hover:bg-blue-100'}
                  `}
                  onClick={() => handleSelect(idx)}
                >
                  <ReactMarkdown>{opt.definition}</ReactMarkdown>
                </button>
              ))}
            </div>
            {relatedTermIdx !== null && options && (
              <div className="mt-4 p-3 bg-blue-50 rounded text-blue-900 text-center">
                <span className="font-semibold">Término relacionado: </span>
                <ReactMarkdown components={termMarkdownComponents}>
                  {options[relatedTermIdx].term}
                </ReactMarkdown>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}; 