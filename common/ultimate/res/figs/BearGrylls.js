module.exports = {
  id: `Bear Grylls`,  // Card names are unique in Innovation
  name: `Bear Grylls`,
  color: `green`,
  age: 11,
  expansion: `figs`,
  biscuits: `hllp`,
  dogmaBiscuit: `l`,
  karma: [
    `When you meld this card, junk all cards that are not achievements or in decks. Introduce the {z} deck. Draw a {z}.`
  ],
  karmaImpl: [
    {
      trigger: 'when-meld',
      matches: () => true,
      func: (game, player) => {
        game.log.add({
          template: 'Back to nature. Survival mode!',
        })

        game.log.indent()
        const zones = ['red', 'yellow', 'green', 'blue', 'purple', 'hand', 'score', 'forecast', 'museum', 'safe', 'artifact']
        const toRemove = game
          .players
          .all()
          .flatMap(player => zones.flatMap(name => game.cards.byPlayer(player, name)))
        game.actions.junkMany(player, toRemove, { ordered: true })
        game.log.outdent()

        game.state.useAgeZero = true

        game.actions.draw(player, { age: 0 })
      }
    },
  ]
}
