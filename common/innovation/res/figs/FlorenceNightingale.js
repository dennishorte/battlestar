const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Florence Nightingale`  // Card names are unique in Innovation
  this.name = `Florence Nightingale`
  this.color = `yellow`
  this.age = 7
  this.expansion = `figs`
  this.biscuits = `hl*7`
  this.dogmaBiscuit = `l`
  this.inspire = `Tuck a card from your hand.`
  this.echo = ``
  this.karma = [
    `You may issue an Expansion decree with any two figures.`,
    `If an opponent's effect would transfer, return, or remove a card from your score pile, instead leave it there.`
  ]
  this.dogma = []

  this.dogmaImpl = []
  this.echoImpl = []
  this.inspireImpl = (game, player) => {
    game.aChooseAndTuck(player, game.getCardsByZone(player, 'hand'))
  }
  this.karmaImpl = [
    {
      trigger: 'decree-for-two',
      decree: 'Expansion'
    },
    {
      trigger: ['transfer', 'return', 'remove'],
      triggerAll: true,
      kind: 'would-instead',
      matches: (game, player, { card }) => {
        const florenceOwner = game.getPlayerByCard(this)
        const cardOwner = game.getPlayerByCard(card)

        const thisIsMyCardCondition = florenceOwner === cardOwner
        const thisIsNotMyEffectCondition = florenceOwner !== game.state.dogmaInfo.effectLeader
        const cardIsInMyScoreCondition =
          game.getZoneByCard(card) === game.getZoneByPlayer(cardOwner, 'score')

        return thisIsMyCardCondition && thisIsNotMyEffectCondition && cardIsInMyScoreCondition
      },
      func: (game, player, { card }) => {
        game.log.add({
          template: '{card} is not moved',
          args: { card }
        })
      }
    }
  ]
}

Card.prototype = Object.create(CardBase.prototype)
Object.defineProperty(Card.prototype, `constructor`, {
  value: Card,
  enumerable: false,
  writable: true
})

module.exports = Card
