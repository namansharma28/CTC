import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  
  const endpoints = [
    '/api/events/feed?page=1&limit=5',
    '/api/events/upcoming?limit=4',
    '/api/study',
    '/api/tnp',
    '/api/communities/trending'
  ];

  const results = [];

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(`${baseUrl}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      results.push({
        endpoint,
        status: response.status,
        ok: response.ok,
        statusText: response.statusText,
        error: null
      });
    } catch (error) {
      results.push({
        endpoint,
        status: 'error',
        ok: false,
        statusText: 'Failed to fetch',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    results,
    summary: {
      total: endpoints.length,
      working: results.filter(r => r.ok).length,
      failing: results.filter(r => !r.ok).length
    }
  });
}