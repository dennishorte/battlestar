export default {
  id: `John Von Neumann`,  // Card names are unique in Innovation
  name: `John Von Neumann`,
  color: `red`,
  age: 8,
  expansion: `figs`,
  biscuits: `hiip`,
  dogmaBiscuit: `i`,
  karma: [
    `If you would draw an {8}, first junk all cards in the {8} deck.`,
    `If you would meld a card, instead meld it and self-execute it.`,
  ],
  karmaImpl: [
    {
      trigger: 'draw',
      kind: 'would-first',
      matches: (game, player, { age, self }) => age === game.getEffectAge(self, 8),
      func: (game, player, { self }) => {
        game.actions.junkDeck(player, game.getEffectAge(self, 8))
      }
    },
    {
      trigger: 'meld',
      kind: 'would-instead',
      matches: () => true,
      func: (game, player, { card, self }) => {
        game.actions.meld(player, card)
        game.aSelfExecute(self, player, card)
      }
    }
  ]
}
