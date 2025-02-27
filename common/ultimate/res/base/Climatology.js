const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Climatology`  // Card names are unique in Innovation
  this.name = `Climatology`
  this.color = `blue`
  this.age = 11
  this.expansion = `base`
  this.biscuits = `lhll`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I DEMAND you return two top cards from your board each with the icon of my choice other than {l}!`,
    `Return a top card on your board. Return all cards in your score pile of equal or higher value than the returned card.`
  ]

  this.dogmaImpl = [
    (game, player, { leader }) => {
      // All standard icons except leaf
      const validIcons = ['c', 's', 'f', 'i', 'p'];
      const icon = game.aChoose(leader, validIcons, { title: 'Choose an icon' })[0];
      
      game.mLog({
        template: '{leader} chooses {icon}',
        args: { leader, icon }
      });
      
      const choices = game
        .getTopCards(player)
        .filter(card => card.checkHasBiscuit(icon));
        
      game.aChooseAndReturn(player, choices, { min: 0, max: 2 });
    },
    
    (game, player) => {
      const topCards = game.getTopCards(player);
      if (topCards.length === 0) {
        game.mLogNoEffect();
        return;
      }
      
      const card = game.aChooseCard(player, topCards);
      if (card) {
        game.aReturn(player, card);
        
        const returnedValue = card.getAge();
        const scoreCardsToReturn = game
          .getCardsByZone(player, 'score')
          .filter(c => c.getAge() >= returnedValue);
          
        game.aReturnMany(player, scoreCardsToReturn);
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