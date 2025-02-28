const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Cliffhanger`  // Card names are unique in Innovation
  this.name = `Cliffhanger`
  this.color = `green`
  this.age = 3
  this.expansion = `echo`
  this.biscuits = `sllh`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Reveal a {3} in your safe. If it is: green, tuck it; purple, meld it; red, achieve it regardless of eligibility; yellow, score it; blue, draw a {3}. Otherwise, safeguard the top card of the {3} deck.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const choices = game.getCardsByZone(player, 'safe')
        .filter(card => card.age === 3)
      
      if (choices.length === 0) {
        game.mLogNoEffect()
        return
      }

      const revealed = game.aChooseCard(player, choices)
      game.mReveal(player, revealed)

      switch (revealed.color) {
        case 'green':
          game.aTuck(player, revealed)
          break
        case 'purple':
          game.aMeld(player, revealed)
          break
        case 'red':
          game.aAchieveRegardless(player, revealed)
          break
        case 'yellow':  
          game.aScore(player, revealed)
          break
        case 'blue':
          game.aDraw(player, { age: game.getEffectAge(this, 3) })
          break
        default:
          game.mLog({
            template: 'No card was revealed from safe, safeguarding top of {age3} pile',
            args: { age3: game.getEffectAge(this, 3) }  
          })
          game.aSafeguard(player, game.getDeckTopCard(3))
          break
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