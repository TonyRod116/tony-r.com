import { useState } from 'react'
import { ArrowUpRight, Bomb } from 'lucide-react'
import { useLanguage } from '../../hooks/useLanguage.jsx'
import { destroyLabUrl, easterCopy } from '../../data/labEasterEgg'
import Modal from '../site/Modal'
import './LabEasterEgg.css'

export default function LabEasterEgg({ pathname }) {
  const { language } = useLanguage()
  const [open, setOpen] = useState(false)
  const copy = easterCopy[language], href = destroyLabUrl(pathname)
  if (!href) return null
  return <div className="lab-easter">
    <button type="button" className="lab-easter-trigger" aria-haspopup="dialog" onClick={() => setOpen(true)}><Bomb size={14} aria-hidden="true" />{copy.trigger}</button>
    <Modal open={open} title={copy.title} onClose={() => setOpen(false)} closeLabel={copy.close}>
      <div className="lab-easter-content">
        <h3>{copy.heading}</h3>
        <p>{copy.description}</p>
        <p>{copy.credit} <a href="https://www.spritefusion.com/games/destroy-any-website" target="_blank" rel="noopener noreferrer">Hugo Duprez / Sprite Fusion</a>.</p>
        <p className="lab-easter-controls">{copy.controls}</p>
        <a className="lab-easter-launch" href={href} target="_blank" rel="noopener noreferrer">{copy.launch}<ArrowUpRight size={18} aria-hidden="true" /></a>
      </div>
    </Modal>
  </div>
}
