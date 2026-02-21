module.exports = {
  id: "delayed-wayfarer-e125",
  name: "Delayed Wayfarer",
  deck: "occupationE",
  number: 125,
  type: "occupation",
  players: "1+",
  text: "When you play this card, you immediately get 1 building resource of your choice and, once all people have been placed this round, you can place a person from your supply.",
  onPlay(game, player) {
    const selection = game.actions.choose(player, ['1 wood', '1 clay', '1 reed', '1 stone'], {
      title: 'Delayed Wayfarer: Choose a building resource',
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
    game.log.add({
      template: '{player} gets {choice} from {card}',
      args: { player, choice , card: this},
    })
    game.state.delayedWayfarerPlayer = player.name
  },
  onWorkPhaseEnd(game, player) {
    if (game.state.delayedWayfarerPlayer === player.name) {
      game.state.delayedWayfarerPlayer = null
      const selection = game.actions.choose(player, ['Place person', 'Skip'], {
        title: 'Delayed Wayfarer: Place a person from your supply?',
        min: 1,
        max: 1,
      })
      if (selection[0] === 'Place person') {
        game.log.add({
          template: '{player} places an extra person from {card}',
          args: { player , card: this},
        })
        game.playerTurn(player, { skipUseWorker: true })
      }
    }
  },
}
