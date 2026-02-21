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
      choices.push('Move 1 food to card')
    }
    if (state.food > 0) {
      choices.push('Discard 1 food from card')
    }
    if (choices.length === 0) {
      return
    }
    choices.push('Skip')

    const selection = game.actions.choose(player, choices, {
      title: 'Entrepreneur: Move or discard food?',
      min: 1,
      max: 1,
    })
    if (selection[0] === 'Skip') {
      return
    }

    if (selection[0] === 'Move 1 food to card') {
      player.removeResource('food', 1)
      state.food += 1
      game.log.add({
        template: '{player} moves 1 food to {card} ({total} on card)',
        args: { player, total: state.food , card: this},
      })
    }
    else if (selection[0] === 'Discard 1 food from card') {
      state.food -= 1
      game.log.add({
        template: '{player} discards 1 food from {card} ({total} remaining)',
        args: { player, total: state.food , card: this},
      })
    }

    // Give 1 building resource of a type the player does not have
    const missing = []
    if (player.wood === 0) {
      missing.push('1 wood')
    }
    if (player.clay === 0) {
      missing.push('1 clay')
    }
    if (player.reed === 0) {
      missing.push('1 reed')
    }
    if (player.stone === 0) {
      missing.push('1 stone')
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

    if (resourceChoice === '1 wood') {
      player.addResource('wood', 1)
    }
    else if (resourceChoice === '1 clay') {
      player.addResource('clay', 1)
    }
    else if (resourceChoice === '1 reed') {
      player.addResource('reed', 1)
    }
    else if (resourceChoice === '1 stone') {
      player.addResource('stone', 1)
    }

    game.log.add({
      template: '{player} gets {choice} from {card}',
      args: { player, choice: resourceChoice , card: this},
    })
  },
}
