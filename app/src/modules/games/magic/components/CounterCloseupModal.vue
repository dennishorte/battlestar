<template>
  <Modal id="counter-closeup-modal">
    <template #header>Player Counters</template>

    <div class="modal-body">

      <div v-for="(player, index) of players" :key="player.name" class="player-section">
        <h5>{{ player.name }}</h5>

        <div class="player-inner">
          <PlayerCounter
            v-for="name in Object.keys(player.counters)"
            :key="name"
            :player="player"
            :name="name"
            button-size="large"
          />

          <div class="input-group">
            <input class="form-control" placeholder="new counter" v-model="newCounters[index]" />
            <button class="btn btn-primary" @click="newCounter(index)">
              <i class="bi bi-check-lg" />
            </button>
          </div>
        </div>
      </div>

    </div>
  </Modal>
</template>


<script>
import Modal from '@/components/Modal'
import PlayerCounter from './PlayerCounter'


export default {
  name: 'CounterCloseupModal',

  components: {
    Modal,
    PlayerCounter,
  },

  inject: ['actor', 'do', 'game'],

  data() {
    return {
      newCounters: ['', '', '', '', '', '', '', '', '', ''],
    }
  },

  computed: {
    players() {
      const player = this.game.getPlayerByName(this.actor.name)
      return this.game.getPlayersStarting(player)
    },
  },

  methods: {
    newCounter(index) {
      const player = this.players[index]
      const name = this.newCounters[index]
      this.do(null, {
        name: 'add counter player',
        playerName: player.name,
        key: name,
      })
    },
  },
}
</script>


<style scoped>
h5 {
  margin-bottom: 0;
}

.counter {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.player-inner {
  margin: 0 1em;
}

.player-section:not(:first-of-type) {
  margin-top: .5em;
}
</style>
