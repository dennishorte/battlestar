module.exports = {
  id: "animal-feeder-c138",
  name: "Animal Feeder",
  deck: "occupationC",
  number: 138,
  type: "occupation",
  players: "3+",
  text: "On the \"Day Laborer\" action space, you also get your choice of 1 sheep or 1 grain. Instead of that good, you can buy 1 wild boar for 1 food or 1 cattle for 2 food.",
  onAction(game, player, actionId) {
    if (actionId === 'day-laborer') {
      game.actions.offerAnimalFeederChoice(player, this)
    }
  },
}
