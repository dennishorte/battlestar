module.exports = {
  name: `Jet`,
  color: `red`,
  age: 9,
  expansion: `echo`,
  biscuits: `h&ia`,
  dogmaBiscuit: `i`,
  echo: `Meld a card from your hand.`,
  dogma: [
    `I demand you return your top card of the color I melded due to Jet's echo effect.`
  ],
  dogmaImpl: [
    (game, player) => {
      const melded = game.state.dogmaInfo.jet
      if (melded) {
        const toReturn = game.getTopCard(player, melded.color)
        if (toReturn) {
          game.actions.return(player, toReturn)
        }
        else {
          game.log.add({
            template: '{player} has no {color} top card',
            args: {
              player,
              color: melded.color
            }
          })
        }
      }

      else {
        game.log.add({
          template: 'No card was melded due to the echo effect.'
        })
      }
    }
  ],
  echoImpl: (game, player) => {
    if (!game.state.dogmaInfo.jet) {
      game.state.dogmaInfo.jet = ''
    }

    const cards = game.actions.chooseAndMeld(player, game.cards.byPlayer(player, 'hand'))
    if (player === game.getPlayerByCard(this) && cards && cards.length > 0) {
      game.state.dogmaInfo.jet = cards[0]
    }
  },
}
