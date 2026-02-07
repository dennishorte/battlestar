/**
 * Base B Cards for Agricola
 * Minor Improvements and Occupations
 */

const minorImprovements = [
  {
    id: 'mini-pasture',
    name: 'Mini Pasture',
    deck: 'B',
    number: 2,
    type: 'minor',
    cost: { food: 2 },
    passLeft: true,
    category: 'Farm Planner',
    text: 'Immediately fence a farmyard space, without paying wood for the fences. (If you already have pastures, the new one must be adjacent to an existing one.)',
    onPlay(game, player) {
      const fenceableSpaces = player.getFenceableSpaces()
      if (fenceableSpaces.length === 0) {
        game.log.add({
          template: '{player} has no valid space to fence',
          args: { player },
        })
        return
      }

      const spaceChoices = fenceableSpaces.map(s => `${s.row},${s.col}`)
      const selection = game.actions.choose(player, spaceChoices, {
        title: 'Mini Pasture: Choose a space to fence (free)',
        min: 1,
        max: 1,
      })

      const [row, col] = selection[0].split(',').map(Number)

      // Build pasture for free — temporarily give wood so buildPasture validation passes
      const savedWood = player.wood
      player.wood = 100
      player.buildPasture([{ row, col }])
      player.wood = savedWood

      game.log.add({
        template: '{player} fences a space for free using Mini Pasture',
        args: { player },
      })

      game.actions.callOnBuildPastureHooks(player, player.farmyard.pastures[player.farmyard.pastures.length - 1])
    },
  },
  {
    id: 'market-stall',
    name: 'Market Stall',
    deck: 'B',
    number: 8,
    type: 'minor',
    cost: { grain: 1 },
    passLeft: true,
    category: 'Crop Provider',
    text: 'You immediately get 1 vegetable. (Effectively, you are exchanging 1 grain for 1 vegetable.)',
    onPlay(game, player) {
      player.addResource('vegetables', 1)
      game.log.add({
        template: '{player} gets 1 vegetable from Market Stall',
        args: { player },
      })
    },
  },
  {
    id: 'caravan',
    name: 'Caravan',
    deck: 'B',
    number: 10,
    type: 'minor',
    cost: { wood: 3, food: 3 },
    category: 'Farm Planner',
    text: 'This card provides room for 1 person.',
    providesRoom: true,
  },
  {
    id: 'carpenters-parlor',
    name: "Carpenter's Parlor",
    deck: 'B',
    number: 13,
    type: 'minor',
    cost: { wood: 1, stone: 1 },
    category: 'Farm Planner',
    text: 'Wooden rooms only cost you 2 wood and 2 reed each.',
    modifyBuildCost(player, cost, action) {
      if (player.roomType === 'wood' && action === 'build-room') {
        return { wood: 2, reed: 2 }
      }
      return cost
    },
  },
  {
    id: 'mining-hammer',
    name: 'Mining Hammer',
    deck: 'B',
    number: 16,
    type: 'minor',
    cost: { wood: 1 },
    category: 'Farm Planner',
    text: 'When you play this card, you immediately get 1 food. Each time you renovate, you can also build a stable without paying wood.',
    onPlay(game, player) {
      player.addResource('food', 1)
      game.log.add({
        template: '{player} gets 1 food from Mining Hammer',
        args: { player },
      })
    },
    onRenovate(game, player) {
      game.actions.buildFreeStable(player)
    },
  },
  {
    id: 'moldboard-plow',
    name: 'Moldboard Plow',
    deck: 'B',
    number: 19,
    type: 'minor',
    cost: { wood: 2 },
    prereqs: { occupations: 1 },
    category: 'Farm Planner',
    text: 'Place 2 field tiles on this card. Twice this game, when you use the "Farmland" action space, you can also plow 1 field from this card.',
    onPlay(game, player) {
      player.moldboardPlowCharges = 2
      game.log.add({
        template: '{player} places 2 field tiles on Moldboard Plow',
        args: { player },
      })
    },
    onAction(game, player, actionId) {
      if (actionId === 'plow-field' && player.moldboardPlowCharges > 0) {
        player.moldboardPlowCharges--
        game.actions.plowField(player)
      }
    },
  },
  {
    id: 'lasso',
    name: 'Lasso',
    deck: 'B',
    number: 24,
    type: 'minor',
    cost: { reed: 1 },
    category: 'Actions Booster',
    text: 'You can place exactly two people immediately after one another if at least one of them uses the "Sheep Market", "Pig Market", or "Cattle Market" accumulation space.',
    allowDoubleWorkerPlacement: ['take-sheep', 'take-boar', 'take-cattle'],
  },
  {
    id: 'bread-paddle',
    name: 'Bread Paddle',
    deck: 'B',
    number: 25,
    type: 'minor',
    cost: { wood: 1 },
    category: 'Actions Booster',
    text: 'When you play this card, you immediately get 1 food. For each occupation you play, you get an additional "Bake Bread" action.',
    onPlay(game, player) {
      player.addResource('food', 1)
      game.log.add({
        template: '{player} gets 1 food from Bread Paddle',
        args: { player },
      })
    },
    onPlayOccupation(game, player) {
      game.log.add({
        template: '{player} gets an additional Bake Bread action from Bread Paddle',
        args: { player },
      })
      game.actions.bakeBread(player)
    },
  },
  {
    id: 'mantlepiece',
    name: 'Mantlepiece',
    deck: 'B',
    number: 33,
    type: 'minor',
    cost: { stone: 1 },
    vps: -3,
    prereqs: { houseType: ['clay', 'stone'] },
    category: 'Points Provider',
    text: 'When you play this card, you immediately get 1 bonus point for each complete round left to play. You may no longer renovate your house.',
    onPlay(game, player) {
      const roundsLeft = 14 - game.state.round
      if (roundsLeft > 0) {
        player.bonusPoints = (player.bonusPoints || 0) + roundsLeft
        game.log.add({
          template: '{player} gets {points} bonus points from Mantlepiece',
          args: { player, points: roundsLeft },
        })
      }
      player.cannotRenovate = true
    },
  },
  {
    id: 'bottles',
    name: 'Bottles',
    deck: 'B',
    number: 36,
    type: 'minor',
    cost: { special: true },
    vps: 4,
    category: 'Points Provider',
    text: 'For each person you have, you must pay an additional 1 clay and 1 food to play this card.',
    getSpecialCost(player) {
      const people = player.familyMembers
      return { clay: people, food: people }
    },
  },
  {
    id: 'loom',
    name: 'Loom',
    deck: 'B',
    number: 39,
    type: 'minor',
    cost: { wood: 1 },
    vps: 1,
    prereqs: { occupations: 2 },
    category: 'Points Provider',
    text: 'In the field phase of each harvest, if you have at least 1/4/7 sheep, you get 1/2/3 food. During scoring, you get 1 bonus point for every 3 sheep.',
    onHarvest(game, player) {
      const sheep = player.getTotalAnimals('sheep')
      let food = 0
      if (sheep >= 7) {
        food = 3
      }
      else if (sheep >= 4) {
        food = 2
      }
      else if (sheep >= 1) {
        food = 1
      }

      if (food > 0) {
        player.addResource('food', food)
        game.log.add({
          template: '{player} gets {amount} food from Loom',
          args: { player, amount: food },
        })
      }
    },
    getEndGamePoints(player) {
      const sheep = player.getTotalAnimals('sheep')
      return Math.floor(sheep / 3)
    },
  },
  {
    id: 'strawberry-patch',
    name: 'Strawberry Patch',
    deck: 'B',
    number: 45,
    type: 'minor',
    cost: { wood: 1 },
    vps: 2,
    prereqs: { vegetableFields: 2 },
    category: 'Food Provider',
    text: 'Place 1 food on each of the next 3 round spaces. At the start of these rounds, you get the food.',
    onPlay(game, player) {
      const currentRound = game.state.round
      for (let i = 1; i <= 3; i++) {
        const round = currentRound + i
        if (round <= 14) {
          if (!game.state.scheduledFood) {
            game.state.scheduledFood = {}
          }
          if (!game.state.scheduledFood[player.name]) {
            game.state.scheduledFood[player.name] = {}
          }
          game.state.scheduledFood[player.name][round] =
            (game.state.scheduledFood[player.name][round] || 0) + 1
        }
      }
      game.log.add({
        template: '{player} places food on the next 3 round spaces from Strawberry Patch',
        args: { player },
      })
    },
  },
  {
    id: 'herring-pot',
    name: 'Herring Pot',
    deck: 'B',
    number: 47,
    type: 'minor',
    cost: { clay: 1 },
    category: 'Food Provider',
    text: 'Each time you use the "Fishing" accumulation space, place 1 food on each of the next 3 round spaces. At the start of these rounds, you get the food.',
    onAction(game, player, actionId) {
      if (actionId === 'fishing') {
        const currentRound = game.state.round
        for (let i = 1; i <= 3; i++) {
          const round = currentRound + i
          if (round <= 14) {
            if (!game.state.scheduledFood) {
              game.state.scheduledFood = {}
            }
            if (!game.state.scheduledFood[player.name]) {
              game.state.scheduledFood[player.name] = {}
            }
            game.state.scheduledFood[player.name][round] =
              (game.state.scheduledFood[player.name][round] || 0) + 1
          }
        }
        game.log.add({
          template: '{player} places food on the next 3 round spaces from Herring Pot',
          args: { player },
        })
      }
    },
  },
  {
    id: 'butter-churn',
    name: 'Butter Churn',
    deck: 'B',
    number: 50,
    type: 'minor',
    cost: { wood: 1 },
    vps: 1,
    prereqs: { occupations: 3, occupationsAtMost: true },
    category: 'Food Provider',
    text: 'In the field phase of each harvest, you get 1 food for every 3 sheep and 1 food for every 2 cattle you have.',
    onHarvest(game, player) {
      const sheep = player.getTotalAnimals('sheep')
      const cattle = player.getTotalAnimals('cattle')
      const food = Math.floor(sheep / 3) + Math.floor(cattle / 2)
      if (food > 0) {
        player.addResource('food', food)
        game.log.add({
          template: '{player} gets {amount} food from Butter Churn',
          args: { player, amount: food },
        })
      }
    },
  },
  {
    id: 'brook',
    name: 'Brook',
    deck: 'B',
    number: 56,
    type: 'minor',
    cost: {},
    prereqs: { personOnFishing: true },
    category: 'Food Provider',
    text: 'Each time you use one of the four action spaces above the "Fishing" accumulation space (Reed Bank, Clay Pit, Forest, or the round 1 action card), you get 1 additional food.',
    onAction(game, player, actionId) {
      // The four action spaces above Fishing: Reed Bank, Clay Pit, Forest, and round 1 card
      const aboveFishing = ['take-reed', 'take-clay', 'take-wood']
      // Add the round 1 card (which varies based on shuffle)
      const round1CardId = game.state.roundCardDeck[0]?.id
      if (round1CardId) {
        aboveFishing.push(round1CardId)
      }
      if (aboveFishing.includes(actionId)) {
        player.addResource('food', 1)
        game.log.add({
          template: '{player} gets 1 food from Brook',
          args: { player },
        })
      }
    },
  },
  {
    id: 'scullery',
    name: 'Scullery',
    deck: 'B',
    number: 57,
    type: 'minor',
    cost: { wood: 1, clay: 1 },
    category: 'Food Provider',
    text: 'At the start of each round, if you live in a wooden house, you get 1 food.',
    onRoundStart(game, player) {
      if (player.roomType === 'wood') {
        player.addResource('food', 1)
        game.log.add({
          template: '{player} gets 1 food from Scullery',
          args: { player },
        })
      }
    },
  },
  {
    id: 'three-field-rotation',
    name: 'Three-Field Rotation',
    deck: 'B',
    number: 61,
    type: 'minor',
    cost: {},
    prereqs: { occupations: 3 },
    category: 'Food Provider',
    text: 'At the start of the field phase of each harvest, if you have at least 1 grain field, 1 vegetable field, and 1 empty field, you get 3 food.',
    onHarvest(game, player) {
      const hasGrainField = player.getGrainFieldCount() > 0
      let hasVegetableField = false
      let hasEmptyField = false
      const rows = player.farmyard.grid.length
      const cols = player.farmyard.grid[0].length
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const space = player.farmyard.grid[r][c]
          if (space.type === 'field' && space.crop === 'vegetables') {
            hasVegetableField = true
          }
          if (space.type === 'field' && !space.crop) {
            hasEmptyField = true
          }
        }
      }
      if (hasGrainField && hasVegetableField && hasEmptyField) {
        player.addResource('food', 3)
        game.log.add({
          template: '{player} gets 3 food from Three-Field Rotation',
          args: { player },
        })
      }
    },
  },
  {
    id: 'pitchfork',
    name: 'Pitchfork',
    deck: 'B',
    number: 62,
    type: 'minor',
    cost: { wood: 1 },
    category: 'Food Provider',
    text: 'Each time you use the "Grain Seeds" action space, if the "Farmland" action space is occupied you also get 3 food.',
    onAction(game, player, actionId) {
      if (actionId === 'take-grain') {
        const plowSpace = game.state.actionSpaces['plow-field']
        if (plowSpace && plowSpace.occupiedBy) {
          player.addResource('food', 3)
          game.log.add({
            template: '{player} gets 3 food from Pitchfork',
            args: { player },
          })
        }
      }
    },
  },
  {
    id: 'sack-cart',
    name: 'Sack Cart',
    deck: 'B',
    number: 66,
    type: 'minor',
    cost: { wood: 2 },
    prereqs: { occupations: 2 },
    category: 'Crop Provider',
    text: 'Place 1 grain each on the remaining spaces for rounds 5, 8, 11, and 14. At the start of these rounds, you get the grain.',
    onPlay(game, player) {
      const currentRound = game.state.round
      const targetRounds = [5, 8, 11, 14].filter(r => r > currentRound)
      for (const round of targetRounds) {
        if (!game.state.scheduledGrain) {
          game.state.scheduledGrain = {}
        }
        if (!game.state.scheduledGrain[player.name]) {
          game.state.scheduledGrain[player.name] = {}
        }
        game.state.scheduledGrain[player.name][round] =
          (game.state.scheduledGrain[player.name][round] || 0) + 1
      }
      game.log.add({
        template: '{player} schedules grain from Sack Cart',
        args: { player },
      })
    },
  },
  {
    id: 'beanfield',
    name: 'Beanfield',
    deck: 'B',
    number: 68,
    type: 'minor',
    cost: { food: 1 },
    vps: 1,
    prereqs: { occupations: 2 },
    category: 'Crop Provider',
    text: 'This card is a field that can only grow vegetables.',
    providesVegetableField: true,
    onPlay(game, player) {
      // Add a virtual field that can only grow vegetables
      player.addVirtualField({
        cardId: 'beanfield',
        label: 'Beanfield',
        cropRestriction: 'vegetables',
      })
      game.log.add({
        template: '{player} plays Beanfield, gaining a vegetable-only field',
        args: { player },
      })
    },
  },
  {
    id: 'thick-forest',
    name: 'Thick Forest',
    deck: 'B',
    number: 74,
    type: 'minor',
    cost: {},
    prereqs: { clay: 5 },
    category: 'Building Resource Provider',
    text: 'Place 1 wood on each remaining even-numbered round space. At the start of these rounds, you get the wood.',
    onPlay(game, player) {
      const currentRound = game.state.round
      for (let round = 2; round <= 14; round += 2) {
        if (round > currentRound) {
          if (!game.state.scheduledWood) {
            game.state.scheduledWood = {}
          }
          if (!game.state.scheduledWood[player.name]) {
            game.state.scheduledWood[player.name] = {}
          }
          game.state.scheduledWood[player.name][round] =
            (game.state.scheduledWood[player.name][round] || 0) + 1
        }
      }
      game.log.add({
        template: '{player} schedules wood from Thick Forest',
        args: { player },
      })
    },
  },
  {
    id: 'loam-pit',
    name: 'Loam Pit',
    deck: 'B',
    number: 77,
    type: 'minor',
    cost: { food: 1 },
    vps: 1,
    prereqs: { occupations: 3 },
    category: 'Building Resource Provider',
    text: 'Each time you use the "Day Laborer" action space, you also get 3 clay.',
    onAction(game, player, actionId) {
      if (actionId === 'day-laborer') {
        player.addResource('clay', 3)
        game.log.add({
          template: '{player} gets 3 clay from Loam Pit',
          args: { player },
        })
      }
    },
  },
  {
    id: 'hard-porcelain',
    name: 'Hard Porcelain',
    deck: 'B',
    number: 80,
    type: 'minor',
    cost: { clay: 1 },
    category: 'Building Resource Provider',
    text: 'At any time, you can exchange 2/3/4 clay for 1/2/3 stone.',
    allowsAnytimeExchange: true,
    exchangeRates: { clay: 2, stone: 1 },
  },
  {
    id: 'acorns-basket',
    name: 'Acorns Basket',
    deck: 'B',
    number: 84,
    type: 'minor',
    cost: { reed: 1 },
    prereqs: { occupations: 3 },
    category: 'Livestock Provider',
    text: 'Place 1 wild boar on each of the next 2 round spaces. At the start of these rounds, you get the wild boar.',
    onPlay(game, player) {
      const currentRound = game.state.round
      for (let i = 1; i <= 2; i++) {
        const round = currentRound + i
        if (round <= 14) {
          if (!game.state.scheduledBoar) {
            game.state.scheduledBoar = {}
          }
          if (!game.state.scheduledBoar[player.name]) {
            game.state.scheduledBoar[player.name] = {}
          }
          game.state.scheduledBoar[player.name][round] =
            (game.state.scheduledBoar[player.name][round] || 0) + 1
        }
      }
      game.log.add({
        template: '{player} schedules wild boar from Acorns Basket',
        args: { player },
      })
    },
  },
]

