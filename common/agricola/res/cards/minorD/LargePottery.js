module.exports = {
  id: "large-pottery-d060",
  name: "Large Pottery",
  deck: "minorD",
  number: 60,
  type: "minor",
  cost: { clay: 1, stone: 1 },
  vps: 3,
  prereqs: {
    returnMajor: ["pottery"],
  },
  category: "Food Provider",
  text: "At any time, you can use the Large Pottery to convert 1 Clay to 2 Food. At the end of the game, you may spend 3/5/6/7 Clay from your supply to earn 1/2/3/4 bonus points.",
  anytimeConversions: [
    { from: "clay", to: "food", rate: 2 },
  ],
  endGameExchange: {
    resource: 'clay',
    tiers: [
      { cost: 3, vp: 1 },
      { cost: 5, vp: 2 },
      { cost: 6, vp: 3 },
      { cost: 7, vp: 4 },
    ],
  },
}
