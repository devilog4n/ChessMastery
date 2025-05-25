
"use client";

import type { AiSuggestion } from '@/types/chess';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Lightbulb, Brain, Loader2 } from 'lucide-react';
import { useState } from 'react';

interface AiTutorPanelProps {
  isEnabled: boolean;
  onToggle: () => void;
  suggestions: AiSuggestion | null;
  onGetSuggestions: () => Promise<void>;
  isPlayerTurn: boolean; // To enable "Get Suggestion" button only on player's turn
}

export default function AiTutorPanel({ isEnabled, onToggle, suggestions, onGetSuggestions, isPlayerTurn }: AiTutorPanelProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleGetSuggestions = async () => {
    setIsLoading(true);
    await onGetSuggestions();
    setIsLoading(false);
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center text-primary">
            <Lightbulb className="mr-2 h-5 w-5" /> Tutor de Xadrez IA
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Switch
              id="ai-tutor-switch"
              checked={isEnabled}
              onCheckedChange={onToggle}
              aria-label="Alternar Tutor IA"
            />
            <Label htmlFor="ai-tutor-switch" className="text-sm text-muted-foreground">
              {isEnabled ? "Ligado" : "Desligado"}
            </Label>
          </div>
        </div>
        <CardDescription>Obtenha conselhos estratégicos do Tutor Grande Mestre.</CardDescription>
      </CardHeader>
      {isEnabled && (
        <CardContent>
          <Button
            onClick={handleGetSuggestions}
            disabled={isLoading || !isPlayerTurn}
            className="w-full mb-4 bg-accent text-accent-foreground hover:bg-accent/90"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Brain className="mr-2 h-4 w-4" />
            )}
            Obter Sugestão
          </Button>
          {suggestions && (
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="suggested-move">
                <AccordionTrigger className="text-base font-semibold text-foreground hover:text-primary">
                  Movimento Sugerido: {suggestions.suggestedMove}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">
                  <strong>Raciocínio:</strong> {suggestions.reasoning}
                </AccordionContent>
              </AccordionItem>
              {suggestions.alternativeMoves && suggestions.alternativeMoves.length > 0 && (
                <AccordionItem value="alternative-moves">
                  <AccordionTrigger className="text-base font-semibold text-foreground hover:text-primary">Movimentos Alternativos</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                      {suggestions.alternativeMoves.map((altMove, index) => (
                        <li key={index}>{altMove}</li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              )}
            </Accordion>
          )}
          {!suggestions && !isLoading && isPlayerTurn && (
             <p className="text-sm text-center text-muted-foreground mt-4">Clique em "Obter Sugestão" para insights da IA.</p>
          )}
           {!isPlayerTurn && !isLoading && (
             <p className="text-sm text-center text-muted-foreground mt-4">Aguarde sua vez para obter sugestões.</p>
           )}
        </CardContent>
      )}
      {!isEnabled && (
         <CardContent>
            <p className="text-sm text-center text-muted-foreground">Habilite o Tutor IA para receber orientação.</p>
        </CardContent>
      )}
    </Card>
  );
}
