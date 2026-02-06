<template>
  <div class="tile-editor">
    <div class="editor-layout">
      <div class="editor-left">
        <TileEditorToolbar
          :tool="editorState.tool"
          :pathStart="editorState.pathStart"
          @selectTool="selectTool"
          @addLocation="showAddLocationForm"
        />

        <div class="tile-container" :style="tileContainerStyle">
          <ViewerHexTile
            :tile="workingTile"
            :hexSize="hexSize"
          />

          <!-- Editor overlay for interactions -->
          <div class="editor-overlay" :style="editorOverlayStyle">
            <EditorLocation
              v-for="loc in workingTile.locations"
              :key="loc.short"
              :location="loc"
              :hexSize="hexSize"
              :selected="editorState.selectedLocation === loc.short"
              :isPathStart="editorState.pathStart === loc.short"
              :tool="editorState.tool"
              @select="selectLocation"
              @updatePosition="updateLocationPosition"
            />
          </div>
        </div>
      </div>

      <div class="editor-right">
        <div class="panels">
          <LocationForm
            v-if="editorState.selectedLocation || showNewLocationForm"
            :location="selectedLocationData"
            :isNew="showNewLocationForm"
            @update="updateLocation"
            @create="createLocation"
            @delete="deleteLocation"
            @cancel="cancelLocationForm"
          />

          <EdgeConnectionPanel
            :edgeConnections="workingTile.edgeConnections"
            :locations="workingTile.locations"
            @update="updateEdgeConnections"
          />

          <PathConnectionPanel
            :paths="workingTile.paths"
            :locations="workingTile.locations"
            @delete="deletePath"
          />

          <div class="tile-metadata">
            <h4>Tile Metadata</h4>
            <div class="form-group">
              <label>ID</label>
              <input type="text" v-model="workingTile.id" class="form-control" />
            </div>
            <div class="form-group">
              <label>Category</label>
              <select v-model="workingTile.category" class="form-control">
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="X">X</option>
              </select>
            </div>
            <div class="form-group">
              <label>Region</label>
              <input type="text" v-model="workingTile.region" class="form-control" />
            </div>
          </div>

          <JsonPreview :tile="workingTile" />
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import ViewerHexTile from '@/modules/data/components/ViewerHexTile.vue'
import EditorLocation from './EditorLocation.vue'
import TileEditorToolbar from './TileEditorToolbar.vue'
import LocationForm from './LocationForm.vue'
import EdgeConnectionPanel from './EdgeConnectionPanel.vue'
import PathConnectionPanel from './PathConnectionPanel.vue'
import JsonPreview from './JsonPreview.vue'

