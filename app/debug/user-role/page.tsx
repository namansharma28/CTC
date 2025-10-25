"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, User, Shield, Settings, Crown } from "lucide-react";

interface UserData {
  session: {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
    };
  };
  dbUser: {
    id: string;
    email: string;
    name: string;
    role: string;
    createdAt: string;
  } | null;
  isAdmin: boolean;
  isOperator: boolean;
  canAccessAdmin: boolean;
}

export default function UserRoleDebugPage() {
  const { data: session, status } = useSession();
  const { toast } = useToast();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>("");

  useEffect(() => {
    if (status === "authenticated") {
      fetchUserData();
    } else if (status === "unauthenticated") {
      setIsLoading(false);
    }
  }, [status]);

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/debug/user-role');
      if (response.ok) {
        const data = await response.json();
        setUserData(data);
        setSelectedRole(data.session.user.role);
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.error || "Failed to fetch user data",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch user data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateRole = async () => {
    if (!selectedRole || selectedRole === userData?.session.user.role) {
      return;
    }

    try {
      setIsUpdating(true);
      const response = await fetch('/api/debug/user-role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newRole: selectedRole }),
      });

      if (response.ok) {
        const data = await response.json();
        toast({
          title: "Success",
          description: data.message,
        });
        
        // Refresh the page to update session
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.error || "Failed to update role",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update role",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Crown className="h-4 w-4" />;
      case 'operator':
        return <Settings className="h-4 w-4" />;
      case 'technical_lead':
        return <Shield className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-500';
      case 'operator':
        return 'bg-blue-500';
      case 'technical_lead':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">Please sign in to view this page</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">User Role Debug</h1>
        <p className="text-muted-foreground">Check and update your user role for admin access</p>
      </div>

      {userData && (
        <div className="space-y-6">
          {/* Current Session Info */}
          <Card>
            <CardHeader>
              <CardTitle>Current Session</CardTitle>
              <CardDescription>Information from your current session</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <p className="text-sm text-muted-foreground">{userData.session.user.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Name</label>
                  <p className="text-sm text-muted-foreground">{userData.session.user.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">User ID</label>
                  <p className="text-sm text-muted-foreground font-mono">{userData.session.user.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Current Role</label>
                  <div className="flex items-center gap-2">
                    <Badge className={getRoleColor(userData.session.user.role)}>
                      {getRoleIcon(userData.session.user.role)}
                      {userData.session.user.role}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Database User Info */}
          {userData.dbUser && (
            <Card>
              <CardHeader>
                <CardTitle>Database User Info</CardTitle>
                <CardDescription>Information from the database</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Database Role</label>
                    <div className="flex items-center gap-2">
                      <Badge className={getRoleColor(userData.dbUser.role)}>
                        {getRoleIcon(userData.dbUser.role)}
                        {userData.dbUser.role}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Created At</label>
                    <p className="text-sm text-muted-foreground">
                      {new Date(userData.dbUser.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Admin Access Status */}
          <Card>
            <CardHeader>
              <CardTitle>Admin Access Status</CardTitle>
              <CardDescription>Your current permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className={`w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center ${userData.isAdmin ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-400'}`}>
                    <Crown className="h-6 w-6" />
                  </div>
                  <p className="text-sm font-medium">Admin Access</p>
                  <p className="text-xs text-muted-foreground">{userData.isAdmin ? 'Yes' : 'No'}</p>
                </div>
                <div className="text-center">
                  <div className={`w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center ${userData.isOperator ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
                    <Settings className="h-6 w-6" />
                  </div>
                  <p className="text-sm font-medium">Operator Access</p>
                  <p className="text-xs text-muted-foreground">{userData.isOperator ? 'Yes' : 'No'}</p>
                </div>
                <div className="text-center">
                  <div className={`w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center ${userData.canAccessAdmin ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                    <Shield className="h-6 w-6" />
                  </div>
                  <p className="text-sm font-medium">Can Access Admin</p>
                  <p className="text-xs text-muted-foreground">{userData.canAccessAdmin ? 'Yes' : 'No'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Role Update */}
          <Card>
            <CardHeader>
              <CardTitle>Update Role</CardTitle>
              <CardDescription>
                Change your role to access admin features. 
                {!userData.canAccessAdmin && " You need 'admin' or 'operator' role to access technical leads data."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="technical_lead">Technical Lead</SelectItem>
                    <SelectItem value="operator">Operator</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  onClick={updateRole}
                  disabled={isUpdating || selectedRole === userData.session.user.role}
                >
                  {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Update Role
                </Button>
              </div>
              {!userData.canAccessAdmin && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>To fix the 401 error:</strong> Update your role to 'admin' or 'operator' and then refresh the page.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}