module.exports = {
  id: `Christiaan Huygens`,  // Card names are unique in Innovation
  name: `Christiaan Huygens`,
  color: `blue`,
  age: 5,
  expansion: `figs`,
  biscuits: `&ssh`,
  dogmaBiscuit: `s`,
  echo: `Draw and foreshadow a {7}, {8}, {9}, or {0}.`,
  karma: [
    `If you would foreshadow a card, instead meld it if it both has a {i} and its value is no more than two higher than your highest top card. Otherwise, foreshadow it.`
  ],
  dogma: [],
  dogmaImpl: [],
  echoImpl: (game, player) => {
    const age = game.aChooseAge(player, [
      game.getEffectAge(this, 7),
      game.getEffectAge(this, 8),
      game.getEffectAge(this, 9),
      game.getEffectAge(this, 10),
    ])
    game.aDrawAndForeshadow(player, age)
  },
  karmaImpl: [
    {
      trigger: 'foreshadow',
      kind: 'would-instead',
      matches: () => true,
      func: (game, player, { card }) => {
        const biscuitCondition = card.biscuits.includes('i')
        const ageCondition = card.getAge() <= game.getHighestTopAge(player) + 2

        if (biscuitCondition && ageCondition) {
          game.aMeld(player, card)
        }
        else {
          game.aForeshadow(player, card)
        }
      }
    }
  ]
}
