"use client"

import {
  Children,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { motion, MotionProps, useInView } from "motion/react"

import { cn } from "@/lib/utils"

interface SequenceContextValue {
  completeItem: (index: number) => void
  activeIndex: number
  sequenceStarted: boolean
}

const SequenceContext = createContext<SequenceContextValue | null>(null)

const useSequence = () => useContext(SequenceContext)

const ItemIndexContext = createContext<number | null>(null)
const useItemIndex = () => useContext(ItemIndexContext)

interface AnimatedSpanProps extends MotionProps {
  children: React.ReactNode
  delay?: number
  className?: string
  startOnView?: boolean
}

export const AnimatedSpan = ({
  children,
  delay = 0,
  className,
  startOnView = false,
  ...props
}: AnimatedSpanProps) => {
  const elementRef = useRef<HTMLDivElement | null>(null)
  const isInView = useInView(elementRef as React.RefObject<Element>, {
    amount: 0.3,
    once: true,
  })

  const sequence = useSequence()
  const itemIndex = useItemIndex()

  const shouldAnimate = useMemo(() => {
    if (sequence && itemIndex !== null) {
      return sequence.sequenceStarted && sequence.activeIndex >= itemIndex;
    }
    return startOnView ? isInView : true;
  }, [sequence, itemIndex, isInView, startOnView]);

  return (
    <motion.div
      ref={elementRef}
      initial={{ opacity: 0, y: -5 }}
      animate={shouldAnimate ? { opacity: 1, y: 0 } : { opacity: 0, y: -5 }}
      transition={{ duration: 0.3, delay: sequence ? 0 : delay / 1000 }}
      className={cn("grid text-sm font-normal tracking-tight", className)}
      onAnimationComplete={() => {
        if (!sequence) return
        if (itemIndex === null) return
        sequence.completeItem(itemIndex)
      }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

interface TypingAnimationProps extends MotionProps {
  children: string
  className?: string
  duration?: number
  delay?: number
  as?: React.ElementType
  startOnView?: boolean
}

export const TypingAnimation = ({
  children,
  className,
  duration = 60,
  delay = 0,
  as: Component = "span",
  startOnView = true,
  ...props
}: TypingAnimationProps) => {
  if (typeof children !== "string") {
    throw new Error("TypingAnimation: children must be a string. Received:")
  }

  const MotionComponent = useMemo(
    () =>
      motion.create(Component, {
        forwardMotionProps: true,
      }),
    [Component]
  )

  const [displayedText, setDisplayedText] = useState<string>("")
  const [started, setStarted] = useState(false)
  const elementRef = useRef<HTMLElement | null>(null)
  const isInView = useInView(elementRef as React.RefObject<Element>, {
    amount: 0.3,
    once: true,
  })

  const sequence = useSequence()
  const itemIndex = useItemIndex()

  useEffect(() => {
    // 1. Logic for when part of a Terminal sequence
    if (sequence && itemIndex !== null) {
      if (!sequence.sequenceStarted) return;
      if (started) return;
      
      if (sequence.activeIndex === itemIndex) {
        setStarted(true);
      }
      return;
    }

    // 2. Logic for standalone typing (Start on View or Immediate)
    if (!startOnView) {
      const startTimeout = setTimeout(() => setStarted(true), delay);
      return () => clearTimeout(startTimeout);
    }

    if (!isInView) return;

    const startTimeout = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(startTimeout);
    
    // Added 'sequence' to satisfy the linter and ensure the context is tracked correctly
  }, [
    delay,
    startOnView,
    isInView,
    started,
    sequence, 
    sequence?.activeIndex,
    sequence?.sequenceStarted,
    itemIndex,
  ]);

  useEffect(() => {
    if (!started) return;

    let i = 0;
    const typingEffect = setInterval(() => {
      if (i < children.length) {
        setDisplayedText(children.substring(0, i + 1));
        i++;
      } else {
        clearInterval(typingEffect);
        
        // Signal completion only when typing is fully finished
        if (sequence && itemIndex !== null) {
          sequence.completeItem(itemIndex);
        }
      }
    }, duration);

    return () => {
      clearInterval(typingEffect);
    };
    // Added 'sequence' and 'itemIndex' to satisfy the linter and ensure logic stability
  }, [children, duration, started, sequence, itemIndex]);

  return (
    <MotionComponent
      ref={elementRef}
      className={cn("text-sm font-normal tracking-tight", className)}
      {...props}
    >
      {displayedText}
    </MotionComponent>
  )
}

interface TerminalProps {
  children: React.ReactNode
  className?: string
  sequence?: boolean
  startOnView?: boolean
  onClose?: () => void
  onMinimize?: () => void        // 🟡
  onZoom?: () => void            // 🟢
}

export const Terminal = ({
  children,
  className,
  sequence = true,
  startOnView = true,
}: TerminalProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const isInView = useInView(containerRef as React.RefObject<Element>, {
    amount: 0.3,
    once: true,
  })

  const [activeIndex, setActiveIndex] = useState(0)
  const sequenceHasStarted = sequence ? !startOnView || isInView : false

  const contextValue = useMemo<SequenceContextValue | null>(() => {
    if (!sequence) return null
    return {
      completeItem: (index: number) => {
        setActiveIndex((current) => (index === current ? current + 1 : current))
      },
      activeIndex,
      sequenceStarted: sequenceHasStarted,
    }
  }, [sequence, activeIndex, sequenceHasStarted])

  const wrappedChildren = useMemo(() => {
    if (!sequence) return children;
    
    // Use React.Children.map for better stability with mixed child types
    return Children.map(children, (child, index) => {
      if (!child) return null;
      return (
        <ItemIndexContext.Provider key={`terminal-line-${index}`} value={index}>
          {child}
        </ItemIndexContext.Provider>
      );
    });
  }, [children, sequence]);

  const content = (
    <div
      ref={containerRef}
      className={cn(
        "z-0 w-full max-w-3xl rounded-xl overflow-hidden",
        className
      )}
    >
      <pre className="p-4">
        <code className="grid gap-y-1 overflow-auto">{wrappedChildren}</code>
      </pre>
    </div>
  );

  if (!sequence) return content

  return (
    <SequenceContext.Provider value={contextValue}>
      {content}
    </SequenceContext.Provider>
  )
}
