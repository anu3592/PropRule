import Link from 'next/link';
import { LayoutDashboard, Building, Tag, BarChart3, Settings } from 'lucide-react';

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      {/* Portal Sidebar */}
      <aside className="w-64 bg-gray-900 border-r border-gray-800 hidden md:block">
        <div className="p-6">
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Partner Portal</h2>
          <nav className="space-y-2">
            <Link href="/portal" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
              <LayoutDashboard className="h-5 w-5" /> Dashboard
            </Link>
            <Link href="/portal/firm" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
              <Building className="h-5 w-5" /> My Firm Profile
            </Link>
            <Link href="/portal/offers" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
              <Tag className="h-5 w-5" /> Manage Offers
            </Link>
            <Link href="/portal/analytics" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
              <BarChart3 className="h-5 w-5" /> Analytics
            </Link>
            <Link href="/portal/settings" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors mt-8">
              <Settings className="h-5 w-5" /> Account Settings
            </Link>
          </nav>
        </div>
      </aside>

      {/* Main Portal Content */}
      <main className="flex-1 bg-[#0f172a]">
        {children}
      </main>
    </div>
  );
}
