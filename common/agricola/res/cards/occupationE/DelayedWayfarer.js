module.exports = {
  id: "delayed-wayfarer-e125",
  name: "Delayed Wayfarer",
  deck: "occupationE",
  number: 125,
  type: "occupation",
  players: "1+",
  text: "When you play this card, you immediately get 1 building resource of your choice and, once all people have been placed this round, you can place a person from your supply.",
  onPlay(game, player) {
    const choices = [
      game.actions.option({ id: 'wood', title: '1 wood' }),
      game.actions.option({ id: 'clay', title: '1 clay' }),
      game.actions.option({ id: 'reed', title: '1 reed' }),
      game.actions.option({ id: 'stone', title: '1 stone' }),
    ]
    const selection = game.actions.choose(player, choices, {
      title: 'Delayed Wayfarer: Choose a building resource',
      min: 1,
      max: 1,
    })
    const choice = selection[0]
    player.addResource(choice.id, 1)
    game.log.add({
      template: '{player} gets {choice} from {card}',
      args: { player, choice: choice.title , card: this},
    })
    game.state.delayedWayfarerPlayer = player.name
  },
  onWorkPhaseEnd(game, player) {
    if (game.state.delayedWayfarerPlayer === player.name) {
      game.state.delayedWayfarerPlayer = null
      const selection = game.actions.choose(player, [
        game.actions.option({ id: 'place', title: 'Place person' }),
        game.actions.option({ id: 'skip', title: 'Skip' }),
      ], {
        title: 'Delayed Wayfarer: Place a person from your supply?',
        min: 1,
        max: 1,
      })
      if (selection[0].id === 'place') {
        game.log.add({
          template: '{player} places an extra person from {card}',
          args: { player , card: this},
        })
        game.playerTurn(player, { skipUseWorker: true })
      }
    }
  },
}
