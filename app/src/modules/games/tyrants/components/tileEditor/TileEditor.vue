<template>
  <div class="tile-editor">

    <div class="sidebar">
      <div class="menu-option" @click="newTile">
        New Tile
        <span class="badge bg-warning text-dark" v-if="unsavedChanges">unsaved changes</span>
      </div>
      <div class="menu-option" @click="duplicate">duplicate</div>

      <hr />

      <div class="menu-option" @click="addSite">Add Site</div>
      <div class="menu-option" @click="addSpot">Add Spot</div>
      <div class="menu-option" @click="connectBegin" :class="connecting ? 'highlight-button' : ''">Connect</div>

      <hr />

      <div class="menu-option" @click="save">Save</div>

      <hr />

      <div class="menu-option" @click="deleteTile">Delete</div>

      <div class="site-details" v-if="tile">
        <div>Tile Info</div>

        <div class="info-label">name</div>
        <input class="form-control" v-model="tile.data.name" />
      </div>

      <div class="site-details" v-if="siteIsSelected">
        <div>Site Info</div>

        <div class="info-label">name</div>
        <input class="form-control" v-model="selectedSite.name" />

        <div class="info-label">size</div>
        <select class="form-control" v-model.number="selectedSite.size" >
          <option v-for="num in [1,2,3,4,5,6,7,8,9]" :key="num" :value="num">{{ num }}</option>
        </select>

        <div class="info-label">neutrals</div>
        <select class="form-control" v-model.number="selectedSite.neutrals" >
          <option v-for="num in [0,1,2,3,4,5,6,7,8,9]" :key="num" :value="num">{{ num }}</option>
        </select>

        <div class="info-label">value</div>
        <select class="form-control" v-model.number="selectedSite.value" >
          <option v-for="num in [0,1,2,3,4,5,6,7,8,9]" :key="num" :value="num">{{ num }}</option>
        </select>

        <div class="checkbox-wrapper">
          <input type="checkbox" v-model="selectedSite.start" />
          <div class="info-label">start location</div>
        </div>

        <div class="checkbox-wrapper">
          <input type="checkbox" v-model="selectedSite.major" />
          <div class="info-label">major site</div>
        </div>
      </div>

      <div class="site-details" v-if="spotIsSelected">
        <div>Spot Info</div>

        <div class="info-label">name</div>
        <input class="form-control" v-model="selectedSite.name" />

        <div class="info-label">neutrals</div>
        <select class="form-control" v-model.number="selectedSite.neutrals" >
          <option v-for="num in [0,1]" :key="num" :value="num">{{ num }}</option>
        </select>
      </div>

      <hr />

      <div class="saved-tiles">
        <h6>Saved Tiles</h6>

        <div v-for="tile in savedTiles" :key="tile.name()" @click="loadTile(tile)">
          {{ tile.name() }}
        </div>
      </div>

    </div>

    <div class="viewer" ref="viewer">
      <svg width="800" height="1000">

        <TileLayer :tiles="tiles" />
        <ConnectorLayer :tiles="tiles" />
        <SiteLayer :tiles="tiles" :selected="selectedSite" />

      </svg>
    </div>

  </div>
</template>


<script>
import { nextTick } from 'vue'
import mitt from 'mitt'

import ConnectorLayer from '../hexmap/ConnectorLayer'
import SiteLayer from '../hexmap/SiteLayer'
import TileLayer from '../hexmap/TileLayer'

import tile from '../hexmap/tile.js'

import { util } from 'battlestar-common'


