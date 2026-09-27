import React, { useState } from 'react';
import { 
  BarChart3, 
  Download, 
  Printer, 
  Calendar, 
  Filter, 
  FileSpreadsheet, 
  Share2, 
  Check, 
  Clock, 
  Users, 
  Palmtree,
  XCircle,
  Copy
} from 'lucide-react';
import { Member, AttendanceRecord, Department } from '../types';
import { toPersianDigits, getStatusBadgeInfo, exportAttendanceToCSV } from '../utils/helpers';

interface ReportsViewProps {
  members: Member[];
  records: AttendanceRecord[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({ members, records }) => {
  const [selectedMemberId, setSelectedMemberId] = useState<string>('all');
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'all'>('all');
  const [copied, setCopied] = useState(false);

  // Filter records
  const filteredRecords = records.filter((rec) => {
    // Member filter
    if (selectedMemberId !== 'all' && rec.memberId !== selectedMemberId) return false;

    // Find member to check department
    const member = members.find((m) => m.id === rec.memberId);
    if (selectedDept !== 'all' && member?.department !== selectedDept) return false;

    // Status filter
    if (selectedStatus !== 'all') {
      if (selectedStatus === 'present' && !(rec.status === 'present' || rec.status === 'left' || rec.status === 'late')) {
        return false;
      }
      if (selectedStatus === 'leave' && rec.status !== 'leave') return false;
      if (selectedStatus === 'absent' && rec.status !== 'absent') return false;
    }

    // Date range filter
    if (dateRange === 'today') {
      return rec.date === '۱۴۰۵/۰۷/۰۵';
    }

    return true;
  });

  // Calculate stats for filtered set
  const totalEntries = filteredRecords.length;
  const presentCount = filteredRecords.filter(r => r.status === 'present' || r.status === 'left' || r.status === 'late').length;
  const leaveCount = filteredRecords.filter(r => r.status === 'leave').length;
  const absentCount = filteredRecords.filter(r => r.status === 'absent').length;
  const totalHours = filteredRecords.reduce((acc, curr) => acc + (curr.workHours || 0), 0);

  const handleExportCSV = () => {
    const rows = filteredRecords.map((r) => {
      const member = members.find(m => m.id === r.memberId);
      const badge = getStatusBadgeInfo(r.status);
      return {
        memberName: member?.name || 'عضو نامشخص',
        employeeCode: member?.employeeCode || '-',
        department: member?.department || '-',
        date: `${r.date} (${r.dayName})`,
        status: badge.label,
        entryTime: r.entryTime || '-',
        exitTime: r.exitTime || '-',
        workDuration: r.workDurationFormatted || (r.workHours ? `${r.workHours} ساعت` : '-'),
        note: r.note || '',
      };
    });

    exportAttendanceToCSV(rows);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopySummary = () => {
    const text = `گزارش حضور و غیاب سامانه یار:\nکل رکوردها: ${totalEntries}\nتعداد حاضرین: ${presentCount}\nمرخصی: ${leaveCount}\nغایب: ${absentCount}\nمجموع ساعات کارکرد: ${totalHours.toFixed(1)} ساعت`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner and Export Actions */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span>📈</span>
            <span>گزارش‌های جامع و آماری حضور و غیاب</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            فیلتر بر اساس بازه تاریخ، دپارتمان و اعضا به همراه دریافت خروجی استاندارد
          </p>
        </div>

        {/* Export Buttons (Phase 7 Requirement) */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-xs border border-emerald-500/40 flex items-center gap-2 transition-all cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>خروجی اکسل (CSV)</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl border border-slate-300 flex items-center gap-2 transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>چاپ گزارش</span>
          </button>

          <button
            onClick={handleCopySummary}
            className="px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
            <span>{copied ? 'کپی شد!' : 'کپی خلاصه'}</span>
          </button>
        </div>
      </div>

      {/* Filter Matrix (Phase 7 Requirement: Date range & dropdowns) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 mb-3">
          <Filter className="w-4 h-4 text-emerald-600" />
          <span>فیلترهای گزارش‌گیری:</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* Date range */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              بازه زمانی 📅:
            </label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as any)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="all">تمام تاریخ‌ها (مهر ۱۴۰۵)</option>
              <option value="today">امروز (۵ مهر ۱۴۰۵)</option>
              <option value="week">هفته جاری</option>
              <option value="month">ماه جاری (مهر)</option>
            </select>
          </div>

          {/* Member selector */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              انتخاب پرسنل 👤:
            </label>
            <select
              value={selectedMemberId}
              onChange={(e) => setSelectedMemberId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="all">همه پرسنل سازمان</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.employeeCode})
                </option>
              ))}
            </select>
          </div>

          {/* Department selector */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              دپارتمان سازمانی:
            </label>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="all">همه دپارتمان‌ها</option>
              <option value="فنی و مهندسی">فنی و مهندسی</option>
              <option value="طراحی محصول">طراحی محصول</option>
              <option value="مارکتینگ و فروش">مارکتینگ و فروش</option>
              <option value="پشتیبانی مشتریان">پشتیبانی مشتریان</option>
              <option value="منابع انسانی و مالی">منابع انسانی و مالی</option>
            </select>
          </div>

          {/* Status selector */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              وضعیت تردد:
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="all">همه وضعیت‌ها</option>
              <option value="present">فقط حاضرین</option>
              <option value="leave">فقط مرخصی‌ها</option>
              <option value="absent">فقط غایبین</option>
            </select>
          </div>
        </div>
      </div>

      {/* Filtered Summary Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-2xs">
          <span className="text-[11px] text-slate-500 font-medium">تعداد رکوردهای انتخابی</span>
          <div className="text-xl font-black text-slate-800 font-mono tabular-nums mt-1">
            {toPersianDigits(totalEntries)} مورد
          </div>
        </div>

        <div className="bg-white rounded-xl border border-emerald-200 p-3.5 shadow-2xs">
          <span className="text-[11px] text-emerald-700 font-medium">کل روزهای حضور</span>
          <div className="text-xl font-black text-emerald-700 font-mono tabular-nums mt-1">
            {toPersianDigits(presentCount)} روز
          </div>
        </div>

        <div className="bg-white rounded-xl border border-amber-200 p-3.5 shadow-2xs">
          <span className="text-[11px] text-amber-700 font-medium">کل روزهای مرخصی</span>
          <div className="text-xl font-black text-amber-700 font-mono tabular-nums mt-1">
            {toPersianDigits(leaveCount)} روز
          </div>
        </div>

        <div className="bg-white rounded-xl border border-blue-200 p-3.5 shadow-2xs">
          <span className="text-[11px] text-blue-700 font-medium">مجموع ساعات ثبت‌شده</span>
          <div className="text-xl font-black text-blue-700 font-mono tabular-nums mt-1">
            {toPersianDigits(totalHours.toFixed(1))} ساعت
          </div>
        </div>
      </div>

      {/* Detailed Reports Table (Phase 7 Requirement) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden print:border-none print:shadow-none">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-bold text-slate-600">
                <th className="py-3 px-4">نام پرسنل</th>
                <th className="py-3 px-4">کد پرسنلی</th>
                <th className="py-3 px-4">دپارتمان</th>
                <th className="py-3 px-4">تاریخ تردد</th>
                <th className="py-3 px-4">وضعیت</th>
                <th className="py-3 px-4">ساعت ورود</th>
                <th className="py-3 px-4">ساعت خروج</th>
                <th className="py-3 px-4">مدت حضور</th>
                <th className="py-3 px-4">توضیحات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    رکوردی مطابق با فیلترهای انتخابی یافت نشد.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((r) => {
                  const member = members.find(m => m.id === r.memberId);
                  const badge = getStatusBadgeInfo(r.status);

                  return (
                    <tr key={r.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Name */}
                      <td className="py-3 px-4 font-bold text-slate-900">
                        <div className="flex items-center gap-2">
                          {member?.avatar && (
                            <img
                              src={member.avatar}
                              alt={member.name}
                              referrerPolicy="no-referrer"
                              className="w-7 h-7 rounded-lg object-cover border border-slate-200 shrink-0 print:hidden"
                            />
                          )}
                          <span>{member?.name || 'عضو نامشخص'}</span>
                        </div>
                      </td>

                      {/* Code */}
                      <td className="py-3 px-4 font-mono text-slate-600">
                        {member?.employeeCode || '-'}
                      </td>

                      {/* Department */}
                      <td className="py-3 px-4 text-slate-700">
                        {member?.department || '-'}
                      </td>

                      {/* Date */}
                      <td className="py-3 px-4 font-mono font-medium text-slate-800">
                        {r.date} <span className="text-[11px] text-slate-400 font-sans">({r.dayName})</span>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg border text-[11px] font-bold ${badge.badgeBg} ${badge.textColor} ${badge.borderColor}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${badge.dotColor}`} />
                          {badge.label}
                        </span>
                      </td>

                      {/* Entry */}
                      <td className="py-3 px-4 font-mono tabular-nums text-slate-800">
                        {r.entryTime || '-'}
                      </td>

                      {/* Exit */}
                      <td className="py-3 px-4 font-mono tabular-nums text-slate-800">
                        {r.exitTime || '-'}
                      </td>

                      {/* Duration */}
                      <td className="py-3 px-4 font-bold text-slate-800">
                        {r.workDurationFormatted || (r.workHours ? `${toPersianDigits(r.workHours)} ساعت` : '-')}
                      </td>

                      {/* Note */}
                      <td className="py-3 px-4 text-slate-500 max-w-[200px] truncate" title={r.note}>
                        {r.note || '-'}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
