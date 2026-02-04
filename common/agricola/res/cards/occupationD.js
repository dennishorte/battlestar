/**
 * Occupations D Cards for Agricola (Revised Edition)
 * Cards D085-D168 - A standalone occupations deck
 */

const occupations = [
  {
    id: 'reader-d085',
    name: 'Reader',
    deck: 'occupationD',
    number: 85,
    type: 'occupation',
    players: '1+',
    text: 'As soon as you have 6 occupations in front of you (including this one), this card provides room for one person. In the draft variant, you need 7 occupations to play this.',
    providesRoom: false,
    checkRoomCondition(player, isDraft) {
      const required = isDraft ? 7 : 6
      return player.getOccupationCount() >= required
    },
    onPlayOccupation(game, player) {
      if (!this.providesRoom && this.checkRoomCondition(player, game.isDraftVariant)) {
        this.providesRoom = true
        game.log.add({
          template: '{player} activates Reader room',
          args: { player },
        })
      }
    },
  },
  {
    id: 'sheep-agent-d086',
    name: 'Sheep Agent',
    deck: 'occupationD',
    number: 86,
    type: 'occupation',
    players: '1+',
    text: 'You can keep 1 sheep on each occupation card in front of you (including this one), unless it is already able to hold animals.',
    holdsAnimals: { sheep: true },
    getAnimalCapacity(player) {
      const occupations = player.getPlayedOccupations()
      return occupations.filter(o => !o.holdsAnimals || o.id === this.id).length
    },
  },
  {
    id: 'master-builder-d087',
    name: 'Master Builder',
    deck: 'occupationD',
    number: 87,
    type: 'occupation',
    players: '1+',
    text: 'Once your house has at least 5 rooms, at any time, but only once this game, you can add another room at no cost.',
    onPlay(_game, _player) {
      this.used = false
    },
    allowsAnytimeAction: true,
    canUseFreeRoom(player) {
      return !this.used && player.getRoomCount() >= 5
    },
    useFreeRoom(game, player) {
      this.used = true
      game.actions.buildFreeRoom(player, this)
    },
  },
  {
    id: 'millwright-d088',
    name: 'Millwright',
    deck: 'occupationD',
    number: 88,
    type: 'occupation',
    players: '1+',
    text: 'You immediately get 1 grain. Each time you build fences, stables, and rooms, or renovate your house, you can replace up to 2 building resources of any type with 1 grain each.',
    onPlay(game, player) {
      player.addResource('grain', 1)
      game.log.add({
        template: '{player} gets 1 grain from Millwright',
        args: { player },
      })
    },
    allowsGrainSubstitution: true,
    maxSubstitutions: 2,
  },
  {
    id: 'stablehand-d089',
    name: 'Stablehand',
    deck: 'occupationD',
    number: 89,
    type: 'occupation',
    players: '1+',
    text: 'Each time you build at least 1 fence, you can also build a stable without paying wood for the stable.',
    onBuildFence(game, player, fenceCount) {
      if (fenceCount >= 1) {
        game.actions.offerBuildFreeStable(player, this)
      }
    },
  },
  {
    id: 'plow-maker-d090',
    name: 'Plow Maker',
    deck: 'occupationD',
    number: 90,
    type: 'occupation',
    players: '1+',
    text: 'Each time you use the "Farmland" or "Cultivation" action space, you can pay 1 food to plow 1 additional field.',
    onAction(game, player, actionId) {
      if ((actionId === 'plow-field' || actionId === 'plow-sow') && player.food >= 1) {
        game.actions.offerPlowForFood(player, this)
      }
    },
  },
  {
    id: 'plowman-d091',
    name: 'Plowman',
    deck: 'occupationD',
    number: 91,
    type: 'occupation',
    players: '1+',
    text: 'Add 4, 7, and 10 to the current round and place a field tile on each corresponding round space. At the start of these rounds, you can plow the field for 1 food.',
    onPlay(game, player) {
      const currentRound = game.state.round
      for (const offset of [4, 7, 10]) {
        const round = currentRound + offset
        if (round <= 14) {
          if (!game.state.scheduledPlowman) {
            game.state.scheduledPlowman = {}
          }
          if (!game.state.scheduledPlowman[player.name]) {
            game.state.scheduledPlowman[player.name] = []
          }
          game.state.scheduledPlowman[player.name].push(round)
        }
      }
      game.log.add({
        template: '{player} schedules field tiles from Plowman',
        args: { player },
      })
    },
    onRoundStart(game, player) {
      const scheduled = game.state.scheduledPlowman?.[player.name] || []
      if (scheduled.includes(game.state.round) && player.food >= 1) {
        game.actions.offerPlowForFood(player, this)
      }
    },
  },
  {
    id: 'child-ombudsman-d092',
    name: 'Child Ombudsman',
    deck: 'occupationD',
    number: 92,
    type: 'occupation',
    players: '1+',
    text: 'From round 5 on, if you have room in your house, at the end of each person action, you can take a "Family Growth" action with that person. If you do, you get 2 negative points.',
    onPersonActionEnd(game, player) {
      if (game.state.round >= 5 && player.hasRoomForFamilyGrowth()) {
        game.actions.offerChildOmbudsmanGrowth(player, this)
      }
    },
  },
  {
    id: 'sheep-inspector-d093',
    name: 'Sheep Inspector',
    deck: 'occupationD',
    number: 93,
    type: 'occupation',
    players: '1+',
    text: 'Once per work phase, after you complete a person action, you can pay 1 sheep and 2 food to return another person you placed home.',
    oncePerWorkPhase: true,
    onPersonActionEnd(game, player) {
      if (player.sheep >= 1 && player.food >= 2 && player.getPlacedWorkerCount() >= 2) {
        game.actions.offerSheepInspectorReturn(player, this)
      }
    },
  },
  {
    id: 'henpecked-husband-d094',
    name: 'Henpecked Husband',
    deck: 'occupationD',
    number: 94,
    type: 'occupation',
    players: '1+',
    text: 'Each time you take a "Build Rooms" action with the second person you place, return the first person you placed home, unless it is on the "Meeting Place" action space.',
    onAction(game, player, actionId) {
      if (actionId === 'build-rooms' && player.getPersonPlacedThisRound() === 2) {
        const firstPersonAction = player.getFirstPersonActionThisRound()
        if (firstPersonAction !== 'meeting-place') {
          game.actions.returnWorkerHome(player, 0)
          game.log.add({
            template: '{player} returns first worker home via Henpecked Husband',
            args: { player },
          })
        }
      }
    },
  },
  {
    id: 'site-manager-d095',
    name: 'Site Manager',
    deck: 'occupationD',
    number: 95,
    type: 'occupation',
    players: '1+',
    text: 'When you play this card, immediately build a major improvement. When paying its cost, you can replace up to 1 building resource of each type with 1 food each.',
    onPlay(game, player) {
      game.actions.offerBuildMajorWithFoodSubstitution(player, this)
    },
  },
  {
    id: 'furnisher-d096',
    name: 'Furnisher',
    deck: 'occupationD',
    number: 96,
    type: 'occupation',
    players: '1+',
    text: 'When you play this card, you immediately get 2 wood. After each new room you build, you can build or play 1 improvement for 1 wood less.',
    onPlay(game, player) {
      player.addResource('wood', 2)
      game.log.add({
        template: '{player} gets 2 wood from Furnisher',
        args: { player },
      })
    },
    onBuildRoom(game, player) {
      player.furnisherDiscount = true
      game.log.add({
        template: '{player} can play an improvement for 1 wood less via Furnisher',
        args: { player },
      })
    },
    modifyImprovementCost(player, cost) {
      if (player.furnisherDiscount && cost.wood && cost.wood > 0) {
        player.furnisherDiscount = false
        return { ...cost, wood: cost.wood - 1 }
      }
      return cost
    },
  },
  {
    id: 'begging-student-d097',
    name: 'Begging Student',
    deck: 'occupationD',
    number: 97,
    type: 'occupation',
    players: '1+',
    text: 'When you play this card, you must immediately take 1 begging marker. At the start of each harvest, you can play 1 occupation without paying an occupation cost.',
    onPlay(game, player) {
      player.beggingMarkers = (player.beggingMarkers || 0) + 1
      game.log.add({
        template: '{player} takes a begging marker from Begging Student',
        args: { player },
      })
    },
    onHarvestStart(game, player) {
      game.actions.offerFreeOccupation(player, this)
    },
  },
  {
    id: 'transactor-d098',
    name: 'Transactor',
    deck: 'occupationD',
    number: 98,
    type: 'occupation',
    players: '1+',
    text: 'Immediately before the final harvest at the end of round 14, you can take all the building resources that are left on the entire game board.',
    onBeforeFinalHarvest(game, player) {
      const resources = game.collectAllBuildingResourcesFromBoard()
      for (const [resource, amount] of Object.entries(resources)) {
        player.addResource(resource, amount)
      }
      game.log.add({
        template: '{player} collects all building resources from board via Transactor',
        args: { player },
      })
    },
  },
  {
    id: 'earthenware-potter-d099',
    name: 'Earthenware Potter',
    deck: 'occupationD',
    number: 99,
    type: 'occupation',
    players: '1+',
    text: 'If you play this card in round 4 or before, after the final harvest, you get 1 bonus point for each person for which you then pay 1 clay.',
    onPlay(game, _player) {
      this.playedEarly = game.state.round <= 4
    },
    onAfterFinalHarvest(game, player) {
      if (this.playedEarly) {
        game.actions.offerEarthenwarePotterBonus(player, this)
      }
    },
  },
  {
    id: 'lord-of-the-manor-d100',
    name: 'Lord of the Manor',
    deck: 'occupationD',
    number: 100,
    type: 'occupation',
    players: '1+',
    text: 'During scoring, you get 1 bonus point for each scoring category in which you score the maximum 4 points. (The bonus point is also awarded for 4 fenced stables.)',
    getEndGamePoints(player) {
      return player.getCategoriesWithMaxScore()
    },
  },
  {
    id: 'sugar-baker-d101',
    name: 'Sugar Baker',
    deck: 'occupationD',
    number: 101,
    type: 'occupation',
    players: '1+',
    text: 'Each time after you use the "Grain Utilization" action space, you can buy 1 bonus point for 1 food. Place the food on the action space (for the next visitor).',
    onAction(game, player, actionId) {
      if (actionId === 'sow-bake' && player.food >= 1) {
        game.actions.offerSugarBakerBonus(player, this)
      }
    },
  },
  {
    id: 'sample-stable-maker-d102',
    name: 'Sample Stable Maker',
    deck: 'occupationD',
    number: 102,
    type: 'occupation',
    players: '1+',
    text: 'At the start of each returning home phase, you can return a built stable to your supply to get 1 wood, 1 grain, 1 food, and a "Minor Improvement" action.',
    onReturnHomeStart(game, player) {
      if (player.getBuiltStableCount() > 0) {
        game.actions.offerSampleStableMakerReturn(player, this)
      }
    },
  },
  {
    id: 'canal-boatman-d103',
    name: 'Canal Boatman',
    deck: 'occupationD',
    number: 103,
    type: 'occupation',
    players: '1+',
    text: 'Each time you use "Fishing" or "Reed Bank", you can pay 1 food to immediately place another person on this card. If you do, you get your choice of 3 stone or 1 grain plus 1 vegetable.',
    onAction(game, player, actionId) {
      if ((actionId === 'fishing' || actionId === 'reed-bank') && player.food >= 1 && player.hasAvailableWorker()) {
        game.actions.offerCanalBoatmanPlacement(player, this)
      }
    },
  },
  {
    id: 'cultivator-d104',
    name: 'Cultivator',
    deck: 'occupationD',
    number: 104,
    type: 'occupation',
    players: '1+',
    text: 'For each new field tile you get, you also get 1 wood and 1 food.',
    onPlow(game, player) {
      player.addResource('wood', 1)
      player.addResource('food', 1)
      game.log.add({
        template: '{player} gets 1 wood and 1 food from Cultivator',
        args: { player },
      })
    },
  },
  {
    id: 'sculptor-d105',
    name: 'Sculptor',
    deck: 'occupationD',
    number: 105,
    type: 'occupation',
    players: '1+',
    text: 'Each time you use a clay accumulation space, you also get 1 food. Each time you use a stone accumulation space, you also get 1 grain.',
    onAction(game, player, actionId) {
      if (actionId === 'take-clay' || actionId === 'take-clay-2') {
        player.addResource('food', 1)
        game.log.add({
          template: '{player} gets 1 food from Sculptor',
          args: { player },
        })
      }
      else if (actionId === 'take-stone-1' || actionId === 'take-stone-2') {
        player.addResource('grain', 1)
        game.log.add({
          template: '{player} gets 1 grain from Sculptor',
          args: { player },
        })
      }
    },
  },
  {
    id: 'whisky-distiller-d106',
    name: 'Whisky Distiller',
    deck: 'occupationD',
    number: 106,
    type: 'occupation',
    players: '1+',
    text: 'At any time, you can pay 1 grain. If you do, add 2 to the current round and place 4 food on the corresponding round space. At the start of that round, you get the food.',
    allowsAnytimeAction: true,
    canActivate(player) {
      return player.grain >= 1
    },
    activate(game, player) {
      player.removeResource('grain', 1)
      const targetRound = game.state.round + 2
      if (targetRound <= 14) {
        if (!game.state.scheduledFood) {
          game.state.scheduledFood = {}
        }
        if (!game.state.scheduledFood[player.name]) {
          game.state.scheduledFood[player.name] = {}
        }
        game.state.scheduledFood[player.name][targetRound] =
          (game.state.scheduledFood[player.name][targetRound] || 0) + 4
        game.log.add({
          template: '{player} schedules 4 food for round {round} via Whisky Distiller',
          args: { player, round: targetRound },
        })
      }
    },
  },
  {
    id: 'bellfounder-d107',
    name: 'Bellfounder',
    deck: 'occupationD',
    number: 107,
    type: 'occupation',
    players: '1+',
    text: 'In the returning home phase of each round, if you have at least 1 clay, you can use this card to discard all of your clay and get your choice of 3 food or 1 bonus point.',
    onReturnHome(game, player) {
      if (player.clay >= 1) {
        game.actions.offerBellfounderExchange(player, this)
      }
    },
  },
  {
    id: 'stone-carver-d108',
    name: 'Stone Carver',
    deck: 'occupationD',
    number: 108,
    type: 'occupation',
    players: '1+',
    text: 'Each harvest, you can use this card to turn exactly 1 stone into 3 food.',
    onHarvest(game, player) {
      if (player.stone >= 1) {
        game.actions.offerStoneCarverConversion(player, this)
      }
    },
  },
  {
    id: 'sowing-master-d109',
    name: 'Sowing Master',
    deck: 'occupationD',
    number: 109,
    type: 'occupation',
    players: '1+',
    text: 'When you play this card, you immediately get 1 wood. Each time after you use an action space with the "Sow" action, you get 2 food.',
    onPlay(game, player) {
      player.addResource('wood', 1)
      game.log.add({
        template: '{player} gets 1 wood from Sowing Master',
        args: { player },
      })
    },
    onAction(game, player, actionId) {
      if (actionId === 'plow-sow' || actionId === 'sow-bake') {
        player.addResource('food', 2)
        game.log.add({
          template: '{player} gets 2 food from Sowing Master',
          args: { player },
        })
      }
    },
  },
  {
    id: 'fish-farmer-d110',
    name: 'Fish Farmer',
    deck: 'occupationD',
    number: 110,
    type: 'occupation',
    players: '1+',
    text: 'Each time there is 1/2/3+ food on the "Fishing" accumulation space, you get an additional 2 food on the "Reed Bank"/ "Clay Pit"/ "Forest" accumulation spaces.',
    modifyAccumulation(game, player) {
      const fishingFood = game.getAccumulatedResources('fishing').food || 0
      if (fishingFood >= 3) {
        game.addBonusAccumulation(player, 'take-wood', { food: 2 })
      }
      if (fishingFood >= 2) {
        game.addBonusAccumulation(player, 'take-clay', { food: 2 })
      }
      if (fishingFood >= 1) {
        game.addBonusAccumulation(player, 'reed-bank', { food: 2 })
      }
    },
  },
  {
    id: 'interior-decorator-d111',
    name: 'Interior Decorator',
    deck: 'occupationD',
    number: 111,
    type: 'occupation',
    players: '1+',
    text: 'Each time you renovate, place 1 food on each of the next 6 round spaces. At the start of these rounds, you get the food.',
    onRenovate(game, player) {
      const currentRound = game.state.round
      for (let i = 1; i <= 6; i++) {
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
        template: '{player} schedules 1 food for next 6 rounds from Interior Decorator',
        args: { player },
      })
    },
  },
  {
    id: 'young-farmer-d112',
    name: 'Young Farmer',
    deck: 'occupationD',
    number: 112,
    type: 'occupation',
    players: '1+',
    text: 'Each time you use the "Major Improvement" action space, you also get 1 grain and, afterward, you can take a "Sow" action.',
    onAction(game, player, actionId) {
      if (actionId === 'major-improvement') {
        player.addResource('grain', 1)
        game.log.add({
          template: '{player} gets 1 grain from Young Farmer',
          args: { player },
        })
        game.actions.offerSow(player, this)
      }
    },
  },
  {
    id: 'food-merchant-d113',
    name: 'Food Merchant',
    deck: 'occupationD',
    number: 113,
    type: 'occupation',
    players: '1+',
    text: 'For each grain you harvest from a field, you can buy 1 vegetable for 3 food. If you harvest the last grain from a field, the vegetable costs you only 2 food.',
    onHarvestGrain(game, player, grainCount, isLastFromField) {
      const cost = isLastFromField ? 2 : 3
      if (player.food >= cost) {
        game.actions.offerBuyVegetable(player, this, cost, grainCount)
      }
    },
  },
  {
    id: 'seed-trader-d114',
    name: 'Seed Trader',
    deck: 'occupationD',
    number: 114,
    type: 'occupation',
    players: '1+',
    text: 'Place 2 grain and 2 vegetables on this card. You can buy them at any time. Each grain costs 2 food; each vegetable costs 3 food.',
    onPlay(_game, _player) {
      this.grain = 2
      this.vegetables = 2
    },
    allowsAnytimeAction: true,
    canBuyGrain() {
      return (this.grain || 0) > 0
    },
    canBuyVegetable() {
      return (this.vegetables || 0) > 0
    },
    buyGrain(game, player) {
      if (player.food >= 2 && this.grain > 0) {
        player.removeResource('food', 2)
        player.addResource('grain', 1)
        this.grain--
        game.log.add({
          template: '{player} buys 1 grain from Seed Trader',
          args: { player },
        })
      }
    },
    buyVegetable(game, player) {
      if (player.food >= 3 && this.vegetables > 0) {
        player.removeResource('food', 3)
        player.addResource('vegetables', 1)
        this.vegetables--
        game.log.add({
          template: '{player} buys 1 vegetable from Seed Trader',
          args: { player },
        })
      }
    },
  },
  {
    id: 'fodder-planter-d115',
    name: 'Fodder Planter',
    deck: 'occupationD',
    number: 115,
    type: 'occupation',
    players: '1+',
    text: 'In the breeding phase of each harvest, for each newborn animal you get, you can sow crops in exactly 1 field.',
    onBreedingPhase(game, player, newbornCount) {
      if (newbornCount > 0 && player.hasEmptyFields()) {
        game.actions.offerSowMultiple(player, this, newbornCount)
      }
    },
  },
  {
    id: 'tree-inspector-d116',
    name: 'Tree Inspector',
    deck: 'occupationD',
    number: 116,
    type: 'occupation',
    players: '1+',
    text: 'This card is a "1 Wood" accumulation space for you only. Each time the newly revealed action space card is a "Quarry" accumulation space, you must discard all wood from this card.',
    isAccumulationSpace: true,
    accumulationForOwnerOnly: true,
    onPlay(_game, _player) {
      this.wood = 0
    },
    onRoundStart(_game, _player) {
      this.wood = (this.wood || 0) + 1
    },
    onRevealRoundCard(game, player, revealedCard) {
      if (revealedCard.isQuarry) {
        this.wood = 0
        game.log.add({
          template: '{player} loses all wood from Tree Inspector due to Quarry reveal',
          args: { player },
        })
      }
    },
    takeWood(game, player) {
      const wood = this.wood || 0
      this.wood = 0
      player.addResource('wood', wood)
      game.log.add({
        template: '{player} takes {amount} wood from Tree Inspector',
        args: { player, amount: wood },
      })
    },
  },
  {
    id: 'wood-expert-d117',
    name: 'Wood Expert',
    deck: 'occupationD',
    number: 117,
    type: 'occupation',
    players: '1+',
    text: 'When you play this card, you immediately get 2 wood. Each improvement costs you up to 2 wood less, if you pay 1 food instead.',
    onPlay(game, player) {
      player.addResource('wood', 2)
      game.log.add({
        template: '{player} gets 2 wood from Wood Expert',
        args: { player },
      })
    },
    allowsFoodForWoodSubstitution: true,
    maxWoodSubstitution: 2,
  },
  {
    id: 'bonehead-d118',
    name: 'Bonehead',
    deck: 'occupationD',
    number: 118,
    type: 'occupation',
    players: '1+',
    text: 'When you play this card, immediately place 6 wood on it. Immediately after each time you play a card from your hand, including this one, you get 1 wood from this card.',
    onPlay(game, player) {
      this.wood = 6
      if (this.wood > 0) {
        this.wood--
        player.addResource('wood', 1)
        game.log.add({
          template: '{player} gets 1 wood from Bonehead',
          args: { player },
        })
      }
    },
    onPlayCard(game, player) {
      if ((this.wood || 0) > 0) {
        this.wood--
        player.addResource('wood', 1)
        game.log.add({
          template: '{player} gets 1 wood from Bonehead',
          args: { player },
        })
      }
    },
  },
  {
    id: 'wood-barterer-d119',
    name: 'Wood Barterer',
    deck: 'occupationD',
    number: 119,
    type: 'occupation',
    players: '1+',
    text: 'Each time before you use an action space with a "Build Fences" or "Build Rooms" action, you can choose to either get 2 wood or exchange up to 2 wood for 1 reed each.',
    onBeforeAction(game, player, actionId) {
      if (actionId === 'fencing' || actionId === 'build-rooms') {
        game.actions.offerWoodBartererChoice(player, this)
      }
    },
  },
  {
    id: 'clay-deliveryman-d120',
    name: 'Clay Deliveryman',
    deck: 'occupationD',
    number: 120,
    type: 'occupation',
    players: '1+',
    text: 'Place 1 clay on each remaining space for rounds 6 to 14. At the start of these rounds, you get the clay.',
    onPlay(game, player) {
      const currentRound = game.state.round
      for (let round = Math.max(6, currentRound + 1); round <= 14; round++) {
        if (!game.state.scheduledClay) {
          game.state.scheduledClay = {}
        }
        if (!game.state.scheduledClay[player.name]) {
          game.state.scheduledClay[player.name] = {}
        }
        game.state.scheduledClay[player.name][round] =
          (game.state.scheduledClay[player.name][round] || 0) + 1
      }
      game.log.add({
        template: '{player} schedules clay for rounds 6-14 from Clay Deliveryman',
        args: { player },
      })
    },
  },
  {
    id: 'clay-plasterer-d121',
    name: 'Clay Plasterer',
    deck: 'occupationD',
    number: 121,
    type: 'occupation',
    players: '1+',
    text: 'Renovating to clay only costs you exactly 1 clay and 1 reed. Each clay room only costs you 3 clay and 2 reed to build.',
    modifyRenovationCost(player, cost, toType) {
      if (toType === 'clay') {
        return { clay: 1, reed: 1 }
      }
      return cost
    },
    modifyRoomCost(player, cost) {
      if (player.roomType === 'clay') {
        return { clay: 3, reed: 2 }
      }
      return cost
    },
  },
  {
    id: 'clay-carrier-d122',
    name: 'Clay Carrier',
    deck: 'occupationD',
    number: 122,
    type: 'occupation',
    players: '1+',
    text: 'When you play this card, you immediately get 2 clay. At any time, but only once per round, you can buy 2 clay for 2 food.',
    onPlay(game, player) {
      player.addResource('clay', 2)
      game.log.add({
        template: '{player} gets 2 clay from Clay Carrier',
        args: { player },
      })
    },
    oncePerRound: true,
    allowsAnytimeAction: true,
    canBuyClay(player, round) {
      return player.food >= 2 && this.lastUsedRound !== round
    },
    buyClay(game, player) {
      player.removeResource('food', 2)
      player.addResource('clay', 2)
      this.lastUsedRound = game.state.round
      game.log.add({
        template: '{player} buys 2 clay from Clay Carrier',
        args: { player },
      })
    },
  },
  {
    id: 'renovation-preparer-d123',
    name: 'Renovation Preparer',
    deck: 'occupationD',
    number: 123,
    type: 'occupation',
    players: '1+',
    text: 'For each new wood/clay room you build, you get 2 clay/2 stone.',
    onBuildRoom(game, player, roomType) {
      if (roomType === 'wood') {
        player.addResource('clay', 2)
        game.log.add({
          template: '{player} gets 2 clay from Renovation Preparer',
          args: { player },
        })
      }
      else if (roomType === 'clay') {
        player.addResource('stone', 2)
        game.log.add({
          template: '{player} gets 2 stone from Renovation Preparer',
          args: { player },
        })
      }
    },
  },
  {
    id: 'emissary-d124',
    name: 'Emissary',
    deck: 'occupationD',
    number: 124,
    type: 'occupation',
    players: '1+',
    text: 'At any time, you can place a good from your supply on this card to get 1 stone. You must place different goods on this card. (Food is also considered a good.)',
    onPlay(_game, _player) {
      this.placedGoods = []
    },
    allowsAnytimeAction: true,
    canPlaceGood(player, goodType) {
      return !this.placedGoods?.includes(goodType) && player[goodType] >= 1
    },
    placeGood(game, player, goodType) {
      player.removeResource(goodType, 1)
      player.addResource('stone', 1)
      this.placedGoods = this.placedGoods || []
      this.placedGoods.push(goodType)
      game.log.add({
        template: '{player} exchanges 1 {good} for 1 stone via Emissary',
        args: { player, good: goodType },
      })
    },
  },
  {
    id: 'forest-trader-d125',
    name: 'Forest Trader',
    deck: 'occupationD',
    number: 125,
    type: 'occupation',
    players: '1+',
    text: 'Each time you use a wood or clay accumulation space, you can also buy exactly 1 building resource. Wood, clay, and reed cost 1 food each; stone costs 2 food.',
    onAction(game, player, actionId) {
      if (actionId === 'take-wood' || actionId === 'copse' || actionId === 'take-clay' || actionId === 'take-clay-2') {
        game.actions.offerForestTraderPurchase(player, this)
      }
    },
  },
  {
    id: 'field-cultivator-d126',
    name: 'Field Cultivator',
    deck: 'occupationD',
    number: 126,
    type: 'occupation',
    players: '1+',
    text: 'Pile 1 wood, 1 clay, 1 reed, 1 stone, 1 reed, 1 clay, and 1 wood on this card. Each time you harvest a field tile, you can also take the top good from the pile.',
    onPlay(_game, _player) {
      this.pile = ['wood', 'clay', 'reed', 'stone', 'reed', 'clay', 'wood']
    },
    onHarvestField(game, player) {
      if (this.pile && this.pile.length > 0) {
        const good = this.pile.shift()
        player.addResource(good, 1)
        game.log.add({
          template: '{player} gets 1 {good} from Field Cultivator',
          args: { player, good },
        })
      }
    },
  },
  {
    id: 'hardworking-man-d127',
    name: 'Hardworking Man',
    deck: 'occupationD',
    number: 127,
    type: 'occupation',
    players: '1+',
    text: 'This card is an action space for you only. If each other player has more rooms than you, it provides the "Day Laborer", "Build Rooms", and "Major Improvement" actions (all three).',
    isActionSpace: true,
    actionSpaceForOwnerOnly: true,
    isAvailable(game, player) {
      const myRooms = player.getRoomCount()
      return game.players.all().filter(p => p.name !== player.name).every(p => p.getRoomCount() > myRooms)
    },
    actionSpaceEffect(game, player) {
      if (this.isAvailable(game, player)) {
        game.actions.dayLaborer(player)
        game.actions.offerBuildRooms(player, this)
        game.actions.offerBuildMajorImprovement(player, this)
      }
    },
  },
  {
    id: 'building-tycoon-d128',
    name: 'Building Tycoon',
    deck: 'occupationD',
    number: 128,
    type: 'occupation',
    players: '1+',
    text: 'Each time after another player builds 1 or more rooms, you can give them 1 food to build exactly 1 room yourself. (You must pay the building cost of the room.)',
    onAnyBuildRoom(game, actingPlayer, cardOwner) {
      if (actingPlayer.name !== cardOwner.name && cardOwner.food >= 1) {
        game.actions.offerBuildingTycoonRoom(cardOwner, actingPlayer, this)
      }
    },
  },
  {
    id: 'lumber-virtuoso-d129',
    name: 'Lumber Virtuoso',
    deck: 'occupationD',
    number: 129,
    type: 'occupation',
    players: '1+',
    text: 'Each harvest in which you have at least 5 wood in your supply, you can discard down to 5 wood to take a "Build Stables" or "Build Wood Rooms" action by paying the usual costs.',
    onHarvest(game, player) {
      if (player.wood >= 5) {
        game.actions.offerLumberVirtuosoAction(player, this)
      }
    },
  },
  {
    id: 'recreational-carpenter-d130',
    name: 'Recreational Carpenter',
    deck: 'occupationD',
    number: 130,
    type: 'occupation',
    players: '1+',
    text: 'At the end of each work phase in which you did not use the "Meeting Place" action space, you can take a "Build Rooms" action without placing a person.',
    onWorkPhaseEnd(game, player) {
      if (!player.usedMeetingPlaceThisRound) {
        game.actions.offerBuildRooms(player, this)
      }
    },
  },
  {
    id: 'craftsmanship-promoter-d131',
    name: 'Craftsmanship Promoter',
    deck: 'occupationD',
    number: 131,
    type: 'occupation',
    players: '1+',
    text: 'When you play this card, you immediately get 1 stone. You can build any of the major improvements in the bottom row of the supply board even when taking a "Minor Improvement" action.',
    onPlay(game, player) {
      player.addResource('stone', 1)
      game.log.add({
        template: '{player} gets 1 stone from Craftsmanship Promoter',
        args: { player },
      })
    },
    allowsMajorOnMinorAction: true,
    allowedMajors: ['joinery', 'pottery', 'basketmakers-workshop'],
  },
  {
    id: 'hide-farmer-d132',
    name: 'Hide Farmer',
    deck: 'occupationD',
    number: 132,
    type: 'occupation',
    players: '1+',
    text: 'During scoring, you can pay 1 food each for any number of unused farmyard spaces. You do not lose points for these spaces.',
    onScoring(game, player) {
      game.actions.offerHideFarmerPayment(player, this)
    },
  },
  {
    id: 'beer-tent-operator-d133',
    name: 'Beer Tent Operator',
    deck: 'occupationD',
    number: 133,
    type: 'occupation',
    players: '1+',
    text: 'In the feeding phase of each harvest, you can use this card to turn 1 wood plus 1 grain into 1 bonus point and 2 food.',
    onFeedingPhase(game, player) {
      if (player.wood >= 1 && player.grain >= 1) {
        game.actions.offerBeerTentOperatorConversion(player, this)
      }
    },
  },
  {
    id: 'oyster-eater-d134',
    name: 'Oyster Eater',
    deck: 'occupationD',
    number: 134,
    type: 'occupation',
    players: '1+',
    text: 'Each time the "Fishing" accumulation space is used, you get 1 bonus point and must skip placing your next person that round. (You can place the person on a later turn.)',
    onAnyAction(game, actingPlayer, actionId, cardOwner) {
      if (actionId === 'fishing') {
        cardOwner.bonusPoints = (cardOwner.bonusPoints || 0) + 1
        cardOwner.skipNextPersonPlacement = true
        game.log.add({
          template: '{player} gets 1 bonus point and must skip next placement from Oyster Eater',
          args: { player: cardOwner },
        })
      }
    },
  },
  {
    id: 'gardening-head-official-d135',
    name: 'Gardening Head Official',
    deck: 'occupationD',
    number: 135,
    type: 'occupation',
    players: '1+',
    text: 'If there are still 3/6/9 complete rounds left to play, you immediately get 2/3/4 wood. During scoring, each player with the most vegetables in their fields gets 2 bonus points.',
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
      if (wood > 0) {
        player.addResource('wood', wood)
        game.log.add({
          template: '{player} gets {amount} wood from Gardening Head Official',
          args: { player, amount: wood },
        })
      }
    },
    getEndGamePointsAllPlayers(game) {
      const bonuses = {}
      let maxVegetables = 0
      for (const player of game.players.all()) {
        maxVegetables = Math.max(maxVegetables, player.getVegetablesInFields())
      }
      for (const player of game.players.all()) {
        if (player.getVegetablesInFields() === maxVegetables) {
          bonuses[player.name] = 2
        }
      }
      return bonuses
    },
  },
  {
    id: 'animal-activist-d136',
    name: 'Animal Activist',
    deck: 'occupationD',
    number: 136,
    type: 'occupation',
    players: '1+',
    text: 'If there are still 3/6/9 complete rounds left to play, you immediately get 2/3/4 wood. During scoring, each player with the most fenced stables gets 2 bonus points.',
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
      if (wood > 0) {
        player.addResource('wood', wood)
        game.log.add({
          template: '{player} gets {amount} wood from Animal Activist',
          args: { player, amount: wood },
        })
      }
    },
    getEndGamePointsAllPlayers(game) {
      const bonuses = {}
      let maxFencedStables = 0
      for (const player of game.players.all()) {
        maxFencedStables = Math.max(maxFencedStables, player.getFencedStableCount())
      }
      for (const player of game.players.all()) {
        if (player.getFencedStableCount() === maxFencedStables) {
          bonuses[player.name] = 2
        }
      }
      return bonuses
    },
  },
  {
    id: 'trade-teacher-d137',
    name: 'Trade Teacher',
    deck: 'occupationD',
    number: 137,
    type: 'occupation',
    players: '1+',
    text: 'Each time after you use a "Lesson" action space, you can buy up to 2 different goods: grain, stone, sheep, and wild boar for 1 food each; cattle and vegetable for 2 food each.',
    onAction(game, player, actionId) {
      if (actionId === 'lessons-1' || actionId === 'lessons-2') {
        game.actions.offerTradeTeacherPurchase(player, this)
      }
    },
  },
  {
    id: 'pet-lover-d138',
    name: 'Pet Lover',
    deck: 'occupationD',
    number: 138,
    type: 'occupation',
    players: '1+',
    text: 'Each time you use an accumulation space providing exactly 1 animal, you can leave it on the space and get one from the general supply instead, as well as 3 food and 1 grain.',
    onAction(game, player, actionId) {
      const animalCount = game.getAccumulatedAnimalCount(actionId)
      if (animalCount === 1) {
        game.actions.offerPetLoverChoice(player, this, actionId)
      }
    },
  },
  {
    id: 'chairman-d139',
    name: 'Chairman',
    deck: 'occupationD',
    number: 139,
    type: 'occupation',
    players: '1+',
    text: 'Each time another player uses the "Meeting Place" action space, both they and you get 1 food (before taking the actions). If you use it, you get 1 food.',
    onAnyAction(game, actingPlayer, actionId, cardOwner) {
      if (actionId === 'meeting-place') {
        cardOwner.addResource('food', 1)
        if (actingPlayer.name !== cardOwner.name) {
          actingPlayer.addResource('food', 1)
          game.log.add({
            template: '{player} and {other} each get 1 food from Chairman',
            args: { player: cardOwner, other: actingPlayer },
          })
        }
        else {
          game.log.add({
            template: '{player} gets 1 food from Chairman',
            args: { player: cardOwner },
          })
        }
      }
    },
  },
  {
    id: 'loudmouth-d140',
    name: 'Loudmouth',
    deck: 'occupationD',
    number: 140,
    type: 'occupation',
    players: '1+',
    text: 'Each time you take at least 4 building resources or 4 animals from an accumulation space, you also get 1 food.',
    onAction(game, player, actionId) {
      if (game.isAccumulationSpace(actionId)) {
        const resources = game.getAccumulatedResources(actionId)
        const buildingTotal = (resources.wood || 0) + (resources.clay || 0) + (resources.reed || 0) + (resources.stone || 0)
        const animalTotal = (resources.sheep || 0) + (resources.boar || 0) + (resources.cattle || 0)
        if (buildingTotal >= 4 || animalTotal >= 4) {
          player.addResource('food', 1)
          game.log.add({
            template: '{player} gets 1 food from Loudmouth',
            args: { player },
          })
        }
      }
    },
  },
  {
    id: 'seed-seller-d141',
    name: 'Seed Seller',
    deck: 'occupationD',
    number: 141,
    type: 'occupation',
    players: '1+',
    text: 'When you play this card, you immediately get 1 grain. Each time you use the "Grain Seeds" action space, you get 1 additional grain.',
    onPlay(game, player) {
      player.addResource('grain', 1)
      game.log.add({
        template: '{player} gets 1 grain from Seed Seller',
        args: { player },
      })
    },
    onAction(game, player, actionId) {
      if (actionId === 'take-grain') {
        player.addResource('grain', 1)
        game.log.add({
          template: '{player} gets 1 additional grain from Seed Seller',
          args: { player },
        })
      }
    },
  },
  {
    id: 'potato-planter-d142',
    name: 'Potato Planter',
    deck: 'occupationD',
    number: 142,
    type: 'occupation',
    players: '1+',
    text: 'At the end of each work phase in which you occupy the "Clay Pit" or "Reed Bank" accumulation space while the respective other is unoccupied, you get 1 vegetable.',
    onWorkPhaseEnd(game, player) {
      const usedClayPit = player.usedActionThisRound('take-clay')
      const usedReedBank = player.usedActionThisRound('reed-bank')
      const clayPitOccupied = game.isActionOccupied('take-clay')
      const reedBankOccupied = game.isActionOccupied('reed-bank')

      if ((usedClayPit && !reedBankOccupied) || (usedReedBank && !clayPitOccupied)) {
        player.addResource('vegetables', 1)
        game.log.add({
          template: '{player} gets 1 vegetable from Potato Planter',
          args: { player },
        })
      }
    },
  },
  {
    id: 'tree-cutter-d143',
    name: 'Tree Cutter',
    deck: 'occupationD',
    number: 143,
    type: 'occupation',
    players: '1+',
    text: 'Each time you use an accumulation space providing at least 3 goods of the same type except wood, you get an additional 1 wood. (Food is also considered a good.)',
    onAction(game, player, actionId) {
      if (game.isAccumulationSpace(actionId)) {
        const resources = game.getAccumulatedResources(actionId)
        for (const [resource, amount] of Object.entries(resources)) {
          if (resource !== 'wood' && amount >= 3) {
            player.addResource('wood', 1)
            game.log.add({
              template: '{player} gets 1 wood from Tree Cutter',
              args: { player },
            })
            break
          }
        }
      }
    },
  },
  {
    id: 'water-worker-d144',
    name: 'Water Worker',
    deck: 'occupationD',
    number: 144,
    type: 'occupation',
    players: '1+',
    text: 'Each time after you use the "Fishing" accumulation space or one of the three orthogonally adjacent actions spaces, you get 1 additional reed.',
    onAction(game, player, actionId) {
      const adjacentActions = game.getAdjacentActionSpaces('fishing')
      if (actionId === 'fishing' || adjacentActions.includes(actionId)) {
        player.addResource('reed', 1)
        game.log.add({
          template: '{player} gets 1 reed from Water Worker',
          args: { player },
        })
      }
    },
  },
  {
    id: 'roof-examiner-d145',
    name: 'Roof Examiner',
    deck: 'occupationD',
    number: 145,
    type: 'occupation',
    players: '1+',
    text: 'When you play this card, if you have 1/2/3/4 major improvements, you immediately get 2/3/4/5 reed.',
    onPlay(game, player) {
      const majorCount = player.getMajorImprovementCount()
      const reed = majorCount > 0 ? majorCount + 1 : 0
      if (reed > 0) {
        player.addResource('reed', reed)
        game.log.add({
          template: '{player} gets {amount} reed from Roof Examiner',
          args: { player, amount: reed },
        })
      }
    },
  },
  {
    id: 'porter-d146',
    name: 'Porter',
    deck: 'occupationD',
    number: 146,
    type: 'occupation',
    players: '1+',
    text: 'Each time you take at least 4 of the same building resource from an accumulation space, you get 1 additional building resource of the accumulating type and 1 food.',
    onAction(game, player, actionId) {
      if (game.isAccumulationSpace(actionId)) {
        const resources = game.getAccumulatedResources(actionId)
        for (const [resource, amount] of Object.entries(resources)) {
          if (['wood', 'clay', 'reed', 'stone'].includes(resource) && amount >= 4) {
            player.addResource(resource, 1)
            player.addResource('food', 1)
            game.log.add({
              template: '{player} gets 1 {resource} and 1 food from Porter',
              args: { player, resource },
            })
            break
          }
        }
      }
    },
  },
  {
    id: 'trap-builder-d147',
    name: 'Trap Builder',
    deck: 'occupationD',
    number: 147,
    type: 'occupation',
    players: '1+',
    text: 'Each time you use the "Day Laborer" action space, place 1 food, 1 food, and 1 wild boar on the next 3 round spaces, respectively. At the start of these rounds, you get the good.',
    onAction(game, player, actionId) {
      if (actionId === 'day-laborer') {
        const currentRound = game.state.round
        const goods = ['food', 'food', 'boar']
        for (let i = 0; i < 3; i++) {
          const round = currentRound + i + 1
          if (round <= 14) {
            const good = goods[i]
            if (good === 'boar') {
              if (!game.state.scheduledBoar) {
                game.state.scheduledBoar = {}
              }
              if (!game.state.scheduledBoar[player.name]) {
                game.state.scheduledBoar[player.name] = {}
              }
              game.state.scheduledBoar[player.name][round] =
                (game.state.scheduledBoar[player.name][round] || 0) + 1
            }
            else {
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
        game.log.add({
          template: '{player} schedules 1 food, 1 food, 1 wild boar from Trap Builder',
          args: { player },
        })
      }
    },
  },
  {
    id: 'domestician-expert-d148',
    name: 'Domestician Expert',
    deck: 'occupationD',
    number: 148,
    type: 'occupation',
    players: '1+',
    text: 'You can keep 2 sheep on the border between each pair of orthogonally adjacent rooms.',
    holdsAnimals: { sheep: true },
    getAnimalCapacity(player) {
      return player.getAdjacentRoomPairCount() * 2
    },
  },
  {
    id: 'casual-worker-d149',
    name: 'Casual Worker',
    deck: 'occupationD',
    number: 149,
    type: 'occupation',
    players: '1+',
    text: 'Each time another player uses a "Quarry" accumulation space, you can choose to get 1 food or build a stable without paying wood.',
    onAnyAction(game, actingPlayer, actionId, cardOwner) {
      if ((actionId === 'take-stone-1' || actionId === 'take-stone-2') && actingPlayer.name !== cardOwner.name) {
        game.actions.offerCasualWorkerChoice(cardOwner, this)
      }
    },
  },
  {
    id: 'godly-spouse-d150',
    name: 'Godly Spouse',
    deck: 'occupationD',
    number: 150,
    type: 'occupation',
    players: '1+',
    text: 'Each time you take a "Family Growth" action with the second person you place in a round, return the first person you placed home.',
    onAction(game, player, actionId) {
      if ((actionId === 'family-growth' || actionId === 'family-growth-urgent') && player.getPersonPlacedThisRound() === 2) {
        game.actions.returnWorkerHome(player, 0)
        game.log.add({
          template: '{player} returns first worker home via Godly Spouse',
          args: { player },
        })
      }
    },
  },
  {
    id: 'spin-doctor-d151',
    name: 'Spin Doctor',
    deck: 'occupationD',
    number: 151,
    type: 'occupation',
    players: '1+',
    text: 'Immediately after each time you use the "Traveling Players" accumulation space, you can place another person on an action space of your choice, regardless whether or not the action space is occupied.',
    onAction(game, player, actionId) {
      if (actionId === 'traveling-players' && player.hasAvailableWorker()) {
        game.actions.offerSpinDoctorPlacement(player, this)
      }
    },
  },
  {
    id: 'patron-d152',
    name: 'Patron',
    deck: 'occupationD',
    number: 152,
    type: 'occupation',
    players: '1+',
    text: 'Immediately before each time you play an occupation after this one (even before paying the occupation cost), you get 2 food.',
    onBeforePlayOccupation(game, player) {
      player.addResource('food', 2)
      game.log.add({
        template: '{player} gets 2 food from Patron',
        args: { player },
      })
    },
  },
  {
    id: 'wealthy-man-d153',
    name: 'Wealthy Man',
    deck: 'occupationD',
    number: 153,
    type: 'occupation',
    players: '1+',
    text: 'At the start of each of the 1st/2nd/3rd/4th/5th/6th harvest, if you have at least 1/2/3/4/5/6 grain fields, you get 1 bonus point.',
    onHarvestStart(game, player) {
      const harvestNumber = game.getHarvestNumber()
      const grainFields = player.getGrainFieldCount()
      if (grainFields >= harvestNumber) {
        player.bonusPoints = (player.bonusPoints || 0) + 1
        game.log.add({
          template: '{player} gets 1 bonus point from Wealthy Man',
          args: { player },
        })
      }
    },
  },
  {
    id: 'chimney-sweep-d154',
    name: 'Chimney Sweep',
    deck: 'occupationD',
    number: 154,
    type: 'occupation',
    players: '1+',
    text: 'Renovating to stone costs you 2 stone less. During scoring, you get 1 bonus point for each other player living in a stone house.',
    modifyRenovationCost(player, cost, toType) {
      if (toType === 'stone' && cost.stone && cost.stone > 0) {
        return { ...cost, stone: Math.max(0, cost.stone - 2) }
      }
      return cost
    },
    getEndGamePoints(player, game) {
      return game.players.all().filter(p => p.name !== player.name && p.roomType === 'stone').length
    },
  },
  {
    id: 'ebonist-d155',
    name: 'Ebonist',
    deck: 'occupationD',
    number: 155,
    type: 'occupation',
    players: '1+',
    text: 'Each harvest, you can use this card to turn exactly 1 wood into 1 food and 1 grain.',
    onHarvest(game, player) {
      if (player.wood >= 1) {
        game.actions.offerEbonistConversion(player, this)
      }
    },
  },
  {
    id: 'retail-dealer-d156',
    name: 'Retail Dealer',
    deck: 'occupationD',
    number: 156,
    type: 'occupation',
    players: '1+',
    text: 'Place 3 grain and 3 food on this card. Each time you use the "Resource Market" action space, you also get 1 grain and 1 food from this card.',
    onPlay(_game, _player) {
      this.grain = 3
      this.food = 3
    },
    onAction(game, player, actionId) {
      if (actionId === 'resource-market' && ((this.grain || 0) > 0 || (this.food || 0) > 0)) {
        if (this.grain > 0) {
          player.addResource('grain', 1)
          this.grain--
        }
        if (this.food > 0) {
          player.addResource('food', 1)
          this.food--
        }
        game.log.add({
          template: '{player} gets resources from Retail Dealer',
          args: { player },
        })
      }
    },
  },
  {
    id: 'party-organizer-d157',
    name: 'Party Organizer',
    deck: 'occupationD',
    number: 157,
    type: 'occupation',
    players: '1+',
    text: 'As soon as the next player but you gains their 5th person, you immediately get 8 food (not retroactively). During scoring, if only you have 5 people, you get 3 bonus points.',
    onAnyFamilyGrowth(game, actingPlayer, cardOwner) {
      if (actingPlayer.name !== cardOwner.name && actingPlayer.getFamilySize() === 5 && !this.triggered) {
        this.triggered = true
        cardOwner.addResource('food', 8)
        game.log.add({
          template: '{player} gets 8 food from Party Organizer',
          args: { player: cardOwner },
        })
      }
    },
    getEndGamePoints(player, game) {
      if (player.getFamilySize() === 5) {
        const othersWithFive = game.players.all().filter(p => p.name !== player.name && p.getFamilySize() === 5)
        if (othersWithFive.length === 0) {
          return 3
        }
      }
      return 0
    },
  },
  {
    id: 'bean-counter-d158',
    name: 'Bean Counter',
    deck: 'occupationD',
    number: 158,
    type: 'occupation',
    players: '1+',
    text: 'Each time you use an action space on round spaces 1 to 8, place 1 food on this card. Each time this card has 3 food on it, move the food to your supply.',
    onPlay(_game, _player) {
      this.food = 0
    },
    onAction(game, player, actionId) {
      const actionRound = game.getActionSpaceRound(actionId)
      if (actionRound >= 1 && actionRound <= 8) {
        this.food = (this.food || 0) + 1
        if (this.food >= 3) {
          player.addResource('food', 3)
          this.food = 0
          game.log.add({
            template: '{player} gets 3 food from Bean Counter',
            args: { player },
          })
        }
      }
    },
  },
  {
    id: 'reed-seller-d159',
    name: 'Reed Seller',
    deck: 'occupationD',
    number: 159,
    type: 'occupation',
    players: '1+',
    text: 'At any time, you can turn 1 reed into 3 food. Any other player can prevent this by buying the reed for 2 food from you. If multiple players are interested, choose one.',
    allowsAnytimeAction: true,
    canActivate(player) {
      return player.reed >= 1
    },
    activate(game, player) {
      game.actions.offerReedSellerConversion(player, this)
    },
  },
  {
    id: 'midwife-d160',
    name: 'Midwife',
    deck: 'occupationD',
    number: 160,
    type: 'occupation',
    players: '1+',
    text: 'Each time another player uses the first person they place in a round to take a "Family Growth" action, you get 1 grain from the general supply.',
    onAnyAction(game, actingPlayer, actionId, cardOwner) {
      if ((actionId === 'family-growth' || actionId === 'family-growth-urgent') &&
          actingPlayer.name !== cardOwner.name &&
          actingPlayer.getPersonPlacedThisRound() === 1) {
        cardOwner.addResource('grain', 1)
        game.log.add({
          template: '{player} gets 1 grain from Midwife',
          args: { player: cardOwner },
        })
      }
    },
  },
  {
    id: 'cabbage-buyer-d161',
    name: 'Cabbage Buyer',
    deck: 'occupationD',
    number: 161,
    type: 'occupation',
    players: '1+',
    text: 'Each time any player (including you) renovates and then builds no / 1 minor / 1 major improvement, you can buy 1 vegetable for 3/2/1 food.',
    onAnyRenovate(game, actingPlayer, cardOwner, improvementBuilt) {
      let cost = 3
      if (improvementBuilt === 'major') {
        cost = 1
      }
      else if (improvementBuilt === 'minor') {
        cost = 2
      }
      if (cardOwner.food >= cost) {
        game.actions.offerBuyVegetable(cardOwner, this, cost)
      }
    },
  },
  {
    id: 'clay-firer-d162',
    name: 'Clay Firer',
    deck: 'occupationD',
    number: 162,
    type: 'occupation',
    players: '1+',
    text: 'When you play this card, you immediately get 2 clay. At any time, you can turn clay into stone: you get 1 stone for 2 clay, and 2 stone for 3 clay.',
    onPlay(game, player) {
      player.addResource('clay', 2)
      game.log.add({
        template: '{player} gets 2 clay from Clay Firer',
        args: { player },
      })
    },
    allowsAnytimeConversion: [
      { from: { clay: 2 }, to: { stone: 1 } },
      { from: { clay: 3 }, to: { stone: 2 } },
    ],
  },
  {
    id: 'journeyman-bricklayer-d163',
    name: 'Journeyman Bricklayer',
    deck: 'occupationD',
    number: 163,
    type: 'occupation',
    players: '1+',
    text: 'When you play this card, you immediately get 2 stone. Each time another player renovates to stone or builds a stone room, you get 1 stone.',
    onPlay(game, player) {
      player.addResource('stone', 2)
      game.log.add({
        template: '{player} gets 2 stone from Journeyman Bricklayer',
        args: { player },
      })
    },
    onAnyRenovate(game, actingPlayer, cardOwner, improvementBuilt, toType) {
      if (actingPlayer.name !== cardOwner.name && toType === 'stone') {
        cardOwner.addResource('stone', 1)
        game.log.add({
          template: '{player} gets 1 stone from Journeyman Bricklayer',
          args: { player: cardOwner },
        })
      }
    },
    onAnyBuildRoom(game, actingPlayer, cardOwner, roomType) {
      if (actingPlayer.name !== cardOwner.name && roomType === 'stone') {
        cardOwner.addResource('stone', 1)
        game.log.add({
          template: '{player} gets 1 stone from Journeyman Bricklayer',
          args: { player: cardOwner },
        })
      }
    },
  },
  {
    id: 'pet-grower-d164',
    name: 'Pet Grower',
    deck: 'occupationD',
    number: 164,
    type: 'occupation',
    players: '1+',
    text: 'Each time you use an animal accumulation space, if afterward you have no animal in your house, you also get 1 sheep.',
    onAction(game, player, actionId) {
      if (game.isAnimalAccumulationSpace(actionId)) {
        if (player.getAnimalsInHouse() === 0 && player.canPlaceAnimals('sheep', 1)) {
          player.addAnimals('sheep', 1)
          game.log.add({
            template: '{player} gets 1 sheep from Pet Grower',
            args: { player },
          })
        }
      }
    },
  },
  {
    id: 'pig-stalker-d165',
    name: 'Pig Stalker',
    deck: 'occupationD',
    number: 165,
    type: 'occupation',
    players: '1+',
    text: 'Each time you use an animal accumulation space, if you occupy either the action space immediately above or below that accumulation space, you also get 1 wild boar.',
    onAction(game, player, actionId) {
      if (game.isAnimalAccumulationSpace(actionId)) {
        const adjacentSpaces = game.getVerticallyAdjacentActionSpaces(actionId)
        if (adjacentSpaces.some(space => player.occupiesActionSpace(space)) && player.canPlaceAnimals('boar', 1)) {
          player.addAnimals('boar', 1)
          game.log.add({
            template: '{player} gets 1 wild boar from Pig Stalker',
            args: { player },
          })
        }
      }
    },
  },
  {
    id: 'stable-milker-d166',
    name: 'Stable Milker',
    deck: 'occupationD',
    number: 166,
    type: 'occupation',
    players: '1+',
    text: 'Each time you build at least 2 stables on the same turn, you also get 1 cattle.',
    onBuildStables(game, player, stableCount) {
      if (stableCount >= 2 && player.canPlaceAnimals('cattle', 1)) {
        player.addAnimals('cattle', 1)
        game.log.add({
          template: '{player} gets 1 cattle from Stable Milker',
          args: { player },
        })
      }
    },
  },
  {
    id: 'pure-breeder-d167',
    name: 'Pure Breeder',
    deck: 'occupationD',
    number: 167,
    type: 'occupation',
    players: '1+',
    text: 'You immediately get 1 wood. After each round that does not end with a harvest, you can breed exactly one type of animal. (This is not considered a breeding phase.)',
    onPlay(game, player) {
      player.addResource('wood', 1)
      game.log.add({
        template: '{player} gets 1 wood from Pure Breeder',
        args: { player },
      })
    },
    onRoundEnd(game, player, round) {
      if (!game.isHarvestRound(round)) {
        game.actions.offerPureBreederBreeding(player, this)
      }
    },
  },
  {
    id: 'stockman-d168',
    name: 'Stockman',
    deck: 'occupationD',
    number: 168,
    type: 'occupation',
    players: '1+',
    text: 'When you build your 2nd/3rd/4th stable, you immediately get 1 cattle/wild boar/sheep, even if built on the same turn (but not retroactively).',
    onBuildStable(game, player, stableNumber) {
      const animals = { 2: 'cattle', 3: 'boar', 4: 'sheep' }
      const animal = animals[stableNumber]
      if (animal && player.canPlaceAnimals(animal, 1)) {
        player.addAnimals(animal, 1)
        game.log.add({
          template: '{player} gets 1 {animal} from Stockman',
          args: { player, animal },
        })
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
