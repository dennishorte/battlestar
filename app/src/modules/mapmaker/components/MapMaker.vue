<template>
  <div class="container-fluid map-maker">
    <Toolbar
      :nodeKinds="nodeKinds"
      @tool-add="addKind"
      @tool-connect="startConnecting"
      @tool-cut="startCutting"
      @tool-export="exportData"
      @tool-load="showLoadModal"
      @tool-transform="applyTransform"
    />

    <div class="row">
      <div class="col editors-col">
        <div class="d-grid">
          <button class="btn btn-secondary" data-bs-toggle="offcanvas" data-bs-target="#toolbar">toolbar</button>
        </div>

        <div class="editor-div">
          <PrismEditor
            class="editor"
            v-model="code.html"
            :highlight="htmlHighlight"
            @input="htmlChanged"
          />

          <div v-if="errors.html" class="error-mark">!</div>
        </div>

        <div class="editor-div">
          <PrismEditor
            class="editor"
            v-model="code.css"
            :highlight="cssHighlight"
            @input="cssChanged"
          />
          <div v-if="errors.css" class="error-mark">!</div>
        </div>
      </div>

      <div class="col map-render" ref="mapRender">

        <div class="map" :style="mapStyle">
          <CurveLayer :curves="elems.curves" :height="svgHeight" :width="svgWidth" />
          <DivLayer :styledDivs="styledDivs" />
          <HandleLayer :curveHandles="curveHandles" />
        </div>


      </div>
    </div>

    <UploadModal @file-ready="loadData" />
  </div>

</template>


<script>
import { util } from 'battlestar-common'
import { saveAs } from 'file-saver'

// import Prism Editor
import { PrismEditor } from 'vue-prism-editor'
import 'vue-prism-editor/dist/prismeditor.min.css'

// import highlighting library (you can use any library you want just return html string)
import { highlight, languages } from 'prismjs/components/prism-core'
import 'prismjs/components/prism-json'
import 'prismjs/themes/prism-tomorrow.css'

import CurveLayer from './CurveLayer'
import DivLayer from './DivLayer'
import HandleLayer from './HandleLayer'
import Toolbar from './Toolbar'
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
      "left": "166px",
      "top": "192px"
    }
  }
]

