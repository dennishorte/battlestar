module.exports = {
  id: `Zhang Heng`,  // Card names are unique in Innovation
  name: `Zhang Heng`,
  color: `blue`,
  age: 2,
  expansion: `figs`,
  biscuits: `l&2h`,
  dogmaBiscuit: `l`,
  karma: [
    `Each card in your score pile counts as a bonus of its value on your board.`
  ],
  karmaImpl: [
    {
      trigger: 'list-bonuses',
      func: (game, player) => {
        return game
          .cards
          .byPlayer(player, 'score')
          .map(card => card.getAge())
      }
    }
  ]
}
