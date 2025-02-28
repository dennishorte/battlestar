const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Tomb`  // Card names are unique in Innovation
  this.name = `Tomb`
  this.color = `yellow`
  this.age = 1
  this.expansion = `usee`
  this.biscuits = `chkk` 
  this.dogmaBiscuit = `k`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Safeguard an available achievement of value equal to the number of achievements you have.`,
    `You may transfer the lowest-valued achievement to your hand. If you do, return all purple and all blue cards on your board.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const numAchievements = game.getCardsByZone(player, 'achievements').length;
      const choices = game.getAvailableAchievements().filter(card => card.age === numAchievements);
      
      if (choices.length > 0) {
        game.aChooseAndAchieve(player, choices, { count: 1});
      }
      else {
        game.mLogNoEffect();
      }
    },
    
    (game, player) => {
      const achievements = game.getCardsByZone(player, 'achievements');

      if (achievements.length === 0) {
        game.mLogNoEffect();
        return;
      }

      const lowestAchievement = game.utilLowestCards(achievements)[0];
      const transfer = game.aYesNo(player, `Transfer ${lowestAchievement.name} to your hand?`);
      
      if (transfer) {
        game.mTransfer(player, lowestAchievement, game.getZoneByPlayer(player, 'hand'));
        
        const purpleCards = game.getCardsByZone(player, 'purple');
        const blueCards = game.getCardsByZone(player, 'blue');
        const cardsToReturn = [].concat(purpleCards, blueCards);
        
        game.aReturnMany(player, cardsToReturn);
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