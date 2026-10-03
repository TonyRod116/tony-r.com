import { useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import Modal from './Modal'
import { tradingPayouts, payoutCopy, payoutAmount, payoutDate } from '../../data/tradingPayouts'

export default function TradingPayouts({ language }) {
  const [selected, setSelected] = useState(null)
  const copy = payoutCopy[language]
  return <section className="home-payouts" aria-label={copy.title}>
    <ul className="home-payouts-list">
      {tradingPayouts.map(payout => <li key={payout.date}>
        <button type="button" className="home-payout" onClick={() => setSelected(payout)} aria-haspopup="dialog" aria-label={`${copy.view}: ${payoutAmount(payout.amount, language)}, ${payoutDate(payout.date, language)}`}>
          <img src={payout.thumbnail} alt="" width="600" height="430" loading="lazy" />
          <span className="home-payout-detail"><strong>{payoutAmount(payout.amount, language)}</strong><time dateTime={payout.date}>{payoutDate(payout.date, language)}</time></span>
          <span className="home-payout-open">{copy.view}<ArrowUpRight size={16} aria-hidden="true" /></span>
        </button>
      </li>)}
    </ul>
    <p className="home-payouts-note">{copy.privacy}</p>
    <Modal open={Boolean(selected)} onClose={() => setSelected(null)} title={selected ? `${copy.certificate} · ${payoutAmount(selected.amount, language)} · ${payoutDate(selected.date, language)}` : copy.certificate} closeLabel={copy.close} large
      footer={selected && <><p className="home-payouts-note">{copy.privacy}</p><a href={selected.image} className="home-link" target="_blank" rel="noopener noreferrer">{copy.fullSize}<ArrowUpRight size={16} aria-hidden="true" /></a></>}>
      {selected && <img src={selected.image} alt={`${copy.certificate} · Lucid Trading · ${payoutAmount(selected.amount, language)} · ${payoutDate(selected.date, language)}`} width="1500" height="1075" />}
    </Modal>
  </section>
}
