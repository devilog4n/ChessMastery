
"use client";

import { Button } from '@/components/ui/button';
import { Save, FolderOpen, RotateCcw, Power } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useRouter } from 'next/navigation';

interface GameControlsProps {
  onSave: () => void;
  onLoad: () => void;
  onReset: () => void;
}

export default function GameControls({ onSave, onLoad, onReset }: GameControlsProps) {
  const router = useRouter();

  const handleNewGame = () => {
    router.push('/');
  };

  return (
    <div className="flex flex-wrap gap-2 justify-center p-4 bg-card shadow-md rounded-lg">
      <Button onClick={onSave} variant="outline" className="flex-grow sm:flex-grow-0">
        <Save className="mr-2 h-4 w-4" /> Salvar Jogo
      </Button>
      <Button onClick={onLoad} variant="outline" className="flex-grow sm:flex-grow-0">
        <FolderOpen className="mr-2 h-4 w-4" /> Carregar Jogo
      </Button>
      
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline" className="flex-grow sm:flex-grow-0">
            <RotateCcw className="mr-2 h-4 w-4" /> Reiniciar Jogo Atual
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Isso irá reiniciar o progresso do jogo atual. Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={onReset} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Reiniciar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" className="flex-grow sm:flex-grow-0">
            <Power className="mr-2 h-4 w-4" /> Novo Jogo / Sair
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Iniciar um Novo Jogo ou Sair?</AlertDialogTitle>
            <AlertDialogDescription>
              Isso o levará ao menu principal. O progresso do seu jogo atual será perdido se não for salvo.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleNewGame} className="bg-primary text-primary-foreground hover:bg-primary/90">
              Ir para o Menu Principal
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}
