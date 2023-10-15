<template>
  <div class="tile-editor">

    <div class="sidebar">
      <div class="menu-option" @click="newTile">New Tile</div>

      <hr />

      <div class="menu-option" @click="addSite">Add Site</div>
      <div class="menu-option" @click="addSpot">Add Spot</div>

      <div class="site-details">
        <div>Tile Info</div>

        <div class="info-label">name</div>
        <input class="form-control" v-model="name" />
      </div>

      <div class="site-details" v-if="selectedSite && selectedSite.kind !== 'troop-spot'">
        <div>Site Info</div>

        <div class="info-label">name</div>
        <input class="form-control" v-model="selectedSite.name" />

        <div class="info-label">size</div>
        <select class="form-control" v-model.number="selectedSite.size" >
          <option v-for="num in [1,2,3,4,5,6,7,8,9]" :value="num">{{ num }}</option>
        </select>

        <div class="info-label">neutrals</div>
        <select class="form-control" v-model.number="selectedSite.neutrals" >
          <option v-for="num in [0,1,2,3,4,5,6,7,8,9]" :value="num">{{ num }}</option>
        </select>

        <div class="info-label">value</div>
        <select class="form-control" v-model.number="selectedSite.value" >
          <option v-for="num in [0,1,2,3,4,5,6,7,8,9]" :value="num">{{ num }}</option>
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

      <div class="site-details" v-if="selectedSite && selectedSite.kind === 'troop-spot'">
        <div>Spot Info</div>

        <div class="info-label">name</div>
        <input class="form-control" v-model="selectedSite.name" />

        <div class="info-label">neutrals</div>
        <select class="form-control" v-model.number="selectedSite.neutrals" >
          <option v-for="num in [0,1]" :value="num">{{ num }}</option>
        </select>
      </div>

    </div>

    <div class="viewer" ref="viewer">
      <svg width="800" height="1000">

        <TileLayer :tiles="tiles" />
        <SiteLayer :tiles="tiles" :selected="selectedSite" />

      </svg>
    </div>

  </div>
</template>


<script>
import mitt from 'mitt'

import SiteLayer from '../hexmap/SiteLayer'
import TileLayer from '../hexmap/TileLayer'

import tile from '../hexmap/tile.js'


export default {
  name: 'TileEditor',

  components: {
    SiteLayer,
    TileLayer,
  },

  data() {
    return {
      bus: mitt(),

      dragging: false,
      dragX: null,
      dragY: null,
      selectedSite: {},

      name: 'new-tile',
      tiles: [],

      index: 0,
    }
  },

  provide() {
    return {
      bus: this.bus,
    }
  },

  computed: {
    sites() {
      return this.tile.data.sites
    },

    tile() {
      return this.tiles[0]
    },
  },

  methods: {
    addSite() {
      const site = {
        index: this.index,
        name: 'test',
        dx: 0,
        dy: 0,
        size: 1,
        neutrals: 0,
        value: 2,
        start: false,
        major: false,
        token: null,
      }

      this.tiles[0].data.sites.push(site)
      this.select(site)
      this.index += 1
    },

    addSpot() {
      const spot = {
        index: this.index,
        name: 'spot',
        kind: 'troop-spot',
        dx: 0,
        dy: 0,
        neutrals: 0,
      }

      this.tiles[0].data.sites.push(spot)
      this.select(spot)
      this.index += 1
    },

    newTile() {
      const base = {
        sites: [],
      }

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

    select(site) {
      const actual = this.tiles[0].data.sites.find(s => s.index === site.index)
      this.selectedSite = actual
    },

    startDragging({ event, site }) {
      this.select(site)
      this.dragging = true
      this.dragX = event.offsetX
      this.dragY = event.offsetY
    },
  },

  mounted() {
    this.newTile()
    this.addSite()

    const viewer = this.$refs.viewer

    this.bus.on('site-mousedown', this.startDragging)

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
}
</script>


<style scoped>
.tile-editor {
  display: flex;
  flex-direction: row;
  height: 1000px;
  width: 100vw;
}

.checkbox-wrapper {
  display: flex;
  flex-direction: row;
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
}

.site-details {
  border: 1px solid black;
  border-radius: .25em;
  padding: .25em;
  margin-top: 2em;
}

.viewer {
  height: 100%;
  width: 100%;
}
</style>
