import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

type Advogado = {
  id: number;
  name: string;
  email: string;
  oab?: string;
  telefone?: string;
  endereco?: string;
  especialidades?: string;
  escritorio_id?: number | null;
};

export default function Advogados() {
  const [advogados, setAdvogados] = useState<Advogado[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', oab: '', telefone: '', endereco: '', especialidades: '' });
  const [saving, setSaving] = useState(false);

  async function fetchAdvogados() {
    try {
      setLoading(true);
      const res = await api.get('/advogados');
      setAdvogados(res.advogados || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function createAdvogado() {
    try {
      setSaving(true);
      const payload = { ...form };
      await api.post('/advogados', payload);
      setOpen(false);
      setForm({ name: '', email: '', oab: '', telefone: '', endereco: '', especialidades: '' });
      fetchAdvogados();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    fetchAdvogados();
  }, []);

  return (
    <div className="p-4 md:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Advogados</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Novo Advogado</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo Advogado</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Nome</Label>
                <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label>Email</Label>
                <Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label>OAB</Label>
                <Input value={form.oab} onChange={e => setForm({ ...form, oab: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label>Telefone</Label>
                <Input value={form.telefone} onChange={e => setForm({ ...form, telefone: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label>Endereço</Label>
                <Input value={form.endereco} onChange={e => setForm({ ...form, endereco: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label>Especialidades</Label>
                <Input value={form.especialidades} onChange={e => setForm({ ...form, especialidades: e.target.value })} />
              </div>
            </div>
            <DialogFooter>
              <Button disabled={saving} onClick={createAdvogado}>{saving ? 'Salvando...' : 'Salvar'}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Advogados</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div>Carregando...</div>
          ) : advogados.length === 0 ? (
            <div>Nenhum advogado cadastrado.</div>
          ) : (
            <div className="grid gap-3">
              {advogados.map((a) => (
                <div key={a.id} className="flex items-center justify-between border rounded-md p-3">
                  <div>
                    <div className="font-medium">{a.name}</div>
                    <div className="text-sm text-muted-foreground">{a.email} • OAB {a.oab}</div>
                    {a.especialidades && (
                      <div className="text-sm text-muted-foreground">Especialidades: {a.especialidades}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
