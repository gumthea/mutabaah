const formatDate = (date: string) => date.replace(/\//g, '-');

/**
 * Ambil aktivitas berdasarkan tanggal. Jika tidak ada, fallback ke nama hari.
 * @param date Tanggal lengkap, misal "26/05/2025"
 */
export async function getCustomAgenda(date: string): Promise<{ time: string; activity: string }[]> {
  try {
    const res = await fetch(`/api/agenda?date=${formatDate(date)}`);
    if (!res.ok) return [];
    const data = await res.json();
    return data.activities || [];
  } catch (error) {
    console.error('Failed to get custom agenda:', error);
    return [];
  }
}

/**
 * Simpan checklist untuk tanggal tertentu
 * @param date string Tanggal penuh (misal "26/05/2025")
 * @param checked number[] Index aktivitas yang dicentang
 */
export async function saveAgenda(date: string, checked: number[]) {
  try {
    await fetch('/api/agenda', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        date: formatDate(date), 
        checked 
      }),
    });
  } catch (error) {
    console.error('Failed to save agenda:', error);
  }
}
