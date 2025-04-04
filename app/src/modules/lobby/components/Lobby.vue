<template>
  <MagicWrapper>
    <div class='lobby'>
      <Header />

      <div class="container">
        <div class="row">
          <div class="col">
            <h2>
              <EditableText @text-edited="updateName">{{ this.lobby.name }}</EditableText>
            </h2>
          </div>
        </div>


        <div class="row">
          <div class="col" cols="6">
            <LobbySettings
              :lobby-id="id"
              :gameIn="lobby.game"
              :options="lobby.options"
            />
          </div>

          <div class="col" cols="6">
            <LobbyPlayerList :lobby-id="id" />
          </div>
        </div>

        <div class="row">
          <div class="col d-grid">
            <button class="btn btn-success" @click="startGame" :disabled="!lobby.valid">Start!</button>
          </div>
        </div>

      </div>

    </div>
  </MagicWrapper>
</template>

<script>
import { computed } from 'vue'

import EditableText from '@/components/EditableText'
import Header from '@/components/Header'
import LobbyPlayerList from '../components/PlayerList'
import LobbySettings from '../components/Settings'
import MagicWrapper from '@/modules/magic/components/MagicWrapper'


export default {
  name: 'Lobby',
  components: {
    EditableText,
    Header,
    LobbyPlayerList,
    LobbySettings,
    MagicWrapper,
  },

  data() {
    return {
      id: this.$route.params.id,
      lobby: {},
      errorMessage: '',
    }
  },

  provide() {
    return {
      lobby: computed(() => (this.lobby)),
      save: this.save
    }
  },

  methods: {
    async getLobbyInfo() {
      const { lobby } = await this.$post('/api/lobby/info', { lobbyId: this.id })
      this.lobby = lobby
    },

    async save() {
      await this.$post('/api/lobby/save', this.lobby)
    },

    async startGame() {
      if (this.lobby.onStart) {
        await this.lobby.onStart(this.lobby)
        delete this.lobby.onStart  // Don't want to save this callback function
      }

      await this.save()
      if (this.errorMessage) {
        return
      }

      const { gameId } = await this.$post('/api/game/create', {
        lobbyId: this.lobby._id,
      })
      this.$router.push('/game/' + gameId)
    },

    async updateName({ to }) {
      const cleaned = to.trim()
      if (cleaned.length > 0) {
        this.lobby.name = to
        await this.save()
      }
    },
  },

  async beforeRouteUpdate(to, from, next) {
    // This ensures that if a new lobby is loaded without navigating from another
    // view that the lobby data is updated.
    this.id = to.params.id
    await this.getLobbyInfo()
    next()
  },

  async mounted() {
    await this.getLobbyInfo()
  },
}
</script>
