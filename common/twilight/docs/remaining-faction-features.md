# Remaining Faction Features

271 remaining features across 25 factions. Organized by feature category, then faction.

## Status Legend

Each faction already has:
- Data tests (starting techs, commodities, faction tech definitions)
- Basic ability implementations (passive effects, simple combat modifiers)
- Most agents implemented
- Some commanders implemented

What remains: heroes, mech DEPLOY, promissory notes, faction technologies, and complex commanders.

---

## Heroes (25 remaining)

Heroes are ACTION-timing component actions that purge after use. Need `player.isHeroUnlocked() && !player.isHeroPurged()` gating.

| Faction | Hero | Effect |
|---------|------|--------|
| Arborec | Letani Miasmiala | ULTRASONIC EMITTER: produce any number of units in systems with ground forces, then purge |
| Argent Flight | Mirik Aun Sissiri | Helix Protocol: move any number of ships to systems with own command tokens and no enemy ships, then purge |
| Barony of Letnev | Darktalon Treilla | DARK MATTER AFFINITY: no fleet limit during this game round; purge at end of round |
| Clan of Saar | Gurno Aggero | ARMAGEDDON RELAY: choose adjacent system to space dock, destroy all other players' infantry and fighters, then purge |
| Council Keleres (Argent) | Kuuasi Aun Jalatai | Overwing Zeta: at start of space combat round, place flagship and up to 2 cruisers/destroyers from reinforcements, then purge |
| Council Keleres (Xxcha) | Odlynn Myrr | Operation Archon: after agenda revealed, cast up to 6 extra votes, predict outcome, gain TG and command tokens for wrong voters, then purge |
| Council Keleres (Mentak) | Harka Leeds | Erwan's Covenant: reveal action cards until finding 3 with component actions, draw those, shuffle rest back, then purge |
| Embers of Muaat | Adjudicator Ba'al | NOVA SEED: destroy all other units in system and replace tile with Muaat supernova; purge |
| Emirates of Hacan | Harrugh Gefhara | Galactic Securities Net: reduce production cost to 0, then purge |
| Empyrean | Conservator Procyon | Multiverse Shift: place 1 frontier token in each empty system without one, explore each in system with your ships, then purge |
| Federation of Sol | Jace X. 4th Air Legion | Helio Command Array: remove all command tokens from board and purge |
| Ghosts of Creuss | Riftwalker Meian | SINGULARITY REACTOR: swap positions of any 2 systems that contain wormholes or your units, then purge |
| L1Z1X Mindnet | The Helmsman | DARK SPACE NAVIGATION: place flagship and up to 2 dreadnoughts in empty system and purge |
| Mahact Gene-Sorcerers | Airo Shir Aur | Benediction: move all units in space area to adjacent system with different player ships, resolve combat with no retreats, then purge |
| Mentak Coalition | Ipswitch, Loose Cannon | SLEEPER CELL: at start of space combat, purge to place copies of destroyed enemy ships |
| Naalu Collective | The Oracle | C-RADIUM GEOMETRY: at end of status phase, force each other player to give 1 promissory note, then purge |
| Naaz-Rokha Alliance | Hesh and Prit | Perfect Synthesis: gain 1 relic and perform secondary of up to 2 readied strategy cards (spend from reinforcements instead of strategy pool), then purge |
| Nekro Virus | UNIT.DSGN.FLAYESH | POLYMORPHIC ALGORITHM: choose planet with tech specialty, destroy other units, gain trade goods and matching tech, then purge |
| Nomad | Ahk-Syl Siven | Probability Matrix: flagship and transported units can move out of systems with own command tokens until end of round, then purge |
| Sardakk N'orr | Sh'val, Harbinger | Tekklar Conditioning: skip to commit ground forces, then purge hero and return ships |
| Titans of Ul | Ul The Progenitor | GEOFORM: ready Elysium and attach card (+3 resource/influence), Elysium gains SPACE CANNON 5 (x3) |
| Universities of Jol-Nar | Rin, The Master's Legacy | Genetic Memory: for each non-unit upgrade tech owned, may replace with any tech of same color from deck, then purge |
| Vuil'raith Cabal | It Feeds on Carrion | Dimensional Anchor: each other player rolls for non-fighter ships in or adjacent to dimensional tears, capture on 1-3, then purge |
| Winnu | Mathis Mathinus, Kingmaker | ACTION: score 1 public objective you meet requirements for, then purge |
| Xxcha Kingdom | Xxekir Grom | PLANETARY DEFENSE NEXUS: place up to 4 PDS or mechs on controlled planets, ready those planets, then purge |
| Yin Brotherhood | Dannel of the Tenth | Quantum Dissemination: commit up to 3 infantry to non-home planets, resolve ground combats without space cannon, then purge |
| Yssaril Tribes | Kyver, Blade and Key | Guild of Spies: see and take/discard opponent action cards, then purge |

