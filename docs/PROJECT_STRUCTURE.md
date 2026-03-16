# Project Structure

## Root

```
battlestar/
├── api/                    Express.js backend server
├── app/                    Vue 3 frontend SPA
├── common/                 Shared game logic (battlestar-common)
├── scripts/                Deployment scripts
├── .husky/                 Git hooks (pre-commit linting)
├── package.json            Workspace config: ["common", "api", "app"]
└── README.md               Database setup instructions
```

## API (`api/`)

```
api/
├── server.js               Entry point (Express app, port 3000)
├── src/
│   ├── routes/api/
│   │   ├── index.js        Route aggregator
│   │   ├── auth_router.js  Guest endpoints (no auth required)
│   │   ├── game_router.js  Game CRUD & state management
│   │   ├── user_router.js  User profiles
│   │   ├── lobby_router.js Lobby management
│   │   ├── admin_router.js Admin-only operations
│   │   ├── misc_router.js  Miscellaneous
│   │   └── magic/          Magic-specific routes (card, cube, deck, scryfall, link)
│   ├── controllers/
│   │   ├── game_controller.js   Game lifecycle & state
│   │   ├── lobby_controller.js  Lobby operations
│   │   ├── user_controller.js   Auth & profiles
│   │   ├── misc_controller.js   Miscellaneous
│   │   └── magic/               Magic controllers (card, cube, deck, scryfall, link)
│   ├── models/
│   │   ├── db.js                DB connection
│   │   ├── game_models.js       Game collection operations
│   │   ├── user_models.js       User & auth
│   │   ├── lobby_models.js      Lobby data
│   │   ├── notif_models.js      Notifications
│   │   └── magic/               Magic models (card, cube, deck, scryfall)
│   ├── middleware/
│   │   ├── index.js             Middleware aggregator
│   │   ├── auth.js              JWT/Passport authentication
│   │   ├── validators.js        Input validation, version check, ID coercion
│   │   ├── loaders.js           Resource loading with AsyncLock
│   │   └── errors.js            Error handling
│   ├── services/
│   │   ├── game_service.js      Game business logic
│   │   └── notification_service.js
│   ├── utils/                   Logger, response format, Swagger, errors, validation
│   └── notifications/
│       └── providers/           Slack, Telegram
├── config/                 Environment configs (dev, prod, test)
├── migrations/             Database migrations
├── scripts/                Scryfall card fetching, processing
├── tests/
│   ├── vitest.setup.js     Test setup
│   ├── unit/               Unit tests by module
│   └── integration/        API integration tests
├── vitest.config.js        Vitest configuration
└── package.json            Dependencies & scripts
```

## App (`app/`)

```
app/
├── src/
│   ├── main.js             Entry point (Vue 3 + Bootstrap Vue + Router + Vuex)
│   ├── router/index.js     SPA routing with auth guard
│   ├── store/index.js      Vuex store (auth, game, magic modules)
│   ├── components/
│   │   ├── App.vue         Root component
│   │   ├── GameBase.vue    Game container (loads game, provides context)
│   │   ├── GameHeader.vue  Navigation header
│   │   ├── GameMenu.vue    Game controls (undo, pause, debug)
│   │   ├── HomePage.vue    Landing page
│   │   ├── MyGames.vue     Active games list
│   │   ├── MyLobbies.vue   Lobby list
│   │   ├── ModalBase.vue   Modal wrapper
│   │   ├── ErrorModal.vue  Error display
│   │   └── Dropdown*.vue   Reusable dropdown components
│   ├── modules/
│   │   ├── auth/           Login/logout, route guard, auth store
│   │   ├── lobby/          Game lobby creation & joining
│   │   ├── admin/          Admin dashboard
│   │   ├── profile/        User profile
│   │   ├── data/           Game data viewers
│   │   ├── magic/          Card viewer, cube viewer, deck builder
│   │   ├── mapmaker/       Map editor (Tyrants)
│   │   └── games/
│   │       ├── common/     Shared game components & store
│   │       │   ├── store.js         Game loading, saving, undo
│   │       │   ├── components/      OptionSelector, WaitingPanel, GameLog, etc.
│   │       │   └── composables/     useGameLog, useLogTokenizer
│   │       ├── agricola/   24 components (board, farmyard, cards, score)
│   │       ├── magic/      22 components (zones, counters, phases)
│   │       ├── tyrants/    21 components (hex map, market, tableau)
│   │       ├── ultimate/   24 components (cards, achievements, scoring)
│   │       └── cube_draft/ 7 components (draft UI)
│   ├── util/
│   │   ├── axiosWrapper.js HTTP client (injects version, handles errors)
│   │   ├── modal.js        Bootstrap modal wrapper
│   │   └── deviceDetection.js
│   └── assets/             CSS, images, SCSS variables
├── vite.config.js          Vite config (Vue, auto-import, SCSS, proxy)
└── package.json            Dependencies & scripts
```

## Common (`common/`)

```
common/
├── main.js                 Game factory: fromData(), fromLobby()
├── lib/
│   ├── game.js             Game class (state, responses, input requests, undo, serialize)
│   ├── game/
│   │   ├── BaseActionManager.js  choose(), chooseCard(), choosePlayer(), flipCoin()
│   │   ├── BaseCard.js           Card with visibility, movement, zones
│   │   ├── BaseCardManager.js    Card registry
│   │   ├── BaseLogManager.js     Game log with templates, chat, arg handlers
│   │   ├── BasePlayer.js         Player with counters, team, elimination
│   │   ├── BasePlayerManager.js  Turn order, player queries
│   │   ├── BaseZone.js           Card container (public/private/hidden)
│   │   ├── BaseZoneManager.js    Zone registry
│   │   ├── GameProxy.js          Transparent property delegation to game
│   │   └── testFixture.js        Test utilities
│   ├── selector.js         Input request validation
│   ├── transitionFactory.js State machine helpers for game phases
│   ├── util.js             Array/dict/string utilities
│   ├── log.js              Logging
│   └── test_common.js      Shared test helpers
├── agricola/               Agricola game implementation
├── magic/                  Magic: The Gathering implementation
├── tyrants/                Tyrants of the Underdark implementation
├── ultimate/               Innovation: Ultimate implementation
└── package.json            Dependencies (seedrandom, jest)
```

## Scripts (`scripts/`)

```
scripts/
├── deploy.sh               Production deployment
├── server-deploy.sh        Server-specific deployment
├── _updateVersion.js       Version management
└── updateVersion.sh        Version update
```
