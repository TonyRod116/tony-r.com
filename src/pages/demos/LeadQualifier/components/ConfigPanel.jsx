import { useEffect, useState } from 'react'
import Modal from '../../../../components/site/Modal'
import { useLanguage } from '../../../../hooks/useLanguage.jsx'
import { siteContent } from '../../../../data/siteContent'

const defaults=config=>({cities:config.coveredCities?.join(', ')||'',ranges:Object.fromEntries(['baño','cocina','integral','pintura'].map(type=>[type,config.budgetRanges?.[type]?.min??{baño:5000,cocina:8000,integral:50000,pintura:2500}[type]])),bonus:config.budgetBonusThreshold??50000})
export default function ConfigPanel({config,onSave,onClose,t,open}) {
  const {language}=useLanguage(),copy=siteContent[language]
  const [values,setValues]=useState(()=>defaults(config))
  useEffect(()=>{if(open)setValues(defaults(config))},[open,config])
  const labels={baño:t('solutions.leadQualifier.config.bathroom'),cocina:t('solutions.leadQualifier.config.kitchen'),integral:t('solutions.leadQualifier.config.fullRenovation'),pintura:t('solutions.leadQualifier.config.painting')}
  const save=event=>{event.preventDefault();onSave({...config,coveredCities:values.cities.split(',').map(city=>city.trim()).filter(Boolean),budgetRanges:Object.fromEntries(Object.entries(values.ranges).map(([type,value])=>[type,{min:Number(value)}])),budgetBonusThreshold:Number(values.bonus)})}
  return <Modal open={open} title={copy.configuration} onClose={onClose} closeLabel={copy.close}>
    <form className="site-config-content" onSubmit={save}>
      <label>{t('solutions.leadQualifier.config.coveredCities')}<textarea required rows={3} value={values.cities} onChange={event=>setValues(previous=>({...previous,cities:event.target.value}))} /></label>
      <p className="site-note">{t('solutions.leadQualifier.config.citiesSeparator')}</p>
      {Object.entries(values.ranges).map(([type,value])=><label key={type}>{labels[type]} (€)<input type="number" min="0" required value={value} onChange={event=>setValues(previous=>({...previous,ranges:{...previous.ranges,[type]:event.target.value}}))} /></label>)}
      <label>{t('solutions.leadQualifier.config.budgetBonusLabel')} (€)<input type="number" min="0" required value={values.bonus} onChange={event=>setValues(previous=>({...previous,bonus:event.target.value}))} /></label>
      <div className="site-actions"><button className="site-button" type="submit">{t('solutions.leadQualifier.config.save')}</button><button className="site-button site-button-secondary" type="button" onClick={onClose}>{copy.cancel}</button></div>
    </form>
  </Modal>
}
