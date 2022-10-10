<template>
  <b-container fluid class="map-maker">
    <b-row>
      <b-col class="editors-col">
        <div class="menu">
          <b-dropdown text="menu" class="menu">
            <b-dropdown-divider />
            <b-dropdown-item @click="exportData">export</b-dropdown-item>
          </b-dropdown>
          <b-button @click="add">add</b-button>
          <b-button @click="toggleConnect">connect</b-button>
        </div>

        <div class="editor-div">
          <PrismEditor
            class="editor"
            v-model="code.html"
            :highlight="htmlHighlight"
            @input="htmlChanged"
          />
        </div>

        <div class="editor-div">
          <PrismEditor
            class="editor"
            v-model="code.css"
            :highlight="cssHighlight"
            @input="cssChanged"
          />
        </div>
      </b-col>

      <b-col
        class="map-render"
        @mouseup="stopDrag"
      >
        <div
          class="map"
          :style="mapStyle"
        >
          <div
            v-for="(div, index) in elems.divs"
            :key="index"
            :style="divStyle(div)"
            :id="div.id"
            @mousedown="click"
            @mousemove="drag"
          >
          </div>

          <svg class="curves" height="800" width="600">
            <CubicBezier
              v-for="(curve, index) in elems.curves"
              :key="index"
              v-model="elems.curves[index]"
            />
          </svg>

        </div>


      </b-col>
    </b-row>
  </b-container>
</template>


<script>

// import Prism Editor
import { PrismEditor } from 'vue-prism-editor'
import 'vue-prism-editor/dist/prismeditor.min.css'

// import highlighting library (you can use any library you want just return html string)
import { highlight, languages } from 'prismjs/components/prism-core'
import 'prismjs/components/prism-json'
import 'prismjs/themes/prism-tomorrow.css'

import CubicBezier from './CubicBezier'


const testNodes = [
  {
    "id": "node100",
    "classes": [
      "element"
    ],
    "style": {
      "background-color": "red",
      "left": "233px",
      "top": "29px",
      "height": "50px",
      "width": "50px"
    }
  },
  {
    "id": "node101",
    "classes": [
      "element"
    ],
    "style": {
      "background-color": "blue",
      "left": "150px",
      "top": "150px",
      "height": "50px",
      "width": "50px"
    }
  }
]

const testConnections = [
  {
    source: 'node100',
    target: 'node101',
  }
]

const baseStyle = {
  '.element': {
    position: 'absolute',
  },
  '.map': {
    position: 'relative',
    height: '800px',
    width: '600px',
    backgroundColor: '#ddd',
  },
}

