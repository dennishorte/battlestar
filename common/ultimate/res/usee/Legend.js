const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Legend`  // Card names are unique in Innovation
  this.name = `Legend`
  this.color = `purple`
  this.age = 4
  this.expansion = `usee`
  this.biscuits = `hlls`
  this.dogmaBiscuit = `l`
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Choose a non-purple color. Self-execute your top card of that color. Score your top card of that color. If you do, repeat this effect with the same color if you have scored fewer than nine points due to Legend during this action.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      let keepGoing = true
      let total = 0

      const doEffect = (card) => {
        if (!card) {
          keepGoing = false
          game.log.add({ template: 'No top card remaining in ' + firstCard.color })
          return
        }
        game.aSelfExecute(player, card)
        const scored = game.aScore(player, game.getTopCard(player, firstCard.color))
        if (scored) {
          total += scored.getAge()
          keepGoing = total < 9

          if (!keepGoing) {
            game.log.add({ template: `Scored ${total} points due to Legend.` })
          }
        }
        else {
          keepGoing = false
          game.log.add({ template: 'Did not score the top card.' })
        }
      }

      const topNonPurple = game.getTopCards(player).filter(c => c.color !== 'purple')
      const firstCard = game.actions.chooseCard(player, topNonPurple)

      doEffect(firstCard)

      while (keepGoing) {
        const card = game.getTopCard(player, firstCard.color)
        doEffect(card)
      }
    },
  ]

  this.echoImpl = []
  this.karmaImpl = []
}

Card.prototype = Object.create(CardBase.prototype)
Object.defineProperty(Card.prototype, `constructor`, {
  value: Card,
  enumerable: false,
  writable: true
})

module.exports = Card
