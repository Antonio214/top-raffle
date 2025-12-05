import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Participant } from "@/types/participant";
import { toast } from "sonner";
import { Plus, Save, X } from "lucide-react";

interface ParticipantFormProps {
  onAdd: (name: string, entries: number) => boolean;
  onUpdate: (id: string, name: string, entries: number) => boolean;
  editingParticipant: Participant | null;
  onCancelEdit: () => void;
}

export function ParticipantForm({
  onAdd,
  onUpdate,
  editingParticipant,
  onCancelEdit,
}: ParticipantFormProps) {
  const [name, setName] = useState(editingParticipant?.name ?? "");
  const [entries, setEntries] = useState(
    editingParticipant?.entries.toString() ?? ""
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = name.trim();
    const entriesNum = parseInt(entries, 10);

    if (!trimmedName) {
      toast.error("Nome é obrigatório");
      return;
    }

    if (isNaN(entriesNum) || entriesNum < 1) {
      toast.error("Número de entradas deve ser pelo menos 1");
      return;
    }

    if (editingParticipant) {
      const success = onUpdate(editingParticipant.id, trimmedName, entriesNum);
      if (success) {
        toast.success("Participante atualizado!");
        onCancelEdit();
      } else {
        toast.error("Já existe um participante com esse nome");
      }
    } else {
      const success = onAdd(trimmedName, entriesNum);
      if (success) {
        toast.success("Participante adicionado!");
        setName("");
        setEntries("");
      } else {
        toast.error("Já existe um participante com esse nome");
      }
    }
  };

  // Sync form when editing participant changes
  useEffect(() => {
    if (editingParticipant) {
      setName(editingParticipant.name);
      setEntries(editingParticipant.entries.toString());
    } else {
      setName("");
      setEntries("");
    }
  }, [editingParticipant]);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-sm font-bold uppercase">
          Nome do Participante
        </Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex: Guilherme"
          className="border-2 border-foreground shadow-xs"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="entries" className="text-sm font-bold uppercase">
          Número de Entradas
        </Label>
        <Input
          id="entries"
          type="number"
          min="1"
          value={entries}
          onChange={(e) => setEntries(e.target.value)}
          placeholder="Ex: 10"
          className="border-2 border-foreground shadow-xs"
        />
      </div>

      <div className="flex gap-2">
        <Button
          type="submit"
          className="flex-1 border-2 border-foreground shadow-sm hover:shadow-xs hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
        >
          {editingParticipant ? (
            <>
              <Save className="w-4 h-4 mr-2" /> Salvar
            </>
          ) : (
            <>
              <Plus className="w-4 h-4 mr-2" /> Adicionar
            </>
          )}
        </Button>
        {editingParticipant && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancelEdit}
            className="border-2 border-foreground shadow-sm hover:shadow-xs hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
    </form>
  );
}
