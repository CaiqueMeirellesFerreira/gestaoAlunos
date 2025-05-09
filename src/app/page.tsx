import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, CalendarCheck, BarChartBig } from "lucide-react";
import { PageTitle } from "@/components/page-title";
import Link from "next/link";

export default function DashboardPage() {
  const summaryCards = [
    { title: "Total de Alunos", value: "150", icon: Users, href: "/students", hint: "student group" },
    { title: "Frequência Hoje", value: "85%", icon: CalendarCheck, href: "/attendance", hint: "calendar checkmark" },
    { title: "Cursos Ativos", value: "4", icon: BarChartBig, href: "/reports", hint: "education chart" },
  ];

  return (
    <div className="container mx-auto">
      <PageTitle title="Painel Principal" />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {summaryCards.map((card) => (
          <Link href={card.href} key={card.title} passHref>
            <Card className="hover:shadow-lg transition-shadow duration-200 cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </CardTitle>
                <card.icon className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{card.value}</div>
                <p className="text-xs text-muted-foreground pt-1">
                  Ver detalhes
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Atividade Recente</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Nenhuma atividade recente para exibir.</p>
            {/* Placeholder for recent activity feed */}
            <div className="mt-4 space-y-4">
              {[1,2,3].map(i => (
                <div key={i} className="flex items-center gap-3 p-3 bg-secondary/50 rounded-md">
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                    <Users className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Novo aluno registrado: Aluno Exemplo {i}</p>
                    <p className="text-xs text-muted-foreground">2 horas atrás</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Lembretes</CardTitle>
          </CardHeader>
          <CardContent>
             <p className="text-sm text-muted-foreground">Nenhum lembrete.</p>
             {/* Placeholder for reminders */}
             <div className="mt-4 space-y-4">
                <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-md">
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                    <CalendarCheck className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Registrar frequência da turma de Web Dev</p>
                    <p className="text-xs text-muted-foreground">Hoje às 14:00</p>
                  </div>
                </div>
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
