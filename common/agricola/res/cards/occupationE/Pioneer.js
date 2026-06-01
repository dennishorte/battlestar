module.exports = {
  id: "pioneer-e105",
  name: "Pioneer",
  deck: "occupationE",
  number: 105,
  type: "occupation",
  players: "1+",
  text: "When you play this card and each time before you use the most recent action space card, you get 1 building resource of your choice and 1 food.",
  _offerBuildingResource(game, player) {
    const selection = game.actions.choose(player, [
      game.actions.option({ id: 'wood', title: '1 wood' }),
      game.actions.option({ id: 'clay', title: '1 clay' }),
      game.actions.option({ id: 'reed', title: '1 reed' }),
      game.actions.option({ id: 'stone', title: '1 stone' }),
    ], {
      title: 'Pioneer: Choose a building resource',
      min: 1,
      max: 1,
    })
    const choice = selection[0]
    player.addResource(choice.id, 1)
    player.addResource('food', 1)
    game.log.add({
      template: '{player} gets {choice} and 1 food',
      args: { player, choice: choice.title },
    })
  },
  onPlay(game, player) {
    this._offerBuildingResource(game, player)
  },
  matches_onBeforeAction(game, _player, actionId) {
    return game.getActionSpaceRound(actionId) === game.getMostRecentlyRevealedRound()
  },
  onBeforeAction(game, player, _actionId) {
    this._offerBuildingResource(game, player)
  },
}
