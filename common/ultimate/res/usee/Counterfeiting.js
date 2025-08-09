module.exports = {
  name: `Counterfeiting`,
  color: `green`,
  age: 2,
  expansion: `usee`,
  biscuits: `scch`,
  dogmaBiscuit: `c`,
  dogma: [
    `Score a top card from your board of a value not in your score pile. If you do, repeat this effect.`,
    `You may splay your green or purple cards left.`
  ],
  dogmaImpl: [
    (game, player) => {
      while (true) {
        const agesInScore = game.cards.byPlayer(player, 'score').map(c => c.getAge())
        const canScore = game.cards.tops(player).filter(c => !agesInScore.includes(c.getAge()))
        const scored = game.actions.chooseAndScore(player, canScore, { count: 1 })[0]
        if (scored) {
          continue
        }
        else {
          break
        }
      }
    },
    (game, player) => {
      const colorChoices = ['green', 'purple']
      const splayDirection = 'left'
      game.aChooseAndSplay(player, colorChoices, splayDirection)
    }
  ],
}
