<template>
  <b-container fluid class="map-maker">
    <b-row>
      <b-col class="editors-col">
        <div class="menu">
          <b-dropdown text="menu" class="menu">
            <b-dropdown-item @click="showLoadModal">load</b-dropdown-item>
            <b-dropdown-divider />
            <b-dropdown-item @click="exportData">export</b-dropdown-item>
          </b-dropdown>

          <b-dropdown text="add" class="menu">
            <b-dropdown-item @click="add">base</b-dropdown-item>

            <b-dropdown-item
              v-for="(kind, index) in nodeKinds"
              :key="index"
              @click="addKind(kind)"
            >
              {{ kind }}
            </b-dropdown-item>
          </b-dropdown>

          <b-button @click="startConnecting" :variant="connectButtonVariant">connect</b-button>
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

      <b-col class="map-render" ref="mapRender">

        <div
          class="map"
          :style="mapStyle"
        >
          <svg class="curves" :height="svgHeight" :width="svgWidth">
            <CubicBezier
              v-for="(curve, index) in elems.curves"
              :key="index"
              :points="elems.curves[index].points"
              can-select="true"
            />
          </svg>

          <div
            v-for="(div, index) in styledDivs"
            :key="index"
            :style="div.renderStyle"
            :id="div.id"
            can-select="true"
            can-connect="true"
            can-drag="true"
          >
          </div>

          <template v-if="Boolean(curveHandles)">
            <div
              v-for="(point, index) in curveHandles"
              :key="index"
              :name="point.name"
              class="curve-handle"
              can-drag="true"
            />
          </template>

        </div>


      </b-col>
    </b-row>

    <UploadModal @file-ready="loadData" />
  </b-container>

</template>


<script>

import Vue from 'vue'

import { util } from 'battlestar-common'
import { saveAs } from 'file-saver'

// import Prism Editor
import { PrismEditor } from 'vue-prism-editor'
import 'vue-prism-editor/dist/prismeditor.min.css'

// import highlighting library (you can use any library you want just return html string)
import { highlight, languages } from 'prismjs/components/prism-core'
import 'prismjs/components/prism-json'
import 'prismjs/themes/prism-tomorrow.css'

import CubicBezier from './CubicBezier'
import UploadModal from './UploadModal'


const testNodes = [
  {
    "id": "node103",
    "classes": [
      "element",
      "secondary"
    ],
    "style": {
      "left": "81px",
      "top": "56px"
    }
  },
  {
    "id": "node115",
    "classes": [
      "element",
      "tertiary"
    ],
    "style": {
      "left": "100px",
      "top": "125px"
    }
  }
]

const testCurves = [
  {
    "id": "curve100",
    "ids": {
      "source": "node103",
      "target": "node115"
    },
    "points": {
      "source": {
        "x": 121,
        "y": 81
      },
      "target": {
        "x": 112,
        "y": 137
      },
      "sourceHandle": {
        "x": 221,
        "y": 81,
        "moveable": true
      },
      "targetHandle": {
        "x": 132,
        "y": 121,
        "moveable": true
      }
    }
  }
]

const testStyle = {
  ".element": {
    "position": "absolute",
    "background-color": "red",
    "height": "50px",
    "width": "50px"
  },
  ".primary": {
    "background-color": "white",
    "border-radius": "50%",
    "border": "3px solid black",
    "height": "100px",
    "width": "100px"
  },
  ".secondary": {
    "background-color": "white",
    "border": "3px solid black",
    "width": "80px"
  },
  ".tertiary": {
    "border-radius": "50%",
    "height": "25px",
    "width": "25px",
    "border": "1px solid black",
    "background-color": "white"
  },
  ".map": {
    "position": "relative",
    "height": "800px",
    "width": "450px",
    "background-color": "#ddd"
  }
}

/*
 * const baseStyle = {
 *   '.element': {
 *     position: 'absolute',
 *     height: '50px',
 *     width: '50px',
 *     'background-color': 'red',
 *   },
 *   '.map': {
 *     position: 'relative',
 *     height: '800px',
 *     width: '600px',
 *     'background-color': '#ddd',
 *   },
 * } */

