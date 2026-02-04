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

Stats.processAgricolaStats = async function(cursor) {
  const output = {
    count: 0,
    byPlayerCount: {},
    aggregate: { cards: {}, draft: {} },
  }

  for await (const datum of cursor) {
    output.count += 1

    const winner = datum.stats?.result?.player?.name
    const playerCount = datum.stats?.inGame?.metadata?.playerCount || datum.settings?.players?.length || 0
    const inGame = datum.stats?.inGame || {}

    // Initialize player count bucket
    if (!output.byPlayerCount[playerCount]) {
      output.byPlayerCount[playerCount] = { count: 0, cards: {}, draft: {} }
    }
    const bucket = output.byPlayerCount[playerCount]
    bucket.count += 1

    // Process played cards
    for (const [cardId, cardData] of Object.entries(inGame.cards?.played || {})) {
      const cardKey = cardData.name

      // Per-player-count
      if (!bucket.cards[cardKey]) {
        bucket.cards[cardKey] = { id: cardId, name: cardData.name, type: cardData.type, setId: cardData.setId, played: 0, wins: 0 }
      }
      bucket.cards[cardKey].played += 1
      if (cardData.playedBy === winner) {
        bucket.cards[cardKey].wins += 1
      }

      // Aggregate
      if (!output.aggregate.cards[cardKey]) {
        output.aggregate.cards[cardKey] = { id: cardId, name: cardData.name, type: cardData.type, setId: cardData.setId, played: 0, wins: 0 }
      }
      output.aggregate.cards[cardKey].played += 1
      if (cardData.playedBy === winner) {
        output.aggregate.cards[cardKey].wins += 1
      }
    }

    // Process draft picks
    for (const [cardId, pickData] of Object.entries(inGame.draft?.picks || {})) {
      const cardKey = pickData.name

      if (!bucket.draft[cardKey]) {
        bucket.draft[cardKey] = { id: cardId, name: pickData.name, type: pickData.type, setId: pickData.setId, drafted: 0, pickOrders: [] }
      }
      bucket.draft[cardKey].drafted += 1
      bucket.draft[cardKey].pickOrders.push(pickData.pickOrder)

      if (!output.aggregate.draft[cardKey]) {
        output.aggregate.draft[cardKey] = { id: cardId, name: pickData.name, type: pickData.type, setId: pickData.setId, drafted: 0, totalPickOrder: 0, pickCount: 0 }
      }
      output.aggregate.draft[cardKey].drafted += 1
      output.aggregate.draft[cardKey].totalPickOrder += pickData.pickOrder
      output.aggregate.draft[cardKey].pickCount += 1
    }
  }

  // Post-process: calculate averages, convert to sorted arrays
  for (const data of Object.values(output.aggregate.draft)) {
    data.avgPickOrder = data.pickCount > 0 ? data.totalPickOrder / data.pickCount : 0
    delete data.totalPickOrder
    delete data.pickCount
  }

  output.aggregate.cards = Object.entries(output.aggregate.cards).sort((a, b) => b[1].played - a[1].played)
  output.aggregate.draft = Object.entries(output.aggregate.draft).sort((a, b) => b[1].drafted - a[1].drafted)

  for (const bucket of Object.values(output.byPlayerCount)) {
    // Calculate avg pick order per bucket
    for (const data of Object.values(bucket.draft)) {
      data.avgPickOrder = data.pickOrders.length > 0 ? data.pickOrders.reduce((a, b) => a + b, 0) / data.pickOrders.length : 0
      delete data.pickOrders
    }
    bucket.cards = Object.entries(bucket.cards).sort((a, b) => b[1].played - a[1].played)
    bucket.draft = Object.entries(bucket.draft).sort((a, b) => b[1].drafted - a[1].drafted)
  }

  return output
}

export default Stats
