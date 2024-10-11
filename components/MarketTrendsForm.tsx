"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const sectors = [
  "Tecnología",
  "Salud",
  "Educación",
  "Finanzas",
  "Alimentación",
  "Moda",
  "Turismo",
  "Energía",
  "Transporte",
  "Entretenimiento"
];

export default function MarketTrendsForm() {
  const [sector, setSector] = useState('');
  const [customSector, setCustomSector] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const selectedSector = sector === 'Otro' ? customSector : sector;
    router.push(`/results?sector=${encodeURIComponent(selectedSector)}`);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="sector">Selecciona un sector</Label>
        <Select value={sector} onValueChange={setSector}>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona un sector" />
          </SelectTrigger>
          <SelectContent>
            {sectors.map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
            <SelectItem value="Otro">Otro</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {sector === 'Otro' && (
        <div>
          <Label htmlFor="customSector">Especifica el sector</Label>
          <Input
            id="customSector"
            value={customSector}
            onChange={(e) => setCustomSector(e.target.value)}
            placeholder="Ingresa el sector"
            required
          />
        </div>
      )}
      
      <Button type="submit">Analizar Tendencias</Button>
    </form>
  );
}