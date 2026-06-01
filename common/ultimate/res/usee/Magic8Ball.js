module.exports = {
  name: `Magic 8-Ball`,
  color: `yellow`,
  age: 9,
  expansion: `usee`,
  biscuits: `hlll`,
  dogmaBiscuit: `l`,
  dogma: [
    `Choose whether you wish to draw two {0}, draw and score two {8}, or safeguard two available standard achievements. Draw and tuck an {8}. If it has {s}, do as you wish. If it is red or purple, repeat this effect.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const doEffect = () => {
        const drawTwoTitle = 'Draw two ' + game.getEffectAge(self, 10)
        const drawScoreTitle = 'Draw and score two ' + game.getEffectAge(self, 8)
        const safeguardTitle = 'Safeguard two available standard achievements'
        const options = [
          game.actions.option({ id: 'draw-two', title: drawTwoTitle }),
          game.actions.option({ id: 'draw-score-two', title: drawScoreTitle }),
          game.actions.option({ id: 'safeguard-two', title: safeguardTitle }),
        ]

        const pick = game.actions.choose(player, options)[0]
        const choice = (pick && typeof pick === 'object') ? pick.id : pick
        const choiceTitle = (pick && typeof pick === 'object') ? pick.title : pick

        game.log.add({
          template: '{player} chooses: ' + choiceTitle,
          args: { player }
        })

        const tucked = game.actions.drawAndTuck(player, game.getEffectAge(self, 8))

        if (tucked.checkHasBiscuit('s')) {
          if (choice === 'draw-two' || choice === drawTwoTitle) {
            game.actions.draw(player, { age: game.getEffectAge(self, 10) })
            game.actions.draw(player, { age: game.getEffectAge(self, 10) })
          }
          else if (choice === 'draw-score-two' || choice === drawScoreTitle) {
            game.actions.drawAndScore(player, game.getEffectAge(self, 8))
            game.actions.drawAndScore(player, game.getEffectAge(self, 8))
          }
          else if (choice === 'safeguard-two' || choice === safeguardTitle) {
            game.actions.chooseAndSafeguard(player, player.availableStandardAchievements(), {
              count: 2,
              hidden: true,
            })
          }
          else {
            throw new Error('Invalid choice: ' + JSON.stringify(pick))
          }
        }

        const stop = tucked.color !== 'red' && tucked.color !== 'purple'
        if (!stop) {
          game.log.add({
            template: '{card} is {color}; effect will repeat',
            args: { card: tucked, color: tucked.color }
          })
        }
        return stop
      }

      let stop = false
      while (!stop) {
        stop = doEffect()
      }

    },
  ],
}
