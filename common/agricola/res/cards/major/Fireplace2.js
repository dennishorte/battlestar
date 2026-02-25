module.exports = {
  id: 'fireplace-2',
  name: 'Fireplace',
  deck: 'major',
  type: 'major',
  cost: { clay: 2 },
  victoryPoints: 1,
  upgradesTo: ['cooking-hearth-4', 'cooking-hearth-5'],
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
