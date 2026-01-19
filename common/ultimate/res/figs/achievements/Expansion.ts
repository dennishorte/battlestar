export default {
  id: 'Expansion',
  name: 'Expansion',
  shortName: 'expn',
  expansion: 'figs',
  text: 'Splay any one of your colors up.',
  alt: '',
  isSpecialAchievement: false,
  isDecree: true,
  decreeImpl: (game, player) => {
    game.actions.chooseAndSplay(player, null, 'up', { count: 1 })
  }
}
