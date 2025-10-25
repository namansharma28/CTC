"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw, CheckCircle, XCircle, AlertCircle } from "lucide-react";

interface HealthCheck {
  timestamp: string;
  session: {
    authenticated: boolean;
    user: {
      id: string;
      email: string;
      role: string;
    } | null;
  };
  endpoints: {
    [key: string]: {
      status: number | string;
      ok: boolean;
      statusText?: string;
      error?: string;
    };
  };
}

export default function ApiStatus() {
  const [healthData, setHealthData] = useState<HealthCheck | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchHealthCheck = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/debug/health-check');
      if (response.ok) {
        const data = await response.json();
        setHealthData(data);
      }
    } catch (error) {
      console.error('Failed to fetch health check:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHealthCheck();
  }, []);

  const getStatusIcon = (endpoint: any) => {
    if (endpoint.ok) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    } else if (endpoint.status === 401 || endpoint.status === 403) {
      return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    } else {
      return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusBadge = (endpoint: any) => {
    if (endpoint.ok) {
      return <Badge className="bg-green-500">OK</Badge>;
    } else if (endpoint.status === 401) {
      return <Badge variant="destructive">Unauthorized</Badge>;
    } else if (endpoint.status === 403) {
      return <Badge variant="destructive">Forbidden</Badge>;
    } else {
      return <Badge variant="destructive">Error</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">API Status</CardTitle>
            <CardDescription>Debug information for API endpoints</CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchHealthCheck}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {healthData && (
          <div className="space-y-4">
            {/* Session Info */}
            <div className="p-3 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">Session Status</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Authenticated:</span>{' '}
                  <Badge variant={healthData.session.authenticated ? "default" : "destructive"}>
                    {healthData.session.authenticated ? 'Yes' : 'No'}
                  </Badge>
                </div>
                {healthData.session.user && (
                  <>
                    <div>
                      <span className="text-muted-foreground">Role:</span>{' '}
                      <Badge variant="outline">{healthData.session.user.role}</Badge>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Email:</span>{' '}
                      <span className="font-mono text-xs">{healthData.session.user.email}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* API Endpoints */}
            <div>
              <h4 className="font-medium mb-3">API Endpoints</h4>
              <div className="space-y-2">
                {Object.entries(healthData.endpoints).map(([name, endpoint]) => (
                  <div key={name} className="flex items-center justify-between p-2 border rounded">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(endpoint)}
                      <span className="font-medium capitalize">{name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(endpoint)}
                      <span className="text-sm text-muted-foreground">
                        {endpoint.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Timestamp */}
            <div className="text-xs text-muted-foreground">
              Last checked: {new Date(healthData.timestamp).toLocaleString()}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}