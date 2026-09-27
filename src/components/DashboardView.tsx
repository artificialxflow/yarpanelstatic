import React, { useState } from 'react';
import { 
  Users, 
  CheckCircle2, 
  XCircle, 
  Palmtree, 
  ArrowUpRight, 
  Clock, 
  Search, 
  LogIn, 
  LogOut, 
  AlertCircle,
  Eye,
  Calendar,
  Filter
} from 'lucide-react';
import { Member, AttendanceRecord, AttendanceStatus } from '../types';
import { toPersianDigits, getStatusBadgeInfo, getCurrentPersianTime } from '../utils/helpers';

interface DashboardViewProps {
  members: Member[];
  todayRecords: AttendanceRecord[];
  onQuickStatusChange: (memberId: string, status: AttendanceStatus, note?: string) => void;
  onViewMemberProfile: (memberId: string) => void;
  onNavigateToAttendance: () => void;
  onNavigateToMembers: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  members,
  todayRecords,
  onQuickStatusChange,
  onViewMemberProfile,
  onNavigateToAttendance,
  onNavigateToMembers,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const activeMembers = members.filter(m => m.isActive);
  const totalActive = activeMembers.length;

  const presentCount = todayRecords.filter(r => r.status === 'present' || r.status === 'left' || r.status === 'late').length;
  const absentCount = todayRecords.filter(r => r.status === 'absent').length;
  const leaveCount = todayRecords.filter(r => r.status === 'leave').length;
  const attendanceRate = totalActive > 0 ? Math.round((presentCount / totalActive) * 100) : 0;

  // Combine members with their attendance status today
  const combinedList = activeMembers.map((member) => {
    const record = todayRecords.find(r => r.memberId === member.id);
    return {
      member,
      record: record || null,
      status: (record?.status || 'not_registered') as AttendanceStatus,
      entryTime: record?.entryTime || null,
      exitTime: record?.exitTime || null,
      note: record?.note || '',
    };
  });

