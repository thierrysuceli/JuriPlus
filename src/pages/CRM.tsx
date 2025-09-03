import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import NovoLeadDialog from "@/components/CrmNovoLead"
import { 
  Plus, 
  Phone, 
  Calendar as CalendarIcon, 
  MapPin,
  MessageCircle,
  Instagram,
  Globe,
  ChevronRight,
  Edit
} from "lucide-react"

interface Lead {
  id: string
  nome: string
  telefone: string
  assunto: string
  plataforma: "whatsapp" | "instagram" | "site"
  dataEntrada: string
  status: "novo" | "contato" | "agendado" | "concluido"
  observacoes?: string
  descricao?: string
}

const mockLeads: Lead[] = [
  {
    id: "1",
    nome: "Maria Silva Santos",
    telefone: "(11) 99999-1234",
    assunto: "Divórcio consensual",
    plataforma: "whatsapp",
    dataEntrada: "2024-01-15T10:30:00",
    status: "novo",
    observacoes: "Cliente quer agilizar o processo. Tem toda documentação.",
    descricao: "Quer se divorciar amigavelmente e já tem todos os documentos organizados"
  },
  {
    id: "2",
    nome: "João Carlos Oliveira",
    telefone: "(11) 99999-5678",
    assunto: "Rescisão trabalhista",
    plataforma: "instagram",
    dataEntrada: "2024-01-14T14:20:00",
    status: "contato",
    descricao: "Foi demitido sem justa causa e quer saber sobre direitos trabalhistas"
  },
  {
    id: "3",
    nome: "Ana Paula Costa",
    telefone: "(11) 99999-9012",
    assunto: "Inventário",
    plataforma: "site",
    dataEntrada: "2024-01-13T16:45:00",
    status: "agendado",
    descricao: "Precisa fazer inventário após falecimento do pai, tem muitos bens envolvidos"
  },
  {
    id: "4",
    nome: "Carlos Eduardo",
    telefone: "(11) 99999-3456",
    assunto: "Pensão alimentícia",
    plataforma: "whatsapp",
    dataEntrada: "2024-01-12T09:15:00",
    status: "concluido",
    descricao: "Quer revisar valor da pensão alimentícia dos filhos menores"
  }
]

const kanbanColumns = [
  { id: "novo", titulo: "Novos Leads", cor: "info" },
  { id: "contato", titulo: "Em Contato", cor: "warning" },
  { id: "agendado", titulo: "Consultoria Marcada", cor: "success" },
  { id: "concluido", titulo: "Concluído", cor: "default" }
]

const getPlataformaIcon = (plataforma: string) => {
  switch (plataforma) {
    case "whatsapp": return <MessageCircle className="h-4 w-4" />
    case "instagram": return <Instagram className="h-4 w-4" />
    case "site": return <Globe className="h-4 w-4" />
    default: return <MessageCircle className="h-4 w-4" />
  }
}

const getPlataformaColor = (plataforma: string) => {
  switch (plataforma) {
    case "whatsapp": return "text-success"
    case "instagram": return "text-destructive"
    case "site": return "text-info"
    default: return "text-muted-foreground"
  }
}

