
import GameModeSelection from '@/components/game/GameModeSelection';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-background">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Image
              src="/images/lumberjack.webp"
              alt="Ilustração de um lenhador"
              width="234"
              height="293"
              className="object-contain"
              data-ai-hint="lumberjack illustration"
              priority
            />
          </div>
          <CardTitle className="text-4xl font-bold text-primary">ChessMastery</CardTitle>
        </CardHeader>
        <CardContent>
          <GameModeSelection />
        </CardContent>
      </Card>
      <footer className="mt-8 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} ChessMastery. Aguce sua mente.</p>
      </footer>
    </main>
  );
}

