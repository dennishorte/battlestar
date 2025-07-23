module.exports = {
  name: `Fingerprints`,
  color: `yellow`,
  age: 2,
  expansion: `usee`,
  biscuits: `lshl`,
  dogmaBiscuit: `l`,
  dogma: [
    `You may splay your red or yellow cards left.`,
    `Safeguard an available achievement of value equal to the number of splayed colors on your board. Transfer a card of that value in your hand to any board.`
  ],
  dogmaImpl: [
    (game, player) => {
      game.aChooseAndSplay(player, ['red', 'yellow'], 'left')
    },
    (game, player) => {
      const splayedColors = game
        .utilColors()
        .filter(color => game.zones.byPlayer(player, color).splay !== 'none')
        .length

      game.actions.safeguardAvailableAchievement(player, splayedColors)

      const choices = game
        .cards.byPlayer(player, 'hand')
        .filter(card => card.age === splayedColors)

      if (choices.length > 0) {
        const transferTo = game.actions.choosePlayer(player, game.players.all(), {
          title: 'Choose a player to transfer card to'
        })
        const card = game.actions.chooseCard(player, choices, {
          title: 'Choose a card to transfer'
        })
        game.aTransfer(player, card, game.zones.byPlayer(transferTo, card.color))
      }
      else {
        game.log.addNoEffect()
      }
    }
  ],
}
