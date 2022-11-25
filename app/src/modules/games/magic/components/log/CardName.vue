<template>
  <div class="card-name" @click="clicked">
    {{ displayName }}
  </div>
</template>


<script>
export default {
  name: 'CardName',

  inject: ['game'],

  props: {
    name: String,
  },

  computed: {
    card() {
      return this.game.getCardById(this.name)
    },

    displayName() {
      return this.card ? this.card.name : this.name
    },
  },

  methods: {
    clicked() {
    },
  },
}
</script>


<style scoped>
.card-name {
  display: inline-block;
  color: #2a1247;
  font-weight: bold;
  text-decoration: underline;
}
</style>
