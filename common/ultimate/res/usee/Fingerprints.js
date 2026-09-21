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
      game.actions.chooseAndSplay(player, ['red', 'yellow'], 'left')
    },
    (game, player) => {
      const splayedColors = game
        .util.colors()
        .filter(color => game.zones.byPlayer(player, color).splay !== 'none')
        .length

      game.actions.safeguardAvailableAchievement(player, splayedColors)

      const hand = game.cards.byPlayer(player, 'hand')
      const card = game.actions.chooseCard(player, hand, {
        title: 'Choose a card to transfer',
        filter: card => card.age === splayedColors,
      })
      if (card) {
        const transferTo = game.actions.choosePlayer(player, game.players.all(), {
          title: 'Choose a player to transfer card to'
        })
        game.actions.transfer(player, card, game.zones.byPlayer(transferTo, card.color))
      }
      else {
        game.log.addNoEffect()
      }
    }
  ],
}
