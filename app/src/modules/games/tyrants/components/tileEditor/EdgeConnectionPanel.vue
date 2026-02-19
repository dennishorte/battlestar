<template>
  <div class="edge-connection-panel">
    <h4>Edge Connections</h4>

    <div class="edges-grid">
      <div v-for="edge in EDGES" :key="edge" class="edge-row">
        <label class="edge-label">{{ edge }}</label>
        <select
          :value="getEdgeLocation(edge)"
          @change="setEdgeLocation(edge, $event.target.value)"
          class="form-control"
        >
          <option value="">-- None --</option>
          <option
            v-for="loc in locations"
            :key="loc.short"
            :value="loc.short"
          >
            {{ loc.short }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>


<script>
const EDGES = ['N', 'NE', 'SE', 'S', 'SW', 'NW']

export default {
  name: 'EdgeConnectionPanel',

  props: {
    edgeConnections: {
      type: Array,
      required: true,
    },
    locations: {
      type: Array,
      required: true,
    },
  },

  emits: ['update'],

  data() {
    return {
      EDGES,
    }
  },

  methods: {
    getEdgeLocation(edge) {
      const conn = this.edgeConnections.find(c => c.edge === edge)
      return conn ? conn.location : ''
    },

    setEdgeLocation(edge, location) {
      const newConnections = this.edgeConnections.filter(c => c.edge !== edge)
      if (location) {
        newConnections.push({ edge, location })
      }
      // Sort by edge order
      newConnections.sort((a, b) => EDGES.indexOf(a.edge) - EDGES.indexOf(b.edge))
      this.$emit('update', newConnections)
    },
  },
}
</script>


<style scoped>
.edge-connection-panel {
  background: #252525;
  padding: 1em;
  border-radius: 8px;
}

.edge-connection-panel h4 {
  margin: 0 0 0.75em 0;
  color: #d4a574;
}

.edges-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5em;
}

.edge-row {
  display: flex;
  align-items: center;
  gap: 0.5em;
}

.edge-label {
  width: 30px;
  font-weight: 500;
  color: #888;
  font-size: 0.9em;
}

.form-control {
  flex: 1;
  padding: 0.3em 0.5em;
  background: #333;
  border: 1px solid #444;
  border-radius: 4px;
  color: #eee;
  font-size: 0.85em;
}
</style>
