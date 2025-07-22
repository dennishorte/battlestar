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
        const options = [
          'Draw two ' + game.getEffectAge(self, 10),
          'Draw and score two ' + game.getEffectAge(self, 8),
          'Safeguard two available standard achievements'
        ]

        const choice = game.actions.choose(player, options)[0]

        game.log.add({
          template: '{player} chooses: ' + choice,
          args: { player }
        })

        const tucked = game.actions.drawAndTuck(player, game.getEffectAge(self, 8))

        if (tucked.checkHasBiscuit('s')) {
          switch (choice) {
            case options[0]:
              game.aDraw(player, { age: game.getEffectAge(self, 10) })
              game.aDraw(player, { age: game.getEffectAge(self, 10) })
              break
            case options[1]:
              game.aDrawAndScore(player, game.getEffectAge(self, 8))
              game.aDrawAndScore(player, game.getEffectAge(self, 8))
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
