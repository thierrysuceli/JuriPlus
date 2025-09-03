import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  History, 
  User, 
  Phone, 
  Mail, 
  MapPin,
  Calendar,
  FileText,
  X,
  MessageCircle
} from "lucide-react"

// Dados simulados
const etiquetasDisponiveis = [
  { id: 1, nome: "VIP", cor: "bg-yellow-500" },
  { id: 2, nome: "Inadimplente", cor: "bg-red-500" },
  { id: 3, nome: "Ativo", cor: "bg-green-500" },
  { id: 4, nome: "Novo Cliente", cor: "bg-blue-500" },
  { id: 5, nome: "Trabalhista", cor: "bg-purple-500" },
  { id: 6, nome: "Civil", cor: "bg-orange-500" }
]

const clientesSimulados = [
  {
    id: 1,
    nome: "Maria Silva Santos",
    email: "maria.silva@email.com",
    telefone: "(11) 98765-4321",
    endereco: "Rua das Flores, 123 - São Paulo, SP",
    etiquetas: [1, 3, 5], // VIP, Ativo, Trabalhista
    dataCriacao: "2024-01-15",
    observacoes: "Cliente VIP com vários processos trabalhistas em andamento."
  },
  {
    id: 2,
    nome: "João Pedro Oliveira",
    email: "joao.pedro@email.com",
    telefone: "(11) 91234-5678",
    endereco: "Av. Paulista, 456 - São Paulo, SP",
    etiquetas: [2, 6], // Inadimplente, Civil
    dataCriacao: "2024-02-20",
    observacoes: "Cliente com pendências financeiras. Processo de divórcio."
  },
  {
    id: 3,
    nome: "Ana Carolina Lima",
    email: "ana.lima@email.com",
    telefone: "(11) 99999-0000",
    endereco: "Rua dos Jardins, 789 - São Paulo, SP",
    etiquetas: [4, 3], // Novo Cliente, Ativo
    dataCriacao: "2024-03-10",
    observacoes: "Cliente recém chegado, muito interessada nos serviços."
  }
]

const historicoSimulado = {
  1: [
    { data: "2024-03-15", tipo: "Reunião", descricao: "Reunião inicial para discussão do caso trabalhista" },
    { data: "2024-03-10", tipo: "Documento", descricao: "Recebimento de documentos trabalhistas" },
    { data: "2024-02-28", tipo: "Pagamento", descricao: "Pagamento de honorários - R$ 2.500,00" },
    { data: "2024-02-15", tipo: "Audiência", descricao: "Participação em audiência trabalhista" }
  ],
  2: [
    { data: "2024-03-12", tipo: "Cobrança", descricao: "Tentativa de cobrança - sem sucesso" },
    { data: "2024-03-01", tipo: "Reunião", descricao: "Reunião sobre processo de divórcio" },
    { data: "2024-02-20", tipo: "Cadastro", descricao: "Cliente cadastrado no sistema" }
  ],
  3: [
    { data: "2024-03-20", tipo: "Consulta", descricao: "Primeira consulta jurídica gratuita" },
    { data: "2024-03-10", tipo: "Cadastro", descricao: "Cliente cadastrado no sistema" }
  ]
}

