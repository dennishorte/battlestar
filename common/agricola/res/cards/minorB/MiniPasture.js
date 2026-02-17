module.exports = {
  id: "mini-pasture-b002",
  name: "Mini Pasture",
  deck: "minorB",
  number: 2,
  type: "minor",
  cost: { food: 2 },
  passLeft: true,
  category: "Farm Planner",
  text: "Immediately fence a farmyard space, without paying wood for the fences. (If you already have pastures, the new one must be adjacent to an existing one.)",
  onPlay(game, player) {
    const card = this
    const fenceableSpaces = player.getFenceableSpaces()
    // Filter to spaces not already in a pasture
    const available = fenceableSpaces.filter(s => !player.getPastureAtSpace(s.row, s.col))

    if (available.length === 0) {
      game.log.add({
        template: '{player} has no available space for {card}',
        args: { player, card },
      })
      return false
    }

    // If player already has pastures, the new one must be adjacent to an existing one
    const hasPastures = player.farmyard.pastures.length > 0
    let validSpaces = available
    if (hasPastures) {
      validSpaces = available.filter(space => {
        const neighbors = player.getOrthogonalNeighbors(space.row, space.col)
        return neighbors.some(n => player.getPastureAtSpace(n.row, n.col))
      })
    }

    if (validSpaces.length === 0) {
      game.log.add({
        template: '{player} has no valid adjacent space for {card}',
        args: { player, card },
      })
      return false
    }

    const spaceChoices = validSpaces.map(s => `${s.row},${s.col}`)
    spaceChoices.push('Do not build')

    const selection = game.actions.choose(player, spaceChoices, {
      title: 'Choose space for free single-space pasture',
      min: 1,
      max: 1,
    })

    const sel = Array.isArray(selection) ? selection[0] : selection
    if (sel === 'Do not build') {
      return false
    }

    const [row, col] = sel.split(',').map(Number)

    // Calculate fences needed for single space
    const fences = player.calculateFencesForPasture([{ row, col }])

    // Add fences (free — no wood cost)
    for (const fence of fences) {
      player.farmyard.fences.push(fence)
    }

    // Use fences from supply
    for (let i = 0; i < fences.length; i++) {
      player.useFenceFromSupply()
    }

    // Recalculate pastures
    player.recalculatePastures()

    game.log.add({
      template: '{player} uses {card} to build a free single-space pasture at ({row},{col}) with {fenceCount} fences',
      args: { player, card, row, col, fenceCount: fences.length },
    })

    game.callPlayerCardHook(player, 'onBuildPasture', { spaces: [{ row, col }] })

    return true
  },
}
