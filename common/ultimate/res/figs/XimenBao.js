module.exports = {
  id: `Ximen Bao`,  // Card names are unique in Innovation
  name: `Ximen Bao`,
  color: `yellow`,
  age: 2,
  expansion: `figs`,
  biscuits: `*2hl`,
  dogmaBiscuit: `l`,
  echo: ``,
  karma: [
    `You may issue an Expansion Decree with any two figures.`,
    `Each Inspire and Echo effect on your board counts as a part of this stack. When executing, order them from bottom to top, red, blue, green, purple, yellow.`
  ],
  dogma: [],
  dogmaImpl: [],
  echoImpl: [],
  karmaImpl: [
    {
      trigger: 'decree-for-two',
      decree: 'Expansion',
    },
    {
      trigger: ['list-echo-effects', 'list-inspire-effects'],
      func(game, player, { color, kind }) {
        if (color !== 'yellow') {
          return game.getVisibleEffectsByColor(player, color, kind)
        }
        else {
          return game
            .getVisibleEffectsByColor(player, 'red', kind)
            .concat(game.getVisibleEffectsByColor(player, 'blue', kind))
            .concat(game.getVisibleEffectsByColor(player, 'green', kind))
            .concat(game.getVisibleEffectsByColor(player, 'purple', kind))
            .concat(game.getVisibleEffectsByColor(player, 'yellow', kind))
        }
      }
    }
  ]
}
