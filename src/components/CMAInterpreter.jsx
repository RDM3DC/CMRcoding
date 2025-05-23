import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';

const shapeMap = {
  H: { meaning: 'initiate_communication', shape: 'spiral' },
  E: { meaning: 'emit_signal', shape: 'burst', context: 'spiral' },
  L: { meaning: 'loop_connection', shape: 'loop', context: 'burst' },
  O: { meaning: 'output_intent', shape: 'circle', context: 'loop' },
  W: { meaning: 'bind_world', shape: 'anchors' },
  R: { meaning: 'reflect_input', shape: 'mirror', context: 'circle' },
  D: { meaning: 'soft_terminate', shape: 'downcurve', context: 'loop' },
};

const CMAInterpreter = () => {
  const [step, setStep] = useState(0);
  const [input, setInput] = useState('HELLO WORLD');
  const [sequence, setSequence] = useState(() => parseSequence('HELLO WORLD'));

  function parseSequence(input) {
    return input
      .replace(/\s/g, '')
      .toUpperCase()
      .split('')
      .map((char, index, arr) => {
        const info = shapeMap[char] || { meaning: 'unknown', shape: 'circle' };
        const context = index > 0 ? shapeMap[arr[index - 1]]?.shape : null;
      return { letter: char, ...info, context };
    });
  }

  const handleInputChange = (e) => {
    const newInput = e.target.value;
    setInput(newInput);
    setSequence(parseSequence(newInput));
    setStep(0);
  };

  const renderShape = (shape) => {
    switch (shape) {
      case 'spiral':
        return (
          <path
            d="M50,50 Q75,25 100,50 T150,50"
            stroke="blue"
            fill="none"
            strokeWidth="3"
          />
        );
      case 'burst':
        return (
          <circle
            cx="100"
            cy="100"
            r="40"
            stroke="orange"
            strokeWidth="3"
            fill="none"
          />
        );
      case 'loop':
        return (
          <path
            d="M50,100 C75,50 125,150 150,100"
            stroke="green"
            fill="none"
            strokeWidth="3"
          />
        );
      case 'circle':
        return (
          <circle
            cx="100"
            cy="100"
            r="50"
            stroke="purple"
            strokeWidth="3"
            fill="none"
          />
        );
      case 'anchors':
        return (
          <path
            d="M50,80 L100,20 L150,80"
            stroke="teal"
            fill="none"
            strokeWidth="3"
          />
        );
      case 'mirror':
        return (
          <path
            d="M50,100 Q100,50 150,100 Q100,150 50,100"
            stroke="red"
            fill="none"
            strokeWidth="3"
          />
        );
      case 'downcurve':
        return (
          <path
            d="M50,50 Q100,150 150,50"
            stroke="gray"
            fill="none"
            strokeWidth="3"
          />
        );
      default:
        return null;
    }
  };

  const nextStep = () => setStep((prev) => Math.min(prev + 1, sequence.length - 1));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 0));
  const current = sequence[step];

  return (
    <div className="p-4 space-y-4">
      <Input
        value={input}
        onChange={handleInputChange}
        placeholder="Type a CMA word..."
        className="mb-4"
      />
      <Card className="bg-gray-50 shadow-xl rounded-2xl p-4">
        <CardContent className="space-y-2">
          <h2 className="text-xl font-semibold">CMA Interpreter</h2>
          <div className="text-lg">
            Letter: <strong>{current.letter}</strong>
          </div>
          <div className="text-sm text-gray-700">Meaning: {current.meaning}</div>
          <div className="text-sm text-gray-700">Shape: {current.shape}</div>
          {current.context && (
            <div className="text-sm text-gray-700">
              Contextual deformation from: {current.context}
            </div>
          )}
          <motion.svg
            key={step}
            width="200"
            height="200"
            viewBox="0 0 200 200"
            className="mt-4"
            animate={{ scale: [1, 1.05, 1], opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            {renderShape(current.shape)}
          </motion.svg>
        </CardContent>
      </Card>
      <div className="text-sm text-gray-600">
        Context Stack: {sequence.slice(0, step + 1).map((s) => s.shape).join(' → ')}
      </div>
      <div className="flex justify-between">
        <Button onClick={prevStep} disabled={step === 0}>
          Previous
        </Button>
        <Button onClick={nextStep} disabled={step === sequence.length - 1}>
          Next
        </Button>
      </div>
    </div>
  );
};

export default CMAInterpreter;