export default {
  name: 'TileEditor',

  components: {
    ViewerHexTile,
    EditorLocation,
    TileEditorToolbar,
    LocationForm,
    EdgeConnectionPanel,
    PathConnectionPanel,
    JsonPreview,
  },

  props: {
    tile: {
      type: Object,
      required: true,
    },
    hexSize: {
      type: Number,
      default: 200,
    },
  },

  data() {
    return {
      workingTile: this.cloneTile(this.tile),
      editorState: {
        tool: 'select',
        selectedLocation: null,
        pathStart: null,
      },
      showNewLocationForm: false,
    }
  },

  computed: {
    // Flat-top hex: width = 2 * size, height = sqrt(3) * size
    hexWidth() {
      return this.hexSize * 2
    },

    hexHeight() {
      return this.hexSize * Math.sqrt(3)
    },

    // Padding for edge indicators that extend beyond hex boundary
    edgePadding() {
      return 12
    },

    tileContainerStyle() {
      return {
        width: (this.hexWidth + this.edgePadding * 2) + 'px',
        height: (this.hexHeight + this.edgePadding * 2) + 'px',
        position: 'relative',
      }
    },

    editorOverlayStyle() {
      return {
        position: 'absolute',
        top: this.edgePadding + 'px',
        left: this.edgePadding + 'px',
        width: this.hexWidth + 'px',
        height: this.hexHeight + 'px',
        zIndex: 20,
        pointerEvents: 'none',
      }
    },

    selectedLocationData() {
      if (this.showNewLocationForm) {
        return {
          short: '',
          name: '',
          size: 1,
          neutrals: 0,
          points: 0,
          start: false,
          control: { influence: 0, points: 0 },
          totalControl: { influence: 0, points: 0 },
          position: { x: 0.5, y: 0.5 },
        }
      }
      return this.workingTile.locations.find(l => l.short === this.editorState.selectedLocation)
    },
  },

  watch: {
    tile: {
      handler(newTile) {
        this.workingTile = this.cloneTile(newTile)
      },
      deep: true,
    },
  },

  methods: {
    cloneTile(tile) {
      return {
        id: tile.id,
        category: tile.category,
        region: tile.region,
        specialRules: tile.specialRules ? JSON.parse(JSON.stringify(tile.specialRules)) : null,
        locations: tile.locations.map(loc => ({
          short: loc.short,
          name: loc.name,
          size: loc.size,
          neutrals: loc.neutrals,
          points: loc.points,
          start: loc.start || false,
          control: { ...loc.control },
          totalControl: { ...loc.totalControl },
          position: loc.position ? { ...loc.position } : { x: 0.5, y: 0.5 },
        })),
        paths: tile.paths.map(p => [...p]),
        edgeConnections: tile.edgeConnections.map(e => ({ ...e })),
      }
    },

    selectTool(tool) {
      this.editorState.tool = tool
      if (tool !== 'connect-path') {
        this.editorState.pathStart = null
      }
      if (tool !== 'select') {
        this.showNewLocationForm = false
      }
    },

    selectLocation(locationShort) {
      if (this.editorState.tool === 'connect-path') {
        this.handlePathConnection(locationShort)
      }
      else if (this.editorState.tool === 'select') {
        this.editorState.selectedLocation = locationShort
        this.showNewLocationForm = false
      }
    },

    handlePathConnection(locationShort) {
      if (!this.editorState.pathStart) {
        this.editorState.pathStart = locationShort
      }
      else {
        if (this.editorState.pathStart !== locationShort) {
          this.addPath(this.editorState.pathStart, locationShort)
        }
        this.editorState.pathStart = null
      }
    },

    addPath(from, to) {
      const exists = this.workingTile.paths.some(
        p => (p[0] === from && p[1] === to) || (p[0] === to && p[1] === from)
      )
      if (!exists) {
        this.workingTile.paths.push([from, to])
      }
    },

    deletePath(index) {
      this.workingTile.paths.splice(index, 1)
    },

    updateLocationPosition(short, position) {
      const loc = this.workingTile.locations.find(l => l.short === short)
      if (loc) {
        loc.position = position
      }
    },

    updateLocation(updatedLoc) {
      const index = this.workingTile.locations.findIndex(l => l.short === this.editorState.selectedLocation)
      if (index !== -1) {
        // If short name changed, update paths and edge connections
        const oldShort = this.workingTile.locations[index].short
        if (oldShort !== updatedLoc.short) {
          this.updateReferences(oldShort, updatedLoc.short)
        }
        this.workingTile.locations[index] = updatedLoc
      }
    },

    createLocation(newLoc) {
      this.workingTile.locations.push(newLoc)
      this.showNewLocationForm = false
      this.editorState.selectedLocation = newLoc.short
    },

    deleteLocation(short) {
      const index = this.workingTile.locations.findIndex(l => l.short === short)
      if (index !== -1) {
        this.workingTile.locations.splice(index, 1)
        // Remove paths involving this location
        this.workingTile.paths = this.workingTile.paths.filter(
          p => p[0] !== short && p[1] !== short
        )
        // Remove edge connections to this location
        this.workingTile.edgeConnections = this.workingTile.edgeConnections.filter(
          e => e.location !== short
        )
        this.editorState.selectedLocation = null
      }
    },

    updateReferences(oldShort, newShort) {
      // Update paths
      for (const path of this.workingTile.paths) {
        if (path[0] === oldShort) {
          path[0] = newShort
        }
        if (path[1] === oldShort) {
          path[1] = newShort
        }
      }
      // Update edge connections
      for (const edge of this.workingTile.edgeConnections) {
        if (edge.location === oldShort) {
          edge.location = newShort
        }
      }
    },

    updateEdgeConnections(edgeConnections) {
      this.workingTile.edgeConnections = edgeConnections
    },

    showAddLocationForm() {
      this.showNewLocationForm = true
      this.editorState.selectedLocation = null
      this.editorState.tool = 'select'
    },

    cancelLocationForm() {
      this.showNewLocationForm = false
    },
  },
}
</script>


<style scoped>
.tile-editor {
  width: 100%;
}

.editor-layout {
  display: flex;
  gap: 1.5em;
}

.editor-left {
  flex: 0 0 auto;
}

.editor-right {
  flex: 0 0 auto;
  width: 360px;
}

.tile-container {
  background: #1a1a1a;
  border-radius: 8px;
  margin-top: 0.5em;
}

.editor-overlay {
  /* Positioning set via inline style from editorOverlayStyle computed */
}

.panels {
  display: flex;
  flex-direction: column;
  gap: 1em;
}

.tile-metadata {
  background: #252525;
  padding: 1em;
  border-radius: 8px;
}

.tile-metadata h4 {
  margin: 0 0 0.75em 0;
  color: #d4a574;
}

.form-group {
  margin-bottom: 0.75em;
}

.form-group label {
  display: block;
  margin-bottom: 0.25em;
  font-size: 0.85em;
  color: #888;
}

.form-control {
  width: 100%;
  padding: 0.4em 0.6em;
  background: #333;
  border: 1px solid #444;
  border-radius: 4px;
  color: #eee;
}
</style>
