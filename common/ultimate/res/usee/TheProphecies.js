const CardBase = require(`../CardBase.js`)
const util = require('../../../lib/util.js')

function Card() {
  this.id = `The Prophecies`  // Card names are unique in Innovation
  this.name = `The Prophecies`
  this.color = `blue`
  this.age = 4
  this.expansion = `usee`
  this.biscuits = `sshs`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Choose to either draw and safeguard a {4}, or draw and reveal a card of value one higher than one of your secrets. If you reveal a red or purple card, meld one of your secrets. If you do, safeguard the drawn card.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const drawAge = game.getEffectAge(this, 4)
      const secretAges = game
        .getCardsByZone(player, 'safe')
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

      const selected = game.aChoose(player, choices)[0]

      if (selected === drawOption) {
        game.aDrawAndSafeguard(player, drawAge)
      }
      else {
        const revealAge = parseInt(selected.selection[0])
        const revealed = game.aDrawAndReveal(player, revealAge)

        if (revealed.color === 'red' || revealed.color === 'purple') {
          const melded = game.aChooseAndMeld(player, game.getCardsByZone(player, 'safe'))
          if (melded) {
            game.aSafeguard(player, revealed)
          }
        }
      }
    },
  ]
  this.echoImpl = []
  this.inspireImpl = []
  this.karmaImpl = []
}

Card.prototype = Object.create(CardBase.prototype)
Object.defineProperty(Card.prototype, `constructor`, {
  value: Card,
  enumerable: false,
  writable: true
})

module.exports = Card
