
// 'use server';

/**
 * @fileOverview AI chess tutor that provides move suggestions and strategic advice.
 *
 * - chessMoveSuggestions - A function that provides chess move suggestions and strategic advice.
 * - ChessMoveSuggestionsInput - The input type for the chessMoveSuggestions function.
 * - ChessMoveSuggestionsOutput - The return type for the chessMoveSuggestions function.
 */

'use server';
import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ChessMoveSuggestionsInputSchema = z.object({
  currentBoardState: z.string().describe('Representação FEN do estado atual do tabuleiro de xadrez.'),
  difficultyLevel: z.enum(['easy', 'medium', 'hard']).describe('O nível de dificuldade das sugestões da IA.'),
  moveHistory: z.string().optional().describe('Uma string contendo o histórico de movimentos no jogo.'),
});
export type ChessMoveSuggestionsInput = z.infer<typeof ChessMoveSuggestionsInputSchema>;

const ChessMoveSuggestionsOutputSchema = z.object({
  suggestedMove: z.string().describe('O movimento sugerido na notação algébrica "de-para" (ex: "e2-e4").'),
  reasoning: z.string().describe('O raciocínio por trás do movimento sugerido.'),
  alternativeMoves: z.array(z.string().describe('Movimentos alternativos na notação algébrica "de-para" (ex: "g1-f3").')).optional().describe('Movimentos alternativos que o jogador poderia considerar.'),
});
export type ChessMoveSuggestionsOutput = z.infer<typeof ChessMoveSuggestionsOutputSchema>;

export async function chessMoveSuggestions(input: ChessMoveSuggestionsInput): Promise<ChessMoveSuggestionsOutput> {
  return chessMoveSuggestionsFlow(input);
}

const chessMoveSuggestionsPrompt = ai.definePrompt({
  name: 'chessMoveSuggestionsPrompt',
  input: {schema: ChessMoveSuggestionsInputSchema},
  output: {schema: ChessMoveSuggestionsOutputSchema},
  prompt: `Você é um Tutor Grande Mestre de Xadrez. Um jogador está atualmente na seguinte posição de xadrez:
  
Estado do Tabuleiro (FEN): {{{currentBoardState}}}

Histórico de Movimentos: {{#if moveHistory}}{{{moveHistory}}}{{else}}Nenhum movimento foi feito ainda.{{/if}}

Nível de Dificuldade: {{{difficultyLevel}}}

Sugira um movimento para o jogador e explique seu raciocínio. 
MUITO IMPORTANTE: O suggestedMove e quaisquer alternativeMoves DEVEM estar na notação algébrica "de-para" (por exemplo, "e2-e4", "g1-f3"). NÃO use notação algébrica padrão como "Cf3".

Se o difficultyLevel for "hard":
Priorize o melhor movimento possível com uma estratégia de longo prazo.
Se o difficultyLevel for "medium":
Sugira um bom movimento que seja relativamente seguro.
Se o difficultyLevel for "easy":
Sugira um movimento que seja simples de entender.

Forneça o movimento sugerido, seu raciocínio e, opcionalmente, alguns movimentos alternativos.
`,
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_LOW_AND_ABOVE',
      },
    ],
  },
});

const chessMoveSuggestionsFlow = ai.defineFlow(
  {
    name: 'chessMoveSuggestionsFlow',
    inputSchema: ChessMoveSuggestionsInputSchema,
    outputSchema: ChessMoveSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await chessMoveSuggestionsPrompt(input);
    return output!;
  }
);
