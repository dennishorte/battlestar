<template>
  <div class="animal-display">
    <div
      v-for="animal in animals"
      :key="animal.type"
      class="animal-item"
      :class="animal.type"
      :title="animal.label"
    >
      <span class="animal-icon">{{ animal.icon }}</span>
      <span class="animal-count">{{ animal.count }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AnimalDisplay',

  props: {
    player: {
      type: Object,
      required: true,
    },
  },

  computed: {
    animals() {
      return [
        { type: 'sheep', icon: '🐑', count: this.player.sheep, label: 'Sheep' },
        { type: 'boar', icon: '🐗', count: this.player.boar, label: 'Wild Boar' },
        { type: 'cattle', icon: '🐄', count: this.player.cattle, label: 'Cattle' },
      ]
    },
  },
}
</script>

<style scoped>
.animal-display {
  display: flex;
  gap: .5em;
  padding: .5em;
  background-color: #e8f5e9;
  border-radius: .25em;
  margin-bottom: .5em;
  justify-content: center;
}

.animal-item {
  display: flex;
  align-items: center;
  gap: .25em;
  padding: .25em .5em;
  border-radius: .25em;
  background-color: #fff;
  border: 1px solid #c8e6c9;
}

.animal-icon {
  font-size: 1.1em;
}

.animal-count {
  font-weight: bold;
  font-size: 1em;
  min-width: 1.2em;
  text-align: center;
}

/* Animal-specific styling */
.animal-item.sheep {
  border-color: #e0e0e0;
}

.animal-item.boar {
  border-color: #d7ccc8;
}

.animal-item.cattle {
  border-color: #ffe0b2;
}
</style>
