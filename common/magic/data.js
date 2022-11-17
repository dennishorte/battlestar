const setCodesToNames = {
  "10e": "Tenth Edition",
  "2ed": "Unlimited Edition",
  "2x2": "Double Masters 2022",
  "2xm": "Double Masters",
  "30a": "30th Anniversary Edition",
  "3ed": "Revised Edition",
  "40k": "Warhammer 40,000 Commander",
  "4bb": "Fourth Edition Foreign Black Border",
  "4ed": "Fourth Edition",
  "5dn": "Fifth Dawn",
  "5ed": "Fifth Edition",
  "6ed": "Classic Sixth Edition",
  "7ed": "Seventh Edition",
  "8ed": "Eighth Edition",
  "9ed": "Ninth Edition",
  "a25": "Masters 25",
  "aafr": "Adventures in the Forgotten Realms Art Series",
  "abro": "The Brothers' War Art Series",
  "aclb": "Battle for Baldur's Gate Art Series",
  "admu": "Dominaria United Art Series",
  "aer": "Aether Revolt",
  "afc": "Forgotten Realms Commander",
  "afr": "Adventures in the Forgotten Realms",
  "ajmp": "Jumpstart Arena Exclusives",
  "akh": "Amonkhet",
  "akhm": "Kaldheim Art Series",
  "akr": "Amonkhet Remastered",
  "ala": "Shards of Alara",
  "all": "Alliances",
  "amh1": "Modern Horizons Art Series",
  "amh2": "Modern Horizons 2 Art Series",
  "amid": "Midnight Hunt Art Series",
  "ana": "Arena New Player Experience",
  "anb": "Arena Beginner Set",
  "aneo": "Neon Dynasty Art Series",
  "apc": "Apocalypse",
  "arb": "Alara Reborn",
  "arc": "Archenemy",
  "arn": "Arabian Nights",
  "asnc": "New Capenna Art Series",
  "astx": "Strixhaven Art Series",
  "ath": "Anthologies",
  "atq": "Antiquities",
  "avow": "Crimson Vow Art Series",
  "avr": "Avacyn Restored",
  "aznr": "Zendikar Rising Art Series",
  "bbd": "Battlebond",
  "bfz": "Battle for Zendikar",
  "bng": "Born of the Gods",
  "bok": "Betrayers of Kamigawa",
  "bot": "Transformers",
  "brb": "Battle Royale Box Set",
  "brc": "The Brothers' War Commander",
  "bro": "The Brothers' War",
  "brr": "The Brothers' War Retro Artifacts",
  "btd": "Beatdown Box Set",
  "c13": "Commander 2013",
  "c14": "Commander 2014",
  "c15": "Commander 2015",
  "c16": "Commander 2016",
  "c17": "Commander 2017",
  "c18": "Commander 2018",
  "c19": "Commander 2019",
  "c20": "Commander 2020",
  "c21": "Commander 2021",
  "cc1": "Commander Collection: Green",
  "cc2": "Commander Collection: Black",
  "ced": "Collectors’ Edition",
  "cei": "Intl. Collectors’ Edition",
  "chk": "Champions of Kamigawa",
  "chr": "Chronicles",
  "clb": "Commander Legends: Battle for Baldur's Gate",
  "cm1": "Commander's Arsenal",
  "cm2": "Commander Anthology Volume II",
  "cma": "Commander Anthology",
  "cmb1": "Mystery Booster Playtest Cards 2019",
  "cmb2": "Mystery Booster Playtest Cards 2021",
  "cmd": "Commander 2011",
  "cmr": "Commander Legends",
  "cn2": "Conspiracy: Take the Crown",
  "cns": "Conspiracy",
  "con": "Conflux",
  "cp1": "Magic 2015 Clash Pack",
  "cp2": "Fate Reforged Clash Pack",
  "cp3": "Magic Origins Clash Pack",
  "csp": "Coldsnap",
  "cst": "Coldsnap Theme Decks",
  "dbl": "Innistrad: Double Feature",
  "dd1": "Duel Decks: Elves vs. Goblins",
  "dd2": "Duel Decks: Jace vs. Chandra",
  "ddc": "Duel Decks: Divine vs. Demonic",
  "ddd": "Duel Decks: Garruk vs. Liliana",
  "dde": "Duel Decks: Phyrexia vs. the Coalition",
  "ddf": "Duel Decks: Elspeth vs. Tezzeret",
  "ddg": "Duel Decks: Knights vs. Dragons",
  "ddh": "Duel Decks: Ajani vs. Nicol Bolas",
  "ddi": "Duel Decks: Venser vs. Koth",
  "ddj": "Duel Decks: Izzet vs. Golgari",
  "ddk": "Duel Decks: Sorin vs. Tibalt",
  "ddl": "Duel Decks: Heroes vs. Monsters",
  "ddm": "Duel Decks: Jace vs. Vraska",
  "ddn": "Duel Decks: Speed vs. Cunning",
  "ddo": "Duel Decks: Elspeth vs. Kiora",
  "ddp": "Duel Decks: Zendikar vs. Eldrazi",
  "ddq": "Duel Decks: Blessed vs. Cursed",
  "ddr": "Duel Decks: Nissa vs. Ob Nixilis",
  "dds": "Duel Decks: Mind vs. Might",
  "ddt": "Duel Decks: Merfolk vs. Goblins",
  "ddu": "Duel Decks: Elves vs. Inventors",
  "dgm": "Dragon's Maze",
  "dis": "Dissension",
  "dka": "Dark Ascension",
  "dkm": "Deckmasters",
  "dmc": "Dominaria United Commander",
  "dmr": "Dominaria Remastered",
  "dmu": "Dominaria United",
  "dom": "Dominaria",
  "dpa": "Duels of the Planeswalkers",
  "drb": "From the Vault: Dragons",
  "drk": "The Dark",
  "dst": "Darksteel",
  "dtk": "Dragons of Tarkir",
  "dvd": "Duel Decks Anthology: Divine vs. Demonic",
  "e01": "Archenemy: Nicol Bolas",
  "e02": "Explorers of Ixalan",
  "ea1": "Explorer Anthology 1",
  "eld": "Throne of Eldraine",
  "ema": "Eternal Masters",
  "emn": "Eldritch Moon",
  "eve": "Eventide",
  "evg": "Duel Decks Anthology: Elves vs. Goblins",
  "exo": "Exodus",
  "exp": "Zendikar Expeditions",
  "f01": "Friday Night Magic 2001",
  "f02": "Friday Night Magic 2002",
  "f03": "Friday Night Magic 2003",
  "f04": "Friday Night Magic 2004",
  "f05": "Friday Night Magic 2005",
  "f06": "Friday Night Magic 2006",
  "f07": "Friday Night Magic 2007",
  "f08": "Friday Night Magic 2008",
  "f09": "Friday Night Magic 2009",
  "f10": "Friday Night Magic 2010",
  "f11": "Friday Night Magic 2011",
  "f12": "Friday Night Magic 2012",
  "f13": "Friday Night Magic 2013",
  "f14": "Friday Night Magic 2014",
  "f15": "Friday Night Magic 2015",
  "f16": "Friday Night Magic 2016",
  "f17": "Friday Night Magic 2017",
  "f18": "Friday Night Magic 2018",
  "fbb": "Foreign Black Border",
  "fem": "Fallen Empires",
  "fj22": "Jumpstart 2022 Front Cards",
  "fjmp": "Jumpstart Front Cards",
  "fmb1": "Mystery Booster Retail Edition Foils",
  "fnm": "Friday Night Magic 2000",
  "frf": "Fate Reforged",
  "fut": "Future Sight",
  "g00": "Judge Gift Cards 2000",
  "g01": "Judge Gift Cards 2001",
  "g02": "Judge Gift Cards 2002",
  "g03": "Judge Gift Cards 2003",
  "g04": "Judge Gift Cards 2004",
  "g05": "Judge Gift Cards 2005",
  "g06": "Judge Gift Cards 2006",
  "g07": "Judge Gift Cards 2007",
  "g08": "Judge Gift Cards 2008",
  "g09": "Judge Gift Cards 2009",
  "g10": "Judge Gift Cards 2010",
  "g11": "Judge Gift Cards 2011",
  "g17": "2017 Gift Pack",
  "g18": "M19 Gift Pack",
  "g99": "Judge Gift Cards 1999",
  "gdy": "Game Day Promos",
  "gk1": "GRN Guild Kit",
  "gk2": "RNA Guild Kit",
  "gn2": "Game Night 2019",
  "gn3": "Game Night: Free-for-All",
  "gnt": "Game Night",
  "gpt": "Guildpact",
  "grn": "Guilds of Ravnica",
  "gs1": "Global Series Jiang Yanggu & Mu Yanling",
  "gtc": "Gatecrash",
  "gvl": "Duel Decks Anthology: Garruk vs. Liliana",
  "h09": "Premium Deck Series: Slivers",
  "h17": "HasCon 2017",
  "h1r": "Modern Horizons 1 Timeshifts",
  "ha1": "Historic Anthology 1",
  "ha2": "Historic Anthology 2",
  "ha3": "Historic Anthology 3",
  "ha4": "Historic Anthology 4",
  "ha5": "Historic Anthology 5",
  "ha6": "Historic Anthology 6",
  "hbg": "Alchemy Horizons: Baldur's Gate",
  "hho": "Happy Holidays",
  "hml": "Homelands",
  "hop": "Planechase",
  "hou": "Hour of Devastation",
  "htr16": "2016 Heroes of the Realm",
  "htr17": "2017 Heroes of the Realm",
  "htr18": "2018 Heroes of the Realm",
  "htr19": "2019 Heroes of the Realm",
  "htr20": "2020 Heroes of the Realm",
  "ice": "Ice Age",
  "iko": "Ikoria: Lair of Behemoths",
  "ima": "Iconic Masters",
  "inv": "Invasion",
  "isd": "Innistrad",
  "itp": "Introductory Two-Player Set",
  "j12": "Judge Gift Cards 2012",
  "j13": "Judge Gift Cards 2013",
  "j14": "Judge Gift Cards 2014",
  "j15": "Judge Gift Cards 2015",
  "j16": "Judge Gift Cards 2016",
  "j17": "Judge Gift Cards 2017",
  "j18": "Judge Gift Cards 2018",
  "j19": "Judge Gift Cards 2019",
  "j20": "Judge Gift Cards 2020",
  "j21": "Jumpstart: Historic Horizons",
  "j22": "Jumpstart 2022",
  "jgp": "Judge Gift Cards 1998",
  "jmp": "Jumpstart",
  "jou": "Journey into Nyx",
  "jud": "Judgment",
  "jvc": "Duel Decks Anthology: Jace vs. Chandra",
  "khc": "Kaldheim Commander",
  "khm": "Kaldheim",
  "kld": "Kaladesh",
  "klr": "Kaladesh Remastered",
  "ktk": "Khans of Tarkir",
  "l12": "League Tokens 2012",
  "l13": "League Tokens 2013",
  "l14": "League Tokens 2014",
  "l15": "League Tokens 2015",
  "l16": "League Tokens 2016",
  "l17": "League Tokens 2017",
  "lea": "Limited Edition Alpha",
  "leb": "Limited Edition Beta",
  "leg": "Legends",
  "lgn": "Legions",
  "lrw": "Lorwyn",
  "m10": "Magic 2010",
  "m11": "Magic 2011",
  "m12": "Magic 2012",
  "m13": "Magic 2013",
  "m14": "Magic 2014",
  "m15": "Magic 2015",
  "m19": "Core Set 2019",
  "m20": "Core Set 2020",
  "m21": "Core Set 2021",
  "mafr": "Adventures in the Forgotten Realms Minigames",
  "mb1": "Mystery Booster",
  "mbs": "Mirrodin Besieged",
  "mclb": "Commander Legends: Battle for Baldur's Gate Minigames",
  "md1": "Modern Event Deck 2014",
  "me1": "Masters Edition",
  "me2": "Masters Edition II",
  "me3": "Masters Edition III",
  "me4": "Masters Edition IV",
  "med": "Mythic Edition",
  "mgb": "Multiverse Gift Box",
  "mh1": "Modern Horizons",
  "mh2": "Modern Horizons 2",
  "mic": "Midnight Hunt Commander",
  "mid": "Innistrad: Midnight Hunt",
  "mir": "Mirage",
  "mkhm": "Kaldheim Minigames",
  "mm2": "Modern Masters 2015",
  "mm3": "Modern Masters 2017",
  "mma": "Modern Masters",
  "mmh2": "Modern Horizons 2 Minigames",
  "mmq": "Mercadian Masques",
  "mneo": "Kamigawa: Neon Destiny Minigames",
  "mor": "Morningtide",
  "mp2": "Amonkhet Invocations",
  "mpr": "Magic Player Rewards 2001",
  "mps": "Kaladesh Inventions",
  "mrd": "Mirrodin",
  "msnc": "Streets of New Capenna Minigames",
  "mstx": "Strixhaven: School of Mages Minigames",
  "mvow": "Innistrad: Crimson Vow Minigames",
  "mznr": "Zendikar Rising Minigames",
  "ncc": "New Capenna Commander",
  "nec": "Neon Dynasty Commander",
  "nem": "Nemesis",
  "neo": "Kamigawa: Neon Dynasty",
  "nph": "New Phyrexia",
  "o90p": "Oversized 90's Promos",
  "oafc": "Forgotten Realms Commander Display Commanders",
  "oana": "Arena New Player Experience Cards",
  "oarc": "Archenemy Schemes",
  "oc13": "Commander 2013 Oversized",
  "oc14": "Commander 2014 Oversized",
  "oc15": "Commander 2015 Oversized",
  "oc16": "Commander 2016 Oversized",
  "oc17": "Commander 2017 Oversized",
  "oc18": "Commander 2018 Oversized",
  "oc19": "Commander 2019 Oversized",
  "oc20": "Commander 2020 Oversized",
  "oc21": "Commander 2021 Display Commanders",
  "ocm1": "Commander's Arsenal Oversized",
  "ocmd": "Commander 2011 Oversized",
  "ody": "Odyssey",
  "oe01": "Archenemy: Nicol Bolas Schemes",
  "ogw": "Oath of the Gatewatch",
  "ohop": "Planechase Planes",
  "olep": "Oversized League Prizes",
  "olgc": "Legacy Championship",
  "omic": "Midnight Hunt Commander Display Commanders",
  "ons": "Onslaught",
  "opc2": "Planechase 2012 Planes",
  "opca": "Planechase Anthology Planes",
  "ori": "Magic Origins",
  "ovnt": "Vintage Championship",
  "ovoc": "Crimson Vow Commander Display Commanders",
  "p02": "Portal Second Age",
  "p03": "Magic Player Rewards 2003",
  "p04": "Magic Player Rewards 2004",
  "p05": "Magic Player Rewards 2005",
  "p06": "Magic Player Rewards 2006",
  "p07": "Magic Player Rewards 2007",
  "p08": "Magic Player Rewards 2008",
  "p09": "Magic Player Rewards 2009",
  "p10": "Magic Player Rewards 2010",
  "p10e": "Tenth Edition Promos",
  "p11": "Magic Player Rewards 2011",
  "p15a": "15th Anniversary Cards",
  "p22": "Judge Gift Cards 2022",
  "p2hg": "Two-Headed Giant Tournament",
  "p30a": "30th Anniversary Play Promos",
  "p30h": "30th Anniversary History Promos",
  "p5dn": "Fifth Dawn Promos",
  "p8ed": "Eighth Edition Promos",
  "p9ed": "Ninth Edition Promos",
  "paer": "Aether Revolt Promos",
  "pafr": "Adventures in the Forgotten Realms Promos",
  "pakh": "Amonkhet Promos",
  "pal00": "Arena League 2000",
  "pal01": "Arena League 2001",
  "pal02": "Arena League 2002",
  "pal03": "Arena League 2003",
  "pal04": "Arena League 2004",
  "pal05": "Arena League 2005",
  "pal06": "Arena League 2006",
  "pal99": "Arena League 1999",
  "pala": "Shards of Alara Promos",
  "palp": "Asia Pacific Land Program",
  "pana": "MTG Arena Promos",
  "papc": "Apocalypse Promos",
  "parb": "Alara Reborn Promos",
  "parc": "Promotional Schemes",
  "parl": "Arena League 1996",
  "past": "Astral Cards",
  "pavr": "Avacyn Restored Promos",
  "pbbd": "Battlebond Promos",
  "pbfz": "Battle for Zendikar Promos",
  "pbng": "Born of the Gods Promos",
  "pbok": "Betrayers of Kamigawa Promos",
  "pbook": "Miscellaneous Book Promos",
  "pbro": "The Brothers' War Promos",
  "pc2": "Planechase 2012",
  "pca": "Planechase Anthology",
  "pcel": "Celebration Cards",
  "pchk": "Champions of Kamigawa Promos",
  "pclb": "Battle for Baldur's Gate Promos",
  "pcmd": "Commander 2011 Launch Party",
  "pcmp": "Champs and States",
  "pcns": "Conspiracy Promos",
  "pcon": "Conflux Promos",
  "pcsp": "Coldsnap Promos",
  "pcy": "Prophecy",
  "pd2": "Premium Deck Series: Fire and Lightning",
  "pd3": "Premium Deck Series: Graveborn",
  "pdgm": "Dragon's Maze Promos",
  "pdis": "Dissension Promos",
  "pdka": "Dark Ascension Promos",
  "pdmu": "Dominaria United Promos",
  "pdom": "Dominaria Promos",
  "pdp10": "Duels of the Planeswalkers 2010 Promos ",
  "pdp12": "Duels of the Planeswalkers 2012 Promos ",
  "pdp13": "Duels of the Planeswalkers 2013 Promos ",
  "pdp14": "Duels of the Planeswalkers 2014 Promos ",
  "pdp15": "Duels of the Planeswalkers 2015 Promos ",
  "pdrc": "Dragon Con",
  "pdst": "Darksteel Promos",
  "pdtk": "Dragons of Tarkir Promos",
  "pdtp": "Duels of the Planeswalkers 2009 Promos ",
  "pdwa": "Dominaria United Japanese Promo Tokens",
  "peld": "Throne of Eldraine Promos",
  "pelp": "European Land Program",
  "pemn": "Eldritch Moon Promos",
  "peve": "Eventide Promos",
  "pewk": "Eternal Weekend 2022",
  "pexo": "Exodus Promos",
  "pf19": "MagicFest 2019",
  "pf20": "MagicFest 2020",
  "pf21": "MagicFest 2021",
  "pfrf": "Fate Reforged Promos",
  "pfut": "Future Sight Promos",
  "pg07": "Gateway 2007",
  "pg08": "Gateway 2008",
  "pgpt": "Guildpact Promos",
  "pgpx": "Grand Prix Promos",
  "pgrn": "Guilds of Ravnica Promos",
  "pgru": "Guru",
  "pgtc": "Gatecrash Promos",
  "pgtw": "Gateway 2006",
  "phed": "Heads I Win, Tails You Lose",
  "phel": "Open the Helvault",
  "phj": "Hobby Japan Promos",
  "phop": "Promotional Planes",
  "phou": "Hour of Devastation Promos",
  "phpr": "HarperPrism Book Promos",
  "phuk": "Hachette UK",
  "pi13": "IDW Comics 2013",
  "pi14": "IDW Comics 2014",
  "pidw": "IDW Comics 2012",
  "piko": "Ikoria: Lair of Behemoths Promos",
  "pinv": "Invasion Promos",
  "pisd": "Innistrad Promos",
  "pj21": "Judge Gift Cards 2021",
  "pjas": "Junior APAC Series",
  "pjjt": "Japan Junior Tournament",
  "pjou": "Journey into Nyx Promos",
  "pjse": "Junior Series Europe",
  "pjud": "Judgment Promos",
  "pkhm": "Kaldheim Promos",
  "pkld": "Kaladesh Promos",
  "pktk": "Khans of Tarkir Promos",
  "pl21": "Year of the Ox 2021",
  "pl22": "Year of the Tiger 2022",
  "plc": "Planar Chaos",
  "plg20": "Love Your LGS 2020",
  "plg21": "Love Your LGS 2021",
  "plg22": "Love Your LGS 2022",
  "plgm": "DCI Legend Membership",
  "plgn": "Legions Promos",
  "plist": "The List",
  "plny": "Lunar New Year 2018 ",
  "plrw": "Lorwyn Promos",
  "pls": "Planeshift",
  "pm10": "Magic 2010 Promos",
  "pm11": "Magic 2011 Promos",
  "pm12": "Magic 2012 Promos",
  "pm13": "Magic 2013 Promos",
  "pm14": "Magic 2014 Promos",
  "pm15": "Magic 2015 Promos",
  "pm19": "Core Set 2019 Promos",
  "pm20": "Core Set 2020 Promos",
  "pm21": "Core Set 2021 Promos",
  "pmbs": "Mirrodin Besieged Promos",
  "pmei": "Media Inserts",
  "pmh1": "Modern Horizons Promos",
  "pmh2": "Modern Horizons 2 Promos",
  "pmic": "MicroProse Promos",
  "pmid": "Innistrad: Midnight Hunt Promos",
  "pmmq": "Mercadian Masques Promos",
  "pmoa": "Magic Online Avatars",
  "pmor": "Morningtide Promos",
  "pmps": "Magic Premiere Shop 2005",
  "pmps06": "Magic Premiere Shop 2006",
  "pmps07": "Magic Premiere Shop 2007",
  "pmps08": "Magic Premiere Shop 2008",
  "pmps09": "Magic Premiere Shop 2009",
  "pmps10": "Magic Premiere Shop 2010",
  "pmps11": "Magic Premiere Shop 2011",
  "pmrd": "Mirrodin Promos",
  "pnat": "Nationals Promos",
  "pncc": "New Capenna Commander Promos",
  "pnem": "Nemesis Promos",
  "pneo": "Kamigawa: Neon Dynasty Promos",
  "pnph": "New Phyrexia Promos",
  "pody": "Odyssey Promos",
  "pogw": "Oath of the Gatewatch Promos",
  "pons": "Onslaught Promos",
  "por": "Portal",
  "pori": "Magic Origins Promos",
  "ppc1": "M15 Prerelease Challenge",
  "ppcy": "Prophecy Promos",
  "pplc": "Planar Chaos Promos",
  "ppls": "Planeshift Promos",
  "ppp1": "M20 Promo Packs",
  "ppro": "Pro Tour Promos",
  "pptk": "Portal: Three Kingdoms Promos",
  "pr2": "Magic Player Rewards 2002",
  "pr23": "Regional Championship Qualifiers 2023",
  "prav": "Ravnica: City of Guilds Promos",
  "prcq": "Regional Championship Qualifiers 2022",
  "pred": "Redemption Program",
  "pres": "Resale Promos",
  "prix": "Rivals of Ixalan Promos",
  "prm": "Magic Online Promos",
  "prna": "Ravnica Allegiance Promos",
  "proe": "Rise of the Eldrazi Promos",
  "prtr": "Return to Ravnica Promos",
  "prw2": "RNA Ravnica Weekend",
  "prwk": "GRN Ravnica Weekend",
  "ps11": "Salvat 2011",
  "ps14": "San Diego Comic-Con 2014",
  "ps15": "San Diego Comic-Con 2015",
  "ps16": "San Diego Comic-Con 2016",
  "ps17": "San Diego Comic-Con 2017",
  "ps18": "San Diego Comic-Con 2018",
  "ps19": "San Diego Comic-Con 2019",
  "psal": "Salvat 2005",
  "pscg": "Scourge Promos",
  "psdc": "San Diego Comic-Con 2013",
  "psdg": "Sega Dreamcast Cards",
  "pshm": "Shadowmoor Promos",
  "psnc": "Streets of New Capenna Promos",
  "psoi": "Shadows over Innistrad Promos",
  "psok": "Saviors of Kamigawa Promos",
  "psom": "Scars of Mirrodin Promos",
  "pss1": "BFZ Standard Series",
  "pss2": "XLN Standard Showdown",
  "pss3": "M19 Standard Showdown",
  "psth": "Stronghold Promos",
  "pstx": "Strixhaven: School of Mages Promos",
  "psum": "Summer of Magic",
  "psus": "Junior Super Series",
  "psvc": "Summer Vacation Promos 2022",
  "ptc": "Pro Tour Collector Set",
  "ptg": "Ponies: The Galloping",
  "pthb": "Theros Beyond Death Promos",
  "pths": "Theros Promos",
  "ptk": "Portal Three Kingdoms",
  "ptkdf": "Tarkir Dragonfury",
  "ptmp": "Tempest Promos",
  "ptor": "Torment Promos",
  "ptsnc": "Streets of New Capenna Southeast Asia Tokens",
  "ptsp": "Time Spiral Promos",
  "puds": "Urza's Destiny Promos",
  "pulg": "Urza's Legacy Promos",
  "puma": "Ultimate Box Topper",
  "punh": "Unhinged Promos",
  "purl": "URL/Convention Promos",
  "pusg": "Urza's Saga Promos",
  "pust": "Unstable Promos",
  "pvan": "Vanguard Series",
  "pvow": "Innistrad: Crimson Vow Promos",
  "pw09": "Wizards Play Network 2009",
  "pw10": "Wizards Play Network 2010",
  "pw11": "Wizards Play Network 2011",
  "pw12": "Wizards Play Network 2012",
  "pw21": "Wizards Play Network 2021",
  "pw22": "Wizards Play Network 2022",
  "pwar": "War of the Spark Promos",
  "pwor": "World Championship Promos",
  "pwos": "Wizards of the Coast Online Store",
  "pwpn": "Wizards Play Network 2008",
  "pwwk": "Worldwake Promos",
  "pxln": "Ixalan Promos",
  "pxtc": "XLN Treasure Chest",
  "pz1": "Legendary Cube Prize Pack",
  "pz2": "Treasure Chest",
  "pzen": "Zendikar Promos",
  "pznr": "Zendikar Rising Promos",
  "q06": "Pioneer Challenger Decks 2021",
  "q07": "Challenger Decks 2022",
  "rav": "Ravnica: City of Guilds",
  "ren": "Renaissance",
  "rin": "Rinascimento",
  "rix": "Rivals of Ixalan",
  "rna": "Ravnica Allegiance",
  "roe": "Rise of the Eldrazi",
  "rqs": "Rivals Quick Start Set",
  "rtr": "Return to Ravnica",
  "s00": "Starter 2000",
  "s99": "Starter 1999",
  "scd": "Starter Commander Decks",
  "scg": "Scourge",
  "sch": "Store Championships 2022",
  "shm": "Shadowmoor",
  "skhm": "Kaldheim Substitute Cards",
  "slc": "Secret Lair 30th Anniversary Countdown Kit",
  "sld": "Secret Lair Drop",
  "slu": "Secret Lair: Ultimate Edition",
  "slx": "Universes Within",
  "smid": "Innistrad: Midnight Hunt Substitute Cards",
  "snc": "Streets of New Capenna",
  "sneo": "Kamigawa: Neon Dynasty Substitute Cards",
  "soi": "Shadows over Innistrad",
  "sok": "Saviors of Kamigawa",
  "som": "Scars of Mirrodin",
  "ss1": "Signature Spellbook: Jace",
  "ss2": "Signature Spellbook: Gideon",
  "ss3": "Signature Spellbook: Chandra",
  "sstx": "Strixhaven: School of Mages Substitute Cards",
  "sta": "Strixhaven Mystical Archive",
  "sth": "Stronghold",
  "stx": "Strixhaven: School of Mages",
  "sum": "Summer Magic / Edgar",
  "sunf": "Unfinity Sticker Sheets",
  "svow": "Innistrad: Crimson Vow Substitute Cards",
  "sznr": "Zendikar Rising Substitute Cards",
  "t10e": "Tenth Edition Tokens",
  "t2x2": "Double Masters 2022 Tokens",
  "t2xm": "Double Masters Tokens",
  "t30a": "30th Anniversary Tokens",
  "t40k": "Warhammer 40,000 Tokens",
  "ta25": "Masters 25 Tokens",
  "taer": "Aether Revolt Tokens",
  "tafc": "Forgotten Realms Commander Tokens",
  "tafr": "Adventures in the Forgotten Realms Tokens",
  "takh": "Amonkhet Tokens",
  "tala": "Shards of Alara Tokens",
  "tarb": "Alara Reborn Tokens",
  "tavr": "Avacyn Restored Tokens",
  "tbbd": "Battlebond Tokens",
  "tbfz": "Battle for Zendikar Tokens",
  "tbng": "Born of the Gods Tokens",
  "tbot": "Transformers Tokens",
  "tbrc": "The Brothers' War Commander Tokens",
  "tbro": "The Brothers' War Tokens",
  "tbth": "Battle the Horde",
  "tc14": "Commander 2014 Tokens",
  "tc15": "Commander 2015 Tokens",
  "tc16": "Commander 2016 Tokens",
  "tc17": "Commander 2017 Tokens",
  "tc18": "Commander 2018 Tokens",
  "tc19": "Commander 2019 Tokens",
  "tc20": "Commander 2020 Tokens",
  "tc21": "Commander 2021 Tokens",
  "tclb": "Battle for Baldur's Gate Tokens",
  "tcm2": "Commander Anthology Volume II Tokens",
  "tcma": "Commander Anthology Tokens",
  "tcmr": "Commander Legends Tokens",
  "tcn2": "Conspiracy: Take the Crown Tokens",
  "tcns": "Conspiracy Tokens",
  "tcon": "Conflux Tokens",
  "td0": "Magic Online Theme Decks",
  "td2": "Duel Decks: Mirrodin Pure vs. New Phyrexia",
  "tdag": "Defeat a God",
  "tdd1": "Duel Decks: Elves vs. Goblins Tokens",
  "tdd2": "Duel Decks: Jace vs. Chandra Tokens",
  "tddc": "Duel Decks: Divine vs. Demonic Tokens",
  "tddd": "Duel Decks: Garruk vs. Liliana Tokens",
  "tdde": "Duel Decks: Phyrexia vs. the Coalition Tokens",
  "tddf": "Duel Decks: Elspeth vs. Tezzeret Tokens",
  "tddg": "Duel Decks: Knights vs. Dragons Tokens",
  "tddh": "Duel Decks: Ajani vs. Nicol Bolas Tokens",
  "tddi": "Duel Decks: Venser vs. Koth Tokens",
  "tddj": "Duel Decks: Izzet vs. Golgari Tokens",
  "tddk": "Duel Decks: Sorin vs. Tibalt Tokens",
  "tddl": "Duel Decks: Heroes vs. Monsters Tokens",
  "tddm": "Duel Decks: Jace vs. Vraska Tokens",
  "tdds": "Duel Decks: Mind vs. Might Tokens",
  "tddt": "Duel Decks: Merfolk vs. Goblins Tokens",
  "tddu": "Duel Decks: Elves vs. Inventors Tokens",
  "tdgm": "Dragon's Maze Tokens",
  "tdka": "Dark Ascension Tokens",
  "tdmc": "Dominaria United Commander Tokens",
  "tdmu": "Dominaria United Tokens",
  "tdom": "Dominaria Tokens",
  "tdtk": "Dragons of Tarkir Tokens",
  "tdvd": "Duel Decks Anthology: Divine vs. Demonic Tokens",
  "te01": "Archenemy: Nicol Bolas Tokens",
  "teld": "Throne of Eldraine Tokens",
  "tema": "Eternal Masters Tokens",
  "temn": "Eldritch Moon Tokens",
  "teve": "Eventide Tokens",
  "tevg": "Duel Decks Anthology: Elves vs. Goblins Tokens",
  "tfrf": "Fate Reforged Tokens",
  "tfth": "Face the Hydra",
  "tgk1": "GRN Guild Kit Tokens",
  "tgk2": "RNA Guild Kit Tokens",
  "tgn2": "Game Night 2019 Tokens",
  "tgn3": "Game Night: Free-for-All Tokens",
  "tgrn": "Guilds of Ravnica Tokens",
  "tgtc": "Gatecrash Tokens",
  "tgvl": "Duel Decks Anthology: Garruk vs. Liliana Tokens",
  "thb": "Theros Beyond Death",
  "thou": "Hour of Devastation Tokens",
  "thp1": "Theros Hero's Path",
  "thp2": "Born of the Gods Hero's Path",
  "thp3": "Journey into Nyx Hero's Path",
  "ths": "Theros",
  "tiko": "Ikoria: Lair of Behemoths Tokens",
  "tima": "Iconic Masters Tokens",
  "tisd": "Innistrad Tokens",
  "tjou": "Journey into Nyx Tokens",
  "tjvc": "Duel Decks Anthology: Jace vs. Chandra Tokens",
  "tkhc": "Kaldheim Commander Tokens",
  "tkhm": "Kaldheim Tokens",
  "tkld": "Kaladesh Tokens",
  "tktk": "Khans of Tarkir Tokens",
  "tlrw": "Lorwyn Tokens",
  "tm10": "Magic 2010 Tokens",
  "tm11": "Magic 2011 Tokens",
  "tm12": "Magic 2012 Tokens",
  "tm13": "Magic 2013 Tokens",
  "tm14": "Magic 2014 Tokens",
  "tm15": "Magic 2015 Tokens",
  "tm19": "Core Set 2019 Tokens",
  "tm20": "Core Set 2020 Tokens",
  "tm21": "Core Set 2021 Tokens",
  "tmbs": "Mirrodin Besieged Tokens",
  "tmd1": "Modern Event Deck 2014 Tokens",
  "tmed": "Mythic Edition Tokens",
  "tmh1": "Modern Horizons Tokens",
  "tmh2": "Modern Horizons 2 Tokens",
  "tmic": "Midnight Hunt Commander Tokens",
  "tmid": "Innistrad: Midnight Hunt Tokens",
  "tmm2": "Modern Masters 2015 Tokens",
  "tmm3": "Modern Masters 2017 Tokens",
  "tmma": "Modern Masters Tokens",
  "tmor": "Morningtide Tokens",
  "tmp": "Tempest",
  "tncc": "New Capenna Commander Tokens",
  "tnec": "Neon Dynasty Commander Tokens",
  "tneo": "Kamigawa: Neon Dynasty Tokens",
  "tnph": "New Phyrexia Tokens",
  "togw": "Oath of the Gatewatch Tokens",
  "tor": "Torment",
  "tori": "Magic Origins Tokens",
  "tpca": "Planechase Anthology Tokens",
  "tpr": "Tempest Remastered",
  "trix": "Rivals of Ixalan Tokens",
  "trna": "Ravnica Allegiance Tokens",
  "troe": "Rise of the Eldrazi Tokens",
  "trtr": "Return to Ravnica Tokens",
  "tsb": "Time Spiral Timeshifted",
  "tshm": "Shadowmoor Tokens",
  "tsnc": "Streets of New Capenna Tokens",
  "tsoi": "Shadows over Innistrad Tokens",
  "tsom": "Scars of Mirrodin Tokens",
  "tsp": "Time Spiral",
  "tsr": "Time Spiral Remastered",
  "tstx": "Strixhaven: School of Mages Tokens",
  "tthb": "Theros Beyond Death Tokens",
  "tths": "Theros Tokens",
  "ttsr": "Time Spiral Remastered Tokens",
  "tugl": "Unglued Tokens",
  "tuma": "Ultimate Masters Tokens",
  "tund": "Unsanctioned Tokens",
  "tunf": "Unfinity Tokens",
  "tust": "Unstable Tokens",
  "tvoc": "Crimson Vow Commander Tokens",
  "tvow": "Innistrad: Crimson Vow Tokens",
  "twar": "War of the Spark Tokens",
  "twwk": "Worldwake Tokens",
  "txln": "Ixalan Tokens",
  "tzen": "Zendikar Tokens",
  "tznc": "Zendikar Rising Commander Tokens",
  "tznr": "Zendikar Rising Tokens",
  "uds": "Urza's Destiny",
  "ugin": "Ugin's Fate",
  "ugl": "Unglued",
  "ulg": "Urza's Legacy",
  "uma": "Ultimate Masters",
  "und": "Unsanctioned",
  "unf": "Unfinity",
  "unh": "Unhinged",
  "uplist": "The List (Unfinity Foil Edition)",
  "usg": "Urza's Saga",
  "ust": "Unstable",
  "v09": "From the Vault: Exiled",
  "v10": "From the Vault: Relics",
  "v11": "From the Vault: Legends",
  "v12": "From the Vault: Realms",
  "v13": "From the Vault: Twenty",
  "v14": "From the Vault: Annihilation",
  "v15": "From the Vault: Angels",
  "v16": "From the Vault: Lore",
  "v17": "From the Vault: Transform",
  "vis": "Visions",
  "vma": "Vintage Masters",
  "voc": "Crimson Vow Commander",
  "vow": "Innistrad: Crimson Vow",
  "w16": "Welcome Deck 2016",
  "w17": "Welcome Deck 2017",
  "war": "War of the Spark",
  "wc00": "World Championship Decks 2000",
  "wc01": "World Championship Decks 2001",
  "wc02": "World Championship Decks 2002",
  "wc03": "World Championship Decks 2003",
  "wc04": "World Championship Decks 2004",
  "wc97": "World Championship Decks 1997",
  "wc98": "World Championship Decks 1998",
  "wc99": "World Championship Decks 1999",
  "wmc": "World Magic Cup Qualifiers",
  "wth": "Weatherlight",
  "wwk": "Worldwake",
  "xana": "Arena New Player Experience Extras",
  "xln": "Ixalan",
  "ydmu": "Alchemy: Dominaria",
  "ymid": "Alchemy: Innistrad",
  "yneo": "Alchemy: Kamigawa",
  "ysnc": "Alchemy: New Capenna",
  "zen": "Zendikar",
  "znc": "Zendikar Rising Commander",
  "zne": "Zendikar Rising Expeditions",
  "znr": "Zendikar Rising",
}


module.exports = {
  setCodesToNames,
}
