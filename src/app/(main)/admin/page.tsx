import { getApps as getAdminApps, initializeApp as initializeAdminApp, getApp as getAdminAppUntyped, cert, ServiceAccount } from 'firebase-admin/app';
import { getAuth }from 'firebase-admin/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';


// Initialize Firebase Admin SDK for the server
function getAdminApp() {
    if (getAdminApps().length) {
        return getAdminAppUntyped();
    }

    const serviceAccountString = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

    if (!serviceAccountString) {
        console.warn("FIREBASE_SERVICE_ACCOUNT_KEY is not set. Admin features will be limited.");
        return initializeAdminApp({
            projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        }, "fallback_app_" + Date.now());
    }

    try {
        const serviceAccount: ServiceAccount = JSON.parse(serviceAccountString);
        return initializeAdminApp({
            credential: cert(serviceAccount),
        });
    } catch (error) {
        console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY:", error);
         return initializeAdminApp({
            projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        }, "fallback_app_error_" + Date.now());
    }
}


async function getUsers() {
    try {
        const adminApp = getAdminApp();
        const auth = getAuth(adminApp);
        const userRecords = await auth.listUsers();
        const users = userRecords.users.map((user) => ({
          uid: user.uid,
          name: user.displayName || 'No Name',
          email: user.email!,
          role: user.email === 'admin@campusmind.app' ? 'Admin' : 'User',
          status: user.disabled ? 'Inactive' : 'Active',
          avatar: user.photoURL || `https://picsum.photos/seed/${user.uid}/40/40`,
        }));
        return users;
    } catch (error) {
        console.error("Error fetching users:", error);
        // This can happen if the service account key is not set up correctly.
        // We'll return an empty array to prevent the page from crashing.
        return [];
    }
}


export default async function AdminPage() {
  const users = await getUsers();

  return (
    <div className="space-y-6">
       <div>
        <h1 className="font-headline text-3xl md:text-4xl">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Manage users and application settings.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>
            A list of all users in the system from Firebase Auth.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length > 0 ? (
                users.map((user) => (
                  <TableRow key={user.email}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{user.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                       <Badge variant={user.role === 'Admin' ? 'default' : 'secondary'}>{user.role}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.status === 'Active' ? 'secondary' : 'destructive'} className={user.status === 'Active' ? 'text-green-600' : ''}>
                        {user.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                 <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                        No users found. This may be due to a configuration issue. Check your FIREBASE_SERVICE_ACCOUNT_KEY.
                    </TableCell>
                 </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
