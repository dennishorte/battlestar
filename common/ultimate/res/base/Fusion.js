const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Fusion`  // Card names are unique in Innovation
  this.name = `Fusion`
  this.color = `red`
  this.age = 11
  this.expansion = `base`
  this.biscuits = `iihc`
  this.dogmaBiscuit = `i`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Score a top card of value 11 on your board. If you do, choose a value one or two lower than the scored card, then repeat this dogma effect using the chosen value.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const executeEffect = (value) => {
        const choices = game
          .getTopCards(player)
          .filter(card => card.getAge() === value);
          
        if (choices.length === 0) {
          game.mLog({
            template: '{player} has no top cards of value {value}',
            args: { player, value }
          });
          return false;
        }
        
        const card = game.aChooseCard(player, choices);
        if (!card) return false;
        
        game.aScore(player, card);
        return true;
      };
      
      // First execution with value 11
      if (executeEffect(11)) {
        // Choose a value 1 or 2 lower
        const options = [9, 10];
        const chosenValue = game.aChoose(player, options, { title: 'Choose a value to repeat the effect with' })[0];
        
        game.mLog({
          template: '{player} chooses to repeat the effect with value {value}',
          args: { player, value: chosenValue }
        });
        
        executeEffect(chosenValue);
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