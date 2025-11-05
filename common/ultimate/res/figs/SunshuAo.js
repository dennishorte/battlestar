module.exports = {
  id: `Sunshu Ao`,  // Card names are unique in Innovation
  name: `Sunshu Ao`,
  color: `yellow`,
  age: 1,
  expansion: `figs`,
  biscuits: `h1*k`,
  dogmaBiscuit: `k`,
  echo: ``,
  karma: [
    `If you would tuck a yellow card, instead meld it and execute all of the non-demand Dogma effects on it for yourself only, then return it to your hand if it is still a top card on your board.`
  ],
  dogma: [],
  dogmaImpl: [],
  echoImpl: [],
  karmaImpl: [
    {
      trigger: 'tuck',
      kind: 'would-instead',
      matches: (game, player, { card }) => card.color === 'yellow',
      func: (game, player, { card }) => {
        game.actions.meld(player, card)
        game.aCardEffects(player, card, 'dogma')

        if (card.isTopCardStrict()) {
          game.log.add({
            template: '{player} returns {card} to hand',
            args: { player, card }
          })
          game.mMoveCardTo(card, game.zones.byPlayer(player, 'hand'))
        }
      },
    }
  ]
}
