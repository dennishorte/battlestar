module.exports = {
  name: `Mona Lisa`,
  color: `yellow`,
  age: 4,
  expansion: `arti`,
  biscuits: `hcll`,
  dogmaBiscuit: `l`,
  dogma: [
    `Choose a number and a color. Draw five {4}, then reveal your hand. If you have exactly that many cards of that color, score them, and splay right your cards of that color. Otherwise, return all cards from your hand.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const number = game.actions.choose(player, [0,1,2,3,4,5,6,7,8,9], { title: 'Choose a number' })[0]
      const color = game.actions.choose(player, game.utilColors(), { title: 'Choose a color' })[0]

      game.log.add({
        template: '{player} chooses {number} {color}',
        args: { player, number, color }
      })

      game.aDraw(player, { age: game.getEffectAge(self, 4) })
      game.aDraw(player, { age: game.getEffectAge(self, 4) })
      game.aDraw(player, { age: game.getEffectAge(self, 4) })
      game.aDraw(player, { age: game.getEffectAge(self, 4) })
      game.aDraw(player, { age: game.getEffectAge(self, 4) })

      const hand = game.getCardsByZone(player, 'hand')

      for (const card of hand) {
        game.mReveal(player, card)
      }

      const matches = hand.filter(card => card.color === color)
      const matchCount = matches.length === number

      game.log.add({
        template: '{player} has {count} {color}',
        args: { player, count: matches.length, color }
      })

      if (matchCount) {
        game.log.add({
          template: '{player} guessed correctly',
          args: { player }
        })
        game.aScoreMany(player, matches)
        game.aSplay(player, color, 'right')
      }
      else {
        game.log.add({
          template: '{player} did not guess correctly',
          args: { player }
        })
        game.aReturnMany(player, hand)
      }
    }
  ],
}
