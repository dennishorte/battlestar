const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Space Traffic`  // Card names are unique in Innovation
  this.name = `Space Traffic`
  this.color = `green`
  this.age = 11
  this.expansion = `base`
  this.biscuits = `cih`
  this.dogmaBiscuit = `c`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Draw and tuck an 11. If you tuck directly under an 11, you lose. Otherwise, score all but your top five cards of the color of the tucked card, splay that color aslant, and if you do not have the highest score, repeat this effect.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const executeEffect = () => {
        const card = game.aDraw(player, { age: 11 });
        if (!card) {
          game.mLogNoEffect();
          return false;
        }
        
        // Check if we're tucking directly under an 11
        const color = card.color;
        const topCard = game.getTopCard(player, color);
        
        game.aTuck(player, card);
        
        if (topCard && topCard.getAge() === 11) {
          game.mLog({
            template: '{player} tucked directly under an 11 and loses the game',
            args: { player }
          });
          
          game.aLose(player, this.name);
          return false;
        }
        
        // Score all but top 5 cards of that color
        const cards = game.getCardsByZone(player, color);
        if (cards.length > 5) {
          const toScore = cards.slice(0, cards.length - 5);
          game.aScoreMany(player, toScore);
        }
        
        // Splay that color aslant
        game.aSplay(player, color, 'aslant');
        
        // Check if player doesn't have highest score
        const playerScore = game.getScore(player);
        const highestScore = Math.max(...game.getPlayerAll().map(p => game.getScore(p)));
        
        return playerScore < highestScore;
      };
      
      // First execution
      let shouldRepeat = executeEffect();
      
      // Repeat if needed
      while (shouldRepeat) {
        game.mLog({
          template: '{player} repeats the effect',
          args: { player }
        });
        
        shouldRepeat = executeEffect();
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