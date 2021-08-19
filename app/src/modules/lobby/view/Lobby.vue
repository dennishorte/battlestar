<template>
<div class='lobby'>
  <Header />

  <b-container>
    <b-row>
      <b-col>
        <h2><span class="text-secondary">Lobby - </span>{{ this.lobby.name }}</h2>
      </b-col>
    </b-row>


    <b-row>
      <b-col cols="6">
        <h3>Settings</h3>
      </b-col>

      <b-col cols="6">
        <LobbyPlayerList :lobby-id="id" :players="players" @users-updated="getLobbyInfo" />
      </b-col>
    </b-row>
  </b-container>

</div>
</template>

<script>
import axios from 'axios'

import Header from '../../../../src/components/Header'
import LobbyPlayerList from '../components/PlayerList'

export default {
  name: 'Lobby',
  components: {
    Header,
    LobbyPlayerList,
  },
  data() {
    return {
      id: this.$route.params.id,
      error: false,
      errorMessage: '',
      lobby: {},
      players: [],
    }
  },
  methods: {
    async getLobbyInfo() {
      const infoRequestResult = await axios.post('/api/lobby/info', {
        id: this.id,
      })

      if (infoRequestResult.status === 'error') {
        this.error = true
        this.errorMessage = infoRequestResult.message
      }
      else {
        this.lobby = infoRequestResult.data.lobby

        await this.getPlayerInfo()
      }
    },

    async getPlayerInfo() {
      const playerRequestResult = await axios.post('/api/user/fetch_many', {
        userIds: this.lobby.userIds
      })

      if (playerRequestResult.status === 'error') {
        this.error = true
        this.errorMessage = playerRequestResult.message
      }
      else {
        this.players = playerRequestResult.data.users
      }
    },

  },

  mounted() {
    this.getLobbyInfo()
  },
}
</script>
