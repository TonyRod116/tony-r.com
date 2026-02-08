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
  budgetRanges: {
    baño: { min: 5000 },
    cocina: { min: 8000 },
    integral: { min: 50000 },
    pintura: { min: 2500 },
  },
  budgetBonusThreshold: 50000,
}

export function validateConfig(config, t) {
  const errors = []

  if (!Array.isArray(config.coveredCities) || config.coveredCities.length === 0) {
    errors.push(t('demos.leadQualifier.validation.citiesRequired'))
  }

  if (!config.budgetRanges || typeof config.budgetRanges !== 'object') {
    errors.push(t('demos.leadQualifier.validation.budgetRequired'))
  }

  return errors
}
