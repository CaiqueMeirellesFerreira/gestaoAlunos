export interface Student {
  id: string;
  name: string;
  contact: string; // email or phone
  course: string;
  registrationDate: string; // ISO date string
}

export type AttendanceStatus = "Presente" | "Ausente" | "Atrasado";

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName?: string; // Optional: for easier display in reports
  date: string; // ISO date string for the session
  status: AttendanceStatus;
}

export const courses = [
  "Karatê - Seg, Qua, Sex (18:00-19:30)",
  "Capoeira - Seg, Qua, Sex (20:00-21:30)",
  "Jiu Jitsu - Ter, Qui (19:00-21:00)"
];
