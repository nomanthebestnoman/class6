import { ArrowRight, Award, BookOpen } from 'lucide-react';
import {
  CLASS_MONITORS,
  SCHOOL_INFO,
  STUDENTS,
  getInitials,
  type Student,
} from '../data/class6';

interface LeadershipViewProps {
  onSelectStudent: (student: Student) => void;
  onViewAllStudents: () => void;
}

export function LeadershipView({
  onSelectStudent,
  onViewAllStudents,
}: LeadershipViewProps) {
  return (
    <div className="space-y-8">
      {/* Section Heading */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <p className="text-xs font-semibold text-red-700">
            Class 6 Academic Leadership
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
            Class In-Charge &amp; Student Monitors
          </h2>
        </div>
        <button
          type="button"
          onClick={onViewAllStudents}
          className="no-print inline-flex items-center gap-1.5 text-sm font-semibold text-red-700 hover:text-red-800 whitespace-nowrap shrink-0 cursor-pointer"
        >
          <span>View all {STUDENTS.length} students</span>
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>

      {/* Class In-Charge Feature Row */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold text-2xl tracking-wide shrink-0">
            {SCHOOL_INFO.inChargeInitials}
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">
              {SCHOOL_INFO.inChargeTitle} · {SCHOOL_INFO.grade}
            </p>
            <h3 className="text-2xl font-bold text-slate-900 mt-0.5">
              {SCHOOL_INFO.inChargeName}
            </h3>
            <p className="text-sm text-slate-600 mt-1 max-w-xl">
              Faculty supervisor overseeing daily attendance, classroom discipline,
              and academic progress for all {STUDENTS.length} students of{' '}
              {SCHOOL_INFO.grade} at {SCHOOL_INFO.name}.
            </p>
          </div>
        </div>

        <div className="shrink-0 sm:text-right border-t sm:border-t-0 pt-4 sm:pt-0 border-slate-100">
          <div className="inline-flex items-center gap-2 text-xs font-medium text-slate-500">
            <BookOpen className="w-4 h-4 text-red-700" aria-hidden="true" />
            <span>Supervised Strength</span>
          </div>
          <p className="text-2xl font-mono font-bold tabular-nums text-slate-900 mt-1">
            {STUDENTS.length} Students
          </p>
          <p className="text-xs text-slate-500 tabular-nums mt-0.5">
            {CLASS_MONITORS.length} Appointed Monitors
          </p>
        </div>
      </div>

      {/* Class Monitors Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-900">
            Appointed Class Monitors ({CLASS_MONITORS.length})
          </h3>
          <p className="text-xs text-slate-500">
            Select a monitor to open their student record
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {CLASS_MONITORS.map((monitor, idx) => (
            <button
              key={monitor.id}
              type="button"
              onClick={() => onSelectStudent(monitor)}
              className="student-card text-left bg-white border border-amber-200 hover:border-amber-300 rounded-xl p-5 transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-offset-2"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="w-14 h-14 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center justify-center font-bold text-lg shrink-0">
                  {getInitials(monitor.name)}
                </div>
                <span className="font-mono text-xs tabular-nums text-slate-500">
                  {monitor.rollCode}
                </span>
              </div>

              <div className="mt-4">
                <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-800">
                  <Award className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  <span>Class Monitor #{idx + 1}</span>
                </p>
                <h4 className="text-xl font-bold text-slate-900 mt-1">
                  {monitor.name}
                </h4>
                <p className="text-xs text-slate-500 mt-1 tabular-nums">
                  Roll No. {String(monitor.rollNumber).padStart(2, '0')} · {SCHOOL_INFO.grade}
                </p>
              </div>

              <div className="no-print mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-red-700">
                <span>Open Student Record</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
