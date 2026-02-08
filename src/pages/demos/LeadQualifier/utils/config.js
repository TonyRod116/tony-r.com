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
    'Esplugues',
    'Gavà',
    'Castelldefels',
    'El Prat',
  ],
  // Presupuestos mínimos - si el cliente dice menos, baja su clasificación
  budgetRanges: {
    baño: { min: 12000 },
    cocina: { min: 18000 },
    integral: { min: 50000 },
    pintura: { min: 2500 },
  },
  // Si el presupuesto aproximado es mayor de este importe, se suman puntos extra al lead
  budgetBonusThreshold: 50000,
}

export function validateConfig(config) {
  const errors = []

  if (!Array.isArray(config.coveredCities) || config.coveredCities.length === 0) {
    errors.push('Debe haber al menos una ciudad cubierta')
  }

  if (!config.budgetRanges || typeof config.budgetRanges !== 'object') {
    errors.push('Los presupuestos mínimos son requeridos')
  }

  return errors
}
