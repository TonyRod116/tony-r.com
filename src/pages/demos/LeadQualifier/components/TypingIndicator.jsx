import { useLanguage } from '../../../../hooks/useLanguage.jsx'
import { siteContent } from '../../../../data/siteContent'
export default function TypingIndicator() {
  const {language}=useLanguage()
  return <p className="site-note" role="status">{siteContent[language].generating}</p>
}
