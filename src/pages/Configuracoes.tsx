import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { 
  Settings, 
  Bell, 
  Globe, 
  Clock,
  Smartphone,
  Mail,
  Shield,
  Zap,
  Database,
  Save
} from "lucide-react"

export default function Configuracoes() {
  const [configuracoes, setConfiguracoes] = useState({
    idioma: "pt-BR",
    fusoHorario: "America/Sao_Paulo",
    notificacoesEmail: true,
    notificacoesPush: true,
    notificacoesWhatsApp: false,
    integracaoChatwoot: false,
    integracaoWhatsApp: false,
    integracaoCalendario: true,
    backupAutomatico: true,
    retencaoDados: "12"
  })

  const handleSave = () => {
    // Salvar configurações
    console.log("Configurações salvas:", configuracoes)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Configurações</h1>
        <p className="text-muted-foreground mt-1">
          Personalize o sistema de acordo com suas preferências
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configurações Gerais */}
        <Card className="bg-gradient-card shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5 text-primary" />
              <span>Configurações Gerais</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="idioma" className="flex items-center space-x-2">
                <Globe className="h-4 w-4" />
                <span>Idioma</span>
              </Label>
              <Select
                value={configuracoes.idioma}
                onValueChange={(value) => setConfiguracoes(prev => ({ ...prev, idioma: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                  <SelectItem value="en-US">English (US)</SelectItem>
                  <SelectItem value="es-ES">Español</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fuso" className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>Fuso Horário</span>
              </Label>
              <Select
                value={configuracoes.fusoHorario}
                onValueChange={(value) => setConfiguracoes(prev => ({ ...prev, fusoHorario: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="America/Sao_Paulo">São Paulo (GMT-3)</SelectItem>
                  <SelectItem value="America/New_York">New York (GMT-5)</SelectItem>
                  <SelectItem value="Europe/London">London (GMT+0)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="space-y-4">
              <h4 className="font-medium text-foreground flex items-center space-x-2">
                <Bell className="h-4 w-4" />
                <span>Notificações</span>
              </h4>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="email-notif">Notificações por E-mail</Label>
                  </div>
                  <Switch
                    id="email-notif"
                    checked={configuracoes.notificacoesEmail}
                    onCheckedChange={(checked) => 
                      setConfiguracoes(prev => ({ ...prev, notificacoesEmail: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Smartphone className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="push-notif">Notificações Push</Label>
                  </div>
                  <Switch
                    id="push-notif"
                    checked={configuracoes.notificacoesPush}
                    onCheckedChange={(checked) => 
                      setConfiguracoes(prev => ({ ...prev, notificacoesPush: checked }))
                    }
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Integrações */}
        <Card className="bg-gradient-card shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-primary" />
              <span>Integrações</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="font-medium">Chatwoot</Label>
                  <p className="text-xs text-muted-foreground">
                    Integração com sistema de chat
                  </p>
                </div>
                <Switch
                  checked={configuracoes.integracaoChatwoot}
                  onCheckedChange={(checked) => 
                    setConfiguracoes(prev => ({ ...prev, integracaoChatwoot: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="font-medium">WhatsApp Business</Label>
                  <p className="text-xs text-muted-foreground">
                    Conectar conta do WhatsApp
                  </p>
                </div>
                <Switch
                  checked={configuracoes.integracaoWhatsApp}
                  onCheckedChange={(checked) => 
                    setConfiguracoes(prev => ({ ...prev, integracaoWhatsApp: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="font-medium">Google Calendar</Label>
                  <p className="text-xs text-muted-foreground">
                    Sincronizar agenda
                  </p>
                </div>
                <Switch
                  checked={configuracoes.integracaoCalendario}
                  onCheckedChange={(checked) => 
                    setConfiguracoes(prev => ({ ...prev, integracaoCalendario: checked }))
                  }
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h4 className="font-medium text-foreground flex items-center space-x-2">
                <Shield className="h-4 w-4" />
                <span>Segurança & Backup</span>
              </h4>
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="font-medium">Backup Automático</Label>
                  <p className="text-xs text-muted-foreground">
                    Backup diário dos dados
                  </p>
                </div>
                <Switch
                  checked={configuracoes.backupAutomatico}
                  onCheckedChange={(checked) => 
                    setConfiguracoes(prev => ({ ...prev, backupAutomatico: checked }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center space-x-2">
                  <Database className="h-4 w-4" />
                  <span>Retenção de Dados (meses)</span>
                </Label>
                <Select
                  value={configuracoes.retencaoDados}
                  onValueChange={(value) => 
                    setConfiguracoes(prev => ({ ...prev, retencaoDados: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="6">6 meses</SelectItem>
                    <SelectItem value="12">12 meses</SelectItem>
                    <SelectItem value="24">24 meses</SelectItem>
                    <SelectItem value="60">5 anos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ações */}
      <div className="flex justify-end space-x-3">
        <Button variant="outline">
          Restaurar Padrões
        </Button>
        <Button onClick={handleSave} className="bg-gradient-primary">
          <Save className="h-4 w-4 mr-2" />
          Salvar Configurações
        </Button>
      </div>
    </div>
  )
}