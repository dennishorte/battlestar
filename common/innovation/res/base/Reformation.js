const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Reformation`  // Card names are unique in Innovation
  this.name = `Reformation`
  this.color = `purple`
  this.age = 4
  this.expansion = `base`
  this.biscuits = `llhl`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `You may tuck a card from your hand for every two {l} on your board.`,
    `You may splay your yellow or purple cards right.`
  ]

  this.dogmaImpl = [
    {
      dogma: `You may tuck a card from your hand for every two {l} on your board.`,
      steps: [
        {
          description: `Choose if you will tuck cards.`,
          func(context, player, data) {
            const { game } = context
            const numToTuck = Math.floor(context.data.biscuits[player.name].board.l / 2)
            game.rk.addKey(data, 'numToTuck', numToTuck)
            game.rk.addKey(data, 'numTucked', -1)

            if (numToTuck > 0) {
              return game.aChoose(context, {
                playerName: player.name,
                kind: 'Yes or No',
                choices: [
                  `Tuck ${numToTuck} cards from hand`,
                  'Skip this effect',
                ],
                count: 1,
              })
            }
          }
        },
        {
          description: 'Tuck cards, if desired.',
          func(context, player, data) {
            const { game, sentBack } = context
            const numTucked = game.rk.increment(data, 'numTucked')

            if (!data.initializedTucking) {
              game.rk.addKey(data, 'initializedTucking', true)

              if (sentBack.chosen[0] === 'Skip this effect') {
                game.mLog({
                  template: '{player} skips this effect',
                  args: { player }
                })
                return context.done()
              }
              else {
                game.mLog({
                  template: '{player} will tuck {count} cards from hand',
                  args: {
                    player,
                    count: data.numToTuck
                  }
                })
              }
            }

            if (numTucked < data.numToTuck) {
              context.sendBack({ repeatStep: true })
              return game.aChooseAndTuck(context, {
                playerName: player.name,
                choices: game.getHand(player).cards,
                count: 1,
              })
            }
          }
        },
      ]
    },
    {
      dogma: `You may splay your yellow or purple cards right.`,
      steps: [
        {
          description: `You may splay your yellow or purple cards right.`,
          func(context, player) {
            const { game } = context
            return game.aChooseAndSplay(context, {
              playerName: player.name,
              direction: 'right',
              choices: ['yellow', 'purple'],
            })
          }
        },
      ]
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
