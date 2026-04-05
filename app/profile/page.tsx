import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-8">Profile</h1>
      <div className="grid grid-cols-2 gap-8">
        <div className="bg-white rounded-3xl p-8 text-center">
          <div className="w-28 h-28 mx-auto rounded-full bg-blue-100 flex items-center justify-center text-5xl font-bold text-blue-600 mb-4">
            {user.name[0]}
          </div>
          <h2 className="font-semibold text-2xl">{user.name}</h2>
          <p className="text-blue-600">@{user.username || 'user'}</p>
          <p className="text-sm text-gray-500 mt-6">Active citizen helping to improve our community through CleanStreet</p>
        </div>

        <div className="bg-white rounded-3xl p-8">
          <h3 className="font-semibold mb-6">Account Information</h3>
          <form action={async (formData: FormData) => {
            'use server';
            await prisma.user.update({
              where: { id: user.id },
              data: {
                name: formData.get('name') as string,
                username: formData.get('username') as string,
                phone: formData.get('phone') as string,
                location: formData.get('location') as string,
                bio: formData.get('bio') as string,
              }
            });
            redirect('/profile');
          }}>
            <div className="space-y-6">
              <div>
                <label className="text-sm">Full Name</label>
                <input name="name" defaultValue={user.name} className="w-full border rounded-2xl px-4 py-3 mt-1" />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-sm">Username</label>
                  <input name="username" defaultValue={user.username || ''} className="w-full border rounded-2xl px-4 py-3 mt-1" />
                </div>
                <div>
                  <label className="text-sm">Phone Number</label>
                  <input name="phone" defaultValue={user.phone || ''} className="w-full border rounded-2xl px-4 py-3 mt-1" />
                </div>
              </div>
              <div>
                <label className="text-sm">Location</label>
                <input name="location" defaultValue={user.location || ''} className="w-full border rounded-2xl px-4 py-3 mt-1" />
              </div>
              <div>
                <label className="text-sm">Bio</label>
                <textarea name="bio" defaultValue={user.bio || ''} rows={3} className="w-full border rounded-3xl px-4 py-3 mt-1" />
              </div>
              <button type="submit" className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-medium">Save Changes</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}