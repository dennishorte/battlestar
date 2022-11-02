<template>
  <div class="editor">
    <PrismEditor
      v-model="code"
      :highlight="highlighter"
    />
  </div>
</template>


<script>
import { PrismEditor } from 'vue-prism-editor'
import 'vue-prism-editor/dist/prismeditor.min.css'

// import highlighting library (you can use any library you want just return html string)
import { highlight, languages } from 'prismjs/components/prism-core'
import 'prismjs/components/prism-json'
import 'prismjs/themes/prism-tomorrow.css'

export default {
  name: 'CardMarkup',

  components: {
    PrismEditor
  },

  props: {
    code: String
  },

  methods: {
    highlighter(code) {
      return highlight(code, languages.json)
    },
  }
}
</script>


<style scoped>
.editor {
  background: #5d5d5d;
  padding: 4px;

  /* you must provide font-family font-size line-height. Example: */
  font-family: Fira code, Fira Mono, Consolas, Menlo, Courier, monospace;
  font-size: 14px;
  line-height: 1.5;
  max-width: 400px;
}
</style>
