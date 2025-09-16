module.exports = {
  id: `Sejong the Great`,  // Card names are unique in Innovation
  name: `Sejong the Great`,
  color: `blue`,
  age: 3,
  expansion: `figs`,
  biscuits: `&3hs`,
  dogmaBiscuit: `s`,
  echo: `Draw and meld a {4}.`,
  karma: [
    `You may issue an advancement decree with any two figures.`,
    `If you would meld a blue card of value above 3, instead return it and draw and meld a card of value one higher.`
  ],
  dogma: [],
  dogmaImpl: [],
  echoImpl: (game, player) => {
    game.aDrawAndMeld(player, game.getEffectAge(this, 4))
  },
  karmaImpl: [
    {
      trigger: 'decree-for-two',
      decree: 'Advancement',
    },
    {
      trigger: 'meld',
      kind: 'would-instead',
      matches: (game, player, { card }) => card.color === 'blue' && card.getAge() > 3,
      func: (game, player, { card }) => {
        game.aReturn(player, card)
        game.aDrawAndMeld(player, card.getAge() + 1)
      }
    }
  ]
}
