module.exports = {
  id: "carpenters-bench-b015",
  name: "Carpenter's Bench",
  deck: "minorB",
  number: 15,
  type: "minor",
  cost: { wood: 1 },
  category: "Farm Planner",
  text: "Immediately after each time you use a wood accumulation space, you can use the taken wood (and only that) to build exactly 1 pasture. If you do, one of the fences is free.",
  onAction(game, player, actionId) {
    if (actionId === 'take-wood' || actionId === 'copse' || actionId === 'take-3-wood' || actionId === 'take-2-wood') {
      const card = this
      const woodTaken = player._lastWoodTaken || 0
      if (woodTaken <= 0) {
        return
      }

      const fenceableSpaces = player.getFenceableSpaces()
      const available = fenceableSpaces.filter(s => !player.getPastureAtSpace(s.row, s.col))
      if (available.length === 0) {
        return
      }

      const selection = game.actions.choose(player, ['Build pasture', 'Skip'], {
        title: `Carpenter's Bench: Build a pasture using ${woodTaken} wood (1 fence free)?`,
        min: 1,
        max: 1,
      })

      const sel = Array.isArray(selection) ? selection[0] : selection
      if (sel === 'Skip') {
        return
      }

      const response = game.actions.choose(player, ['Cancel fencing'], {
        title: "Carpenter's Bench: Select spaces for pasture",
        min: 1,
        max: 1,
        allowsAction: 'build-pasture',
        fenceableSpaces,
      })

      if (response.action === 'build-pasture' && response.spaces) {
        const selectedSpaces = response.spaces
        if (selectedSpaces.length === 0) {
          return
        }

        for (const coord of selectedSpaces) {
          const space = player.getSpace(coord.row, coord.col)
          if (!space || space.type === 'room' || space.type === 'field') {
            return
          }
        }
        if (!player.areSpacesConnected(selectedSpaces)) {
          return
        }

        const fences = player.calculateFencesForPasture(selectedSpaces)
        const fencesNeeded = fences.length

        const remainingFences = 15 - player.getFenceCount()
        if (fencesNeeded > remainingFences) {
          return
        }

        const woodCost = Math.max(0, fencesNeeded - 1)
        if (woodCost > woodTaken) {
          game.log.add({
            template: "Carpenter's Bench: Need {needed} wood for fences (after 1 free), but only took {taken}",
            args: { needed: woodCost, taken: woodTaken },
          })
          return
        }

        if (woodCost > 0) {
          player.payCost({ wood: woodCost })
        }

        for (const fence of fences) {
          player.farmyard.fences.push(fence)
        }

        for (let i = 0; i < fencesNeeded; i++) {
          player.useFenceFromSupply()
        }

        player.recalculatePastures()

        game.log.add({
          template: "{player} uses {card} to build a pasture with {spaces} spaces ({fences} fences, 1 free)",
          args: { player, card, spaces: selectedSpaces.length, fences: fencesNeeded },
        })

        game.callPlayerCardHook(player, 'onBuildPasture', { spaces: selectedSpaces })
        game.callPlayerCardHook(player, 'onBuildFences', fencesNeeded)
      }
    }
  },
}
