module.exports = {
  id: 'cooking-hearth-4',
  name: 'Cooking Hearth',
  deck: 'major',
  type: 'major',
  cost: { clay: 4 },
  victoryPoints: 1,
  upgradesFrom: ['fireplace-2', 'fireplace-3'],
  upgradesTo: [],
  text: [
    'At any time: Vegetable \u2192 3 Food; Sheep \u2192 2 Food; Wild boar \u2192 3 Food; Cattle \u2192 4 Food',
    '"Bake Bread" action: Grain \u2192 3 Food',
  ],
  alternateCost: 'Return a Fireplace',
  abilities: {
    canCook: true,
    canBake: true,
    cookingRates: {
      sheep: 2,
      boar: 3,
      cattle: 4,
      vegetables: 3,
    },
    bakingRate: 3,
  },
}
