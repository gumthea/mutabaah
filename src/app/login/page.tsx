'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/utils/firebase';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchToken = async () => {
      const res = await fetch('/api/user');
      if (res.ok) {
        router.push('/');
      }
      return
    } 
    
    fetchToken();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();

      // Kirim token ke server untuk disimpan di cookie
      await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      router.push('/');
    } catch (error) {
      alert('Login gagal');
    }
  };

  return (
    <main className="p-6 max-w-sm mx-auto">
      <h1 className="text-xl font-semibold mb-4">Login</h1>
      <form onSubmit={handleLogin} className="space-y-4">
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-2 border" />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-2 border" />
        <button type="submit" className="w-full bg-green-600 text-white py-2">Login</button>
      </form>
    </main>
  );
}
