const STORAGE_KEY = 'lead_qualifier_leads'

export function generateLeadId() {
  return `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

export function saveLeadToStorage(lead) {
  try {
    const leads = getLeadsFromStorage()
    leads.unshift(lead)
    
    // Keep only last 100 leads
    const trimmed = leads.slice(0, 100)
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed))
    return true
  } catch (e) {
    console.error('Failed to save lead:', e)
    return false
  }
}

export function getLeadsFromStorage() {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (!data) return []
    
    const parsed = JSON.parse(data)
    return Array.isArray(parsed) ? parsed : []
  } catch (e) {
    console.error('Failed to read leads:', e)
    return []
  }
}

export function getLeadById(id) {
  const leads = getLeadsFromStorage()
  return leads.find(l => l.id === id) || null
}

export function deleteLeadFromStorage(id) {
  try {
    const leads = getLeadsFromStorage()
    const filtered = leads.filter(l => l.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
    return true
  } catch (e) {
    console.error('Failed to delete lead:', e)
    return false
  }
}

export function clearAllLeads() {
  try {
    localStorage.removeItem(STORAGE_KEY)
    return true
  } catch (e) {
    console.error('Failed to clear leads:', e)
    return false
  }
}

export function exportLeadsAsJSON() {
  const leads = getLeadsFromStorage()
  return JSON.stringify(leads, null, 2)
}

export function exportLeadsAsCSV() {
  const leads = getLeadsFromStorage()
  
  if (leads.length === 0) return ''

  const headers = [
    'ID',
    'Fecha',
    'Resumen',
    'Tier',
    'Score',
    'Tipo Proyecto',
    'Ciudad',
    'M²',
    'Presupuesto',
    'Plazo',
    'Propietario',
    'Contacto',
    'Teléfono',
    'Email',
    'Razones',
  ]

  const rows = leads.map(lead => [
    lead.id,
    lead.createdAt,
    lead.summary,
    lead.tier,
    lead.score,
    lead.fields?.projectType || '',
    lead.fields?.city || '',
    lead.fields?.sqm || '',
    lead.fields?.budget || '',
    lead.fields?.timeline || '',
    lead.fields?.isOwner ? 'Sí' : 'No',
    lead.fields?.contactName || '',
    lead.fields?.contactPhone || '',
    lead.fields?.contactEmail || '',
    (lead.reasons || []).join('; '),
  ])

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')),
  ].join('\n')

  return csvContent
}
