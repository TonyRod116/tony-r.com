import './BuildAppScreenshot.css'

// Both original mobile captures are 390×844 at 2× resolution. Frame away
// their top 26 CSS pixels; retain the original files and the rest of the UI.
export default function BuildAppScreenshot({ trimHeader = false, ...props }) {
  if (!trimHeader) return <img {...props} />
  return <span className="buildapp-screenshot-crop"><img {...props} className="buildapp-screenshot-image" /></span>
}
