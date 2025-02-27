const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Hypersonics`  // Card names are unique in Innovation
  this.name = `Hypersonics`
  this.color = `green`
  this.age = 11
  this.expansion = `base`
  this.biscuits = `iilh`
  this.dogmaBiscuit = `i`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `I DEMAND you return exactly two top cards of different colors from your board of the same value! If you do, return all cards of that value or less in your hand and score pile!`
  ]

  this.dogmaImpl = [
    (game, player, { leader }) => {
      // Create map of values to cards of different colors
      const valueMap = new Map();
      
      game.getTopCards(player).forEach(card => {
        const age = card.getAge();
        if (!valueMap.has(age)) {
          valueMap.set(age, []);
        }
        valueMap.get(age).push(card);
      });
      
      // Find values that have at least 2 cards of different colors
      const validValues = Array.from(valueMap.entries())
        .filter(([_, cards]) => {
          const colors = new Set(cards.map(c => c.color));
          return colors.size >= 2;
        })
        .map(([value, _]) => value);
      
      if (validValues.length === 0) {
        game.mLog({
          template: '{player} has no valid pairs of cards to return',
          args: { player }
        });
        return;
      }
      
      // Let player choose a value
      const chosenValue = game.aChoose(player, validValues, { 
        title: 'Choose a value to return two cards of' 
      })[0];
      
      if (chosenValue === undefined) return;
      
      // Get cards of that value
      const cardsOfValue = valueMap.get(chosenValue);
      
      // Choose two cards of different colors
      const colorSet = new Set();
      const toReturn = [];
      
      for (const card of cardsOfValue) {
        if (!colorSet.has(card.color) && toReturn.length < 2) {
          colorSet.add(card.color);
          toReturn.push(card);
        }
      }
      
      // Return the chosen cards
      game.aReturnMany(player, toReturn);
      
      if (toReturn.length === 2) {
        // Return all cards of that value or less from hand and score
        const cardsToReturn = [
          ...game.getCardsByZone(player, 'hand').filter(c => c.getAge() <= chosenValue),
          ...game.getCardsByZone(player, 'score').filter(c => c.getAge() <= chosenValue)
        ];
        
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