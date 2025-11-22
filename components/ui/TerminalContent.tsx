"use client"
import {
    AnimatedSpan,
    Terminal,
    TypingAnimation,
} from "./terminal"
import { useState } from "react"
import { cn } from "@/lib/utils"

export function TerminalDemo({ onClose }: { onClose?: () => void }) {

    const [isMinimized, setIsMinimized] = useState(false)
    const [isZoomed, setIsZoomed] = useState(false)
    return (
      <div
        className={cn(
          isZoomed ? "scale-105 w-full max-w-none" : "",
          isMinimized ? "h-8 overflow-hidden" : ""
        )}
      >
        <Terminal
          onClose={onClose}
          onMinimize={() => setIsMinimized((prev) => !prev)}
          onZoom={() => setIsZoomed((prev) => !prev)}
        >
          {/* 1️⃣ Create Next.js Project */}
          <TypingAnimation className="text-muted-foreground">
            $ npx create-next-app@latest .
          </TypingAnimation>
          <AnimatedSpan className="text-yellow-500">
            Creating a new Next.js app...
          </AnimatedSpan>
          <AnimatedSpan className="text-green-500">
            ✓ Project initialized successfully.
          </AnimatedSpan>
          <AnimatedSpan className="text-green-500">
            ✓ Tailwind CSS configured.
          </AnimatedSpan>
          <AnimatedSpan className="text-blue-500">
            Ready to install UI components.
          </AnimatedSpan>
          {/* 2️⃣ Initialize shadcn/ui */}
          <TypingAnimation className="text-muted-foreground">
            $ npx shadcn@latest init
          </TypingAnimation>
          <AnimatedSpan className="text-yellow-500">
            Initializing shadcn/ui configuration...
          </AnimatedSpan>
          <AnimatedSpan className="text-green-500">
            ✓ Configuration file created.
          </AnimatedSpan>
          <AnimatedSpan className="text-green-500">
            ✓ Theme generated successfully.
          </AnimatedSpan>
          {/* 3️⃣ Add button component */}
          <TypingAnimation className="text-muted-foreground">
            $ npx shadcn@latest add button
          </TypingAnimation>
          <AnimatedSpan className="text-yellow-500">
            Fetching UI component: button...
          </AnimatedSpan>
          <AnimatedSpan className="text-green-500">
            ✓ button component added successfully.
          </AnimatedSpan>
          {/* 4️⃣ Start dev server */}
          <TypingAnimation className="text-muted-foreground">
            $ npm run dev
          </TypingAnimation>
          <AnimatedSpan className="text-blue-500">
            Starting development server...
          </AnimatedSpan>
          <AnimatedSpan className="text-green-500">
            🚀 Server ready at http://localhost:3000
          </AnimatedSpan>
        </Terminal>
      </div>
    );
}
