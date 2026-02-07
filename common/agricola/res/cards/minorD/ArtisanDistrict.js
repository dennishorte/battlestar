module.exports = {
  id: "artisan-district-d030",
  name: "Artisan District",
  deck: "minorD",
  number: 30,
  type: "minor",
  cost: { stone: 1 },
  vps: 1,
  prereqs: { occupations: 3 },
  category: "Points Provider",
  text: "During scoring, you get 2/5/8 bonus points for having 3/4/5 major improvements from the bottom row of the supply board.",
  getEndGamePoints(player) {
    const bottomRowMajors = ['clay-oven', 'stone-oven', 'joinery', 'pottery', 'basketmakers-workshop']
    const count = (player.majorImprovements || []).filter(m => bottomRowMajors.includes(m)).length
    if (count >= 5) {
      return 8
    }
    if (count >= 4) {
      return 5
    }
    if (count >= 3) {
      return 2
    }
    return 0
  },
}
