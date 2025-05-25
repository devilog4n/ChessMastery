# ChessMastery

This is a Next.js application for an elegant chess game called ChessMastery, built with Firebase Studio.

## Core Features

-   **Game Mode Selection**: Intuitive UI for selecting game mode: player vs. AI (easy, medium, hard) or player vs. player (on the same device).
-   **Visually Appealing Chessboard**: Elegant chessboard and piece designs for enhanced visual appeal using Unicode characters and Tailwind CSS.
-   **AI Chess Tutor**: An AI-powered chess assistant that provides move suggestions, strategic advice, and reasoning behind each recommendation. This feature leverages Genkit AI.
-   **Move History**: Clear and concise display of moves made during the game.
-   **Save/Load Progress**: Option to save and load game progress locally in the browser.

## Getting Started

To get started with the application:

1.  **Install dependencies**:
    ```bash
    npm install
    ```
2.  **Run the development server for Next.js**:
    ```bash
    npm run dev
    ```
    This will typically start the application on `http://localhost:9002`.

3.  **(Optional) Run Genkit in development (if modifying AI flows)**:
    If you need to test or develop the Genkit AI flows locally, run:
    ```bash
    npm run genkit:watch
    ```
    This usually starts the Genkit developer UI on `http://localhost:4000`. Note that for this project, the AI flows are pre-built and located in `src/ai/flows`.

The main application entry point for game mode selection is `src/app/page.tsx`. The actual gameplay happens on the `/play` route.

## Project Structure Highlights

-   `src/app/page.tsx`: Initial page for game mode selection.
-   `src/app/play/page.tsx`: The main page where the chess game is played.
-   `src/components/chess/`: Contains React components related to the chessboard (`Chessboard.tsx`, `Square.tsx`).
-   `src/components/game/`: Contains React components for game UI elements (`GameModeSelection.tsx`, `MoveHistory.tsx`, `AiTutorPanel.tsx`, `GameControls.tsx`).
-   `src/hooks/useChessGame.ts`: A custom React hook to manage the state and logic of the chess game.
-   `src/lib/chess-logic.ts`: Utility functions for chess, such as initial board setup and FEN string generation.
-   `src/types/chess.ts`: TypeScript type definitions for chess-related data structures.
-   `src/ai/flows/chess-move-suggestions.ts`: The Genkit AI flow definition for the Chess GrandMaster Tutor. **Do not modify this file unless you are familiar with Genkit and the AI model configuration.**

## UI Style

-   **Primary Color**: Deep Blue (`#31708E`) - Represents intellect and strategy.
-   **Background Color**: Soft Gray (`#E9E9E9`) - Provides a calm and neutral backdrop.
-   **Accent Color**: Golden Yellow (`#FFC857`) - Highlights important actions or hints.
-   **Typography**: Clean and readable fonts (Geist Sans, Geist Mono).
-   **Layout**: Minimalist design with a focus on the chessboard.
-   **Icons**: Subtle and recognizable icons from `lucide-react`.

Enjoy playing ChessMastery!
