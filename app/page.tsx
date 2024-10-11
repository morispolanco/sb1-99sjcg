import MarketTrendsForm from '@/components/MarketTrendsForm';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Tendencias de Mercado y Sugerencias de Emprendimiento</h1>
      <MarketTrendsForm />
    </div>
  );
}