import AdminLayout from '@/components/admin/AdminLayout';

export const metadata = {
  title: 'Admin Panel | Event Platform',
  description: 'Manage events and users',
};

export default function Layout({ children }) {
  return <AdminLayout>{children}</AdminLayout>;
}
