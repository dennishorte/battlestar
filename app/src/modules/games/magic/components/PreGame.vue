<template>
  <div class="pre-game">

    <div class="header">
      {{ game.settings.name }} | Pre-Game Deck Selection
    </div>


    <div class="content">
      <div class="chat-column">
        <GameMenu :disabled="['debug', 'undo']">
          <DropdownDivider />
          <DropdownButton data-bs-toggle="modal" data-bs-target="#link-to-draft-modal">link to draft</DropdownButton>
        </GameMenu>

        <GameLog :entries="game.getMergedLog()" />
        <ChatInput />
      </div>

      <div class="deck-column">
        <div v-if="!!linkedDraft" class="alert alert-primary linked-draft-info">
          <div>Linked Draft</div>
          <div>
            <button @click="goToDraft" data-bs-dismiss="modal" class="btn btn-link">
              {{ linkedDraft.settings.name }}
            </button>
          </div>
        </div>

        <div class="players">
          <table class="table table-sm">
            <thead>
              <tr>
                <th>name</th>
                <th>status</th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="player in game.getPlayerAll()"
                :class="waiting(player) ? 'table-warning' : 'table-success'"
              >
                <td>{{ player.name }}</td>
                <td>
                  <span v-if="waiting(player)">waiting...</span>
                  <span v-else>ready</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="d-grid">
          <button class="btn btn-warning" @click="unselectDeck" v-if="ready">
            Click to shout: "Wait a minute!"
          </button>
          <button class="btn btn-success" @click="selectDeck" v-else :disabled="!activeDeck">
            Click to shout: "I am ready!"
          </button>
        </div>

        <MagicFileManager
          class="deck-selector"
          :filelist="deckfiles"
          @selection-changed="selectionChanged"
        />
      </div>

      <div class="content-column deck-list-column">
        <Decklist
          v-if="activeDeck"
          :deck="activeDeck"
          :no-menu="true"
          @card-clicked="cardClicked"
        />
      </div>

    </div>
  </div>
</template>


<script>
import { mag } from 'battlestar-common'
import { mapState } from 'vuex'

import ChatInput from '@/modules/games/common/components/ChatInput'
import Decklist from '@/modules/magic/components/deck/Decklist'
import DropdownDivider from '@/components/DropdownDivider'
import DropdownButton from '@/components/DropdownButton'
import GameLog from './log/GameLog'
import GameMenu from '@/modules/games/common/components/GameMenu'
import MagicFileManager from '@/modules/magic/components/MagicFileManager'

export default {
  name: 'PreGame',

  components: {
    ChatInput,
    Decklist,
    DropdownDivider,
    DropdownButton,
    GameLog,
    GameMenu,
    MagicFileManager,
  },

  inject: ['actor', 'game', 'save'],

  computed: {
    ...mapState('magic/dm', {
      activeDeck: 'activeDeck',
      modified: 'modified',
    }),

    ...mapState('magic/file', {
      filelist: 'filelist',
    }),

    ...mapState('magic/game', {
      linkedDraft: 'linkedDraft',
    }),

    deckfiles() {
      return this.filelist.filter(file => file.kind === 'deck')
    },

    ready() {
      const player = this.game.getPlayerByName(this.actor.name)
      return !this.game.checkPlayerHasActionWaiting(player)
    },
  },

  methods: {
    cardClicked(card) {
      this.$store.dispatch('magic/dm/clickCard', card)
    },

    goToDraft() {
      this.$router.push(`/game/${this.linkedDraft._id}`)
    },

    selectionChanged({ newValue }) {
      if (newValue.objectType === 'file') {
        this.$store.dispatch('magic/dm/selectDeck', newValue.file)
      }
    },

    selectDeck() {
      const player = this.game.getPlayerByName(this.actor.name)
      const waiting = this.game.getWaiting(player)

      if (!waiting || waiting.title !== 'Choose Deck') {
        alert(`Something went wrong. Not expecting ${player.name} to choose a deck.`)
        return
      }

      this.game.respondToInputRequest({
        actor: this.actor.name,
        title: waiting.title,
        deckData: this.activeDeck.serialize(),
      })
      this.save()
    },

    unselectDeck() {
      this.game.undo()
      this.save()
    },

    waiting(player) {
      return this.game.checkPlayerHasActionWaiting(player)
    },
  },

  created() {
    this.$store.dispatch('magic/file/fetchAll')
  },
}
</script>


<style scoped>
.pre-game {
  display: flex;
  flex-direction: column;
  margin: 0 1em;
}

.chat-column {
  min-width: 20em;
}

.content {
  display: flex;
  flex-direction: row;
  margin-top: .5em;
  max-width: 100vw;
  overflow-x: scroll;
}

.deck-column {
  display: flex;
  flex-direction: column;
  min-width: 20em;
}

.deck-column:not(:first-of-type) {
  margin-left: .5em;
}

.deck-list-column {
  max-height: 80vh;
}

.deck-selector {
  border: 1px solid darkgray;
  background-color: var(--bs-light);
  border-radius: .25em;
  margin-top: .25em;
}

.header {
  display: flex;
  align-items: center;
  justify-content: center;

  color: white;
  background-color: var(--bs-orange);
  text-align: center;
  font-size: 1.2em;
  border-radius: 0 0 .5em .5em;
  height: 5vh;
}

.linked-draft-info {
  display: flex;
  align-items: center;
  flex-direction: column;
}
</style>
