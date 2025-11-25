'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import { collection, getDocs, limit, query } from 'firebase/firestore';

export default function FirebaseStatusPage() {
  const [status, setStatus] = useState({
    initialized: false,
    envVarsSet: false,
    firestoreConnection: false,
    menuItems: 0,
    promotions: 0,
    settings: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function checkStatus() {
      try {
        const envVarsSet = !!(
          process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
          process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
          process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
        );

        const initialized = !!db;

        let firestoreConnection = false;
        let menuItems = 0;
        let promotions = 0;
        let settings = false;

        if (db) {
          try {
            const menuCollection = collection(db, 'menu-items');
            const menuSnapshot = await getDocs(query(menuCollection, limit(1)));
            firestoreConnection = true;
            
            const allMenuSnapshot = await getDocs(menuCollection);
            menuItems = allMenuSnapshot.size;

            const promotionsCollection = collection(db, 'promotions');
            const promotionsSnapshot = await getDocs(promotionsCollection);
            promotions = promotionsSnapshot.size;

            const settingsCollection = collection(db, 'settings');
            const settingsSnapshot = await getDocs(query(settingsCollection, limit(1)));
            settings = !settingsSnapshot.empty;
          } catch (err) {
            console.error('Firestore connection error:', err);
            firestoreConnection = false;
          }
        }

        setStatus({
          initialized,
          envVarsSet,
          firestoreConnection,
          menuItems,
          promotions,
          settings,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    checkStatus();
  }, []);

  const StatusItem = ({ 
    label, 
    success, 
    detail 
  }: { 
    label: string; 
    success: boolean; 
    detail?: string 
  }) => (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="flex items-center gap-3">
        {success ? (
          <CheckCircle className="h-5 w-5 text-green-500" />
        ) : (
          <XCircle className="h-5 w-5 text-red-500" />
        )}
        <div>
          <p className="font-medium">{label}</p>
          {detail && <p className="text-sm text-muted-foreground">{detail}</p>}
        </div>
      </div>
      <Badge variant={success ? 'default' : 'destructive'}>
        {success ? 'OK' : 'Failed'}
      </Badge>
    </div>
  );

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  const allGood = status.initialized && status.envVarsSet && status.firestoreConnection;

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Firebase Connection Status</CardTitle>
              <CardDescription>
                Check if Firebase is properly configured and connected
              </CardDescription>
            </div>
            {allGood ? (
              <Badge className="bg-green-500 text-white">All Systems Operational</Badge>
            ) : (
              <Badge variant="destructive">Configuration Needed</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Configuration Checks</h3>
            
            <StatusItem
              label="Environment Variables Set"
              success={status.envVarsSet}
              detail={status.envVarsSet 
                ? "All required Firebase env vars are configured" 
                : "Missing Firebase environment variables in Replit Secrets"}
            />

            <StatusItem
              label="Firebase SDK Initialized"
              success={status.initialized}
              detail={status.initialized 
                ? "Firebase SDK is loaded and ready" 
                : "Firebase initialization failed - check environment variables"}
            />

            <StatusItem
              label="Firestore Connection"
              success={status.firestoreConnection}
              detail={status.firestoreConnection 
                ? "Successfully connected to Firestore database" 
                : "Cannot connect to Firestore - check Firebase project settings"}
            />
          </div>

          {status.firestoreConnection && (
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Database Contents</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Menu Items</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">{status.menuItems}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      items in database
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Promotions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">{status.promotions}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      active promotions
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Settings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">{status.settings ? '✓' : '✗'}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {status.settings ? 'configured' : 'not configured'}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {!allGood && (
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h3 className="font-semibold text-yellow-900 mb-2">Next Steps</h3>
              <ol className="list-decimal list-inside space-y-1 text-sm text-yellow-800">
                {!status.envVarsSet && (
                  <li>Add Firebase credentials to Replit Secrets (see FIREBASE_SETUP_GUIDE.md)</li>
                )}
                {!status.initialized && (
                  <li>Restart the development server after adding secrets</li>
                )}
                {!status.firestoreConnection && (
                  <li>Check Firebase Console to ensure Firestore is enabled</li>
                )}
              </ol>
              <p className="mt-3 text-sm text-yellow-800">
                📖 See <code className="bg-yellow-100 px-1 py-0.5 rounded">FIREBASE_SETUP_GUIDE.md</code> for detailed setup instructions
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
