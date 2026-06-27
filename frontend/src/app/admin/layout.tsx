import Link from 'next/link';
import { LayoutDashboard, Building2, MessageSquare, Users, Settings } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-gray-900 border-r border-gray-800 hidden md:block">
        <div className="p-6">
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Admin Console</h2>
          <nav className="space-y-2">
            <Link href="/admin" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
              <LayoutDashboard className="h-5 w-5" /> Dashboard
            </Link>
            <Link href="/admin/firms" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
              <Building2 className="h-5 w-5" /> Manage Firms
            </Link>
            <Link href="/admin/reviews" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
              <MessageSquare className="h-5 w-5" /> Reviews
            </Link>
            <Link href="/admin/users" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
              <Users className="h-5 w-5" /> Users
            </Link>
            <Link href="/admin/settings" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors mt-8">
              <Settings className="h-5 w-5" /> Settings
            </Link>
          </nav>
        </div>
      </aside>

      {/* Main Admin Content */}
      <main className="flex-1 bg-[#0f172a]">
        {children}
      </main>
    </div>
  );
}
