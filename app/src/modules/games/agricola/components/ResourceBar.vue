<template>
  <div class="resource-bar">
    <div
      v-for="res in resources"
      :key="res.type"
      class="resource-item"
      :class="res.type"
      :title="res.label"
    >
      <span class="resource-icon">{{ res.icon }}</span>
      <span class="resource-count">{{ res.count }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ResourceBar',

  props: {
    player: {
      type: Object,
      required: true,
    },
  },

  computed: {
    resources() {
      return [
        { type: 'food', icon: '🍞', count: this.player.food, label: 'Food' },
        { type: 'wood', icon: '🪵', count: this.player.wood, label: 'Wood' },
        { type: 'clay', icon: '🧱', count: this.player.clay, label: 'Clay' },
        { type: 'stone', icon: '🪨', count: this.player.stone, label: 'Stone' },
        { type: 'reed', icon: '🌿', count: this.player.reed, label: 'Reed' },
        { type: 'grain', icon: '🌾', count: this.player.grain, label: 'Grain' },
        { type: 'vegetables', icon: '🥕', count: this.player.vegetables, label: 'Vegetables' },
      ]
    },
  },
}
</script>

<style scoped>
.resource-bar {
  display: flex;
  flex-wrap: wrap;
  gap: .25em;
  padding: .5em;
  background-color: #f9f9f9;
  border-radius: .25em;
  margin-bottom: .5em;
}

.resource-item {
  display: flex;
  align-items: center;
  gap: .15em;
  padding: .2em .4em;
  border-radius: .2em;
  min-width: 45px;
  justify-content: center;
}

.resource-icon {
  font-size: 1em;
}

.resource-count {
  font-weight: bold;
  font-size: .95em;
}

/* Resource-specific colors */
.resource-item.food {
  background-color: #fff8e1;
  border: 1px solid #ffcc80;
}

.resource-item.wood {
  background-color: #efebe9;
  border: 1px solid #a1887f;
}

.resource-item.clay {
  background-color: #fbe9e7;
  border: 1px solid #ffab91;
}

.resource-item.stone {
  background-color: #eceff1;
  border: 1px solid #90a4ae;
}

.resource-item.reed {
  background-color: #e8f5e9;
  border: 1px solid #a5d6a7;
}

.resource-item.grain {
  background-color: #fffde7;
  border: 1px solid #fff59d;
}

.resource-item.vegetables {
  background-color: #f1f8e9;
  border: 1px solid #aed581;
}
</style>
