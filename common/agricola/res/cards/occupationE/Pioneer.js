module.exports = {
  id: "pioneer-e105",
  name: "Pioneer",
  deck: "occupationE",
  number: 105,
  type: "occupation",
  players: "1+",
  text: "When you play this card and each time before you use the most recent action space card, you get 1 building resource of your choice and 1 food.",
  _offerBuildingResource(game, player) {
    const selection = game.actions.choose(player, ['1 wood', '1 clay', '1 reed', '1 stone'], {
      title: 'Pioneer: Choose a building resource',
      min: 1,
      max: 1,
    })
    const choice = selection[0]
    if (choice === '1 wood') {
      player.addResource('wood', 1)
    }
    else if (choice === '1 clay') {
      player.addResource('clay', 1)
    }
    else if (choice === '1 reed') {
      player.addResource('reed', 1)
    }
    else if (choice === '1 stone') {
      player.addResource('stone', 1)
    }
    player.addResource('food', 1)
    game.log.add({
      template: '{player} gets {choice} and 1 food from {card}',
      args: { player, choice , card: this},
    })
  },
  onPlay(game, player) {
    this._offerBuildingResource(game, player)
  },
  onBeforeAction(game, player, actionId) {
    if (game.getActionSpaceRound(actionId) === game.getMostRecentlyRevealedRound()) {
      this._offerBuildingResource(game, player)
    }
  },
}
