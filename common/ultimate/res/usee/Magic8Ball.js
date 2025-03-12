const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Magic 8-Ball`  // Card names are unique in Innovation
  this.name = `Magic 8-Ball`
  this.color = `yellow`
  this.age = 9
  this.expansion = `usee`
  this.biscuits = `hlll`
  this.dogmaBiscuit = `l`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `Choose whether you wish to draw two {0}, draw and score two {8}, or safeguard two available standard achievements. Draw and tuck an {8}. If it has {s}, do as you wish. If it is red or purple, repeat this effect.`
  ]

  this.dogmaImpl = [
    (game, player) => {
      const doEffect = () => {
        const options = [
          'Draw two ' + game.getEffectAge(this, 10),
          'Draw and score two ' + game.getEffectAge(this, 8),
          'Safeguard two available standard achievements'
        ]

        const choice = game.aChoose(player, options)[0]

        game.mLog({
          template: '{player} chooses: ' + choice,
          args: { player }
        })

        const tucked = game.aDrawAndTuck(player, game.getEffectAge(this, 8))

        if (tucked.checkHasBiscuit('s')) {
          switch (choice) {
            case options[0]:
              game.aDraw(player, { age: game.getEffectAge(this, 10) })
              game.aDraw(player, { age: game.getEffectAge(this, 10) })
              break
            case options[1]:
              game.aDrawAndScore(player, game.getEffectAge(this, 8))
              game.aDrawAndScore(player, game.getEffectAge(this, 8))
              break
            case options[2]:
              game.aChooseAndSafeguard(player, game.getAvailableStandardAchievements(player), {
                count: 2,
                hidden: true,
              })
              break
            default:
              throw new Error('Invalid choice: ' + choice)
          }
        }

        const stop = tucked.color !== 'red' && tucked.color !== 'purple'
        return stop
      }

      let stop = false
      while (!stop) {
        stop = doEffect()
      }

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
