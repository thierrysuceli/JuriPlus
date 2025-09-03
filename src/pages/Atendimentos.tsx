import { Button } from "@/components/ui/button"

export default function Atendimentos() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Atendimentos</h1>
        <p className="text-muted-foreground mt-1">
          Chat integrado com Chatwoot para atendimento direto
        </p>
      </div>

      {/* Ações */}
      <div className="flex justify-end">
        <a
          href="https://n8n-chatwoot.lenvwt.easypanel.host/app/accounts/1/dashboard"
          target="_blank"
          rel="noreferrer"
        >
          <Button variant="outline">Abrir em nova aba</Button>
        </a>
      </div>

      {/* Iframe do Chatwoot */}
      <div className="rounded-md border bg-background overflow-hidden min-h-[70vh]">
        <iframe
          title="Chatwoot Dashboard"
          src="https://n8n-chatwoot.lenvwt.easypanel.host/app/accounts/1/dashboard"
          className="w-full min-h-[70vh]"
          loading="lazy"
          allow="clipboard-read; clipboard-write; geolocation; microphone; camera; display-capture"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  )
}