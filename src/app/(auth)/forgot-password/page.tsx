"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const forgotPasswordSchema = z.object({
  email: z.string().email("Email inválido"),
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (_data: ForgotPasswordForm) => {
    // TODO: Implement actual email sending
    // Simulate a brief delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSent(true);
  };

  if (sent) {
    return (
      <Card className="shadow-lg border-copper-100">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center gap-4 text-center py-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-teal-800">
                Email enviado!
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Se o email estiver cadastrado, você receberá um link para
                redefinir sua senha.
              </p>
            </div>
            <Link href="/login">
              <Button
                variant="outline"
                className="mt-2 border-copper-200 text-copper-600 hover:bg-copper-50"
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar ao login
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg border-copper-100">
      <CardHeader className="text-center">
        <CardTitle className="text-xl text-teal-800">
          Recuperar senha 🔑
        </CardTitle>
        <CardDescription>
          Insira seu email para receber o link de recuperação
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              autoComplete="email"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-copper-600 hover:bg-copper-700"
            size="lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Mail className="h-4 w-4" />
            )}
            {isSubmitting ? "Enviando..." : "Enviar link de recuperação"}
          </Button>

          <div className="text-center">
            <Link
              href="/login"
              className="text-sm text-copper-600 hover:text-copper-700 hover:underline inline-flex items-center gap-1"
            >
              <ArrowLeft className="h-3 w-3" />
              Voltar ao login
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
