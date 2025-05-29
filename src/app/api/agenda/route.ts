// app/api/agenda/route.ts
import { NextResponse } from 'next/server';
import { adminAuth } from '@/utils/firebaseAdmin';
import { db } from '@/utils/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const token = authHeader.split('Bearer ')[1];

  try {
    const decoded = await adminAuth.verifyIdToken(token);
    const uid = decoded.uid;

    const { searchParams } = new URL(req.url);
    const date = searchParams.get('date');
    
    if (!token || !date) return NextResponse.json({ activities: [], checked: [] }, { status: 400 });

    const userAgendaRef = doc(db, 'users', uid, 'agendas', date);
    const userSnap = await getDoc(userAgendaRef);

    const dayName = getDayName(date);
    const baseRef = doc(db, 'baseActivities', dayName);
    const baseSnap = await getDoc(baseRef);
    const activities = baseSnap.exists() ? baseSnap.data().activities : [];

    const checked = userSnap.exists() ? userSnap.data().checked || [] : [];

    return NextResponse.json({ activities, checked });
  } catch (error) {
    console.error('GET agenda error:', error);
    return NextResponse.json({ activities: [], checked: [] }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { date, checked } = await req.json();
    const token = req.headers.get('Authorization')?.split('Bearer ')[1];

    if (!token || !date || !Array.isArray(checked)) {
      return NextResponse.json({ message: 'Invalid data' }, { status: 400 });
    }

    const decoded = await adminAuth.verifyIdToken(token);
    const uid = decoded.uid;

    await setDoc(doc(db, 'users', uid, 'agendas', date), { checked });
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
