<template>
  <b-modal
    id="hacks-modal"
    title="Hacks"
    ok-only>

    <div>
      <span class="heading">You are: </span>{{ currentPlayer.name }}
      <div v-for="player in players" :key="player.name" @click="impersonate(player.name)">
        {{ player.name }}
      </div>
    </div>

    <div class="heading">Compatibility</div>

  </b-modal>
</template>


<script>
export default {
  name: 'HacksModal',

  computed: {
    currentPlayer() {
      return this.$game.getActor()
    },

    players() {
      return this.$game.getPlayerAll()
    },
  },

  methods: {
    impersonate(name) {
      this.$game.hackImpersonate(name)
    },
  },
}
</script>
