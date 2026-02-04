"use client";

import { useState } from "react";
import { Video, Copy, ExternalLink, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface MeetLinkDisplayProps {
  link: string | null | undefined;
}

export default function MeetLinkDisplay({ link }: MeetLinkDisplayProps) {
  const [copied, setCopied] = useState(false);

  if (!link) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      toast.success("Link copiado!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Não foi possível copiar o link");
    }
  };

  return (
    <div className="flex items-center gap-2 rounded-lg border border-teal-200 bg-teal-50 p-3">
      <Video className="h-5 w-5 text-teal-600 shrink-0" />
      <span className="text-sm text-teal-700 truncate flex-1">{link}</span>
      <div className="flex gap-1 shrink-0">
        <Button variant="ghost" size="icon-xs" onClick={handleCopy}>
          {copied ? (
            <Check className="h-3.5 w-3.5 text-green-600" />
          ) : (
            <Copy className="h-3.5 w-3.5 text-teal-600" />
          )}
        </Button>
        <Button variant="ghost" size="icon-xs" asChild>
          <a href={link} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-3.5 w-3.5 text-teal-600" />
          </a>
        </Button>
      </div>
    </div>
  );
}
