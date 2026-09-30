import { useEffect, useId, useRef } from 'react'
import { X } from 'lucide-react'

export default function Modal({ open, title, onClose, children, footer, large = false, closeLabel, onKeyDown }) {
  const dialog = useRef(null)
  const titleId = useId()
  useEffect(() => {
    const element = dialog.current
    if (open && !element.open) element.showModal()
    if (!open && element.open) element.close()
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previous }
  }, [open])
  return <dialog ref={dialog} className={`site-modal${large ? ' is-large' : ''}`} aria-labelledby={titleId} onClose={onClose} onKeyDown={onKeyDown}
    onClick={e => { if (e.target === dialog.current) { const rect = e.currentTarget.getBoundingClientRect(); if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) e.currentTarget.close() } }}>
    {open && <><header className="site-modal-heading"><h2 id={titleId}>{title}</h2><button type="button" onClick={() => dialog.current.close()} aria-label={closeLabel}><X size={22} /></button></header><div className="site-modal-body">{children}</div>{footer && <footer className="site-modal-footer">{footer}</footer>}</>}
  </dialog>
}
