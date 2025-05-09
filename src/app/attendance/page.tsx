"use client";

import { useState, useEffect, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageTitle } from "@/components/page-title";
import type { Student, AttendanceRecord, AttendanceStatus } from "@/types";
import { mockStudents, mockAttendance } from "@/lib/mock-data";
import { CalendarIcon, Save } from "lucide-react";
import { format, parseISO } from "date-fns";
import { ptBR } from 'date-fns/locale';
import { useToast } from "@/hooks/use-toast";

export default function AttendancePage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<Record<string, AttendanceRecord[]>>({}); // studentId -> records
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isMounted, setIsMounted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setStudents(mockStudents);
    // Group initial mock attendance by studentId and date
    const initialRecords: Record<string, AttendanceRecord[]> = {};
    mockAttendance.forEach(rec => {
      if (!initialRecords[rec.studentId]) {
        initialRecords[rec.studentId] = [];
      }
      initialRecords[rec.studentId].push(rec);
    });
    setAttendanceRecords(initialRecords);
    setIsMounted(true);
  }, []);
  
  const formattedSelectedDate = useMemo(() => {
    return selectedDate ? format(selectedDate, "yyyy-MM-dd") : "";
  }, [selectedDate]);

  const handleAttendanceChange = (studentId: string, status: AttendanceStatus) => {
    if (!selectedDate) return;
    
    setAttendanceRecords(prev => {
      const studentRecords = prev[studentId] ? [...prev[studentId]] : [];
      const existingRecordIndex = studentRecords.findIndex(r => r.date === formattedSelectedDate);
      const studentName = students.find(s => s.id === studentId)?.name;

      if (existingRecordIndex > -1) {
        studentRecords[existingRecordIndex].status = status;
      } else {
        studentRecords.push({
          id: `${studentId}-${formattedSelectedDate}-${Date.now()}`,
          studentId,
          studentName,
          date: formattedSelectedDate,
          status,
        });
      }
      return { ...prev, [studentId]: studentRecords };
    });
  };

  const getStudentAttendanceStatus = (studentId: string): AttendanceStatus | undefined => {
    if (!selectedDate) return undefined;
    const studentRecords = attendanceRecords[studentId];
    if (!studentRecords) return undefined;
    const recordForDate = studentRecords.find(r => r.date === formattedSelectedDate);
    return recordForDate?.status;
  };

  const handleSaveAttendance = () => {
    // In a real app, this would send data to a backend
    console.log("Saving attendance for date:", formattedSelectedDate, attendanceRecords);
    toast({
      title: "Frequência Salva!",
      description: `A frequência para ${selectedDate ? format(selectedDate, "dd/MM/yyyy", { locale: ptBR }) : ''} foi salva.`,
      variant: "default",
    });
  };
  
  if (!isMounted) {
    return (
      <div>
        <PageTitle title="Registro de Frequência" />
        <div className="h-10 w-48 animate-pulse rounded-md bg-muted mb-4"></div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 w-full animate-pulse rounded-md bg-muted"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <PageTitle
        title="Registro de Frequência"
        actions={
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className="w-[280px] justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, "PPP", { locale: ptBR }) : <span>Selecione uma data</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                initialFocus
                locale={ptBR}
              />
            </PopoverContent>
          </Popover>
        }
      />

      <Card className="shadow-md">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Aluno</TableHead>
                <TableHead>Curso</TableHead>
                <TableHead className="w-[200px]">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.length > 0 ? (
                students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell>{student.course}</TableCell>
                    <TableCell>
                      <Select
                        value={getStudentAttendanceStatus(student.id)}
                        onValueChange={(status) => handleAttendanceChange(student.id, status as AttendanceStatus)}
                        disabled={!selectedDate}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Marcar Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Presente">Presente</SelectItem>
                          <SelectItem value="Ausente">Ausente</SelectItem>
                          <SelectItem value="Atrasado">Atrasado</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                    Nenhum aluno para exibir.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {selectedDate && students.length > 0 && (
        <div className="mt-6 flex justify-end">
          <Button onClick={handleSaveAttendance} className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Save className="mr-2 h-4 w-4" />
            Salvar Frequência
          </Button>
        </div>
      )}
    </div>
  );
}
