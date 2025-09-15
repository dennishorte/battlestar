module.exports = {
  name: `Thermometer`,
  color: `blue`,
  age: 5,
  expansion: `echo`,
  biscuits: `h&5s`,
  dogmaBiscuit: `s`,
  echo: [`Meld your bottom green card.`],
  dogma: [
    `Draw and meld a card of value one higher than the value of your top yellow card. If the melded card is yellow, or if Thermometer was foreseen and the melded card is red or purple, repeat this dogma effect.`
  ],
  dogmaImpl: [
    (game, player, { foreseen, self }) => {
      while (true) {
        const yellow = game.getTopCard(player, 'yellow')
        const age = yellow ? yellow.getAge() + 1 : 1
        const melded = game.actions.drawAndMeld(player, age)
        if (melded && melded.color === 'yellow') {
          game.log.add({
            template: 'Melded card was yellow. Repeating'
          })
          continue
        }
        else {
          game.log.addForeseen(foreseen, self)
          if (foreseen && ['red', 'purple'].includes(melded.color)) {
            game.log.add({
              template: 'Melded card was red or purple. Repeating'
            })
            continue
          }
          else {
            break
          }
        }
      }
    }
  ],
  echoImpl: [
    (game, player) => {
      const splay = game.zones.byPlayer(player, 'green').splay
      const toMeld = game.getBottomCard(player, 'green')
      if (toMeld) {
        game.actions.meld(player, toMeld)
        game.zones.byPlayer(player, 'green').splay = splay
      }
    }
  ],
}
