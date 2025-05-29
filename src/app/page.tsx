'use client';

import { useEffect, useState } from 'react';
import { getCustomAgenda, saveAgenda } from '@/apis/agenda';
import Head from 'next/head';

export default function HomePage() {
  const now = new Date();
  const date = now.toLocaleDateString('id-ID'); // contoh: "26/05/2025"
  const day = now.toLocaleDateString('id-ID', { weekday: 'long' }); // "Senin"
  const formatDate = (date: string) => date.replace(/\//g, '-');

  const [activities, setActivities] = useState<{ time: string; activity: string }[]>([]);
  const [checked, setChecked] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState('');

  useEffect(() => {
    const fetchAgenda = async () => {
      setLoading(true);
      const res = await fetch('/api/user');
      if (!res.ok) {
        window.location.href = '/login';
        return;
      }

      const { token } = await res.json();
      setToken(token);
      
      const data = await getCustomAgenda(date, token); // Ambil agenda berdasarkan tanggal
      setActivities(data);

      const stored = await fetch(`/api/agenda?date=${formatDate(date)}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }).then(res => res.json());
      setChecked(stored.checked || []);
      setLoading(false);
    };

    fetchAgenda();
  }, [date]);

  const toggleCheck = async (index: number) => {
    const updated = checked.includes(index)
      ? checked.filter(i => i !== index)
      : [...checked, index];
    setChecked(updated);
    await saveAgenda(date, updated, token);
  };

  const progress = activities.length === 0 ? 0 : Math.round((checked.length / activities.length) * 100);

  return (
    <>
      <Head>
        <title>Agenda Harian</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#4CAF50" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </Head>

      <main className="p-6 max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-1 text-green-700">Agenda Harian</h1>
        <p className="text-sm text-gray-500 mb-2">{day}, {date}</p>
        <p className="text-green-600 font-semibold mb-4">Progress: {progress}%</p>

        {loading ? (
          <p>Loading...</p>
        ) : activities.length === 0 ? (
          <p className="text-red-500">Belum ada agenda untuk hari ini.</p>
        ) : (
          <ul className="space-y-3">
            {activities.map((item, idx) => (
              <li
                key={idx}
                onClick={() => toggleCheck(idx)}
                className={`border p-4 rounded-lg cursor-pointer transition ${
                  checked.includes(idx) ? 'bg-green-100 border-green-400' : 'bg-white'
                }`}
              >
                <p className="font-medium">{item.time}</p>
                <p>{item.activity}</p>
              </li>
            ))}
          </ul>
        )}
      </main>
    </>
  );
}
