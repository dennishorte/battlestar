export default {
  name: `Corporations`,
  color: `green`,
  age: 8,
  expansion: `base`,
  biscuits: `hffc`,
  dogmaBiscuit: `f`,
  dogma: [
    `I demand you transfer a top non-green card with a {f} from your board to my score pile! If you do, draw and meld an {8}!`,
    `Draw and meld an {8}`
  ],
  dogmaImpl: [
    (game, player, { leader, self }) => {
      const targets = game
        .cards.tops(player)
        .filter(card => card.biscuits.includes('f'))
        .filter(card => card.color !== 'green')
      const cards = game.actions.chooseAndTransfer(player, targets, game.zones.byPlayer(leader, 'score'))
      if (cards && cards.length > 0) {
        game.actions.drawAndMeld(player, game.getEffectAge(self, 8))
      }
    },
    (game, player, { self }) => {
      game.actions.drawAndMeld(player, game.getEffectAge(self, 8))
    }
  ],
}
