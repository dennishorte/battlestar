const CardBase = require(`../CardBase.js`)

function Card() {
  this.id = `Publications`  // Card names are unique in Innovation
  this.name = `Publications`
  this.color = `blue`
  this.age = 7
  this.expansion = `base`
  this.biscuits = `hsis`
  this.dogmaBiscuit = `s`
  this.inspire = ``
  this.echo = ``
  this.karma = []
  this.dogma = [
    `You may splay your yellow or blue cards up.`,
    `You may junk an available special achievement, or make a special achievement in the junk available.`,
  ]

  this.dogmaImpl = [
    (game, player) => {
      game.aChooseAndSplay(player, ['yellow', 'blue'], 'up')
    },

    (game, player) => {
      const toJunkOptions = game.getAvailableSpecialAchievements()
      const fromJunkOptions = game
        .getZoneById('junk')
        .cards()
        .filter(c => c.isSpecialAchievement)

      let junked = false
      if (toJunkOptions.length > 0) {
        const toJunk = game.aChooseCard(player, toJunkOptions, {
          title: 'Optional: Junk a special achievement?',
          min: 0,
        })
        if (toJunk) {
          junked = true
          game.aRemove(player, toJunk)
        }
      }
      else {
        game.mLog({ template: 'no special achievements available' })
      }

      if (!junked && fromJunkOptions) {
        const fromJunk = game.aChooseCard(player, fromJunkOptions, {
          title: 'Optional: Return a special achievement from junk?',
          min: 0,
        })
        if (fromJunk) {
          junked = true
          game.mMoveCardTo(fromJunk, game.getZoneById('achievements'), { player })
        }
      }
      else if (!junked) {
        game.mLog({ template: 'no special achievements in junk' })
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
