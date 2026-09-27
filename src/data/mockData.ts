import { Member, AttendanceRecord, AdminNote, AppNotification } from '../types';

export const INITIAL_MEMBERS: Member[] = [
  {
    id: 'mem-1',
    name: 'سارا ابراهیمی',
    role: 'توسعه‌دهنده ارشد فرانت‌اند',
    department: 'فنی و مهندسی',
    employeeCode: 'YAR-101',
    phone: '۰۹۱۲۳۴۵۶۷۸۱',
    email: 'sara.ebrahimi@yar-panel.ir',
    avatar: '/src/assets/images/avatar_member_female_1_1790488709030.jpg',
    isActive: true,
    joinedDate: '۱۴۰۱/۰۲/۱۵',
    shift: '۰۸:۳۰ - ۱۷:۰۰',
    baseWorkHours: 8,
  },
  {
    id: 'mem-2',
    name: 'امیرحسین رضایی',
    role: 'مدیر محصول و تیم اسکرام',
    department: 'طراحی محصول',
    employeeCode: 'YAR-102',
    phone: '۰۹۱۹۸۷۶۵۴۳۲',
    email: 'amir.rezaei@yar-panel.ir',
    avatar: '/src/assets/images/avatar_member_male_1_1790488721355.jpg',
    isActive: true,
    joinedDate: '۱۴۰۰/۰۶/۱۰',
    shift: '۰۸:۳۰ - ۱۷:۰۰',
    baseWorkHours: 8,
  },
  {
    id: 'mem-3',
    name: 'نیلوفر کریمی',
    role: 'طراح ارشد رابط و تجربه کاربری (UI/UX)',
    department: 'طراحی محصول',
    employeeCode: 'YAR-103',
    phone: '۰۹۳۵۱۲۳۴۵۶۷',
    email: 'niloofar.karimi@yar-panel.ir',
    avatar: '/src/assets/images/avatar_member_female_2_1790488733731.jpg',
    isActive: true,
    joinedDate: '۱۴۰۲/۰۱/۲۰',
    shift: '۰۹:۰۰ - ۱۷:۳۰',
    baseWorkHours: 8,
  },
  {
    id: 'mem-4',
    name: 'پویا محمدی',
    role: 'مهندس ارشد بک‌اند و زیرساخت',
    department: 'فنی و مهندسی',
    employeeCode: 'YAR-104',
    phone: '۰۹۱۲۹۹۸۸۷۷۶',
    email: 'pouya.mohammadi@yar-panel.ir',
    avatar: '/src/assets/images/avatar_member_male_2_1790488746001.jpg',
    isActive: true,
    joinedDate: '۱۴۰۱/۰۹/۰۱',
    shift: '۰۸:۳۰ - ۱۷:۰۰',
    baseWorkHours: 8,
  },
  {
    id: 'mem-5',
    name: 'مهدی نوری',
    role: 'مدیر توسعه کسب‌وکار و مارکتینگ',
    department: 'مارکتینگ و فروش',
    employeeCode: 'YAR-105',
    phone: '۰۹۳۶۵۵۴۴۳۳۲',
    email: 'mehdi.nouri@yar-panel.ir',
    avatar: '/src/assets/images/avatar_member_male_1_1790488721355.jpg',
    isActive: true,
    joinedDate: '۱۴۰۲/۰۴/۱۱',
    shift: '۰۹:۰۰ - ۱۷:۳۰',
    baseWorkHours: 8,
  },
  {
    id: 'mem-6',
    name: 'فرزانه صادقی',
    role: 'سرپرست پشتیبانی فنی مشتریان',
    department: 'پشتیبانی مشتریان',
    employeeCode: 'YAR-106',
    phone: '۰۹۱۸۱۱۱۲۲۳۳',
    email: 'farzaneh.sadeghi@yar-panel.ir',
    avatar: '/src/assets/images/avatar_member_female_1_1790488709030.jpg',
    isActive: true,
    joinedDate: '۱۴۰۲/۰۸/۲۲',
    shift: '۰۸:۰۰ - ۱۶:۳۰',
    baseWorkHours: 8,
  },
  {
    id: 'mem-7',
    name: 'علیرضا حسینی',
    role: 'کارشناس ارشد امور مالی و حقوق',
    department: 'منابع انسانی و مالی',
    employeeCode: 'YAR-107',
    phone: '۰۹۱۲۷۷۶۶۵۵۴',
    email: 'alireza.hosseini@yar-panel.ir',
    avatar: '/src/assets/images/avatar_member_male_2_1790488746001.jpg',
    isActive: false,
    joinedDate: '۱۴۰۲/۱۱/۰۵',
    shift: '۰۸:۳۰ - ۱۷:۰۰',
    baseWorkHours: 8,
  }
];

