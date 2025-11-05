module.exports = {
  id: 'Rivalry',
  name: 'Rivalry',
  shortName: 'rivl',
  expansion: 'figs',
  text: 'Choose another player. Return three cards from their score pile, and all their top figures.',
  alt: '',
  isSpecialAchievement: false,
  isDecree: true,
  decreeImpl: (game, player) => {
    // Choose a player
    const otherPlayers = game
      .players.all()
      .filter(p => p.name !== player.name)
      .map(p => p.name)
    const other = game.actions.choosePlayer(player, otherPlayers)

    // Choose three cards
    const scoreCards = game
      .zones
      .byPlayer(other, 'score')
      .cards()
      .map(c => c.id)
    const cardNames = game.requestInputSingle({
      actor: player.name,
      title: 'Choose Three Cards',
      choices: scoreCards,
      count: 3,
    })

    // Return chosen cards
    const cards = cardNames.map(c => game.cards.byId(c))
    game.actions.returnMany(player, cards)

    // Return top figures
    const topFigures = game
      .cards.tops(other)
      .filter(c => c.checkIsFigure())
    game.actions.returnMany(player, topFigures)
  }
}
