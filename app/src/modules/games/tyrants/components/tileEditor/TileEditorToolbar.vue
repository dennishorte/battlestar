<template>
  <div class="tile-editor-toolbar">
    <div class="toolbar-row">
      <div class="tool-group">
        <button
          class="tool-btn"
          :class="{ active: tool === 'select' }"
          @click="$emit('selectTool', 'select')"
          title="Select (click to select location)"
        >
          <span class="tool-icon">&#9654;</span>
          <span class="tool-label">Select</span>
        </button>

        <button
          class="tool-btn"
          :class="{ active: tool === 'drag' }"
          @click="$emit('selectTool', 'drag')"
          title="Drag (move locations)"
        >
          <span class="tool-icon">&#9995;</span>
          <span class="tool-label">Drag</span>
        </button>

        <button
          class="tool-btn"
          :class="{ active: tool === 'connect-path' }"
          @click="$emit('selectTool', 'connect-path')"
          title="Connect Path (click two locations)"
        >
          <span class="tool-icon">&#8644;</span>
          <span class="tool-label">Path</span>
        </button>
      </div>

      <div class="tool-group">
        <button
          class="tool-btn add-btn"
          @click="$emit('addLocation')"
          title="Add new location"
        >
          <span class="tool-icon">+</span>
          <span class="tool-label">Add</span>
        </button>
      </div>
    </div>

    <div class="tool-status" v-if="pathStart">
      <span class="status-text">
        Click location to connect from <strong>{{ pathStart }}</strong>
      </span>
      <button class="cancel-btn" @click="$emit('selectTool', 'select')">Cancel</button>
    </div>
  </div>
</template>


<script>
export default {
  name: 'TileEditorToolbar',

  props: {
    tool: {
      type: String,
      default: 'select',
    },
    pathStart: {
      type: String,
      default: null,
    },
  },

  emits: ['selectTool', 'addLocation'],
}
</script>


<style scoped>
.tile-editor-toolbar {
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 0.5em;
  background: #252525;
  border-radius: 8px;
  min-width: 280px;
}

.toolbar-row {
  display: flex;
  gap: 0.5em;
  align-items: center;
}

.tool-group {
  display: flex;
  gap: 0.25em;
}

.tool-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.4em 0.6em;
  background: #333;
  border: 1px solid #444;
  border-radius: 4px;
  color: #aaa;
  cursor: pointer;
  transition: all 0.15s;
  min-width: 50px;
}

.tool-btn:hover {
  background: #3a3a3a;
  border-color: #555;
  color: #ddd;
}

.tool-btn.active {
  background: #4a90d9;
  border-color: #4a90d9;
  color: white;
}

.tool-btn.add-btn {
  background: #3a6b35;
  border-color: #3a6b35;
  color: #cfc;
}

.tool-btn.add-btn:hover {
  background: #4a8b45;
}

.tool-icon {
  font-size: 1.2em;
  line-height: 1;
}

.tool-label {
  font-size: 0.7em;
  margin-top: 0.2em;
}

.tool-status {
  display: flex;
  align-items: center;
  gap: 0.5em;
  padding: 0.3em 0.5em;
  background: #3a2525;
  border-radius: 4px;
}

.status-text {
  font-size: 0.8em;
  color: #d94a4a;
}

.cancel-btn {
  padding: 0.2em 0.5em;
  background: #555;
  border: none;
  border-radius: 3px;
  color: #ddd;
  cursor: pointer;
  font-size: 0.8em;
}

.cancel-btn:hover {
  background: #666;
}
</style>
