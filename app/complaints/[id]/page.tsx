import Image from 'next/image';
import { ThumbsUp, ThumbsDown, Send, MessageCircle } from 'lucide-react';
import { voteAction, addCommentAction } from '@/lib/actions';
import { prisma } from '@/lib/prisma';

export default async function ComplaintDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // ✅ Next.js 16 fix
  const { id } = await params;

  // ✅ Fetch complaint
  const complaint = await prisma.complaint.findUnique({
    where: { id },
    include: {
      votes: true,
      comments: true,
      user: true,
    },
  });

  if (!complaint) {
    return (
      <div className="text-center py-20 text-2xl">
        ❌ Complaint not found
      </div>
    );
  }

  // ✅ Vote counts
  const upvotes = complaint.votes.filter(
    (v) => v.voteType === 'UPVOTE'
  ).length;

  const downvotes = complaint.votes.filter(
    (v) => v.voteType === 'DOWNVOTE'
  ).length;

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <div className="bg-white rounded-3xl shadow-xl p-8">

        {/* Status */}
        <span className="px-4 py-2 text-xs font-medium bg-blue-100 text-blue-700 rounded-2xl">
          {complaint.status}
        </span>

        {/* Title */}
        <h1 className="text-3xl font-bold mt-4">
          {complaint.title}
        </h1>

        {/* User */}
        <p className="text-gray-600 mt-2">
          Reported by {complaint.user.name}
        </p>

        {/* Description */}
        <p className="mt-6 text-gray-700">
          {complaint.description}
        </p>

        {/* ✅ Image (fixed) */}
        {complaint.photo && (
          <div className="mt-8 relative w-full h-[400px]">
            <Image
              src={complaint.photo}
              alt="issue"
              fill
              className="rounded-2xl object-cover"
              sizes="100vw"
              priority
            />
          </div>
        )}

        {/* Voting */}
        <div className="flex gap-10 mt-10">

          {/* ✅ FIXED: bind instead of arrow */}
          <form action={voteAction.bind(null, id, 'UPVOTE')}>
            <button
              type="submit"
              className="flex items-center gap-3 text-green-600 hover:scale-110 transition"
            >
              <ThumbsUp className="w-8 h-8" />
              <span className="text-3xl font-bold">
                {upvotes}
              </span>
            </button>
          </form>

          <form action={voteAction.bind(null, id, 'DOWNVOTE')}>
            <button
              type="submit"
              className="flex items-center gap-3 text-red-600 hover:scale-110 transition"
            >
              <ThumbsDown className="w-8 h-8" />
              <span className="text-3xl font-bold">
                {downvotes}
              </span>
            </button>
          </form>
        </div>

        {/* Comments */}
        <div className="mt-12">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            Comments ({complaint.comments.length})
          </h3>

          {/* List */}
          <div className="mt-4 space-y-4">
            {complaint.comments.map((comment) => (
              <div
                key={comment.id}
                className="bg-gray-50 p-4 rounded-2xl"
              >
                <p>{comment.content}</p>
              </div>
            ))}
          </div>

          {/* Add Comment */}
          <form
            action={async (formData: FormData) => {
              'use server';

              const content = formData.get('content') as string;
              if (!content) return;

              await addCommentAction(id, content);
            }}
            className="mt-8 flex gap-3"
          >
            <input
              name="content"
              placeholder="Write your comment here..."
              className="flex-1 px-5 py-4 border border-gray-300 rounded-3xl"
              required
            />

            <button
              type="submit"
              className="bg-blue-600 text-white px-8 rounded-3xl flex items-center"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 