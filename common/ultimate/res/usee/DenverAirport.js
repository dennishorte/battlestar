module.exports = {
  name: `Denver Airport`,
  color: `green`,
  age: 10,
  expansion: `usee`,
  biscuits: `cchp`,
  dogmaBiscuit: `c`,
  dogma: [
    `You may achieve one of your secrets regardless of eligibility.`,
    `You may splay your purple cards up.`
  ],
  dogmaImpl: [
    (game, player) => {
      const secrets = game.cards.byPlayer(player, 'safe')
      const card = game.actions.chooseCards(player, secrets, {
        title: 'Choose a card to achieve',
        hidden: true,
        min: 0,
      })[0]

      if (card) {
        game.aClaimAchievement(player, { card })
      }
    },

    (game, player) => {
      game.aChooseAndSplay(player, ['purple'], 'up')
    }
  ],
}