export default {
  name: 'TileEditor',

  components: {
    ConnectorLayer,
    SiteLayer,
    TileLayer,
  },

  data() {
    return {
      bus: mitt(),

      connecting: false,
      connectFirst: null,

      dragging: false,
      dragX: null,
      dragY: null,

      selectedSite: {},
      unsavedChanges: false,

      tiles: [],

      savedTiles: [],
    }
  },

  provide() {
    return {
      bus: this.bus,
    }
  },

  computed: {
    siteIsSelected() {
      return this.selectedSite && this.selectedSite.kind === 'standard'
    },

    spotIsSelected() {
      return this.selectedSite && this.selectedSite.kind === 'troop-spot'
    },

    sites() {
      return this.tile.data.sites
    },

    tile() {
      return this.tiles[0]
    },
  },

  methods: {
    newName(base) {
      let name
      for (let i = 0; i < 100000; i++) {
        name = base + ' ' + i
        if (this.tile.sites().some(s => s.name === name)) {
          continue
        }
        else {
          return name
        }
      }
    },

    addSite() {
      const site = {
        name: this.newName('site'),
        kind: 'standard',
        dx: 0,
        dy: 0,
        size: 1,
        neutrals: 0,
        value: 2,
        start: false,
        major: false,
        token: null,
      }

      this.tile.data.sites.push(site)
      this.select(site)
    },

    addSpot() {
      const spot = this.createSpot()
      spot.name = this.newName('spot')

      this.tile.data.sites.push(spot)
      this.select(spot)

      return spot
    },

    connectBegin() {
      if (this.connecting) {
        this.connectClear()
      }
      else {
        this.clearSelectedSite()
        this.connecting = true
      }
    },

    connectClear() {
      this.connecting = false
      this.connectFirst = null
      this.clearSelectedSite()
    },

    connectFinalize(a, b) {
      this.connectClear()

      const connection = [a.name, b.name].sort()

      // Prevent duplicates
      if (this.tile.connectors().find(([a, b]) => a === connection[0] && b === connection[1])) {
        console.log('duplicate')
        return
      }

      this.tile.connectors().push([a.name, b.name].sort())
    },

    connectSelect(site) {
      if (this.connectFirst) {
        this.connectFinalize(this.connectFirst, site)
      }
      else {
        this.connectFirst = site
        this.selectedSite = site
      }
    },

    clearSelectedSite() {
      this.selectedSite = {}
    },

    createSpot() {
      return {
        name: 'spot',
        kind: 'troop-spot',
        dx: 0,
        dy: 0,
        neutrals: 0,
      }
    },

    deleteTile() {
      if (this.tile.id()) {
        const result = this.$post('/api/tyrants/hex/delete', {
          id: this.tile.id(),
        })
      }

      this.$router.go()
    },

    duplicate() {
      const data = util.deepcopy(this.tile.data)
      data.name = 'duplicate of ' + data.name
      delete data._id
      this.editTile(data)
    },

    editTile(base) {
      this.clearSelectedSite()
      this.insertTileEdgeSpots(base)

      const tiles = [
        new tile.Tile(base, null),
        new tile.Tile(base, null),
        new tile.Tile(base, null),
        new tile.Tile(base, null),
        new tile.Tile(base, null),
        new tile.Tile(base, null),
      ]
      const positions = [
        { cx: 200, cy: 170, rotation: 0 },
        { cx: 550, cy: 170, rotation: 1 },
        { cx: 200, cy: 480, rotation: 2 },
        { cx: 550, cy: 480, rotation: 3 },
        { cx: 200, cy: 790, rotation: 4 },
        { cx: 550, cy: 790, rotation: 5 },
      ]

      for (let i = 0; i < 6; i++) {
        tiles[i].setCenterPoint(positions[i].cx, positions[i].cy)
        tiles[i].setRotation(positions[i].rotation)
      }

      this.tiles = tiles
    },

    async loadHexes() {
      const requestResult = await this.$post('/api/tyrants/hex/all')
      if (requestResult.status === 'success') {
        this.savedTiles = requestResult
          .hexes
          .map(data => new tile.Tile(data, null))
          .sort((l, r) => l.name().localeCompare(r.name()))
      }
      else {
        console.log(requestResult)
        alert('error: ' + requestResult.message)
      }
    },

    async loadTile(tile) {
      this.editTile(tile.data)
      await nextTick()
      this.unsavedChanges = false
    },

    newTile() {
      const base = {
        name: 'new-tile',
        connectors: [],
        sites: [],
      }
      this.editTile(base)
    },

    async save() {
      const hex = util.deepcopy(this.tile.data)
      this.removeTileEdgeSpots(hex)

      // Save the tile
      const saveResult = await this.$post('/api/tyrants/hex/save', { hex })

      if (saveResult.status !== 'success') {
        console.log(saveResult)
        alert('error saving tile')
        throw new Error('save error')
      }

      this.unsavedChanges = false

      // Update the tile list
      await this.loadHexes()
    },

    select(site) {
      const actual = this.tile.data.sites.find(s => s.name === site.name)
      this.selectedSite = actual
    },

    siteClicked({ event, site }) {
      if (this.connecting) {
        this.connectSelect(site)
      }
      else {
        this.startDragging({ event, site })
      }
    },

    startDragging({ event, site }) {
      this.select(site)
      this.dragging = true
      this.dragX = event.offsetX
      this.dragY = event.offsetY
    },

    insertTileEdgeSpots(data) {
      const dx = 117
      const dy = 67

      for (let i = 0; i < 6; i++) {
        const spot = this.createSpot()
        spot.name = '_hex ' + i

        switch (i) {
          case tile.Direction.N:
            spot.dy = -135
            break
          case tile.Direction.S:
            spot.dy = 135
            break
          case tile.Direction.NE:
            spot.dy = -dy
            spot.dx = dx
            break
          case tile.Direction.NW:
            spot.dy = -dy
            spot.dx = -dx
            break
          case tile.Direction.SE:
            spot.dy = dy
            spot.dx = dx
            break
          case tile.Direction.SW:
            spot.dy = dy
            spot.dx = -dx
            break
          default:
            break
        }

        data.sites.push(spot)
      }
    },

    removeTileEdgeSpots(data) {
      data.sites = data.sites.filter(x => !x.name.startsWith('_hex'))
    },
  },

  mounted() {
    this.loadHexes()

    this.newTile()
    this.addSite()

    const viewer = this.$refs.viewer

    this.bus.on('site-mousedown', this.siteClicked)

    viewer.addEventListener('mouseleave', (event) => {

    })

    viewer.addEventListener('mousemove', (event) => {
      if (this.dragging) {
        const dx = event.offsetX - this.dragX
        const dy = event.offsetY - this.dragY

        this.dragX = event.offsetX
        this.dragY = event.offsetY

        this.selectedSite.dx += dx
        this.selectedSite.dy += dy

        this.updateKey += 1
      }
    })

    viewer.addEventListener('mouseup', (event) => {
      this.dragging = false
    })
  },

  watch: {
    tile: {
      handler() {
        this.unsavedChanges = true
      },
      deep: true,
    },
  },
}
</script>


<style scoped>
.tile-editor {
  display: flex;
  flex-direction: row;
  height: 100vh;
  width: 100vw;
}

.checkbox-wrapper {
  display: flex;
  flex-direction: row;
}

.highlight-button {
  background-color: #a34ff7;
  border-radius: .5em;
  margin-left: -.25em;
  padding-left: .25em;
}

.info-label {
  margin-left: 1em;
  font-size: .8em;
}

.sidebar {
  background-color: lightgray;
  padding: .5em;
  height: 100%;
  width: 300px;
  overflow-y: auto;
}

.site-details {
  border: 1px solid black;
  border-radius: .25em;
  padding: .25em;
  margin-top: 2em;
}

.viewer {
  width: 100%;
  overflow-y: auto;
}
</style>
