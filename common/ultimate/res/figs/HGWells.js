module.exports = {
  id: `H.G. Wells`,  // Card names are unique in Innovation
  name: `H.G. Wells`,
  color: `purple`,
  age: 8,
  expansion: `figs`,
  biscuits: `l*hl`,
  dogmaBiscuit: `l`,
  echo: ``,
  karma: [
    `If you would foreshadow a card, instead meld it, execute its non-demand Dogma effects for yourself only, and remove it from the game if it is still a top card on your board.`
  ],
  dogma: [],
  dogmaImpl: [],
  echoImpl: [],
  karmaImpl: [
    {
      trigger: 'foreshadow',
      kind: 'would-instead',
      matches: () => true,
      func: (game, player, { card }) => {
        game.aMeld(player, card)
        game.aCardEffects(player, card, 'dogma')
        const topCard = game.getTopCard(player, card.color)
        if (topCard === card) {
          game.aRemove(player, card)
        }
        else {
          game.log.add({
            template: "{card} is no longer a top card on {player}'s board",
            args: { card, player }
          })
        }
      }
    }
  ]
}
