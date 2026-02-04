"use client";

import { useState } from "react";
import { Video, Copy, Check, ExternalLink, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface MeetLinkEditorProps {
  meetLink: string;
  onSave: (link: string) => void;
  disabled?: boolean;
}

export default function MeetLinkEditor({
  meetLink,
  onSave,
  disabled = false,
}: MeetLinkEditorProps) {
  const [link, setLink] = useState(meetLink);
  const [copied, setCopied] = useState(false);
  const [generating, setGenerating] = useState(false);

  const handleCopy = async () => {
    if (!link) return;
    await navigator.clipboard.writeText(link);
    setCopied(true);
    toast.success("Link copiado!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const res = await fetch("/api/google-meet/create-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (res.ok && data.meetLink) {
        setLink(data.meetLink);
        onSave(data.meetLink);
        toast.success("Link do Google Meet gerado!");
      } else {
        toast.error("Erro ao gerar link do Meet");
      }
    } catch {
      toast.error("Erro ao gerar link do Meet");
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = () => {
    if (link.trim()) {
      onSave(link.trim());
      toast.success("Link salvo!");
    }
  };

  return (
    <div className="space-y-3">
      <Label className="flex items-center gap-2">
        <Video className="h-4 w-4 text-teal-600" />
        Link do Google Meet
      </Label>

      <div className="flex gap-2">
        <Input
          value={link}
          onChange={(e) => setLink(e.target.value)}
          placeholder="https://meet.google.com/xxx-xxxx-xxx"
          disabled={disabled}
          className="flex-1"
        />
        {link && (
          <Button
            variant="outline"
            size="icon"
            onClick={handleCopy}
            disabled={disabled}
            title="Copiar link"
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-600" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        )}
        {link && (
          <Button
            variant="outline"
            size="icon"
            onClick={() => window.open(link, "_blank")}
            disabled={disabled}
            title="Abrir Meet"
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleGenerate}
          disabled={disabled || generating}
        >
          {generating ? (
            <Loader2 className="h-4 w-4 animate-spin mr-1" />
          ) : (
            <Video className="h-4 w-4 mr-1" />
          )}
          Gerar Link
        </Button>
        {link !== meetLink && (
          <Button
            size="sm"
            onClick={handleSave}
            disabled={disabled}
            className="bg-copper-600 hover:bg-copper-700"
          >
            Salvar Link
          </Button>
        )}
      </div>
    </div>
  );
}
