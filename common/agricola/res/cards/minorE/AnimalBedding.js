module.exports = {
  id: "animal-bedding-e012",
  name: "Animal Bedding",
  deck: "minorE",
  number: 12,
  type: "minor",
  cost: {},
  vps: 1,
  prereqs: { grainFields: 1 },
  text: "You can keep 1 additional animal (of the same type) in each of your unfenced stables, and 2 additional animals (of the same type) in each pasture with stable.",
  modifyStableCapacity(game, player, capacity, inPasture) {
    return inPasture ? capacity + 2 : capacity + 1
  },
}
