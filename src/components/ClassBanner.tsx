import { useRef, useState } from 'react';
import { Award, RotateCcw, Upload } from 'lucide-react';
import { CLASS_MONITORS, SCHOOL_INFO, STUDENTS, type Student } from '../data/class6';

interface ClassBannerProps {
  logoUrl: string;
  isCustomLogo: boolean;
  onUploadLogo: (dataUrl: string) => void;
  onResetLogo: () => void;
  onSelectStudent: (student: Student) => void;
  onJumpToLeadership: () => void;
}

export function ClassBanner({
  logoUrl,
  isCustomLogo,
  onUploadLogo,
  onResetLogo,
  onSelectStudent,
  onJumpToLeadership,
}: ClassBannerProps) {
  const [imgError, setImgError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setImgError(false);
        onUploadLogo(reader.result);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const regularCount = STUDENTS.length - CLASS_MONITORS.length;

  return (
    <section className="bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-7 sm:py-9">
        {/* School Crest & Identity Row */}
        <div className="flex flex-col sm:flex-row items-center sm:items-center gap-6">
          {/* School Logo with Custom Upload Support */}
          <div className="relative group shrink-0">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center overflow-hidden p-1">
              {!imgError ? (
                <img
                  src={logoUrl}
                  alt={`${SCHOOL_INFO.name} Logo`}
                  referrerPolicy="no-referrer"
                  onError={() => setImgError(true)}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-gradient-to-br from-red-700 to-amber-600 text-white flex flex-col items-center justify-center p-2 text-center">
                  <span className="text-[11px] font-extrabold tracking-wider uppercase leading-tight">
                    Focus
                  </span>
                  <span className="text-[9px] font-semibold leading-tight mt-0.5">
                    Schools &amp; Colleges
                  </span>
                  <span className="text-[8px] mt-1 font-mono opacity-90">
                    {SCHOOL_INFO.established}
                  </span>
                </div>
              )}
            </div>

            {/* Subtle Upload Logo Affordance */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              aria-label="Upload custom school logo"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              title="Upload custom school logo (logo.jpg)"
              className="no-print absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-600 hover:text-red-700 hover:border-red-300 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
            >
              <Upload className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
            {isCustomLogo && (
              <button
                type="button"
                onClick={() => {
                  setImgError(false);
                  onResetLogo();
                }}
                title="Restore default school crest"
                className="no-print absolute -top-1 -right-1 w-7 h-7 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-700"
              >
                <RotateCcw className="w-3 h-3" aria-hidden="true" />
              </button>
            )}
          </div>

          {/* Institutional Title & Unboxed Kicker */}
          <div className="text-center sm:text-left min-w-0">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs sm:text-sm font-medium text-red-700">
              <span>{SCHOOL_INFO.motto}</span>
              <span aria-hidden="true" className="text-slate-300">
                ·
              </span>
              <span className="font-mono tabular-nums text-slate-600">
                {SCHOOL_INFO.established}
              </span>
              <span aria-hidden="true" className="text-slate-300">
                ·
              </span>
              <span className="text-slate-600">{SCHOOL_INFO.grade}</span>
            </div>

            <h1 className="font-serif text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight mt-1.5 [text-wrap:balance]">
              {SCHOOL_INFO.name}
            </h1>

            <p className="text-slate-600 text-sm sm:text-base mt-1">
              {SCHOOL_INFO.directoryTitle}
            </p>
          </div>
        </div>

        {/* Hairline-Divided 3-Column Class Summary Strip */}
        <div className="mt-7 pt-6 border-t border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-0 md:divide-x md:divide-slate-200">
          {/* Class 6 In-Charge */}
          <div className="flex items-center gap-4 md:pr-6">
            <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-base tracking-wide shrink-0">
              {SCHOOL_INFO.inChargeInitials}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-slate-500">
                {SCHOOL_INFO.inChargeTitle}
              </p>
              <button
                type="button"
                onClick={onJumpToLeadership}
                className="text-lg font-bold text-slate-900 hover:text-red-700 transition-colors text-left cursor-pointer"
              >
                {SCHOOL_INFO.inChargeName}
              </button>
            </div>
          </div>

          {/* Class Monitors (3) */}
          <div className="flex items-center gap-4 md:px-6">
            <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-amber-800">
                Class Monitors (<span className="tabular-nums">{CLASS_MONITORS.length}</span>)
              </p>
              <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-sm font-semibold text-slate-900 mt-0.5">
                {CLASS_MONITORS.map((monitor, idx) => (
                  <span key={monitor.id} className="inline-flex items-center">
                    <button
                      type="button"
                      onClick={() => onSelectStudent(monitor)}
                      className="hover:text-red-700 underline-offset-2 hover:underline cursor-pointer transition-colors"
                    >
                      {monitor.name}
                    </button>
                    {idx < CLASS_MONITORS.length - 1 && (
                      <span className="text-slate-400 mr-0.5">,</span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Total Strength */}
          <div className="flex items-center gap-4 md:pl-6">
            <div className="w-12 h-12 rounded-xl bg-red-700 text-white flex items-center justify-center font-mono font-bold text-xl tabular-nums shrink-0">
              {STUDENTS.length}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-slate-500">Total Strength</p>
              <p className="text-lg font-bold text-slate-900 tabular-nums">
                {STUDENTS.length} Students
              </p>
              <p className="text-xs text-slate-500 tabular-nums">
                {CLASS_MONITORS.length} Monitors · {regularCount} Students
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
