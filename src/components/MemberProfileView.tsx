import React, { useState } from 'react';
import { 
  ArrowRight, 
  Calendar, 
  Clock, 
  Phone, 
  Mail, 
  CheckCircle2, 
  XCircle, 
  Palmtree, 
  AlertCircle,
  FileText,
  Plus,
  Trash2,
  Award,
  ShieldAlert,
  Send,
  Building2,
  Hash
} from 'lucide-react';
import { Member, AttendanceRecord, AdminNote } from '../types';
import { toPersianDigits, getStatusBadgeInfo, getCurrentPersianTime } from '../utils/helpers';

interface MemberProfileViewProps {
  member: Member;
  attendanceHistory: AttendanceRecord[];
  adminNotes: AdminNote[];
  onBack: () => void;
  onAddAdminNote: (memberId: string, content: string, category: AdminNote['category']) => void;
  onDeleteAdminNote: (noteId: string) => void;
}

export const MemberProfileView: React.FC<MemberProfileViewProps> = ({
  member,
  attendanceHistory,
  adminNotes,
  onBack,
  onAddAdminNote,
  onDeleteAdminNote,
}) => {
  const [newNoteContent, setNewNoteContent] = useState('');
  const [newNoteCategory, setNewNoteCategory] = useState<AdminNote['category']>('general');
  const [historyFilter, setHistoryFilter] = useState<'all' | 'present' | 'leave' | 'absent'>('all');

  // Stats for this member
  const memberRecords = attendanceHistory.filter(r => r.memberId === member.id);
  const presentDays = memberRecords.filter(r => r.status === 'present' || r.status === 'left' || r.status === 'late').length;
  const absentDays = memberRecords.filter(r => r.status === 'absent').length;
  const leaveDays = memberRecords.filter(r => r.status === 'leave').length;
  const totalWorkHours = memberRecords.reduce((acc, curr) => acc + (curr.workHours || 0), 0);
  const disciplineScore = memberRecords.length > 0 
    ? Math.round(((presentDays + (leaveDays * 0.8)) / memberRecords.length) * 100) 
    : 95;

  const filteredHistory = memberRecords.filter(r => {
    if (historyFilter === 'all') return true;
    if (historyFilter === 'present') return r.status === 'present' || r.status === 'left' || r.status === 'late';
    if (historyFilter === 'leave') return r.status === 'leave';
    if (historyFilter === 'absent') return r.status === 'absent';
    return true;
  });

  const memberNotes = adminNotes.filter(n => n.memberId === member.id);

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteContent.trim()) return;

    onAddAdminNote(member.id, newNoteContent.trim(), newNoteCategory);
    setNewNoteContent('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header with Back button */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-700 hover:text-emerald-700 bg-white hover:bg-slate-50 rounded-xl border border-slate-200 transition-colors shadow-2xs"
        >
          <ArrowRight className="w-4 h-4" />
          <span>بازگشت به لیست اعضا</span>
        </button>

        <span className="text-xs font-mono text-slate-500 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">
          شناسه یکتا: {member.id}
        </span>
      </div>

      {/* Main Profile Info Card (Phase 6 Requirement) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="relative">
              <img
                src={member.avatar}
                alt={member.name}
                referrerPolicy="no-referrer"
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-emerald-500/30 shadow-md shrink-0"
              />
              <span
                className={`absolute bottom-0 left-0 w-5 h-5 rounded-full border-2 border-white ${
                  member.isActive ? 'bg-emerald-500' : 'bg-slate-400'
                }`}
                title={member.isActive ? 'عضو فعال' : 'غیرفعال'}
              />
            </div>

            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {member.name}
                </h2>
                {member.isActive ? (
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    عضو فعال
                  </span>
                ) : (
                  <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                    غیرفعال
                  </span>
                )}
              </div>

              <p className="text-sm text-slate-600 font-semibold mt-1">
                {member.role} · <span className="text-emerald-700">{member.department}</span>
              </p>

              <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1 font-mono tabular-nums">
                  <Hash className="w-3.5 h-3.5 text-slate-400" />
                  کد پرسنلی: {member.employeeCode}
                </span>
                <span className="text-slate-300">·</span>
                <span className="flex items-center gap-1 font-mono tabular-nums">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  {member.phone}
                </span>
                <span className="text-slate-300">·</span>
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  {member.email}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs space-y-2 min-w-[200px]">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">تاریخ شروع همکاری:</span>
              <span className="font-bold text-slate-800">{member.joinedDate}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">شیفت کاری استاندارد:</span>
              <span className="font-bold font-mono text-slate-800 tabular-nums">{member.shift}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">شاخص انضباط کاری:</span>
              <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-mono tabular-nums">
                {toPersianDigits(disciplineScore)}٪
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Individual Stat Cards (Phase 6 Requirement) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Present Days */}
        <div className="bg-white rounded-2xl border border-emerald-200 p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-emerald-800">
            <span>تعداد روزهای حضور</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl font-black text-emerald-700 font-mono tabular-nums">
            {toPersianDigits(presentDays)} <span className="text-xs font-normal">روز</span>
          </div>
          <p className="text-[11px] text-emerald-600 mt-1">حضور فعال و منظم</p>
        </div>

        {/* Absent Days */}
        <div className="bg-white rounded-2xl border border-rose-200 p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-rose-800">
            <span>تعداد روزهای غیبت</span>
            <XCircle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="mt-2 text-2xl font-black text-rose-700 font-mono tabular-nums">
            {toPersianDigits(absentDays)} <span className="text-xs font-normal">روز</span>
          </div>
          <p className="text-[11px] text-rose-600 mt-1">غیبت‌های غیرموجه ثبت‌شده</p>
        </div>

        {/* Leave Days */}
        <div className="bg-white rounded-2xl border border-amber-200 p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-amber-800">
            <span>تعداد روزهای مرخصی</span>
            <Palmtree className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-2 text-2xl font-black text-amber-700 font-mono tabular-nums">
            {toPersianDigits(leaveDays)} <span className="text-xs font-normal">روز</span>
          </div>
          <p className="text-[11px] text-amber-600 mt-1">استحقاقی و ساعتی تایید شده</p>
        </div>

        {/* Total Hours */}
        <div className="bg-white rounded-2xl border border-blue-200 p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-blue-800">
            <span>مجموع ساعات کارکرد</span>
            <Clock className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-2 text-2xl font-black text-blue-700 font-mono tabular-nums">
            {toPersianDigits(totalWorkHours.toFixed(1))} <span className="text-xs font-normal">ساعت</span>
          </div>
          <p className="text-[11px] text-blue-600 mt-1">مجموع حضور موثر دوره</p>
        </div>
      </div>

      {/* Two Column Layout: Attendance History & Admin Notes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance History Table (Col-span 2) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span>🗓️</span>
                <span>تاریخچه حضور و غیاب روزانه</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                ثبت دقیق ساعت‌های تردد، خروج و وضعیت روزهای کاری
              </p>
            </div>

            {/* Filter */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200/80 text-xs font-medium">
              <button
                onClick={() => setHistoryFilter('all')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  historyFilter === 'all' ? 'bg-white text-slate-900 font-bold shadow-2xs' : 'text-slate-600'
                }`}
              >
                همه ({toPersianDigits(memberRecords.length)})
              </button>
              <button
                onClick={() => setHistoryFilter('present')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  historyFilter === 'present' ? 'bg-emerald-600 text-white font-bold shadow-2xs' : 'text-slate-600'
                }`}
              >
                حاضر ({toPersianDigits(presentDays)})
              </button>
              <button
                onClick={() => setHistoryFilter('leave')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  historyFilter === 'leave' ? 'bg-amber-600 text-white font-bold shadow-2xs' : 'text-slate-600'
                }`}
              >
                مرخصی ({toPersianDigits(leaveDays)})
              </button>
              <button
                onClick={() => setHistoryFilter('absent')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  historyFilter === 'absent' ? 'bg-rose-600 text-white font-bold shadow-2xs' : 'text-slate-600'
                }`}
              >
                غایب ({toPersianDigits(absentDays)})
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-bold text-slate-600">
                  <th className="py-2.5 px-4">تاریخ و روز</th>
                  <th className="py-2.5 px-4">وضعیت</th>
                  <th className="py-2.5 px-4">ساعت ورود</th>
                  <th className="py-2.5 px-4">ساعت خروج</th>
                  <th className="py-2.5 px-4">مدت حضور</th>
                  <th className="py-2.5 px-4">یادداشت</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredHistory.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      تاریخچه‌ای برای این فیلتر ثبت نشده است.
                    </td>
                  </tr>
                ) : (
                  filteredHistory.map((rec) => {
                    const badge = getStatusBadgeInfo(rec.status);
                    return (
                      <tr key={rec.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4 font-mono font-medium text-slate-800">
                          {rec.date} <span className="text-slate-400 font-sans">({rec.dayName})</span>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg border text-[11px] font-bold ${badge.badgeBg} ${badge.textColor} ${badge.borderColor}`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${badge.dotColor}`} />
                            {badge.label}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono tabular-nums">
                          {rec.entryTime || '-'}
                        </td>
                        <td className="py-3 px-4 font-mono tabular-nums">
                          {rec.exitTime || '-'}
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-700">
                          {rec.workDurationFormatted || (rec.workHours ? `${toPersianDigits(rec.workHours)} ساعت` : '-')}
                        </td>
                        <td className="py-3 px-4 text-slate-500 max-w-[160px] truncate" title={rec.note}>
                          {rec.note || '-'}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Admin Notes Section (Phase 6 Requirement: Admin Notes with registration) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span>📝</span>
                <span>یادداشت‌های اختصاصی ادمین</span>
              </h3>
              <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-medium">
                محرمانه مدیریت
              </span>
            </div>

            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              ثبت بازخوردها، هماهنگی‌های مرخصی و تذکرات سازمانی مختص این همکار.
            </p>

            {/* Existing Notes List */}
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1 mb-4">
              {memberNotes.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  هنوز یادداشتی برای این پرسنل ثبت نشده است.
                </div>
              ) : (
                memberNotes.map((note) => {
                  let categoryBadge = {
                    label: 'عمومی',
                    bg: 'bg-slate-100 text-slate-700 border-slate-200',
                  };
                  if (note.category === 'praise') {
                    categoryBadge = { label: 'تشویق و تقدیر', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
                  } else if (note.category === 'warning') {
                    categoryBadge = { label: 'تذکر انضباطی', bg: 'bg-rose-50 text-rose-700 border-rose-200' };
                  } else if (note.category === 'leave') {
                    categoryBadge = { label: 'مرخصی و تردد', bg: 'bg-amber-50 text-amber-700 border-amber-200' };
                  }

                  return (
                    <div
                      key={note.id}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5 relative group"
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold border ${categoryBadge.bg}`}>
                          {categoryBadge.label}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-400 font-mono">{note.createdAt}</span>
                          <button
                            onClick={() => onDeleteAdminNote(note.id)}
                            className="text-slate-400 hover:text-rose-600 p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                            title="حذف یادداشت"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <p className="text-slate-700 leading-relaxed font-medium">
                        {note.content}
                      </p>
                      <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-200/50">
                        ثبت‌کننده: {note.author}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Add New Note Form */}
          <form onSubmit={handleCreateNote} className="pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-slate-700">افزودن یادداشت جدید:</span>
              <select
                value={newNoteCategory}
                onChange={(e) => setNewNoteCategory(e.target.value as AdminNote['category'])}
                className="text-[11px] px-2 py-1 bg-slate-50 border border-slate-300 rounded-lg text-slate-700 focus:outline-none"
              >
                <option value="general">یادداشت عمومی</option>
                <option value="praise">تقدیر و تشویق ⭐</option>
                <option value="warning">تذکر انضباطی ⚠️</option>
                <option value="leave">هماهنگی مرخصی 🌴</option>
              </select>
            </div>

            <textarea
              rows={2}
              value={newNoteContent}
              onChange={(e) => setNewNoteContent(e.target.value)}
              placeholder="متن یادداشت داخلی را اینجا بنویسید..."
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
            />

            <button
              type="submit"
              disabled={!newNoteContent.trim()}
              className="w-full mt-2 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>ثبت یادداشت</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
