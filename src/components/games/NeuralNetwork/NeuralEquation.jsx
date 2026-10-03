const scripts = { '¹':'1', '²':'2', '³':'3', 'ᵀ':'T', '′':'′' }
const tokensFor = text => text.match(/∂L\/∂[A-Za-zδ]+[¹²³]?|[A-Za-zÀ-ÖØ-öø-ÿδ]+̃?[¹²³ᵀ′]*|\d+(?:\.\d+)?|[^\s]/gu) ?? []

function MathTokens({ text }) {
  return <mrow>{tokensFor(text).map((token,index) => {
    if (token.startsWith('∂L/∂')) {
      const [numerator,denominator] = token.split('/')
      return <mfrac key={index}><MathTokens text={numerator}/><MathTokens text={denominator}/></mfrac>
    }
    if (/^\d/.test(token)) return <mn key={index}>{token}</mn>
    const identifier = token.match(/^([A-Za-zÀ-ÖØ-öø-ÿδ]+)(̃)?([¹²³ᵀ′]*)$/u)
    if (!identifier) return <mo key={index}>{token}</mo>
    const [,name,tilde,superscript] = identifier
    let base = <mi mathvariant={name.length>1?'normal':undefined}>{name}</mi>
    if (tilde) base = <mover accent="true">{base}<mo>~</mo></mover>
    return superscript ? <msup key={index}>{base}<mrow>{[...superscript].map((char,i)=>/\d/.test(scripts[char])?<mn key={i}>{scripts[char]}</mn>:<mi key={i} mathvariant="normal">{scripts[char]}</mi>)}</mrow></msup> : <mrow key={index}>{base}</mrow>
  })}</mrow>
}

function MathLine({ text, words }) {
  if (words) return <mrow>{text.split('→').map((part,index)=><mrow key={index}>{index>0&&<mo>→</mo>}<mi>L</mi><mtext>{' '+part.trim().slice(1).trim()}</mtext></mrow>)}</mrow>
  const divider = text.indexOf(' / ')
  if (divider<0) return <MathTokens text={text}/>
  const equals = text.indexOf('='),numerator=text.slice(equals+1,divider).trim(),denominator=text.slice(divider+3).trim()
  const unwrapped = numerator.startsWith('(')&&numerator.endsWith(')') ? numerator.slice(1,-1) : numerator
  return <mrow><MathTokens text={text.slice(0,equals)}/><mo>=</mo><mfrac><MathTokens text={unwrapped}/><MathTokens text={denominator}/></mfrac></mrow>
}

export default function NeuralEquation({ formula, phase }) {
  const rows = formula.split(';').map(value=>value.trim())
  return <div className="neural-equation" data-testid="neural-equation">
    <math xmlns="http://www.w3.org/1998/Math/MathML" display="block" aria-label={formula}>
      {rows.length===1 ? <MathLine text={rows[0]} words={phase==='after'}/> : <mtable columnalign="left">{rows.map((text,index)=><mtr key={index}><mtd><MathLine text={text}/></mtd></mtr>)}</mtable>}
    </math>
  </div>
}
