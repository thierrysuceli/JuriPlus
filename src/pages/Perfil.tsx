import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { 
  User, 
  Mail, 
  Phone, 
  MapPin,
  Camera,
  Lock,
  CreditCard,
  AlertTriangle,
  Save,
  Shield,
  Crown
} from "lucide-react"

export default function Perfil() {
  const [perfil, setPerfil] = useState({
    nome: "Dr. João Silva",
    email: "joao.silva@email.com",
    telefone: "(11) 99999-0000",
    oab: "SP 123456",
    endereco: "São Paulo, SP",
    plano: "Pro",
    statusPlano: "Ativo"
  })

  const [senhas, setSenhas] = useState({
    senhaAtual: "",
    novaSenha: "",
    confirmarSenha: ""
  })

  const handleSavePerfil = () => {
    console.log("Perfil salvo:", perfil)
  }

  const handleChangePassword = () => {
    console.log("Senha alterada")
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Perfil</h1>
        <p className="text-muted-foreground mt-1">
          Gerencie suas informações pessoais e configurações da conta
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informações Pessoais */}
        <Card className="lg:col-span-2 bg-gradient-card shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5 text-primary" />
              <span>Informações Pessoais</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Foto de Perfil */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center">
                  <User className="h-10 w-10 text-primary-foreground" />
                </div>
                <Button 
                  size="sm" 
                  className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <div>
                <p className="font-medium text-foreground">Foto de Perfil</p>
                <p className="text-sm text-muted-foreground">
                  Clique para alterar sua foto
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome Completo</Label>
                <Input
                  id="nome"
                  value={perfil.nome}
                  onChange={(e) => setPerfil(prev => ({ ...prev, nome: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="oab">Número da OAB</Label>
                <Input
                  id="oab"
                  value={perfil.oab}
                  onChange={(e) => setPerfil(prev => ({ ...prev, oab: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={perfil.email}
                  onChange={(e) => setPerfil(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  value={perfil.telefone}
                  onChange={(e) => setPerfil(prev => ({ ...prev, telefone: e.target.value }))}
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="endereco">Endereço</Label>
                <Input
                  id="endereco"
                  value={perfil.endereco}
                  onChange={(e) => setPerfil(prev => ({ ...prev, endereco: e.target.value }))}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={handleSavePerfil} className="bg-gradient-primary">
                <Save className="h-4 w-4 mr-2" />
                Salvar Alterações
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Plano e Segurança */}
        <div className="space-y-6">
          {/* Plano Atual */}
          <Card className="bg-gradient-card shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Crown className="h-5 w-5 text-primary" />
                <span>Plano Atual</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <h3 className="text-2xl font-bold text-primary">Plano {perfil.plano}</h3>
                  <Badge variant="default" className="bg-success">
                    {perfil.statusPlano}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Renovação em 15 de Fevereiro
                </p>
              </div>

              <Separator />

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Leads por mês</span>
                  <span className="font-medium">Ilimitado</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Integrações</span>
                  <span className="font-medium">Todas</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Usuários</span>
                  <span className="font-medium">5</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Suporte</span>
                  <span className="font-medium">Prioritário</span>
                </div>
              </div>

              <Button variant="outline" className="w-full">
                <CreditCard className="h-4 w-4 mr-2" />
                Gerenciar Plano
              </Button>
            </CardContent>
          </Card>

          {/* Segurança */}
          <Card className="bg-gradient-card shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-primary" />
                <span>Segurança</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="senhaAtual">Senha Atual</Label>
                  <Input
                    id="senhaAtual"
                    type="password"
                    value={senhas.senhaAtual}
                    onChange={(e) => setSenhas(prev => ({ ...prev, senhaAtual: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="novaSenha">Nova Senha</Label>
                  <Input
                    id="novaSenha"
                    type="password"
                    value={senhas.novaSenha}
                    onChange={(e) => setSenhas(prev => ({ ...prev, novaSenha: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmarSenha">Confirmar Nova Senha</Label>
                  <Input
                    id="confirmarSenha"
                    type="password"
                    value={senhas.confirmarSenha}
                    onChange={(e) => setSenhas(prev => ({ ...prev, confirmarSenha: e.target.value }))}
                  />
                </div>
              </div>

              <Button onClick={handleChangePassword} variant="outline" className="w-full">
                <Lock className="h-4 w-4 mr-2" />
                Alterar Senha
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Zona de Perigo */}
      <Card className="border-destructive bg-gradient-card shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            <span>Zona de Perigo</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-foreground mb-1">Desativar Conta</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Sua conta será temporariamente desativada
              </p>
              <Button variant="outline" size="sm" className="border-destructive text-destructive">
                Desativar Conta
              </Button>
            </div>

            <div>
              <h4 className="font-medium text-foreground mb-1">Excluir Conta</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Todos os dados serão permanentemente excluídos
              </p>
              <Button variant="destructive" size="sm">
                Excluir Conta
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}