import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { updateStatusAction } from '@/lib/actions'
import { AlertTriangle, Clock, Target, CheckCircle } from 'lucide-react'
import { revalidatePath } from 'next/cache'

export default async function AdminDashboard() {
  const user = await getCurrentUser()
  if (!user || user.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  const total = await prisma.complaint.count()
  const pending = await prisma.complaint.count({ where: { status: 'RECEIVED' } })
  const inReview = await prisma.complaint.count({ where: { status: 'IN_REVIEW' } })
  const resolved = await prisma.complaint.count({ where: { status: 'RESOLVED' } })

  const complaints = await prisma.complaint.findMany({
    include: { user: true },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-bold mb-10">Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-6 mb-12">
        <div className="bg-white p-6 rounded-3xl shadow">
          <AlertTriangle className="w-10 h-10 text-orange-500" />
          <p className="text-5xl font-bold mt-4">{total}</p>
          <p className="text-gray-500">Total Complaints</p>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow">
          <Clock className="w-10 h-10 text-blue-500" />
          <p className="text-5xl font-bold mt-4">{pending}</p>
          <p className="text-gray-500">Pending</p>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow">
          <Target className="w-10 h-10 text-purple-500" />
          <p className="text-5xl font-bold mt-4">{inReview}</p>
          <p className="text-gray-500">In Progress</p>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow">
          <CheckCircle className="w-10 h-10 text-green-500" />
          <p className="text-5xl font-bold mt-4">{resolved}</p>
          <p className="text-gray-500">Resolved</p>
        </div>
      </div>

      {/* Complaints Table */}
      <h2 className="text-2xl font-semibold mb-6">All Complaints</h2>
      <div className="bg-white rounded-3xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-6">Title</th>
              <th className="text-left p-6">Reported By</th>
              <th className="text-left p-6">Status</th>
              <th className="text-left p-6">Action</th>
            </tr>
          </thead>
          <tbody>
            {complaints.map((c) => (
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
                      revalidatePath('/admin')   // ← This forces refresh
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
    </div>
  )
}