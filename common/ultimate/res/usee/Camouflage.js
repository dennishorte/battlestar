module.exports = {
  name: `Camouflage`,
  color: `red`,
  age: 7,
  expansion: `usee`,
  biscuits: `fhfl`,
  dogmaBiscuit: `f`,
  dogma: [
    `Choose to either junk exactly two top cards of different colors and equal value on your board, then safeguard them, or score exactly two of your secrets of equal value.`,
    `Draw a {7} for each special achievement you have.`
  ],
  dogmaImpl: [
    (game, player) => {
      const junkOptions = function() {
        const topCards = game.getTopCards(player)
        const validCards = []
        for (const card of topCards) {
          for (const other of topCards) {
            if (card !== other && card.getAge() === other.getAge()) {
              validCards.push(card)
              break
            }
          }
        }
        return validCards
      }()

      const scoreOptions = function() {
        const secrets = game.cards.byPlayer(player, 'safe')
        const validCards = []

        for (const card of secrets) {
          for (const other of secrets) {
            if (card !== other && card.getAge() === other.getAge()) {
              validCards.push(card)
              break
            }
          }
        }
        return validCards
      }()

      if (junkOptions.length === 0 && scoreOptions.length === 0) {
        game.log.addNoEffect()
        return
      }

      const options = [
        'Junk and safeguard',
        'Score secrets',
      ]

      const choice = game.actions.choose(player, options, { title: 'Choose an action' })[0]
      game.log.add({
        template: '{player} will {action}',
        args: { player, action: choice.toLowerCase() }
      })

      if (choice === 'Junk and safeguard') {
        const cards = game.actions.chooseCards(player, junkOptions, {
          count: 2,
          guard: (cards) => cards.every(c => c.getAge() === cards[0].getAge())
        })
        game.actions.junkMany(player, cards)
        game.actions.safeguardMany(player, cards)
      }
      else if (choice === 'Score secrets') {
        const cards = game.actions.chooseCards(player, scoreOptions, {
          count: 2,
          guard: (cards) => cards.every(c => c.getAge() === cards[0].getAge())
        })
        game.actions.scoreMany(player, cards)
      }
    },
    (game, player, { self }) => {
      const specialAchievements = game
        .cards.byPlayer(player, 'achievements')
        .filter(a => a.isSpecialAchievement)
        .length

      for (let i = 0; i < specialAchievements; i++) {
        game.aDraw(player, { age: game.getEffectAge(self, 7) })
      }
    },
  ],
}
