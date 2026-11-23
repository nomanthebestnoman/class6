export type StudentRole = 'Class Monitor' | 'Student';

export type AttendanceStatus = 'present' | 'absent' | 'leave';

export interface Student {
  id: string;
  rollNumber: number;
  rollCode: string;
  name: string;
  role: StudentRole;
}

export const SCHOOL_INFO = {
  name: 'Focus Group of Schools & Colleges',
  shortName: 'Focus Schools & Colleges',
  motto: 'Focus To Achieve',
  established: 'ESTD. 2022',
  grade: 'Class 6',
  directoryTitle: 'Class 6 — Official Student Directory',
  inChargeName: "Ma'am Bakhtawar",
  inChargeInitials: 'MB',
  inChargeTitle: 'Class 6 In-Charge',
  defaultLogoUrl: '/assets/aistudio/image_ad7350e9.png',
} as const;

const RAW_STUDENTS: Array<{ name: string; role: StudentRole }> = [
  { name: 'Zain Hassan', role: 'Student' },
  { name: 'Umar Ahmad', role: 'Student' },
  { name: 'Hashim Raza', role: 'Student' },
  { name: 'Abdullah', role: 'Student' },
  { name: 'Ahmad Fabian', role: 'Class Monitor' },
  { name: 'Ali Hasnain', role: 'Class Monitor' },
  { name: 'Mussa', role: 'Student' },
  { name: 'Haider Ali', role: 'Student' },
  { name: 'Noman', role: 'Class Monitor' },
  { name: 'Shahroz', role: 'Student' },
  { name: 'Shahriyar', role: 'Student' },
  { name: 'Ibad', role: 'Student' },
  { name: 'Ashir', role: 'Student' },
  { name: 'Ahmad Hassan', role: 'Student' },
  { name: 'Ahmad Nawaz', role: 'Student' },
  { name: 'Yahya', role: 'Student' },
  { name: 'Ameer Omais', role: 'Student' },
  { name: 'Fahad', role: 'Student' },
  { name: 'Fasi-ul-Hassan', role: 'Student' },
  { name: 'Ahad Ahmad', role: 'Student' },
  { name: 'Saad', role: 'Student' },
  { name: 'Ali Hussain', role: 'Student' },
  { name: 'Asif', role: 'Student' },
  { name: 'Aman', role: 'Student' },
  { name: 'Dabeer', role: 'Student' },
  { name: 'Taha', role: 'Student' },
  { name: 'Ali Hashim', role: 'Student' },
  { name: 'M. Hashim', role: 'Student' },
  { name: 'M. Ibrahim', role: 'Student' },
];

export const STUDENTS: Student[] = RAW_STUDENTS.map((item, idx) => {
  const rollNumber = idx + 1;
  const padded = String(rollNumber).padStart(2, '0');
  return {
    id: `c6-${padded}`,
    rollNumber,
    rollCode: `C6-${padded}`,
    name: item.name,
    role: item.role,
  };
});

export const CLASS_MONITORS: Student[] = [
  STUDENTS.find((s) => s.name === 'Ahmad Fabian')!,
  STUDENTS.find((s) => s.name === 'Noman')!,
  STUDENTS.find((s) => s.name === 'Ali Hasnain')!,
];

export function getInitials(name: string): string {
  const clean = name.replace(/[.-]/g, ' ').trim();
  const parts = clean.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'ST';
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function getTodayISO(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function formatReadableDate(isoDate: string): string {
  const [y, m, d] = isoDate.split('-').map(Number);
  if (!y || !m || !d) return isoDate;
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function downloadCSV(filename: string, rows: string[][]): void {
  const csvContent = rows
    .map((row) =>
      row
        .map((cell) => {
          const escaped = String(cell ?? '').replace(/"/g, '""');
          return `"${escaped}"`;
        })
        .join(',')
    )
    .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
