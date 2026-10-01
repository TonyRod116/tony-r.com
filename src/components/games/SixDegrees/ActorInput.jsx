import { useEffect, useId, useRef, useState } from 'react'

export default function ActorInput({ slot, label, value, person, onChange, onSelect, call, ready, resolving, copy }) {
  const list = useId().replaceAll(':', ''), [hits, setHits] = useState([]), [open, setOpen] = useState(false), [active, setActive] = useState(0), [busy, setBusy] = useState(false)
  const query = useRef(value)
  const blurTimer = useRef(null)
  useEffect(() => () => clearTimeout(blurTimer.current), [])
  useEffect(() => {
    query.current = value
    if (!ready || resolving || person || value.trim().length < 2) { setHits([]); setBusy(false); return }
    let live = true
    const timer = setTimeout(() => {
      setBusy(true)
      call('search', { slot, query: value }).then(data => {
        if (!live || query.current !== data.query) return
        setHits(data.results); setActive(-1); setBusy(false)
        const exact = data.results.filter(actor => actor.exact)
        if (exact.length === 1) onSelect(exact[0])
      }).catch(error => { if (live && error.name !== 'AbortError') { setHits([]); setBusy(false) } })
    }, 140)
    return () => { live = false; clearTimeout(timer) }
  }, [value, ready, resolving, person, call, slot, onSelect])
  const select = actor => { setOpen(false); setHits([]); onSelect(actor) }
  return <div className="degrees-input">
    <label htmlFor={`graph-${slot}`}>{label}</label>
    <input id={`graph-${slot}`} type="text" role="combobox" value={value} disabled={!ready} maxLength={100} autoComplete="off" spellCheck="false"
      aria-autocomplete="list" aria-expanded={open && hits.length > 0} aria-controls={list} aria-activedescendant={open && hits[active] ? `${list}-${active}` : undefined}
      placeholder={copy.placeholder} onFocus={() => { clearTimeout(blurTimer.current); setOpen(true) }} onBlur={() => { clearTimeout(blurTimer.current); blurTimer.current = setTimeout(() => setOpen(false), 120) }}
      onChange={event => { setOpen(true); onChange(event.target.value) }}
      onKeyDown={event => {
        if (event.key === 'ArrowDown' && hits.length) { event.preventDefault(); setOpen(true); setActive(index => (index + 1) % hits.length) }
        if (event.key === 'ArrowUp' && hits.length) { event.preventDefault(); setActive(index => (index - 1 + hits.length) % hits.length) }
        if (event.key === 'Enter' && open && hits[Math.max(0, active)]) { event.preventDefault(); select(hits[Math.max(0, active)]) }
        if (event.key === 'Escape') setOpen(false)
      }} />
    {open && hits.length > 0 && <ul id={list} role="listbox" aria-label={label} className="degrees-suggestions">{hits.map((actor, index) => <li key={actor.index} id={`${list}-${index}`} role="option" aria-selected={active === index}
      onMouseDown={event => event.preventDefault()} onClick={() => select(actor)}>
      <span>{actor.name}</span><small>{actor.birth || copy.unknownYear} · {actor.credits} {copy.credits}</small>{actor.approximate && <em>{copy.approximate}</em>}
    </li>)}</ul>}
    <p className="degrees-input-note" aria-live="polite">{person ? `${copy.selected}: ${person.name}${person.birth ? ` · ${person.birth}` : ''}` : busy ? copy.searchingName : open && value.trim().length >= 2 && !hits.length ? copy.noName : open && hits.length ? copy.chooseHit : copy.inputHint}</p>
  </div>
}
