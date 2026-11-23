import { useEffect, useState } from 'react';
import { AttendanceView } from './components/AttendanceView';
import { ClassBanner } from './components/ClassBanner';
import { DirectoryView } from './components/DirectoryView';
import { Header, type ActiveTab } from './components/Header';
import { LeadershipView } from './components/LeadershipView';
import { StudentModal } from './components/StudentModal';
import {
  SCHOOL_INFO,
  STUDENTS,
  getTodayISO,
  type AttendanceStatus,
  type Student,
} from './data/class6';

const STORAGE_KEYS = {
  logo: 'focus_c6_custom_logo',
  attendance: 'focus_c6_attendance_by_date',
  notes: 'focus_c6_student_notes',
} as const;

type AttendanceByDate = Record<string, Record<string, AttendanceStatus>>;

function safeLoadJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('directory');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(() => getTodayISO());

  const [customLogo, setCustomLogo] = useState<string | null>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.logo);
    } catch {
      return null;
    }
  });

  const [attendanceByDate, setAttendanceByDate] = useState<AttendanceByDate>(() =>
    safeLoadJSON<AttendanceByDate>(STORAGE_KEYS.attendance, {})
  );

  const [notes, setNotes] = useState<Record<string, string>>(() =>
    safeLoadJSON<Record<string, string>>(STORAGE_KEYS.notes, {})
  );

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEYS.attendance,
        JSON.stringify(attendanceByDate)
      );
    } catch {
      // Ignore storage quota errors
    }
  }, [attendanceByDate]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.notes, JSON.stringify(notes));
    } catch {
      // Ignore storage quota errors
    }
  }, [notes]);

  const handleUploadLogo = (dataUrl: string) => {
    setCustomLogo(dataUrl);
    try {
      localStorage.setItem(STORAGE_KEYS.logo, dataUrl);
    } catch {
      // Ignore storage quota errors
    }
  };

  const handleResetLogo = () => {
    setCustomLogo(null);
    try {
      localStorage.removeItem(STORAGE_KEYS.logo);
    } catch {
      // Ignore storage errors
    }
  };

  const todayISO = getTodayISO();
  const currentDayAttendance = attendanceByDate[selectedDate] ?? {};
  const todayAttendance = attendanceByDate[todayISO] ?? {};

  const setStudentAttendance = (
    date: string,
    studentId: string,
    status: AttendanceStatus | undefined
  ) => {
    setAttendanceByDate((prev) => {
      const nextDay = { ...(prev[date] ?? {}) };
      if (status === undefined) {
        delete nextDay[studentId];
      } else {
        nextDay[studentId] = status;
      }
      return { ...prev, [date]: nextDay };
    });
  };

  const handleMarkAllPresent = () => {
    setAttendanceByDate((prev) => {
      const allPresent: Record<string, AttendanceStatus> = {};
      for (const s of STUDENTS) {
        allPresent[s.id] = 'present';
      }
      return { ...prev, [selectedDate]: allPresent };
    });
  };

  const handleClearDay = () => {
    setAttendanceByDate((prev) => {
      const next = { ...prev };
      delete next[selectedDate];
      return next;
    });
  };

  const handleChangeNote = (studentId: string, note: string) => {
    setNotes((prev) => ({ ...prev, [studentId]: note }));
  };

  const activeLogoUrl = customLogo ?? SCHOOL_INFO.defaultLogoUrl;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onPrint={() => window.print()}
      />

      <ClassBanner
        logoUrl={activeLogoUrl}
        isCustomLogo={Boolean(customLogo)}
        onUploadLogo={handleUploadLogo}
        onResetLogo={handleResetLogo}
        onSelectStudent={setSelectedStudent}
        onJumpToLeadership={() => setActiveTab('leadership')}
      />

      <main className="max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 flex-1">
        {activeTab === 'directory' && (
          <DirectoryView
            todayAttendance={todayAttendance}
            notes={notes}
            onSelectStudent={setSelectedStudent}
          />
        )}

        {activeTab === 'leadership' && (
          <LeadershipView
            onSelectStudent={setSelectedStudent}
            onViewAllStudents={() => setActiveTab('directory')}
          />
        )}

        {activeTab === 'attendance' && (
          <AttendanceView
            selectedDate={selectedDate}
            onChangeDate={setSelectedDate}
            attendanceMap={currentDayAttendance}
            onSetStatus={(studentId, status) =>
              setStudentAttendance(selectedDate, studentId, status)
            }
            onMarkAllPresent={handleMarkAllPresent}
            onClearDay={handleClearDay}
          />
        )}
      </main>

      <footer className="bg-white border-t border-slate-200 py-5 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <p>
            {SCHOOL_INFO.name} · {SCHOOL_INFO.grade} Official Directory
          </p>
          <p>
            {SCHOOL_INFO.motto} · {SCHOOL_INFO.established} · In-Charge:{' '}
            {SCHOOL_INFO.inChargeName}
          </p>
        </div>
      </footer>

      <StudentModal
        student={selectedStudent}
        logoUrl={activeLogoUrl}
        todayDate={todayISO}
        todayStatus={selectedStudent ? todayAttendance[selectedStudent.id] : undefined}
        note={selectedStudent ? (notes[selectedStudent.id] ?? '') : ''}
        onClose={() => setSelectedStudent(null)}
        onSetAttendance={(studentId, status) =>
          setStudentAttendance(todayISO, studentId, status)
        }
        onChangeNote={handleChangeNote}
      />
    </div>
  );
}
