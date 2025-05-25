
"use client";

import type { Move } from '@/types/chess';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ListOrdered } from 'lucide-react';

interface MoveHistoryProps {
  moves: Move[];
}

export default function MoveHistory({ moves }: MoveHistoryProps) {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center text-primary">
          <ListOrdered className="mr-2 h-5 w-5" /> Histórico de Movimentos
        </CardTitle>
      </CardHeader>
      <CardContent>
        {moves.length === 0 ? (
          <p className="text-muted-foreground italic">Nenhum movimento ainda.</p>
        ) : (
          <ScrollArea className="h-60 w-full pr-4">
            <ol className="space-y-1 text-sm">
              {moves.map((move, index) => (
                <li
                  key={index}
                  className={`p-2 rounded-md ${
                    index % 2 === 0 ? 'bg-muted/30' : 'bg-secondary/30'
                  }`}
                >
                  <span className="font-semibold mr-2">{index + 1}.</span>
                  <span className="text-foreground">{move.notation}</span>
                  <span className="text-xs text-muted-foreground ml-1">({move.piece.color === 'white' ? 'Brancas' : 'Pretas'})</span>
                </li>
              ))}
            </ol>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
