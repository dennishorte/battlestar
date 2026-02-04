/**
 * Occupations B Cards for Agricola (Revised Edition)
 * Cards B085-B168 - A standalone occupations deck
 */

const occupations = [
  {
    id: 'farm-hand-b085',
    name: 'Farm Hand',
    deck: 'occupationB',
    number: 85,
    type: 'occupation',
    players: '1+',
    text: 'Once you have 4 field tiles arranged in a 2x2, you can use a "Build Stables" action to build a stable in the center of the 2x2. This stable provides room for a person but no animal.',
    allowsCenterStable: true,
    getCenterStableLocation(player) {
      return player.get2x2FieldCenter()
    },
  },
  {
    id: 'truffle-searcher-b086',
    name: 'Truffle Searcher',
    deck: 'occupationB',
    number: 86,
    type: 'occupation',
    players: '1+',
    text: 'This card can hold a number of wild boar equal to the number of completed feeding phases.',
    holdsAnimals: { boar: true },
    getAnimalCapacity(game) {
      return game.getCompletedFeedingPhases()
    },
  },
  {
    id: 'cottager-b087',
    name: 'Cottager',
    deck: 'occupationB',
    number: 87,
    type: 'occupation',
    players: '1+',
    text: 'Each time you use the "Day Laborer" action space, you can also either build exactly 1 room or renovate your house. Either way, you have to pay the cost.',
    onAction(game, player, actionId) {
      if (actionId === 'day-laborer') {
        game.actions.offerCottagerBuild(player, this)
      }
    },
  },
  {
    id: 'established-person-b088',
    name: 'Established Person',
    deck: 'occupationB',
    number: 88,
    type: 'occupation',
    players: '1+',
    text: 'If your house has exactly 2 rooms, immediately renovate it without paying any building resources. If you do, you can immediately afterward take a "Build Fences" action.',
    onPlay(game, player) {
      if (player.getRoomCount() === 2 && player.canRenovate()) {
        game.actions.freeRenovation(player, this)
        game.actions.offerBuildFences(player, this)
      }
    },
  },
  {
    id: 'groom-b089',
    name: 'Groom',
    deck: 'occupationB',
    number: 89,
    type: 'occupation',
    players: '1+',
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
        game.actions.offerBuildStable(player, this, { cost: { wood: 1 } })
      }
    },
  },
  {
    id: 'cooperative-plower-b090',
    name: 'Cooperative Plower',
    deck: 'occupationB',
    number: 90,
    type: 'occupation',
    players: '1+',
    text: 'Each time you use the "Farmland" action space while the "Grain Seeds" action space is occupied, you can plow 1 additional field.',
    onAction(game, player, actionId) {
      if (actionId === 'plow-field' && game.isActionOccupied('take-grain')) {
        game.actions.offerAdditionalPlow(player, this)
      }
    },
  },
  {
    id: 'assistant-tiller-b091',
    name: 'Assistant Tiller',
    deck: 'occupationB',
    number: 91,
    type: 'occupation',
    players: '1+',
    text: 'Each time you use the "Day Laborer" action space, you can also plow 1 field.',
    onAction(game, player, actionId) {
      if (actionId === 'day-laborer') {
        game.actions.offerPlow(player, this)
      }
    },
  },
  {
    id: 'little-stick-knitter-b092',
    name: 'Little Stick Knitter',
    deck: 'occupationB',
    number: 92,
    type: 'occupation',
    players: '1+',
    text: 'From Round 5 on, each time you use the "Sheep Market" accumulation space, you can also take a "Family Growth with Room Only" action.',
    onAction(game, player, actionId) {
      if (actionId === 'take-sheep' && game.state.round >= 5 && player.canGrowFamily()) {
        game.actions.offerFamilyGrowthWithRoom(player, this)
      }
    },
  },
  {
    id: 'confidant-b093',
    name: 'Confidant',
    deck: 'occupationB',
    number: 93,
    type: 'occupation',
    players: '1+',
    text: 'Place 1 food from your supply on each of the next 2, 3, or 4 round spaces. At the start of these rounds, you get the food back and your choice of a "Sow" or "Build Fences" action.',
    onPlay(game, player) {
      game.actions.offerConfidantSetup(player, this)
    },
  },
  {
    id: 'stock-protector-b094',
    name: 'Stock Protector',
    deck: 'occupationB',
    number: 94,
    type: 'occupation',
    players: '1+',
    text: 'Each time before you use the "Fencing" action space, you get 2 wood. Immediately after that "Fencing" action, you can place another person.',
    onBeforeAction(game, player, actionId) {
      if (actionId === 'fencing') {
        player.addResource('wood', 2)
        game.log.add({
          template: '{player} gets 2 wood from Stock Protector',
          args: { player },
        })
      }
    },
    onAction(game, player, actionId) {
      if (actionId === 'fencing') {
        game.actions.offerExtraPerson(player, this)
      }
    },
  },
  {
    id: 'master-bricklayer-b095',
    name: 'Master Bricklayer',
    deck: 'occupationB',
    number: 95,
    type: 'occupation',
    players: '1+',
    text: 'Each time you build a major improvement, reduce the stone cost by the number of rooms you have built onto your initial house.',
    modifyMajorImprovementCost(player, cost) {
      const additionalRooms = player.getRoomCount() - 2 // Initial 2 rooms
      if (cost.stone && cost.stone > 0 && additionalRooms > 0) {
        return { ...cost, stone: Math.max(0, cost.stone - additionalRooms) }
      }
      return cost
    },
  },
  {
    id: 'tree-farm-joiner-b096',
    name: 'Tree Farm Joiner',
    deck: 'occupationB',
    number: 96,
    type: 'occupation',
    players: '1+',
    text: 'Place 1 wood on each of the next 2 odd-numbered round spaces. At the start of these rounds, you get the wood and, immediately afterward, a "Minor Improvement" action.',
    onPlay(game, player) {
      const currentRound = game.state.round
      let count = 0
      for (let round = currentRound + 1; round <= 14 && count < 2; round++) {
        if (round % 2 === 1) {
          if (!game.state.scheduledWoodWithMinor) {
            game.state.scheduledWoodWithMinor = {}
          }
          if (!game.state.scheduledWoodWithMinor[player.name]) {
            game.state.scheduledWoodWithMinor[player.name] = []
          }
          game.state.scheduledWoodWithMinor[player.name].push(round)
          count++
        }
      }
      game.log.add({
        template: '{player} schedules wood and minor improvements from Tree Farm Joiner',
        args: { player },
      })
    },
  },
  {
    id: 'scholar-b097',
    name: 'Scholar',
    deck: 'occupationB',
    number: 97,
    type: 'occupation',
    players: '1+',
    text: 'Once you live in a stone house, at the start of each round, you can play an occupation for an occupation cost of 1 food, or a minor improvement (by paying its cost).',
    onRoundStart(game, player) {
      if (player.roomType === 'stone') {
        game.actions.offerScholarPlay(player, this)
      }
    },
  },
  {
    id: 'organic-farmer-b098',
    name: 'Organic Farmer',
    deck: 'occupationB',
    number: 98,
    type: 'occupation',
    players: '1+',
    text: 'During scoring, you get 1 bonus point for each pasture containing at least 1 animal while having unused capacity for at least three more animals.',
    getEndGamePoints(player) {
      return player.getPasturesWithSpareCapacity(3)
    },
  },
  {
    id: 'tutor-b099',
    name: 'Tutor',
    deck: 'occupationB',
    number: 99,
    type: 'occupation',
    players: '1+',
    text: 'During scoring, you get 1 bonus point for each occupation played after this one.',
    getEndGamePoints(player) {
      return player.getOccupationsPlayedAfter(this.id)
    },
  },
  {
    id: 'clutterer-b100',
    name: 'Clutterer',
    deck: 'occupationB',
    number: 100,
    type: 'occupation',
    players: '1+',
    text: 'During scoring, you get 1 bonus point for each card played after this one that has "accumulation space(s)" in its text.',
    getEndGamePoints(player) {
      return player.getCardsWithTextPlayedAfter(this.id, 'accumulation space')
    },
  },
  {
    id: 'furniture-carpenter-b101',
    name: 'Furniture Carpenter',
    deck: 'occupationB',
    number: 101,
    type: 'occupation',
    players: '1+',
    text: 'Each harvest, if any player (including you) owns the Joinery or an upgrade thereof, you can buy exactly 1 bonus point for 2 food.',
    onHarvest(game, player) {
      if (game.anyPlayerOwnsJoinery() && player.food >= 2) {
        game.actions.offerBuyBonusPoint(player, this, 2)
      }
    },
  },
  {
    id: 'consultant-b102',
    name: 'Consultant',
    deck: 'occupationB',
    number: 102,
    type: 'occupation',
    players: '1+',
    text: 'When you play this card in a 1-/2-/3-/4- player game, you immediately get 2 grain/3 clay/2 reed/2 sheep.',
    onPlay(game, player) {
      const playerCount = game.players.count()
      if (playerCount === 1) {
        player.addResource('grain', 2)
        game.log.add({
          template: '{player} gets 2 grain from Consultant',
          args: { player },
        })
      }
      else if (playerCount === 2) {
        player.addResource('clay', 3)
        game.log.add({
          template: '{player} gets 3 clay from Consultant',
          args: { player },
        })
      }
      else if (playerCount === 3) {
        player.addResource('reed', 2)
        game.log.add({
          template: '{player} gets 2 reed from Consultant',
          args: { player },
        })
      }
      else {
        if (player.canPlaceAnimals('sheep', 2)) {
          player.addAnimals('sheep', 2)
          game.log.add({
            template: '{player} gets 2 sheep from Consultant',
            args: { player },
          })
        }
      }
    },
  },
  {
    id: 'field-merchant-b103',
    name: 'Field Merchant',
    deck: 'occupationB',
    number: 103,
    type: 'occupation',
    players: '1+',
    text: 'When you play this card, you immediately get 1 wood and 1 reed. Each time you decline a "Minor/Major Improvement" action, you get 1 food/vegetable instead.',
    onPlay(game, player) {
      player.addResource('wood', 1)
      player.addResource('reed', 1)
      game.log.add({
        template: '{player} gets 1 wood and 1 reed from Field Merchant',
        args: { player },
      })
    },
    onDeclineMinorImprovement(game, player) {
      player.addResource('food', 1)
      game.log.add({
        template: '{player} gets 1 food from Field Merchant',
        args: { player },
      })
    },
    onDeclineMajorImprovement(game, player) {
      player.addResource('vegetables', 1)
      game.log.add({
        template: '{player} gets 1 vegetable from Field Merchant',
        args: { player },
      })
    },
  },
  {
    id: 'sheep-walker-b104',
    name: 'Sheep Walker',
    deck: 'occupationB',
    number: 104,
    type: 'occupation',
    players: '1+',
    text: 'At any time, you can exchange 1 sheep for either 1 wild boar, 1 vegetable, or 1 stone.',
    allowsAnytimeExchange: true,
    exchangeOptions: [
      { from: { sheep: 1 }, to: { boar: 1 } },
      { from: { sheep: 1 }, to: { vegetables: 1 } },
      { from: { sheep: 1 }, to: { stone: 1 } },
    ],
  },
  {
    id: 'case-builder-b105',
    name: 'Case Builder',
    deck: 'occupationB',
    number: 105,
    type: 'occupation',
    players: '1+',
    text: 'When you play this card, you immediately get 1 good of each of the following types, if you have at least 2 of that good already: food, grain, vegetable, reed, wood.',
    onPlay(game, player) {
      const resources = ['food', 'grain', 'vegetables', 'reed', 'wood']
      for (const res of resources) {
        if ((player[res] || 0) >= 2) {
          player.addResource(res, 1)
          game.log.add({
            template: '{player} gets 1 {resource} from Case Builder',
            args: { player, resource: res },
          })
        }
      }
    },
  },
  {
    id: 'moral-crusader-b106',
    name: 'Moral Crusader',
    deck: 'occupationB',
    number: 106,
    type: 'occupation',
    players: '1+',
    text: 'Immediately before the start of each round, if there are goods on remaining round spaces that are promised to you, you get 1 food.',
    onBeforeRoundStart(game, player) {
      if (game.hasScheduledGoodsForPlayer(player)) {
        player.addResource('food', 1)
        game.log.add({
          template: '{player} gets 1 food from Moral Crusader',
          args: { player },
        })
      }
    },
  },
  {
    id: 'manservant-b107',
    name: 'Manservant',
    deck: 'occupationB',
    number: 107,
    type: 'occupation',
    players: '1+',
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
          template: '{player} schedules 3 food per round from Manservant',
          args: { player },
        })
      }
    },
  },
  {
    id: 'oven-firing-boy-b108',
    name: 'Oven Firing Boy',
    deck: 'occupationB',
    number: 108,
    type: 'occupation',
    players: '1+',
    text: 'Each time you use a wood accumulation space, you get an additional "Bake Bread" action.',
    onAction(game, player, actionId) {
      const woodActions = ['take-wood', 'copse', 'take-3-wood', 'take-2-wood']
      if (woodActions.includes(actionId)) {
        game.actions.offerBakeBread(player, this)
      }
    },
  },
  {
    id: 'paper-maker-b109',
    name: 'Paper Maker',
    deck: 'occupationB',
    number: 109,
    type: 'occupation',
    players: '1+',
    text: 'Immediately before playing each occupation after this one, you can pay 1 wood total to get 1 food for each occupation you have in front of you.',
    onBeforePlayOccupation(game, player) {
      if (player.wood >= 1) {
        game.actions.offerPaperMakerBonus(player, this)
      }
    },
  },
  {
    id: 'pavior-b110',
    name: 'Pavior',
    deck: 'occupationB',
    number: 110,
    type: 'occupation',
    players: '1+',
    text: 'At the end of each preparation phase, if you have at least 1 stone in your supply, you get 1 food. In round 14, you get 1 vegetable instead.',
    onPreparationEnd(game, player) {
      if (player.stone >= 1) {
        if (game.state.round === 14) {
          player.addResource('vegetables', 1)
          game.log.add({
            template: '{player} gets 1 vegetable from Pavior',
            args: { player },
          })
        }
        else {
          player.addResource('food', 1)
          game.log.add({
            template: '{player} gets 1 food from Pavior',
            args: { player },
          })
        }
      }
    },
  },
  {
    id: 'rustic-b111',
    name: 'Rustic',
    deck: 'occupationB',
    number: 111,
    type: 'occupation',
    players: '1+',
    text: 'For each clay room you build, you get 2 food and 1 bonus point. (This does not apply to stone rooms and renovated wood rooms).',
    onBuildRoom(game, player, roomType, isRenovation) {
      if (roomType === 'clay' && !isRenovation) {
        player.addResource('food', 2)
        player.bonusPoints = (player.bonusPoints || 0) + 1
        game.log.add({
          template: '{player} gets 2 food and 1 bonus point from Rustic',
          args: { player },
        })
      }
    },
  },
  {
    id: 'silokeeper-b112',
    name: 'Silokeeper',
    deck: 'occupationB',
    number: 112,
    type: 'occupation',
    players: '1+',
    text: 'Each time you use the action space card that has been revealed right before the most recent harvest, you also get 1 grain.',
    onAction(game, player, actionId) {
      const preHarvestActionRounds = [4, 7, 9, 11, 13]
      const lastHarvest = game.state.lastHarvestRound || 0
      const preHarvestRound = preHarvestActionRounds.find(r => r === lastHarvest) || 0
      if (preHarvestRound > 0 && game.getActionSpaceRound(actionId) === preHarvestRound) {
        player.addResource('grain', 1)
        game.log.add({
          template: '{player} gets 1 grain from Silokeeper',
          args: { player },
        })
      }
    },
  },
  {
    id: 'patch-caregiver-b113',
    name: 'Patch Caregiver',
    deck: 'occupationB',
    number: 113,
    type: 'occupation',
    players: '1+',
    text: 'When you play this card, you can choose to buy 1 grain for 1 food, or 1 vegetable for 3 food. This card is a field.',
    isField: true,
    onPlay(game, player) {
      game.actions.offerPatchCaregiverChoice(player, this)
    },
  },
  {
    id: 'childless-b114',
    name: 'Childless',
    deck: 'occupationB',
    number: 114,
    type: 'occupation',
    players: '1+',
    text: 'At the start of each round, if you have at least 3 rooms but only 2 people, you get 1 food and 1 crop of your choice (grain or vegetable.)',
    onRoundStart(game, player) {
      if (player.getRoomCount() >= 3 && player.getFamilySize() === 2) {
        player.addResource('food', 1)
        game.actions.offerResourceChoice(player, this, ['grain', 'vegetables'])
      }
    },
  },
  {
    id: 'tinsmith-master-b115',
    name: 'Tinsmith Master',
    deck: 'occupationB',
    number: 115,
    type: 'occupation',
    players: '1+',
    text: 'You can hold 1 additional animal in each pasture without a stable. Each time you sow in a field, you can place 1 additional crop of the respective type in that field.',
    modifyPastureCapacity(player, pasture, baseCapacity) {
      if (!pasture.hasStable) {
        return baseCapacity + 1
      }
      return baseCapacity
    },
    modifySowAmount(game, player, amount) {
      return amount + 1
    },
  },
  {
    id: 'shoreforester-b116',
    name: 'Shoreforester',
    deck: 'occupationB',
    number: 116,
    type: 'occupation',
    players: '1+',
    text: 'When you play this card, and each time 1 reed is placed on an empty "Reed Bank" accumulation space in the preparation phase, you get 1 wood.',
    onPlay(game, player) {
      player.addResource('wood', 1)
      game.log.add({
        template: '{player} gets 1 wood from Shoreforester',
        args: { player },
      })
    },
    onReedBankReplenish(game, player) {
      player.addResource('wood', 1)
      game.log.add({
        template: '{player} gets 1 wood from Shoreforester',
        args: { player },
      })
    },
  },
  {
    id: 'informant-b117',
    name: 'Informant',
    deck: 'occupationB',
    number: 117,
    type: 'occupation',
    players: '1+',
    text: 'After each work phase, if you have more stone than clay in your supply, you get 1 wood.',
    onWorkPhaseEnd(game, player) {
      if (player.stone > player.clay) {
        player.addResource('wood', 1)
        game.log.add({
          template: '{player} gets 1 wood from Informant',
          args: { player },
        })
      }
    },
  },
  {
    id: 'small-scale-farmer-b118',
    name: 'Small-scale Farmer',
    deck: 'occupationB',
    number: 118,
    type: 'occupation',
    players: '1+',
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
    id: 'lumberjack-b119',
    name: 'Lumberjack',
    deck: 'occupationB',
    number: 119,
    type: 'occupation',
    players: '1+',
    text: 'Immediately place 1 wood on each of the next round spaces, up to the number of fences you built. At the start of these rounds, you get the wood.',
    onPlay(game, player) {
      const fenceCount = player.getFenceCount()
      const currentRound = game.state.round
      for (let i = 1; i <= fenceCount && currentRound + i <= 14; i++) {
        const round = currentRound + i
        if (!game.state.scheduledWood) {
          game.state.scheduledWood = {}
        }
        if (!game.state.scheduledWood[player.name]) {
          game.state.scheduledWood[player.name] = {}
        }
        game.state.scheduledWood[player.name][round] =
          (game.state.scheduledWood[player.name][round] || 0) + 1
      }
      game.log.add({
        template: '{player} schedules wood from Lumberjack',
        args: { player },
      })
    },
  },
  {
    id: 'sweep-b120',
    name: 'Sweep',
    deck: 'occupationB',
    number: 120,
    type: 'occupation',
    players: '1+',
    text: 'Each time before you use the action space card left of the card that has been most recently placed on a round space, you get 2 clay.',
    onBeforeAction(game, player, actionId) {
      const mostRecentRound = game.getMostRecentlyRevealedRound()
      const leftOfRecentRound = mostRecentRound - 1
      if (leftOfRecentRound >= 1 && leftOfRecentRound <= 12 && game.getActionSpaceRound(actionId) === leftOfRecentRound) {
        player.addResource('clay', 2)
        game.log.add({
          template: '{player} gets 2 clay from Sweep',
          args: { player },
        })
      }
    },
  },
  {
    id: 'geologist-b121',
    name: 'Geologist',
    deck: 'occupationB',
    number: 121,
    type: 'occupation',
    players: '1+',
    text: 'Each time you use the "Forest" or "Reed Bank" accumulation space, you also get 1 clay. In games with 3 or more players, this also applies to the "Clay Pit".',
    onAction(game, player, actionId) {
      if (actionId === 'take-wood' || actionId === 'take-reed') {
        player.addResource('clay', 1)
        game.log.add({
          template: '{player} gets 1 clay from Geologist',
          args: { player },
        })
      }
      else if (actionId === 'take-clay' && game.players.count() >= 3) {
        player.addResource('clay', 1)
        game.log.add({
          template: '{player} gets 1 clay from Geologist',
          args: { player },
        })
      }
    },
  },
  {
    id: 'mineralogist-b122',
    name: 'Mineralogist',
    deck: 'occupationB',
    number: 122,
    type: 'occupation',
    players: '1+',
    text: 'Each time you use a clay/stone accumulation space, you also get 1 of the other good, stone/clay.',
    onAction(game, player, actionId) {
      if (actionId === 'take-clay' || actionId === 'take-clay-2') {
        player.addResource('stone', 1)
        game.log.add({
          template: '{player} gets 1 stone from Mineralogist',
          args: { player },
        })
      }
      else if (actionId === 'take-stone-1' || actionId === 'take-stone-2') {
        player.addResource('clay', 1)
        game.log.add({
          template: '{player} gets 1 clay from Mineralogist',
          args: { player },
        })
      }
    },
  },
  {
    id: 'roof-ballaster-b123',
    name: 'Roof Ballaster',
    deck: 'occupationB',
    number: 123,
    type: 'occupation',
    players: '1+',
    text: 'When you play this card, you can immediately pay 1 food to get 1 stone for each room you have.',
    onPlay(game, player) {
      if (player.food >= 1) {
        game.actions.offerRoofBallasterBonus(player, this)
      }
    },
  },
  {
    id: 'trimmer-b124',
    name: 'Trimmer',
    deck: 'occupationB',
    number: 124,
    type: 'occupation',
    players: '1+',
    text: 'Each time after you enclose at least one farmyard space, you get 2 stone. (Subdividing an existing pasture does not count.)',
    onBuildPasture(game, player, pasture, isSubdivision) {
      if (!isSubdivision) {
        player.addResource('stone', 2)
        game.log.add({
          template: '{player} gets 2 stone from Trimmer',
          args: { player },
        })
      }
    },
  },
  {
    id: 'estate-worker-b125',
    name: 'Estate Worker',
    deck: 'occupationB',
    number: 125,
    type: 'occupation',
    players: '1+',
    text: 'Place 1 wood, 1 clay, 1 reed, and 1 stone in this order on the next 4 round spaces. At the start of these rounds, you get the respective building resource.',
    onPlay(game, player) {
      const currentRound = game.state.round
      const resources = ['wood', 'clay', 'reed', 'stone']
      for (let i = 0; i < 4; i++) {
        const round = currentRound + 1 + i
        if (round <= 14) {
          const res = resources[i]
          const key = `scheduled${res.charAt(0).toUpperCase() + res.slice(1)}`
          if (!game.state[key]) {
            game.state[key] = {}
          }
          if (!game.state[key][player.name]) {
            game.state[key][player.name] = {}
          }
          game.state[key][player.name][round] =
            (game.state[key][player.name][round] || 0) + 1
        }
      }
      game.log.add({
        template: '{player} schedules building resources from Estate Worker',
        args: { player },
      })
    },
  },
  {
    id: 'carpenter-b126',
    name: 'Carpenter',
    deck: 'occupationB',
    number: 126,
    type: 'occupation',
    players: '1+',
    text: 'Every new room only costs you 3 of the appropriate building resource and 2 reed.',
    modifyRoomCost(player, _cost) {
      const material = player.roomType
      return { [material]: 3, reed: 2 }
    },
  },
  {
    id: 'seducer-b127',
    name: 'Seducer',
    deck: 'occupationB',
    number: 127,
    type: 'occupation',
    players: '1+',
    text: 'When you play this card in Round 5 or later, you can immediately pay 1 stone, 1 grain, 1 vegetable, and 1 sheep to take a "Family Growth Even without Room" action.',
    onPlay(game, player) {
      if (game.state.round >= 5) {
        game.actions.offerSeducerGrowth(player, this)
      }
    },
  },
  {
    id: 'plumber-b128',
    name: 'Plumber',
    deck: 'occupationB',
    number: 128,
    type: 'occupation',
    players: '1+',
    text: 'Each time after you use the "Major Improvement" action space, you can take a "Renovation" action for 2 clay or 2 stone less.',
    onAction(game, player, actionId) {
      if (actionId === 'major-improvement') {
        game.actions.offerDiscountedRenovation(player, this, 2)
      }
    },
  },
  {
    id: 'seatmate-b129',
    name: 'Seatmate',
    deck: 'occupationB',
    number: 129,
    type: 'occupation',
    players: '1+',
    text: 'You can use the action space on round space 13 even if it is occupied by one or more people of the players to your immediate left and right.',
    ignoresOccupancyForRound13FromNeighbors: true,
  },
  {
    id: 'full-peasant-b130',
    name: 'Full Peasant',
    deck: 'occupationB',
    number: 130,
    type: 'occupation',
    players: '1+',
    text: 'Each time after you use the "Grain Utilization" or "Fencing" action space while the other is unoccupied, you can pay 1 food to use that other space with the same person.',
    onAction(game, player, actionId) {
      if (actionId === 'sow-bake' && !game.isActionOccupied('fencing') && player.food >= 1) {
        game.actions.offerUseOtherSpace(player, this, 'fencing', { cost: { food: 1 } })
      }
      else if (actionId === 'fencing' && !game.isActionOccupied('sow-bake') && player.food >= 1) {
        game.actions.offerUseOtherSpace(player, this, 'sow-bake', { cost: { food: 1 } })
      }
    },
  },
  {
    id: 'equipper-b131',
    name: 'Equipper',
    deck: 'occupationB',
    number: 131,
    type: 'occupation',
    players: '1+',
    text: 'Immediately after each time you use a wood accumulation space, you can play a minor improvement.',
    onAction(game, player, actionId) {
      const woodActions = ['take-wood', 'copse', 'take-3-wood', 'take-2-wood']
      if (woodActions.includes(actionId)) {
        game.actions.offerPlayMinorImprovement(player, this)
      }
    },
  },
  {
    id: 'estate-master-b132',
    name: 'Estate Master',
    deck: 'occupationB',
    number: 132,
    type: 'occupation',
    players: '1+',
    text: 'Once you have no unused farmyard spaces left, you get 1 bonus point for each vegetable that you harvest.',
    onHarvestVegetable(game, player, count) {
      if (player.getUnusedSpaces() === 0) {
        player.bonusPoints = (player.bonusPoints || 0) + count
        game.log.add({
          template: '{player} gets {amount} bonus points from Estate Master',
          args: { player, amount: count },
        })
      }
    },
  },
  {
    id: 'village-peasant-b133',
    name: 'Village Peasant',
    deck: 'occupationB',
    number: 133,
    type: 'occupation',
    players: '1+',
    text: 'At the start of scoring, you get a number of vegetables equal to the smallest of the numbers of major improvements, minor improvements, and occupations you have.',
    onScoring(game, player) {
      const minCount = Math.min(
        player.getMajorImprovementCount(),
        player.getMinorImprovementCount(),
        player.getOccupationCount()
      )
      if (minCount > 0) {
        player.addResource('vegetables', minCount)
        game.log.add({
          template: '{player} gets {amount} vegetables from Village Peasant',
          args: { player, amount: minCount },
        })
      }
    },
  },
  {
    id: 'housebook-master-b134',
    name: 'Housebook Master',
    deck: 'occupationB',
    number: 134,
    type: 'occupation',
    players: '1+',
    text: 'After playing this card, if you renovate to stone in round 13/12/11 or before, you immediately get 1/2/3 food and 1/2/3 bonus points.',
    onRenovate(game, player, fromType, toType) {
      if (toType === 'stone') {
        let bonus = 0
        if (game.state.round <= 11) {
          bonus = 3
        }
        else if (game.state.round <= 12) {
          bonus = 2
        }
        else if (game.state.round <= 13) {
          bonus = 1
        }
        if (bonus > 0) {
          player.addResource('food', bonus)
          player.bonusPoints = (player.bonusPoints || 0) + bonus
          game.log.add({
            template: '{player} gets {amount} food and {amount} bonus points from Housebook Master',
            args: { player, amount: bonus },
          })
        }
      }
    },
  },
  {
    id: 'nutrition-expert-b135',
    name: 'Nutrition Expert',
    deck: 'occupationB',
    number: 135,
    type: 'occupation',
    players: '1+',
    text: 'At the start of each round, you can exchange a set comprised of 1 animal of any type, 1 grain, and 1 vegetable for 5 food and 2 bonus points.',
    onRoundStart(game, player) {
      if (player.grain >= 1 && player.vegetables >= 1 && player.getTotalAnimals() >= 1) {
        game.actions.offerNutritionExpertExchange(player, this)
      }
    },
  },
  {
    id: 'house-steward-b136',
    name: 'House Steward',
    deck: 'occupationB',
    number: 136,
    type: 'occupation',
    players: '3+',
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
    getEndGamePointsAllPlayers(game) {
      const bonuses = {}
      let maxRooms = 0
      for (const player of game.players.all()) {
        maxRooms = Math.max(maxRooms, player.getRoomCount())
      }
      for (const player of game.players.all()) {
        if (player.getRoomCount() === maxRooms) {
          bonuses[player.name] = 3
        }
      }
      return bonuses
    },
  },
  {
    id: 'wholesaler-b137',
    name: 'Wholesaler',
    deck: 'occupationB',
    number: 137,
    type: 'occupation',
    players: '3+',
    text: 'Place 1 vegetable, 1 wild boar, 1 stone, and 1 cattle on this card. Each time you use an action space card on round spaces 8 to 11, you get the corresponding good from this card.',
    onPlay(_game, _player) {
      this.goods = { 8: 'vegetables', 9: 'boar', 10: 'stone', 11: 'cattle' }
    },
    onAction(game, player, actionId) {
      const round = game.getActionSpaceRound(actionId)
      if (this.goods && this.goods[round]) {
        const good = this.goods[round]
        if (good === 'boar' || good === 'cattle') {
          if (player.canPlaceAnimals(good, 1)) {
            player.addAnimals(good, 1)
            game.log.add({
              template: '{player} gets 1 {animal} from Wholesaler',
              args: { player, animal: good },
            })
          }
        }
        else {
          player.addResource(good, 1)
          game.log.add({
            template: '{player} gets 1 {resource} from Wholesaler',
            args: { player, resource: good },
          })
        }
        delete this.goods[round]
      }
    },
  },
  {
    id: 'forest-guardian-b138',
    name: 'Forest Guardian',
    deck: 'occupationB',
    number: 138,
    type: 'occupation',
    players: '3+',
    text: 'When you play this card, you immediately get 2 wood. Each time before another player takes at least 5 wood from an accumulation space, they must first pay you 1 food.',
    onPlay(game, player) {
      player.addResource('wood', 2)
      game.log.add({
        template: '{player} gets 2 wood from Forest Guardian',
        args: { player },
      })
    },
    onAnyBeforeAction(game, actingPlayer, actionId, cardOwner) {
      const woodActions = ['take-wood', 'copse', 'take-3-wood', 'take-2-wood']
      if (woodActions.includes(actionId) && actingPlayer.name !== cardOwner.name) {
        const woodOnSpace = game.getAccumulatedResources(actionId).wood || 0
        if (woodOnSpace >= 5 && actingPlayer.food >= 1) {
          actingPlayer.removeResource('food', 1)
          cardOwner.addResource('food', 1)
          game.log.add({
            template: '{actingPlayer} pays 1 food to {player} for Forest Guardian',
            args: { actingPlayer, player: cardOwner },
          })
        }
      }
    },
  },
  {
    id: 'forest-scientist-b139',
    name: 'Forest Scientist',
    deck: 'occupationB',
    number: 139,
    type: 'occupation',
    players: '3+',
    text: 'In the returning home phase of each round, if there is no wood left on the game board, you get 1 food - from round 5 on, even 2 food.',
    onReturnHome(game, player) {
      if (game.getTotalWoodOnBoard() === 0) {
        const food = game.state.round >= 5 ? 2 : 1
        player.addResource('food', food)
        game.log.add({
          template: '{player} gets {amount} food from Forest Scientist',
          args: { player, amount: food },
        })
      }
    },
  },
  {
    id: 'farmyard-worker-b140',
    name: 'Farmyard Worker',
    deck: 'occupationB',
    number: 140,
    type: 'occupation',
    players: '3+',
    text: 'At the end of each work phase in which you placed at least 1 good on 1 of your farmyard spaces, you get 2 food.',
    onWorkPhaseEnd(game, player) {
      if (player.placedGoodOnFarmyardThisPhase) {
        player.addResource('food', 2)
        game.log.add({
          template: '{player} gets 2 food from Farmyard Worker',
          args: { player },
        })
      }
    },
  },
  {
    id: 'field-caretaker-b141',
    name: 'Field Caretaker',
    deck: 'occupationB',
    number: 141,
    type: 'occupation',
    players: '3+',
    text: 'When you play this card, you can immediately exchange 0/1/3 clay for 1/2/3 grain. This card is a field.',
    isField: true,
    onPlay(game, player) {
      game.actions.offerFieldCaretakerExchange(player, this)
    },
  },
  {
    id: 'greengrocer-b142',
    name: 'Greengrocer',
    deck: 'occupationB',
    number: 142,
    type: 'occupation',
    players: '3+',
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
    id: 'clay-warden-b143',
    name: 'Clay Warden',
    deck: 'occupationB',
    number: 143,
    type: 'occupation',
    players: '3+',
    text: 'Each time another player uses the "Hollow" accumulation space, you get 1 clay. In a 3-/4-player game, you also get 1 clay/food.',
    onAnyAction(game, actingPlayer, actionId, cardOwner) {
      if (actionId === 'take-clay-2' && actingPlayer.name !== cardOwner.name) {
        cardOwner.addResource('clay', 1)
        const playerCount = game.players.count()
        if (playerCount === 3) {
          cardOwner.addResource('clay', 1)
          game.log.add({
            template: '{player} gets 2 clay from Clay Warden',
            args: { player: cardOwner },
          })
        }
        else if (playerCount === 4) {
          cardOwner.addResource('food', 1)
          game.log.add({
            template: '{player} gets 1 clay and 1 food from Clay Warden',
            args: { player: cardOwner },
          })
        }
        else {
          game.log.add({
            template: '{player} gets 1 clay from Clay Warden',
            args: { player: cardOwner },
          })
        }
      }
    },
  },
  {
    id: 'collier-b144',
    name: 'Collier',
    deck: 'occupationB',
    number: 144,
    type: 'occupation',
    players: '3+',
    text: 'Each time after you use the "Clay Pit" accumulation space, you get 1 reed and 1 wood. With 3 or more players, you get 1 additional wood on the "Hollow" accumulation space.',
    onAction(game, player, actionId) {
      if (actionId === 'take-clay') {
        player.addResource('reed', 1)
        player.addResource('wood', 1)
        game.log.add({
          template: '{player} gets 1 reed and 1 wood from Collier',
          args: { player },
        })
        if (game.players.count() >= 3) {
          game.addToAccumulationSpace('take-clay-2', 'wood', 1)
          game.log.add({
            template: '{player} places 1 wood on Hollow via Collier',
            args: { player },
          })
        }
      }
    },
  },
  {
    id: 'brushwood-collector-b145',
    name: 'Brushwood Collector',
    deck: 'occupationB',
    number: 145,
    type: 'occupation',
    players: '3+',
    text: 'Each time you renovate or build a room, you can replace the required 1 or 2 reed with a total of 1 wood.',
    modifyReedCost(player, cost) {
      if (cost.reed && cost.reed > 0) {
        return { ...cost, reed: 0, reedAlternative: { wood: 1 } }
      }
      return cost
    },
  },
  {
    id: 'illusionist-b146',
    name: 'Illusionist',
    deck: 'occupationB',
    number: 146,
    type: 'occupation',
    players: '3+',
    text: 'Each time you use a building resource accumulation space, you can discard exactly 1 card from your hand to get 1 additional building resource of the accumulating type.',
    onAction(game, player, actionId) {
      if (game.isBuildingResourceAccumulationSpace(actionId) && player.hand.length > 0) {
        game.actions.offerIllusionistBonus(player, this, actionId)
      }
    },
  },
  {
    id: 'huntsman-b147',
    name: 'Huntsman',
    deck: 'occupationB',
    number: 147,
    type: 'occupation',
    players: '3+',
    text: 'Each time after you use a wood accumulation space, you can pay 1 grain to get 1 wild boar.',
    onAction(game, player, actionId) {
      const woodActions = ['take-wood', 'copse', 'take-3-wood', 'take-2-wood']
      if (woodActions.includes(actionId) && player.grain >= 1 && player.canPlaceAnimals('boar', 1)) {
        game.actions.offerHuntsmanBoar(player, this)
      }
    },
  },
  {
    id: 'pet-broker-b148',
    name: 'Pet Broker',
    deck: 'occupationB',
    number: 148,
    type: 'occupation',
    players: '3+',
    text: 'When you play this card, you immediately get 1 sheep. You can keep 1 sheep on each occupation in front of you.',
    onPlay(game, player) {
      if (player.canPlaceAnimals('sheep', 1)) {
        player.addAnimals('sheep', 1)
        game.log.add({
          template: '{player} gets 1 sheep from Pet Broker',
          args: { player },
        })
      }
    },
    holdsAnimals: { sheep: true },
    getAnimalCapacity(player) {
      return player.getOccupationCount()
    },
  },
  {
    id: 'open-air-farmer-b149',
    name: 'Open Air Farmer',
    deck: 'occupationB',
    number: 149,
    type: 'occupation',
    players: '3+',
    text: 'When you play this card, if you have at least 3 stables in your supply, remove 3 stables in your supply from play and build a pasture covering 2 farmyard spaces. You only need to pay a total of 2 wood for the fences.',
    onPlay(game, player) {
      if (player.stablesInSupply >= 3) {
        game.actions.offerOpenAirFarmerPasture(player, this)
      }
    },
  },
  {
    id: 'large-scale-farmer-b150',
    name: 'Large-Scale Farmer',
    deck: 'occupationB',
    number: 150,
    type: 'occupation',
    players: '3+',
    text: 'Each time after you use the "Farm Expansion" or "Major Improvement" action space while the other is unoccupied, you can pay 1 food to use that other space with the same person.',
    onAction(game, player, actionId) {
      if (actionId === 'farm-expansion' && !game.isActionOccupied('major-improvement') && player.food >= 1) {
        game.actions.offerUseOtherSpace(player, this, 'major-improvement', { cost: { food: 1 } })
      }
      else if (actionId === 'major-improvement' && !game.isActionOccupied('farm-expansion') && player.food >= 1) {
        game.actions.offerUseOtherSpace(player, this, 'farm-expansion', { cost: { food: 1 } })
      }
    },
  },
  {
    id: 'little-peasant-b151',
    name: 'Little Peasant',
    deck: 'occupationB',
    number: 151,
    type: 'occupation',
    players: '3+',
    text: 'You immediately get 1 stone. As long as you live in a wooden house with exactly 2 rooms, action spaces - excluding Meeting Place - are not considered occupied for you.',
    onPlay(game, player) {
      player.addResource('stone', 1)
      game.log.add({
        template: '{player} gets 1 stone from Little Peasant',
        args: { player },
      })
    },
    ignoresOccupancy(player) {
      return player.roomType === 'wood' && player.getRoomCount() === 2
    },
    excludeFromIgnore: ['meeting-place'],
  },
  {
    id: 'junior-artist-b152',
    name: 'Junior Artist',
    deck: 'occupationB',
    number: 152,
    type: 'occupation',
    players: '3+',
    text: 'Each time after you use the "Day Laborer" action space, you can pay 1 food to use an unoccupied "Traveling Players" or "Lessons" action space with the same person.',
    onAction(game, player, actionId) {
      if (actionId === 'day-laborer' && player.food >= 1) {
        const options = []
        if (!game.isActionOccupied('traveling-players')) {
          options.push('traveling-players')
        }
        if (!game.isActionOccupied('lessons-1')) {
          options.push('lessons-1')
        }
        if (!game.isActionOccupied('lessons-2')) {
          options.push('lessons-2')
        }
        if (options.length > 0) {
          game.actions.offerUseOtherSpaceChoice(player, this, options, { cost: { food: 1 } })
        }
      }
    },
  },
  {
    id: 'housemaster-b153',
    name: 'Housemaster',
    deck: 'occupationB',
    number: 153,
    type: 'occupation',
    players: '3+',
    text: 'During scoring, total the values of your major improvements. The smallest value counts double. If the total is at least 5/7/9/11, you get 1/2/3/4 bonus points.',
    getEndGamePoints(player) {
      const majorValues = player.getMajorImprovementValues()
      if (majorValues.length === 0) {
        return 0
      }
      const minValue = Math.min(...majorValues)
      const total = majorValues.reduce((a, b) => a + b, 0) + minValue // smallest counts double
      if (total >= 11) {
        return 4
      }
      if (total >= 9) {
        return 3
      }
      if (total >= 7) {
        return 2
      }
      if (total >= 5) {
        return 1
      }
      return 0
    },
  },
  {
    id: 'sheep-keeper-b154',
    name: 'Sheep Keeper',
    deck: 'occupationB',
    number: 154,
    type: 'occupation',
    players: '3+',
    text: 'You can only play this card if you have less than 7 sheep. Once this game, when you have 7 sheep in your farmyard, you immediately get 3 bonus points and 2 food.',
    canPlay(player) {
      return player.getTotalAnimals('sheep') < 7
    },
    checkTrigger(game, player) {
      if (!player.sheepKeeperTriggered && player.getTotalAnimals('sheep') >= 7) {
        player.sheepKeeperTriggered = true
        player.bonusPoints = (player.bonusPoints || 0) + 3
        player.addResource('food', 2)
        game.log.add({
          template: '{player} gets 3 bonus points and 2 food from Sheep Keeper',
          args: { player },
        })
      }
    },
  },
  {
    id: 'art-teacher-b155',
    name: 'Art Teacher',
    deck: 'occupationB',
    number: 155,
    type: 'occupation',
    players: '4+',
    text: 'When you play this card, you immediately get 1 wood and 1 reed. Each time you pay an occupation cost, you can use food from the "Traveling Players" accumulation space.',
    onPlay(game, player) {
      player.addResource('wood', 1)
      player.addResource('reed', 1)
      game.log.add({
        template: '{player} gets 1 wood and 1 reed from Art Teacher',
        args: { player },
      })
    },
    canUseTravelingPlayersFood: true,
  },
  {
    id: 'storehouse-keeper-b156',
    name: 'Storehouse Keeper',
    deck: 'occupationB',
    number: 156,
    type: 'occupation',
    players: '4+',
    text: 'Each time you use the "Resource Market" action space, you also get your choice of 1 clay or 1 grain.',
    onAction(game, player, actionId) {
      if (actionId === 'resource-market') {
        game.actions.offerResourceChoice(player, this, ['clay', 'grain'])
      }
    },
  },
  {
    id: 'salter-b157',
    name: 'Salter',
    deck: 'occupationB',
    number: 157,
    type: 'occupation',
    players: '4+',
    text: 'At any time, you can pay 1 sheep/wild boar/cattle from your farmyard. If you do, place 1 food on each of the next 3/5/7 round spaces. At the start of these rounds, you get the food.',
    allowsAnytimeAction: true,
    anytimeAction(game, player, animalType) {
      const roundsMap = { sheep: 3, boar: 5, cattle: 7 }
      const rounds = roundsMap[animalType]
      if (rounds) {
        const currentRound = game.state.round
        for (let i = 1; i <= rounds; i++) {
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
      }
    },
  },
  {
    id: 'district-manager-b158',
    name: 'District Manager',
    deck: 'occupationB',
    number: 158,
    type: 'occupation',
    players: '4+',
    text: 'At the end of each work phase, if you used both the "Forest" and "Grove" accumulation spaces, you get 5 food.',
    onWorkPhaseEnd(game, player) {
      if (player.usedForestThisPhase && player.usedGroveThisPhase) {
        player.addResource('food', 5)
        game.log.add({
          template: '{player} gets 5 food from District Manager',
          args: { player },
        })
      }
    },
  },
  {
    id: 'lieutenant-general-b159',
    name: 'Lieutenant General',
    deck: 'occupationB',
    number: 159,
    type: 'occupation',
    players: '4+',
    text: 'For each field tile that another player places next to an existing field tile, you get 1 food from the general supply. In round 14, you get 1 grain instead.',
    onAnyPlowField(game, actingPlayer, cardOwner, isAdjacent) {
      if (actingPlayer.name !== cardOwner.name && isAdjacent) {
        if (game.state.round === 14) {
          cardOwner.addResource('grain', 1)
          game.log.add({
            template: '{player} gets 1 grain from Lieutenant General',
            args: { player: cardOwner },
          })
        }
        else {
          cardOwner.addResource('food', 1)
          game.log.add({
            template: '{player} gets 1 food from Lieutenant General',
            args: { player: cardOwner },
          })
        }
      }
    },
  },
  {
    id: 'pub-owner-b160',
    name: 'Pub Owner',
    deck: 'occupationB',
    number: 160,
    type: 'occupation',
    players: '4+',
    text: 'Immediately, when you play this card, and at the end of each work phase, in which the "Forest", "Clay Pit", and "Reed Bank" accumulation spaces are all occupied, you get 1 grain.',
    onPlay(game, player) {
      if (game.isActionOccupied('take-wood') && game.isActionOccupied('take-clay') && game.isActionOccupied('take-reed')) {
        player.addResource('grain', 1)
        game.log.add({
          template: '{player} gets 1 grain from Pub Owner',
          args: { player },
        })
      }
    },
    onWorkPhaseEnd(game, player) {
      if (game.isActionOccupied('take-wood') && game.isActionOccupied('take-clay') && game.isActionOccupied('take-reed')) {
        player.addResource('grain', 1)
        game.log.add({
          template: '{player} gets 1 grain from Pub Owner',
          args: { player },
        })
      }
    },
  },
  {
    id: 'weakling-b161',
    name: 'Weakling',
    deck: 'occupationB',
    number: 161,
    type: 'occupation',
    players: '4+',
    text: 'Each time it is your turn in the work phase, if there are 1 or more accumulation spaces with 5+ goods on them and you do not use any of them, you get 1 vegetable.',
    onTurnEnd(game, player, actionId) {
      if (game.hasAccumulationSpaceWithGoods(5) && !game.isAccumulationSpaceWith5PlusGoods(actionId)) {
        player.addResource('vegetables', 1)
        game.log.add({
          template: '{player} gets 1 vegetable from Weakling',
          args: { player },
        })
      }
    },
  },
  {
    id: 'forest-clearer-b162',
    name: 'Forest Clearer',
    deck: 'occupationB',
    number: 162,
    type: 'occupation',
    players: '4+',
    text: 'Each time you obtain exactly 2/3/4 wood from a wood accumulation space, you get 1 additional wood and 1/0/1 food.',
    onAction(game, player, actionId, resources) {
      const woodActions = ['take-wood', 'copse', 'take-3-wood', 'take-2-wood']
      if (woodActions.includes(actionId) && resources && resources.wood) {
        if (resources.wood === 2) {
          player.addResource('wood', 1)
          player.addResource('food', 1)
          game.log.add({
            template: '{player} gets 1 wood and 1 food from Forest Clearer',
            args: { player },
          })
        }
        else if (resources.wood === 3) {
          player.addResource('wood', 1)
          game.log.add({
            template: '{player} gets 1 wood from Forest Clearer',
            args: { player },
          })
        }
        else if (resources.wood === 4) {
          player.addResource('wood', 1)
          player.addResource('food', 1)
          game.log.add({
            template: '{player} gets 1 wood and 1 food from Forest Clearer',
            args: { player },
          })
        }
      }
    },
  },
  {
    id: 'pastor-b163',
    name: 'Pastor',
    deck: 'occupationB',
    number: 163,
    type: 'occupation',
    players: '4+',
    text: 'Once you are the only player to live in a house with only 2 rooms, you immediately get 3 wood, 2 clay, 1 reed, and 1 stone (only once).',
    checkTrigger(game, player) {
      if (!player.pastorTriggered) {
        const playersWithTwoRooms = game.players.all().filter(p => p.getRoomCount() === 2)
        if (playersWithTwoRooms.length === 1 && playersWithTwoRooms[0].name === player.name) {
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
      }
    },
  },
  {
    id: 'sheep-whisperer-b164',
    name: 'Sheep Whisperer',
    deck: 'occupationB',
    number: 164,
    type: 'occupation',
    players: '4+',
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
    id: 'game-provider-b165',
    name: 'Game Provider',
    deck: 'occupationB',
    number: 165,
    type: 'occupation',
    players: '4+',
    text: 'Immediately before each harvest, you can discard 1/3/4 grain from different fields to receive 1/2/3 wild boars.',
    onBeforeHarvest(game, player) {
      game.actions.offerGameProviderExchange(player, this)
    },
  },
  {
    id: 'cattle-feeder-b166',
    name: 'Cattle Feeder',
    deck: 'occupationB',
    number: 166,
    type: 'occupation',
    players: '4+',
    text: 'Each time you use the "Grain Seeds" action space, you can also buy 1 cattle for 1 food.',
    onAction(game, player, actionId) {
      if (actionId === 'take-grain' && player.food >= 1 && player.canPlaceAnimals('cattle', 1)) {
        game.actions.offerBuyAnimal(player, this, 'cattle', 1)
      }
    },
  },
  {
    id: 'stable-sergeant-b167',
    name: 'Stable Sergeant',
    deck: 'occupationB',
    number: 167,
    type: 'occupation',
    players: '4+',
    text: 'When you play this card, you can pay 2 food to get 1 sheep, 1 wild boar, and 1 cattle, but only if you can accommodate all three animals on your farm.',
    onPlay(game, player) {
      if (player.food >= 2 &&
          player.canPlaceAnimals('sheep', 1) &&
          player.canPlaceAnimals('boar', 1) &&
          player.canPlaceAnimals('cattle', 1)) {
        game.actions.offerStableSergeantAnimals(player, this)
      }
    },
  },
  {
    id: 'pasture-master-b168',
    name: 'Pasture Master',
    deck: 'occupationB',
    number: 168,
    type: 'occupation',
    players: '4+',
    text: 'Each time you renovate, you get 1 additional animal of the respective type in each of your pastures with stable.',
    onRenovate(game, player) {
      const pasturesWithStable = player.getPasturesWithStable()
      for (const pasture of pasturesWithStable) {
        if (pasture.animalType && player.canPlaceAnimals(pasture.animalType, 1)) {
          player.addAnimals(pasture.animalType, 1)
          game.log.add({
            template: '{player} gets 1 {animal} from Pasture Master',
            args: { player, animal: pasture.animalType },
          })
        }
      }
    },
  },
]

// Card lookup functions
function getCardById(id) {
  return occupations.find(c => c.id === id)
}

function getCardByName(name) {
  return occupations.find(c => c.name === name)
}

function getMinorImprovements() {
  return []
}

function getOccupations() {
  return occupations
}

function getAllCards() {
  return [...occupations]
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
  getCardById,
  getCardByName,
  getMinorImprovements,
  getOccupations,
  getAllCards,
  getCardsByPlayerCount,
}
