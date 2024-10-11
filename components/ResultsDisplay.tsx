"use client"

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface Results {
  trends: string[];
  entrepreneurship: string;
  businessPlan: string;
}

export default function ResultsDisplay() {
  const searchParams = useSearchParams();
  const sector = searchParams.get('sector');
  const [results, setResults] = useState<Results | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (sector) {
      setLoading(true);
      setError(null);
      fetchResults(sector);
    }
  }, [sector]);

  const fetchResults = async (sector: string) => {
    try {
      console.log('Fetching results for sector:', sector);
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sector }),
      });
      const responseText = await response.text();
      console.log('Raw API Response:', responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Error parsing API response:', parseError);
        throw new Error('Invalid JSON response from server');
      }

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }
      if (!data.trends || !data.entrepreneurship || !data.businessPlan) {
        console.error('Invalid response structure:', data);
        throw new Error('Invalid response format from server');
      }
      setResults(data);
    } catch (error) {
      console.error('Error fetching results:', error);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center mt-8">Analizando tendencias...</div>;
  if (error) return (
    <Alert variant="destructive" className="mt-8">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  );
  if (!results) return null;

  return (
    <div className="space-y-6 mt-8">
      <Card>
        <CardHeader>
          <CardTitle>Tendencias en el sector {sector}</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-2">
            {results.trends.map((trend, index) => (
              <li key={index}>{trend}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sugerencia de Emprendimiento</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{results.entrepreneurship}</p>
        </CardContent>
      </Card>

      <Accordion type="single" collapsible>
        <AccordionItem value="business-plan">
          <AccordionTrigger>Plan de Negocios</AccordionTrigger>
          <AccordionContent>
            <pre className="whitespace-pre-wrap">{results.businessPlan}</pre>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}