// scripts/seedAgenda.ts
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/utils/firebase';

const baseAgenda = [
  { time: '03.30 - 04.30', activity: 'Qiyamullail, Salat Subuh, dzikir' },
  { time: '04.30 - 05.30', activity: 'Murajaah 1 juz (tilawah tartil)' },
  { time: '05.30 - 06.00', activity: 'Makan pagi & istirahat' },
  { time: '06.00 - 07.00', activity: 'Hafalan Baru (½ - 1 halaman)' },
  { time: '07.00 - 08.00', activity: 'Belajar Matematika' },
  { time: '08.00 - 08.30', activity: 'Olahraga ringan' },
  { time: '08.30 - 09.30', activity: 'Belajar Bahasa Inggris' },
  { time: '09.30 - 10.30', activity: 'Murajaah mendalam (2 juz)' },
  { time: '10.30 - 11.00', activity: 'Istirahat ringan' },
  { time: '11.00 - 12.30', activity: 'Salat Dzuhur & istirahat siang' },
  { time: '12.30 - 13.30', activity: 'Latihan Vokal + rekaman' },
  { time: '13.30 - 14.30', activity: 'Murajaah hafalan kemarin' },
  { time: '14.30 - 15.30', activity: 'Waktu bebas / bantu orang tua' },
  { time: '15.30 - 16.00', activity: 'Salat Ashar' },
  { time: '16.00 - 17.00', activity: 'Tilawah santai / setoran ringan' },
  { time: '17.00 - 18.00', activity: 'Makan sore, persiapan Maghrib' },
  { time: '18.00 - 19.00', activity: 'Salat Maghrib + dzikir' },
  { time: '19.00 - 19.45', activity: 'Hafalan Baru (penguatan malam)' },
  { time: '19.45 - 20.15', activity: 'Salat Isya + dzikir' },
  { time: '20.15 - 20.45', activity: 'Murajaah 1 juz pendek' },
  { time: '20.45 - 21.00', activity: 'Doa + refleksi hafalan hari ini' }
];

const customAdjustments: Record<string, { index: number, activity: string }[]> = {
  'Rabu': [{ index: 15, activity: 'Les Bahasa Inggris (privat di tempat les)' }],
  'Kamis': [{ index: 12, activity: 'Les Matematika (privat di tempat les)' }],
};

const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

async function seedAgenda() {
  for (const day of days) {
    const agenda = [...baseAgenda];

    if (customAdjustments[day]) {
      customAdjustments[day].forEach(({ index, activity }) => {
        agenda[index].activity = activity;
      });
    }

    await setDoc(doc(db, 'agendas', day), { agenda });
    console.log(`Seeded agenda for ${day}`);
  }
}

seedAgenda().then(() => console.log('All agendas seeded!')).catch(console.error);
