module.exports = {
  id: 'fireplace-4',
  name: 'Fireplace',
  deck: 'major',
  type: 'major',
  cost: { clay: 4 },
  victoryPoints: 1,
  expansion: '5-6',
  baseVersions: ['fireplace-2', 'fireplace-3'],
  upgradesTo: ['cooking-hearth-4', 'cooking-hearth-5', 'cooking-hearth-6'],
  text: [
    'At any time: Vegetable \u2192 2 Food; Sheep \u2192 2 Food; Wild boar \u2192 2 Food; Cattle \u2192 3 Food',
    '"Bake Bread" action: Grain \u2192 2 Food',
  ],
  bakingConversion: { from: 'grain', to: 'food', rate: 2 },
  cookingRates: {
    sheep: 2,
    boar: 2,
    cattle: 3,
    vegetables: 2,
  },
}
