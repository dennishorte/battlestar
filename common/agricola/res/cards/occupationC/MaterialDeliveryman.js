module.exports = {
  id: "material-deliveryman-c163",
  name: "Material Deliveryman",
  deck: "occupationC",
  number: 163,
  type: "occupation",
  players: "4+",
  text: "Each time any player (including you) takes 5/6/7/8+ goods from an accumulation space, you get 1 wood/clay/reed/stone from the general supply.",
  onAnyAction(game, actingPlayer, actionId, cardOwner, resources) {
    if (game.isAccumulationSpace(actionId)) {
      const totalGoods = Object.values(resources || {}).reduce((a, b) => a + b, 0)
      let bonus = null
      if (totalGoods >= 8) {
        bonus = 'stone'
      }
      else if (totalGoods >= 7) {
        bonus = 'reed'
      }
      else if (totalGoods >= 6) {
        bonus = 'clay'
      }
      else if (totalGoods >= 5) {
        bonus = 'wood'
      }
      if (bonus) {
        cardOwner.addResource(bonus, 1)
        game.log.add({
          template: '{player} gets 1 {resource} from Material Deliveryman',
          args: { player: cardOwner, resource: bonus },
        })
      }
    }
  },
}
