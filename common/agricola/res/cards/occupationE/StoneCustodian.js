module.exports = {
  id: "stone-custodian-e158",
  name: "Stone Custodian",
  deck: "occupationE",
  number: 158,
  type: "occupation",
  players: "1+",
  text: "At the end of each work phase, you get 1 food for each stone accumulation space with stone on it.",
  onWorkPhaseEnd(game, player) {
    const stoneSpacesWithStone = game.getStoneAccumulationSpacesWithStone()
    if (stoneSpacesWithStone > 0) {
      player.addResource('food', stoneSpacesWithStone)
      game.log.add({
        template: '{player} gets {amount} food from {card}',
        args: { player, amount: stoneSpacesWithStone , card: this},
      })
    }
  },
}
