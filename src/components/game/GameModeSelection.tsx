
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { Difficulty, GameMode } from '@/types/chess';
import { User, Users, Cpu, Bot, Loader2 } from 'lucide-react';


export default function GameModeSelection() {
  const router = useRouter();
  const [gameMode, setGameMode] = useState<GameMode | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [isStartingGame, setIsStartingGame] = useState(false);

  const startGame = () => {
    if (!gameMode) {
      alert("Por favor, selecione um modo de jogo.");
      return;
    }
    setIsStartingGame(true);
    if (gameMode === 'pve') {
      router.push(`/play?mode=${gameMode}&difficulty=${difficulty}`);
    } else {
      router.push(`/play?mode=${gameMode}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Escolha Seu Desafio</h2>
        <p className="text-sm text-muted-foreground">Selecione como você quer jogar.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button
          variant={gameMode === 'pvp' ? 'default' : 'outline'}
          className="h-auto py-3 px-4 text-base font-semibold"
          onClick={() => setGameMode('pvp')}
          disabled={isStartingGame}
        >
          <Users className="mr-2 h-5 w-5" /> Jogador vs Jogador
        </Button>
        <Button
          variant={gameMode === 'pve' ? 'default' : 'outline'}
          className="h-auto py-3 px-4 text-base font-semibold"
          onClick={() => setGameMode('pve')}
          disabled={isStartingGame}
        >
          <Cpu className="mr-2 h-5 w-5" /> Jogador vs IA
        </Button>
      </div>

      {gameMode === 'pve' && (
        <Card className="bg-secondary/50 shadow-inner">
          <CardHeader>
            <CardTitle className="flex items-center text-primary">
              <Bot className="mr-2 h-5 w-5" /> Dificuldade da IA
            </CardTitle>
            <CardDescription>Selecione o nível de habilidade do seu oponente IA.</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={difficulty}
              onValueChange={(value: string) => setDifficulty(value as Difficulty)}
              className="space-y-2"
              disabled={isStartingGame}
            >
              {(['easy', 'medium', 'hard'] as Difficulty[]).map((level) => (
                <div key={level} className="flex items-center space-x-2 p-2 rounded-md hover:bg-accent/50 transition-colors">
                  <RadioGroupItem value={level} id={`difficulty-${level}`} className="text-primary border-primary focus:ring-primary"/>
                  <Label htmlFor={`difficulty-${level}`} className="text-base capitalize cursor-pointer">
                    {level === 'easy' ? 'Fácil' : level === 'medium' ? 'Médio' : 'Difícil'}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>
      )}

      <Button
        onClick={startGame}
        disabled={!gameMode || isStartingGame}
        className="w-full text-lg py-3 bg-primary hover:bg-primary/90 text-primary-foreground shadow-md transition-transform hover:scale-105"
      >
        {isStartingGame ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Iniciando...
          </>
        ) : (
          "Iniciar Jogo"
        )}
      </Button>
    </div>
  );
}

