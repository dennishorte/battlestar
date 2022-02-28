const CardBase = require(`../../CardBase.js`)

function Card() {
  this.id = 'War'
  this.name = 'War'
  this.exp = 'figs'
  this.text = "Choose a value. Return all top cards of that value from all other players' boards."
  this.alt = ''
  this.isSpecialAchievement = true
  this.decreeImpl = (game, player) => {
    const value = game.requestInputSingle({
      actor: player.name,
      title: 'Choose an Age',
      choices: [1,2,3,4,5,6,7,8,9,10]
    })[0]

    game.mLog({
      template: '{player} chooses {age}',
      args: {
        player,
        age: value
      }
    })

    const cardsToReturn = []
    for (const opponent of game.getPlayerOpponents(player)) {
      for (const card of game.getTopCards(opponent)) {
        if (card.age === value) {
          cardsToReturn.push(card)
        }
      }
    }

    game.aReturnMany(player, cardsToReturn)
  }
}

Card.prototype = Object.create(CardBase.prototype)
Object.defineProperty(Card.prototype, `constructor`, {
  value: Card,
  enumerable: false,
  writable: true
})

module.exports = Card
