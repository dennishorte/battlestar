const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Mafia`  // Card names are unique in Innovation
  this.name = `Mafia`
  this.color = `yellow`
  this.age = 7
  this.expansion = `base` // Corrected expansion, matches card
  this.biscuits = `fhff`
  this.dogmaBiscuit = `f`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you transfer your lowest secret to my safe!`,
    `Tuck a card from any score pile.`,
    `You may splay your red or yellow cards right.`
  ]

  this.dogmaImpl = [
    (game, player, { leader }) => {
      const opponentSecrets = game
        .getPlayerOpponents(player)
        .flatMap(opp => game.getZoneByPlayer(opp, 'hand').cards())
        .filter(c => c.checkHasBiscuit('s'))

      if (opponentSecrets.length === 0) {
        game.mLogNoEffect()
        return
      }

      const secretToTransfer = game.utilLowestCards(opponentSecrets)[0]
      const owner = game.getPlayerByCard(secretToTransfer)
      
      game.mLog({
        template: '{player} demands {owner} transfer {card}',
        args: { player, owner, card: secretToTransfer }
      })

      game.aTransfer(owner, secretToTransfer, game.getZoneByPlayer(leader, 'hand'))
    },

    (game, player) => {
      const allScorePiles = game
        .getPlayerAll()
        .flatMap(p => game.getCardsByZone(p, 'score'))

      const card = game.aChooseCard(player, allScorePiles, {
        title: 'Choose a card to tuck'
      })

      if (card) {
        game.aTuck(game.getPlayerByCard(card), card)
      }
    },

    (game, player) => {  
      game.aChooseAndSplay(player, ['red', 'yellow'], 'right')
    }
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