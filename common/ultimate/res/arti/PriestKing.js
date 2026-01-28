module.exports = {
  name: `Priest-King`,
  color: `green`,
  age: 1,
  expansion: `arti`,
  biscuits: `khkk`,
  dogmaBiscuit: `k`,
  dogma: [
    `Score a card from your hand. If you have a top card matching its color, super-execute that top card if it is your turn, otherwise self-execute it.`,
  ],
  dogmaImpl: [
    (game, player) => {
      const cards = game.actions.chooseAndScore(player, game.cards.byPlayer(player, 'hand'))
      if (cards && cards.length > 0) {
        const card = cards[0]
        const top = game.cards.top(player, card.color)
        if (top) {
          if (player.name === game.players.current().name) {
            game.actions.superExecute(player, top)
          }
          else {
            game.actions.selfExecute(player, top)
          }
        }
        else {
          game.log.add({
            template: '{player} has no {color} cards',
            args: { player, color: card.color }
          })
        }
      }
    },
  ],
}
