export default {
  name: `Banking`,
  color: `green`,
  age: 5,
  expansion: `base`,
  biscuits: `fchc`,
  dogmaBiscuit: `c`,
  dogma: [
    `I demand you transfer a top non-green card with a {f} from your board to my board. If you do, draw and score a {5}.`,
    `You may splay your green cards right.`
  ],
  dogmaImpl: [
    (game, player, { leader, self }) => {
      const choices = game
        .cards.tops(player)
        .filter(card => card !== undefined)
        .filter(card => card.color !== 'green')
        .filter(card => card.biscuits.includes('f'))

      const card = game.actions.chooseCard(player, choices)
      if (card) {
        game.actions.transfer(player, card, game.zones.byPlayer(leader, card.color))
        game.actions.drawAndScore(player, game.getEffectAge(self, 5))
      }
      else {
        game.log.addNoEffect()
      }
    },

    (game, player) => {
      game.actions.chooseAndSplay(player, ['green'], 'right')
    }
  ],
}
