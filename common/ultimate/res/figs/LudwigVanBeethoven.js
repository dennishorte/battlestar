module.exports = {
  id: `Ludwig Van Beethoven`,  // Card names are unique in Innovation
  name: `Ludwig Van Beethoven`,
  color: `purple`,
  age: 6,
  expansion: `figs`,
  biscuits: `h*7c`,
  dogmaBiscuit: `c`,
  echo: ``,
  karma: [
    `You may issue a Rivalry Decree with any two figures.`,
    `If you would score a card with a {s}, instead return it and all cards from your score pile, then draw and score four {5}.`
  ],
  dogma: [],
  dogmaImpl: [],
  echoImpl: [],
  karmaImpl: [
    {
      trigger: 'decree-for-two',
      decree: 'Rivalry'
    },
    {
      trigger: 'score',
      kind: 'would-instead',
      matches: (game, player, { card }) => card.biscuits.includes('s'),
      func: (game, player, { card }) => {
        const toReturn = game.getCardsByZone(player, 'score')
        toReturn.push(card)
        game.aReturnMany(player, toReturn)
        game.aDrawAndScore(player, game.getEffectAge(this, 5))
        game.aDrawAndScore(player, game.getEffectAge(this, 5))
        game.aDrawAndScore(player, game.getEffectAge(this, 5))
        game.aDrawAndScore(player, game.getEffectAge(this, 5))
      }
    }
  ]
}
