import { Suspense } from 'react';
import ResultsDisplay from '@/components/ResultsDisplay';

export default function ResultsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Resultados del Análisis</h1>
      <Suspense fallback={<div>Cargando resultados...</div>}>
        <ResultsDisplay />
      </Suspense>
    </div>
  );
}