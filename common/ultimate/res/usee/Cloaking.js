module.exports = {
  name: `Cloaking`,
  color: `red`,
  age: 11,
  expansion: `usee`,
  biscuits: `hsfs`,
  dogmaBiscuit: `s`,
  dogma: [
    `I demand you transfer one of your claimed standard achievements to my safe!`
  ],
  dogmaImpl: [
    (game, player, { leader }) => {
      const choices = game.cards.byPlayer(player, 'achievements')

      const card = game.actions.chooseCards(player, choices, {
        title: 'Choose a standard achievement to transfer',
        hidden: true,
        filter: card => card.checkIsStandardAchievement(),
      })[0]

      if (card) {
        game.actions.transfer(player, card, game.zones.byPlayer(leader, 'safe'))
      }
    },
  ],
}
