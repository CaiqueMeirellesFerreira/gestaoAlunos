// src/components/student-registration-form.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import type { Student } from "@/types";
import { courses } from "@/types";

const studentFormSchema = z.object({
  name: z.string().min(2, { message: "Nome deve ter pelo menos 2 caracteres." }),
  contact: z.string().email({ message: "Por favor, insira um email válido." })
    .or(z.string().regex(/^\d{10,11}$/, { message: "Telefone deve ter 10 ou 11 dígitos." })),
  course: z.string({ required_error: "Por favor, selecione um curso." }),
});

type StudentFormValues = z.infer<typeof studentFormSchema>;

interface StudentRegistrationFormProps {
  onStudentAdd: (student: Student) => void;
  onClose: () => void;
}

export function StudentRegistrationForm({ onStudentAdd, onClose }: StudentRegistrationFormProps) {
  const { toast } = useToast();
  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: {
      name: "",
      contact: "",
    },
  });

  function onSubmit(data: StudentFormValues) {
    const newStudent: Student = {
      id: Date.now().toString(), // Simple ID generation
      ...data,
      registrationDate: new Date().toISOString().split('T')[0],
    };
    onStudentAdd(newStudent);
    toast({
      title: "Aluno Registrado!",
      description: `${data.name} foi adicionado com sucesso.`,
      variant: "default", // This should map to a success style (green with current theme)
    });
    form.reset();
    onClose();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome Completo</FormLabel>
              <FormControl>
                <Input placeholder="Ex: João da Silva" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="contact"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contato (Email ou Telefone)</FormLabel>
              <FormControl>
                <Input placeholder="Ex: joao@email.com ou 999998888" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="course"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Curso</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o curso" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course} value={course}>
                      {course}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" className="bg-accent hover:bg-accent/90 text-accent-foreground">
            Registrar Aluno
          </Button>
        </div>
      </form>
    </Form>
  );
}
