module.exports = {
  id: "stockman-d168",
  name: "Stockman",
  deck: "occupationD",
  number: 168,
  type: "occupation",
  players: "1+",
  text: "When you build your 2nd/3rd/4th stable, you immediately get 1 cattle/wild boar/sheep, even if built on the same turn (but not retroactively).",
  onBuildStable(game, player, stableNumber) {
    const animals = { 2: 'cattle', 3: 'boar', 4: 'sheep' }
    const animal = animals[stableNumber]
    if (animal && player.canPlaceAnimals(animal, 1)) {
      player.addAnimals(animal, 1)
      game.log.add({
        template: '{player} gets 1 {animal} from {card}',
        args: { player, animal , card: this},
      })
    }
  },
}
