const util = require('../../../lib/util.js')

module.exports = {
  name: `Tuning Fork`,
  color: `purple`,
  age: 5,
  expansion: `echo`,
  biscuits: `&ssh`,
  dogmaBiscuit: `s`,
  echo: [`Draw a card of a value in any score pile`],
  dogma: [
    `Foreshadow a card from your hand. If you do, draw and reveal a card of the same value, and meld it if it is of higher value than the top card of the same color on your board. If you don't meld it, return it, and you may repeat this effect.`
  ],
  dogmaImpl: [
    (game, player) => {
      while (true) {
        const returned = game.actions.chooseAndForeshadow(player, game.cards.byPlayer(player, 'hand'))[0]
        if (returned) {
          const revealed = game.actions.drawAndReveal(player, returned.getAge())
          if (revealed) {
            const top = game.getTopCard(player, revealed.color)
            if (!top || revealed.getAge() > top.getAge()) {
              game.actions.meld(player, revealed)
              break
            }
            else {
              game.actions.return(player, revealed)
              const repeat = game.actions.chooseYesNo(player, 'Repeat this effect?')
              if (repeat) {
                continue
              }
              else {
                break
              }
            }
          }
        }
      }
    }
  ],
  echoImpl: (game, player) => {
    const scoreAges = game
      .players
      .all()
      .flatMap(p => game.cards.byPlayer(p, 'score'))
      .map(card => card.getAge())
    const distinctAges = util.array.distinct(scoreAges).sort()
    const age = game.actions.chooseAge(player, distinctAges)

    if (age) {
      game.actions.draw(player, { age })
    }
  },
}
