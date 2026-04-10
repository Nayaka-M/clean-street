import { prisma } from '@/lib/prisma';
import { voteAction, addCommentAction } from '@/lib/actions';
import { ThumbsUp, ThumbsDown, Send, MessageCircle } from 'lucide-react';

export default async function ComplaintDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;   // ← This was the missing part

  const complaint = await prisma.complaint.findUnique({
    where: { id },
    include: { 
      votes: true, 
      comments: true, 
      user: true 
    }
  });

  if (!complaint) {
    return <div className="text-center py-20 text-2xl">❌ Complaint not found</div>;
  }

  const upvotes = complaint.votes.filter(v => v.voteType === 'UPVOTE').length;
  const downvotes = complaint.votes.filter(v => v.voteType === 'DOWNVOTE').length;

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <div className="bg-white rounded-3xl shadow-xl p-8">
        <span className="px-4 py-2 text-xs font-medium bg-blue-100 text-blue-700 rounded-2xl">
          {complaint.status}
        </span>

        <h1 className="text-3xl font-bold mt-4">{complaint.title}</h1>
        <p className="text-gray-600 mt-2">Reported by {complaint.user.name}</p>
        <p className="mt-6 text-gray-700">{complaint.description}</p>

        {complaint.photo && (
          <img src={complaint.photo} alt="issue" className="mt-8 rounded-2xl w-full" />
        )}

        <div className="flex gap-10 mt-10">
          <form action={async () => { 'use server'; await voteAction(complaint.id, 'UPVOTE'); }}>
            <button type="submit" className="flex items-center gap-3 text-green-600 hover:scale-110 transition">
              <ThumbsUp className="w-8 h-8" />
              <span className="text-3xl font-bold">{upvotes}</span>
            </button>
          </form>

          <form action={async () => { 'use server'; await voteAction(complaint.id, 'DOWNVOTE'); }}>
            <button type="submit" className="flex items-center gap-3 text-red-600 hover:scale-110 transition">
              <ThumbsDown className="w-8 h-8" />
              <span className="text-3xl font-bold">{downvotes}</span>
            </button>
          </form>
        </div>

        <div className="mt-12">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            Comments ({complaint.comments.length})
          </h3>

          <div className="mt-4 space-y-4">
            {complaint.comments.map((comment: any) => (
              <div key={comment.id} className="bg-gray-50 p-4 rounded-2xl">
                <p>{comment.content}</p>
              </div>
            ))}
          </div>

          <form action={async (formData: FormData) => {
            'use server';
            const content = formData.get('content') as string;
            await addCommentAction(complaint.id, content);
          }} className="mt-8 flex gap-3">
            <input 
              name="content" 
              placeholder="Write your comment here..." 
              className="flex-1 px-5 py-4 border border-gray-300 rounded-3xl" 
              required 
            />
            <button type="submit" className="bg-blue-600 text-white px-8 rounded-3xl flex items-center">
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}