<template>
  <div class="feyd-track">
    <svg viewBox="0 0 820 220" class="track-svg" preserveAspectRatio="xMidYMid meet">
      <defs>
        <marker id="feyd-arrow"
                viewBox="0 0 10 10"
                refX="9"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#8a7a68" />
        </marker>
      </defs>

      <line v-for="edge in edges"
            :key="edge.key"
            :x1="edge.x1"
            :y1="edge.y1"
            :x2="edge.x2"
            :y2="edge.y2"
            class="track-edge"
            marker-end="url(#feyd-arrow)" />

      <g v-for="node in nodes"
         :key="node.id"
         :class="['track-node', { current: node.id === currentPosition, finish: node.id === 'finish' }]">
        <rect :x="node.x"
              :y="node.y"
              :width="node.w"
              :height="node.h"
              rx="6"
              ry="6"
              class="node-rect" />
        <text :x="node.x + node.w / 2"
              :y="node.y + 18"
              class="node-label"
              text-anchor="middle">{{ node.label }}</text>
        <text v-for="(line, i) in node.lines"
              :key="i"
              :x="node.x + node.w / 2"
              :y="node.y + 36 + i * 14"
              class="node-reward"
              text-anchor="middle">{{ line }}</text>
      </g>
    </svg>
  </div>
</template>


<script>
// Layout mirrors FEYD_TRACK in common/dune/systems/leaderAbilities.js:
//   start → A|B → C → D|E; D → finish; E → F → finish.
const NODES = [
  { id: 'start',  label: 'Start',  lines: [],                                 x: 10,  y: 90,  w: 100, h: 60 },
  { id: 'A',      label: 'A',      lines: ['Pay 1 Solari', 'Trash a card'],   x: 150, y: 20,  w: 100, h: 60 },
  { id: 'B',      label: 'B',      lines: ['Place a Spy'],                    x: 150, y: 160, w: 100, h: 60 },
  { id: 'C',      label: 'C',      lines: ['Trash a card'],                   x: 290, y: 90,  w: 100, h: 60 },
  { id: 'D',      label: 'D',      lines: ['Trash a card'],                   x: 430, y: 20,  w: 100, h: 60 },
  { id: 'E',      label: 'E',      lines: ['Place a Spy'],                    x: 430, y: 160, w: 100, h: 60 },
  { id: 'F',      label: 'F',      lines: ['Gain 2 Spice'],                   x: 570, y: 160, w: 100, h: 60 },
  { id: 'finish', label: 'Finish', lines: ['+1 Troop', 'Place a Spy'],        x: 710, y: 90,  w: 100, h: 60 },
]

const EDGES = [
  ['start', 'A'], ['start', 'B'],
  ['A', 'C'], ['B', 'C'],
  ['C', 'D'], ['C', 'E'],
  ['D', 'finish'],
  ['E', 'F'],
  ['F', 'finish'],
]

function edgeEndpoints(fromNode, toNode) {
  const fromCy = fromNode.y + fromNode.h / 2
  const toCy = toNode.y + toNode.h / 2
  return {
    x1: fromNode.x + fromNode.w,
    y1: fromCy,
    x2: toNode.x,
    y2: toCy,
  }
}

export default {
  name: 'DuneFeydTrack',

  props: {
    currentPosition: { type: String, default: 'start' },
  },

  computed: {
    nodes() {
      return NODES
    },

    edges() {
      const byId = Object.fromEntries(NODES.map(n => [n.id, n]))
      return EDGES.map(([from, to]) => ({
        key: `${from}-${to}`,
        ...edgeEndpoints(byId[from], byId[to]),
      }))
    },
  },
}
</script>


<style scoped>
.feyd-track {
  width: 100%;
  max-width: 540px;
}

.track-svg {
  width: 100%;
  height: auto;
}

.track-edge {
  stroke: #8a7a68;
  stroke-width: 1.5;
  fill: none;
}

.node-rect {
  fill: #f5f0e8;
  stroke: #b0a080;
  stroke-width: 1;
}

.track-node.current .node-rect {
  fill: #f3d98a;
  stroke: #8b6914;
  stroke-width: 2;
}

.track-node.finish .node-rect {
  fill: #e8ddf0;
  stroke: #6a3d8a;
}

.track-node.finish.current .node-rect {
  fill: #f3d98a;
  stroke: #8b6914;
  stroke-width: 2;
}

.node-label {
  font-size: 13px;
  font-weight: 700;
  fill: #2c2416;
}

.node-reward {
  font-size: 11px;
  fill: #4a3e2c;
}
</style>
