import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function ComplaintsPage() {
  const complaints = await prisma.complaint.findMany({
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-8">Community Reports</h1>
      <p className="text-gray-500">Complaint detail page is temporarily disabled for deployment.</p>
      {/* Simple list */}
      <div className="mt-8 space-y-4">
        {complaints.map(c => (
          <div key={c.id} className="bg-white p-6 rounded-3xl shadow">
            <h3 className="font-semibold">{c.title}</h3>
            <p className="text-gray-600">{c.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}