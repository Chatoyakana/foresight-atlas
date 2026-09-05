import { useEffect, useRef, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useI18n } from '../i18n';

interface ModalProps {
  title: string;
  description?: string;
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
}

export default function Modal({ title, description, onClose, children, wide = false }: ModalProps) {
  const { ui } = useI18n();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    ref.current?.focus();
    return () => {
      document.body.style.overflow = oldOverflow;
      previous?.focus();
    };
  }, []);

  return (
    <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <motion.div ref={ref} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="modal-title"
        className={`modal ${wide ? 'modal-wide' : ''}`} initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.98 }}
        transition={{ duration: 0.2 }}
        onKeyDown={(event) => {
          if (event.key === 'Escape') { event.stopPropagation(); onClose(); }
          if (event.key !== 'Tab') return;
          const items = ref.current?.querySelectorAll<HTMLElement>('button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex="0"]');
          if (!items?.length) return;
          const first = items[0];
          const last = items[items.length - 1];
          if (event.shiftKey && (document.activeElement === first || document.activeElement === ref.current)) {
            event.preventDefault(); last.focus();
          } else if (!event.shiftKey && (document.activeElement === last || document.activeElement === ref.current)) {
            event.preventDefault(); first.focus();
          }
        }}>
        <div className="modal-heading">
          <div><h2 id="modal-title">{title}</h2>{description && <p>{description}</p>}</div>
          <button className="icon-button" aria-label={ui.detail.close} onClick={onClose}><X size={19} /></button>
        </div>
        {children}
      </motion.div>
    </motion.div>
  );
}