
"use client";

import { useState, useEffect, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableCaption,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageTitle } from "@/components/page-title";
import type { AttendanceRecord, Student } from "@/types";
import { mockAttendance, mockStudents } from "@/lib/mock-data";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { courses } from "@/types";
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const ALL_COURSES_VALUE = "all_courses_placeholder";
const ALL_STATUSES_VALUE = "all_statuses_placeholder";

export default function ReportsPage() {
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
  const [_students, setStudents] = useState<Student[]>([]); // Renamed to avoid conflict
  const [isMounted, setIsMounted] = useState(false);
  const [filterStudentName, setFilterStudentName] = useState('');
  const [filterCourse, setFilterCourse] = useState(''); // Empty string for initial state (placeholder shown)
  const [filterStatus, setFilterStatus] = useState(''); // Empty string for initial state (placeholder shown)

  useEffect(() => {
    // Enrich attendance data with student names if not already present for easier filtering/display.
    // In a real app, this join might happen on the backend or be part of the initial data fetch.
    const enrichedAttendance = mockAttendance.map(att => {
        const student = mockStudents.find(s => s.id === att.studentId);
        return {
            ...att,
            studentName: student ? student.name : 'Desconhecido',
            course: student ? student.course : 'N/A'
        };
    });
    setAttendanceData(enrichedAttendance);
    setStudents(mockStudents);
    setIsMounted(true);
  }, []);

  const filteredAttendance = useMemo(() => {
    return attendanceData.filter(record => {
      const studentMatch = filterStudentName ? record.studentName?.toLowerCase().includes(filterStudentName.toLowerCase()) : true;
      const courseMatch = !filterCourse || filterCourse === ALL_COURSES_VALUE ? true : (record as any).course === filterCourse;
      const statusMatch = !filterStatus || filterStatus === ALL_STATUSES_VALUE ? true : record.status === filterStatus;
      return studentMatch && courseMatch && statusMatch;
    });
  }, [attendanceData, filterStudentName, filterCourse, filterStatus]);

  const attendanceSummary = useMemo(() => {
    const summary = { Presente: 0, Ausente: 0, Atrasado: 0 };
    filteredAttendance.forEach(record => {
      summary[record.status]++;
    });
    return [
      { status: 'Presente', count: summary.Presente, fill: "hsl(var(--chart-2))" },
      { status: 'Ausente', count: summary.Ausente, fill: "hsl(var(--destructive))" },
      { status: 'Atrasado', count: summary.Atrasado, fill: "hsl(var(--chart-4))" },
    ];
  }, [filteredAttendance]);

  const chartConfig = {
    count: { label: "Contagem" },
    Presente: { label: "Presente", color: "hsl(var(--chart-2))" },
    Ausente: { label: "Ausente", color: "hsl(var(--destructive))" },
    Atrasado: { label: "Atrasado", color: "hsl(var(--chart-4))" },
  };


  if (!isMounted) {
     return (
      <div>
        <PageTitle title="Relatórios de Frequência" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="h-10 w-full animate-pulse rounded-md bg-muted"></div>
            <div className="h-10 w-full animate-pulse rounded-md bg-muted"></div>
            <div className="h-10 w-full animate-pulse rounded-md bg-muted"></div>
        </div>
        <div className="h-64 w-full animate-pulse rounded-md bg-muted mb-6"></div>
        <div className="h-96 w-full animate-pulse rounded-md bg-muted"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <PageTitle title="Relatórios de Frequência" />

      <Card className="mb-6 shadow-md">
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Input
            placeholder="Filtrar por nome do aluno..."
            value={filterStudentName}
            onChange={(e) => setFilterStudentName(e.target.value)}
          />
          <Select value={filterCourse} onValueChange={setFilterCourse}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por curso" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_COURSES_VALUE}>Todos os Cursos</SelectItem>
              {courses.map(course => (
                <SelectItem key={course} value={course}>{course}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_STATUSES_VALUE}>Todos os Status</SelectItem>
              <SelectItem value="Presente">Presente</SelectItem>
              <SelectItem value="Ausente">Ausente</SelectItem>
              <SelectItem value="Atrasado">Atrasado</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card className="mb-6 shadow-md">
        <CardHeader>
          <CardTitle>Resumo da Frequência</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredAttendance.length > 0 ? (
            <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={attendanceSummary} margin={{ top: 20, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="status" tickLine={false} tickMargin={10} axisLine={false} />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar dataKey="count" radius={4} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          ) : (
             <p className="text-center text-muted-foreground py-8">Nenhum dado para exibir no gráfico com os filtros atuais.</p>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Registros Detalhados</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableCaption>Lista de registros de frequência.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Aluno</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Curso</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAttendance.length > 0 ? (
                filteredAttendance.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">{record.studentName || record.studentId}</TableCell>
                    <TableCell>{format(parseISO(record.date), "dd/MM/yyyy", { locale: ptBR })}</TableCell>
                    <TableCell><Badge variant="outline">{(record as any).course || 'N/A'}</Badge></TableCell>
                    <TableCell>
                      <Badge variant={
                        record.status === 'Presente' ? 'default' : 
                        record.status === 'Ausente' ? 'destructive' :
                        'secondary' // Atrasado
                      } className={record.status === 'Presente' ? 'bg-accent text-accent-foreground' : ''}>
                        {record.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                    Nenhum registro de frequência encontrado com os filtros atuais.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