export default function CRM() {
  const [leads, setLeads] = useState<Lead[]>(mockLeads)
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isNovoLeadOpen, setIsNovoLeadOpen] = useState(false)

  const openLeadDetail = (lead: Lead) => {
    setSelectedLead(lead)
    setIsDialogOpen(true)
  }

  const moveLeadToStatus = (leadId: string, newStatus: Lead["status"]) => {
    setLeads(leads.map(lead => 
      lead.id === leadId ? { ...lead, status: newStatus } : lead
    ))
    setIsDialogOpen(false)
  }

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return {
      date: date.toLocaleDateString('pt-BR'),
      time: date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    }
  }

  const getLeadsByStatus = (status: string) => {
    return leads.filter(lead => lead.status === status)
  }

  const addLead = (novoLead: Lead) => {
    setLeads([...leads, novoLead])
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">CRM</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie seus leads e oportunidades
          </p>
        </div>
        
        <Button className="bg-gradient-primary w-full sm:w-auto" onClick={() => setIsNovoLeadOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Lead
        </Button>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
        {/* Mobile: Scroll horizontal */}
        <div className="md:hidden -mx-4 px-4">
          <div className="flex gap-4 pb-4 overflow-x-auto">
            {kanbanColumns.map((column) => {
              const columnLeads = getLeadsByStatus(column.id)
              
              return (
                <div key={column.id} className="min-w-[280px] space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-foreground">{column.titulo}</h3>
                    <Badge variant="secondary" className="text-xs">
                      {columnLeads.length}
                    </Badge>
                  </div>
                  
                  <div className="space-y-3">
                    {columnLeads.map((lead) => {
                      const datetime = formatDateTime(lead.dataEntrada)
                      
                      return (
                        <Card 
                          key={lead.id}
                          className="cursor-pointer hover:shadow-elevated transition-shadow bg-gradient-card"
                          onClick={() => openLeadDetail(lead)}
                        >
                          <CardContent className="p-3">
                            <div className="space-y-2">
                              {/* Header */}
                              <div className="flex items-start justify-between">
                                <h4 className="font-medium text-sm text-foreground line-clamp-1">
                                  {lead.nome}
                                </h4>
                                <div className={`${getPlataformaColor(lead.plataforma)} flex-shrink-0`}>
                                  {getPlataformaIcon(lead.plataforma)}
                                </div>
                              </div>
                              
                              {/* Descrição */}
                              <p className="text-xs text-muted-foreground line-clamp-2">
                                {lead.descricao || lead.assunto}
                              </p>
                              
                              {/* Footer */}
                              <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <span>{datetime.date}</span>
                                <span>{datetime.time}</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                    
                    {columnLeads.length === 0 && (
                      <div className="text-center py-6 text-muted-foreground">
                        <p className="text-sm">Nenhum lead</p>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Desktop: Grid layout */}
        <div className="hidden md:contents">
          {kanbanColumns.map((column) => {
            const columnLeads = getLeadsByStatus(column.id)
            
            return (
              <div key={column.id} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">{column.titulo}</h3>
                  <Badge variant="secondary" className="text-xs">
                    {columnLeads.length}
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  {columnLeads.map((lead) => {
                    const datetime = formatDateTime(lead.dataEntrada)
                    
                    return (
                      <Card 
                        key={lead.id}
                        className="cursor-pointer hover:shadow-elevated transition-shadow bg-gradient-card"
                        onClick={() => openLeadDetail(lead)}
                      >
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            {/* Header */}
                            <div className="flex items-start justify-between">
                              <h4 className="font-medium text-sm text-foreground line-clamp-1">
                                {lead.nome}
                              </h4>
                              <div className={`${getPlataformaColor(lead.plataforma)}`}>
                                {getPlataformaIcon(lead.plataforma)}
                              </div>
                            </div>
                            
                             {/* Descrição */}
                             <p className="text-xs text-muted-foreground line-clamp-2">
                               {lead.descricao || lead.assunto}
                             </p>
                            
                            {/* Footer */}
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span>{datetime.date}</span>
                              <span>{datetime.time}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                  
                  {columnLeads.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <p className="text-sm">Nenhum lead</p>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Lead Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <span>Detalhes do Lead</span>
              {selectedLead && (
                <div className={`${getPlataformaColor(selectedLead.plataforma)}`}>
                  {getPlataformaIcon(selectedLead.plataforma)}
                </div>
              )}
            </DialogTitle>
          </DialogHeader>
          
          {selectedLead && (
            <div className="space-y-6">
              {/* Informações Básicas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Nome</label>
                  <p className="text-foreground">{selectedLead.nome}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Telefone</label>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <p className="text-foreground">{selectedLead.telefone}</p>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Assunto</label>
                  <p className="text-foreground">{selectedLead.assunto}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Data de Entrada</label>
                  <div className="flex items-center space-x-2">
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    <p className="text-foreground">
                      {formatDateTime(selectedLead.dataEntrada).date} às {formatDateTime(selectedLead.dataEntrada).time}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Observações */}
              {selectedLead.observacoes && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Observações</label>
                  <p className="text-foreground mt-1 p-3 bg-accent rounded-lg">
                    {selectedLead.observacoes}
                  </p>
                 </div>
               )}

               {/* Descrição */}
               {selectedLead.descricao && (
                 <div>
                   <label className="text-sm font-medium text-muted-foreground">Descrição do Problema</label>
                   <p className="text-foreground mt-1 p-3 bg-accent rounded-lg">
                     {selectedLead.descricao}
                   </p>
                 </div>
               )}
               
               {/* Ações */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">
                    Mover para
                  </label>
                  <div className="flex space-x-2">
                    {kanbanColumns
                      .filter(col => col.id !== selectedLead.status)
                      .map((column) => (
                        <Button
                          key={column.id}
                          variant="outline"
                          size="sm"
                          onClick={() => moveLeadToStatus(selectedLead.id, column.id as Lead["status"])}
                        >
                          {column.titulo}
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      ))
                    }
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button variant="outline" className="flex-1">
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                  <Button className="flex-1 bg-gradient-primary">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    Agendar Consultoria
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Novo Lead Dialog */}
      <NovoLeadDialog
        open={isNovoLeadOpen}
        onOpenChange={setIsNovoLeadOpen}
        onAddLead={addLead}
      />
    </div>
  )
}