import { AttendanceStatus, LeaveType } from '../types';

export function toPersianDigits(n: number | string): string {
  if (n === null || n === undefined) return '';
  const str = n.toString();
  const farsiDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return str.replace(/[0-9]/g, (w) => farsiDigits[+w]);
}

export function toEnglishDigits(str: string): string {
  if (!str) return '';
  const farsiDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  let res = str;
  farsiDigits.forEach((f, idx) => {
    res = res.replaceAll(f, idx.toString());
  });
  return res;
}

export function getCurrentPersianTime(): string {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  return `${toPersianDigits(h)}:${toPersianDigits(m)}`;
}

export function getStatusBadgeInfo(status: AttendanceStatus): {
  label: string;
  badgeBg: string;
  textColor: string;
  borderColor: string;
  dotColor: string;
} {
  switch (status) {
    case 'present':
      return {
        label: 'حاضر در شرکت',
        badgeBg: 'bg-emerald-50',
        textColor: 'text-emerald-700',
        borderColor: 'border-emerald-200',
        dotColor: 'bg-emerald-500',
      };
    case 'left':
      return {
        label: 'خروج ثبت‌شده',
        badgeBg: 'bg-sky-50',
        textColor: 'text-sky-700',
        borderColor: 'border-sky-200',
        dotColor: 'bg-sky-500',
      };
    case 'late':
      return {
        label: 'ورود با تأخیر',
        badgeBg: 'bg-amber-50',
        textColor: 'text-amber-700',
        borderColor: 'border-amber-200',
        dotColor: 'bg-amber-500',
      };
    case 'leave':
      return {
        label: 'در مرخصی',
        badgeBg: 'bg-orange-50',
        textColor: 'text-orange-700',
        borderColor: 'border-orange-200',
        dotColor: 'bg-orange-500',
      };
    case 'absent':
      return {
        label: 'غایب',
        badgeBg: 'bg-rose-50',
        textColor: 'text-rose-700',
        borderColor: 'border-rose-200',
        dotColor: 'bg-rose-500',
      };
    case 'not_registered':
    default:
      return {
        label: 'ثبت‌نشده',
        badgeBg: 'bg-slate-50',
        textColor: 'text-slate-600',
        borderColor: 'border-slate-200',
        dotColor: 'bg-slate-400',
      };
  }
}

export function calculateDuration(entry: string | null, exit: string | null): {
  hoursDecimal: number;
  formatted: string;
} {
  if (!entry || !exit) {
    return { hoursDecimal: 0, formatted: '-' };
  }
  const [eH, eM] = toEnglishDigits(entry).split(':').map(Number);
  const [xH, xM] = toEnglishDigits(exit).split(':').map(Number);
  if (isNaN(eH) || isNaN(eM) || isNaN(xH) || isNaN(xM)) {
    return { hoursDecimal: 0, formatted: '-' };
  }
  let totalMin = (xH * 60 + xM) - (eH * 60 + eM);
  if (totalMin < 0) totalMin += 24 * 60; // next day
  const hours = Math.floor(totalMin / 60);
  const mins = totalMin % 60;
  const hoursDecimal = Number((totalMin / 60).toFixed(2));
  return {
    hoursDecimal,
    formatted: `${toPersianDigits(hours)} ساعت و ${toPersianDigits(mins)} دقیقه`
  };
}

export function exportAttendanceToCSV(
  rows: Array<{
    memberName: string;
    employeeCode: string;
    department: string;
    date: string;
    status: string;
    entryTime: string;
    exitTime: string;
    workDuration: string;
    note: string;
  }>
) {
  // UTF-8 BOM so Excel opens Persian text without encoding issues
  const BOM = '\uFEFF';
  const headers = [
    'نام و نام خانوادگی',
    'کد پرسنلی',
    'دپارتمان',
    'تاریخ',
    'وضعیت تردد',
    'ساعت ورود',
    'ساعت خروج',
    'مدت حضور',
    'یادداشت / توضیحات'
  ];

  const csvRows = [
    headers.join(','),
    ...rows.map(r => [
      `"${r.memberName}"`,
      `"${r.employeeCode}"`,
      `"${r.department}"`,
      `"${r.date}"`,
      `"${r.status}"`,
      `"${r.entryTime}"`,
      `"${r.exitTime}"`,
      `"${r.workDuration}"`,
      `"${r.note || ''}"`
    ].join(','))
  ];

  const blob = new Blob([BOM + csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `yar-attendance-report-${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