**Infrastructure needed:** Hero component action framework is partially built (Sol's Helio Command Array exists). Need to generalize: `isHeroUnlocked() && !isHeroPurged()` gating, `purgeHero()` call after execution.

---

## Mech DEPLOY (22 remaining)

Mech DEPLOY triggers place a mech under specific conditions, usually replacing another unit or as a reaction.

| Faction | Trigger | Effect |
|---------|---------|--------|
| Arborec | During Mitosis | May replace infantry with mech instead of placing infantry |
| Argent Flight | — | Does not count against capacity when transported or in space area with own ships |
| Barony of Letnev | Start of ground combat | Spend 2 resources to replace infantry with mech |
| Clan of Saar | Gaining planet control | Spend 1 TG to place 1 mech on that planet |
| Council Keleres | — | Other players must spend 1 influence to commit ground forces to planet with this mech |
| Embers of Muaat | Star Forge used | Place 1 infantry with mech in this or adjacent system |
| Emirates of Hacan | — | Planet card can be traded in transaction (mech stat) |
| Empyrean | — | May remove from system to cancel another player's action card |
| Federation of Sol | After Orbital Drop | Spend 3 resources to place mech (partially implemented) |
| Ghosts of Creuss | System activation | Remove mech to place/move Creuss wormhole token |
| L1Z1X Mindnet | — | Mech has bombardment ability usable while not in ground combat |
| Mahact Gene-Sorcerers | Opponent token in fleet pool | Spend captured token to end opponent's turn |
| Mentak Coalition | — | Opponent ground forces cannot use Sustain Damage |
| Naalu Collective | Another player gains relic | Place 1 mech on any controlled planet |
| Naaz-Rokha Alliance | Start of space combat | Flips to Z-Grav Eidolon (counts as ship), flips back after combat |
| Nekro Virus | — | +2 combat against opponents with Valefar tokens on their techs |
| Nomad | Space combat | May use sustain damage to cancel a hit against ships |
| Titans of Ul | Placing a PDS | May place 1 mech and 1 infantry instead |
| Vuil'raith Cabal | Infantry destroyed | Place destroyed infantry on faction sheet as captured |
| Winnu | Opponent gains your planet | Place mech on that planet |
| Xxcha Kingdom | Elected or gaining TG during agenda | Place mech; immune to bombardment and space cannon damage |
| Yin Brotherhood | Using Indoctrination | Spend 1 extra influence to place mech instead of infantry |
| Yssaril Tribes | After Stall Tactics | Place 1 mech on controlled planet |

**Infrastructure needed:** Per-faction DEPLOY trigger system. Each mech has unique triggers — no single hook covers all cases.

---

## Promissory Notes (25 remaining)

Each faction has a unique promissory note that can be traded and used by the holder.

| Faction | Note | Effect |
|---------|------|--------|
| Arborec | Stymie | After another player moves ships into system with your units, place command token from their reinforcements; returns to Arborec |
| Argent Flight | Strike Wing Ambuscade | When units roll for a unit ability, one unit rolls 1 additional die; returns to Argent |
| Barony of Letnev | War Funding | Letnev loses 2 TG and holder rerolls dice during space combat round; returns to Letnev |
| Clan of Saar | Ragh's Call | After committing units to land, remove all Saar ground forces and place on Saar-controlled planet; returns to Saar |
| Council Keleres | Keleres Rider | After agenda revealed, cannot vote, predict outcome; if correct draw 1 action card and gain 2 TG; return card |
| Embers of Muaat | Fires of the Gashlai | Remove 1 Muaat fleet token to gain war sun unit upgrade technology; returns to Muaat |
| Emirates of Hacan | Trade Convoys | Holder can trade with non-neighbors |
| Empyrean (Dark Pact) | Dark Pact | When holder gives commodities equal to max to Empyrean, both gain 1 TG; returns on activation |
| Empyrean (Blood Pact) | Blood Pact | When holder and Empyrean vote same outcome, cast 4 additional votes; returns on activation |
| Federation of Sol | Military Support | At start of Sol turn, remove 1 Sol strategy token and holder places 2 infantry |
| Ghosts of Creuss | Creuss IFF | At start of holder turn, place/move Creuss wormhole token; returns to Creuss |
| L1Z1X Mindnet | Cybernetic Enhancements | At start of holder turn, remove 1 L1Z1X strategy token and holder gains 1 strategy token; returns to L1Z1X |
| Mahact Gene-Sorcerers | Scepter of Dominion | At start of strategy phase, each other player with token on Mahact sheet places token in chosen system; returns to Mahact |
| Mentak Coalition | Promise of Protection | Holder is immune to Pillage ability; returns when holder activates system with Mentak units |
| Naalu Collective | Gift of Prescience | Holder places Naalu "0" token on strategy card to go first; Naalu cannot use Telepathic; returns at end of status phase |
| Naaz-Rokha Alliance | Black Market Forgery | Holder can purge 2 relic fragments of same type to gain 1 relic; returns to Naaz-Rokha |
| Nekro Virus | Antivirus | At start of combat, play face-up to prevent Technological Singularity; returns when holder activates Nekro system |
| Nomad | The Cavalry | At start of space combat, treat 1 non-fighter ship as having flagship stats; returns at end of combat |
| Sardakk N'orr | Tekklar Legion | Holder gets +1 combat during invasion; if opponent is Sardakk, they get -1; returns to Sardakk |
| Titans of Ul | Terraform | Attach to non-home planet to increase resource and influence by 1 and treat as having all 3 traits |
| Universities of Jol-Nar | Research Agreement | After Jol-Nar researches non-faction tech, holder gains that tech; return card |
| Vuil'raith Cabal | Crucible | Exhaust to capture a unit type from adjacent player's reinforcements; returns to Vuil'raith |
| Winnu | Acquiescence | At start of your turn, choose to return planets or gain Alliance |
| Xxcha Kingdom | Political Favor | When agenda revealed, remove 1 rider or cancel 1 speaker action; returns to Xxcha |
| Yin Brotherhood | Greyfire Mutagen | At start of ground combat against 2+ ground forces, replace 1 opponent infantry with own; returns to Yin |
| Yssaril Tribes | Spy Net | At start of turn, look at Yssaril hand and take 1 card |

**Infrastructure needed:** Promissory note trade system (give/receive between players), holder tracking, timing triggers (start of turn, start of combat, agenda revealed), auto-return mechanics.

---

## Commanders (15 remaining)

These commanders were skipped in the first pass due to complexity.

| Faction | Commander | Effect | Complexity |
|---------|-----------|--------|------------|
| Arborec | Dirzuga Rophal | After producing, place 1 infantry on planet with space dock | Medium — needs production hook with planet context |
| Argent Flight | Trrakan Aun Zulok | When rolling unit abilities, 1 unit rolls 1 extra die | Medium — modify ability dice rolls |
| Clan of Saar | Rowl Sarrig | When producing, may place each fighter/infantry at any non-blockaded space dock | Medium — split production placement |
| Council Keleres | Suffi An | After component action, may perform additional action | Medium — action phase flow change |
| Ghosts of Creuss | Sai Seravus | After ships move through wormholes, place 1 fighter with each capacity ship | Medium — wormhole traversal tracking |
| Mahact Gene-Sorcerers | Il Na Viroset | Can reactivate systems; return both tokens and end turn | High — fundamental action phase change |
| Mentak Coalition | S'Ula Mentarion | After winning space combat, force opponent to give 1 promissory note | Medium — needs promissory note system |
| Naalu Collective | M'aban | May look at neighbors' promissory notes and top/bottom agenda card | Medium — information reveal system |
| Nomad | Navarch Feng | Can produce flagship without spending resources | Low — production cost override |
| Universities of Jol-Nar | Ta Zern | When rolling unit abilities, may reroll any dice | Medium — modify ability dice rolls |
| Vuil'raith Cabal | That Which Molds Flesh | When producing, up to 2 fighters/infantry don't count against PRODUCTION | Low — production limit override |
| Winnu | Berekar Berekon | When controlling Mecatol, +1 combat and +1 command token in status | Medium — conditional combat modifier with system check |
| Xxcha Kingdom | Elder Qanoj | +1 vote per readied planet; game effects cannot prevent voting | Medium — modify agenda voting |
| Yin Brotherhood | Brother Omar | Satisfies green prerequisite; return infantry to ignore all prerequisites | Medium — modify tech research |
| Yssaril Tribes | So Ata | Look at opponent action cards/notes/secrets when they activate system with your units | Medium — information reveal on activation |

---

## Faction Technologies (68 remaining)

### Unit Upgrade Technologies (13)

These modify unit stats. Many may already work through the unit upgrade system.

| Faction | Tech | Unit | Key Changes |
|---------|------|------|-------------|
| Argent Flight | Strike Wing Alpha II | Destroyer | AFB 6x3; hits of 9-10 also destroy infantry |
| Clan of Saar | Floating Factory II | Space Dock | Move 2, capacity 5, production 7 |
| Embers of Muaat | Prototype War Sun II | War Sun | Move 3, cost 10 |
| Federation of Sol | Spec Ops II | Infantry | Revive on roll of 5+ |
| Federation of Sol | Advanced Carrier II | Carrier | Sustain damage, move 2 |
| L1Z1X Mindnet | Super Dreadnought II | Dreadnought | Cannot be destroyed by Direct Hit |
| Mahact Gene-Sorcerers | Crimson Legionnaire II | Infantry | Combat 7; after destroyed, gain 1 commodity or convert commodity to TG; destroyed units return next turn |
| Naalu Collective | Hybrid Crystal Fighter II | Fighter | Movement ability, fleet pool exemption |
| Titans of Ul | Saturn Engine II | Cruiser | Move 3, capacity 2, sustain damage |
| Titans of Ul | Hel-Titan II | PDS | Combat 6, space cannon 5, can fire into adjacent systems |
| Vuil'raith Cabal | Dimensional Tear II | Space Dock | Production 7, up to 12 fighters exempt from capacity |
| Yin Brotherhood | Yin Spinner | — | After producing units, place up to 2 infantry |

### Non-Upgrade Faction Technologies (55)

| Faction | Tech | Effect |
|---------|------|--------|
| Arborec | Bioplasmosis | End of status phase: move infantry between controlled planets in same/adjacent systems |
| Arborec | Psychospore | ACTION: exhaust to remove command token from system with infantry, place 1 infantry |
| Argent Flight | Aerie Hololattice | Other players cannot move ships through systems with Argent structures; structures gain Production 1 |
| Argent Flight | Wing Transfer | When activating system with only own units, place tokens in adjacent systems; at end of action move ships among those systems |
| Barony of Letnev | L4 Disruptors | Opponent units cannot use space cannon during your invasion |
| Barony of Letnev | Non-Euclidean Shielding | Sustain damage cancels 2 hits instead of 1 |
| Barony of Letnev | Gravleash Maneuvers | +X to combat roll based on ship type diversity |
| Clan of Saar | Chaos Mapping | Other players cannot activate asteroid fields with Saar ships; may produce 1 unit there |
| Clan of Saar | Deorbit Barrage | ACTION: bombard ground forces on planet up to 2 systems from asteroid field with ships |
| Council Keleres | Executive Order | Exhaust to draw top/bottom agenda; spend TG/resources as votes |
| Council Keleres | Agency Supply Network | Once per action, resolve another PRODUCTION in any system |
| Council Keleres | I.I.H.Q. Modernization | On gain, receive Custodia Vigilia planet; become neighbors with all near Mecatol |
| Embers of Muaat | Magmus Reactor | Ships can move into supernovas; gain 1 TG on production near war sun/supernova |
| Embers of Muaat | Stellar Genesis | Place Avernus token, moves with war suns |
| Emirates of Hacan | Production Biomes | Exhaust and spend strategy token for 4 TG |
| Emirates of Hacan | Quantum Datahub Node | Swap strategy cards |
| Emirates of Hacan | Auto-Factories | Gain fleet token when producing 3+ non-fighter ships |
| Empyrean | Aetherstream | After you/neighbor activates system adjacent to anomaly, +1 move for that player's ships |
| Empyrean | Voidwatch | After player moves ships into system with your units, they must give you 1 promissory note |
| Empyrean | Void Tether | When activating, may place/move void tether token; other players don't treat those systems as adjacent |
| Federation of Sol | Bellum Gloriosum | Free ground forces/fighters when producing capacity ships |
| Ghosts of Creuss | Wormhole Generator | ACTION: place/move Creuss wormhole token |
| Ghosts of Creuss | Particle Synthesis | Wormholes in systems with your ships gain PRODUCTION 1; reduce cost per wormhole in system |
| L1Z1X Mindnet | Inheritance Systems | Exhaust to gain a tech with same or fewer prerequisites |
| L1Z1X Mindnet | Fealty Uplink | Gain 1 command token when scoring public objective with most tokens on board |
| Mahact Gene-Sorcerers | Genetic Recombination | Exhaust before player casts votes to force outcome choice or fleet pool token removal |
| Mahact Gene-Sorcerers | Vaults of the Heir | ACTION: exhaust and purge 1 tech to gain 1 relic |
| Mentak Coalition | Salvage Operations | Gain 1 TG after winning/losing space combat; produce 1 ship of destroyed type after winning |
| Mentak Coalition | Mirror Computing | Trade goods worth 2 resources or influence when spent |
| Mentak Coalition | The Table's Grace | Corsair movement through enemy systems with Cruiser II |
| Naalu Collective | Neuroglaive | After another player activates system with your ships, they remove 1 fleet pool token |
| Naalu Collective | Mindsieve | Give a promissory note to resolve secondary without spending command token |
| Naaz-Rokha Alliance | Supercharge | Exhaust at start of combat round to apply +1 to all combat rolls |
| Naaz-Rokha Alliance | Pre-Fab Arcologies | After exploring a planet, ready that planet |
| Naaz-Rokha Alliance | Absolute Synergy | When 4 mechs in same system, may return 3 to flip card onto mech card |
| Nekro Virus | Valefar Assimilator X | Place token on opponent faction tech instead of gaining it; card gains that tech's text |
| Nekro Virus | Valefar Assimilator Y | Place token on opponent faction tech instead of gaining it; card gains that tech's text |
| Nekro Virus | Valefar Assimilator Z | Place token on opponent faction sheet; flagship gains that faction's flagship text |
| Nomad | Temporal Command Suite | After any agent exhausted, may exhaust to ready it; if readying another player's, may transact |
| Nomad | Thunder's Paradox | At start of any player turn, exhaust 1 agent to ready any other agent |
| Sardakk N'orr | Valkyrie Particle Weave | After ground combat rolls, if opponent produced hits, produce 1 additional hit |
| Titans of Ul | Slumberstate Computing | COALESCENCE coexist option; draw 1 extra action card per coexisting player; allow sleeper placement on other planets |
| Universities of Jol-Nar | E-Res Siphons | After activating system with own units, gain 4 TG |
| Universities of Jol-Nar | Spatial Conduit Cylinder | System with own units is adjacent to all other systems with own units during activation |
| Universities of Jol-Nar | Specialized Compounds | When researching via Technology card, may exhaust tech specialty planet (must match color) |
| Vuil'raith Cabal | Vortex | After another player replenishes commodities, convert to TG and capture 1 unit |
| Vuil'raith Cabal | Al'Raith Ix Ianovar | The Fracture enters play; ships don't roll for gravity rifts, +1 move through them |
| Winnu | Hegemonic Trade Policy | Exhaust to swap resource and influence values during production |
| Winnu | Lazax Gate Folding | Mecatol system has wormholes; ACTION to place infantry on Mecatol |
| Winnu | Imperator | +1 combat per Support for the Throne; +1 move when activating legendary planet system |
| Xxcha Kingdom | Instinct Training | Exhaust and spend strategy token to cancel another player's action card |
| Xxcha Kingdom | Nullification Field | Exhaust and spend strategy token when player activates system with your ships to end their turn |
| Xxcha Kingdom | Archon's Gift | Spend influence as resources and resources as influence |
| Yin Brotherhood | Impulse Core | At start of space combat, destroy own cruiser/destroyer to produce 1 hit against non-fighter ship |
| Yin Brotherhood | Yin Ascendant | When gained or scoring public objective, gain alliance ability of random unused faction |

---

## Misc Faction Abilities (8 remaining)

| Faction | Ability | Effect |
|---------|---------|--------|
| Clan of Saar | Nomadic | Can score objectives without controlling home system planets |
| Clan of Saar | Floating Factory I | Space dock placed in space, moves as ship, destroyed if blockaded |
| Clan of Saar | Son of Ragh (Flagship) | Anti-fighter barrage 6x4, capacity 3 |
| Mahact | Hubris | Can activate systems with own command tokens; return both and end turn |
| Titans of Ul | Ouranos (Flagship) | DEPLOY: after activating system with PDS, may replace 1 PDS with flagship |

---

## Implementation Priority

### Quick wins (can implement now with existing hooks)
1. Unit upgrade tech stat applications (may already work via unit system)
2. Simple combat-timing faction techs (Impulse Core, Valkyrie Particle Weave)
3. Simple production-timing faction techs (Yin Spinner, Bellum Gloriosum)
4. Remaining low-complexity commanders (Nomad, Vuil'raith)

### Medium effort (need minor hook additions)
1. Heroes as component actions (framework exists, need per-faction logic)
2. Production-modifying faction techs (Magmus Reactor, Salvage Operations)
3. Activation-triggered faction techs (E-Res Siphons, Neuroglaive)

### High effort (need new infrastructure)
1. Promissory note trade/use system
2. Mech DEPLOY trigger system (25 unique triggers)
3. Agenda phase modifications (Xxcha, Empyrean, Keleres)
4. Complex state tracking (Creuss wormhole tokens, Vuil'raith captures, Mahact command tokens)
