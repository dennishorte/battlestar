<template>
  <div class="innovation">
    <div class="container-fluid">
      <div class="row main-row">
        <div class="col game-column history-column">

          <GameMenu>
            <DropdownItem>
              <button @click="openRules">rules</button>
            </DropdownItem>
          </GameMenu>

          <History />
        </div>

        <div class="col game-column">
          <Biscuits />
          <Decks />
          <Achievements />
          <WaitingPanel />
          <ChatInput />
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
import axios from 'axios'
import mitt from 'mitt'

import { inn } from 'battlestar-common'

import ChatInput from '@/modules/games/common/components/ChatInput'
import GameMenu from '@/modules/games/common/components/GameMenu'
import WaitingPanel from '@/modules/games/common/components/WaitingPanel'

import Achievements from './Achievements'
import Biscuits from './Biscuits'
import CardNameFull from './CardNameFull'
import Decks from './Decks'
import DropdownItem from '@/components/DropdownItem'
import History from './History'
import PlayerTableau from './PlayerTableau'

// Modals
import AchievementModal from './AchievementModal'
import CardsViewerModal from './CardsViewerModal'
import DebugModal from '@/modules/games/common/components/DebugModal'

export default {
  name: 'Innovation',

  components: {
    Achievements,
    Biscuits,
    ChatInput,
    Decks,
    DropdownItem,
    GameMenu,
    History,
    PlayerTableau,
    WaitingPanel,

    // Modals
    AchievementModal,
    CardsViewerModal,
    DebugModal,
  },

  props: {
    data: Object,
    actor: Object,
  },

  data() {
    return {
      bus: mitt(),
      game: new inn.Innovation(this.data, this.actor.name),
      fakeSave: false,
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

  provide() {
    return {
      actor: this.actor,
      bus: this.bus,
      game: this.game,
      ui: this.uiFactory(),
    }
  },

  methods: {
    handleSaveResult(result) {
      console.log(result)

      if (result.data.status === 'success') {
        this.game.usedUndo = false

        this.$bvToast.toast('saved', {
          autoHideDelay: 1000,
          noCloseButton: true,
          solid: true,
          variant: 'success',
        })
      }
      else {
        this.$bvToast.toast('error: see console', {
          autoHideDelay: 999999,
          noCloseButton: false,
          solid: true,
          variant: 'danger',
        })
      }
    },

    openRules() {
      window.open("https://asmadigames.com/rules/Rulebook_Deluxe_spreads.pdf")
    },

    save: async function() {
      if (this.fakeSave) {
        console.log('fake saved (game)')
        return
      }

      await this.saveFull()
    },

    saveFull: async function() {
      const game = this.game
      const payload = {
        gameId: game._id,
        responses: game.responses,
        chat: game.getChat(),
      }
      const requestResult = await axios.post('/api/game/saveFull', payload)
      this.handleSaveResult(requestResult)
    },

    uiFactory() {
      const self = this

      return {
        selectorOptionComponent: function(option) {
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
        },
      }
    }
  },

  created() {
    this.game.testMode = true

    Vue.set(this.game, 'ui', {
      modals: {
        achievement: {
          card: '',
        },
        cardsViewer: {
          cards: [],
          title: '',
        },
      },
    })

    const mChatOrigFunc = this.game.mChat
    this.game.mChat = async function(...args) {
      mChatOrigFunc.apply(this.game, args)
      await this.save()
    }.bind(this)

    this.game.save = async function() {
      await this.save()
    }.bind(this)

    this.game.run()
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
  overflow: scroll;
}

.game-column {
  height: calc(100vh - 60px);
  min-width: 220px;
  max-width: 400px;
  overflow: scroll;
}

.history-column {
  min-width: 400px;
}

.main-row {
  flex-wrap: nowrap;
}

.text-base { color: #bba37a; }
.text-echo { color: #6889ec; }
.text-figs { color: #519432; }
.text-city { color: #cc0000; }
.text-arti { color: #9532a8; }

.bg-base { background-color: #bba37a; }
.bg-echo { background-color: #6889ec; }
.bg-figs { background-color: #519432; }
.bg-city { background-color: #cc0000; }
.bg-arti { background-color: #9532a8; }

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
