const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `The Prophecies`  // Card names are unique in Innovation
  this.name = `The Prophecies`
  this.color = `blue`
  this.age = 4
  this.expansion = `figs`
  this.biscuits = `sshs` 
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Choose to either draw and safeguard a {4}, or draw and score a card of value one higher than one of your secrets. If you reveal a red or purple secret, meld one of your other secrets. If you do, safeguard the drawn card.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const choice = game.aChoose(player, [
        'Draw and safeguard a 4',
        'Draw and score based on a secret',
      ], { title: 'Choose one:' })

      if (choice === 0) {
        // Draw and safeguard a 4
        game.aDrawAndSafeguard(player, game.getEffectAge(this, 4))
      } 
      else if (choice === 1) {
        // Draw and score based on a secret
        const secrets = game.getSecrets(player)
        const secretValues = secrets.map(card => card.value)
        const revealedSecret = game.aChooseCard(player, secrets, { title: 'Choose a secret to reveal:' })
        game.mReveal(player, revealedSecret)

        const drawAge = revealedSecret.getAge() + 1
        const drawnCard = game.aDrawAndScore(player, drawAge)

        if (revealedSecret.color === 'red' || revealedSecret.color === 'purple') {
          const otherSecrets = secrets.filter(card => card !== revealedSecret)
          const secretToMeld = game.aChooseCard(player, otherSecrets, { title: 'Choose a secret to meld:' })
          if (secretToMeld) {
            game.aMeld(player, secretToMeld)
            game.aSafeguard(player, drawnCard)
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