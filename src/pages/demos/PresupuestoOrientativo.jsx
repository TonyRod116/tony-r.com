import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Clock, Package, HardHat, Boxes, ArrowRight, Info, XCircle, CheckCircle2 } from 'lucide-react'
import { useLanguage } from '../../hooks/useLanguage.jsx'
import { observeDemoRequest } from '../../utils/telemetry'
import { readDemoResponse } from '../../utils/demoResponse'
import { siteContent } from '../../data/siteContent'
import DemoPage from '../../components/site/DemoPage'

const BASE = 'https://buildapp-v1-backend.onrender.com'
const LOCALES = {es:'es-ES',en:'en-US',ca:'ca-ES'}
const TYPES = ['baño','cocina','integral','pintura','suelo','otros']
const PERIODS = {es:{days:'días',weeks:'semanas',months:'meses',day:'día',week:'semana',month:'mes'},en:{days:'days',weeks:'weeks',months:'months',day:'day',week:'week',month:'month'},ca:{days:'dies',weeks:'setmanes',months:'mesos',day:'dia',week:'setmana',month:'mes'}}
export default function PresupuestoOrientativo() {
  const { t, language } = useLanguage()
  const copy = siteContent[language], locale = LOCALES[language]
  const [formData,setFormData] = useState({projectType:[],sqm:'',city:'Barcelona',notes:''})
  const [loading,setLoading] = useState(false)
  const [error,setError] = useState(null)
  const [result,setResult] = useState(null)
  const request = useRef(null), version = useRef(0)
  useEffect(() => () => {version.current++;request.current?.abort()},[])
  const translatePeriodType = value => value ? PERIODS[language][String(value).toLowerCase()] || value : ''
  const change = event => {setFormData(previous => ({...previous,[event.target.name]:event.target.value}));setError(null)}
  const toggle = value => {setFormData(previous => ({...previous,projectType:previous.projectType.includes(value)?previous.projectType.filter(item=>item!==value):[...previous.projectType,value]}));setError(null)}
  const cancel = () => {version.current++;request.current?.abort();setLoading(false);setError(null)}
  const generate = async event => {
    event.preventDefault()
    if(loading)return
    if(!formData.projectType.length){setError(copy.chooseType);return}
    const id=++version.current, controller=new AbortController()
    request.current=controller;setLoading(true);setError(null);setResult(null)
    const timer=setTimeout(()=>controller.abort('timeout'),120000)
    const projectType=formData.projectType.join(', ')
    const description=formData.notes.trim() || [formData.projectType.map(type=>t(`solutions.projectTypes.${type}`)).join(', '),formData.sqm?`${formData.sqm} m²`:'',formData.city].filter(Boolean).join(' · ')
    const body={projectType,locale,description}
    if(formData.sqm)body.sqm=Number(formData.sqm)
    if(formData.city.trim())body.city=formData.city.trim()
    try {
      const base=(import.meta.env.VITE_BUILDAPP_DEMO_API_URL || BASE).replace(/\/$/,'')
      const response=await observeDemoRequest('budget',()=>fetch(`${base}/api/v1/budget/generate-detailed`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body),signal:controller.signal}))
      const data=await readDemoResponse(response,copy.serviceError)
      if(!['total','totalMin','totalMax','items','lineItems'].some(key=>data[key]!=null))throw new Error(copy.serviceError)
      if(id===version.current)setResult(data)
    }catch(problem){if(id===version.current)setError(controller.signal.reason==='timeout'?copy.timeout:controller.signal.aborted?null:problem.message || copy.serviceError)}
    finally{clearTimeout(timer);if(id===version.current)setLoading(false)}
  }
  return <DemoPage id="presupuesto-orientativo">
    <form onSubmit={generate} className="site-budget-form">
      <div><p className="site-kicker">{t('solutions.presupuestoOrientativo.form.projectType')}</p><div className="site-budget-types">{TYPES.map(type=><button type="button" key={type} aria-pressed={formData.projectType.includes(type)} disabled={loading} onClick={()=>toggle(type)}>{t(`solutions.projectTypes.${type}`)}</button>)}</div><p className="site-note">{copy.selectedTypes}: {formData.projectType.length}</p></div>
      <div className="site-form">
        <div className="site-field"><label htmlFor="budget-sqm">{t('solutions.presupuestoOrientativo.form.sqm')}</label><input id="budget-sqm" name="sqm" type="number" inputMode="numeric" min="1" max="100000" step="1" value={formData.sqm} onChange={change} disabled={loading} placeholder={t('solutions.presupuestoOrientativo.form.sqmPlaceholder')} /></div>
        <div className="site-field"><label htmlFor="budget-city">{t('solutions.presupuestoOrientativo.form.city')}</label><input id="budget-city" name="city" value={formData.city} onChange={change} disabled={loading} /></div>
        <div className="site-field"><label htmlFor="budget-notes">{t('solutions.presupuestoOrientativo.form.notes')}</label><textarea id="budget-notes" name="notes" rows={4} value={formData.notes} onChange={change} disabled={loading} placeholder={t('solutions.presupuestoOrientativo.form.notesPlaceholder')} /></div>
        {error&&<p role="alert" className="site-message is-error">{error}</p>}
        <button type="submit" className="site-button" disabled={loading}>{loading?copy.generating:t('solutions.presupuestoOrientativo.form.generate')}</button>
        {loading&&<div><p role="status">{copy.generating}</p><button className="site-button site-button-secondary" type="button" onClick={cancel}>{copy.cancel}</button></div>}
        <p className="site-note">{copy.serviceNote}</p>
      </div>
    </form>
    <div className="site-budget-result">
        {result && (
          <div
          >
            {/* Results header row */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
              <div>
                <p className="text-xs font-medium text-primary-600 dark:text-primary-400 uppercase tracking-widest mb-1">{t('solutions.presupuestoOrientativo.result.title')}</p>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
                  {t('solutions.presupuestoOrientativo.result.title')}
                </h2>
                {result.estimatedDuration && (
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    {t('solutions.presupuestoOrientativo.result.estimatedDuration')}: {result.estimatedDuration}
                  </p>
                )}
              </div>
              {result.total != null && (
                <div className="sm:text-right">
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-0.5">{t('solutions.presupuestoOrientativo.result.total')}</p>
                  <p className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white tabular-nums">
                    {Number(result.total).toLocaleString(locale)} <span className="text-lg font-medium text-gray-400">{result.currency || '€'}</span>
                  </p>
                </div>
              )}
            </div>

            {/* KPI cards */}
            {result.summary && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-gray-200 dark:bg-gray-800 rounded-md overflow-hidden mb-8 border border-gray-200 dark:border-gray-800">
                {[
                  { key: 'materials', value: result.summary.materials, icon: Package, color: 'text-blue-600 dark:text-blue-400' },
                  { key: 'labor', value: result.summary.labor, icon: HardHat, color: 'text-amber-600 dark:text-amber-400' },
                  { key: 'other', value: result.summary.other, icon: Boxes, color: 'text-gray-600 dark:text-gray-400' },
                ].filter(c => c.value != null).map((card) => (
                  <div key={card.key} className="bg-white dark:bg-gray-900 px-5 py-4 flex items-center gap-4">
                    <card.icon className={`h-5 w-5 ${card.color} flex-shrink-0`} />
                    <div className="min-w-0">
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{t(`solutions.presupuestoOrientativo.result.${card.key}`)}</p>
                      <p className="text-base font-semibold text-gray-900 dark:text-white tabular-nums">{Number(card.value).toLocaleString(locale)} €</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Items table */}
            {result.items?.length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                  {t('solutions.presupuestoOrientativo.result.lineItems')}
                </h3>
                <div className="overflow-x-auto border border-gray-200 dark:border-gray-800 rounded-md">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-gray-900 text-left">
                        <th className="py-2.5 px-4 font-medium text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">{t('solutions.presupuestoOrientativo.result.category')}</th>
                        <th className="py-2.5 px-4 font-medium text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">{t('solutions.presupuestoOrientativo.result.item')}</th>
                        <th className="py-2.5 px-4 font-medium text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider text-right">{t('solutions.presupuestoOrientativo.result.qty')}</th>
                        <th className="py-2.5 px-4 font-medium text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">{t('solutions.presupuestoOrientativo.result.unit')}</th>
                        <th className="py-2.5 px-4 font-medium text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider text-right">{t('solutions.presupuestoOrientativo.result.unitPrice')}</th>
                        <th className="py-2.5 px-4 font-medium text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider text-right">{t('solutions.presupuestoOrientativo.result.total')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                      {result.items.map((row, i) => (
                        <tr key={i} className="hover:bg-gray-50/60 dark:hover:bg-gray-800/40 transition-colors">
                          <td className="py-2.5 px-4 text-gray-500 dark:text-gray-400 whitespace-nowrap">{row.category ?? '-'}</td>
                          <td className="py-2.5 px-4">
                            <span className="font-medium text-gray-900 dark:text-white">{row.concept}</span>
                            {row.description && <span className="block text-xs text-gray-500 dark:text-gray-400 mt-0.5">{row.description}</span>}
                          </td>
                          <td className="py-2.5 px-4 text-right text-gray-700 dark:text-gray-300 tabular-nums">{row.quantity ?? '-'}</td>
                          <td className="py-2.5 px-4 text-gray-500 dark:text-gray-400">{row.unit ?? '-'}</td>
                          <td className="py-2.5 px-4 text-right text-gray-700 dark:text-gray-300 tabular-nums">{row.unitPrice != null ? `${Number(row.unitPrice).toLocaleString(locale)} €` : '-'}</td>
                          <td className="py-2.5 px-4 text-right font-medium text-gray-900 dark:text-white tabular-nums">{row.total != null ? `${Number(row.total).toLocaleString(locale)} €` : '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                    {result.total != null && (
                      <tfoot>
                        <tr className="border-t-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                          <td colSpan={5} className="py-2.5 px-4 text-right text-sm font-medium text-gray-900 dark:text-white">{t('solutions.presupuestoOrientativo.result.total')}</td>
                          <td className="py-2.5 px-4 text-right font-bold text-gray-900 dark:text-white tabular-nums">{Number(result.total).toLocaleString(locale)} €</td>
                        </tr>
                      </tfoot>
                    )}
                  </table>
                </div>
              </div>
            )}

            {/* Timeline */}
            {result.timeline?.length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">
                  {t('solutions.presupuestoOrientativo.result.timeline')}
                </h3>
                <div className="space-y-0">
                  {result.timeline.map((phase, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 flex items-center justify-center flex-shrink-0 text-xs font-semibold text-gray-600 dark:text-gray-300">
                          {i + 1}
                        </div>
                        {i < result.timeline.length - 1 && (
                          <div className="w-px flex-1 bg-gray-200 dark:bg-gray-700 min-h-[20px]" />
                        )}
                      </div>
                      <div className={i === result.timeline.length - 1 ? '' : 'pb-5'}>
                        <p className="text-sm font-medium text-gray-900 dark:text-white leading-7">
                          {phase.period} {translatePeriodType(phase.periodType)}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{phase.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Notes / Assumptions / Exclusions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-2">
              {(Array.isArray(result.notes) ? result.notes.length > 0 : typeof result.notes === 'string' && result.notes.trim()) && (
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-1.5">
                    <Info className="h-3.5 w-3.5 text-gray-400" />
                    {t('solutions.presupuestoOrientativo.result.notes')}
                  </h3>
                  {Array.isArray(result.notes) ? (
                    <ul className="space-y-1.5">
                      {result.notes.map((n, i) => (
                        <li key={i} className="text-sm text-gray-600 dark:text-gray-400 pl-4 relative before:content-[''] before:absolute before:left-0 before:top-[9px] before:w-1.5 before:h-1.5 before:rounded-full before:bg-gray-300 dark:before:bg-gray-600">
                          {n}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-600 dark:text-gray-400">{result.notes}</p>
                  )}
                </div>
              )}

              {!result.items?.length && result.assumptions?.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-gray-400" />
                    {t('solutions.presupuestoOrientativo.result.assumptions')}
                  </h3>
                  <ul className="space-y-1.5">
                    {result.assumptions.map((a, i) => (
                      <li key={i} className="text-sm text-gray-600 dark:text-gray-400 pl-4 relative before:content-[''] before:absolute before:left-0 before:top-[9px] before:w-1.5 before:h-1.5 before:rounded-full before:bg-gray-300 dark:before:bg-gray-600">
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {!result.items?.length && result.exclusions?.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-1.5">
                    <XCircle className="h-3.5 w-3.5 text-gray-400" />
                    {t('solutions.presupuestoOrientativo.result.exclusions')}
                  </h3>
                  <ul className="space-y-1.5">
                    {result.exclusions.map((e, i) => (
                      <li key={i} className="text-sm text-gray-600 dark:text-gray-400 pl-4 relative before:content-[''] before:absolute before:left-0 before:top-[9px] before:w-1.5 before:h-1.5 before:rounded-full before:bg-gray-300 dark:before:bg-gray-600">
                        {e}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Editing note */}
            {result && (
              <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  <Info className="h-4 w-4 inline-block mr-1.5 align-text-bottom" />
                  {copy.resultNote}
                </p>
              </div>
            )}

            {/* Alt lineItems with ranges */}
            {!result.items?.length && result.lineItems?.length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                  {t('solutions.presupuestoOrientativo.result.lineItems')}
                </h3>
                <div className="overflow-x-auto border border-gray-200 dark:border-gray-800 rounded-md">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-gray-900 text-left">
                        <th className="py-2.5 px-4 font-medium text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">{t('solutions.presupuestoOrientativo.result.category')}</th>
                        <th className="py-2.5 px-4 font-medium text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">{t('solutions.presupuestoOrientativo.result.item')}</th>
                        <th className="py-2.5 px-4 font-medium text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider text-right">{t('solutions.presupuestoOrientativo.result.qty')}</th>
                        <th className="py-2.5 px-4 font-medium text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">{t('solutions.presupuestoOrientativo.result.unit')}</th>
                        <th className="py-2.5 px-4 font-medium text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider text-right">{t('solutions.presupuestoOrientativo.result.min')}</th>
                        <th className="py-2.5 px-4 font-medium text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider text-right">{t('solutions.presupuestoOrientativo.result.max')}</th>
                        <th className="py-2.5 px-4 font-medium text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">{t('solutions.presupuestoOrientativo.result.notes')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                      {result.lineItems.map((row, i) => (
                        <tr key={i} className="hover:bg-gray-50/60 dark:hover:bg-gray-800/40 transition-colors">
                          <td className="py-2.5 px-4 text-gray-500 dark:text-gray-400">{row.category}</td>
                          <td className="py-2.5 px-4 font-medium text-gray-900 dark:text-white">{row.item}</td>
                          <td className="py-2.5 px-4 text-right text-gray-700 dark:text-gray-300 tabular-nums">{row.qty ?? '-'}</td>
                          <td className="py-2.5 px-4 text-gray-500 dark:text-gray-400">{row.unit ?? '-'}</td>
                          <td className="py-2.5 px-4 text-right text-gray-700 dark:text-gray-300 tabular-nums">{row.rangeMin ?? row.min ?? '-'}</td>
                          <td className="py-2.5 px-4 text-right text-gray-700 dark:text-gray-300 tabular-nums">{row.rangeMax ?? row.max ?? '-'}</td>
                          <td className="py-2.5 px-4 text-gray-500 dark:text-gray-400">{row.notes ?? '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {(result.totalMin || result.totalMax || result.total) && (
                  <div className="mt-3 text-right">
                    <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">{t('solutions.presupuestoOrientativo.result.total')}:</span>
                    <span className="text-base font-bold text-gray-900 dark:text-white tabular-nums">
                      {result.totalMin != null && result.totalMax != null
                        ? `${Number(result.totalMin).toLocaleString(locale)} € – ${Number(result.totalMax).toLocaleString(locale)} €`
                        : result.total != null ? `${Number(result.total).toLocaleString(locale)} €` : '—'}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* CTA After Result */}
            {result && (
              <div
                className="mt-12 p-6 sm:p-8 bg-gradient-to-br from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 border border-primary-200 dark:border-primary-800 rounded-lg"
              >
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  {t('solutions.presupuestoOrientativo.ctaAfterResult.question')}
                </h3>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    to="/contact"
                    className="inline-flex items-center justify-center gap-2 rounded-md bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white px-6 py-3 text-sm font-medium transition-colors"
                  >
                    {copy.openBuildApp}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    to="/contact"
                    className="inline-flex items-center justify-center gap-2 rounded-md border border-primary-600 dark:border-primary-500 bg-white dark:bg-gray-900 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 px-6 py-3 text-sm font-medium transition-colors"
                  >
                    {copy.talk}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
    </div>
  </DemoPage>
}
