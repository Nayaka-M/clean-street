import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { updateStatusAction } from '@/lib/actions';

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') redirect('/dashboard');

  const complaints = await prisma.complaint.findMany({
    include: { user: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-8">Admin Panel</h1>

      {complaints.length === 0 ? (
        <p className="text-center py-12 text-gray-500">No complaints yet.</p>
      ) : (
        <div className="space-y-6">
          {complaints.map((complaint) => (
            <div key={complaint.id} className="bg-white rounded-3xl shadow p-6 flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{complaint.title}</h3>
                <p className="text-gray-600 text-sm mt-1">{complaint.description}</p>
                <p className="text-xs text-gray-400 mt-3">
                  By <span className="font-medium">{complaint.user.name}</span> • 
                  Current: <span className="capitalize font-medium">{complaint.status}</span>
                </p>
              </div>

              <div className="flex gap-3">
                {/* Mark In Review Button */}
                {complaint.status !== 'IN_REVIEW' && complaint.status !== 'RESOLVED' && (
                  <form action={async () => {
                    'use server';
                    await updateStatusAction(complaint.id, 'IN_REVIEW');
                  }}>
                    <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-2xl text-sm font-medium transition">
                      Mark In Review
                    </button>
                  </form>
                )}

                {/* Mark Resolved Button */}
                {complaint.status !== 'RESOLVED' && (
                  <form action={async () => {
                    'use server';
                    await updateStatusAction(complaint.id, 'RESOLVED');
                  }}>
                    <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-2xl text-sm font-medium transition">
                      ✅ Mark Resolved
                    </button>
                  </form>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}