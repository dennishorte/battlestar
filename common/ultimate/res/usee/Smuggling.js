const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Smuggling`  // Card names are unique in Innovation
  this.name = `Smuggling`
  this.color = `green`
  this.age = 3
  this.expansion = `usee`
  this.biscuits = `cchc`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you transfer a card of value equal to your top yellow card and a card of value equal to my top yellow card from your score pile to my score pile!`
  ]

  this.dogmaImpl = [
    (game, player, { leader }) => {
      const opponentTopYellow = game
        .getTopCards(player)
        .find(card => card.color === 'yellow')

      const leaderTopYellow = game  
        .getTopCards(leader)
        .find(card => card.color === 'yellow')

      if (!opponentTopYellow || !leaderTopYellow) {
        game.mLogNoEffect()
        return
      }
      
      const oppValue = opponentTopYellow.getAge()
      const leaderValue = leaderTopYellow.getAge()

      const oppChoices = game
        .getCardsByZone(player, 'score')
        .filter(card => card.getAge() === oppValue)

      const leaderChoices = game  
        .getCardsByZone(player, 'score')
        .filter(card => card.getAge() === leaderValue)

      if (oppChoices.length === 0 || leaderChoices.length === 0) {
        game.mLogNoEffect()
        return  
      }

      const oppCard = game.aChooseCard(player, oppChoices, { count: 1 })
      const leaderCard = game.aChooseCard(player, leaderChoices, { count: 1 })

      game.aTransfer(player, oppCard[0], game.getZoneByPlayer(leader, 'score'))  
      game.aTransfer(player, leaderCard[0], game.getZoneByPlayer(leader, 'score'))
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