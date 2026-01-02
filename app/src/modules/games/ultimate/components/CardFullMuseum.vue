<template>
  <div
    class="card-full-museum"
    :class="[card.color]"
  >
    <div class="card-underlay" :class="underlayClasses">
      <div class="card-top">
        <div class="card-title">
          {{ card.name }}
        </div>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  name: 'CardFullMuseum',

  props: {
    card: {
      type: Object,
      required: true
    },
  },

  computed: {
    biscuitsTopRow() {
      return []
    },

    biscuitsBottomRow() {
      return []
    },

    underlayClasses() {
      return []
    },

    effects() {
      return []
    },
  },
}
</script>


<style scoped>
.card-full-museum {
  border: 1px solid #7d6c50;
  padding: .2rem;
  margin-bottom: 1px;
  max-width: 300px;
}

.card-top {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.card-title {
  margin-bottom: 0;
  font-size: .9rem;
  flex-grow: 1;
  text-align: right;
  margin-right: .3em;
}
</style>
