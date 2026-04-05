'use client';
import { logoutAction } from '@/lib/actions'
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await logoutAction();
    router.push('/login');
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      className="text-red-600 hover:text-red-700 font-medium text-sm"
    >
      Logout
    </button>
  );
}