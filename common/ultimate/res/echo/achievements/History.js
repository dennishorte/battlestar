const CardBase = require(`../../CardBase.js`)

function Card() {
  this.id = 'History'
  this.name = 'History'
  this.shortName = 'hist'
  this.expansion = 'echo'
  this.text = 'Have four echo effects visible in one color.'
  this.alt = 'Photography'
  this.isSpecialAchievement = true
  this.checkPlayerIsEligible = function(game, player, reduceCost) {

    const targetCount = reduceCost ? 3 : 4

    const infos = game.getInfoByKarmaTrigger(player, 'hex-effect')
    const includeHexesAsEcho = (card) => (
      infos.some(info => info.impl.matches(game, player, { card }))
    )

    return game
    // Grab each stack
      .utilColors()
      .map(color => game.getZoneByPlayer(player, color))

    // Convert each stack to a count of echo effects
      .map(zone => zone
        .cards()
        .flatMap(c =>
          game
            .getBiscuitsRaw(c, zone.splay)
            .match(includeHexesAsEcho(c) ? /[hm&]/g : /&/g) || []
        )
        .length
      )
      .some(count => count >= targetCount)
  }
}

Card.prototype = Object.create(CardBase.prototype)
Object.defineProperty(Card.prototype, `constructor`, {
  value: Card,
  enumerable: false,
  writable: true
})

module.exports = Card
