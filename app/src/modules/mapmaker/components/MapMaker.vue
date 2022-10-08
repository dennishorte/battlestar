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
            v-model="htmlCode"
            :highlight="htmlHighlight"
            @input="htmlChanged"
          />
        </div>

        <div class="editor-div">
          <PrismEditor class="editor" v-model="cssCode" :highlight="cssHighlight" />
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
            v-for="(div, index) in divs"
            :key="index"
            :style="divStyle(div)"
            :id="div.id"
            @mousedown="click"
            @mousemove="drag"
          >
          </div>

          <svg class="curves" height="800" width="600">
            <path
              v-for="(conn, index) in connections"
              :key="index"
              stroke="black"
              stroke-width="3"
              fill="none"
              :d="connectionD(conn)"
            />

            <path d="M 400 400 C 450 400 400 450 450 450" stroke="blue" stroke-width="3" fill="none" />

            <g stroke="black" stroke-width="3" fill="black">
              <circle id="pointA" cx="400" cy="400" r="3" />
              <circle id="pointB" cx="400" cy="450" r="3" />
              <circle id="pointC" cx="450" cy="400" r="3" />
              <circle id="pointD" cx="450" cy="450" r="3" />
            </g>

          </svg>

        </div>


      </b-col>
    </b-row>
  </b-container>
</template>


<script>

// import Prism Editor
import { PrismEditor } from 'vue-prism-editor';
import 'vue-prism-editor/dist/prismeditor.min.css'; // import the styles somewhere

// import highlighting library (you can use any library you want just return html string)
import { highlight, languages } from 'prismjs/components/prism-core';
//import 'prismjs/components/prism-css';
import 'prismjs/components/prism-json';
import 'prismjs/themes/prism-tomorrow.css'; // import syntax highlighting styles


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
    PrismEditor,
  },

  data() {
    return {
      cssCode: '',
      htmlCode: '[]',

      connections: testConnections,
      divs: testNodes,
      styles: baseStyle,

      nextId: 100,

      htmlError: false,

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
    }
  },

  computed: {
    mapStyle() {
      return this.styles['.map']
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

    updateStyleDisplay() {
      this.cssCode = JSON.stringify(this.styles, null, 2)
    },
    updateEditorFromDivs() {
      this.htmlCode = JSON.stringify(this.divs, null, 2)
    },


    ////////////////////////////////////////////////////////////////////////////////
    // Other

    click(event) {
      if (this.connecting.active) {
        console.log('click: connecting')
        this.connect(event)
      }
      else {
        console.log('click: drag')
        this.startDrag(event)
      }
    },

    htmlChanged() {
      try {
        this.divs = JSON.parse(this.htmlCode)
        this.htmlError = false
      }
      catch (e) {
        this.htmlError = true
      }
    },


    ////////////////////////////////////////////////////////////////////////////////
    // Div rendering


    add() {
      const id = 'node' + this.nextId
      this.nextId += 1

      this.divs.push({
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

      this.updateEditorFromDivs()
    },

    divStyle(div) {
      const baseStyle = this.styles['.element']
      const classStyles = div
        .classes
        .map(cls => this.styles[cls])
        .filter(style => style !== undefined)


      return Object.assign({}, baseStyle, ...classStyles, div.style)
    },


    ////////////////////////////////////////////////////////////////////////////////
    // Connect

    connect(event) {
      if (this.connecting.first) {
        this.connections.push({
          source: this.connecting.first.id(),
          target: event.target.id(),
        })
        this.connecting.active = false
        this.connecting.first = null
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

    connectionD(conn) {
      // M 400 400 C 450 400 400 450 450 450

      /* const source = document.getElementById(conn.source)
       * const target = document.getElementById(conn.target)

       * if (!source) {
       *   return
       * }
       */

      const source = this.divs.find(div => div.id === conn.source)
      const target = this.divs.find(div => div.id === conn.target)

      const s = this.divCenter(source)
      const t = this.divCenter(target)

      return `M ${s.x} ${s.y} C ${s.x + 100} ${s.y} ${t.x} ${t.y - 100} ${t.x} ${t.y}`
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

        const div = this.divs.find(div => div.id === this.dragging.elem.id)
        div.style.top = newTop
        div.style.left = newLeft

        this.updateEditorFromDivs()
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
    this.updateEditorFromDivs()
    this.updateStyleDisplay()
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
