
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

const users = [
  {
    name: 'Jane Doe',
    email: 'jane.doe@university.edu',
    role: 'User',
    status: 'Active',
    avatar: 'https://picsum.photos/seed/user-1/40/40',
  },
  {
    name: 'John Smith',
    email: 'john.smith@university.edu',
    role: 'User',
    status: 'Active',
    avatar: 'https://picsum.photos/seed/user-2/40/40',
  },
  {
    name: 'Alex Johnson',
    email: 'alex.j@university.edu',
    role: 'Admin',
    status: 'Active',
    avatar: 'https://picsum.photos/seed/user-3/40/40',
  },
  {
    name: 'Emily White',
    email: 'emily.w@university.edu',
    role: 'User',
    status: 'Inactive',
    avatar: 'https://picsum.photos/seed/user-4/40/40',
  },
];


export default function AdminPage() {
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
            A list of all users in the system.
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
              {users.map((user) => (
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
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
