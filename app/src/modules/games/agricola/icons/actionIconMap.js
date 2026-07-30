/**
 * Maps Agricola action space IDs to thematic icon keys
 * used by AgricolaActionIcon.
 */
const ACTION_ICON_MAP = {
  // Base
  'build-room-stable': 'expansion',
  'starting-player': 'meeting',
  'take-grain': 'grain-seeds',
  'plow-field': 'plow',
  occupation: 'occupation',
  'day-laborer': 'laborer',
  'take-wood': 'forest',
  'take-clay': 'clay-pit',
  'take-reed': 'reed-bank',
  fishing: 'fishing',

  // Round cards
  'sow-bake': 'sow-bake',
  'take-sheep': 'sheep',
  fencing: 'fencing',
  'major-minor-improvement': 'improvement',
  'family-growth-minor': 'family',
  'take-stone-1': 'quarry',
  'renovation-improvement': 'renovation',
  'take-vegetable': 'vegetable-seeds',
  'take-boar': 'boar',
  'take-cattle': 'cattle',
  'take-stone-2': 'quarry',
  'family-growth-urgent': 'family',
  'plow-sow': 'cultivation',
  'renovation-fencing': 'renovation',

  // 3–4 player
  grove: 'forest',
  hollow: 'clay-pit',
  'resource-market': 'market',
  'lessons-3': 'occupation',
  'lessons-4': 'occupation',
  copse: 'forest',
  'traveling-players': 'traveling',

  // 5–6 player
  'lessons-5': 'occupation',
  'copse-5': 'forest',
  'house-building': 'house',
  'traveling-players-5': 'traveling',
  'lessons-5b': 'occupation',
  'modest-wish-for-children': 'family',
  'grove-5': 'forest',
  'hollow-5': 'clay-pit',
  'resource-market-5': 'market',

  // 6-player only
  'riverbank-forest': 'riverbank',
  'grove-6': 'forest',
  'hollow-6': 'clay-pit',
  'resource-market-6': 'market',
  'animal-market': 'animal-market',
  'farm-supplies': 'farm-supplies',
  'building-supplies': 'building-supplies',
  corral: 'corral',
  'side-job': 'side-job',
  'improvement-6': 'improvement',
}

export function getActionIconType(actionId) {
  if (!actionId) {
    return 'card'
  }
  return ACTION_ICON_MAP[actionId] || 'card'
}

export const ACTION_ICON_TYPES = [
  'expansion',
  'meeting',
  'grain-seeds',
  'plow',
  'occupation',
  'laborer',
  'forest',
  'clay-pit',
  'reed-bank',
  'fishing',
  'sow-bake',
  'sheep',
  'fencing',
  'improvement',
  'family',
  'quarry',
  'renovation',
  'vegetable-seeds',
  'boar',
  'cattle',
  'cultivation',
  'market',
  'traveling',
  'house',
  'riverbank',
  'animal-market',
  'farm-supplies',
  'building-supplies',
  'corral',
  'side-job',
  'card',
]

export const RESOURCE_TYPES = [
  'wood',
  'clay',
  'reed',
  'stone',
  'food',
  'grain',
  'vegetables',
  'sheep',
  'boar',
  'cattle',
  'fences',
  'stables',
  'package',
]
