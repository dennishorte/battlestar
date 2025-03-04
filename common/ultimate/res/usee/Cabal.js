const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Cabal`  // Card names are unique in Innovation
  this.name = `Cabal`
  this.color = `red`
  this.age = 5
  this.expansion = `usee`
  this.biscuits = `hffc`
  this.dogmaBiscuit = `f`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I demand you transfer all cards from your hand that have a value matching any of my top cards to my score pile! Draw a {5}!`,
    `Safeguard an available achievement of value equal to a top card on your board.`
  ]

  this.dogmaImpl = [
    (game, player, { leader }) => {
      const handCards = game.getZoneByPlayer(player, 'hand').cards();
      const leaderTopAges = game
        .getTopCards(leader)
        .map(card => card.age);

      const matchingCards = handCards.filter(card => 
        leaderTopAges.includes(card.age)  
      );

      game.aTransferMany(player, matchingCards, game.getZoneByPlayer(leader, 'score'));
      
      game.aDraw(player, { age: game.getEffectAge(this, 5) });
    },

    (game, player) => {
      const topCardAges = game
        .getTopCards(player)
        .map(card => card.age);

      const availableAchievements = game
        .getAvailableAchievements()
        .filter(achievement => topCardAges.includes(achievement.age));

      const achievement = game.aChooseCard(player, availableAchievements);
      if (achievement) {
        game.aSafeguard(player, achievement);  
      }
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