import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import DashboardChart from "@/components/DashboardChart"
import { 
  Users, 
  Calendar, 
  TrendingUp, 
  MessageCircle, 
  Filter,
  BarChart3,
  Target
} from "lucide-react"

export default function Dashboard() {
  const [periodo, setPeriodo] = useState("semana")

  const statsData = {
    semana: {
      leadsIniciados: 24,
      consultoriasAgendadas: 8,
      taxaConversao: 33.3,
      leadsAnterior: 18,
      consultoriasAnterior: 6
    },
    mes: {
      leadsIniciados: 156,
      consultoriasAgendadas: 42,
      taxaConversao: 26.9,
      leadsAnterior: 134,
      consultoriasAnterior: 38
    }
  }

  const currentStats = statsData[periodo as keyof typeof statsData]
  
  const calcularVariacao = (atual: number, anterior: number) => {
    const variacao = ((atual - anterior) / anterior) * 100
    return {
      valor: variacao,
      positiva: variacao > 0
    }
  }

  const variacaoLeads = calcularVariacao(currentStats.leadsIniciados, currentStats.leadsAnterior)
  const variacaoConsultorias = calcularVariacao(currentStats.consultoriasAgendadas, currentStats.consultoriasAnterior)

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Visão geral do seu escritório jurídico
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Select value={periodo} onValueChange={setPeriodo}>
            <SelectTrigger className="w-[140px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="semana">Esta Semana</SelectItem>
              <SelectItem value="mes">Este Mês</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
        {/* Leads Iniciados */}
        <Card className="bg-gradient-card shadow-card hover:shadow-elevated transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Leads Iniciados
            </CardTitle>
            <MessageCircle className="h-5 w-5 text-info" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {currentStats.leadsIniciados}
            </div>
            <div className="flex items-center space-x-2 mt-1">
              <Badge 
                variant={variacaoLeads.positiva ? "default" : "destructive"}
                className="text-xs"
              >
                <TrendingUp className="h-3 w-3 mr-1" />
                {variacaoLeads.positiva ? "+" : ""}{variacaoLeads.valor.toFixed(1)}%
              </Badge>
              <p className="text-xs text-muted-foreground">
                vs. {periodo === "semana" ? "semana anterior" : "mês anterior"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Consultorias Agendadas */}
        <Card className="bg-gradient-card shadow-card hover:shadow-elevated transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Consultorias Agendadas
            </CardTitle>
            <Calendar className="h-5 w-5 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {currentStats.consultoriasAgendadas}
            </div>
            <div className="flex items-center space-x-2 mt-1">
              <Badge 
                variant={variacaoConsultorias.positiva ? "default" : "destructive"}
                className="text-xs"
              >
                <TrendingUp className="h-3 w-3 mr-1" />
                {variacaoConsultorias.positiva ? "+" : ""}{variacaoConsultorias.valor.toFixed(1)}%
              </Badge>
              <p className="text-xs text-muted-foreground">
                vs. {periodo === "semana" ? "semana anterior" : "mês anterior"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Taxa de Conversão */}
        <Card className="bg-gradient-card shadow-card hover:shadow-elevated transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Taxa de Conversão
            </CardTitle>
            <Target className="h-5 w-5 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {currentStats.taxaConversao}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              De leads para consultorias
            </p>
          </CardContent>
        </Card>

        {/* Próximas Consultorias */}
        <Card className="bg-gradient-card shadow-card hover:shadow-elevated transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Próximas Consultorias
            </CardTitle>
            <Users className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              3
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Hoje e amanhã
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {/* Gráfico de Performance */}
        <Card className="bg-gradient-card shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              <span>Performance de Leads</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DashboardChart periodo={periodo as 'semana' | 'mes'} />
          </CardContent>
        </Card>

        {/* Próximos Agendamentos */}
        <Card className="bg-gradient-card shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-primary" />
              <span>Próximos Agendamentos</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  cliente: "Maria Santos",
                  assunto: "Direito Trabalhista",
                  horario: "14:00",
                  data: "Hoje"
                },
                {
                  cliente: "João Oliveira",
                  assunto: "Direito Civil",
                  horario: "10:00",
                  data: "Amanhã"
                },
                {
                  cliente: "Ana Costa",
                  assunto: "Direito Família",
                  horario: "16:30",
                  data: "Amanhã"
                }
              ].map((agendamento, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 bg-accent rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-medium text-sm text-foreground">
                      {agendamento.cliente}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {agendamento.assunto}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-primary">
                      {agendamento.data}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {agendamento.horario}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <Button variant="outline" className="w-full mt-4">
              Ver Toda Agenda
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}