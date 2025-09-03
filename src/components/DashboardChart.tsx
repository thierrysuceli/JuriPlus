import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

const dadosSemanais = [
  { dia: 'Seg', leads: 4, consultorias: 1 },
  { dia: 'Ter', leads: 6, consultorias: 2 },
  { dia: 'Qua', leads: 3, consultorias: 1 },
  { dia: 'Qui', leads: 5, consultorias: 2 },
  { dia: 'Sex', leads: 4, consultorias: 1 },
  { dia: 'Sáb', leads: 2, consultorias: 1 },
  { dia: 'Dom', leads: 0, consultorias: 0 },
]

const dadosMensais = [
  { semana: 'Sem 1', leads: 18, consultorias: 7 },
  { semana: 'Sem 2', leads: 24, consultorias: 9 },
  { semana: 'Sem 3', leads: 21, consultorias: 8 },
  { semana: 'Sem 4', leads: 27, consultorias: 11 },
]

interface DashboardChartProps {
  periodo: 'semana' | 'mes'
}

export default function DashboardChart({ periodo }: DashboardChartProps) {
  const dados = periodo === 'semana' ? dadosSemanais : dadosMensais
  const xAxisKey = periodo === 'semana' ? 'dia' : 'semana'

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={dados} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis 
            dataKey={xAxisKey} 
            className="text-xs"
            stroke="hsl(var(--muted-foreground))"
          />
          <YAxis 
            className="text-xs"
            stroke="hsl(var(--muted-foreground))"
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '6px',
              color: 'hsl(var(--card-foreground))'
            }}
          />
          <Bar 
            dataKey="leads" 
            fill="hsl(var(--info))" 
            name="Leads"
            radius={[2, 2, 0, 0]}
          />
          <Bar 
            dataKey="consultorias" 
            fill="hsl(var(--success))" 
            name="Consultorias"
            radius={[2, 2, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}