export default function Clientes() {
  const [busca, setBusca] = useState("")
  const [etiquetasFiltro, setEtiquetasFiltro] = useState<number[]>([])
  const [clienteSelecionado, setClienteSelecionado] = useState<any>(null)
  const [showHistorico, setShowHistorico] = useState(false)
  const [showNovoCliente, setShowNovoCliente] = useState(false)
  const [showNovaEtiqueta, setShowNovaEtiqueta] = useState(false)

  const clientesFiltrados = clientesSimulados.filter(cliente => {
    const matchBusca = cliente.nome.toLowerCase().includes(busca.toLowerCase()) ||
                      cliente.email.toLowerCase().includes(busca.toLowerCase())
    
    const matchEtiquetas = etiquetasFiltro.length === 0 || 
                          etiquetasFiltro.some(etiqueta => cliente.etiquetas.includes(etiqueta))
    
    return matchBusca && matchEtiquetas
  })

  const toggleEtiquetaFiltro = (etiquetaId: number) => {
    setEtiquetasFiltro(prev => 
      prev.includes(etiquetaId) 
        ? prev.filter(id => id !== etiquetaId)
        : [...prev, etiquetaId]
    )
  }

  const getEtiquetaNome = (etiquetaId: number) => {
    return etiquetasDisponiveis.find(e => e.id === etiquetaId)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Clientes</h1>
          <p className="text-muted-foreground">Gerencie seus clientes e etiquetas</p>
        </div>
        
        <div className="flex gap-2">
          <Dialog open={showNovaEtiqueta} onOpenChange={setShowNovaEtiqueta}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Nova Etiqueta
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Nova Etiqueta</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="nome-etiqueta">Nome da Etiqueta</Label>
                  <Input id="nome-etiqueta" placeholder="Ex: VIP, Inadimplente..." />
                </div>
                <div>
                  <Label>Cor da Etiqueta</Label>
                  <div className="flex gap-2 mt-2">
                    {["bg-red-500", "bg-blue-500", "bg-green-500", "bg-yellow-500", "bg-purple-500", "bg-orange-500"].map(cor => (
                      <div key={cor} className={`w-8 h-8 rounded-full cursor-pointer ${cor}`} />
                    ))}
                  </div>
                </div>
                <Button className="w-full">Criar Etiqueta</Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={showNovoCliente} onOpenChange={setShowNovoCliente}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Novo Cliente
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Cadastrar Novo Cliente</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nome">Nome Completo</Label>
                    <Input id="nome" placeholder="Nome do cliente" />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="email@exemplo.com" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="telefone">Telefone</Label>
                    <Input id="telefone" placeholder="(11) 99999-9999" />
                  </div>
                  <div>
                    <Label>Etiquetas</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {etiquetasDisponiveis.map(etiqueta => (
                        <Badge key={etiqueta.id} variant="outline" className="cursor-pointer">
                          {etiqueta.nome}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div>
                  <Label htmlFor="endereco">Endereço</Label>
                  <Input id="endereco" placeholder="Endereço completo" />
                </div>
                <div>
                  <Label htmlFor="observacoes">Observações</Label>
                  <Textarea id="observacoes" placeholder="Observações sobre o cliente..." />
                </div>
                <Button className="w-full">Cadastrar Cliente</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Buscar clientes por nome ou email..."
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
            
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Filter className="h-4 w-4" />
                <span className="text-sm font-medium">Filtrar por etiquetas:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {etiquetasDisponiveis.map(etiqueta => (
                  <Badge
                    key={etiqueta.id}
                    variant={etiquetasFiltro.includes(etiqueta.id) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleEtiquetaFiltro(etiqueta.id)}
                  >
                    {etiqueta.nome}
                  </Badge>
                ))}
                {etiquetasFiltro.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEtiquetasFiltro([])}
                    className="h-6 px-2"
                  >
                    <X className="h-3 w-3 mr-1" />
                    Limpar
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Clientes */}
      <div className="grid gap-4">
        {clientesFiltrados.map(cliente => (
          <Card key={cliente.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{cliente.nome}</h3>
                      <p className="text-sm text-muted-foreground">Cliente desde {new Date(cliente.dataCriacao).toLocaleDateString('pt-BR')}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{cliente.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{cliente.telefone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="truncate">{cliente.endereco}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {cliente.etiquetas.map(etiquetaId => {
                      const etiqueta = getEtiquetaNome(etiquetaId)
                      return etiqueta ? (
                        <Badge key={etiquetaId} className={etiqueta.cor}>
                          {etiqueta.nome}
                        </Badge>
                      ) : null
                    })}
                  </div>

                  {cliente.observacoes && (
                    <p className="text-sm text-muted-foreground">{cliente.observacoes}</p>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setClienteSelecionado(cliente)
                      setShowHistorico(true)
                    }}
                  >
                    <History className="h-4 w-4 mr-2" />
                    Histórico
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setClienteSelecionado(cliente)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Ver Detalhes
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal de Detalhes do Cliente */}
      <Dialog open={!!clienteSelecionado && !showHistorico} onOpenChange={() => setClienteSelecionado(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes do Cliente</DialogTitle>
          </DialogHeader>
          {clienteSelecionado && (
            <Tabs defaultValue="info" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="info">Informações</TabsTrigger>
                <TabsTrigger value="edit">Editar</TabsTrigger>
              </TabsList>
              
              <TabsContent value="info" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Nome</Label>
                    <p className="font-medium">{clienteSelecionado.nome}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                    <p className="font-medium">{clienteSelecionado.email}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Telefone</Label>
                    <p className="font-medium">{clienteSelecionado.telefone}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Data de Cadastro</Label>
                    <p className="font-medium">{new Date(clienteSelecionado.dataCriacao).toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Endereço</Label>
                  <p className="font-medium">{clienteSelecionado.endereco}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Etiquetas</Label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {clienteSelecionado.etiquetas.map((etiquetaId: number) => {
                      const etiqueta = getEtiquetaNome(etiquetaId)
                      return etiqueta ? (
                        <Badge key={etiquetaId} className={etiqueta.cor}>
                          {etiqueta.nome}
                        </Badge>
                      ) : null
                    })}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Observações</Label>
                  <p className="font-medium">{clienteSelecionado.observacoes}</p>
                </div>
              </TabsContent>
              
              <TabsContent value="edit" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-nome">Nome</Label>
                    <Input id="edit-nome" defaultValue={clienteSelecionado.nome} />
                  </div>
                  <div>
                    <Label htmlFor="edit-email">Email</Label>
                    <Input id="edit-email" defaultValue={clienteSelecionado.email} />
                  </div>
                  <div>
                    <Label htmlFor="edit-telefone">Telefone</Label>
                    <Input id="edit-telefone" defaultValue={clienteSelecionado.telefone} />
                  </div>
                  <div>
                    <Label>Etiquetas</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {etiquetasDisponiveis.map(etiqueta => (
                        <Badge 
                          key={etiqueta.id} 
                          variant={clienteSelecionado.etiquetas.includes(etiqueta.id) ? "default" : "outline"}
                          className="cursor-pointer"
                        >
                          {etiqueta.nome}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div>
                  <Label htmlFor="edit-endereco">Endereço</Label>
                  <Input id="edit-endereco" defaultValue={clienteSelecionado.endereco} />
                </div>
                <div>
                  <Label htmlFor="edit-observacoes">Observações</Label>
                  <Textarea id="edit-observacoes" defaultValue={clienteSelecionado.observacoes} />
                </div>
                <Button className="w-full">Salvar Alterações</Button>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de Histórico */}
      <Dialog open={showHistorico} onOpenChange={() => setShowHistorico(false)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Histórico do Cliente</DialogTitle>
            {clienteSelecionado && (
              <p className="text-muted-foreground">{clienteSelecionado.nome}</p>
            )}
          </DialogHeader>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {clienteSelecionado && historicoSimulado[clienteSelecionado.id as keyof typeof historicoSimulado]?.map((item, index) => (
              <div key={index} className="flex gap-4 p-4 border rounded-lg">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                    {item.tipo === 'Reunião' && <Calendar className="h-5 w-5" />}
                    {item.tipo === 'Documento' && <FileText className="h-5 w-5" />}
                    {item.tipo === 'Pagamento' && <span className="text-green-600 font-bold">$</span>}
                    {item.tipo === 'Audiência' && <User className="h-5 w-5" />}
                    {item.tipo === 'Cobrança' && <span className="text-red-600 font-bold">!</span>}
                    {item.tipo === 'Consulta' && <MessageCircle className="h-5 w-5" />}
                    {item.tipo === 'Cadastro' && <Plus className="h-5 w-5" />}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <Badge variant="outline">{item.tipo}</Badge>
                    <span className="text-sm text-muted-foreground">
                      {new Date(item.data).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <p className="text-sm">{item.descricao}</p>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}