const occupations = [
  {
    id: 'cottager',
    name: 'Cottager',
    deck: 'B',
    number: 87,
    type: 'occupation',
    players: '1+',
    category: 'Farm Planner',
    text: 'Each time you use the "Day Laborer" action space, you can also either build exactly 1 room or renovate your house. Either way, you have to pay the cost.',
    onAction(game, player, actionId) {
      if (actionId === 'day-laborer') {
        const choices = []
        if (player.canAffordRoom() && player.getValidRoomBuildSpaces().length > 0) {
          choices.push('Build Room')
        }
        if (player.canRenovate()) {
          choices.push('Renovate')
        }

        if (choices.length === 0) {
          return
        }
        choices.push('Do Nothing')

        const selection = game.actions.choose(player, choices, {
          title: `${this.name}: Build a room or renovate?`,
          min: 1,
          max: 1,
        })

        if (selection[0] === 'Build Room') {
          game.actions.buildRoom(player)
        }
        else if (selection[0] === 'Renovate') {
          game.actions.renovate(player)
        }
      }
    },
  },
  {
    id: 'groom',
    name: 'Groom',
    deck: 'B',
    number: 89,
    type: 'occupation',
    players: '1+',
    category: 'Farm Planner',
    text: 'When you play this card, you immediately get 1 wood. Once you live in a stone house, at the start of each round, you can build exactly 1 stable for 1 wood.',
    onPlay(game, player) {
      player.addResource('wood', 1)
      game.log.add({
        template: '{player} gets 1 wood from Groom',
        args: { player },
      })
    },
    onRoundStart(game, player) {
      if (player.roomType === 'stone' && player.wood >= 1) {
        game.actions.offerBuildStableForWood(player, this)
      }
    },
  },
  {
    id: 'assistant-tiller',
    name: 'Assistant Tiller',
    deck: 'B',
    number: 91,
    type: 'occupation',
    players: '1+',
    category: 'Farm Planner',
    text: 'Each time you use the "Day Laborer" action space, you can also plow 1 field.',
    onAction(game, player, actionId) {
      if (actionId === 'day-laborer') {
        game.actions.plowField(player)
      }
    },
  },
  {
    id: 'master-bricklayer',
    name: 'Master Bricklayer',
    deck: 'B',
    number: 95,
    type: 'occupation',
    players: '1+',
    category: 'Actions Booster',
    text: 'Each time you build a major improvement, reduce the stone cost by the number of rooms you have built onto your initial house.',
    modifyAnyCost(player, cost, action) {
      if (action === 'major-improvement' && cost.stone && cost.stone > 0) {
        const extraRooms = player.getRoomCount() - 2 // initial 2 rooms
        if (extraRooms > 0) {
          return { ...cost, stone: Math.max(0, cost.stone - extraRooms) }
        }
      }
      return cost
    },
  },
  {
    id: 'scholar',
    name: 'Scholar',
    deck: 'B',
    number: 97,
    type: 'occupation',
    players: '1+',
    category: 'Actions Booster',
    text: 'Once you live in a stone house, at the start of each round, you can play an occupation for an occupation cost of 1 food, or a minor improvement (by paying its cost).',
    onRoundStart(game, player) {
      if (player.roomType === 'stone') {
        game.actions.offerPlayOccupationOrImprovement(player, this)
      }
    },
  },
  {
    id: 'organic-farmer',
    name: 'Organic Farmer',
    deck: 'B',
    number: 98,
    type: 'occupation',
    players: '1+',
    category: 'Points Provider',
    text: 'During the scoring, you get 1 bonus point for each pasture containing at least 1 animal while having unused capacity for at least three more animals.',
    getEndGamePoints(player) {
      let points = 0
      const pastures = player.farmyard.pastures || []
      for (const pasture of pastures) {
        if (pasture.animalCount >= 1) {
          const capacity = player.getPastureCapacity(pasture)
          if (capacity - pasture.animalCount >= 3) {
            points++
          }
        }
      }
      return points
    },
  },
  {
    id: 'tutor',
    name: 'Tutor',
    deck: 'B',
    number: 99,
    type: 'occupation',
    players: '1+',
    category: 'Points Provider',
    text: 'During scoring, you get 1 bonus point for each occupation played after this one.',
    onPlay(game, player) {
      player.tutorOccupationCount = player.occupationsPlayed
    },
    getEndGamePoints(player) {
      const afterTutor = player.occupationsPlayed - (player.tutorOccupationCount || 0)
      return Math.max(0, afterTutor)
    },
  },
  {
    id: 'consultant',
    name: 'Consultant',
    deck: 'B',
    number: 102,
    type: 'occupation',
    players: '1+',
    category: 'Goods Provider',
    text: 'When you play this card in a 1-/2-/3-/4- player game, you immediately get 2 grain/3 clay/2 reed/2 sheep.',
    onPlay(game, player) {
      const numPlayers = game.players.all().length
      if (numPlayers <= 1) {
        player.addResource('grain', 2)
        game.log.add({
          template: '{player} gets 2 grain from Consultant',
          args: { player },
        })
      }
      else if (numPlayers === 2) {
        player.addResource('clay', 3)
        game.log.add({
          template: '{player} gets 3 clay from Consultant',
          args: { player },
        })
      }
      else if (numPlayers === 3) {
        player.addResource('reed', 2)
        game.log.add({
          template: '{player} gets 2 reed from Consultant',
          args: { player },
        })
      }
      else {
        if (player.canPlaceAnimals('sheep', 2)) {
          player.addAnimals('sheep', 2)
        }
        game.log.add({
          template: '{player} gets 2 sheep from Consultant',
          args: { player },
        })
      }
    },
  },
  {
    id: 'sheep-walker',
    name: 'Sheep Walker',
    deck: 'B',
    number: 104,
    type: 'occupation',
    players: '1+',
    category: 'Goods Provider',
    text: 'At any time, you can exchange 1 sheep for either 1 wild boar, 1 vegetable, or 1 stone.',
    allowsAnytimeExchange: true,
    exchangeOptions: {
      from: 'sheep',
      to: ['boar', 'vegetables', 'stone'],
    },
  },
  {
    id: 'manservant',
    name: 'Manservant',
    deck: 'B',
    number: 107,
    type: 'occupation',
    players: '1+',
    category: 'Food Provider',
    text: 'Once you live in a stone house, place 3 food on each remaining round space. At the start of these rounds, you get the food.',
    checkTrigger(game, player) {
      if (player.roomType === 'stone' && !player.manservantTriggered) {
        player.manservantTriggered = true
        const currentRound = game.state.round
        for (let round = currentRound + 1; round <= 14; round++) {
          if (!game.state.scheduledFood) {
            game.state.scheduledFood = {}
          }
          if (!game.state.scheduledFood[player.name]) {
            game.state.scheduledFood[player.name] = {}
          }
          game.state.scheduledFood[player.name][round] =
            (game.state.scheduledFood[player.name][round] || 0) + 3
        }
        game.log.add({
          template: '{player} schedules food from Manservant',
          args: { player },
        })
      }
    },
  },
  {
    id: 'oven-firing-boy',
    name: 'Oven Firing Boy',
    deck: 'B',
    number: 108,
    type: 'occupation',
    players: '1+',
    category: 'Food Provider',
    text: 'Each time you use a wood accumulation space, you get an additional "Bake Bread" action.',
    onAction(game, player, actionId) {
      if (actionId === 'take-wood' || actionId === 'copse') {
        game.log.add({
          template: '{player} gets an additional Bake Bread action from Oven Firing Boy',
          args: { player },
        })
        game.actions.bakeBread(player)
      }
    },
  },
  {
    id: 'paper-maker',
    name: 'Paper Maker',
    deck: 'B',
    number: 109,
    type: 'occupation',
    players: '1+',
    category: 'Food Provider',
    text: 'Immediately before playing each occupation after this one, you can pay 1 wood total to get 1 food for each occupation you have in front of you.',
    onPlayOccupation(game, player) {
      if (player.wood >= 1) {
        game.actions.offerPayWoodForOccupationFood(player, this)
      }
    },
  },
  {
    id: 'childless',
    name: 'Childless',
    deck: 'B',
    number: 114,
    type: 'occupation',
    players: '1+',
    category: 'Crop Provider',
    text: 'At the start of each round, if you have at least 3 rooms but only 2 people, you get 1 food and 1 crop of your choice (grain or vegetable).',
    onRoundStart(game, player) {
      if (player.getRoomCount() >= 3 && player.familyMembers === 2) {
        player.addResource('food', 1)
        game.log.add({
          template: '{player} gets 1 food from Childless',
          args: { player },
        })
        game.actions.offerResourceChoice(player, this, ['grain', 'vegetables'])
      }
    },
  },
  {
    id: 'small-scale-farmer',
    name: 'Small-scale Farmer',
    deck: 'B',
    number: 118,
    type: 'occupation',
    players: '1+',
    category: 'Building Resource Provider',
    text: 'As long as you live in a house with exactly 2 rooms, at the start of each round, you get 1 wood.',
    onRoundStart(game, player) {
      if (player.getRoomCount() === 2) {
        player.addResource('wood', 1)
        game.log.add({
          template: '{player} gets 1 wood from Small-scale Farmer',
          args: { player },
        })
      }
    },
  },
  {
    id: 'geologist',
    name: 'Geologist',
    deck: 'B',
    number: 121,
    type: 'occupation',
    players: '1+',
    category: 'Building Resource Provider',
    text: 'Each time you use the "Forest" or "Reed Bank" accumulation space, you also get 1 clay. In games with 3 or more players, this also applies to the "Clay Pit".',
    onAction(game, player, actionId) {
      const triggerActions = ['take-wood', 'take-reed']
      const numPlayers = game.players.all().length
      if (numPlayers >= 3) {
        triggerActions.push('take-clay')
      }
      if (triggerActions.includes(actionId)) {
        player.addResource('clay', 1)
        game.log.add({
          template: '{player} gets 1 clay from Geologist',
          args: { player },
        })
      }
    },
  },
  {
    id: 'roof-ballaster',
    name: 'Roof Ballaster',
    deck: 'B',
    number: 123,
    type: 'occupation',
    players: '1+',
    category: 'Building Resource Provider',
    text: 'When you play this card, you can immediately pay 1 food to get 1 stone for each room you have.',
    onPlay(game, player) {
      if (player.food >= 1 || game.getAnytimeFoodConversionOptions(player).length > 0) {
        game.actions.offerPayFoodForStone(player, this)
      }
    },
  },
  {
    id: 'carpenter',
    name: 'Carpenter',
    deck: 'B',
    number: 126,
    type: 'occupation',
    players: '1+',
    category: 'Building Resource Provider',
    text: 'Every new room only costs you 3 of the appropriate building resource and 2 reed.',
    modifyBuildCost(player, cost, action) {
      if (action === 'build-room') {
        const material = player.roomType
        return { [material]: 3, reed: 2 }
      }
      return cost
    },
  },
  {
    id: 'house-steward',
    name: 'House Steward',
    deck: 'B',
    number: 136,
    type: 'occupation',
    players: '3+',
    category: 'Points Provider',
    text: 'If there are still 1/3/6/9 complete rounds left to play, you immediately get 1/2/3/4 wood. During scoring, each player with the most rooms gets 3 bonus points.',
    onPlay(game, player) {
      const roundsLeft = 14 - game.state.round
      let wood = 0
      if (roundsLeft >= 9) {
        wood = 4
      }
      else if (roundsLeft >= 6) {
        wood = 3
      }
      else if (roundsLeft >= 3) {
        wood = 2
      }
      else if (roundsLeft >= 1) {
        wood = 1
      }

      if (wood > 0) {
        player.addResource('wood', wood)
        game.log.add({
          template: '{player} gets {amount} wood from House Steward',
          args: { player, amount: wood },
        })
      }
    },
    getEndGamePoints(player, game) {
      // Each player with the most rooms gets 3 bonus points
      if (!game) {
        return 0
      }
      const allPlayers = game.players.all()
      const maxRooms = Math.max(...allPlayers.map(p => p.getRoomCount()))
      if (player.getRoomCount() === maxRooms) {
        return 3
      }
      return 0
    },
  },
  {
    id: 'greengrocer',
    name: 'Greengrocer',
    deck: 'B',
    number: 142,
    type: 'occupation',
    players: '3+',
    category: 'Crop Provider',
    text: 'Each time you use the "Grain Seeds" action space, you also get 1 vegetable.',
    onAction(game, player, actionId) {
      if (actionId === 'take-grain') {
        player.addResource('vegetables', 1)
        game.log.add({
          template: '{player} gets 1 vegetable from Greengrocer',
          args: { player },
        })
      }
    },
  },
  {
    id: 'brushwood-collector',
    name: 'Brushwood Collector',
    deck: 'B',
    number: 145,
    type: 'occupation',
    players: '3+',
    category: 'Building Resource Provider',
    text: 'Each time you renovate or build a room, you can replace the required 1 or 2 reed with a total of 1 wood.',
    modifyBuildCost(player, cost, action) {
      if ((action === 'build-room' || action === 'renovate') && cost.reed) {
        return { ...cost, reed: 0, wood: (cost.wood || 0) + 1 }
      }
      return cost
    },
  },
  {
    id: 'storehouse-keeper',
    name: 'Storehouse Keeper',
    deck: 'B',
    number: 156,
    type: 'occupation',
    players: '4+',
    category: 'Goods Provider',
    text: 'Each time you use the "Resource Market" action space, you also get your choice of 1 clay or 1 grain.',
    onAction(game, player, actionId) {
      if (actionId === 'resource-market') {
        game.actions.offerResourceChoice(player, this, ['clay', 'grain'])
      }
    },
  },
  {
    id: 'pastor',
    name: 'Pastor',
    deck: 'B',
    number: 163,
    type: 'occupation',
    players: '4+',
    category: 'Building Resource Provider',
    text: 'Once you are the only player to live in a house with only 2 rooms, you immediately get 3 wood, 2 clay, 1 reed, and 1 stone (only once).',
    checkTrigger(game, player) {
      if (player.pastorTriggered) {
        return
      }

      const allPlayers = game.players.all()
      const twoRoomPlayers = allPlayers.filter(p => p.getRoomCount() === 2)
      if (twoRoomPlayers.length === 1 && twoRoomPlayers[0].name === player.name) {
        player.pastorTriggered = true
        player.addResource('wood', 3)
        player.addResource('clay', 2)
        player.addResource('reed', 1)
        player.addResource('stone', 1)
        game.log.add({
          template: '{player} gets 3 wood, 2 clay, 1 reed, and 1 stone from Pastor',
          args: { player },
        })
      }
    },
  },
  {
    id: 'sheep-whisperer',
    name: 'Sheep Whisperer',
    deck: 'B',
    number: 164,
    type: 'occupation',
    players: '4+',
    category: 'Livestock Provider',
    text: 'Add 2, 5, 8, and 10 to the current round and place 1 sheep on each corresponding round space. At the start of these rounds, you get the sheep.',
    onPlay(game, player) {
      const currentRound = game.state.round
      for (const offset of [2, 5, 8, 10]) {
        const round = currentRound + offset
        if (round <= 14) {
          if (!game.state.scheduledSheep) {
            game.state.scheduledSheep = {}
          }
          if (!game.state.scheduledSheep[player.name]) {
            game.state.scheduledSheep[player.name] = {}
          }
          game.state.scheduledSheep[player.name][round] =
            (game.state.scheduledSheep[player.name][round] || 0) + 1
        }
      }
      game.log.add({
        template: '{player} schedules sheep from Sheep Whisperer',
        args: { player },
      })
    },
  },
  {
    id: 'cattle-feeder',
    name: 'Cattle Feeder',
    deck: 'B',
    number: 166,
    type: 'occupation',
    players: '4+',
    category: 'Livestock Provider',
    text: 'Each time you use the "Grain Seeds" action space, you can also buy 1 cattle for 1 food.',
    onAction(game, player, actionId) {
      if (actionId === 'take-grain' && (player.food >= 1 || game.getAnytimeFoodConversionOptions(player).length > 0)) {
        game.actions.offerBuyAnimal(player, this, 'cattle')
      }
    },
  },
]

function getCardById(id) {
  return [...minorImprovements, ...occupations].find(c => c.id === id)
}

function getCardByName(name) {
  return [...minorImprovements, ...occupations].find(c => c.name === name)
}

function getMinorImprovements() {
  return minorImprovements
}

function getOccupations() {
  return occupations
}

function getAllCards() {
  return [...minorImprovements, ...occupations]
}

function getCardsByPlayerCount(playerCount) {
  return getAllCards().filter(card => {
    if (!card.players) {
      return true
    }
    const minPlayers = parseInt(card.players)
    return playerCount >= minPlayers
  })
}

module.exports = {
  minorImprovements,
  occupations,
  getCardById,
  getCardByName,
  getMinorImprovements,
  getOccupations,
  getAllCards,
  getCardsByPlayerCount,
}
