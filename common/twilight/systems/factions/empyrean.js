module.exports = {
  canMoveThroughNebulae() {
    return true
  },

  onPreMovement(player, ctx, { activatingPlayer }) {
    if (player.name === activatingPlayer.name) {
      return
    }

    const hasShips = Object.values(ctx.state.units).some(
      su => su.space.some(u => u.owner === player.name)
    )
    if (!hasShips) {
      return
    }

    const choice = ctx.actions.choose(player, ['Allow Passage', 'Deny'], {
      title: `Aetherpassage: Allow ${activatingPlayer.name} to move through your systems?`,
    })

    if (choice[0] === 'Allow Passage') {
      ctx.state.aetherpassageGrant = player.name

      ctx.log.add({
        template: '{empyrean} grants aetherpassage to {player}',
        args: { empyrean: player, player: activatingPlayer },
      })
    }
  },
}
