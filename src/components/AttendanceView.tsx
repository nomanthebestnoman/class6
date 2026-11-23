import { useMemo, useState } from 'react';
import {
  Award,
  Calendar,
  Check,
  CheckCheck,
  Clock,
  Copy,
  Download,
  RotateCcw,
  X,
} from 'lucide-react';
import {
  SCHOOL_INFO,
  STUDENTS,
  downloadCSV,
  formatReadableDate,
  type AttendanceStatus,
} from '../data/class6';

interface AttendanceViewProps {
  selectedDate: string;
  onChangeDate: (date: string) => void;
  attendanceMap: Record<string, AttendanceStatus>;
  onSetStatus: (studentId: string, status: AttendanceStatus | undefined) => void;
  onMarkAllPresent: () => void;
  onClearDay: () => void;
}

export function AttendanceView({
  selectedDate,
  onChangeDate,
  attendanceMap,
  onSetStatus,
  onMarkAllPresent,
  onClearDay,
}: AttendanceViewProps) {
  const [copied, setCopied] = useState(false);

  const summary = useMemo(() => {
    let present = 0;
    let absent = 0;
    let leave = 0;
    for (const student of STUDENTS) {
      const s = attendanceMap[student.id];
      if (s === 'present') present++;
      else if (s === 'absent') absent++;
      else if (s === 'leave') leave++;
    }
    const unmarked = STUDENTS.length - (present + absent + leave);
    return { present, absent, leave, unmarked };
  }, [attendanceMap]);

  const handleCopySummary = async () => {
    const absentNames = STUDENTS.filter((s) => attendanceMap[s.id] === 'absent').map(
      (s) => s.name
    );
    const leaveNames = STUDENTS.filter((s) => attendanceMap[s.id] === 'leave').map(
      (s) => s.name
    );

    const lines = [
      `${SCHOOL_INFO.name} — ${SCHOOL_INFO.grade} Attendance`,
      `Date: ${formatReadableDate(selectedDate)}`,
      `Class In-Charge: ${SCHOOL_INFO.inChargeName}`,
      `Total: ${STUDENTS.length} | Present: ${summary.present} | Absent: ${summary.absent} | Leave: ${summary.leave}`,
    ];
    if (absentNames.length > 0) lines.push(`Absent: ${absentNames.join(', ')}`);
    if (leaveNames.length > 0) lines.push(`On Leave: ${leaveNames.join(', ')}`);

    try {
      await navigator.clipboard.writeText(lines.join('\n'));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked in restricted context — silently skip
    }
  };

  const handleExportAttendanceCSV = () => {
    const rows: string[][] = [
      ['Date', 'Roll No', 'Roll Code', 'Student Name', 'Role', 'Status'],
      ...STUDENTS.map((s) => {
        const st = attendanceMap[s.id];
        const label = st
          ? st.charAt(0).toUpperCase() + st.slice(1)
          : 'Unmarked';
        return [selectedDate, String(s.rollNumber), s.rollCode, s.name, s.role, label];
      }),
    ];
    downloadCSV(`class-6-attendance-${selectedDate}.csv`, rows);
  };

  return (
    <div className="space-y-6">
      {/* Attendance Header & Date Selector */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <p className="text-xs font-semibold text-red-700">
            Daily Attendance Register
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
            {formatReadableDate(selectedDate)}
          </h2>
        </div>

        <div className="no-print flex flex-wrap items-center gap-2.5">
          <label className="inline-flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700">
            <Calendar className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
            <span className="sr-only">Attendance date</span>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => {
                if (e.target.value) onChangeDate(e.target.value);
              }}
              className="bg-transparent font-medium text-slate-900 focus:outline-none cursor-pointer"
            />
          </label>

          <button
            type="button"
            onClick={onMarkAllPresent}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer"
          >
            <CheckCheck className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>Mark All Present</span>
          </button>

          <button
            type="button"
            onClick={onClearDay}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-xs sm:text-sm font-medium text-slate-700 whitespace-nowrap shrink-0 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Tabular Summary Strip */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8">
          <div>
            <p className="text-xs text-slate-500">Present</p>
            <p className="text-xl font-mono font-bold tabular-nums text-emerald-700 mt-0.5">
              {summary.present}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Absent</p>
            <p className="text-xl font-mono font-bold tabular-nums text-red-700 mt-0.5">
              {summary.absent}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Leave</p>
            <p className="text-xl font-mono font-bold tabular-nums text-amber-700 mt-0.5">
              {summary.leave}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Unmarked</p>
            <p className="text-xl font-mono font-bold tabular-nums text-slate-700 mt-0.5">
              {summary.unmarked}
            </p>
          </div>
        </div>

        <div className="no-print flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopySummary}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 whitespace-nowrap shrink-0 transition-colors cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span>{copied ? 'Copied Summary' : 'Copy Summary'}</span>
          </button>
          <button
            type="button"
            onClick={handleExportAttendanceCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 whitespace-nowrap shrink-0 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600">
                <th className="py-3 px-4 w-20">Roll</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4 hidden sm:table-cell">Role</th>
                <th className="py-3 px-4 text-right">Attendance Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {STUDENTS.map((student) => {
                const status = attendanceMap[student.id];
                const isMonitor = student.role === 'Class Monitor';

                return (
                  <tr key={student.id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-4 font-mono text-xs tabular-nums text-slate-500 whitespace-nowrap">
                      {String(student.rollNumber).padStart(2, '0')}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      <span>{student.name}</span>
                      {isMonitor && (
                        <span className="sm:hidden block text-xs font-medium text-amber-800 mt-0.5">
                          Class Monitor
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 hidden sm:table-cell whitespace-nowrap">
                      {isMonitor ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-800">
                          <Award className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                          <span>Class Monitor</span>
                        </span>
                      ) : (
                        <span className="text-xs text-slate-500">Student</span>
                      )}
                    </td>
                    <td className="py-2.5 px-4 text-right whitespace-nowrap">
                      {/* Print-only plain status text */}
                      <span className="hidden print-only text-xs font-semibold text-slate-800">
                        {status
                          ? status.charAt(0).toUpperCase() + status.slice(1)
                          : 'Unmarked'}
                      </span>

                      {/* Interactive status selector */}
                      <div className="no-print inline-flex items-center gap-1">
                        {(
                          [
                            {
                              value: 'present',
                              label: 'Present',
                              icon: Check,
                              activeClass:
                                'bg-emerald-700 text-white border-emerald-700',
                            },
                            {
                              value: 'absent',
                              label: 'Absent',
                              icon: X,
                              activeClass: 'bg-red-700 text-white border-red-700',
                            },
                            {
                              value: 'leave',
                              label: 'Leave',
                              icon: Clock,
                              activeClass:
                                'bg-amber-600 text-white border-amber-600',
                            },
                          ] as const
                        ).map(({ value, label, icon: Icon, activeClass }) => {
                          const isSelected = status === value;
                          return (
                            <button
                              key={value}
                              type="button"
                              onClick={() =>
                                onSetStatus(
                                  student.id,
                                  isSelected ? undefined : value
                                )
                              }
                              aria-pressed={isSelected}
                              className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-semibold border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                                isSelected
                                  ? activeClass
                                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                              }`}
                            >
                              <Icon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                              <span>{label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