export default {
  name: 'MapMaker',

  components: {
    CubicBezier,
    PrismEditor,
    UploadModal,
  },

  data() {
    return {
      bus: new Vue(),

      code: {
        css: '{}',
        html: '[]',
      },

      // Elements
      elems: {
        divs: testNodes,
        curves: testCurves,
      },

      // Element relations and styles
      elemMeta: {
        styles: testStyle,
      },

      errors: {
        css: false,
        html: false,
      },

      connecting: false,

      selection: {
        elems: [],
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

  provide() {
    return {
      bus: this.bus,
    }
  },

  computed: {
    connectButtonVariant() {
      if (this.connecting) {
        return 'success'
      }
      else {
        return 'secondary'
      }
    },

    curveHandles() {
      if (this.selection.elems.length !== 1) {
        return
      }

      const curve = this._getSelectedCurve()

      if (curve) {
        return [
          {
            name: 'sourceHandle',
            x: curve.points.sourceHandle.x,
            y: curve.points.sourceHandle.y,
          },
          {
            name: 'targetHandle',
            x: curve.points.targetHandle.x,
            y: curve.points.targetHandle.y,
          },
        ]
      }
      else {
        return null
      }
    },

    mapStyle() {
      return this.elemMeta.styles['.map'] || {}
    },

    nodeKinds() {
      const stylesToId = {}
      for (const div of this.elems.divs) {
        const classes = [...div.classes].sort().join(',')
        if (Object.prototype.hasOwnProperty.call(stylesToId, classes)) {
          continue
        }
        else {
          stylesToId[classes] = div.id
        }
      }
      return Object.values(stylesToId)
    },

    styledDivs() {
      const output = this
        .elems
        .divs
        .map(div => {
          const copy = util.deepcopy(div)

          const baseStyle = this.elemMeta.styles['.element'] || {}
          const classStyles = div
            .classes
            .map(cls => this.elemMeta.styles['.' + cls])
            .filter(style => style !== undefined)

          copy.renderStyle = Object.assign({}, baseStyle, ...classStyles, div.style)

          return copy
        })

      return output
    },

    svgHeight() {
      const mapStyle = this.elemMeta.styles['.map']
      return this.parsePx(mapStyle.height)
    },

    svgWidth() {
      const mapStyle = this.elemMeta.styles['.map']
      return this.parsePx(mapStyle.width)
    },
  },

  methods: {

    ////////////////////////////////////////////////////////////////////////////////
    // Save and Load

    exportData() {
      const data = JSON.stringify({
        elems: this.elems,
        elemMeta: this.elemMeta
      }, null, 2)

      const blob = new Blob([data], { type: "text/plain;charset=utf-8" })

      saveAs(blob, 'map.json')
    },

    loadData(text) {
      const data = JSON.parse(text)
      this.elems = data.elems
      this.elemMeta = data.elemMeta
      this.updateDivEditorFromData()
      this.updateCssEditorFromData()
    },

    showLoadModal() {
      this.$bvModal.show('upload-modal')
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
        this.elemMeta.styles = JSON.parse(this.code.css)
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

    makeId(prefix) {
      while (true) { // eslint-disable-line no-constant-condition
        const newId = prefix + this.nextId
        this.nextId += 1

        const elemIdUsed = Object
          .values(this.elems)
          .some(array => array.some(elem => elem.id === newId))


        if (elemIdUsed) {
          continue
        }
        else {
          return newId
        }
      }
    },


    ////////////////////////////////////////////////////////////////////////////////
    // Div rendering


    add() {
      this.makeDiv()
      this.updateDivEditorFromData()
    },

    addKind(kind) {
      const original = this.elems.divs.find(div => div.id === kind)
      const newDiv = this.makeDiv()
      newDiv.classes = [...original.classes]
      this.updateDivEditorFromData()
    },

    makeDiv() {
      const div = {
        id: this.makeId('node'),
        classes: ['element'],
        style: {
          left: '20px',
          top: '100px',
        }
      }
      this.elems.divs.push(div)
      return div
    },

    updateDivFromElem(div, elem) {
      div.style.top = elem.offsetTop + 'px'
      div.style.left = elem.offsetLeft + 'px'
    },


    ////////////////////////////////////////////////////////////////////////////////
    // Connect

    startConnecting() {
      this.unselectAll()
      this.connecting = true
    },

    stopConnecting() {
      this.connecting = false
    },

    connect(source, target) {
      util.assert(this.connecting)

      if (this._isElemsConnected(source, target)) {
        return
      }

      const curve = this.newCurve(source.id, target.id)
      this.elems.curves.push(curve)
      this.updateCurves()
    },

    newCurve(sourceId, targetId) {
      return {
        id: this.makeId('curve'),
        ids: {
          source: sourceId,
          target: targetId,
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
      for (const curve of this.elems.curves) {
        const sourceHandleOffset = {
          x: curve.points.sourceHandle.x - curve.points.source.x,
          y: curve.points.sourceHandle.y - curve.points.source.y,
        }
        const targetHandleOffset = {
          x: curve.points.targetHandle.x - curve.points.target.x,
          y: curve.points.targetHandle.y - curve.points.target.y,
        }

        const newSourcePoint = this.curveEndpoint(curve, 'source')
        const newTargetPoint = this.curveEndpoint(curve, 'target')

        curve.points.source = newSourcePoint
        curve.points.target = newTargetPoint
        curve.points.sourceHandle = this.addPoints(curve.points.source, sourceHandleOffset)
        curve.points.targetHandle = this.addPoints(curve.points.target, targetHandleOffset)

        curve.points.sourceHandle.moveable = true
        curve.points.targetHandle.moveable = true
      }
    },

    curveEndpoint(curve, kind) {
      const div = this.styledDivs.find(div => div.id === curve.ids[kind])
      return this.divCenter(div)
    },

    divCenter(div) {
      const x = this.parsePx(div.renderStyle.left)
              + Math.floor(this.parsePx(div.renderStyle.width) / 2)

      const y = this.parsePx(div.renderStyle.top)
              + Math.floor(this.parsePx(div.renderStyle.height) / 2)

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
      if (this._isDraggable(event.target)) {
        this.dragging = {
          elem: event.target,
          mouseX: event.clientX,
          mouseY: event.clientY,
          top: event.target.offsetTop,
          left: event.target.offsetLeft,
        }
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


    ////////////////////////////////////////////////////////////////////////////////
    // Special Map Interaction Handlers

    select(element) {
      this.selection.elems.push(element)
    },

    unselectAll() {
      this.selection.elems = []
      this.stopConnecting()
      this.stopDrag()
    },

    _getSelectedCurve() {
      if (this.selection.elems.length !== 1) {
        return null
      }

      const elem = this.selection.elems[0]
      return this.elems.curves.find(c => c.id === elem.id)
    },

    _isConnectable(elem) {
      return Boolean(elem.getAttribute('can-connect'))
    },

    _isDraggable(elem) {
      return Boolean(elem.getAttribute('can-drag'))
    },

    _isElemsConnected(a, b) {
      return this.elems.curves.some(c => (
        c.ids.source === a.id && c.ids.target === b.id
        || c.ids.source === b.id && c.ids.target === a.id
      ))
    },

    _isElementCurveHandle(elem) {
      return elem.classList.contains('curve-handle')
    },

    _isSelectable(elem) {
      return Boolean(elem.getAttribute('can-select'))
    },

    _catchAllClicksOnMap() {
      const mapRender = this.$refs.mapRender

      mapRender.addEventListener('mousedown', (event) => {
        if (this._isSelectable(event.target)) {

          // When in connection mode, select elements until two have been selected.
          if (this.connecting) {
            if (this._isConnectable(event.target)) {

              this.select(event.target)
              if (this.selection.elems.length === 2) {
                this.connect(...this.selection.elems)
                this.unselectAll()
              }

            }
          }

          // Click on a curve handle does not select it.
          else if (this._isElementCurveHandle(event.target)) {
            this.startDrag(event)
          }

          // Click on an element changes the selection to the newly clicked element.
          else {
            this.unselectAll()
            this.select(event.target)
            this.startDrag(event)
          }
        }
      })

      mapRender.addEventListener('mouseleave', () => {
        this.unselectAll()
      })

      mapRender.addEventListener('mousemove', (event) => {
        this.drag(event)
      })

      mapRender.addEventListener('mouseup', () => {
        this.stopDrag()
      })
    },

    _catchAllKeypresses() {
      window.addEventListener('keydown', (e) => {

        if (e.key === 'Escape') {
          this.bus.$emit('clear-selection')
          this.unselectAll()
        }

      })
    }
  },

  ////////////////////////////////////////////////////////////////////////////////
  // Lifecycle

  mounted() {
    this.updateDivEditorFromData()
    this.updateCssEditorFromData()
    this.updateCurves()

    this._catchAllKeypresses()
    this._catchAllClicksOnMap()
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
