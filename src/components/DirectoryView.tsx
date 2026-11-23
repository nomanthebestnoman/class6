import { useMemo, useState } from 'react';
import {
  ArrowUpDown,
  Award,
  Download,
  LayoutGrid,
  List,
  Search,
  X,
} from 'lucide-react';
import {
  CLASS_MONITORS,
  STUDENTS,
  downloadCSV,
  getInitials,
  type AttendanceStatus,
  type Student,
} from '../data/class6';

type RoleFilter = 'all' | 'monitor' | 'student';
type SortMode = 'roll' | 'name-asc' | 'monitors-first';
type ViewMode = 'grid' | 'table';

interface DirectoryViewProps {
  todayAttendance: Record<string, AttendanceStatus>;
  notes: Record<string, string>;
  onSelectStudent: (student: Student) => void;
}

const STATUS_LABELS: Record<AttendanceStatus, { text: string; className: string }> = {
  present: { text: 'Present', className: 'text-emerald-700 font-medium' },
  absent: { text: 'Absent', className: 'text-red-700 font-medium' },
  leave: { text: 'Leave', className: 'text-amber-700 font-medium' },
};

export function DirectoryView({
  todayAttendance,
  notes,
  onSelectStudent,
}: DirectoryViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<RoleFilter>('all');
  const [sortMode, setSortMode] = useState<SortMode>('roll');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  const regularCount = STUDENTS.length - CLASS_MONITORS.length;

  const filteredStudents = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    const matched = STUDENTS.filter((student) => {
      if (filter === 'monitor' && student.role !== 'Class Monitor') return false;
      if (filter === 'student' && student.role !== 'Student') return false;
      if (!q) return true;
      return (
        student.name.toLowerCase().includes(q) ||
        student.rollCode.toLowerCase().includes(q) ||
        String(student.rollNumber).padStart(2, '0').includes(q) ||
        student.role.toLowerCase().includes(q)
      );
    });

    const sorted = [...matched];
    if (sortMode === 'name-asc') {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortMode === 'monitors-first') {
      sorted.sort((a, b) => {
        if (a.role !== b.role) {
          return a.role === 'Class Monitor' ? -1 : 1;
        }
        return a.rollNumber - b.rollNumber;
      });
    } else {
      sorted.sort((a, b) => a.rollNumber - b.rollNumber);
    }

    return sorted;
  }, [searchQuery, filter, sortMode]);

  const handleExportCSV = () => {
    const rows: string[][] = [
      ['Roll No', 'Roll Code', 'Student Name', 'Role', 'Today Attendance', 'Remark'],
      ...filteredStudents.map((s) => [
        String(s.rollNumber),
        s.rollCode,
        s.name,
        s.role,
        todayAttendance[s.id] ? STATUS_LABELS[todayAttendance[s.id]].text : 'Unmarked',
        notes[s.id] ?? '',
      ]),
    ];
    downloadCSV('class-6-focus-schools-directory.csv', rows);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setFilter('all');
    setSortMode('roll');
  };

  return (
    <div className="space-y-6">
      {/* Search, Filter, Sort & Layout Toolbar */}
      <div className="no-print flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search
              className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search student by name or roll no..."
              aria-label="Search students"
              className="w-full pl-10 pr-9 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600 transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded text-slate-400 hover:text-slate-700 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            )}
          </div>

          {/* Interactive Filter Segmented Control */}
          <div
            role="tablist"
            aria-label="Filter students by role"
            className="inline-flex items-center gap-1 p-1 bg-slate-200/70 rounded-lg self-start lg:self-auto"
          >
            {(
              [
                { id: 'all', label: `All Students (${STUDENTS.length})` },
                { id: 'monitor', label: `Class Monitors (${CLASS_MONITORS.length})` },
                { id: 'student', label: `Students (${regularCount})` },
              ] as const
            ).map((tab) => {
              const active = filter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setFilter(tab.id)}
                  className={`px-3.5 py-1.5 rounded-md text-xs sm:text-sm font-semibold whitespace-nowrap shrink-0 transition-all duration-150 cursor-pointer tabular-nums ${
                    active
                      ? 'bg-red-700 text-white shadow-xs'
                      : 'text-slate-700 hover:text-slate-950'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Secondary Utility Row: Count, Sort, View Switcher, CSV Export */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <p className="text-xs sm:text-sm text-slate-600 tabular-nums">
            Showing <span className="font-semibold text-slate-900">{filteredStudents.length}</span>{' '}
            of {STUDENTS.length} students
            {searchQuery.trim() && (
              <span>
                {' '}
                matching <span className="font-medium text-slate-900">"{searchQuery.trim()}"</span>
              </span>
            )}
          </p>

          <div className="flex flex-wrap items-center gap-2">
            {/* Sort Select */}
            <div className="inline-flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs sm:text-sm text-slate-700">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
              <label htmlFor="sort-students" className="sr-only">
                Sort students
              </label>
              <select
                id="sort-students"
                value={sortMode}
                onChange={(e) => setSortMode(e.target.value as SortMode)}
                className="bg-transparent font-medium text-slate-800 focus:outline-none cursor-pointer pr-1"
              >
                <option value="roll">Roll Order (01–29)</option>
                <option value="name-asc">Name (A–Z)</option>
                <option value="monitors-first">Monitors First</option>
              </select>
            </div>

            {/* Grid / Table Toggle */}
            <div className="inline-flex items-center p-0.5 bg-white border border-slate-200 rounded-lg">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                aria-label="Card grid view"
                aria-pressed={viewMode === 'grid'}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Cards</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                aria-label="Roster table view"
                aria-pressed={viewMode === 'table'}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  viewMode === 'table'
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <List className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Table</span>
              </button>
            </div>

            {/* Export CSV */}
            <button
              type="button"
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-xs sm:text-sm font-medium text-slate-700 whitespace-nowrap shrink-0 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* Empty Search State */}
      {filteredStudents.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl py-14 px-6 text-center">
          <p className="text-base font-semibold text-slate-900">
            No student found matching your search
          </p>
          <p className="text-sm text-slate-500 mt-1">
            Try searching with a different name or roll number, or reset the active filter.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="mt-4 inline-flex items-center px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold transition-colors cursor-pointer"
          >
            Reset Search &amp; Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* Students Card Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStudents.map((student) => {
            const isMonitor = student.role === 'Class Monitor';
            const status = todayAttendance[student.id];
            const hasNote = Boolean(notes[student.id]?.trim());

            return (
              <button
                key={student.id}
                type="button"
                onClick={() => onSelectStudent(student)}
                className={`student-card group text-left w-full rounded-xl border p-4 transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 ${
                  isMonitor
                    ? 'bg-amber-50/40 border-amber-200/90 hover:border-amber-300 hover:bg-amber-50/70'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  {/* Monogram Avatar */}
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 border transition-colors ${
                      isMonitor
                        ? 'bg-amber-100/90 border-amber-300/80 text-amber-900'
                        : 'bg-slate-100 border-slate-200 text-slate-700 group-hover:bg-slate-900 group-hover:border-slate-900 group-hover:text-white'
                    }`}
                  >
                    {getInitials(student.name)}
                  </div>

                  {/* Student Details */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-xs tabular-nums text-slate-500">
                        Roll {String(student.rollNumber).padStart(2, '0')}
                      </span>
                      {status && (
                        <span
                          className={`no-print text-xs ${STATUS_LABELS[status].className}`}
                        >
                          {STATUS_LABELS[status].text}
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-slate-900 truncate mt-0.5">
                      {student.name}
                    </h3>

                    <div className="flex items-center gap-1.5 text-xs mt-0.5">
                      {isMonitor ? (
                        <span className="inline-flex items-center gap-1 font-semibold text-amber-800">
                          <Award className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                          <span>Class Monitor</span>
                        </span>
                      ) : (
                        <span className="text-slate-500">Student</span>
                      )}
                      {hasNote && (
                        <>
                          <span aria-hidden="true" className="no-print text-slate-300">
                            ·
                          </span>
                          <span className="no-print text-slate-500 truncate">
                            Note added
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        /* Students Tabular Roster View */
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600">
                  <th className="py-3 px-4 w-24">Roll No</th>
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Today&apos;s Status</th>
                  <th className="no-print py-3 px-4 text-right">Record</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredStudents.map((student) => {
                  const isMonitor = student.role === 'Class Monitor';
                  const status = todayAttendance[student.id];

                  return (
                    <tr
                      key={student.id}
                      onClick={() => onSelectStudent(student)}
                      className="hover:bg-slate-50/90 transition-colors cursor-pointer"
                    >
                      <td className="py-3 px-4 font-mono text-xs tabular-nums text-slate-600 whitespace-nowrap">
                        {student.rollCode}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        <div className="flex items-center gap-3">
                          <span
                            className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 border ${
                              isMonitor
                                ? 'bg-amber-50 border-amber-200 text-amber-900'
                                : 'bg-slate-100 border-slate-200 text-slate-700'
                            }`}
                          >
                            {getInitials(student.name)}
                          </span>
                          <span>{student.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        {isMonitor ? (
                          <span className="inline-flex items-center gap-1.5 text-amber-800 font-semibold">
                            <Award className="w-4 h-4 shrink-0" aria-hidden="true" />
                            <span>Class Monitor</span>
                          </span>
                        ) : (
                          <span className="text-slate-600">Student</span>
                        )}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        {status ? (
                          <span className={STATUS_LABELS[status].className}>
                            {STATUS_LABELS[status].text}
                          </span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                      <td className="no-print py-3 px-4 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectStudent(student);
                          }}
                          className="text-xs font-semibold text-red-700 hover:text-red-800 underline-offset-2 hover:underline cursor-pointer"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