export default {
  name: 'MapMaker',

  components: {
    CubicBezier,
    PrismEditor,
  },

  data() {
    return {
      code: {
        css: '{}',
        html: '[]',
      },

      // Elements
      elems: {
        divs: testNodes,
        curves: [],
      },

      // Element relations and styles
      elemMeta: {
        curveLinks: testConnections,
        styles: baseStyle,
      },

      errors: {
        css: false,
        html: false,
      },

      connecting: {
        active: false,
        first: null,
      },

      dragging: {
        elem: null,
        mouseX: null,
        mouseY: null,
        top: null,
        left: null,
      },

      nextId: 100,
    }
  },

  computed: {
    mapStyle() {
      return this.elemMeta.styles['.map'] || {}
    },
  },

  methods: {

    ////////////////////////////////////////////////////////////////////////////////
    // Save and Load

    exportData() {
      console.log('export')
    },


    ////////////////////////////////////////////////////////////////////////////////
    // Editors

    cssHighlight(code) {
      return highlight(code, languages.json)
    },
    htmlHighlight(code) {
      return highlight(code, languages.json)
    },

    updateCssEditorFromData() {
      this.code.css = JSON.stringify(this.elemMeta.styles, null, 2)
    },
    updateDivEditorFromData() {
      this.code.html = JSON.stringify(this.elems.divs, null, 2)
    },

    cssChanged() {
      try {
        console.log('CSS Changed')
        this.errors.css = false
      }
      catch (e) {
        this.errors.css = true
      }
    },

    htmlChanged() {
      try {
        this.elems.divs = JSON.parse(this.code.html)
        this.elems.curves = this.updateCurves()
        this.errors.html = false
      }
      catch (e) {
        this.errors.html = true
      }
    },


    ////////////////////////////////////////////////////////////////////////////////
    // Other

    addPoints(a, b) {
      return {
        x: a.x + b.x,
        y: a.y + b.y,
      }
    },

    click(event) {
      if (this.connecting.active) {
        this.connect(event)
      }
      else {
        this.startDrag(event)
      }
    },


    ////////////////////////////////////////////////////////////////////////////////
    // Div rendering


    add() {
      const id = 'node' + this.nextId
      this.nextId += 1

      this.elems.divs.push({
        id,
        classes: ['element'],
        style: {
          'background-color': 'red',
          left: '20px',
          top: '100px',
          height: '50px',
          width: '50px',
        }
      })

      this.updateDivEditorFromData()
    },

    divStyle(div) {
      const baseStyle = this.elemMeta.styles['.element'] || {}
      const classStyles = div
        .classes
        .map(cls => this.elemMeta.styles[cls])
        .filter(style => style !== undefined)


      return Object.assign({}, baseStyle, ...classStyles, div.style)
    },

    updateDivFromElem(div, elem) {
      div.style.top = elem.offsetTop + 'px'
      div.style.left = elem.offsetLeft + 'px'
    },


    ////////////////////////////////////////////////////////////////////////////////
    // Connect

    connect(event) {
      if (this.connecting.first) {
        const link = {
          source: this.connecting.first.id(),
          target: event.target.id(),
        }
        this.elemMeta.curveLinks.push(link)

        this.connecting.active = false
        this.connecting.first = null

        this.updateCurves()
      }
      else {
        this.connecting.first = event.target
      }
    },

    toggleConnect() {
      if (this.connecting.active) {
        this.connecting.active = false
        this.connecting.first = null
      }
      else {
        this.connecting.active = true
      }
    },

    newCurve(link) {
      return {
        ids: {
          source: link.source,
          target: link.target,
        },
        points: {
          source: { x: 0, y: 0 },
          target: { x: 100, y: 100 },
          sourceHandle: { x: 100, y: 0 },
          targetHandle: { x: 0, y: 100 },
        },
      }
    },

    updateCurves() {
      for (const link of this.elemMeta.curveLinks) {
        let curve = this.elems.curves.find(c => (
          c.ids.source === link.source
          && c.ids.target === link.target
        ))
        if (!curve) {
          curve = this.newCurve(link)
          this.elems.curves.push(curve)
        }

        const sourceHandleOffset = {
          x: curve.points.sourceHandle.x - curve.points.source.x,
          y: curve.points.sourceHandle.y - curve.points.source.y,
        }
        const targetHandleOffset = {
          x: curve.points.targetHandle.x - curve.points.target.x,
          y: curve.points.targetHandle.y - curve.points.target.y,
        }

        const newSourcePoint = this.sourceCoords(link)
        const newTargetPoint = this.targetCoords(link)

        curve.points.source = newSourcePoint
        curve.points.target = newTargetPoint
        curve.points.sourceHandle = this.addPoints(curve.points.source, sourceHandleOffset)
        curve.points.targetHandle = this.addPoints(curve.points.target, targetHandleOffset)

        curve.points.sourceHandle.moveable = true
        curve.points.targetHandle.moveable = true
      }
    },

    connectionPoints(link) {
      return {
        sourceId: link.souce,
        targetId: link.target,
        source: this.sourceCoords(link),
        target: this.targetCoords(link),
        sourceHandle: this.sourceHandleCoords(link),
        targetHandle: this.targetHandleCoords(link),
      }
    },

    sourceCoords(link) {
      const source = this.elems.divs.find(div => div.id === link.source)
      return this.divCenter(source)
    },

    targetCoords(link) {
      const target = this.elems.divs.find(div => div.id === link.target)
      return this.divCenter(target)
    },

    sourceHandleCoords(link) {
      const coords = this.sourceCoords(link)
      coords.x += 100
      return coords
    },

    targetHandleCoords(link) {
      const coords = this.targetCoords(link)
      coords.x -= 100
      return coords
    },

    divCenter(div) {
      const x = this.parsePx(div.style.left) + Math.floor(this.parsePx(div.style.width) / 2)
      const y = this.parsePx(div.style.top) + Math.floor(this.parsePx(div.style.height) / 2)

      return { x, y }
    },

    parsePx(px) {
      return parseInt(px.substr(0, px.length - 2))
    },


    ////////////////////////////////////////////////////////////////////////////////
    // Drag

    drag(event) {
      if (this.dragging.elem) {
        const distX = event.clientX - this.dragging.mouseX
        const distY = event.clientY - this.dragging.mouseY

        const newTop = this.dragging.top + distY + 'px'
        const newLeft = this.dragging.left + distX + 'px'

        this.dragging.elem.style.top = newTop
        this.dragging.elem.style.left = newLeft

        const div = this.elems.divs.find(div => div.id === this.dragging.elem.id)
        this.updateDivFromElem(div, this.dragging.elem)
        this.updateDivEditorFromData()
        this.updateCurves()
      }
    },

    startDrag(event) {
      this.dragging = {
        elem: event.target,
        mouseX: event.clientX,
        mouseY: event.clientY,
        top: event.target.offsetTop,
        left: event.target.offsetLeft,
      }
    },

    stopDrag() {
      this.dragging = {
        elem: null,
        mouseX: null,
        mouseY: null,
        top: null,
        left: null,
      }
    },

  },

  mounted() {
    this.updateDivEditorFromData()
    this.updateCssEditorFromData()
    this.updateCurves()
  },
}
</script>


<style scoped>
.editors-col {
  max-width: 400px;
  height: 100vh;
}

.editor {
  background: #5d5d5d;
  padding: 4px;

  /* you must provide font-family font-size line-height. Example: */
  font-family: Fira code, Fira Mono, Consolas, Menlo, Courier, monospace;
  font-size: 14px;
  line-height: 1.5;
}

.editor-div {
  height: 45%;
  margin-top: 5px;
}

.map-render {
  height: 100vh;
}

.curves {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
}

svg {
  pointer-events: none;
}

svg * {
  pointer-events: auto;
}
</style>
