/**
 * Occupations E Cards for Agricola (Revised Edition)
 * Cards E085-E168 - A standalone occupations deck
 */

const occupations = [
  {
    id: 'master-tanner-e085',
    name: 'Master Tanner',
    deck: 'occupationE',
    number: 85,
    type: 'occupation',
    players: '1+',
    text: 'For each wild boar or cattle that you turn into food, you can place 1 of that food on this card. While its food equals your number of rooms, this card provides room for 1 person.',
    onPlay(_game, _player) {
      this.food = 0
    },
    providesRoom: false,
    onConvertAnimalToFood(game, player, animalType) {
      if (animalType === 'boar' || animalType === 'cattle') {
        this.food = (this.food || 0) + 1
        game.log.add({
          template: '{player} places 1 food on Master Tanner',
          args: { player },
        })
        this.checkRoom(player)
      }
    },
    checkRoom(player) {
      this.providesRoom = (this.food || 0) === player.getRoomCount()
    },
  },
  {
    id: 'pen-builder-e086',
    name: 'Pen Builder',
    deck: 'occupationE',
    number: 86,
    type: 'occupation',
    players: '1+',
    text: 'At any time, you can place wood from your supply on this card, irretrievably. You can keep twice as many animals of any type on this card as there is wood on it.',
    onPlay(_game, _player) {
      this.wood = 0
    },
    allowsAnytimeAction: true,
    canPlaceWood(player) {
      return player.wood >= 1
    },
    placeWood(game, player, amount) {
      player.removeResource('wood', amount)
      this.wood = (this.wood || 0) + amount
      game.log.add({
        template: '{player} places {amount} wood on Pen Builder',
        args: { player, amount },
      })
    },
    holdsAnimals: { any: true },
    mixedAnimals: true,
    getAnimalCapacity() {
      return (this.wood || 0) * 2
    },
  },
  {
    id: 'master-renovator-e087',
    name: 'Master Renovator',
    deck: 'occupationE',
    number: 87,
    type: 'occupation',
    players: '1+',
    text: 'At the end of the work phases of rounds 7 and 9, you can take a "Renovation" action without placing a person and pay 1 building resource of your choice less.',
    onWorkPhaseEnd(game, player) {
      if (game.state.round === 7 || game.state.round === 9) {
        game.actions.offerRenovationWithDiscount(player, this)
      }
    },
  },
  {
    id: 'master-fencer-e088',
    name: 'Master Fencer',
    deck: 'occupationE',
    number: 88,
    type: 'occupation',
    players: '1+',
    text: 'Once you live in a stone house, at the start of each round, you can pay 2 or 3 wood to build up to 3 or 4 fences, respectively.',
    onRoundStart(game, player) {
      if (player.roomType === 'stone' && player.wood >= 2) {
        game.actions.offerMasterFencerBuild(player, this)
      }
    },
  },
  {
    id: 'stallwright-e089',
    name: 'Stallwright',
    deck: 'occupationE',
    number: 89,
    type: 'occupation',
    players: '1+',
    text: 'After you play your 2nd, 3rd, 5th, and 7th occupation (including this one), you can build 1 stable at no cost.',
    onPlay(game, player) {
      this.checkStable(game, player)
    },
    onPlayOccupation(game, player) {
      this.checkStable(game, player)
    },
    checkStable(game, player) {
      const occCount = player.getOccupationCount()
      if ([2, 3, 5, 7].includes(occCount)) {
        game.actions.offerBuildFreeStable(player, this)
      }
    },
  },
  {
    id: 'dung-collector-e090',
    name: 'Dung Collector',
    deck: 'occupationE',
    number: 90,
    type: 'occupation',
    players: '1+',
    text: 'Each time you get 2 or more newborn animals, you can pay 1 food to plow 1 field.',
    onBreeding(game, player, newbornCount) {
      if (newbornCount >= 2 && player.food >= 1) {
        game.actions.offerPlowForFood(player, this)
      }
    },
  },
  {
    id: 'plow-builder-e091',
    name: 'Plow Builder',
    deck: 'occupationE',
    number: 91,
    type: 'occupation',
    players: '1+',
    text: 'You can build the Joinery when taking a "Minor Improvement" action. If you use the Joinery (or an upgrade thereof) during the harvest, you can pay 1 food to plow 1 field.',
    allowsMajorOnMinorAction: true,
    allowedMajors: ['joinery'],
    onUseJoinery(game, player) {
      if (player.food >= 1) {
        game.actions.offerPlowForFood(player, this)
      }
    },
  },
  {
    id: 'field-doctor-e092',
    name: 'Field Doctor',
    deck: 'occupationE',
    number: 92,
    type: 'occupation',
    players: '1+',
    text: 'Once this game, if you live in a house with exactly 2 rooms surrounded by 4 field tiles, you can use any "Family Growth" action space even without room.',
    onPlay(_game, _player) {
      this.used = false
    },
    allowsFamilyGrowthWithoutRoom(player) {
      return !this.used && player.getRoomCount() === 2 && player.getRoomsSurroundedByFields() >= 4
    },
    onFamilyGrowthWithoutRoom(_game, _player) {
      this.used = true
    },
  },
  {
    id: 'motivator-e093',
    name: 'Motivator',
    deck: 'occupationE',
    number: 93,
    type: 'occupation',
    players: '1+',
    text: 'On your first turn each round, if you have no unused farmyard spaces, you can place a person from your supply.',
    onTurnStart(game, player) {
      if (player.isFirstTurnOfRound() && player.getUnusedFarmyardSpaces() === 0 && player.hasPersonInSupply()) {
        game.actions.offerPlacePersonFromSupply(player, this)
      }
    },
  },
  {
    id: 'prophet-e094',
    name: 'Prophet',
    deck: 'occupationE',
    number: 94,
    type: 'occupation',
    players: '1+',
    text: 'When you play this card, immediately take a "Renovation" action. Afterward, you can take a "Build Fences" action. (Both actions require their usual cost.)',
    onPlay(game, player) {
      game.actions.offerRenovation(player, this)
      game.actions.offerBuildFences(player, this)
    },
  },
  {
    id: 'miller-e095',
    name: 'Miller',
    deck: 'occupationE',
    number: 95,
    type: 'occupation',
    players: '1+',
    text: 'You can immediately build a baking improvement by paying its cost. Each time another player uses the "Grain Seeds" action space, you can take a "Bake Bread" action.',
    onPlay(game, player) {
      game.actions.offerBuildBakingImprovement(player, this)
    },
    onAnyAction(game, actingPlayer, actionId, cardOwner) {
      if (actionId === 'take-grain' && actingPlayer.name !== cardOwner.name) {
        game.actions.offerBakeBread(cardOwner, this)
      }
    },
  },
  {
    id: 'elder-e096',
    name: 'Elder',
    deck: 'occupationE',
    number: 96,
    type: 'occupation',
    players: '1+',
    text: 'You can play this card at the start of the work phase of round 1 without placing a person. (This card has no effect other than counting as a played occupation.)',
    canPlayWithoutPerson(game) {
      return game.state.round === 1 && game.state.phase === 'work-start'
    },
  },
  {
    id: 'beneficiary-e097',
    name: 'Beneficiary',
    deck: 'occupationE',
    number: 97,
    type: 'occupation',
    players: '1+',
    text: 'If this is your 3rd occupation, you can immediately play another occupation for an occupation cost of 1 food and/or play 1 minor improvement by paying its cost.',
    onPlay(game, player) {
      if (player.getOccupationCount() === 3) {
        game.actions.offerPlayOccupation(player, this, { cost: { food: 1 } })
        game.actions.offerPlayMinorImprovement(player, this)
      }
    },
  },
  {
    id: 'prodigy-e098',
    name: 'Prodigy',
    deck: 'occupationE',
    number: 98,
    type: 'occupation',
    players: '1+',
    text: 'If this is your 1st occupation, you immediately get 1 bonus point for each improvement you have. (This will not apply to improvements played after this card.)',
    onPlay(game, player) {
      if (player.getOccupationCount() === 1) {
        const improvementCount = player.getAllImprovements().length
        player.bonusPoints = (player.bonusPoints || 0) + improvementCount
        game.log.add({
          template: '{player} gets {amount} bonus points from Prodigy',
          args: { player, amount: improvementCount },
        })
      }
    },
  },
  {
    id: 'uncaring-parents-e099',
    name: 'Uncaring Parents',
    deck: 'occupationE',
    number: 99,
    type: 'occupation',
    players: '1+',
    text: 'At the end of each harvest, if you live in a stone house, you get 1 bonus point.',
    onHarvestEnd(game, player) {
      if (player.roomType === 'stone') {
        player.bonusPoints = (player.bonusPoints || 0) + 1
        game.log.add({
          template: '{player} gets 1 bonus point from Uncaring Parents',
          args: { player },
        })
      }
    },
  },
  {
    id: 'museum-caretaker-e100',
    name: 'Museum Caretaker',
    deck: 'occupationE',
    number: 100,
    type: 'occupation',
    players: '1+',
    text: 'At the start of each work phase, if you have at least 1 wood, 1 clay, 1 reed, 1 stone, 1 grain, and 1 vegetable in your supply, you get 1 bonus point.',
    onWorkPhaseStart(game, player) {
      if (player.wood >= 1 && player.clay >= 1 && player.reed >= 1 &&
          player.stone >= 1 && player.grain >= 1 && player.vegetables >= 1) {
        player.bonusPoints = (player.bonusPoints || 0) + 1
        game.log.add({
          template: '{player} gets 1 bonus point from Museum Caretaker',
          args: { player },
        })
      }
    },
  },
  {
    id: 'blighter-e101',
    name: 'Blighter',
    deck: 'occupationE',
    number: 101,
    type: 'occupation',
    players: '1+',
    text: 'When you play this card, you get 1 bonus point for each complete stage left to play. You may not play any more occupations.',
    onPlay(game, player) {
      const stagesLeft = game.getCompleteStagesLeft()
      player.bonusPoints = (player.bonusPoints || 0) + stagesLeft
      player.cannotPlayOccupations = true
      game.log.add({
        template: '{player} gets {amount} bonus points from Blighter (no more occupations allowed)',
        args: { player, amount: stagesLeft },
      })
    },
  },
  {
    id: 'acquirer-e102',
    name: 'Acquirer',
    deck: 'occupationE',
    number: 102,
    type: 'occupation',
    players: '1+',
    text: 'At the start of each round, you may pay food equal to the number of people you have to buy 1 good of your choice from the general supply.',
    onRoundStart(game, player) {
      const cost = player.getFamilySize()
      if (player.food >= cost) {
        game.actions.offerAcquirerPurchase(player, this, cost)
      }
    },
  },
  {
    id: 'wolf-e103',
    name: 'Wolf',
    deck: 'occupationE',
    number: 103,
    type: 'occupation',
    players: '1+',
    text: 'Pile (from bottom to top) 1 clay, 1 wood, and 1 grain on this card. Each time you get a good matching the top item, you can move that item to your supply and get 1 wild boar.',
    onPlay(_game, _player) {
      this.pile = ['clay', 'wood', 'grain']
    },
    onObtainResource(game, player, resourceType) {
      if (this.pile && this.pile.length > 0) {
        const topItem = this.pile[this.pile.length - 1]
        if (resourceType === topItem) {
          this.pile.pop()
          player.addResource(topItem, 1)
          if (player.canPlaceAnimals('boar', 1)) {
            player.addAnimals('boar', 1)
            game.log.add({
              template: '{player} gets 1 {resource} and 1 wild boar from Wolf',
              args: { player, resource: topItem },
            })
          }
        }
      }
    },
  },
  {
    id: 'spice-trader-e104',
    name: 'Spice Trader',
    deck: 'occupationE',
    number: 104,
    type: 'occupation',
    players: '1+',
    text: 'If you play this card in round 4 or before, place 3 vegetables on the space for round 11. At the start of that round, you get the vegetables.',
    onPlay(game, player) {
      if (game.state.round <= 4) {
        if (!game.state.scheduledVegetables) {
          game.state.scheduledVegetables = {}
        }
        if (!game.state.scheduledVegetables[player.name]) {
          game.state.scheduledVegetables[player.name] = {}
        }
        game.state.scheduledVegetables[player.name][11] =
          (game.state.scheduledVegetables[player.name][11] || 0) + 3
        game.log.add({
          template: '{player} schedules 3 vegetables for round 11 from Spice Trader',
          args: { player },
        })
      }
    },
  },
  {
    id: 'pioneer-e105',
    name: 'Pioneer',
    deck: 'occupationE',
    number: 105,
    type: 'occupation',
    players: '1+',
    text: 'When you play this card and each time before you use the most recent action space card, you get 1 building resource of your choice and 1 food.',
    onPlay(game, player) {
      game.actions.offerBuildingResourceChoice(player, this)
      player.addResource('food', 1)
      game.log.add({
        template: '{player} gets 1 food from Pioneer',
        args: { player },
      })
    },
    onBeforeAction(game, player, actionId) {
      if (game.getActionSpaceRound(actionId) === game.getMostRecentlyRevealedRound()) {
        game.actions.offerBuildingResourceChoice(player, this)
        player.addResource('food', 1)
        game.log.add({
          template: '{player} gets 1 food from Pioneer',
          args: { player },
        })
      }
    },
  },
  {
    id: 'emergency-seller-e106',
    name: 'Emergency Seller',
    deck: 'occupationE',
    number: 106,
    type: 'occupation',
    players: '1+',
    text: 'When you play this card, you can immediately turn as many building resources into food as you have people: Each wood or clay is worth 2 food; each reed or stone is worth 3 food.',
    onPlay(game, player) {
      game.actions.offerEmergencySellerConversion(player, this, player.getFamilySize())
    },
  },
  {
    id: 'land-surveyor-e107',
    name: 'Land Surveyor',
    deck: 'occupationE',
    number: 107,
    type: 'occupation',
    players: '1+',
    text: 'In the field phase of each harvest, if you have at least 2/4/6/7 fields, you get 1/2/3/4 food.',
    onFieldPhase(game, player) {
      const fields = player.getFieldCount()
      let food = 0
      if (fields >= 7) {
        food = 4
      }
      else if (fields >= 6) {
        food = 3
      }
      else if (fields >= 4) {
        food = 2
      }
      else if (fields >= 2) {
        food = 1
      }
      if (food > 0) {
        player.addResource('food', food)
        game.log.add({
          template: '{player} gets {amount} food from Land Surveyor',
          args: { player, amount: food },
        })
      }
    },
  },
  {
    id: 'blackberry-farmer-e108',
    name: 'Blackberry Farmer',
    deck: 'occupationE',
    number: 108,
    type: 'occupation',
    players: '1+',
    text: 'Each time you build fences, place 1 food on each remaining round space, up to the number of fences just built. At the start of these rounds, you get the food.',
    onBuildFence(game, player, fenceCount) {
      const currentRound = game.state.round
      let placedCount = 0
      for (let round = currentRound + 1; round <= 14 && placedCount < fenceCount; round++) {
        if (!game.state.scheduledFood) {
          game.state.scheduledFood = {}
        }
        if (!game.state.scheduledFood[player.name]) {
          game.state.scheduledFood[player.name] = {}
        }
        game.state.scheduledFood[player.name][round] =
          (game.state.scheduledFood[player.name][round] || 0) + 1
        placedCount++
      }
      game.log.add({
        template: '{player} schedules {count} food from Blackberry Farmer',
        args: { player, count: placedCount },
      })
    },
  },
  {
    id: 'braid-maker-e109',
    name: 'Braid Maker',
    deck: 'occupationE',
    number: 109,
    type: 'occupation',
    players: '1+',
    text: "Each harvest, you can use this card to exchange 1 reed for 2 food. You can build the Basketmaker's Workshop for 1 reed and 1 stone even when taking a \"Minor Impr.\" action.",
    onHarvest(game, player) {
      if (player.reed >= 1) {
        game.actions.offerBraidMakerConversion(player, this)
      }
    },
    allowsMajorOnMinorAction: true,
    allowedMajors: ['basketmakers-workshop'],
    modifyMajorCost(player, majorId, cost) {
      if (majorId === 'basketmakers-workshop') {
        return { reed: 1, stone: 1 }
      }
      return cost
    },
  },
  {
    id: 'dentist-e110',
    name: 'Dentist',
    deck: 'occupationE',
    number: 110,
    type: 'occupation',
    players: '1+',
    text: 'At the start of each harvest, you can place 1 wood from your supply on this card, irretrievably. In each feeding phase, you get 1 food for each wood on this card.',
    onPlay(_game, _player) {
      this.wood = 0
    },
    onHarvestStart(game, player) {
      if (player.wood >= 1) {
        game.actions.offerDentistPlaceWood(player, this)
      }
    },
    onFeedingPhaseStart(game, player) {
      const food = this.wood || 0
      if (food > 0) {
        player.addResource('food', food)
        game.log.add({
          template: '{player} gets {amount} food from Dentist',
          args: { player, amount: food },
        })
      }
    },
  },
  {
    id: 'recluse-e111',
    name: 'Recluse',
    deck: 'occupationE',
    number: 111,
    type: 'occupation',
    players: '1+',
    text: 'As long as you have no minor improvements in front of you, you get 1 food at the start of each round and 1 wood at the start of each harvest.',
    onRoundStart(game, player) {
      if (player.getMinorImprovementCount() === 0) {
        player.addResource('food', 1)
        game.log.add({
          template: '{player} gets 1 food from Recluse',
          args: { player },
        })
      }
    },
    onHarvestStart(game, player) {
      if (player.getMinorImprovementCount() === 0) {
        player.addResource('wood', 1)
        game.log.add({
          template: '{player} gets 1 wood from Recluse',
          args: { player },
        })
      }
    },
  },
  {
    id: 'grain-thief-e112',
    name: 'Grain Thief',
    deck: 'occupationE',
    number: 112,
    type: 'occupation',
    players: '1+',
    text: 'Each time you would harvest a grain field, you can leave the grain on the field and take 1 grain from the general supply instead.',
    onHarvestGrainField(game, player) {
      game.actions.offerGrainThiefChoice(player, this)
    },
  },
  {
    id: 'godmother-e113',
    name: 'Godmother',
    deck: 'occupationE',
    number: 113,
    type: 'occupation',
    players: '1+',
    text: 'Each time you take a "Family Growth" action, you also get 1 vegetable.',
    onAction(game, player, actionId) {
      if (actionId === 'family-growth' || actionId === 'family-growth-urgent') {
        player.addResource('vegetables', 1)
        game.log.add({
          template: '{player} gets 1 vegetable from Godmother',
          args: { player },
        })
      }
    },
  },
  {
    id: 'shed-builder-e114',
    name: 'Shed Builder',
    deck: 'occupationE',
    number: 114,
    type: 'occupation',
    players: '1+',
    text: 'When you build your 1st and 2nd stable, you get 1 grain. When you build your 3rd and 4th stable, you get 1 vegetable. (This does not apply to stables you have already built.)',
    onBuildStable(game, player, stableNumber) {
      if (stableNumber === 1 || stableNumber === 2) {
        player.addResource('grain', 1)
        game.log.add({
          template: '{player} gets 1 grain from Shed Builder',
          args: { player },
        })
      }
      else if (stableNumber === 3 || stableNumber === 4) {
        player.addResource('vegetables', 1)
        game.log.add({
          template: '{player} gets 1 vegetable from Shed Builder',
          args: { player },
        })
      }
    },
  },
  {
    id: 'seed-servant-e115',
    name: 'Seed Servant',
    deck: 'occupationE',
    number: 115,
    type: 'occupation',
    players: '1+',
    text: 'Each time after you use the "Grain Seeds" or "Vegetable Seeds" action space, you can take a "Bake bread" or "Sow" action, respectively.',
    onAction(game, player, actionId) {
      if (actionId === 'take-grain') {
        game.actions.offerBakeBread(player, this)
      }
      else if (actionId === 'take-vegetables') {
        game.actions.offerSow(player, this)
      }
    },
  },
  {
    id: 'fir-cutter-e116',
    name: 'Fir Cutter',
    deck: 'occupationE',
    number: 116,
    type: 'occupation',
    players: '1+',
    text: 'When you play this card, you immediately get 1 food. Each time after you use an animal accumulation space with your 1st/2nd/3rd/4th/5th person, you get 1/1/2/2/3 wood.',
    onPlay(game, player) {
      player.addResource('food', 1)
      game.log.add({
        template: '{player} gets 1 food from Fir Cutter',
        args: { player },
      })
    },
    onAction(game, player, actionId) {
      if (game.isAnimalAccumulationSpace(actionId)) {
        const personNumber = player.getPersonPlacedThisRound()
        const woodAmounts = { 1: 1, 2: 1, 3: 2, 4: 2, 5: 3 }
        const wood = woodAmounts[personNumber] || 0
        if (wood > 0) {
          player.addResource('wood', wood)
          game.log.add({
            template: '{player} gets {amount} wood from Fir Cutter',
            args: { player, amount: wood },
          })
        }
      }
    },
  },
  {
    id: 'pipe-smoker-e117',
    name: 'Pipe Smoker',
    deck: 'occupationE',
    number: 117,
    type: 'occupation',
    players: '1+',
    text: 'At the start of each harvest, if you have at least 1 grain field, you get 2 wood.',
    onHarvestStart(game, player) {
      if (player.getGrainFieldCount() >= 1) {
        player.addResource('wood', 2)
        game.log.add({
          template: '{player} gets 2 wood from Pipe Smoker',
          args: { player },
        })
      }
    },
  },
  {
    id: 'kindling-gatherer-e118',
    name: 'Kindling Gatherer',
    deck: 'occupationE',
    number: 118,
    type: 'occupation',
    players: '1+',
    text: 'Each time you get food from an action space, you get 1 additional wood.',
    onAction(game, player, actionId) {
      if (game.actionSpaceGivesFood(actionId)) {
        player.addResource('wood', 1)
        game.log.add({
          template: '{player} gets 1 wood from Kindling Gatherer',
          args: { player },
        })
      }
    },
  },
  {
    id: 'land-heir-e119',
    name: 'Land Heir',
    deck: 'occupationE',
    number: 119,
    type: 'occupation',
    players: '1+',
    text: 'If you play this card in round 4 or before, place 4 wood and 4 clay on the space for round 9. At the start of this round, you get the resources.',
    onPlay(game, player) {
      if (game.state.round <= 4) {
        if (!game.state.scheduledWood) {
          game.state.scheduledWood = {}
        }
        if (!game.state.scheduledWood[player.name]) {
          game.state.scheduledWood[player.name] = {}
        }
        game.state.scheduledWood[player.name][9] =
          (game.state.scheduledWood[player.name][9] || 0) + 4

        if (!game.state.scheduledClay) {
          game.state.scheduledClay = {}
        }
        if (!game.state.scheduledClay[player.name]) {
          game.state.scheduledClay[player.name] = {}
        }
        game.state.scheduledClay[player.name][9] =
          (game.state.scheduledClay[player.name][9] || 0) + 4

        game.log.add({
          template: '{player} schedules 4 wood and 4 clay for round 9 from Land Heir',
          args: { player },
        })
      }
    },
  },
  {
    id: 'scrap-collector-e120',
    name: 'Scrap Collector',
    deck: 'occupationE',
    number: 120,
    type: 'occupation',
    players: '1+',
    text: 'Alternate placing 1 wood and 1 clay on each of the next 6 round spaces, starting with wood. At the start of these rounds, you get the respective resource.',
    onPlay(game, player) {
      const currentRound = game.state.round
      const resources = ['wood', 'clay', 'wood', 'clay', 'wood', 'clay']
      for (let i = 0; i < 6; i++) {
        const round = currentRound + i + 1
        if (round <= 14) {
          const resource = resources[i]
          const stateKey = resource === 'wood' ? 'scheduledWood' : 'scheduledClay'
          if (!game.state[stateKey]) {
            game.state[stateKey] = {}
          }
          if (!game.state[stateKey][player.name]) {
            game.state[stateKey][player.name] = {}
          }
          game.state[stateKey][player.name][round] =
            (game.state[stateKey][player.name][round] || 0) + 1
        }
      }
      game.log.add({
        template: '{player} schedules alternating wood and clay for next 6 rounds from Scrap Collector',
        args: { player },
      })
    },
  },
  {
    id: 'hill-cultivator-e121',
    name: 'Hill Cultivator',
    deck: 'occupationE',
    number: 121,
    type: 'occupation',
    players: '1+',
    text: 'Each time you use the "Grain Seeds" or "Vegetable Seeds" action space, you also get 2 or 3 clay, respectively.',
    onAction(game, player, actionId) {
      if (actionId === 'take-grain') {
        player.addResource('clay', 2)
        game.log.add({
          template: '{player} gets 2 clay from Hill Cultivator',
          args: { player },
        })
      }
      else if (actionId === 'take-vegetables') {
        player.addResource('clay', 3)
        game.log.add({
          template: '{player} gets 3 clay from Hill Cultivator',
          args: { player },
        })
      }
    },
  },
  {
    id: 'cottar-e122',
    name: 'Cottar',
    deck: 'occupationE',
    number: 122,
    type: 'occupation',
    players: '1+',
    text: 'Each time you play or build an improvement, you get your choice of 1 wood or 1 clay immediately after paying its cost.',
    onPlayImprovement(game, player) {
      game.actions.offerWoodOrClay(player, this)
    },
    onBuildImprovement(game, player) {
      game.actions.offerWoodOrClay(player, this)
    },
  },
  {
    id: 'resource-hoarder-e123',
    name: 'Resource Hoarder',
    deck: 'occupationE',
    number: 123,
    type: 'occupation',
    players: '1+',
    text: 'Pile resources as depicted on this card. You can use the top item(s) when building a room, playing/building an improvement, or renovating. (From bottom to top: Stone, Clay, Stone, Reed, Wood, Clay)',
    onPlay(_game, _player) {
      this.pile = ['stone', 'clay', 'stone', 'reed', 'wood', 'clay']
    },
    canUseTopResource(resourceType) {
      return this.pile && this.pile.length > 0 && this.pile[this.pile.length - 1] === resourceType
    },
    useTopResource(game, player) {
      if (this.pile && this.pile.length > 0) {
        const resource = this.pile.pop()
        game.log.add({
          template: '{player} uses 1 {resource} from Resource Hoarder',
          args: { player, resource },
        })
        return resource
      }
      return null
    },
  },
  {
    id: 'mayor-candidate-e124',
    name: 'Mayor Candidate',
    deck: 'occupationE',
    number: 124,
    type: 'occupation',
    players: '1+',
    text: 'You immediately get 2 wood and 2 stone. During scoring, you get 1 negative point for each wood and each stone in your supply. You can no longer discard wood or stone.',
    onPlay(game, player) {
      player.addResource('wood', 2)
      player.addResource('stone', 2)
      player.cannotDiscardWoodOrStone = true
      game.log.add({
        template: '{player} gets 2 wood and 2 stone from Mayor Candidate',
        args: { player },
      })
    },
    getEndGamePoints(player) {
      return -(player.wood + player.stone)
    },
  },
  {
    id: 'delayed-wayfarer-e125',
    name: 'Delayed Wayfarer',
    deck: 'occupationE',
    number: 125,
    type: 'occupation',
    players: '1+',
    text: 'When you play this card, you immediately get 1 building resource of your choice and, once all people have been placed this round, you can place a person from your supply.',
    onPlay(game, player) {
      game.actions.offerBuildingResourceChoice(player, this)
      player.delayedWayfarerPending = true
    },
    onAllPeoplePlaced(game, player) {
      if (player.delayedWayfarerPending && player.hasPersonInSupply()) {
        game.actions.offerPlacePersonFromSupply(player, this)
        player.delayedWayfarerPending = false
      }
    },
  },
  {
    id: 'tax-collector-e126',
    name: 'Tax Collector',
    deck: 'occupationE',
    number: 126,
    type: 'occupation',
    players: '1+',
    text: 'Once you live in a stone house, at the start of each round, you get your choice of 2 wood, 2 clay, 1 reed, or 1 stone.',
    onRoundStart(game, player) {
      if (player.roomType === 'stone') {
        game.actions.offerTaxCollectorChoice(player, this)
      }
    },
  },
  {
    id: 'diligent-farmer-e127',
    name: 'Diligent Farmer',
    deck: 'occupationE',
    number: 127,
    type: 'occupation',
    players: '1+',
    text: 'When you play this card, if you would score the maximum 4 points in 3 scoring categories (including fenced stables), you can extend your house by 1 room at no cost.',
    onPlay(game, player) {
      if (player.getCategoriesWithMaxScore() >= 3) {
        game.actions.buildFreeRoom(player, this)
      }
    },
  },
  {
    id: 'saddler-e128',
    name: 'Saddler',
    deck: 'occupationE',
    number: 128,
    type: 'occupation',
    players: '1+',
    text: 'Each time after you build a major improvement, you can pay 1 food to plow 1 field.',
    onBuildMajor(game, player) {
      if (player.food >= 1) {
        game.actions.offerPlowForFood(player, this)
      }
    },
  },
  {
    id: 'imitator-e129',
    name: 'Imitator',
    deck: 'occupationE',
    number: 129,
    type: 'occupation',
    players: '1+',
    text: 'If you have a person on the "Day Laborer" action space, you can use non-accumulating round 1-9 action spaces even if they are occupied.',
    allowsIgnoreOccupied(player, actionId, game) {
      return player.occupiesActionSpace('day-laborer') &&
             game.isNonAccumulatingActionSpace(actionId) &&
             game.getActionSpaceRound(actionId) >= 1 &&
             game.getActionSpaceRound(actionId) <= 9
    },
  },
  {
    id: 'overachiever-e130',
    name: 'Overachiever',
    deck: 'occupationE',
    number: 130,
    type: 'occupation',
    players: '1+',
    text: 'Each time you use a "Wish for Children" action space, you can play 1 additional improvement by paying its cost less 1 resource of your choice.',
    onAction(game, player, actionId) {
      if (actionId === 'family-growth' || actionId === 'family-growth-urgent') {
        game.actions.offerOverachieverImprovement(player, this)
      }
    },
  },
  {
    id: 'market-master-e131',
    name: 'Market Master',
    deck: 'occupationE',
    number: 131,
    type: 'occupation',
    players: '1+',
    text: 'Immediately after each time you place your last person in a round on the "Traveling Players" accumulation space, you can play 1 occupation for an occupation cost of 1 food.',
    onAction(game, player, actionId) {
      const targetAction = game.players.count() === 3 ? 'resource-market' : 'traveling-players'
      if (actionId === targetAction && player.isLastPersonPlaced()) {
        game.actions.offerPlayOccupation(player, this, { cost: { food: 1 } })
      }
    },
  },
  {
    id: 'veggie-lover-e132',
    name: 'Veggie Lover',
    deck: 'occupationE',
    number: 132,
    type: 'occupation',
    players: '1+',
    text: 'In each harvest, you can use this card to exchange a pair of 1 grain and 1 vegetable into 6 food. During scoring, you can exchange 1/2/3 pairs of 1 grain and 1 vegetable for 2/4/6 bonus points.',
    onHarvest(game, player) {
      if (player.grain >= 1 && player.vegetables >= 1) {
        game.actions.offerVeggieLoverHarvestConversion(player, this)
      }
    },
    onScoring(game, player) {
      game.actions.offerVeggieLoverScoringConversion(player, this)
    },
  },
  {
    id: 'champion-breeder-e133',
    name: 'Champion Breeder',
    deck: 'occupationE',
    number: 133,
    type: 'occupation',
    players: '1+',
    text: 'Each time you place 2 or 3+ newborn animals on your farm during the breeding phase of the harvest, you get 1 or 2 bonus points, respectively.',
    onBreedingPhase(game, player, newbornCount) {
      let points = 0
      if (newbornCount >= 3) {
        points = 2
      }
      else if (newbornCount >= 2) {
        points = 1
      }
      if (points > 0) {
        player.bonusPoints = (player.bonusPoints || 0) + points
        game.log.add({
          template: '{player} gets {amount} bonus points from Champion Breeder',
          args: { player, amount: points },
        })
      }
    },
  },
  {
    id: 'omnifarmer-e134',
    name: 'Omnifarmer',
    deck: 'occupationE',
    number: 134,
    type: 'occupation',
    players: '1+',
    text: 'Each harvest, you can place 1 harvested crop or 1 newborn animal on this card, irretrievably. Once this game, exchange 2/3/4/5 different goods on this for 3/5/7/9 bonus points.',
    onPlay(_game, _player) {
      this.goods = []
      this.exchanged = false
    },
    onHarvest(game, player) {
      game.actions.offerOmnifarmerPlace(player, this)
    },
    canExchange() {
      return !this.exchanged && this.goods && this.goods.length >= 2
    },
    exchange(game, player) {
      const uniqueGoods = new Set(this.goods).size
      const pointsMap = { 2: 3, 3: 5, 4: 7, 5: 9 }
      const points = pointsMap[Math.min(5, uniqueGoods)] || 0
      if (points > 0) {
        player.bonusPoints = (player.bonusPoints || 0) + points
        this.exchanged = true
        game.log.add({
          template: '{player} exchanges goods for {amount} bonus points via Omnifarmer',
          args: { player, amount: points },
        })
      }
    },
  },
  {
    id: 'pickler-e135',
    name: 'Pickler',
    deck: 'occupationE',
    number: 135,
    type: 'occupation',
    players: '1+',
    text: 'If there are still 1/3/6/9 complete rounds left to play, you immediately get 1/2/3/4 wood. During scoring, each player with the most total vegetables gets 3 bonus points.',
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
          template: '{player} gets {amount} wood from Pickler',
          args: { player, amount: wood },
        })
      }
    },
    getEndGamePointsAllPlayers(game) {
      const bonuses = {}
      let maxVegetables = 0
      for (const player of game.players.all()) {
        maxVegetables = Math.max(maxVegetables, player.getTotalVegetables())
      }
      for (const player of game.players.all()) {
        if (player.getTotalVegetables() === maxVegetables) {
          bonuses[player.name] = 3
        }
      }
      return bonuses
    },
  },
  {
    id: 'animal-husbandry-worker-e136',
    name: 'Animal Husbandry Worker',
    deck: 'occupationE',
    number: 136,
    type: 'occupation',
    players: '1+',
    text: 'If there are still 3/6/9 complete rounds left to play, you immediately get 2/3/4 wood and a "Build Fences" action. During scoring, each player with the most pastures gets 2 bonus points.',
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
          template: '{player} gets {amount} wood from Animal Husbandry Worker',
          args: { player, amount: wood },
        })
        game.actions.offerBuildFences(player, this)
      }
    },
    getEndGamePointsAllPlayers(game) {
      const bonuses = {}
      let maxPastures = 0
      for (const player of game.players.all()) {
        maxPastures = Math.max(maxPastures, player.getPastureCount())
      }
      for (const player of game.players.all()) {
        if (player.getPastureCount() === maxPastures) {
          bonuses[player.name] = 2
        }
      }
      return bonuses
    },
  },
  {
    id: 'flax-farmer-e137',
    name: 'Flax Farmer',
    deck: 'occupationE',
    number: 137,
    type: 'occupation',
    players: '1+',
    text: 'Each time you use the "Reed Bank" accumulation space, you also get 1 grain. Each time you use the "Grain Seeds" action space, you also get 1 reed.',
    onAction(game, player, actionId) {
      if (actionId === 'reed-bank') {
        player.addResource('grain', 1)
        game.log.add({
          template: '{player} gets 1 grain from Flax Farmer',
          args: { player },
        })
      }
      else if (actionId === 'take-grain') {
        player.addResource('reed', 1)
        game.log.add({
          template: '{player} gets 1 reed from Flax Farmer',
          args: { player },
        })
      }
    },
  },
  {
    id: 'livestock-expert-e138',
    name: 'Livestock Expert',
    deck: 'occupationE',
    number: 138,
    type: 'occupation',
    players: '1+',
    text: 'If you play this card in round 11 or before, choose an animal type: you immediately get a number of animals of that type equal to the number you already have on your farm.',
    onPlay(game, player) {
      if (game.state.round <= 11) {
        game.actions.offerLivestockExpertChoice(player, this)
      }
    },
  },
  {
    id: 'bunny-breeder-e139',
    name: 'Bunny Breeder',
    deck: 'occupationE',
    number: 139,
    type: 'occupation',
    players: '1+',
    text: 'Select a future round space, subtract the number of the current round from it, and place this many food on that space. At the start of that round, you get the food.',
    onPlay(game, player) {
      game.actions.offerBunnyBreederChoice(player, this)
    },
  },
  {
    id: 'carter-e140',
    name: 'Carter',
    deck: 'occupationE',
    number: 140,
    type: 'occupation',
    players: '1+',
    text: 'Next round, each time you use a building resource accumulation space, you also get 1 food for each building resource that you take from the space.',
    onPlay(game, _player) {
      this.activeRound = game.state.round + 1
    },
    onAction(game, player, actionId) {
      if (game.state.round === this.activeRound && game.isBuildingResourceAccumulationSpace(actionId)) {
        const resources = game.getAccumulatedResources(actionId)
        const total = (resources.wood || 0) + (resources.clay || 0) + (resources.reed || 0) + (resources.stone || 0)
        if (total > 0) {
          player.addResource('food', total)
          game.log.add({
            template: '{player} gets {amount} food from Carter',
            args: { player, amount: total },
          })
        }
      }
    },
  },
  {
    id: 'vegetable-vendor-e141',
    name: 'Vegetable Vendor',
    deck: 'occupationE',
    number: 141,
    type: 'occupation',
    players: '1+',
    text: 'Each time you use the "Major Improvement" or "Vegetable Seeds" action space, you also get 1 vegetable or a "Major or Minor Improvement" action, respectively.',
    onAction(game, player, actionId) {
      if (actionId === 'major-improvement') {
        player.addResource('vegetables', 1)
        game.log.add({
          template: '{player} gets 1 vegetable from Vegetable Vendor',
          args: { player },
        })
      }
      else if (actionId === 'take-vegetables') {
        game.actions.offerPlayImprovement(player, this)
      }
    },
  },
  {
    id: 'smuggler-e142',
    name: 'Smuggler',
    deck: 'occupationE',
    number: 142,
    type: 'occupation',
    players: '1+',
    text: 'In the feeding phase of each harvest, you can exchange up to 2 goods as follows: 1 wood to 1 grain and/or 1 grain to 1 stone.',
    onFeedingPhase(game, player) {
      game.actions.offerSmugglerExchange(player, this)
    },
  },
  {
    id: 'hewer-e143',
    name: 'Hewer',
    deck: 'occupationE',
    number: 143,
    type: 'occupation',
    players: '1+',
    text: 'From round 3 on, at the end of each work phase in which all clay accumulation spaces are unoccupied, you get 1 stone and 1 food.',
    onWorkPhaseEnd(game, player) {
      if (game.state.round >= 3 && game.allClayAccumulationSpacesUnoccupied()) {
        player.addResource('stone', 1)
        player.addResource('food', 1)
        game.log.add({
          template: '{player} gets 1 stone and 1 food from Hewer',
          args: { player },
        })
      }
    },
  },
  {
    id: 'wares-salesman-e144',
    name: 'Wares Salesman',
    deck: 'occupationE',
    number: 144,
    type: 'occupation',
    players: '1+',
    text: 'Each time any player (including you) plays or builds a card that lets them turn building resources into food, you get exactly 1 corresponding building resource and 1 reed.',
    onAnyPlayCard(game, actingPlayer, cardOwner, card) {
      if (card.convertsBuildingResourcesToFood) {
        const resourceType = card.buildingResourceType || 'wood'
        cardOwner.addResource(resourceType, 1)
        cardOwner.addResource('reed', 1)
        game.log.add({
          template: '{player} gets 1 {resource} and 1 reed from Wares Salesman',
          args: { player: cardOwner, resource: resourceType },
        })
      }
    },
  },
  {
    id: 'parvenu-e145',
    name: 'Parvenu',
    deck: 'occupationE',
    number: 145,
    type: 'occupation',
    players: '1+',
    text: 'If you play this card in round 7 or before, choose clay or reed: you immediately get a number of that building resource equal to the number you already have in your supply.',
    onPlay(game, player) {
      if (game.state.round <= 7) {
        game.actions.offerParvenuChoice(player, this)
      }
    },
  },
  {
    id: 'reseller-e146',
    name: 'Reseller',
    deck: 'occupationE',
    number: 146,
    type: 'occupation',
    players: '1+',
    text: 'Once this game, immediately after playing or building an improvement, you can choose to get its printed cost from the general supply.',
    onPlay(_game, _player) {
      this.used = false
    },
    onPlayImprovement(game, player, improvement) {
      if (!this.used) {
        game.actions.offerResellerRefund(player, this, improvement)
      }
    },
    onBuildImprovement(game, player, improvement) {
      if (!this.used) {
        game.actions.offerResellerRefund(player, this, improvement)
      }
    },
  },
  {
    id: 'animal-driver-e147',
    name: 'Animal Driver',
    deck: 'occupationE',
    number: 147,
    type: 'occupation',
    players: '1+',
    text: 'At the start of each harvest, if you have 1/2/3+ fenced stables, you get 1 sheep/wild boar/cattle.',
    onHarvestStart(game, player) {
      const fencedStables = player.getFencedStableCount()
      if (fencedStables >= 3 && player.canPlaceAnimals('cattle', 1)) {
        player.addAnimals('cattle', 1)
        game.log.add({
          template: '{player} gets 1 cattle from Animal Driver',
          args: { player },
        })
      }
      else if (fencedStables >= 2 && player.canPlaceAnimals('boar', 1)) {
        player.addAnimals('boar', 1)
        game.log.add({
          template: '{player} gets 1 wild boar from Animal Driver',
          args: { player },
        })
      }
      else if (fencedStables >= 1 && player.canPlaceAnimals('sheep', 1)) {
        player.addAnimals('sheep', 1)
        game.log.add({
          template: '{player} gets 1 sheep from Animal Driver',
          args: { player },
        })
      }
    },
  },
  {
    id: 'lazybones-e148',
    name: 'Lazybones',
    deck: 'occupationE',
    number: 148,
    type: 'occupation',
    players: '1+',
    text: 'Place (up to) 1 stable each on "Grain Seeds", "Farmland", "Day Laborer", and "Farm Expansion". Build the stable at no cost when another player uses that action space.',
    onPlay(_game, _player) {
      this.stables = {
        'take-grain': true,
        'plow-field': true,
        'day-laborer': true,
        'build-rooms': true,
      }
    },
    onAnyAction(game, actingPlayer, actionId, cardOwner) {
      if (actingPlayer.name !== cardOwner.name && this.stables && this.stables[actionId]) {
        delete this.stables[actionId]
        game.actions.buildFreeStable(cardOwner, this)
      }
    },
  },
  {
    id: 'midnight-fencer-e149',
    name: 'Midnight Fencer',
    deck: 'occupationE',
    number: 149,
    type: 'occupation',
    players: '1+',
    text: "At the start of the last harvest, you can take up to 2 of each other player's unbuilt fences and build them on your farm at no cost. (Your farm can then have over 15 fences.)",
    onHarvestStart(game, player) {
      if (game.getHarvestNumber() === 6) {
        game.actions.offerMidnightFencerSteal(player, this)
      }
    },
  },
  {
    id: 'rock-beater-e150',
    name: 'Rock Beater',
    deck: 'occupationE',
    number: 150,
    type: 'occupation',
    players: '1+',
    text: 'You can use an action space providing both stone and a different building resource even if it is occupied by another player. Stone rooms cost you 2 stone less each.',
    allowsIgnoreOccupied(player, actionId, game) {
      return game.actionSpaceProvidesStoneAndOther(actionId)
    },
    modifyRoomCost(player, cost) {
      if (player.roomType === 'stone' && cost.stone && cost.stone > 0) {
        return { ...cost, stone: Math.max(0, cost.stone - 2) }
      }
      return cost
    },
  },
  {
    id: 'delivery-nurse-e151',
    name: 'Delivery Nurse',
    deck: 'occupationE',
    number: 151,
    type: 'occupation',
    players: '1+',
    text: 'Once this game, if you have all types of animals, use any "Family Growth" action space even without room.',
    onPlay(_game, _player) {
      this.used = false
    },
    allowsFamilyGrowthWithoutRoom(player) {
      return !this.used && player.hasAllAnimalTypes()
    },
    onFamilyGrowthWithoutRoom(_game, _player) {
      this.used = true
    },
  },
  {
    id: 'bargain-hunter-e152',
    name: 'Bargain Hunter',
    deck: 'occupationE',
    number: 152,
    type: 'occupation',
    players: '1+',
    text: 'At the start of each round, you can place 1 food from your supply on the "Traveling Players" accumulation space to play a minor improvement by paying its cost.',
    onRoundStart(game, player) {
      if (player.food >= 1) {
        game.actions.offerBargainHunterMinor(player, this)
      }
    },
  },
  {
    id: 'stone-sculptor-e153',
    name: 'Stone Sculptor',
    deck: 'occupationE',
    number: 153,
    type: 'occupation',
    players: '1+',
    text: 'Each harvest, you can use this card to exchange exactly 1 stone for 1 bonus point and 1 food.',
    onHarvest(game, player) {
      if (player.stone >= 1) {
        game.actions.offerStoneSculptorConversion(player, this)
      }
    },
  },
  {
    id: 'margrave-e154',
    name: 'Margrave',
    deck: 'occupationE',
    number: 154,
    type: 'occupation',
    players: '1+',
    text: 'Once you live in a stone house, you get 2 food each time any player renovates and, during scoring, 1 bonus point for each wood house and clay house.',
    onAnyRenovate(game, actingPlayer, cardOwner) {
      if (cardOwner.roomType === 'stone') {
        cardOwner.addResource('food', 2)
        game.log.add({
          template: '{player} gets 2 food from Margrave',
          args: { player: cardOwner },
        })
      }
    },
    getEndGamePoints(player, game) {
      if (player.roomType === 'stone') {
        return game.players.all().filter(p => p.roomType === 'wood' || p.roomType === 'clay').length
      }
      return 0
    },
  },
  {
    id: 'visionary-e155',
    name: 'Visionary',
    deck: 'occupationE',
    number: 155,
    type: 'occupation',
    players: '1+',
    text: 'If you play this card in round 4 or before, you get 1 stone, 1 vegetable, and 2 wild boar. You cannot grow your family until round 11, unless all other players already have.',
    onPlay(game, player) {
      if (game.state.round <= 4) {
        player.addResource('stone', 1)
        player.addResource('vegetables', 1)
        if (player.canPlaceAnimals('boar', 2)) {
          player.addAnimals('boar', 2)
        }
        player.cannotGrowFamilyUntilRound11 = true
        game.log.add({
          template: '{player} gets 1 stone, 1 vegetable, and 2 wild boar from Visionary',
          args: { player },
        })
      }
    },
    canGrowFamily(player, game) {
      if (player.cannotGrowFamilyUntilRound11) {
        if (game.state.round >= 11) {
          return true
        }
        return game.players.all().filter(p => p.name !== player.name).every(p => p.getFamilySize() > 2)
      }
      return true
    },
  },
  {
    id: 'claypit-owner-e156',
    name: 'Claypit Owner',
    deck: 'occupationE',
    number: 156,
    type: 'occupation',
    players: '1+',
    text: 'Each time another player plays or builds an improvement with a printed clay cost, you get 1 food and 1 clay.',
    onAnyPlayImprovement(game, actingPlayer, cardOwner, improvement) {
      if (actingPlayer.name !== cardOwner.name && improvement.cost && improvement.cost.clay) {
        cardOwner.addResource('food', 1)
        cardOwner.addResource('clay', 1)
        game.log.add({
          template: '{player} gets 1 food and 1 clay from Claypit Owner',
          args: { player: cardOwner },
        })
      }
    },
  },
  {
    id: 'usufructuary-e157',
    name: 'Usufructuary',
    deck: 'occupationE',
    number: 157,
    type: 'occupation',
    players: '1+',
    text: 'When you play this card as your first occupation, you immediately get 1 food for every other occupation in play (by any player), up to a maximum of 7 food.',
    onPlay(game, player) {
      if (player.getOccupationCount() === 1) {
        const otherOccupations = game.getTotalOccupationsInPlay() - 1
        const food = Math.min(7, otherOccupations)
        if (food > 0) {
          player.addResource('food', food)
          game.log.add({
            template: '{player} gets {amount} food from Usufructuary',
            args: { player, amount: food },
          })
        }
      }
    },
  },
  {
    id: 'stone-custodian-e158',
    name: 'Stone Custodian',
    deck: 'occupationE',
    number: 158,
    type: 'occupation',
    players: '1+',
    text: 'At the end of each work phase, you get 1 food for each stone accumulation space with stone on it.',
    onWorkPhaseEnd(game, player) {
      const stoneSpacesWithStone = game.getStoneAccumulationSpacesWithStone()
      if (stoneSpacesWithStone > 0) {
        player.addResource('food', stoneSpacesWithStone)
        game.log.add({
          template: '{player} gets {amount} food from Stone Custodian',
          args: { player, amount: stoneSpacesWithStone },
        })
      }
    },
  },
  {
    id: 'old-miser-e159',
    name: 'Old Miser',
    deck: 'occupationE',
    number: 159,
    type: 'occupation',
    players: '1+',
    text: 'In the feeding phase of each harvest, each of your people requires 1 less food. During scoring, your people are worth 2 points each instead of 3.',
    modifyFeedingRequirement(player, requirement) {
      return Math.max(0, requirement - player.getFamilySize())
    },
    modifyPersonPoints() {
      return 2
    },
  },
  {
    id: 'kelp-gatherer-e160',
    name: 'Kelp Gatherer',
    deck: 'occupationE',
    number: 160,
    type: 'occupation',
    players: '1+',
    text: 'Each time another player uses the "Fishing" accumulation space, they get 1 additional food and you get 1 vegetable.',
    onAnyAction(game, actingPlayer, actionId, cardOwner) {
      if (actionId === 'fishing' && actingPlayer.name !== cardOwner.name) {
        actingPlayer.addResource('food', 1)
        cardOwner.addResource('vegetables', 1)
        game.log.add({
          template: '{player} gets 1 vegetable from Kelp Gatherer, {other} gets 1 extra food',
          args: { player: cardOwner, other: actingPlayer },
        })
      }
    },
  },
  {
    id: 'elder-baker-e161',
    name: 'Elder Baker',
    deck: 'occupationE',
    number: 161,
    type: 'occupation',
    players: '1+',
    text: 'This card is an action space for you only. When you use it, you get 3 grain. You can build the "Stone Oven" major improvement even when taking a "Minor Improvement" action.',
    isActionSpace: true,
    actionSpaceForOwnerOnly: true,
    actionSpaceEffect(game, player) {
      player.addResource('grain', 3)
      game.log.add({
        template: '{player} gets 3 grain from Elder Baker',
        args: { player },
      })
    },
    allowsMajorOnMinorAction: true,
    allowedMajors: ['stone-oven'],
  },
  {
    id: 'entrepreneur-e162',
    name: 'Entrepreneur',
    deck: 'occupationE',
    number: 162,
    type: 'occupation',
    players: '1+',
    text: 'At the start of each round, you can move 1 food to this card or discard 1 food from it. If you do either, you get 1 building resource of a type you currently do not have.',
    onPlay(_game, _player) {
      this.food = 0
    },
    onRoundStart(game, player) {
      game.actions.offerEntrepreneurChoice(player, this)
    },
  },
  {
    id: 'patroness-e163',
    name: 'Patroness',
    deck: 'occupationE',
    number: 163,
    type: 'occupation',
    players: '1+',
    text: 'Each time after you play an occupation after this one, you get 1 building resource of your choice.',
    onPlayOccupation(game, player) {
      game.actions.offerBuildingResourceChoice(player, this)
    },
  },
  {
    id: 'mountain-plowman-e164',
    name: 'Mountain Plowman',
    deck: 'occupationE',
    number: 164,
    type: 'occupation',
    players: '1+',
    text: 'Each time you plow at least 1 field tile, you get 1 sheep for each field tile that you just plowed.',
    onPlow(game, player, fieldCount) {
      if (fieldCount >= 1 && player.canPlaceAnimals('sheep', fieldCount)) {
        player.addAnimals('sheep', fieldCount)
        game.log.add({
          template: '{player} gets {count} sheep from Mountain Plowman',
          args: { player, count: fieldCount },
        })
      }
    },
  },
  {
    id: 'master-huntsman-e165',
    name: 'Master Huntsman',
    deck: 'occupationE',
    number: 165,
    type: 'occupation',
    players: '1+',
    text: 'When you play this card and each time you build a major improvement, you get 1 wild boar.',
    onPlay(game, player) {
      if (player.canPlaceAnimals('boar', 1)) {
        player.addAnimals('boar', 1)
        game.log.add({
          template: '{player} gets 1 wild boar from Master Huntsman',
          args: { player },
        })
      }
    },
    onBuildMajor(game, player) {
      if (player.canPlaceAnimals('boar', 1)) {
        player.addAnimals('boar', 1)
        game.log.add({
          template: '{player} gets 1 wild boar from Master Huntsman',
          args: { player },
        })
      }
    },
  },
  {
    id: 'roastmaster-e166',
    name: 'Roastmaster',
    deck: 'occupationE',
    number: 166,
    type: 'occupation',
    players: '1+',
    text: 'Each time you use the "Traveling Players" or "Fishing" accumulation spaces, you can move exactly 1 food from that space to the other to get 1 cattle.',
    onAction(game, player, actionId) {
      if (actionId === 'traveling-players' || actionId === 'fishing') {
        const otherSpace = actionId === 'traveling-players' ? 'fishing' : 'traveling-players'
        if (game.canMoveFood(actionId, otherSpace) && player.canPlaceAnimals('cattle', 1)) {
          game.actions.offerRoastmasterMove(player, this, actionId, otherSpace)
        }
      }
    },
  },
  {
    id: 'dairy-crier-e167',
    name: 'Dairy Crier',
    deck: 'occupationE',
    number: 167,
    type: 'occupation',
    players: '1+',
    text: 'When you play this card, each player (including you) can choose to get 2 sheep or 2 food; you also get 1 cattle.',
    onPlay(game, player) {
      game.actions.offerDairyCrierChoice(game.players.all())
      if (player.canPlaceAnimals('cattle', 1)) {
        player.addAnimals('cattle', 1)
        game.log.add({
          template: '{player} gets 1 cattle from Dairy Crier',
          args: { player },
        })
      }
    },
  },
  {
    id: 'animal-tamers-apprentice-e168',
    name: "Animal Tamer's Apprentice",
    deck: 'occupationE',
    number: 168,
    type: 'occupation',
    players: '1+',
    text: 'At the start of each round, you get 1 sheep/wild boar/cattle for each unoccupied wood/clay/stone room in your house.',
    onRoundStart(game, player) {
      const woodRooms = player.getUnoccupiedRoomsByType('wood')
      const clayRooms = player.getUnoccupiedRoomsByType('clay')
      const stoneRooms = player.getUnoccupiedRoomsByType('stone')

      if (woodRooms > 0 && player.canPlaceAnimals('sheep', woodRooms)) {
        player.addAnimals('sheep', woodRooms)
        game.log.add({
          template: "{player} gets {count} sheep from Animal Tamer's Apprentice",
          args: { player, count: woodRooms },
        })
      }
      if (clayRooms > 0 && player.canPlaceAnimals('boar', clayRooms)) {
        player.addAnimals('boar', clayRooms)
        game.log.add({
          template: "{player} gets {count} wild boar from Animal Tamer's Apprentice",
          args: { player, count: clayRooms },
        })
      }
      if (stoneRooms > 0 && player.canPlaceAnimals('cattle', stoneRooms)) {
        player.addAnimals('cattle', stoneRooms)
        game.log.add({
          template: "{player} gets {count} cattle from Animal Tamer's Apprentice",
          args: { player, count: stoneRooms },
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
