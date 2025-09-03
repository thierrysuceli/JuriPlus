import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Phone,
  Video,
  MapPin,
  Plus,
  Filter
} from "lucide-react"

interface Agendamento {
  id: string
  cliente: string
  telefone: string
  assunto: string
  data: string
  horario: string
  plataforma: "presencial" | "online" | "telefone"
  status: "pendente" | "realizada" | "cancelada"
  observacoes?: string
}

const mockAgendamentos: Agendamento[] = [
  {
    id: "1",
    cliente: "Maria Silva Santos",
    telefone: "(11) 99999-1234",
    assunto: "Divórcio consensual",
    data: "2024-01-16",
    horario: "14:00",
    plataforma: "presencial",
    status: "pendente"
  },
  {
    id: "2",
    cliente: "João Carlos Oliveira",
    telefone: "(11) 99999-5678",
    assunto: "Rescisão trabalhista",
    data: "2024-01-17",
    horario: "10:00",
    plataforma: "online",
    status: "pendente"
  },
  {
    id: "3",
    cliente: "Ana Paula Costa",
    telefone: "(11) 99999-9012",
    assunto: "Inventário",
    data: "2024-01-17",
    horario: "16:30",
    plataforma: "telefone",
    status: "pendente"
  },
  {
    id: "4",
    cliente: "Carlos Eduardo",
    telefone: "(11) 99999-3456",
    assunto: "Pensão alimentícia",
    data: "2024-01-15",
    horario: "09:15",
    plataforma: "presencial",
    status: "realizada"
  }
]

const getPlataformaIcon = (plataforma: string) => {
  switch (plataforma) {
    case "presencial": return <MapPin className="h-4 w-4" />
    case "online": return <Video className="h-4 w-4" />
    case "telefone": return <Phone className="h-4 w-4" />
    default: return <CalendarIcon className="h-4 w-4" />
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "pendente": return "warning"
    case "realizada": return "success"
    case "cancelada": return "destructive"
    default: return "default"
  }
}

export default function Agenda() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [viewMode, setViewMode] = useState<"mes" | "semana">("mes")
  const [statusFilter, setStatusFilter] = useState<string>("todos")

  const filteredAgendamentos = mockAgendamentos.filter(agendamento => {
    if (statusFilter !== "todos" && agendamento.status !== statusFilter) {
      return false
    }
    return true
  })

  const agendamentosHoje = filteredAgendamentos.filter(
    agendamento => agendamento.data === new Date().toISOString().split('T')[0]
  )

  const proximosAgendamentos = filteredAgendamentos
    .filter(agendamento => new Date(agendamento.data) >= new Date())
    .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime())
    .slice(0, 5)

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Agenda</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie suas consultorias e compromissos
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="pendente">Pendentes</SelectItem>
              <SelectItem value="realizada">Realizadas</SelectItem>
              <SelectItem value="cancelada">Canceladas</SelectItem>
            </SelectContent>
          </Select>
          
          <Button className="bg-gradient-primary">
            <Plus className="h-4 w-4 mr-2" />
            Nova Consultoria
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendário */}
        <Card className="lg:col-span-1 bg-gradient-card shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CalendarIcon className="h-5 w-5 text-primary" />
              <span>Calendário</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-md border-0"
            />
            
            <div className="mt-4 space-y-2">
              <h4 className="font-medium text-sm text-foreground">Hoje</h4>
              {agendamentosHoje.length > 0 ? (
                agendamentosHoje.map((agendamento) => (
                  <div key={agendamento.id} className="flex items-center space-x-2 text-xs">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="text-foreground">{agendamento.horario}</span>
                    <span className="text-muted-foreground truncate">
                      {agendamento.cliente}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-muted-foreground">Nenhum agendamento hoje</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Lista de Agendamentos */}
        <Card className="lg:col-span-2 bg-gradient-card shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Próximos Agendamentos</span>
              <Select value={viewMode} onValueChange={(value: "mes" | "semana") => setViewMode(value)}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="semana">Esta Semana</SelectItem>
                  <SelectItem value="mes">Este Mês</SelectItem>
                </SelectContent>
              </Select>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {proximosAgendamentos.map((agendamento) => (
                <Card key={agendamento.id} className="p-4 hover:shadow-card transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center space-x-3">
                        <h4 className="font-medium text-foreground">{agendamento.cliente}</h4>
                        <Badge variant={getStatusColor(agendamento.status) as any}>
                          {agendamento.status}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground">{agendamento.assunto}</p>
                      
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <CalendarIcon className="h-3 w-3" />
                          <span>{new Date(agendamento.data).toLocaleDateString('pt-BR')}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{agendamento.horario}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          {getPlataformaIcon(agendamento.plataforma)}
                          <span className="capitalize">{agendamento.plataforma}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Phone className="h-3 w-3" />
                          <span>{agendamento.telefone}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        Editar
                      </Button>
                      {agendamento.status === "pendente" && (
                        <Button size="sm" className="bg-gradient-primary">
                          Iniciar
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
              
              {proximosAgendamentos.length === 0 && (
                <div className="text-center py-8">
                  <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">Nenhum agendamento encontrado</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}