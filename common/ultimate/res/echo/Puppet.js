module.exports = {
  name: `Puppet`,
  color: `purple`,
  age: 1,
  expansion: `echo`,
  biscuits: `hk3k`,
  dogmaBiscuit: `k`,
  echo: ``,
  dogma: [
    `Junk an available achievement of value equal to the value of a card in your score pile.`,
  ],
  dogmaImpl: [
    (game, player) => {
      const ages = game
        .cards.byPlayer(player, 'score')
        .map(c => c.getAge())
      game.actions.chooseAndJunkAchievement(player, ages)
    }
  ],
  echoImpl: [],
}
