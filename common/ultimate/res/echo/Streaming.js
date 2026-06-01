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
    (game, player, { foreseen, self }) => {
      const colorChoices = game.cards.tops(player).map(card =>
        game.actions.option({ id: card.color, title: card.color, kind: 'color' })
      )
      const colorPick = game.actions.choose(player, colorChoices, {
        title: 'Choose a color'
      })[0]
      const color = (colorPick && typeof colorPick === 'object') ? colorPick.id : colorPick

      while (true) {
        const card = game.cards.top(player, color)
        if (!card) {
          game.log.add({
            template: '{player} has no more {color} cards',
            args: { player, color }
          })
          break
        }

        const options = [game.actions.option({ id: 'score', title: 'score' })]
        const canAchieve = player.canClaimAchievement(card)
        if (canAchieve) {
          options.push(game.actions.option({ id: 'achieve', title: 'achieve' }))
        }

        const actionPick = game.actions.choose(player, options)[0]
        const action = (actionPick && typeof actionPick === 'object') ? actionPick.id : actionPick
        if (action === 'score') {
          const scored = game.actions.score(player, card)
          game.log.addForeseen(foreseen, self)
          if (scored && foreseen) {
            continue
          }
          else {
            break
          }
        }
        else {
          const achieved = game.actions.claimAchievement(player, { card })
          game.log.addForeseen(foreseen, self)
          if (achieved && foreseen) {
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
