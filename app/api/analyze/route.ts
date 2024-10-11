import { NextResponse } from 'next/server';

const API_KEY = process.env.TOGETHER_API_KEY;

export async function POST(req: Request) {
  if (!API_KEY) {
    console.error('API key not configured');
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
  }

  const { sector } = await req.json();

  const prompt = `Analiza las tendencias actuales en el sector "${sector}". Proporciona:
1. Una lista de 3 a 5 tendencias principales.
2. Una sugerencia de emprendimiento basada en estas tendencias.
3. Un breve plan de negocios para este emprendimiento.

Formato de respuesta:
{
  "trends": ["tendencia 1", "tendencia 2", "tendencia 3"],
  "entrepreneurship": "Descripción del emprendimiento sugerido",
  "businessPlan": "Plan de negocios detallado"
}`;

  try {
    console.log('Sending request to Together API with sector:', sector);
    const response = await fetch("https://api.together.xyz/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 2512,
        temperature: 0.7,
        top_p: 0.7,
        top_k: 50,
        repetition_penalty: 1,
        stop: ["<|eot_id|>"]
      })
    });

    const responseText = await response.text();
    console.log('Raw API Response:', responseText);

    if (!response.ok) {
      console.error(`API request failed with status ${response.status}:`, responseText);
      throw new Error(`API request failed with status ${response.status}`);
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Error parsing API response:', parseError);
      throw new Error('Invalid JSON response from API');
    }

    const resultContent = data.choices[0].message.content;
    console.log('Parsed API Response Content:', resultContent);

    let result;
    try {
      result = JSON.parse(resultContent);
    } catch (parseError) {
      console.error('Error parsing API response content:', parseError);
      throw new Error('Invalid response format from API');
    }

    console.log('Final parsed result:', result);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Internal Server Error' }, { status: 500 });
  }
}