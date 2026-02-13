module.exports = {
  id: "kettle-b032",
  name: "Kettle",
  deck: "minorB",
  number: 32,
  type: "minor",
  cost: { clay: 1 },
  prereqs: { grainFields: 1 },
  category: "Food Provider",
  text: "At any time, you can exchange 1/3/5 grain for 3/4/5 food plus 0/1/2 bonus points.",
  allowsAnytimeExchange: true,
  exchangeOptions: [
    { from: { grain: 1 }, to: { food: 3 } },
    { from: { grain: 3 }, to: { food: 4 }, bonusPoints: 1 },
    { from: { grain: 5 }, to: { food: 5 }, bonusPoints: 2 },
  ],
}
