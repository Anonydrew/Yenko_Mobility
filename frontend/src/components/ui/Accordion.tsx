import { useId, useState, type ReactNode } from 'react';
import { cx } from '@/lib/cx';
import { PlusIcon } from './icons';

export type AccordionItem = { question: string; answer: ReactNode };

type AccordionProps = {
  items: AccordionItem[];
  defaultOpen?: number | null;
};

export default function Accordion({ items, defaultOpen = null }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpen);
  const baseId = useId();

  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const buttonId = `${baseId}-button-${index}`;
        const panelId = `${baseId}-panel-${index}`;
        return (
          <div key={item.question}>
            <h3>
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="flex w-full items-center justify-between gap-6 py-5 text-left text-lg font-medium tracking-tight"
              >
                {item.question}
                <PlusIcon className={cx('shrink-0 transition-transform duration-200', isOpen && 'rotate-45')} />
              </button>
            </h3>
            <div id={panelId} role="region" aria-labelledby={buttonId} hidden={!isOpen} className="pb-6 pr-10 leading-relaxed text-ink-muted">
              {item.answer}
            </div>
          </div>
        );
      })}
    </div>
  );
}
