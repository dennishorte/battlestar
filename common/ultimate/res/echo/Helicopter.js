module.exports = {
  name: `Helicopter`,
  color: `red`,
  age: 9,
  expansion: `echo`,
  biscuits: `fffh`,
  dogmaBiscuit: `f`,
  echo: ``,
  dogma: [
    `Transfer a top card other than Helicopter from any player's board to its owner's score pile. You may return a card from your hand which shares an icon with the trasnferred card. If you do, repeat this dogma effect.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      while (true) {
        const choices = game
          .players.all()
          .flatMap(player => game.cards.tops(player))
          .filter(c => c !== self)
        const card = game.actions.chooseCard(player, choices)

        if (card) {
          game.actions.transfer(player, card, game.zones.byPlayer(card.owner, 'score'))

          const toReturn = game.actions.chooseCard(player, game.cards.byPlayer(player, 'hand'), {
            min: 0,
            max: 1,
            filter: c => card.checkSharesBiscuit(c),
          })
          if (toReturn) {
            game.actions.return(player, toReturn)
            continue
          }
        }

        break
      }
    }
  ],
  echoImpl: [],
}
