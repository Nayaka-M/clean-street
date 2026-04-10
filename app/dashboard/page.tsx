import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { AlertTriangle, Clock, Target, CheckCircle } from 'lucide-react';

export const dynamic = 'force-dynamic';   // ← This forces fresh data

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const whereClause = user.role === 'ADMIN' ? {} : { userId: user.id };

  const complaints = await prisma.complaint.findMany({
    where: whereClause,
    include: { user: true },
    orderBy: { createdAt: 'desc' },
  });

  const total = complaints.length;
  const pending = complaints.filter(c => c.status === 'RECEIVED').length;
  const inProgress = complaints.filter(c => c.status === 'IN_REVIEW').length;
  const resolved = complaints.filter(c => c.status === 'RESOLVED').length;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
      <p className="text-gray-600 mb-8">Welcome back, {user.name}!</p>

      <div className="grid grid-cols-4 gap-6 mb-12">
        <div className="bg-white p-6 rounded-3xl shadow">
          <div className="flex items-center gap-4">
            <AlertTriangle className="w-10 h-10 text-orange-500" />
            <div>
              <p className="text-4xl font-bold">{total}</p>
              <p className="text-sm text-gray-500">Total Issues</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow">
          <div className="flex items-center gap-4">
            <Clock className="w-10 h-10 text-blue-500" />
            <div>
              <p className="text-4xl font-bold">{pending}</p>
              <p className="text-sm text-gray-500">Pending</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow">
          <div className="flex items-center gap-4">
            <Target className="w-10 h-10 text-purple-500" />
            <div>
              <p className="text-4xl font-bold">{inProgress}</p>
              <p className="text-sm text-gray-500">In Progress</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow">
          <div className="flex items-center gap-4">
            <CheckCircle className="w-10 h-10 text-green-500" />
            <div>
              <p className="text-4xl font-bold">{resolved}</p>
              <p className="text-sm text-gray-500">Resolved</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div>
          <h2 className="font-semibold mb-4">Recent Activity</h2>
          {complaints.length === 0 ? (
            <p className="text-gray-400">No complaints yet.</p>
          ) : (
            complaints.map(c => (
              <div key={c.id} className="bg-white p-4 rounded-2xl mb-3 flex justify-between items-center">
                <div>
                  <p className="font-medium">{c.title}</p>
                  <p className="text-xs text-gray-400">by {c.user.name} • {c.status}</p>
                </div>
                <span className="text-xs bg-gray-100 px-3 py-1 rounded-xl">
                  {new Date(c.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))
          )}
        </div>

        <div>
          <h2 className="font-semibold mb-4">Quick Actions</h2>
          <div className="bg-white p-6 rounded-3xl space-y-4">
            <a href="/report" className="block w-full bg-blue-600 text-white text-center py-4 rounded-2xl font-semibold">Report New Issue</a>
            <a href="/complaints" className="block w-full border border-gray-300 text-center py-4 rounded-2xl">View All Complaints</a>
          </div>
        </div>
      </div>
    </div>
  );
}