export const TODAY_JALALI = '۱۴۰۵/۰۷/۰۵';
export const TODAY_DAY_NAME = 'شنبه';

export const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  {
    id: 'att-today-1',
    memberId: 'mem-1',
    date: TODAY_JALALI,
    dayName: TODAY_DAY_NAME,
    status: 'present',
    entryTime: '۰۸:۲۲',
    exitTime: null,
    workHours: 7.2,
    delayMinutes: 0,
    note: 'ورود به موقع، جلسه بررسی اسپرینت'
  },
  {
    id: 'att-today-2',
    memberId: 'mem-2',
    date: TODAY_JALALI,
    dayName: TODAY_DAY_NAME,
    status: 'present',
    entryTime: '۰۸:۴۵',
    exitTime: null,
    workHours: 6.8,
    delayMinutes: 15,
    note: 'تأخیر جزئی به دلیل ترافیک سنگین صبحگاهی'
  },
  {
    id: 'att-today-3',
    memberId: 'mem-3',
    date: TODAY_JALALI,
    dayName: TODAY_DAY_NAME,
    status: 'leave',
    entryTime: null,
    exitTime: null,
    workHours: 0,
    delayMinutes: 0,
    leaveType: 'استحقاقی',
    note: 'درخواست مرخصی از قبل با تأیید مدیریت'
  },
  {
    id: 'att-today-4',
    memberId: 'mem-4',
    date: TODAY_JALALI,
    dayName: TODAY_DAY_NAME,
    status: 'absent',
    entryTime: null,
    exitTime: null,
    workHours: 0,
    delayMinutes: 0,
    note: 'عدم ثبت ورود، عدم پاسخگویی به تماس'
  },
  {
    id: 'att-today-5',
    memberId: 'mem-5',
    date: TODAY_JALALI,
    dayName: TODAY_DAY_NAME,
    status: 'present',
    entryTime: '۰۸:۵۵',
    exitTime: null,
    workHours: 6.5,
    delayMinutes: 0,
    note: 'جلسه بازاریابی با شرکای تجاری'
  },
  {
    id: 'att-today-6',
    memberId: 'mem-6',
    date: TODAY_JALALI,
    dayName: TODAY_DAY_NAME,
    status: 'left',
    entryTime: '۰۷:۵۵',
    exitTime: '۱۶:۳۰',
    workDurationFormatted: '۸ ساعت و ۳۵ دقیقه',
    workHours: 8.58,
    delayMinutes: 0,
    note: 'تکمیل شیفت کاری بدون تأخیر'
  },
  // Previous records for history
  {
    id: 'att-prev-1',
    memberId: 'mem-1',
    date: '۱۴۰۵/۰۷/۰۴',
    dayName: 'جمعه',
    status: 'not_registered',
    entryTime: null,
    exitTime: null,
    workHours: 0,
    delayMinutes: 0,
    note: 'تعطیل رسمی هفتگی'
  },
  {
    id: 'att-prev-2',
    memberId: 'mem-1',
    date: '۱۴۰۵/۰۷/۰۳',
    dayName: 'پنج‌شنبه',
    status: 'left',
    entryTime: '۰۸:۲۵',
    exitTime: '۱۳:۴۰',
    workDurationFormatted: '۵ ساعت و ۱۵ دقیقه',
    workHours: 5.25,
    delayMinutes: 0,
    note: 'شیفت نیمه‌وقت پنج‌شنبه'
  },
  {
    id: 'att-prev-3',
    memberId: 'mem-1',
    date: '۱۴۰۵/۰۷/۰۲',
    dayName: 'چهارشنبه',
    status: 'left',
    entryTime: '۰۸:۳۰',
    exitTime: '۱۷:۱۰',
    workDurationFormatted: '۸ ساعت و ۴۰ دقیقه',
    workHours: 8.66,
    delayMinutes: 0,
    note: 'حضور کامل'
  },
  {
    id: 'att-prev-4',
    memberId: 'mem-1',
    date: '۱۴۰۵/۰۷/۰۱',
    dayName: 'سه‌شنبه',
    status: 'left',
    entryTime: '۰۸:۱۸',
    exitTime: '۱۷:۰۲',
    workDurationFormatted: '۸ ساعت و ۴۴ دقیقه',
    workHours: 8.73,
    delayMinutes: 0,
    note: 'حضور کامل و منظم'
  },
  {
    id: 'att-prev-5',
    memberId: 'mem-2',
    date: '۱۴۰۵/۰۷/۰۳',
    dayName: 'پنج‌شنبه',
    status: 'left',
    entryTime: '۰۸:۳۵',
    exitTime: '۱۴:۰۰',
    workDurationFormatted: '۵ ساعت و ۲۵ دقیقه',
    workHours: 5.4,
    delayMinutes: 5,
    note: 'شیفت پنج‌شنبه'
  },
  {
    id: 'att-prev-6',
    memberId: 'mem-2',
    date: '۱۴۰۵/۰۷/۰۲',
    dayName: 'چهارشنبه',
    status: 'left',
    entryTime: '۰۸:۳۰',
    exitTime: '۱۷:۳۰',
    workDurationFormatted: '۹ ساعت',
    workHours: 9.0,
    delayMinutes: 0,
    note: 'اضافه‌کاری برای تحویل رودمپ'
  },
  {
    id: 'att-prev-7',
    memberId: 'mem-3',
    date: '۱۴۰۵/۰۷/۰۲',
    dayName: 'چهارشنبه',
    status: 'left',
    entryTime: '۰۹:۰۰',
    exitTime: '۱۷:۳۵',
    workDurationFormatted: '۸ ساعت و ۳۵ دقیقه',
    workHours: 8.58,
    delayMinutes: 0,
    note: 'طراحی دیزاین سیستم'
  },
  {
    id: 'att-prev-8',
    memberId: 'mem-4',
    date: '۱۴۰۵/۰۷/۰۲',
    dayName: 'چهارشنبه',
    status: 'left',
    entryTime: '۰۸:۳۰',
    exitTime: '۱۸:۱۵',
    workDurationFormatted: '۹ ساعت و ۴۵ دقیقه',
    workHours: 9.75,
    delayMinutes: 0,
    note: 'دیپلوی سرورها و نگهداری دیتابیس'
  },
  {
    id: 'att-prev-9',
    memberId: 'mem-5',
    date: '۱۴۰۵/۰۷/۰۲',
    dayName: 'چهارشنبه',
    status: 'leave',
    entryTime: null,
    exitTime: null,
    workHours: 0,
    delayMinutes: 0,
    leaveType: 'ساعتی',
    note: 'مرخصی پزشکی به مدت ۳ ساعت'
  },
  {
    id: 'att-prev-10',
    memberId: 'mem-6',
    date: '۱۴۰۵/۰۷/۰۲',
    dayName: 'چهارشنبه',
    status: 'left',
    entryTime: '۰۸:۰۰',
    exitTime: '۱۶:۳۰',
    workDurationFormatted: '۸ ساعت و ۳۰ دقیقه',
    workHours: 8.5,
    delayMinutes: 0,
    note: 'پشتیبانی تماس‌های ورودی'
  }
];

