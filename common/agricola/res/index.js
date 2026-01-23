// Agricola game resources

module.exports = {
  // Action spaces available from the start of the game
  baseActions: [
    { id: 'build-room', name: 'Build Room', description: 'Build 1 room and/or build 1 stable' },
    { id: 'starting-player', name: 'Starting Player', description: 'Become starting player and take 1 food' },
    { id: 'take-grain', name: 'Take Grain', description: 'Take 1 grain' },
    { id: 'plow-field', name: 'Plow Field', description: 'Plow 1 field' },
    { id: 'occupation', name: 'Occupation', description: 'Play 1 occupation card' },
    { id: 'day-laborer', name: 'Day Laborer', description: 'Take 2 food' },
    { id: 'take-wood', name: 'Take Wood', description: 'Take accumulated wood' },
    { id: 'take-clay', name: 'Take Clay', description: 'Take accumulated clay' },
    { id: 'take-reed', name: 'Take Reed', description: 'Take accumulated reed' },
    { id: 'fishing', name: 'Fishing', description: 'Take accumulated food from fishing' },
  ],

  // Actions revealed each round (stages 1-6)
  roundActions: {
    stage1: [
      { id: 'sow-bake', name: 'Sow and/or Bake Bread', round: 1 },
      { id: 'take-sheep', name: 'Take Sheep', round: 2 },
      { id: 'fencing', name: 'Fencing', round: 3 },
      { id: 'major-improvement', name: 'Major Improvement', round: 4 },
    ],
    stage2: [
      { id: 'after-family-growth', name: 'Family Growth (after renovation)', round: 5 },
      { id: 'take-stone', name: 'Take Stone', round: 6 },
      { id: 'renovate', name: 'Renovation', round: 7 },
    ],
    stage3: [
      { id: 'take-vegetables', name: 'Take Vegetables', round: 8 },
      { id: 'take-boar', name: 'Take Wild Boar', round: 9 },
    ],
    stage4: [
      { id: 'take-cattle', name: 'Take Cattle', round: 10 },
      { id: 'take-stone-2', name: 'Take Stone', round: 11 },
    ],
    stage5: [
      { id: 'urgent-family-growth', name: 'Urgent Family Growth', round: 12 },
      { id: 'plow-sow', name: 'Plow and Sow', round: 13 },
    ],
    stage6: [
      { id: 'renovate-fencing', name: 'Renovation and Fencing', round: 14 },
    ],
  },

  // Major improvements
  majorImprovements: [
    { id: 'fireplace-2', name: 'Fireplace', cost: { clay: 2 } },
    { id: 'fireplace-3', name: 'Fireplace', cost: { clay: 3 } },
    { id: 'cooking-hearth-4', name: 'Cooking Hearth', cost: { clay: 4 } },
    { id: 'cooking-hearth-5', name: 'Cooking Hearth', cost: { clay: 5 } },
    { id: 'well', name: 'Well', cost: { wood: 1, stone: 3 } },
    { id: 'clay-oven', name: 'Clay Oven', cost: { clay: 3, stone: 1 } },
    { id: 'stone-oven', name: 'Stone Oven', cost: { clay: 1, stone: 3 } },
    { id: 'joinery', name: 'Joinery', cost: { wood: 2, stone: 2 } },
    { id: 'pottery', name: 'Pottery', cost: { clay: 2, stone: 2 } },
    { id: 'basket-weavers', name: "Basket-maker's Workshop", cost: { reed: 2, stone: 2 } },
  ],

  // Resource accumulation rates per round
  accumulation: {
    'take-wood': 3,
    'take-clay': 1,
    'take-reed': 1,
    'fishing': 1,
    'take-sheep': 1,
    'take-boar': 1,
    'take-cattle': 1,
    'take-stone': 1,
    'take-stone-2': 1,
  },
}
