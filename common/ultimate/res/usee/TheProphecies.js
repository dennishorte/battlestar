const util = require('../../../lib/util.js')

module.exports = {
  name: `The Prophecies`,
  color: `blue`,
  age: 4,
  expansion: `usee`,
  biscuits: `sshs`,
  dogmaBiscuit: `s`,
  dogma: [
    `Choose to either draw and safeguard a {4}, or draw and reveal a card of value one higher than one of your secrets. If you reveal a red or purple card, meld one of your secrets. If you do, safeguard the drawn card.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const drawAge = game.getEffectAge(self, 4)
      const secretAges = game
        .cards.byPlayer(player, 'safe')
        .map(c => c.getAge())
      const revealChoices = util.array.distinct(secretAges).sort().map(age => age + 1)

      const drawOption = 'Draw and safeguard a ' + drawAge
      const choices = [drawOption]
      if (revealChoices.length > 0) {
        choices.push({
          title: 'Draw and reveal',
          choices: revealChoices,
          min: 0,
        })
      }

      const selected = game.actions.choose(player, choices)[0]

      if (selected === drawOption) {
        game.aDrawAndSafeguard(player, drawAge)
      }
      else {
        const revealAge = parseInt(selected.selection[0])
        const revealed = game.actions.drawAndReveal(player, revealAge)

        if (revealed.color === 'red' || revealed.color === 'purple') {
          const melded = game.actions.chooseAndMeld(player, game.cards.byPlayer(player, 'safe'))
          if (melded) {
            game.aSafeguard(player, revealed)
          }
        }
      }
    },
  ],
}
