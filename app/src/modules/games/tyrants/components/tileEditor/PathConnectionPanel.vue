<template>
  <div class="path-connection-panel">
    <h4>Paths ({{ paths.length }})</h4>

    <div class="paths-list" v-if="paths.length > 0">
      <div
        v-for="(path, index) in paths"
        :key="path[0] + '-' + path[1]"
        class="path-item"
      >
        <span class="path-endpoints">
          {{ path[0] }} &harr; {{ path[1] }}
        </span>
        <button
          class="delete-btn"
          @click="$emit('delete', index)"
          title="Delete path"
        >
          &times;
        </button>
      </div>
    </div>

    <div v-else class="no-paths">
      No paths defined. Use the Path tool to connect locations.
    </div>
  </div>
</template>


<script>
export default {
  name: 'PathConnectionPanel',

  props: {
    paths: {
      type: Array,
      required: true,
    },
    locations: {
      type: Array,
      required: true,
    },
  },

  emits: ['delete'],
}
</script>


<style scoped>
.path-connection-panel {
  background: #252525;
  padding: 1em;
  border-radius: 8px;
}

.path-connection-panel h4 {
  margin: 0 0 0.75em 0;
  color: #d4a574;
}

.paths-list {
  display: flex;
  flex-direction: column;
  gap: 0.25em;
  max-height: 400px;
  overflow-y: auto;
}

.path-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.3em 0.5em;
  background: #333;
  border-radius: 4px;
}

.path-endpoints {
  font-family: monospace;
  font-size: 0.85em;
  color: #ccc;
}

.delete-btn {
  background: none;
  border: none;
  color: #a66;
  font-size: 1.2em;
  cursor: pointer;
  padding: 0 0.3em;
  line-height: 1;
}

.delete-btn:hover {
  color: #f66;
}

.no-paths {
  color: #666;
  font-size: 0.85em;
  font-style: italic;
}
</style>
