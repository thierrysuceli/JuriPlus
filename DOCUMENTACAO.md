# 📚 Documentação do JuriPlus

## 🏢 Sobre o Sistema

O **JuriPlus** é um sistema de gestão de atendimento jurídico (SaaS) desenvolvido para escritórios de advocacia e profissionais do direito. O sistema oferece uma solução completa para gerenciar leads, consultorias e agendamentos de forma eficiente e profissional.

## ✅ Status de Funcionalidades

### 🔴 Funcionalidades Implementadas e Operacionais

- **✅ CRM Completo**: Sistema Kanban funcional com adição, visualização e movimentação de leads
- **✅ Dashboard Interativo**: Gráficos dinâmicos com filtros de período (semana/mês)
- **✅ Adicionar Leads**: Formulário completo e funcional para cadastro de novos leads
- **✅ Visualização de Leads**: Exibição detalhada com descrição do problema do cliente
- **✅ Movimentação no Funil**: Arraste e solte ou botões para mover leads entre estágios
- **✅ Design Responsivo**: Interface adaptada para desktop, tablet e mobile
- **✅ Esquema de Cores**: Azul escuro (#1E40AF) e roxo (#5B21B6) implementados
- **✅ Navegação**: Sidebar responsiva com menu hamburger no mobile

## 🎯 Objetivo

Centralizar e otimizar o fluxo de trabalho de escritórios jurídicos, desde a captação de leads até a realização de consultorias, proporcionando uma visão completa do negócio através de dashboards e relatórios.

## 🚀 Funcionalidades Principais

### 1. Dashboard (Home) ✅ FUNCIONAL
- **✅ Estatísticas em tempo real**: Visualização de métricas importantes do escritório
- **✅ Cards informativos**: 
  - Leads iniciados (semana/mês atual)
  - Consultorias agendadas
  - Taxa de conversão (calculada automaticamente)
  - Próximas consultorias
- **✅ Filtros de período**: Alternância dinâmica entre semana e mês
- **✅ Gráficos interativos**: Performance de leads com dados comparativos usando Recharts
- **✅ Lista de agendamentos**: Próximos compromissos com detalhes
- **✅ Indicadores de crescimento**: Badges com variação percentual vs período anterior

### 2. CRM (Customer Relationship Management) ✅ FUNCIONAL
- **✅ Board estilo Kanban** com 4 colunas:
  - 🆕 **Novos Leads**: Leads recém-captados (funcionando)
  - 💬 **Em Contato**: Leads sendo qualificados (funcionando)
  - 📅 **Consultoria Marcada**: Leads com agendamento confirmado (funcionando)
  - ✅ **Concluído**: Atendimentos finalizados (funcionando)

- **✅ Gestão de Leads COMPLETA**:
  - ✅ Adicionar novos leads (formulário completo e validado)
  - ✅ Visualizar detalhes completos do lead
  - ✅ Mover leads entre estágios (botões funcionais)
  - ✅ Modal de detalhes com todas as informações
  - ✅ Contadores de leads por coluna
  - ✅ Ícones por plataforma de origem

- **✅ Informações capturadas e exibidas**:
  - ✅ Nome completo (obrigatório)
  - ✅ Telefone de contato (obrigatório)  
  - ✅ Assunto jurídico (obrigatório)
  - ✅ Plataforma de origem (WhatsApp, Instagram, Site) (obrigatório)
  - ✅ **Descrição detalhada do problema** (obrigatório e exibida nos cards)
  - ✅ Observações adicionais (opcional)
  - ✅ Data e hora de entrada (automática)

- **✅ Interface Responsiva**:
  - Desktop: Grid de 4 colunas
  - Mobile: Scroll horizontal com cards otimizados

### 3. Atendimentos
- **Status**: Em desenvolvimento
- **Funcionalidade planejada**: Integração com Chatwoot para atendimento via chat
- **Interface placeholder** informando sobre o desenvolvimento futuro

### 4. Agenda
- **Calendário completo**: Visualização mensal e semanal
- **Eventos detalhados** mostrando:
  - Nome do cliente
  - Assunto da consultoria
  - Horário do atendimento
  - Plataforma de atendimento (presencial, online, etc.)
- **Sistema de filtros**:
  - Por data
  - Por cliente
  - Por status (realizada, pendente, cancelada)

### 5. Configurações
- **Configurações gerais do sistema**:
  - Idioma da interface
  - Fuso horário
  - Tipos de notificação
  - Integrações (placeholder para futuras integrações)

### 6. Perfil
- **Gerenciamento da conta**:
  - Informações pessoais (nome, e-mail, telefone)
  - Foto do perfil
  - Alteração de senha
  - Opções de conta (desativar, trocar plano)

## 🎨 Design e Interface

### Paleta de Cores
- **Primária**: Azul escuro (#1E40AF - hsl(240 100% 25%))
- **Secundária**: Roxo (#5B21B6 - hsl(280 85% 20%))
- **Background**: Tons neutros claros para contraste
- **Gradientes**: Combinações harmoniosas de azul e roxo

### Características Visuais
- **Design moderno e profissional**: Interface limpa e sofisticada
- **Totalmente responsivo**: Adaptado para desktop, tablet e mobile
- **Navegação intuitiva**: Sidebar com ícones e labels claros
- **Feedback visual**: Animações suaves e indicadores de estado
- **Acessibilidade**: Cores com bom contraste e componentes acessíveis

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 18**: Biblioteca principal para interface
- **TypeScript**: Tipagem estática para maior segurança
- **Tailwind CSS**: Framework de styling com sistema de design personalizado
- **Shadcn/ui**: Componentes de UI modernos e acessíveis
- **Lucide React**: Ícones consistentes e profissionais
- **React Router**: Navegação entre páginas
- **Recharts**: Gráficos e visualizações de dados

### Ferramentas de Desenvolvimento
- **Vite**: Build tool otimizada para desenvolvimento
- **ESLint**: Linting e padronização de código
- **Date-fns**: Manipulação de datas
- **React Hook Form**: Gerenciamento de formulários
- **Sonner**: Sistema de notificações toast

## 📱 Responsividade ✅ IMPLEMENTADA

O sistema foi desenvolvido com abordagem **mobile-first** e está **TOTALMENTE RESPONSIVO**:

### Breakpoints Implementados
- **Mobile**: < 768px - Interface otimizada para mobile
- **Tablet**: 768px - 1024px - Layout adaptativo 
- **Desktop**: > 1024px - Grid completo

### ✅ Adaptações Móveis Funcionando
- ✅ **Sidebar responsiva** com colapso automático no mobile
- ✅ **Dashboard**: Cards empilhados em coluna única no mobile
- ✅ **CRM Kanban**: Scroll horizontal no mobile com cards otimizados
- ✅ **Formulários**: Botões full-width e inputs adaptados para touch
- ✅ **Headers**: Layout flexível que empilha no mobile
- ✅ **Gráficos**: Responsivos usando ResponsiveContainer do Recharts
- ✅ **Modais**: Largura adaptativa para diferentes telas

## 🔄 Fluxo de Trabalho ✅ FUNCIONAL

### 1. ✅ Captação de Leads (IMPLEMENTADO)
1. ✅ Lead faz contato através de WhatsApp, Instagram ou site
2. ✅ **BOTÃO FUNCIONAL**: Informações são registradas no sistema via "Novo Lead"
3. ✅ Lead aparece automaticamente na coluna "Novos Leads" do CRM
4. ✅ **Descrição do problema** é exibida no card do lead

### 2. ✅ Qualificação (IMPLEMENTADO)
1. ✅ Lead é movido para "Em Contato" via botões funcionais no modal
2. ✅ Equipe jurídica pode visualizar todas as informações do lead
3. ✅ Modal de detalhes mostra descrição completa do que o cliente quer

### 3. ✅ Agendamento (INTERFACE PRONTA)
1. ✅ Lead qualificado é movido para "Consultoria Marcada" 
2. ✅ Interface para "Agendar Consultoria" disponível
3. 🔄 Integração com agenda em desenvolvimento

### 4. ✅ Atendimento (IMPLEMENTADO)
1. ✅ Lead é movido para "Concluído" quando atendimento finaliza
2. ✅ **Métricas são atualizadas automaticamente** no Dashboard
3. ✅ Sistema calcula taxa de conversão em tempo real

## 📊 Métricas e Relatórios ✅ FUNCIONAIS

### ✅ Dashboard Analytics (IMPLEMENTADO)
- ✅ **Leads por período**: Comparativo semanal/mensal com filtro funcional
- ✅ **Taxa de conversão**: Cálculo automático de leads → consultorias  
- ✅ **Performance temporal**: Gráficos interativos com Recharts
- ✅ **Próximos compromissos**: Lista de agendamentos com mock data
- ✅ **Indicadores de crescimento**: Badges com variação percentual

### ✅ KPIs Principais Implementados
- ✅ **Número de leads captados**: Contador em tempo real
- ✅ **Taxa de conversão lead → consultoria**: Cálculo automático (33.3% semana, 26.9% mês)
- ✅ **Consultorias agendadas**: Métricas atualizadas dinamicamente
- 🔄 Tempo médio no funil: Planejado para próxima versão

## 🔧 Configuração e Personalização

### Sistema de Cores
- Variáveis CSS customizáveis em `src/index.css`
- Suporte a modo escuro/claro
- Gradientes personalizados

### Componentes Reutilizáveis
- Sistema de design consistente
- Componentes Shadcn customizados
- Tokens de design centralizados

## 🚀 Próximos Passos

### Funcionalidades Planejadas
1. **Integração Chatwoot**: Sistema de chat em tempo real
2. **Relatórios avançados**: Exportação em PDF, dashboards customizáveis
3. **Integração WhatsApp**: API oficial para automatização
4. **Sistema de cobrança**: Gestão financeira integrada
5. **Multi-tenancy**: Suporte a múltiplos escritórios
6. **Mobile App**: Aplicativo nativo com Capacitor

### Melhorias Técnicas
- Autenticação e autorização
- Backend com Supabase
- Cache inteligente
- Otimizações de performance
- Testes automatizados

## 📞 Suporte

Para dúvidas ou suporte técnico sobre o JuriPlus, entre em contato com a equipe de desenvolvimento.

---

*Esta documentação é atualizada conforme novas funcionalidades são implementadas.*