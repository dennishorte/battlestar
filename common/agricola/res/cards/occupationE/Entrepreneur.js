module.exports = {
  id: "entrepreneur-e162",
  name: "Entrepreneur",
  deck: "occupationE",
  number: 162,
  type: "occupation",
  players: "1+",
  text: "At the start of each round, you can move 1 food to this card or discard 1 food from it. If you do either, you get 1 building resource of a type you currently do not have.",
  onPlay(game, _player) {
    game.cardState(this.id).food = 0
  },
  onRoundStart(game, player) {
    const state = game.cardState(this.id)
    const choices = []
    if (player.food > 0) {
      choices.push(game.actions.option({ id: 'move', title: 'Move 1 food to card' }))
    }
    if (state.food > 0) {
      choices.push(game.actions.option({ id: 'discard', title: 'Discard 1 food from card' }))
    }
    if (choices.length === 0) {
      return
    }
    choices.push(game.actions.option({ id: 'skip', title: 'Skip' }))

    const selection = game.actions.choose(player, choices, {
      title: 'Entrepreneur: Move or discard food?',
      min: 1,
      max: 1,
    })
    if (selection[0].id === 'skip') {
      return
    }

    if (selection[0].id === 'move') {
      player.removeResource('food', 1)
      state.food += 1
      game.log.add({
        template: '{player} moves 1 food to {card} ({total} on card)',
        args: { player, total: state.food , card: this},
      })
    }
    else if (selection[0].id === 'discard') {
      state.food -= 1
      game.log.add({
        template: '{player} discards 1 food from {card} ({total} remaining)',
        args: { player, total: state.food , card: this},
      })
    }

    // Give 1 building resource of a type the player does not have
    const missing = []
    if (player.wood === 0) {
      missing.push(game.actions.option({ id: 'wood', title: '1 wood' }))
    }
    if (player.clay === 0) {
      missing.push(game.actions.option({ id: 'clay', title: '1 clay' }))
    }
    if (player.reed === 0) {
      missing.push(game.actions.option({ id: 'reed', title: '1 reed' }))
    }
    if (player.stone === 0) {
      missing.push(game.actions.option({ id: 'stone', title: '1 stone' }))
    }

    if (missing.length === 0) {
      return
    }

    let resourceChoice
    if (missing.length === 1) {
      resourceChoice = missing[0]
    }
    else {
      const resSel = game.actions.choose(player, missing, {
        title: 'Entrepreneur: Choose a building resource you do not have',
        min: 1,
        max: 1,
      })
      resourceChoice = resSel[0]
    }

    player.addResource(resourceChoice.id, 1)

    game.log.add({
      template: '{player} gets {choice} from {card}',
      args: { player, choice: resourceChoice.title , card: this},
    })
  },
}
