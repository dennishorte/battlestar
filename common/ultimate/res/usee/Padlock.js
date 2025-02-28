const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Padlock`  // Card names are unique in Innovation
  this.name = `Padlock`
  this.color = `red`
  this.age = 2
  this.expansion = `usee`
  this.biscuits = `ckhk`
  this.dogmaBiscuit = `k`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you transfer one of your secrets to the available achievements!`,
    `If no card was transferred due to the demand, you may score up to three cards from your hand of different values.`
  ]

  this.dogmaImpl = [
    (game, player, { leader }) => {
      const secrets = game
        .getTopCards(player)
        .filter(card => card.checkHasBiscuit('c'))

      if (secrets.length > 0) {
        const secret = game.aChooseCard(player, secrets)
        const transferred = game.aTransfer(player, secret, game.getZoneById('achievements')) 
        
        if (!transferred) {
          game.mLogNoEffect()
        }
      }
      else {
        game.mLogNoEffect()
      }
    },
    (game, player, { leader }) => {
      const secrets = game
        .getTopCards(player)
        .filter(card => card.checkHasBiscuit('c'))

      if (secrets.length === 0) { // No secrets were transferred
        const hand = game.getCardsByZone(player, 'hand')
        const ages = hand.map(c => c.age).filter((v, i, a) => a.indexOf(v) === i)
        const toScore = game.aChooseCards(player, hand, { count: ages.length, min: 0, max: 3 })

        toScore.forEach(card => game.aScore(player, card))
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