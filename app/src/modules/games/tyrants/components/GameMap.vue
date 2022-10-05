<template>
  <div class="game-map">
    map
    <div id="cytoscape-map"></div>
  </div>
</template>


<script>
import cytoscape from 'cytoscape'
import { util } from 'battlestar-common'


export default {
  name: 'GameMap',

  inject: ['game'],

  computed: {
    mapData() {
      return this.game.state.zones.map
    },

    _nodes() {
      const nodes = Object
        .values(this.mapData)
        .map(zone => {
          return {
            data: {
              id: zone.name,
              name: zone.name,
            },
            classes: zone.checkIsSite() ? 'site-node' : 'edge-node',
            position: {
              x: zone.ui.x * 150,
              y: zone.ui.y * 100,
            },
            selectable: false,
            pannable: true,
          }
        })

      return nodes
    },

    _edges() {
      const pairs = Object
        .values(this.mapData)
        .flatMap(zone => this.game.getLocationNeighbors(zone).map(n => [zone.name, n.name].sort().join(',')))
      const uniquePairs = util.array.distinct(pairs)

      const edges = uniquePairs
        .map(str => str.split(','))
        .map(([source, target]) => ({
          data: {
            id: `${source},${target}`,
            source,
            target,
          },
          selectable: false,
          pannable: true,
        }))

      return edges
    },
  },

  methods: {
    nodeClicked(name) {
      console.log('clicked', name)
    },

    draw() {
      const cy = cytoscape({
        container: document.getElementById('cytoscape-map'),
        elements: {
          nodes: this._nodes,
          edges: this._edges,
        },
        layout: {
          name: 'preset',
        },
        style: [
          {
            selector: '.site-node',
            style: {
              'background-color': 'magenta',
              'shape': 'round-rectangle',
              'label': 'data(id)',
              'font-size': '6px',
              'width': '60px',
              'height': '60px',
            }
          },
          {
            selector: '.edge-node',
            style: {
              'width': '25px',
              'height': '25px',
            },
          },
        ],
        autolock: true,
        minZoom: 1,
        maxZoom: 2,
      })

      const self = this
      cy.on('click', 'node', function(event) {
        self.nodeClicked(event.target.id())
      })
    },

  },

  mounted() {
    this.draw()
  },
}
</script>


<style scoped>
#cytoscape-map {
  width: 600px;
  height: 800px;
  position: absolute;
  top: 0px;
  left: 0px;
  background-color: cyan;
}
</style>
