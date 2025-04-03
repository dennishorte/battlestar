<template>
  <div class="innovation">
    <div class="container-fluid">
      <div class="row flex-nowrap main-row">
        <div class="col history-column">

          <GameMenu>
            <DropdownItem>
              <button @click="openRules">rules</button>
            </DropdownItem>
          </GameMenu>

          <GameLogInnovation />
        </div>

        <div class="col game-column">
          <Biscuits />
          <Decks />
          <Achievements />
          <CardPile :zone="game.getZoneById('junk')" />
          <WaitingPanel />
        </div>

        <div v-for="player in players" :key="player._id" class="col game-column">
          <PlayerTableau :player="player" />
        </div>

      </div>
    </div>

    <AchievementModal />
    <CardsViewerModal />
    <DebugModal />
  </div>
</template>


<script>
import mitt from 'mitt'

import { inn } from 'battlestar-common'

import GameMenu from '@/modules/games/common/components/GameMenu'
import WaitingPanel from '@/modules/games/common/components/WaitingPanel'

import Achievements from './Achievements'
import Biscuits from './Biscuits'
import CardNameFull from './CardNameFull'
import CardPile from './CardPile'
import Decks from './Decks'
import DropdownItem from '@/components/DropdownItem'
import GameLogInnovation from './GameLogInnovation'
import PlayerTableau from './PlayerTableau'

// Modals
import AchievementModal from './AchievementModal'
import CardsViewerModal from './CardsViewerModal'
import DebugModal from '@/modules/games/common/components/DebugModal'

export default {
  name: 'Ultimate',

  components: {
    Achievements,
    Biscuits,
    CardPile,
    Decks,
    DropdownItem,
    GameMenu,
    GameLogInnovation,
    PlayerTableau,
    WaitingPanel,

    // Modals
    AchievementModal,
    CardsViewerModal,
    DebugModal,
  },

  data() {
    return {
      bus: mitt(),
    }
  },

  inject: ['actor', 'game'],

  provide() {
    return {
      bus: this.bus,
      ui: this.uiFactory(),
    }
  },

  computed: {
    players() {
      return this.game.getPlayersStarting(this.viewer)
    },
    viewer() {
      return this.game.getPlayerByName(this.actor.name)
    },
  },

  methods: {
    openRules() {
      window.open("https://asmadigames.com/rules/Rulebook_Deluxe_spreads.pdf")
    },

    uiFactory() {
      const self = this

      const insertSelectorSubtitles = (selector) => {
        if (selector.title === 'Dogma') {
          const player = this.game.getPlayerByName(this.actor.name)
          const updated = []
          for (const option of selector.choices) {
            const cardName = option.title || option
            const card = this.game.getCardByName(cardName)
            const shareInfo = this.game.getDogmaShareInfo(player, card, { noBiscuitKarma: true })

            const subtitles = []

            if (shareInfo.hasShare && shareInfo.sharing.length > 0) {
              const shareNames = shareInfo.sharing.map(p => p.name).join(', ')
              subtitles.push(`share with ${shareNames}`)
            }

            if (shareInfo.hasCompel && shareInfo.sharing.length > 0) {
              const compelNames = shareInfo.sharing.map(p => p.name).join(', ')
              subtitles.push(`compel ${compelNames}`)
            }

            if (shareInfo.hasDemand && shareInfo.demanding.length > 0) {
              const demandNames = shareInfo.demanding.map(p => p.name).join(', ')
              subtitles.push(`demand ${demandNames}`)
            }

            updated.push({
              title: cardName,
              subtitles,
            })
          }

          selector.choices = updated
        }

        else if (selector.title === 'Free Artifact Action') {
          const player = this.game.getPlayerCurrent()
          const card = this.game.getCardsByZone(player, 'artifact')[0]
          const effects = this.game.getVisibleEffectsByColor(player, card.color, 'echo')
          if (effects.length > 0) {
            selector.choices[0] = {
              title: 'dogma',
              subtitles: [`${effects.length} echo effects will trigger`]
            }
          }
        }
      }

      const selectorOptionComponent = (option) => {
        const name = option.title ? option.title : option

        if (self.game.getCardByName(name, '')) {
          return {
            component: CardNameFull,
            props: { name },
          }
        }
        else {
          return undefined
        }
      }

      return {
        fn: {
          insertSelectorSubtitles,
          selectorOptionComponent,
        }
      }
    },
  },

  created() {
    this.game.ui = {
      modals: {
        achievement: {
          card: '',
        },
        cardsViewer: {
          cards: [],
          title: '',
        },
      },
    }
  },

  mounted() {
    document.title = this.game.settings.name || 'Game Center'
  },
}
</script>

<style>
.innovation {
  width: 100vw;
  height: calc(100vh - 60px);
  font-size: .8rem;
  overflow: auto;
}

.game-column {
  height: calc(100vh - 60px);
  min-width: 220px;
  max-width: 400px;
  overflow-x: hidden;
  overflow-y: auto;
  padding-bottom: 3em;
}

.history-column {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 60px);
  min-width: 400px;
  max-width: 400px;
  overflow: hidden;
}

.text-base { color: #bba37a; }
.text-echo { color: #6889ec; }
.text-figs { color: #519432; }
.text-city { color: #cc0000; }
.text-arti { color: #9532a8; }
.text-usee { color: #777777; }

.bg-base { background-color: #bba37a; }
.bg-echo { background-color: #6889ec; }
.bg-figs { background-color: #519432; }
.bg-city { background-color: #cc0000; }
.bg-arti { background-color: #9532a8; }
.bg-usee { background-color: #777777; }

.color-biscuit-castle {
  /* color: #b6bcc6;  */
  background-color: #494e51;
}

.color-biscuit-coin {
  /* color: #f1df83; */
  background-color: #a47b37;
}

.color-biscuit-lightbulb {
  /* color: #eee; */
  background-color: #6a214b;
}

.color-biscuit-leaf {
  /* color: #9fcdbf; */
  background-color: #295d46;
}

.color-biscuit-factory {
  /* color: #d04e48; */
  background-color: #6e1b14;
}

.color-biscuit-clock {
  /* color: #317ead; */
  background-color: #055386;
}

.color-biscuit-person {
  background-color: #AFEEEE;
}

.red {
  background-color: #f5a2a2;
  border-color: #eb4545;
}

.yellow {
  background-color: #f9ffb9;
  border-color: #f3ff73;
}

.green {
  background-color: #baeaa4;
  border-color: #75d448;
}

.blue {
  background-color: #c8e4ff;
  border-color: #7eb8ee;
}

.purple {
  background-color: #decafa;
  border-color: #bd94f5;
}
</style>
