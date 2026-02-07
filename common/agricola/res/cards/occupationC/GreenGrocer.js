module.exports = {
  id: "green-grocer-c103",
  name: "Green Grocer",
  deck: "occupationC",
  number: 103,
  type: "occupation",
  players: "1+",
  text: "At the start of each round, you can make exactly one exchange: 1 Cattle/Vegetable for 1 Vegetable/Cattle; 2 Sheep for 1 Vegetable; 1 Vegetable for 2 Sheep; 2 Food for 1 Grain; 1 Grain for 2 Food.",
  onRoundStart(game, player) {
    game.actions.offerGreenGrocerExchange(player, this)
  },
}
