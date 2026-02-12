module.exports = {
  id: "writing-chamber-c031",
  name: "Writing Chamber",
  deck: "minorC",
  number: 31,
  type: "minor",
  cost: { wood: 2 },
  category: "Points Provider",
  text: "During scoring, you get a number of bonus points equal to the total of negative points you have, to a maximum of 7 bonus points.",
  getEndGamePoints(player) {
    const scoring = require('../../scoringTables')
    let negativePoints = 0

    // Category penalties (-1 each for missing categories)
    const categories = {
      fields: player.getFieldCount(),
      pastures: player.getPastureCount(),
      grain: player.grain,
      vegetables: player.vegetables,
      sheep: player.getTotalAnimals('sheep'),
      boar: player.getTotalAnimals('boar'),
      cattle: player.getTotalAnimals('cattle'),
    }
    for (const [cat, count] of Object.entries(categories)) {
      const score = scoring.scoreCategory(cat, count)
      if (score < 0) {
        negativePoints += score
      }
    }

    // Unused space penalty (-1 each)
    negativePoints += scoring.scoreUnusedSpaces(player.getUnusedSpaceCount())

    // Begging card penalty (-3 each)
    negativePoints += scoring.scoreBeggingCards(player.beggingCards || 0)

    return Math.min(Math.abs(negativePoints), 7)
  },
}
