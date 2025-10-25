import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        const healthChecks = {
            timestamp: new Date().toISOString(),
            session: {
                authenticated: !!session,
                user: session?.user ? {
                    id: session.user.id,
                    email: session.user.email,
                    role: (session.user as any)?.role
                } : null
            },
            endpoints: {}
        };

        // Test each API endpoint
        const endpoints = [
            { name: 'users', url: '/api/users?limit=1' },
            { name: 'communities', url: '/api/communities' },
            { name: 'events', url: '/api/events' },
            { name: 'tnp', url: '/api/tnp' },
            { name: 'study', url: '/api/study' }
        ];

        for (const endpoint of endpoints) {
            try {
                const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
                const response = await fetch(`${baseUrl}${endpoint.url}`, {
                    headers: {
                        'Cookie': `next-auth.session-token=${session ? 'valid' : 'invalid'}`
                    }
                });

                (healthChecks.endpoints as any)[endpoint.name] = {
                    status: response.status,
                    ok: response.ok,
                    statusText: response.statusText
                };
            } catch (error) {
                (healthChecks.endpoints as any)[endpoint.name] = {
                    status: 'error',
                    ok: false,
                    error: error instanceof Error ? error.message : 'Unknown error'
                };
            }
        }

        return NextResponse.json(healthChecks);

    } catch (error: any) {
        console.error('Health check error:', error);
        return NextResponse.json(
            {
                error: error.message || 'Health check failed',
                timestamp: new Date().toISOString()
            },
            { status: 500 }
        );
    }
}