export const INITIAL_ADMIN_NOTES: AdminNote[] = [
  {
    id: 'note-1',
    memberId: 'mem-1',
    author: 'مدیر منابع انسانی',
    createdAt: '۱۴۰۵/۰۷/۰۱ - ۱۱:۳۰',
    content: 'سارا عملکرد بسیار درخشانی در تسک‌های اسپرینت پاییزه داشته و به عنوان منتور عضو جدید فنی هم به خوبی عمل کرد.',
    category: 'praise'
  },
  {
    id: 'note-2',
    memberId: 'mem-2',
    author: 'مدیریت ارشد',
    createdAt: '۱۴۰۵/۰۶/۲۸ - ۱۰:۱۵',
    content: 'بررسی پروپوزال ریلیز نسخه جدید سامانه یار تایید شد. نیازمند هماهنگی نهایی با تیم طراحی.',
    category: 'general'
  },
  {
    id: 'note-3',
    memberId: 'mem-3',
    author: 'امیرحسین رضایی',
    createdAt: '۱۴۰۵/۰۶/۲۵ - ۱۶:۴۰',
    content: 'درخواست مرخصی استحقاقی روز شنبه ۵ مهر از قبل با موافقت سرپرست تیم همراه بوده است.',
    category: 'leave'
  },
  {
    id: 'note-4',
    memberId: 'mem-4',
    author: 'مدیر منابع انسانی',
    createdAt: '۱۴۰۵/۰۷/۰۵ - ۰۹:۴۵',
    content: 'امروز بدون اطلاع قبلی غایب بوده است. تماس گرفته شد و در دسترس نبود. نیازمند پیگیری علت غیبت.',
    category: 'warning'
  }
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    title: 'ثبت ورود جدید',
    message: 'سارا ابراهیمی در ساعت ۰۸:۲۲ ورود خود را ثبت کرد.',
    time: '۲ ساعت پیش',
    type: 'success',
    read: false
  },
  {
    id: 'notif-2',
    title: 'هشدار عدم حضور',
    message: 'پویا محمدی هنوز وضعیت حضور امروز خود را ثبت نکرده است.',
    time: '۳ ساعت پیش',
    type: 'warning',
    read: false
  },
  {
    id: 'notif-3',
    title: 'تأیید درخواست مرخصی',
    message: 'مرخصی استحقاقی نیلوفر کریمی برای امروز تایید شد.',
    time: 'دیروز',
    type: 'info',
    read: true
  }
];
