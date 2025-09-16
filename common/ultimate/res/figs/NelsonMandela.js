module.exports = {
  id: `Nelson Mandela`,  // Card names are unique in Innovation
  name: `Nelson Mandela`,
  color: `red`,
  age: 9,
  expansion: `figs`,
  biscuits: `l*hl`,
  dogmaBiscuit: `l`,
  echo: ``,
  karma: [
    `If you are required to fade a figure, instead do nothing.`,
    `Each two inspire effects visibile on your board counts as an achievement.`
  ],
  dogma: [],
  dogmaImpl: [],
  echoImpl: [],
  karmaImpl: [
    {
      trigger: 'no-fade'
    },
    {
      trigger: 'extra-achievements',
      func: (game, player) => {
        const visibleInspires = game
          .utilColors()
          .flatMap(color => game.getCardsByZone(player, color))
          .filter(card => game.checkInspireIsVisible(card))
          .length
        return Math.floor(visibleInspires / 2)
      }
    }
  ]
}
