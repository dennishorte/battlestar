const Stats = {}

Stats.processInnovationStats = async function(cursor) {
  const output = {
    count: 0,
    cards: {},
    players: {},
    reasons: {},
  }



  for await (const datum of cursor) {
    if (output.count === 0) {
      console.log(datum)
    }

    const winner = datum.stats.result.player.name

    // Total games
    output.count += 1

    // Wins per reason
    const reason = datum.stats.result.reason
    if (!(reason in output.reasons)) {
      output.reasons[reason] = 0
    }
    output.reasons[reason] += 1


    for (const player of datum.settings.players) {
      if (!(player.name in output.players)) {
        output.players[player.name] = {
          count: 0,
          wins: 0,
        }
      }

      const pd = output.players[player.name]
      pd.count += 1

      if (player.name === winner) {
        pd.wins += 1
      }
    }

    for (const card of datum.stats.inGame.melded) {
      if (!(card in output.cards)) {
        output.cards[card] = {
          melded: 0,
          wins: 0,
        }
      }

      const cd = output.cards[card]
      cd.melded += 1

      if (datum.stats.inGame.meldedBy[card] === winner) {
        cd.wins += 1
      }
    }
  }

  output.cards = Object
    .entries(output.cards)
    .sort((l, r) => r[1].melded - l[1].melded)

  output.reasons = Object
    .entries(output.reasons)
    .sort((l, r) => r[1] - l[1])

  return output
}

export default Stats