/* const testCurves = [
 *   {
 *     "id": "curve100",
 *     "ids": {
 *       "source": "node103",
 *       "target": "node115"
 *     },
 *     "points": {
 *       "source": {
 *         "x": 121,
 *         "y": 81
 *       },
 *       "target": {
 *         "x": 112,
 *         "y": 137
 *       },
 *       "sourceHandle": {
 *         "x": 221,
 *         "y": 81,
 *         "moveable": true
 *       },
 *       "targetHandle": {
 *         "x": 132,
 *         "y": 121,
 *         "moveable": true
 *       }
 *     }
 *   }
 * ] */

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
    CurveLayer,
    DivLayer,
    HandleLayer,
    PrismEditor,
    Toolbar,
    UploadModal,
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
        styles: testStyle,
      },

      errors: {
        css: false,
        html: false,
      },

      connecting: false,
      cutting: false,

      selection: {
        elems: [],
      },

      dragging: {
        elem: null,
        mouseX: null,
        mouseY: null,
        top: null,
        left: null,
        didDrag: false,
      },

      nextId: 100,
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

    cutButtonVariant() {
      if (this.cutting) {
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

      const elem = this.selection.elems[0]
      const curve = this.elems.curves.find(c => c.id === elem.id)

      if (curve) {
        return [
          {
            curveId: curve.id,
            name: 'sourceHandle',
            x: curve.points.sourceHandle.x,
            y: curve.points.sourceHandle.y,
          },
          {
            curveId: curve.id,
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
      return ['base'].concat(Object.values(stylesToId).sort())
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
      this.$modal('upload-modal').show()
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
        this.updateCurves()
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

    applyTransform(params) {
      this._scale(params.scale.x, params.scale.y)
      this._translate(params.translate.x, params.translate.y)

      this.updateDivEditorFromData()
      this.updateCssEditorFromData()
    },

    _transform(x, y, kind, fn) {
      return (dict, key, value) => {
        let pxValue = false

        if (typeof value === 'string') {
          pxValue = true
          value = this.parsePx(value)
        }

        let newValue

        const xFields = ['left', 'x']
        const yFields = ['top', 'y']

        if (kind === 'scale') {
          xFields.push('width')
          yFields.push('height')
        }

        if (xFields.includes(key)) {
          newValue = fn(value, x)
        }
        else if (yFields.includes(key)) {
          newValue = fn(value, y)
        }

        if (newValue) {
          newValue = Math.round(newValue)
          dict[key] = pxValue ? newValue + 'px' : newValue
        }
      }
    },

    _transformAll(x, y, kind, fn) {
      const scale = this._transform(x, y, kind, fn)

      // Divs
      for (const div of this.elems.divs) {
        for (const [key, value] of Object.entries(div.style)) {
          scale(div.style, key, value)
        }
      }

      // Curves
      for (const curve of this.elems.curves) {
        const points = Object.values(curve.points)
        for(const point of points) {
          for (const [key, value] of Object.entries(point)) {
            scale(point, key, value)
          }
        }
      }

      // Styles
      for (const style of Object.values(this.elemMeta.styles)) {
        for (const [key, value] of Object.entries(style)) {
          scale(style, key, value)
        }
      }
    },

    _scale(x, y) {
      return this._transformAll(x, y, 'scale', (a, b) => a * b)
    },

    _translate(x, y) {
      return this._transformAll(x, y, 'translate', (a, b) => a + b)
    },

    makeId(prefix) {
      while (true) {
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

    showTransformMenu() {
      this.$modal('transform-modal').show()
    },


    ////////////////////////////////////////////////////////////////////////////////
    // Div rendering


    addKind(kind) {
      if (kind === 'base') {
        this.makeDiv()
        this.updateDivEditorFromData()
      }

      else {
        const original = this.elems.divs.find(div => div.id === kind)
        const newDiv = this.makeDiv()
        newDiv.classes = [...original.classes]
        this.updateDivEditorFromData()
      }
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

    startCutting() {
      this.unselectAll()
      this.cutting = true
    },

    stopCutting() {
      this.cutting = false
    },

    cut(a, b) {
      util.assert(this.cutting)

      const curve = this._getCurveBetween(a, b)
      if (!curve) {
        return
      }

      util.array.remove(this.elems.curves, curve)
    },

    connect(source, target) {
      util.assert(this.connecting)

      if (this._isElemsConnected(source, target)) {
        return
      }

      const curve = this.newCurve(source, target)
      this.elems.curves.push(curve)
      this.updateCurves()
    },

    newCurve(sourceElem, targetElem) {
      const sourceDiv = this.styledDivs.find(d => d.id === sourceElem.id)
      const targetDiv = this.styledDivs.find(d => d.id === targetElem.id)

      const newSourcePoint = this.divCenter(sourceDiv)
      const newTargetPoint = this.divCenter(targetDiv)

      const newSourceHandlePoint = {
        x: newSourcePoint.x + (newTargetPoint.x - newSourcePoint.x) / 3,
        y: newTargetPoint.y,
      }

      const newTargetHandlePoint = {
        x: newSourcePoint.x + (newTargetPoint.x - newSourcePoint.x) / 3 * 2,
        y: newSourcePoint.y,
      }

      return {
        id: this.makeId('curve'),
        ids: {
          source: sourceDiv.id,
          target: targetDiv.id,
        },
        points: {
          source: newSourcePoint,
          target: newTargetPoint,
          sourceHandle: newSourceHandlePoint,
          targetHandle: newTargetHandlePoint,
        },
      }
    },

    updateCurveFromHandle(elem) {
      const curveId = elem.getAttribute('curve-id')
      const curve = this.elems.curves.find(c => c.id === curveId)
      util.assert(curve)

      const handleName = elem.getAttribute('name')
      const point = curve.points[handleName]
      point.x = elem.offsetLeft
      point.y = elem.offsetTop
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
        this.dragging.didDrag = true

        const distX = event.clientX - this.dragging.mouseX
        const distY = event.clientY - this.dragging.mouseY

        const newTop = this.dragging.top + distY + 'px'
        const newLeft = this.dragging.left + distX + 'px'

        this.dragging.elem.style.top = newTop
        this.dragging.elem.style.left = newLeft

        const div = this._getDivFromElem(this.dragging.elem)
        if (div) {
          this.updateDivFromElem(div, this.dragging.elem)
          this.updateDivEditorFromData()
          this.updateCurves()
          return
        }

        const handle = this._getHandleFromElem(this.dragging.elem)
        if (handle) {
          this.updateCurveFromHandle(handle)
          return
        }
      }
    },

    startDrag(event) {
      util.assert(this._isDraggable(event.target), "Event target is not draggable")

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

    select(elem) {
      const selectable = elem.closest('.can-select')

      if (selectable) {
        this.selection.elems.push(selectable)
        elem.classList.add('selected')
      }
    },

    unselectAll() {
      this.selection.elems.forEach(e => e.classList.remove('selected'))
      this.selection.elems = []
      this.stopConnecting()
      this.stopCutting()
      this.stopDrag()
    },

    _getCurveBetween(a, b) {
      return this.elems.curves.find(c => (
        c.ids.source === a.id && c.ids.target === b.id
        || c.ids.source === b.id && c.ids.target === a.id
      ))
    },

    _getDivFromElem(elem) {
      return this.elems.divs.find(div => div.id === elem.id)
    },

    _getHandleFromElem(elem) {
      if (elem.classList.contains('curve-handle')) {
        return elem
      }
      else {
        return null
      }
    },

    _isConnectable(elem) {
      return Boolean(elem.classList.contains('can-connect'))
    },

    _isDraggable(elem) {
      return Boolean(elem.classList.contains('can-drag'))
    },

    _isElemsConnected(a, b) {
      return Boolean(this._getCurveBetween(a, b))
    },

    _isElementCurveHandle(elem) {
      return elem.classList.contains('curve-handle')
    },

    _isSelectable(elem) {
      return Boolean(elem.classList.contains('can-select'))
    },

    _catchAllClicksOnMap() {
      const mapRender = this.$refs.mapRender

      mapRender.addEventListener('mousedown', (event) => {
        if (this._isDraggable(event.target)) {
          console.log(event.target.id)
          this.startDrag(event)
        }
      })

      mapRender.addEventListener('mouseleave', () => {
        this.unselectAll()
      })

      mapRender.addEventListener('mousemove', (event) => {
        this.drag(event)
      })

      mapRender.addEventListener('mouseup', () => {
        if (this.dragging.didDrag) {
          // Do nothing special.
        }

        else if (this.connecting || this.cutting) {
          if (this._isConnectable(event.target)) {
            this.select(event.target)
            if (this.selection.elems.length === 2) {

              if (this.connecting) {
                this.connect(...this.selection.elems)
              }
              else if (this.cutting) {
                this.cut(...this.selection.elems)
              }
              else {
                throw new Error('How did we get here?')
              }

              this.unselectAll()
            }
          }
        }

        else {
          this.unselectAll()
          this.select(event.target)
        }

        // Always turn off drag on mouseup.
        this.stopDrag()
      })
    },
  },

  ////////////////////////////////////////////////////////////////////////////////
  // Lifecycle

  mounted() {
    this.updateDivEditorFromData()
    this.updateCssEditorFromData()
    this.updateCurves()

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
  position: relative;
  height: 45%;
  margin-top: 5px;
}

.map-render {
  height: 100vh;
}

.error-mark {
  color: white;
  background-color: red;
  font-weight: bold;
  border: 2px solid white;
  border-radius: 50%;
  position: absolute;
  top: 0;
  right: 0;
  height: 1.7em;
  width: 1.7em;
  text-align: center;
}
</style>
