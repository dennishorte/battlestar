<template>
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
</template>

<script>
import { computed } from 'vue'
import axios from 'axios'

import EditableText from '@/components/EditableText'
import Header from '@/components/Header'
import LobbyPlayerList from '../components/PlayerList'
import LobbySettings from '../components/Settings'


export default {
  name: 'Lobby',
  components: {
    EditableText,
    Header,
    LobbyPlayerList,
    LobbySettings,
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
    async axiosRequest(api, payload) {
      const res = await axios.post(api, payload)

      if (res.data.status === 'error') {
        this.errorMessage = res.data.message
        alert(this.errorMessage)
      }
      else {
        return res.data
      }
    },

    async getLobbyInfo() {
      const data = await this.axiosRequest('/api/lobby/info', { id: this.id })
      if (data) {
        this.lobby = data.lobby
      }
    },

    async save() {
      const data = await axios.post('/api/lobby/save', this.lobby)
    },

    async startGame() {
      await this.save()
      if (this.errorMessage) {
        return
      }

      const data = await this.axiosRequest('/api/game/create', {
        lobbyId: this.lobby._id,
      })
      if (data) {
        this.$router.push('/game/' + data.gameId)
      }
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
