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
          <BiscuitsInfo />
          <DecksInfo />
          <AchievementsZone />
          <CardPile :zone="game.zones.byId('junk')" />
          <WaitingPanel />
        </div>

        <div v-for="player in players" :key="player._id" class="col game-column">
          <PlayerTableau :player="player" />
        </div>

      </div>
    </div>

    <AchievementModal :card="achievementCard" />
    <CardsViewerModal :title="cardsViewerTitle" :cards="cardsViewerCards" />
    <DebugModal />
  </div>
</template>


<script>
import GameMenu from '@/modules/games/common/components/GameMenu.vue'
import WaitingPanel from '@/modules/games/common/components/WaitingPanel.vue'

import AchievementsZone from './AchievementsZone.vue'
import BiscuitsInfo from './BiscuitsInfo.vue'
import CardNameFull from './CardNameFull.vue'
import CardPile from './CardPile.vue'
import DecksInfo from './DecksInfo.vue'
import DropdownItem from '@/components/DropdownItem.vue'
import GameLogInnovation from './GameLogInnovation.vue'
import PlayerTableau from './PlayerTableau.vue'

// Modals
import AchievementModal from './AchievementModal.vue'
import CardsViewerModal from './CardsViewerModal.vue'
import DebugModal from '@/modules/games/common/components/DebugModal.vue'

export default {
  name: 'UltimateGame',

  components: {
    AchievementsZone,
    BiscuitsInfo,
    CardPile,
    DecksInfo,
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

  inject: ['actor', 'game'],

  data() {
    return {
      achievementCard: null,
      cardsViewerTitle: '',
      cardsViewerCards: [],
    }
  },

  provide() {
    return {
      ui: this.uiFactory(),
      openModal: this.openModal,
    }
  },

  computed: {
    players() {
      return this.game.players.startingWith(this.viewer)
    },
    viewer() {
      return this.game.players.byName(this.actor.name)
    },
  },

  methods: {
    openModal(name, data) {
      if (name === 'achievement') {
        this.achievementCard = data.card
        this.$modal('achievement-modal').show()
      }
      else if (name === 'cardsViewer') {
        this.cardsViewerTitle = data.title
        this.cardsViewerCards = data.cards
        this.$modal('cards-viewer-modal').show()
      }
    },

    openRules() {
      window.open("https://www.asmadigames.com/innovation/InnoUlt_Rulebook_v0_9.pdf")
    },

    uiFactory() {
      const self = this

      // Subtitles are now provided by the game engine directly
      const insertSelectorSubtitles = () => {}

      const selectorOptionComponent = (option) => {
        const name = option.title ? option.title : option

        if (self.game.cards.hasId(name)) {
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
  background-color: #EA8C51;
}

.color-biscuit-lightbulb {
  /* color: #eee; */
  background-color: #E3627C;
}

.color-biscuit-leaf {
  /* color: #9fcdbf; */
  background-color: #2A6A1F;
}

.color-biscuit-factory {
  /* color: #d04e48; */
  background-color: #EF9832;
}

.color-biscuit-clock {
  /* color: #317ead; */
  background-color: #98A2C0;
}

.color-biscuit-person {
  background-color: #005F71;
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
