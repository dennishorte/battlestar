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

  </b-modal>
</template>


<script>
export default {
  name: 'HacksModal',

  computed: {
    currentPlayer() {
      return this.$store.getters['bsg/uiViewer']
    },

    players() {
      return this.$store.getters['bsg/players']
    },
  },

  methods: {
    impersonate(name) {
      this.$store.dispatch('bsg/impersonate', name)
    },
  },
}
</script>
