module.exports = {
  id: "earth-oven-d059",
  name: "Earth Oven",
  deck: "minorD",
  number: 59,
  type: "minor",
  cost: {},
  vps: 3,
  prereqs: {
    returnMajor: ["fireplace-2", "fireplace-3"],
  },
  category: "Food Provider",
  text: "At any time, you may convert goods to food as follows: Vegetable → 3 Food; Sheep → 2 Food; Wild boar → 3 Food; Cattle → 3 Food. Whenever you bake bread, you may convert: Grain → 2 Food.",
  countsAsMajorOrMinor: true,
  anytimeConversions: [
    { from: "vegetables", to: "food", rate: 3 },
    { from: "sheep", to: "food", rate: 2 },
    { from: "boar", to: "food", rate: 3 },
    { from: "cattle", to: "food", rate: 3 },
  ],
  bakingConversion: { from: "grain", to: "food", rate: 2 },
}
