module.exports = {
  id: `Zhang Heng`,  // Card names are unique in Innovation
  name: `Zhang Heng`,
  color: `blue`,
  age: 2,
  expansion: `figs`,
  biscuits: `l&2h`,
  dogmaBiscuit: `l`,
  echo: `Draw and tuck a {3}. Score all cards above it.`,
  karma: [
    `Each card in your score pile counts as a bonus of its value on your board.`
  ],
  dogma: [],
  dogmaImpl: [],
  echoImpl: (game, player) => {
    const card = game.actions.drawAndTuck(player, game.getEffectAge(this, 3))
    if (card) {
      const zone = game.getZoneByPlayer(player, card.color)
      const toScore = zone
        .cards()
        .filter(c => c !== card)

      game.actions.scoreMany(player, toScore, { ordered: true })
    }
  },
  karmaImpl: [
    {
      trigger: 'list-bonuses',
      func: (game, player) => {
        return game
          .getCardsByZone(player, 'score')
          .map(card => card.getAge())
      }
    }
  ]
}
