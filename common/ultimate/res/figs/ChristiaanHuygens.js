module.exports = {
  id: `Christiaan Huygens`,  // Card names are unique in Innovation
  name: `Christiaan Huygens`,
  color: `blue`,
  age: 5,
  expansion: `figs`,
  biscuits: `&ssh`,
  dogmaBiscuit: `s`,
  karma: [
    `If you would foreshadow a card, instead meld it if it both has a {i} and its value is no more than two higher than your highest top card. Otherwise, foreshadow it.`
  ],
  karmaImpl: [
    {
      trigger: 'foreshadow',
      kind: 'would-instead',
      matches: () => true,
      func: (game, player, { card }) => {
        const biscuitCondition = card.biscuits.includes('i')
        const ageCondition = card.getAge() <= game.getHighestTopAge(player) + 2

        if (biscuitCondition && ageCondition) {
          game.actions.meld(player, card)
        }
        else {
          game.actions.foreshadow(player, card)
        }
      }
    }
  ]
}
