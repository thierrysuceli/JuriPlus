import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

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

interface NovoLeadDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddLead: (lead: Lead) => void
}

export default function NovoLeadDialog({ open, onOpenChange, onAddLead }: NovoLeadDialogProps) {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    nome: "",
    telefone: "",
    assunto: "",
    plataforma: "",
    descricao: "",
    observacoes: ""
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.nome || !formData.telefone || !formData.assunto || !formData.plataforma || !formData.descricao) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      })
      return
    }

    const novoLead: Lead = {
      id: Date.now().toString(),
      nome: formData.nome,
      telefone: formData.telefone,
      assunto: formData.assunto,
      plataforma: formData.plataforma as Lead["plataforma"],
      dataEntrada: new Date().toISOString(),
      status: "novo",
      descricao: formData.descricao,
      observacoes: formData.observacoes || undefined
    }

    onAddLead(novoLead)
    
    // Reset form
    setFormData({
      nome: "",
      telefone: "",
      assunto: "",
      plataforma: "",
      descricao: "",
      observacoes: ""
    })

    toast({
      title: "Sucesso",
      description: "Lead adicionado com sucesso!",
      variant: "default"
    })

    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Novo Lead</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome Completo *</Label>
            <Input
              id="nome"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              placeholder="Ex: João Silva Santos"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="telefone">Telefone *</Label>
            <Input
              id="telefone"
              value={formData.telefone}
              onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
              placeholder="(11) 99999-9999"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="assunto">Assunto *</Label>
            <Input
              id="assunto"
              value={formData.assunto}
              onChange={(e) => setFormData({ ...formData, assunto: e.target.value })}
              placeholder="Ex: Divórcio consensual"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="plataforma">Plataforma de Origem *</Label>
            <Select value={formData.plataforma} onValueChange={(value) => setFormData({ ...formData, plataforma: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a plataforma" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="whatsapp">WhatsApp</SelectItem>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="site">Site</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição do Problema *</Label>
            <Textarea
              id="descricao"
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              placeholder="Descreva o que o cliente quer resolver..."
              required
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações Adicionais</Label>
            <Textarea
              id="observacoes"
              value={formData.observacoes}
              onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
              placeholder="Informações extras, urgência, etc..."
              rows={2}
            />
          </div>

          <div className="flex space-x-2 pt-4">
            <Button type="button" variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 bg-gradient-primary">
              Adicionar Lead
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}