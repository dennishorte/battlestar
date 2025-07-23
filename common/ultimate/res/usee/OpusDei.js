module.exports = {
  name: `Opus Dei`,
  color: `purple`,
  age: 8,
  expansion: `usee`,
  biscuits: `sshs`,
  dogmaBiscuit: `s`,
  dogma: [
    `Reveal the highest card in your score pile. If you do, splay your cards of the revealed card's color up, and safeguard that card.`,
    `Draw an {8} for every color on your board splayed up.`
  ],
  dogmaImpl: [
    (game, player) => {
      const highestScoreCards = game.utilHighestCards(game.cards.byPlayer(player, 'score'))

      const card = game.actions.chooseAndReveal(player, highestScoreCards)[0]

      if (card) {
        game.aSplay(player, card.color, 'up')
        game.actions.safeguard(player, card)
      }
    },
    (game, player, { self }) => {
      const splayColors = game.utilColors().filter(color => game.zones.byPlayer(player, color).splay === 'up')

      splayColors.forEach(() => {
        game.aDraw(player, { age: game.getEffectAge(self, 8) })
      })
    }
  ],
}
