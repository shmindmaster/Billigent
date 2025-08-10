import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';

type PanelState = {
  isOpen: boolean;
  title?: string;
  content?: ReactNode;
  open: (title: string, content: ReactNode) => void;
  close: () => void;
};

const PanelContext = createContext<PanelState | null>(null);

export function ContextualPanelProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<ReactNode>(null);

  const open = (t: string, c: ReactNode) => {
    setTitle(t);
    setContent(c);
    setIsOpen(true);
  };
  const close = () => setIsOpen(false);

  return (
    <PanelContext.Provider value={{ isOpen, title, content, open, close }}>
      {children}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>{title}</SheetTitle>
          </SheetHeader>
          <div className="mt-4">{content}</div>
        </SheetContent>
      </Sheet>
    </PanelContext.Provider>
  );
}

export function useContextualPanel() {
  const ctx = useContext(PanelContext);
  if (!ctx) throw new Error('useContextualPanel must be used within ContextualPanelProvider');
  return ctx;
}


