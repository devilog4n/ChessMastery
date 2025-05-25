
import { LoaderCircle } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground">
      <LoaderCircle className="h-16 w-16 animate-spin text-primary mb-4" />
      <p className="text-xl font-semibold">Carregando Maestria do Xadrez...</p>
      <p className="text-muted-foreground">Por favor, aguarde enquanto preparamos o tabuleiro.</p>
    </div>
  );
}
