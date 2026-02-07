module.exports = {
  id: "dollys-mother-e084",
  name: "Dolly's Mother",
  deck: "minorE",
  number: 84,
  type: "minor",
  cost: {},
  vps: 1,
  prereqs: { sheep: 1 },
  text: "You only require 1 sheep to breed sheep during the breeding phase of a harvest. This card can hold 1 sheep.",
  holdsAnimals: { sheep: 1 },
  modifySheepBreedingRequirement(_game, _player) {
    return 1
  },
}
