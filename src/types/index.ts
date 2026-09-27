export type Department = 
  | 'فنی و مهندسی'
  | 'طراحی محصول'
  | 'مارکتینگ و فروش'
  | 'پشتیبانی مشتریان'
  | 'منابع انسانی و مالی';

export type AttendanceStatus = 'present' | 'absent' | 'leave' | 'left' | 'late' | 'not_registered';

export type LeaveType = 'استحقاقی' | 'استعلاجی' | 'ساعتی' | 'بدون حقوق';

export interface Member {
  id: string;
  name: string;
  role: string;
  department: Department;
  employeeCode: string;
  phone: string;
  email: string;
  avatar: string;
  isActive: boolean;
  joinedDate: string;
  shift: string;
  baseWorkHours: number; // e.g. 8
}

export interface AttendanceRecord {
  id: string;
  memberId: string;
  date: string; // e.g. "۱۴۰۵/۰۷/۰۵"
  dayName: string; // e.g. "شنبه"
  status: AttendanceStatus;
  entryTime: string | null; // e.g. "08:15"
  exitTime: string | null;  // e.g. "17:10"
  workDurationFormatted?: string; // e.g. "۸ ساعت و ۵۵ دقیقه"
  workHours: number; // decimal e.g. 8.9
  delayMinutes: number;
  leaveType?: LeaveType;
  note?: string;
}

export interface AdminNote {
  id: string;
  memberId: string;
  author: string;
  createdAt: string;
  content: string;
  category: 'general' | 'praise' | 'warning' | 'leave';
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'info' | 'success' | 'warning';
  read: boolean;
}

export interface UserSession {
  username: string;
  name: string;
  role: string;
  avatar: string;
  isLoggedIn: boolean;
}
