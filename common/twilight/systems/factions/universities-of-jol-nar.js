module.exports = {
  getCombatModifier() {
    return 1
  },

  getTechPrerequisiteSkips(player, ctx, tech) {
    let skips = 0
    // Analytical: skip 1 prereq for non-unit-upgrade techs
    if (!tech.unitUpgrade) {
      skips += 1
    }
    // Brilliant: skip 1 more prereq (need 2+ techs, non-unit-upgrade only)
    if (!tech.unitUpgrade && (player.getTechIds?.()?.length ?? 0) >= 2) {
      skips += 1
    }
    return skips
  },

  onTechResearched(player, ctx, tech) {
    // Check if brilliant was actually needed (deficit > analytical skips)
    const prereqs = player.getTechPrerequisites()
    const needed = {}
    for (const color of tech.prerequisites) {
      needed[color] = (needed[color] || 0) + 1
    }

    const analyticalSkips = tech.unitUpgrade ? 0 : 1

    let deficit = 0
    for (const [color, count] of Object.entries(needed)) {
      const shortfall = count - (prereqs[color] || 0)
      if (shortfall > 0) {
        deficit += shortfall
      }
    }

    if (deficit <= analyticalSkips) {
      return
    }

    const techIds = player.getTechIds().filter(id => {
      return !(player.exhaustedTechs || []).includes(id)
    })
    if (techIds.length < 2) {
      return
    }

    for (let i = 0; i < 2; i++) {
      const available = player.getTechIds().filter(id => {
        return !(player.exhaustedTechs || []).includes(id)
      })
      const selection = ctx.actions.choose(player, available, {
        title: `Brilliant: Exhaust technology (${i + 1}/2)`,
      })
      if (!player.exhaustedTechs) {
        player.exhaustedTechs = []
      }
      player.exhaustedTechs.push(selection[0])
    }

    ctx.log.add({
      template: '{player} exhausts 2 technologies (Brilliant)',
      args: { player },
    })
  },
}
