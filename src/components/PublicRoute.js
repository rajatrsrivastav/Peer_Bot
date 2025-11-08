'use client';
import { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { AuthContext } from '@/context/auth';

export default function PublicRoute({ children }) {
  const { isLoggedIn } = useContext(AuthContext);
  const { data: session, status } = useSession();
  const router = useRouter();

  const isAuthenticated = session || isLoggedIn;
  const isLoading = status === 'loading';

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <p>Loading...</p>
      </div>
    );
  }

  if (isAuthenticated) return null;

  return children;
}