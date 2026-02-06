export const DEFAULT_CONFIG = {
  coveredCities: [
    'Barcelona',
    'Hospitalet de Llobregat',
    'Badalona',
    'Terrassa',
    'Sabadell',
    'Mataró',
    'Santa Coloma de Gramenet',
    'Cornellà de Llobregat',
    'Sant Boi de Llobregat',
    'Sant Cugat del Vallès',
  ],
  minBudgets: {
    baño: 8000,
    cocina: 12000,
    integral: 30000,
    pintura: 2000,
    otro: 5000,
  },
  tier5CloseText: 'Gracias por tu interés. Actualmente no podemos atender tu solicitud, pero te recomendamos contactar con profesionales locales en tu zona. ¡Te deseamos mucho éxito con tu proyecto!',
}

export function validateConfig(config) {
  const errors = []

  if (!Array.isArray(config.coveredCities) || config.coveredCities.length === 0) {
    errors.push('Debe haber al menos una ciudad cubierta')
  }

  if (!config.minBudgets || typeof config.minBudgets !== 'object') {
    errors.push('Los presupuestos mínimos son requeridos')
  } else {
    const requiredTypes = ['baño', 'cocina', 'integral']
    for (const type of requiredTypes) {
      if (typeof config.minBudgets[type] !== 'number' || config.minBudgets[type] < 0) {
        errors.push(`Presupuesto mínimo para ${type} debe ser un número positivo`)
      }
    }
  }

  if (!config.tier5CloseText || typeof config.tier5CloseText !== 'string') {
    errors.push('El texto de cierre Tier 5 es requerido')
  }

  return errors
}
