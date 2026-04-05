import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { updateStatusAction } from '@/lib/actions'
import { Clock, CheckCircle } from 'lucide-react'

export default async function VolunteerDashboard() {
  const user = await getCurrentUser()

  if (!user || user.role !== 'VOLUNTEER') {
    redirect('/dashboard')
  }

  // Show only complaints assigned to this volunteer
  const assignedComplaints = await prisma.complaint.findMany({
    where: { 
      assignedTo: user.id 
    },
    include: { user: true },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-bold mb-2">My Assigned Complaints</h1>
      <p className="text-gray-600 mb-10">You are responsible for resolving these issues</p>

      {assignedComplaints.length === 0 ? (
        <div className="bg-white rounded-3xl shadow p-12 text-center">
          <p className="text-gray-500 text-lg">No complaints assigned to you yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-6">Complaint Title</th>
                <th className="text-left p-6">Reported By</th>
                <th className="text-left p-6">Status</th>
                <th className="text-left p-6">Action</th>
              </tr>
            </thead>
            <tbody>
              {assignedComplaints.map((c) => (
                <tr key={c.id} className="border-t hover:bg-gray-50">
                  <td className="p-6 font-medium">{c.title}</td>
                  <td className="p-6 text-gray-600">{c.user.name}</td>
                  <td className="p-6">
                    <span className={`px-5 py-1 text-xs font-medium rounded-2xl ${
                      c.status === 'RESOLVED' ? 'bg-green-100 text-green-700' :
                      c.status === 'IN_REVIEW' ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="p-6">
                    {c.status !== 'RESOLVED' && (
                      <form action={async () => {
                        'use server'
                        const newStatus = c.status === 'RECEIVED' ? 'IN_REVIEW' : 'RESOLVED'
                        await updateStatusAction(c.id, newStatus)
                      }}>
                        <button 
                          type="submit"
                          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-2xl text-sm font-medium"
                        >
                          {c.status === 'RECEIVED' ? 'Mark In Progress' : 'Mark Resolved'}
                        </button>
                      </form>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}