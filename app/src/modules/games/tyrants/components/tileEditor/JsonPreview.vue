<template>
  <div class="json-preview">
    <div class="header">
      <h4>Code Output</h4>
      <button class="copy-btn" @click="copyToClipboard" :disabled="copied">
        {{ copied ? 'Copied!' : 'Copy' }}
      </button>
    </div>

    <pre class="code-output"><code>{{ generatedCode }}</code></pre>
  </div>
</template>


<script>
export default {
  name: 'JsonPreview',

  props: {
    tile: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      copied: false,
    }
  },

  computed: {
    generatedCode() {
      const t = this.tile
      const lines = []

      lines.push(`const ${t.id} = {`)
      lines.push(`  id: '${t.id}',`)
      lines.push(`  category: '${t.category}',`)
      lines.push(`  region: '${this.escapeString(t.region)}',`)
      lines.push('')
      lines.push('  locations: [')

      for (const loc of t.locations) {
        lines.push(`    ${this.formatLocation(loc)},`)
      }

      lines.push('  ],')
      lines.push('')
      lines.push('  paths: [')

      for (const path of t.paths) {
        lines.push(`    ['${path[0]}', '${path[1]}'],`)
      }

      lines.push('  ],')
      lines.push('')
      lines.push('  edgeConnections: [')

      for (const edge of t.edgeConnections) {
        lines.push(`    { edge: '${edge.edge}', location: '${edge.location}' },`)
      }

      lines.push('  ],')
      lines.push('')

      if (t.specialRules) {
        lines.push(`  specialRules: ${JSON.stringify(t.specialRules, null, 2).split('\n').map((l, i) => i === 0 ? l : '  ' + l).join('\n')},`)
      }
      else {
        lines.push('  specialRules: null,')
      }

      lines.push('}')

      return lines.join('\n')
    },
  },

  methods: {
    escapeString(str) {
      return str.replace(/'/g, "\\'")
    },

    formatLocation(loc) {
      const pos = loc.position || { x: 0.5, y: 0.5 }
      const posStr = `{ x: ${pos.x.toFixed(2)}, y: ${pos.y.toFixed(2)} }`

      // Tunnel
      if (loc.points === 0) {
        return `tunnel('${loc.short}', ${posStr})`
      }

      // Major Site
      if (loc.control && loc.control.influence > 0) {
        return `majorSite('${loc.short}', '${this.escapeString(loc.name)}', ${loc.size}, ${loc.neutrals}, ${loc.points}, ${loc.start}, ${posStr}, ${loc.control.influence}, ${loc.control.points})`
      }

      // Site
      return `site('${loc.short}', '${this.escapeString(loc.name)}', ${loc.size}, ${loc.neutrals}, ${loc.points}, ${loc.start}, ${posStr})`
    },

    async copyToClipboard() {
      try {
        await navigator.clipboard.writeText(this.generatedCode)
        this.copied = true
        setTimeout(() => {
          this.copied = false
        }, 2000)
      }
      catch (err) {
        console.error('Failed to copy:', err)
        alert('Failed to copy to clipboard')
      }
    },
  },
}
</script>


<style scoped>
.json-preview {
  background: #1a1a1a;
  border-radius: 8px;
  overflow: hidden;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75em 1em;
  background: #252525;
  border-bottom: 1px solid #333;
}

.header h4 {
  margin: 0;
  color: #d4a574;
}

.copy-btn {
  padding: 0.3em 0.7em;
  background: #4a90d9;
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
  font-size: 0.85em;
}

.copy-btn:hover:not(:disabled) {
  background: #5aa0e9;
}

.copy-btn:disabled {
  background: #3a6b35;
  cursor: default;
}

.code-output {
  margin: 0;
  padding: 1em;
  overflow-x: auto;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.8em;
  line-height: 1.4;
  color: #b5cea8;
  max-height: 400px;
  overflow-y: auto;
}

.code-output code {
  white-space: pre;
}
</style>