  const filteredList = combinedList.filter((item) => {
    const matchesSearch = item.member.name.includes(searchQuery) || item.member.role.includes(searchQuery) || item.member.department.includes(searchQuery);
    if (!matchesSearch) return false;

    if (filterStatus === 'all') return true;
    if (filterStatus === 'present') return item.status === 'present' || item.status === 'left' || item.status === 'late';
    if (filterStatus === 'absent') return item.status === 'absent';
    if (filterStatus === 'leave') return item.status === 'leave';
    if (filterStatus === 'not_registered') return item.status === 'not_registered';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome card */}
      <div className="bg-gradient-to-l from-emerald-600 via-teal-600 to-emerald-700 text-white rounded-2xl p-6 shadow-md border border-emerald-500/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-100 text-xs font-semibold mb-1">
            <Calendar className="w-4 h-4" />
            <span>امروز: شنبه ۵ مهر ۱۴۰۵ · شیفت کاری پاییزه</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            سامانه جامع مانیتورینگ پرسنل و حضور و غیاب
          </h2>
          <p className="text-emerald-50 text-xs sm:text-sm mt-1 max-w-xl font-medium">
            گزارش زنده تردد همکاران، درصد مشارکت سازمانی و کنترل درخواست‌های مرخصی و غیبت روز جاری.
          </p>
        </div>

        <div className="flex items-center gap-2 self-stretch md:self-auto">
          <button
            onClick={onNavigateToAttendance}
            className="flex-1 md:flex-initial px-4 py-2.5 bg-white text-emerald-800 hover:bg-emerald-50 active:scale-95 text-xs font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Clock className="w-4 h-4 text-emerald-600" />
            <span>ثبت سریع ترددها</span>
          </button>
          <button
            onClick={onNavigateToMembers}
            className="flex-1 md:flex-initial px-4 py-2.5 bg-emerald-700/80 hover:bg-emerald-800 text-white active:scale-95 text-xs font-bold rounded-xl border border-emerald-400/40 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Users className="w-4 h-4" />
            <span>مدیریت اعضا</span>
          </button>
        </div>
      </div>

      {/* 4 Prominent Stat Cards (Phase 3 Requirement) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Active Members 👥 */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-all relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">تعداد اعضای فعال</span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200">
              <span className="text-lg">👥</span>
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tabular-nums">
              {toPersianDigits(totalActive)}
            </span>
            <span className="text-xs text-slate-500 font-medium">پرسنل سازمانی</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>کل تیم فعال</span>
            <span className="text-blue-600 font-semibold flex items-center gap-0.5">
              <span>۱۰۰٪ تیم</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* Card 2: Present Today ✅ */}
        <div className="bg-white rounded-2xl border border-emerald-200 p-5 shadow-xs hover:border-emerald-300 transition-all relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-800">حاضرین امروز</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
              <span className="text-lg">✅</span>
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-emerald-700 font-mono tabular-nums">
              {toPersianDigits(presentCount)}
            </span>
            <span className="text-xs text-emerald-600 font-medium">نفر در محل کار</span>
          </div>
          <div className="mt-3 pt-3 border-t border-emerald-100 flex items-center justify-between text-xs text-emerald-700">
            <span>نرخ حضور امروز</span>
            <span className="font-bold font-mono tabular-nums bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {toPersianDigits(attendanceRate)}٪
            </span>
          </div>
        </div>

        {/* Card 3: Absent Today ❌ */}
        <div className="bg-white rounded-2xl border border-rose-200 p-5 shadow-xs hover:border-rose-300 transition-all relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-800">غایبین امروز</span>
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-200">
              <span className="text-lg">❌</span>
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-rose-700 font-mono tabular-nums">
              {toPersianDigits(absentCount)}
            </span>
            <span className="text-xs text-rose-600 font-medium">نفر بدون ثبت</span>
          </div>
          <div className="mt-3 pt-3 border-t border-rose-100 flex items-center justify-between text-xs text-rose-700">
            <span>وضعیت پیگیری</span>
            <span className="font-semibold text-rose-600 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              نیازمند تماس
            </span>
          </div>
        </div>

        {/* Card 4: In Leave Today 🌴 */}
        <div className="bg-white rounded-2xl border border-amber-200 p-5 shadow-xs hover:border-amber-300 transition-all relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-800">در مرخصی امروز</span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200">
              <span className="text-lg">🌴</span>
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-amber-700 font-mono tabular-nums">
              {toPersianDigits(leaveCount)}
            </span>
            <span className="text-xs text-amber-600 font-medium">مرخصی موجه</span>
          </div>
          <div className="mt-3 pt-3 border-t border-amber-100 flex items-center justify-between text-xs text-amber-700">
            <span>نوع مرخصی‌ها</span>
            <span className="font-semibold text-amber-700">استحقاقی و ساعتی</span>
          </div>
        </div>
      </div>

      {/* Main Section: Quick Attendance Summary Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Header & Controls */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span>📋</span>
              <span>خلاصه وضعیت حضور و غیاب امروز</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              نمایش لحظه‌ای وضعیت، ساعات ورود و خروج و اعمال سریع وضعیت‌ها
            </p>
          </div>

          {/* Search & Status Filters */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search Input */}
            <div className="relative min-w-[200px]">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="جستجوی نام یا سمت..."
                className="w-full pl-3 pr-9 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200/80">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  filterStatus === 'all'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                همه ({toPersianDigits(combinedList.length)})
              </button>
              <button
                onClick={() => setFilterStatus('present')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  filterStatus === 'present'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                حاضر ({toPersianDigits(presentCount)})
              </button>
              <button
                onClick={() => setFilterStatus('absent')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  filterStatus === 'absent'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                غایب ({toPersianDigits(absentCount)})
              </button>
              <button
                onClick={() => setFilterStatus('leave')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  filterStatus === 'leave'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                مرخصی ({toPersianDigits(leaveCount)})
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-bold text-slate-600">
                <th className="py-3 px-4">عضو تیم</th>
                <th className="py-3 px-4">دپارتمان</th>
                <th className="py-3 px-4">وضعیت امروز</th>
                <th className="py-3 px-4">ساعت ورود</th>
                <th className="py-3 px-4">ساعت خروج</th>
                <th className="py-3 px-4">توضیحات</th>
                <th className="py-3 px-4 text-center">ثبت و اکشن سریع</th>
                <th className="py-3 px-4 text-center">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    موردی مطابق با جستجو یا فیلتر یافت نشد.
                  </td>
                </tr>
              ) : (
                filteredList.map(({ member, record, status, entryTime, exitTime, note }) => {
                  const badgeInfo = getStatusBadgeInfo(status);

                  return (
                    <tr
                      key={member.id}
                      className="hover:bg-slate-50/70 transition-colors group"
                    >
                      {/* Member Info */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={member.avatar}
                            alt={member.name}
                            referrerPolicy="no-referrer"
                            className="w-9 h-9 rounded-xl object-cover border border-slate-200 shrink-0"
                          />
                          <div>
                            <button
                              onClick={() => onViewMemberProfile(member.id)}
                              className="font-bold text-slate-900 hover:text-emerald-700 transition-colors text-right block"
                            >
                              {member.name}
                            </button>
                            <span className="text-[11px] text-slate-500 font-medium">
                              {member.role}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Department */}
                      <td className="py-3.5 px-4 text-slate-600 font-medium">
                        {member.department}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-bold ${badgeInfo.badgeBg} ${badgeInfo.textColor} ${badgeInfo.borderColor}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${badgeInfo.dotColor}`} />
                          <span>{badgeInfo.label}</span>
                        </span>
                      </td>

                      {/* Entry Time */}
                      <td className="py-3.5 px-4 font-mono font-medium text-slate-800 tabular-nums">
                        {entryTime ? (
                          <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            {entryTime}
                          </span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>

                      {/* Exit Time */}
                      <td className="py-3.5 px-4 font-mono font-medium text-slate-800 tabular-nums">
                        {exitTime ? (
                          <span className="text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                            {exitTime}
                          </span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>

                      {/* Note */}
                      <td className="py-3.5 px-4 text-slate-500 max-w-[180px] truncate" title={note}>
                        {note || '-'}
                      </td>

                      {/* Quick Actions (Buttons with color segregation) */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center justify-center gap-1">
                          {/* Quick Present */}
                          <button
                            onClick={() => onQuickStatusChange(member.id, 'present')}
                            title="ثبت ورود (سبز)"
                            className={`p-1.5 rounded-lg border text-[11px] font-semibold transition-all ${
                              status === 'present'
                                ? 'bg-emerald-600 text-white border-emerald-600'
                                : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-600 hover:text-white'
                            }`}
                          >
                            ورود
                          </button>

                          {/* Quick Exit */}
                          <button
                            onClick={() => onQuickStatusChange(member.id, 'left')}
                            title="ثبت خروج (آبی)"
                            className={`p-1.5 rounded-lg border text-[11px] font-semibold transition-all ${
                              status === 'left'
                                ? 'bg-sky-600 text-white border-sky-600'
                                : 'bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-600 hover:text-white'
                            }`}
                          >
                            خروج
                          </button>

                          {/* Quick Leave */}
                          <button
                            onClick={() => onQuickStatusChange(member.id, 'leave', 'درخواست مرخصی ثبت شد')}
                            title="ثبت مرخصی (نارنجی)"
                            className={`p-1.5 rounded-lg border text-[11px] font-semibold transition-all ${
                              status === 'leave'
                                ? 'bg-amber-600 text-white border-amber-600'
                                : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-600 hover:text-white'
                            }`}
                          >
                            مرخصی
                          </button>

                          {/* Quick Absent */}
                          <button
                            onClick={() => onQuickStatusChange(member.id, 'absent', 'عدم حضور بدون هماهنگی')}
                            title="ثبت غیبت (قرمز)"
                            className={`p-1.5 rounded-lg border text-[11px] font-semibold transition-all ${
                              status === 'absent'
                                ? 'bg-rose-600 text-white border-rose-600'
                                : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-600 hover:text-white'
                            }`}
                          >
                            غیبت
                          </button>
                        </div>
                      </td>

                      {/* View Profile */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => onViewMemberProfile(member.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 border border-transparent hover:border-emerald-200 transition-colors"
                          title="مشاهده پروفایل اختصاصی"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
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
