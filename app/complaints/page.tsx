import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export default async function ComplaintsPage() {
  // ✅ Fetch all complaints
  const complaints = await prisma.complaint.findMany({
    include: {
      votes: true,
      user: true,
      comments: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  // ✅ Empty state
  if (complaints.length === 0) {
    return (
      <div className="text-center py-20 text-xl">
        🚫 No complaints found
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      {/* Title */}
      <h1 className="text-3xl font-bold mb-8">
        🧾 All Complaints
      </h1>

      {/* List */}
      <div className="space-y-6">
        {complaints.map((complaint) => {
          const upvotes = complaint.votes.filter(
            (v) => v.voteType === 'UPVOTE'
          ).length;

          const downvotes = complaint.votes.filter(
            (v) => v.voteType === 'DOWNVOTE'
          ).length;

          return (
            <Link
              key={complaint.id}
              href={`/complaints/${complaint.id}`}
              className="block bg-white p-6 rounded-2xl shadow hover:shadow-lg transition"
            >
              {/* Title */}
              <h2 className="text-xl font-semibold">
                {complaint.title}
              </h2>

              {/* Description */}
              <p className="text-gray-600 mt-2 line-clamp-2">
                {complaint.description}
              </p>

              {/* Meta */}
              <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
                <span>👤 {complaint.user.name}</span>

                <div className="flex gap-4">
                  <span>👍 {upvotes}</span>
                  <span>👎 {downvotes}</span>
                  <span>💬 {complaint.comments.length}</span>
                </div>
              </div>

              {/* Status */}
              <div className="mt-3">
                <span className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-xl">
                  {complaint.status}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}