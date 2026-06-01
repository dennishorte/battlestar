module.exports = {
  id: "earthenware-potter-d099",
  name: "Earthenware Potter",
  deck: "occupationD",
  number: 99,
  type: "occupation",
  players: "1+",
  text: "If you play this card in round 4 or before, after the final harvest, you get 1 bonus point for each person for which you then pay 1 clay.",
  onPlay(game, _player) {
    game.cardState(this.id).playedEarly = game.state.round <= 4
  },
  onAfterFinalHarvest(game, player) {
    if (!game.cardState(this.id).playedEarly) {
      return
    }
    if (player.clay < 1) {
      return
    }
    const maxPayable = Math.min(player.clay, player.getFamilySize())
    const choices = []
    for (let i = maxPayable; i >= 1; i--) {
      choices.push(game.actions.option({ id: `pay-${i}`, title: `Pay ${i} clay for ${i} bonus points` }))
    }
    choices.push(game.actions.option({ id: 'skip', title: 'Skip' }))
    const selection = game.actions.choose(player, choices, {
      title: 'Earthenware Potter',
      min: 1,
      max: 1,
    })
    if (selection[0].id !== 'skip') {
      const amount = parseInt(selection[0].id.replace(/^pay-/, ''))
      player.removeResource('clay', amount)
      player.addBonusPoints(amount)
      game.log.add({
        template: '{player} pays {amount} clay for {amount} bonus points ({card})',
        args: { player, amount , card: this},
      })
    }
  },
}
