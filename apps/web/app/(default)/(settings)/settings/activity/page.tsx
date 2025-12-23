'use client';

import { useRequiredAuthUser } from '@/hooks/use-auth-user';
import { parseUserAgent } from '@/lib/user-agent';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Session } from '@workspace/auth';
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card';
import { Skeleton } from '@workspace/ui/components/skeleton';
import { Spinner } from '@workspace/ui/components/spinner';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@workspace/ui/components/tooltip';
import { formatDate, formatDistanceToNow } from '@workspace/utils';
import { Activity, AlertCircle, Calendar, MapPin, Monitor, Smartphone } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface SessionsResponse {
  sessions: Session['session'][];
  currentSessionId: string;
}

async function fetchSessions(): Promise<SessionsResponse> {
  const response = await fetch('/api/sessions');
  if (!response.ok) {
    throw new Error('Failed to fetch sessions');
  }
  return response.json();
}

async function revokeSession(token: string): Promise<void> {
  const response = await fetch(`/api/sessions/${token}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to revoke session');
  }
}

export default function ActivityPage() {
  const { user, isLoading: userLoading } = useRequiredAuthUser();
  const queryClient = useQueryClient();
  const [revokingToken, setRevokingToken] = useState<string | null>(null);

  const {
    data: sessionsData,
    isLoading: sessionsLoading,
    error,
  } = useQuery({
    queryKey: ['sessions'],
    queryFn: fetchSessions,
    enabled: !!user,
  });

  const revokeSessionMutation = useMutation({
    mutationFn: revokeSession,
    onMutate: (token: string) => {
      setRevokingToken(token);
    },
    onSuccess: () => {
      toast.success('Session revoked successfully');
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },
    onError: (error: Error) => {
      console.error('Error revoking session:', error);
      toast.error(error.message || 'Failed to revoke session');
    },
    onSettled: () => {
      setRevokingToken(null);
    },
  });

  const handleRevokeSession = (token: string) => {
    revokeSessionMutation.mutate(token);
  };

  if (userLoading || sessionsLoading) {
    return (
      <section className="mx-auto max-w-3xl space-y-6 px-4 py-10">
        {/* Header Section */}
        <div className="space-y-2">
          <Skeleton className="h-9 w-56" />
          <Skeleton className="h-5 w-96" />
        </div>

        {/* Sessions Card Skeleton */}
        <div className="bg-card space-y-6 rounded-lg border p-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-5 rounded" />
              <Skeleton className="h-6 w-48" />
            </div>
            <Skeleton className="mt-2 h-4 w-72" />
          </div>

          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="bg-muted/50 space-y-3 rounded-lg border p-4">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-6 w-6 rounded-full" />
                  <div className="flex-1 space-y-1">
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <div className="flex justify-end">
                    <Skeleton className="h-6 w-20" />
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mx-auto max-w-3xl space-y-6 px-4 py-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Activity</h1>
          <p className="text-muted-foreground mt-2">
            Manage your active sessions and view account activity.
          </p>
        </div>
        <Card>
          <CardContent className="flex items-center gap-3 py-6">
            <AlertCircle className="text-destructive h-5 w-5" />
            <p className="text-muted-foreground text-sm">
              Failed to load sessions. Please try again later.
            </p>
          </CardContent>
        </Card>
      </section>
    );
  }

  const sessions = sessionsData?.sessions || [];
  const currentSessionId = sessionsData?.currentSessionId;
  const currentSession = sessions.find((s) => s.id === currentSessionId);
  const otherSessions = sessions.filter((s) => s.id !== currentSessionId);

  const currentSessionUserAgent = parseUserAgent(currentSession?.userAgent || '');

  return (
    <section className="mx-auto max-w-3xl space-y-6 px-4 py-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Activity</h1>
        <p className="text-muted-foreground mt-2">
          Manage your active sessions and view account activity.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Your Sessions
          </CardTitle>
          <CardDescription>
            Manage where you&apos;re logged in and revoke access from devices you don&apos;t
            recognize.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {sessions.length === 0 ? (
            <p className="text-muted-foreground text-sm">No active sessions found.</p>
          ) : (
            <>
              {/* Current Session */}
              {currentSession && (
                <div className="group relative rounded-lg border border-green-200 bg-green-50 p-4 transition-all hover:shadow-md dark:border-green-900 dark:bg-green-950/20">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="inline-flex items-center gap-2 rounded-lg bg-white px-3 py-1.5 dark:bg-green-900/30">
                          {currentSessionUserAgent.device === 'Mobile' ? (
                            <Smartphone className="h-4 w-4 text-green-600 dark:text-green-400" />
                          ) : (
                            <Monitor className="h-4 w-4 text-green-600 dark:text-green-400" />
                          )}
                          <span className="font-semibold text-gray-900 dark:text-gray-100">
                            {currentSessionUserAgent.browser}
                          </span>
                          <span className="text-gray-400">•</span>
                          <span className="text-sm text-gray-600 dark:text-gray-300">
                            {currentSessionUserAgent.os}
                          </span>
                        </div>
                        <span className="inline-flex items-center gap-1 rounded-full bg-green-600 px-3 py-1 text-xs font-semibold text-white dark:bg-green-700">
                          <span className="h-2 w-2 rounded-full bg-white"></span>
                          This Device
                        </span>
                      </div>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {currentSession.ipAddress && (
                          <div className="flex items-start gap-2">
                            <MapPin className="text-muted-foreground mt-0.5 h-4 w-4 flex-shrink-0" />
                            <div>
                              <p className="text-muted-foreground text-xs font-medium">Location</p>
                              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                {currentSession.ipAddress}
                              </p>
                            </div>
                          </div>
                        )}
                        <div className="flex items-start gap-2">
                          <Calendar className="text-muted-foreground mt-0.5 h-4 w-4 flex-shrink-0" />
                          <div>
                            <p className="text-muted-foreground text-xs font-medium">Created</p>
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {formatDate(new Date(currentSession.createdAt), 'PPpp')}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Other Sessions */}
              {otherSessions.map((session) => {
                const { browser, os, device } = parseUserAgent(session.userAgent);
                return (
                  <div
                    key={session.id}
                    className="group relative rounded-lg border border-gray-200 bg-white p-4 transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-900/20"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-1.5 dark:bg-gray-800/50">
                            {device === 'Mobile' ? (
                              <Smartphone className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                            ) : (
                              <Monitor className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                            )}
                            <span className="font-semibold text-gray-900 dark:text-gray-100">
                              {browser}
                            </span>
                            <span className="text-gray-400">•</span>
                            <span className="text-sm text-gray-600 dark:text-gray-300">{os}</span>
                          </div>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="w-full sm:w-auto"
                            onClick={() => handleRevokeSession(session.token)}
                            disabled={
                              revokeSessionMutation.isPending && revokingToken === session.token
                            }
                          >
                            {revokeSessionMutation.isPending && revokingToken === session.token ? (
                              <>
                                <Spinner className="mr-2" />
                                Revoking...
                              </>
                            ) : (
                              'Revoke'
                            )}
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          {session.ipAddress && (
                            <div className="flex items-start gap-2">
                              <MapPin className="text-muted-foreground mt-0.5 h-4 w-4 flex-shrink-0" />
                              <div>
                                <p className="text-muted-foreground text-xs font-medium">
                                  Location
                                </p>
                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                  {session.ipAddress}
                                </p>
                              </div>
                            </div>
                          )}
                          <div className="flex items-start gap-2">
                            <Calendar className="text-muted-foreground mt-0.5 h-4 w-4 flex-shrink-0" />
                            <div>
                              <p className="text-muted-foreground text-xs font-medium">Created</p>
                              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                {formatDate(new Date(session.createdAt), 'PPpp')}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <Calendar className="text-muted-foreground mt-0.5 h-4 w-4 flex-shrink-0" />
                            <div>
                              <p className="text-muted-foreground text-xs font-medium">
                                Last Active
                              </p>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Badge variant="secondary" className="text-xs font-medium">
                                      {formatDistanceToNow(new Date(session.updatedAt), {
                                        addSuffix: true,
                                      })}
                                    </Badge>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    {formatDate(new Date(session.updatedAt), 'PPpp')}
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
