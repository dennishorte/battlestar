module.exports = {
  id: "interim-storage-a081",
  name: "Interim Storage",
  deck: "minorA",
  number: 81,
  type: "minor",
  cost: { food: 2 },
  category: "Building Resource Provider",
  text: "Each time you use a clay/reed/stone accumulation space, place 1 wood/clay/reed on this card. At the start of rounds 7, 11, and 14, move all the goods on this card to your supply.",
  onPlay(game, player) {
    player.interimStorage = { wood: 0, clay: 0, reed: 0 }
  },
  onAction(game, player, actionId) {
    if (!player.interimStorage) {
      return
    }
    if (actionId === 'take-clay' || actionId === 'take-clay-2') {
      player.interimStorage.wood = (player.interimStorage.wood || 0) + 1
    }
    else if (actionId === 'take-reed') {
      player.interimStorage.clay = (player.interimStorage.clay || 0) + 1
    }
    else if (actionId === 'take-stone-1' || actionId === 'take-stone-2') {
      player.interimStorage.reed = (player.interimStorage.reed || 0) + 1
    }
  },
  onRoundStart(game, player, round) {
    if ((round === 7 || round === 11 || round === 14) && player.interimStorage) {
      const storage = player.interimStorage
      if (storage.wood > 0) {
        player.addResource('wood', storage.wood)
      }
      if (storage.clay > 0) {
        player.addResource('clay', storage.clay)
      }
      if (storage.reed > 0) {
        player.addResource('reed', storage.reed)
      }
      game.log.add({
        template: '{player} receives {wood} wood, {clay} clay, {reed} reed from {card}',
        args: { player, wood: storage.wood, clay: storage.clay, reed: storage.reed , card: this},
      })
      player.interimStorage = { wood: 0, clay: 0, reed: 0 }
    }
  },
}
