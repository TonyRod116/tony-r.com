const LOCALES={en:'en-US',es:'es-ES',ca:'ca-ES'}
export default function ChatBubble({message,language='es'}) {
  const time=new Date(message.timestamp)
  return <div className={`site-chat-message ${message.role==='user'?'is-user':'is-assistant'}`}>
    <div className={`site-chat-bubble ${message.role==='user'?'is-user':''}`}><p>{message.displayText||message.content}</p><time dateTime={message.timestamp}>{Number.isNaN(time.getTime())?'':time.toLocaleTimeString(LOCALES[language],{hour:'2-digit',minute:'2-digit'})}</time></div>
  </div>
}
