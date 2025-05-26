// app/api/agenda/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/utils/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get('date'); // misal '26-05-2025'

  if (!date) {
    return NextResponse.json({ activities: [], checked: [] }, { status: 400 });
  }

  try {
    // Ambil data checked dari agendas/{date}
    const agendaRef = doc(db, 'agendas', date);
    const agendaSnap = await getDoc(agendaRef);

    // Ambil baseActivities sesuai nama hari
    const dayName = getDayName(date);
    const baseRef = doc(db, 'baseActivities', dayName);
    const baseSnap = await getDoc(baseRef);
    const activities = baseSnap.exists() ? baseSnap.data().activities || [] : [];

    // Ambil checked dari agendaSnap jika ada
    const checked = agendaSnap.exists() ? agendaSnap.data().checked || [] : [];

    return NextResponse.json({ activities, checked });
  } catch (error) {
    console.error('GET agenda error:', error);
    return NextResponse.json({ activities: [], checked: [] }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { date, checked } = await req.json();
    if (!date || !Array.isArray(checked)) {
      return NextResponse.json({ message: 'Invalid payload' }, { status: 400 });
    }

    await setDoc(doc(db, 'agendas', date), { checked });
    return NextResponse.json({ message: 'Saved successfully' });
  } catch (error) {
    console.error('POST agenda error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// Helper function to convert date string to day name (e.g. "Senin")
function getDayName(dateString: string): string {
  const [day, month, year] = dateString.split('-');
  const date = new Date(`${year}-${month}-${day}`);
  return date.toLocaleDateString('id-ID', { weekday: 'long' });
}
