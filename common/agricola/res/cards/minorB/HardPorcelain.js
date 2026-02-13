module.exports = {
  id: "hard-porcelain-b080",
  name: "Hard Porcelain",
  deck: "minorB",
  number: 80,
  type: "minor",
  cost: { clay: 1 },
  category: "Building Resource Provider",
  text: "At any time, you can exchange 2/3/4 clay for 1/2/3 stone.",
  allowsAnytimeExchange: true,
  exchangeOptions: [
    { from: { clay: 2 }, to: { stone: 1 } },
    { from: { clay: 3 }, to: { stone: 2 } },
    { from: { clay: 4 }, to: { stone: 3 } },
  ],
}
