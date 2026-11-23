import { useEffect } from 'react';
import { Award, Check, Clock, X } from 'lucide-react';
import {
  SCHOOL_INFO,
  formatReadableDate,
  getInitials,
  type AttendanceStatus,
  type Student,
} from '../data/class6';

interface StudentModalProps {
  student: Student | null;
  logoUrl: string;
  todayDate: string;
  todayStatus?: AttendanceStatus;
  note: string;
  onClose: () => void;
  onSetAttendance: (studentId: string, status: AttendanceStatus | undefined) => void;
  onChangeNote: (studentId: string, note: string) => void;
}

export function StudentModal({
  student,
  logoUrl,
  todayDate,
  todayStatus,
  note,
  onClose,
  onSetAttendance,
  onChangeNote,
}: StudentModalProps) {
  useEffect(() => {
    if (!student) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [student, onClose]);

  if (!student) return null;

  const isMonitor = student.role === 'Class Monitor';

  return (
    <div
      className="no-print fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="student-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Institutional Strip */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={logoUrl}
              alt={SCHOOL_INFO.name}
              referrerPolicy="no-referrer"
              className="w-9 h-9 rounded-full object-contain border border-slate-200 bg-white p-0.5 shrink-0"
            />
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-900 truncate">
                {SCHOOL_INFO.name}
              </p>
              <p className="text-xs text-slate-500">
                Official Class 6 Student Record
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close student record"
            className="w-9 h-9 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200/70 flex items-center justify-center transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Student Identity */}
          <div className="flex items-center gap-4">
            <div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-xl shrink-0 border ${
                isMonitor
                  ? 'bg-amber-50 border-amber-200 text-amber-800'
                  : 'bg-slate-100 border-slate-200 text-slate-700'
              }`}
            >
              {getInitials(student.name)}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="font-mono tabular-nums font-medium text-slate-700">
                  {student.rollCode}
                </span>
                <span aria-hidden="true">·</span>
                <span>Roll #{String(student.rollNumber).padStart(2, '0')}</span>
              </div>
              <h2
                id="student-modal-title"
                className="text-2xl font-bold text-slate-900 tracking-tight mt-0.5 truncate"
              >
                {student.name}
              </h2>
              <p
                className={`inline-flex items-center gap-1.5 text-sm mt-0.5 ${
                  isMonitor ? 'text-amber-800 font-semibold' : 'text-slate-600'
                }`}
              >
                {isMonitor && <Award className="w-4 h-4 shrink-0" aria-hidden="true" />}
                <span>{student.role}</span>
              </p>
            </div>
          </div>

          {/* Academic Details Definition List */}
          <dl className="grid grid-cols-2 gap-4 py-4 border-y border-slate-200 text-sm">
            <div>
              <dt className="text-xs text-slate-500">Class &amp; Section</dt>
              <dd className="font-semibold text-slate-900 mt-0.5">{SCHOOL_INFO.grade}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">Class In-Charge</dt>
              <dd className="font-semibold text-slate-900 mt-0.5">
                {SCHOOL_INFO.inChargeName}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">Roll Code</dt>
              <dd className="font-mono tabular-nums font-medium text-slate-900 mt-0.5">
                {student.rollCode}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">Institution</dt>
              <dd className="font-medium text-slate-900 mt-0.5">
                {SCHOOL_INFO.established}
              </dd>
            </div>
          </dl>

          {/* Quick Attendance Control */}
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-semibold text-slate-700">
                Attendance for {formatReadableDate(todayDate)}
              </span>
              {todayStatus && (
                <button
                  type="button"
                  onClick={() => onSetAttendance(student.id, undefined)}
                  className="text-xs text-slate-500 hover:text-slate-800 underline cursor-pointer"
                >
                  Clear status
                </button>
              )}
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  { value: 'present', label: 'Present', icon: Check },
                  { value: 'absent', label: 'Absent', icon: X },
                  { value: 'leave', label: 'Leave', icon: Clock },
                ] as const
              ).map(({ value, label, icon: Icon }) => {
                const active = todayStatus === value;
                const activeStyles =
                  value === 'present'
                    ? 'bg-emerald-700 text-white border-emerald-700'
                    : value === 'absent'
                      ? 'bg-red-700 text-white border-red-700'
                      : 'bg-amber-600 text-white border-amber-600';

                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => onSetAttendance(student.id, value)}
                    className={`inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg text-sm font-semibold border transition-colors cursor-pointer ${
                      active
                        ? activeStyles
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Local Teacher / Monitor Note */}
          <div>
            <label
              htmlFor="student-note-input"
              className="block text-xs font-semibold text-slate-700 mb-1.5"
            >
              Class Remark (saved on this device)
            </label>
            <textarea
              id="student-note-input"
              rows={2}
              value={note}
              onChange={(e) => onChangeNote(student.id, e.target.value)}
              placeholder="Add an optional remark, duty note, or parent contact note..."
              className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600 transition"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
