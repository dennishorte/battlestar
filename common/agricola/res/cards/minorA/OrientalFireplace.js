module.exports = {
  id: "oriental-fireplace-a060",
  name: "Oriental Fireplace",
  deck: "minorA",
  number: 60,
  type: "minor",
  cost: {},
  vps: 1,
  prereqs: { returnFireplaceOrCookingHearth: true },
  category: "Food Provider",
  text: "At any time, you may convert goods to food as follows: Vegetable → 4 food; Sheep → 3 food; Cattle → 5 food. Whenever you bake bread, you may convert: Grain → 2 food.",
  countsAsMajorOrMinor: true,
  anytimeConversions: [
    { from: "vegetables", to: "food", rate: 4 },
    { from: "sheep", to: "food", rate: 3 },
    { from: "cattle", to: "food", rate: 5 },
  ],
  bakingConversion: { from: "grain", to: "food", rate: 2 },
}
