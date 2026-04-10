import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { ThumbsUp, ThumbsDown, MessageCircle } from 'lucide-react';

export default async function ComplaintsPage() {
  const complaints = await prisma.complaint.findMany({
    include: {
      votes: true,
      comments: true,
      user: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-8">Community Reports</h1>

      {complaints.length === 0 ? (
        <p className="text-gray-500 text-center py-12 text-lg">
          No complaints yet. Be the first to report an issue!
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {complaints.map((complaint) => {
            const upvotes = complaint.votes.filter(v => v.voteType === 'UPVOTE').length;
            const downvotes = complaint.votes.filter(v => v.voteType === 'DOWNVOTE').length;
            const commentCount = complaint.comments.length;

            return (
              <div key={complaint.id} className="bg-white rounded-3xl shadow p-6 hover:shadow-xl transition-all">
                <div className="flex justify-between items-start">
                  <span className="px-4 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-2xl">
                    {complaint.status}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(complaint.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="font-semibold text-xl mt-4">{complaint.title}</h3>
                <p className="text-gray-600 line-clamp-2 mt-2">{complaint.description}</p>

                <div className="flex items-center gap-6 mt-6 text-sm">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-gray-500" />
                    <span>{commentCount}</span>
                  </div>
                  <div className="flex items-center gap-1 text-green-600">
                    <ThumbsUp className="w-5 h-5" />
                    <span className="font-medium">{upvotes}</span>
                  </div>
                  <div className="flex items-center gap-1 text-red-600">
                    <ThumbsDown className="w-5 h-5" />
                    <span className="font-medium">{downvotes}</span>
                  </div>
                </div>

                <Link 
                  href={`/complaints/${complaint.id}`}
                  className="mt-6 inline-block text-blue-600 font-medium hover:underline"
                >
                  View details &amp; comment →
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}