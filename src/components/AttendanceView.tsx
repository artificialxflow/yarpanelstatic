import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Clock, 
  LogIn, 
  LogOut, 
  Palmtree, 
  XCircle, 
  CheckCircle2, 
  Calendar, 
  Edit3, 
  X,
  FileText,
  UserCheck
} from 'lucide-react';
import { Member, AttendanceRecord, AttendanceStatus, LeaveType } from '../types';
import { toPersianDigits, getStatusBadgeInfo, getCurrentPersianTime, calculateDuration } from '../utils/helpers';

interface AttendanceViewProps {
  members: Member[];
  records: AttendanceRecord[];
  currentDate: string;
  onRecordAttendance: (record: Partial<AttendanceRecord> & { memberId: string }) => void;
  onViewMemberProfile: (memberId: string) => void;
}

export const AttendanceView: React.FC<AttendanceViewProps> = ({
  members,
  records,
  currentDate,
  onRecordAttendance,
  onViewMemberProfile,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Modal for detailed attendance logging
  const [activeModalMember, setActiveModalMember] = useState<Member | null>(null);
  const [modalActionType, setModalActionType] = useState<AttendanceStatus>('present');
  const [modalTime, setModalTime] = useState(getCurrentPersianTime());
  const [modalLeaveType, setModalLeaveType] = useState<LeaveType>('استحقاقی');
  const [modalNote, setModalNote] = useState('');

  const activeMembers = members.filter(m => m.isActive);

  // Match records for currentDate
  const todayRecords = records.filter(r => r.date === currentDate);

  const openActionModal = (member: Member, action: AttendanceStatus) => {
    setActiveModalMember(member);
    setModalActionType(action);
    setModalTime(getCurrentPersianTime());
    setModalLeaveType('استحقاقی');
    setModalNote('');
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeModalMember) return;

    const existingRecord = todayRecords.find(r => r.memberId === activeModalMember.id);

    if (modalActionType === 'present') {
      onRecordAttendance({
        memberId: activeModalMember.id,
        date: currentDate,
        dayName: 'شنبه',
        status: 'present',
        entryTime: modalTime || '۰۸:۳۰',
        exitTime: existingRecord?.exitTime || null,
        note: modalNote || 'ثبت ورود در سامانه',
        workHours: existingRecord?.workHours || 8,
        delayMinutes: 0,
      });
    } else if (modalActionType === 'left') {
      const entryTime = existingRecord?.entryTime || '۰۸:۳۰';
      const calc = calculateDuration(entryTime, modalTime || '۱۷:۰۰');
      onRecordAttendance({
        memberId: activeModalMember.id,
        date: currentDate,
        dayName: 'شنبه',
        status: 'left',
        entryTime: entryTime,
        exitTime: modalTime || '۱۷:۰۰',
        workDurationFormatted: calc.formatted,
        workHours: calc.hoursDecimal,
        note: modalNote || 'ثبت خروج رسمی',
        delayMinutes: 0,
      });
    } else if (modalActionType === 'leave') {
      onRecordAttendance({
        memberId: activeModalMember.id,
        date: currentDate,
        dayName: 'شنبه',
        status: 'leave',
        entryTime: null,
        exitTime: null,
        leaveType: modalLeaveType,
        workHours: 0,
        delayMinutes: 0,
        note: modalNote || `مرخصی ${modalLeaveType}`,
      });
    } else if (modalActionType === 'absent') {
      onRecordAttendance({
        memberId: activeModalMember.id,
        date: currentDate,
        dayName: 'شنبه',
        status: 'absent',
        entryTime: null,
        exitTime: null,
        workHours: 0,
        delayMinutes: 0,
        note: modalNote || 'ثبت غیبت غیرموجه',
      });
    }

    setActiveModalMember(null);
  };

  // Quick 1-click status recorder
  const handleQuickStatus = (member: Member, status: AttendanceStatus) => {
    const existing = todayRecords.find(r => r.memberId === member.id);
    const nowTime = getCurrentPersianTime();

    if (status === 'present') {
      onRecordAttendance({
        memberId: member.id,
        date: currentDate,
        dayName: 'شنبه',
        status: 'present',
        entryTime: nowTime,
        exitTime: existing?.exitTime || null,
        workHours: 8,
        delayMinutes: 0,
        note: 'ثبت ورود سریع',
      });
    } else if (status === 'left') {
      const entry = existing?.entryTime || '۰۸:۳۰';
      const calc = calculateDuration(entry, nowTime);
      onRecordAttendance({
        memberId: member.id,
        date: currentDate,
        dayName: 'شنبه',
        status: 'left',
        entryTime: entry,
        exitTime: nowTime,
        workDurationFormatted: calc.formatted,
        workHours: calc.hoursDecimal,
        delayMinutes: 0,
        note: 'ثبت خروج سریع',
      });
    } else if (status === 'leave') {
      onRecordAttendance({
        memberId: member.id,
        date: currentDate,
        dayName: 'شنبه',
        status: 'leave',
        entryTime: null,
        exitTime: null,
        leaveType: 'استحقاقی',
        workHours: 0,
        delayMinutes: 0,
        note: 'ثبت مرخصی روزانه',
      });
    } else if (status === 'absent') {
      onRecordAttendance({
        memberId: member.id,
        date: currentDate,
        dayName: 'شنبه',
        status: 'absent',
        entryTime: null,
        exitTime: null,
        workHours: 0,
        delayMinutes: 0,
        note: 'ثبت غیبت',
      });
    }
  };

  // Filtered List
  const rows = activeMembers.map((member) => {
    const record = todayRecords.find(r => r.memberId === member.id);
    return {
      member,
      record,
      status: (record?.status || 'not_registered') as AttendanceStatus,
    };
  }).filter(({ member, status }) => {
    const matchesSearch =
      member.name.includes(searchQuery) ||
      member.role.includes(searchQuery) ||
      member.employeeCode.includes(searchQuery);

    if (!matchesSearch) return false;
    if (selectedDept !== 'all' && member.department !== selectedDept) return false;

    if (statusFilter === 'all') return true;
    if (statusFilter === 'present') return status === 'present' || status === 'late';
    if (statusFilter === 'left') return status === 'left';
    if (statusFilter === 'leave') return status === 'leave';
    if (statusFilter === 'absent') return status === 'absent';
    if (statusFilter === 'not_registered') return status === 'not_registered';

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Controls Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span>⏱️</span>
            <span>ثبت و کنترل وضعیت حضور و غیاب</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            ثبت لحظه‌ای ورود، خروج، مرخصی و غیبت پرسنل به همراه ثبت توضیحات
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2 text-xs font-semibold text-slate-700">
            <Calendar className="w-4 h-4 text-emerald-600" />
            <span>تاریخ ثبت: {currentDate}</span>
          </div>
          <div className="px-3 py-2 bg-emerald-50 rounded-xl border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-1.5 font-mono tabular-nums">
            <Clock className="w-4 h-4 text-emerald-600" />
            <span>{getCurrentPersianTime()}</span>
          </div>
        </div>
      </div>

      {/* Advanced Search and Filter Bar (Phase 5 Requirement) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="جستجوی پیشرفته بر اساس نام و نام خانوادگی اعضا 🔍..."
            className="w-full pl-3 pr-9 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
          />
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Department Filter */}
        <select
          value={selectedDept}
          onChange={(e) => setSelectedDept(e.target.value)}
          className="px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
        >
          <option value="all">همه دپارتمان‌ها</option>
          <option value="فنی و مهندسی">فنی و مهندسی</option>
          <option value="طراحی محصول">طراحی محصول</option>
          <option value="مارکتینگ و فروش">مارکتینگ و فروش</option>
          <option value="پشتیبانی مشتریان">پشتیبانی مشتریان</option>
          <option value="منابع انسانی و مالی">منابع انسانی و مالی</option>
        </select>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
        >
          <option value="all">همه وضعیت‌ها</option>
          <option value="present">حاضر در شرکت</option>
          <option value="left">خروج ثبت‌شده</option>
          <option value="leave">در مرخصی</option>
          <option value="absent">غایب</option>
          <option value="not_registered">ثبت‌نشده</option>
        </select>
      </div>

      {/* Attendance Grid / Cards (Phase 5 Requirement: Distinct Color Buttons) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {rows.length === 0 ? (
          <div className="col-span-full bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
            موردی منطبق بر فیلتر جستجو یافت نشد.
          </div>
        ) : (
          rows.map(({ member, record, status }) => {
            const badge = getStatusBadgeInfo(status);

            return (
              <div
                key={member.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all p-5 flex flex-col justify-between"
              >
                {/* Member Header */}
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                      />
                      <div>
                        <button
                          onClick={() => onViewMemberProfile(member.id)}
                          className="font-bold text-slate-900 hover:text-emerald-700 text-sm transition-colors text-right block"
                        >
                          {member.name}
                        </button>
                        <span className="text-xs text-slate-500 font-medium">
                          {member.role}
                        </span>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                          {member.employeeCode} · {member.department}
                        </div>
                      </div>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-bold shrink-0 ${badge.badgeBg} ${badge.textColor} ${badge.borderColor}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${badge.dotColor}`} />
                      {badge.label}
                    </span>
                  </div>

                  {/* Registered Time Badges */}
                  <div className="bg-slate-50/90 rounded-xl p-3 border border-slate-200/70 mb-4 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 flex items-center gap-1">
                        <LogIn className="w-3.5 h-3.5 text-emerald-600" />
                        ساعت ورود:
                      </span>
                      <span className="font-mono font-bold text-slate-800 tabular-nums">
                        {record?.entryTime || 'ثبت نشده'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 flex items-center gap-1">
                        <LogOut className="w-3.5 h-3.5 text-sky-600" />
                        ساعت خروج:
                      </span>
                      <span className="font-mono font-bold text-slate-800 tabular-nums">
                        {record?.exitTime || 'ثبت نشده'}
                      </span>
                    </div>

                    {record?.workDurationFormatted && (
                      <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
                        <span className="text-slate-500">مدت کارکرد امروز:</span>
                        <span className="font-bold text-emerald-700">
                          {record.workDurationFormatted}
                        </span>
                      </div>
                    )}

                    {record?.leaveType && (
                      <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
                        <span className="text-slate-500">نوع مرخصی:</span>
                        <span className="font-bold text-amber-700">
                          {record.leaveType}
                        </span>
                      </div>
                    )}

                    {record?.note && (
                      <p className="text-[11px] text-slate-500 italic pt-1 border-t border-slate-200/60">
                        یادداشت: {record.note}
                      </p>
                    )}
                  </div>
                </div>

                {/* Phase 5 Action Buttons with Color Coding */}
                <div>
                  <div className="text-[11px] font-bold text-slate-500 mb-2">
                    ثبت وضعیت تردد (اکشن سریع):
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-2">
                    {/* Green: Entry */}
                    <button
                      onClick={() => handleQuickStatus(member, 'present')}
                      className="py-2 px-3 bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-700 font-bold rounded-xl border border-emerald-300 text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                    >
                      <LogIn className="w-3.5 h-3.5" />
                      <span>ثبت ورود (سبز)</span>
                    </button>

                    {/* Blue: Exit */}
                    <button
                      onClick={() => handleQuickStatus(member, 'left')}
                      className="py-2 px-3 bg-sky-50 hover:bg-sky-600 hover:text-white text-sky-700 font-bold rounded-xl border border-sky-300 text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>ثبت خروج (آبی)</span>
                    </button>

                    {/* Red: Absent */}
                    <button
                      onClick={() => handleQuickStatus(member, 'absent')}
                      className="py-2 px-3 bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-700 font-bold rounded-xl border border-rose-300 text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>ثبت غیبت (قرمز)</span>
                    </button>

                    {/* Yellow/Orange: Leave */}
                    <button
                      onClick={() => handleQuickStatus(member, 'leave')}
                      className="py-2 px-3 bg-amber-50 hover:bg-amber-600 hover:text-white text-amber-800 font-bold rounded-xl border border-amber-300 text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                    >
                      <Palmtree className="w-3.5 h-3.5" />
                      <span>مرخصی (زرد)</span>
                    </button>
                  </div>

                  {/* Detailed manual time / note button */}
                  <button
                    onClick={() => openActionModal(member, status === 'present' ? 'left' : 'present')}
                    className="w-full py-1.5 text-center text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors flex items-center justify-center gap-1"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>ثبت دستی ساعت یا توضیحات</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Manual / Detailed Action Modal */}
      {activeModalMember && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 text-right animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-xl">⏱️</span>
                <h3 className="text-sm font-bold text-slate-900">
                  ثبت تردد: {activeModalMember.name}
                </h3>
              </div>
              <button
                onClick={() => setActiveModalMember(null)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-4 text-xs">
              {/* Action Type */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  نوع وضعیت مورد ثبت:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setModalActionType('present')}
                    className={`py-2 px-3 rounded-xl border font-bold text-xs ${
                      modalActionType === 'present'
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}
                  >
                    ورود (سبز)
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalActionType('left')}
                    className={`py-2 px-3 rounded-xl border font-bold text-xs ${
                      modalActionType === 'left'
                        ? 'bg-sky-600 text-white border-sky-600'
                        : 'bg-sky-50 text-sky-700 border-sky-200'
                    }`}
                  >
                    خروج (آبی)
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalActionType('leave')}
                    className={`py-2 px-3 rounded-xl border font-bold text-xs ${
                      modalActionType === 'leave'
                        ? 'bg-amber-600 text-white border-amber-600'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}
                  >
                    مرخصی (زرد)
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalActionType('absent')}
                    className={`py-2 px-3 rounded-xl border font-bold text-xs ${
                      modalActionType === 'absent'
                        ? 'bg-rose-600 text-white border-rose-600'
                        : 'bg-rose-50 text-rose-700 border-rose-200'
                    }`}
                  >
                    غیبت (قرمز)
                  </button>
                </div>
              </div>

              {/* Time input (for present or left) */}
              {(modalActionType === 'present' || modalActionType === 'left') && (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    ساعت دقیق:
                  </label>
                  <input
                    type="text"
                    value={modalTime}
                    onChange={(e) => setModalTime(e.target.value)}
                    placeholder="مثال: ۰۸:۳۰"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 font-mono text-center text-sm font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
              )}

              {/* Leave Type (if leave) */}
              {modalActionType === 'leave' && (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    نوع مرخصی:
                  </label>
                  <select
                    value={modalLeaveType}
                    onChange={(e) => setModalLeaveType(e.target.value as LeaveType)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  >
                    <option value="استحقاقی">استحقاقی (با حقوق)</option>
                    <option value="استعلاجی">استعلاجی (پزشکی)</option>
                    <option value="ساعتی">ساعتی (در طول شیفت)</option>
                    <option value="بدون حقوق">بدون حقوق</option>
                  </select>
                </div>
              )}

              {/* Notes */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  توضیحات و یادداشت تردد:
                </label>
                <textarea
                  rows={2}
                  value={modalNote}
                  onChange={(e) => setModalNote(e.target.value)}
                  placeholder="علت تأخیر، هماهنگی قبلی یا توضیحات اداری..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveModalMember(null)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs"
                >
                  ثبت نهایی تردد
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
