'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Face, CubeColor, createCubeWithCenters, FACES } from '@/lib/cube';

type CubeState = Record<Face, (CubeColor | null)[]>;

interface CubeContextType {
  cube: CubeState;
  selectedColor: CubeColor;
  setSelectedColor: (color: CubeColor) => void;
  setSticker: (face: Face, index: number, color: CubeColor) => void;
  resetCube: () => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  solution: string | null;
  setSolution: (solution: string | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
}

const CubeContext = createContext<CubeContextType | undefined>(undefined);

export function CubeProvider({ children }: { children: ReactNode }) {
  const [cube, setCube] = useState<CubeState>(createCubeWithCenters());
  const [selectedColor, setSelectedColor] = useState<CubeColor>('W');
  const [currentStep, setCurrentStep] = useState(0);
  const [solution, setSolution] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setSticker = (face: Face, index: number, color: CubeColor) => {
    setCube((prev) => {
      const newCube = { ...prev };
      newCube[face] = [...prev[face]];
      newCube[face][index] = color;
      return newCube;
    });
  };

  const resetCube = () => {
    setCube(createCubeWithCenters());
    setSolution(null);
    setError(null);
    setCurrentStep(0);
  };

  return (
    <CubeContext.Provider
      value={{
        cube,
        selectedColor,
        setSelectedColor,
        setSticker,
        resetCube,
        currentStep,
        setCurrentStep,
        solution,
        setSolution,
        isLoading,
        setIsLoading,
        error,
        setError,
      }}
    >
      {children}
    </CubeContext.Provider>
  );
}

export function useCube() {
  const context = useContext(CubeContext);
  if (context === undefined) {
    throw new Error('useCube must be used within a CubeProvider');
  }
  return context;
}
