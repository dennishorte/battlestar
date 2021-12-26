const CardBase = require('../CardBase.js')

function Card() {
  this.name = '{name}'
  this.color = '{color}'
  this.age = {age}
  this.biscuits = '{biscuits}'
  this.dogmaBiscuit = '{dogmaBiscuit}'
  this.inspire = '{inspire}'
  this.echo = '{echo}'
  this.triggers = [
    {triggers}
  ]
  this.dogma = [
    {dogma}
  ]
  this.dogmaImpl = [
    {
      dogma: '',
      demand: false,
      compel: false,
      steps: [
        {
          description: '',
          func(context) {
            throw new Error('not implemented')
          },
        }
      ],
    },
  ]
}

Card.prototype = Object.create(CardBase.prototype)
Object.defineProperty(Card.prototype, 'constructor', {
  value: Card,
  enumerable: false,
  writable: true
})

module.exports = Card
