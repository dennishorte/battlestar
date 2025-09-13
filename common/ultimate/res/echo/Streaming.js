module.exports = {
  name: `Streaming`,
  color: `blue`,
  age: 11,
  expansion: `echo`,
  biscuits: `bcch`,
  dogmaBiscuit: `c`,
  dogma: [
    `Choose a color on your board. Choose to either achieve the top card of that color on your board, if eligible, or score it. If you do either, and Streaming was foreseen, repeat this effect using the same color.`
  ],
  dogmaImpl: [
    (game, player) => {
      const colorChoices = game.cards.tops(player).map(card => card.color)
      const color = game.actions.choose(player, colorChoices, {
        title: 'Choose a color'
      })[0]

      while (true) {
        const card = game.cards.top(player, color)
        if (!card) {
          game.log.add({
            template: '{player} has no more {color} cards',
            args: { player, color }
          })
          break
        }

        const options = ['score']
        const canAchieve = game.checkAchievementEligibility(player, card)
        if (canAchieve) {
          options.push('achieve')
        }

        const action = game.actions.choose(player, options)[0]
        if (action === 'score') {
          const scored = game.actions.score(player, card)
          if (scored) {
            continue
          }
          else {
            break
          }
        }
        else {
          const achieved = game.actions.claimAchievement(player, { card })
          if (achieved) {
            continue
          }
          else {
            break
          }
        }
      }
    }
  ],
}
