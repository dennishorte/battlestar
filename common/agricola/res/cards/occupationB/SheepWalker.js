module.exports = {
  id: "sheep-walker-b104",
  name: "Sheep Walker",
  deck: "occupationB",
  number: 104,
  type: "occupation",
  players: "1+",
  text: "At any time, you can exchange 1 sheep for either 1 wild boar, 1 vegetable, or 1 stone.",
  allowsAnytimeExchange: true,
  exchangeOptions: [
    {
      from: { sheep: 1 },
      to: { boar: 1 },
    },
    {
      from: { sheep: 1 },
      to: { vegetables: 1 },
    },
    {
      from: { sheep: 1 },
      to: { stone: 1 },
    },
  ],
}
