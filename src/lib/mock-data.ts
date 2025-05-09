import type { Student, AttendanceRecord } from '@/types';
import { format } from 'date-fns';
import { courses } from '@/types'; // Import the updated courses

const today = new Date();
const formatDate = (date: Date) => format(date, "yyyy-MM-dd");

export const mockStudents: Student[] = [
  { id: '1', name: 'Alice Silva', contact: 'alice@example.com', course: courses[0], registrationDate: formatDate(new Date(2023, 0, 15)) },
  { id: '2', name: 'Bruno Costa', contact: 'bruno@example.com', course: courses[1], registrationDate: formatDate(new Date(2023, 1, 20)) },
  { id: '3', name: 'Carla Dias', contact: 'carla@example.com', course: courses[2], registrationDate: formatDate(new Date(2023, 2, 10)) },
  { id: '4', name: 'Daniel Faria', contact: 'daniel@example.com', course: courses[0], registrationDate: formatDate(new Date(2023, 3, 5)) },
  { id: '5', name: 'Elena Moraes', contact: 'elena@example.com', course: courses[1], registrationDate: formatDate(new Date(2023, 4, 25)) },
];

// Reset today to ensure correct date calculations for mockAttendance
let attendanceDateCounter = -2; // Start from 2 days ago
const getAttendanceDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + attendanceDateCounter);
    attendanceDateCounter++;
    if (attendanceDateCounter > 0) attendanceDateCounter = -2; // Cycle dates if needed or keep it simple
    return formatDate(date);
}


export const mockAttendance: AttendanceRecord[] = [
  { id: 'att1', studentId: '1', studentName: 'Alice Silva', date: getAttendanceDate(), status: 'Presente' },
  { id: 'att2', studentId: '2', studentName: 'Bruno Costa', date: getAttendanceDate(), status: 'Ausente' },
  { id: 'att3', studentId: '3', studentName: 'Carla Dias', date: getAttendanceDate(), status: 'Atrasado' },
  { id: 'att4', studentId: '1', studentName: 'Alice Silva', date: getAttendanceDate(), status: 'Presente' },
  { id: 'att5', studentId: '2', studentName: 'Bruno Costa', date: getAttendanceDate(), status: 'Presente' },
  { id: 'att6', studentId: '4', studentName: 'Daniel Faria', date: getAttendanceDate(), status: 'Presente' },
  { id: 'att7', studentId: '5', studentName: 'Elena Moraes', date: getAttendanceDate(), status: 'Ausente' },
];
