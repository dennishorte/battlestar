<template>
  <div class="file-manager">
    <template v-if="fileStructure">

      <div class="menu">
        <Dropdown :notitle="true">
          <DropdownItem><button @click="newFile">New File</button></DropdownItem>
          <DropdownItem><button @click="duplicate" :disabled="!fileSelected">Duplicate</button></DropdownItem>
          <DropdownItem><button @click="edit" :disabled="!fileSelected">Edit</button></DropdownItem>
          <DropdownItem><button @click="move" :disabled="!fileSelected">Move</button></DropdownItem>
          <DropdownDivider />
          <DropdownItem><button @click="delete" :disabled="!fileSelected">Delete</button></DropdownItem>
        </Dropdown>
      </div>


      <Folder :content="fileStructure" :meta="meta" />
    </template>

    <div v-else class="alert alert-danger">Missing File Structure</div>
  </div>
</template>


<script>
import mitt from 'mitt'

import { util } from 'battlestar-common'

import Dropdown from '@/components/Dropdown'
import DropdownItem from '@/components/DropdownItem'
import DropdownDivider from '@/components/DropdownDivider'
import Folder from './Folder'
import NewFileModal from './NewFileModal'

export default {
  name: 'FileManager',

  components: {
    Dropdown,
    DropdownItem,
    DropdownDivider,
    Folder,
    NewFileModal,
  },

  data() {
    return {
      bus: mitt(),

      meta: {
        selection: null,
      },
    }
  },

  provide() {
    return {
      bus: this.bus,
    }
  },

  props: {
    filelist: Array,
  },

  computed: {
    fileSelected() {
      return this.meta.selection && this.meta.selection.file
    },

    fileStructure() {
      if (!this.filelist) {
        return null
      }

      const hierarchy = {
        name: 'root',
        path: '/',
        folders: [],
        files: [],
      }

      let node
      for (const file of this.filelist) {
        node = hierarchy

        for (const elem of pathTokens(file.path)) {
          const folder = node.folders.find(f => f.name === elem)
          if (folder) {
            node = folder
            continue
          }
          else {
            const newFolder = {
              name: elem,
              path: node.path === '/' ? node.path + elem : node.path + '/' + elem,
              folders: [],
              files: [],
            }
            node.folders.push(newFolder)
            node = newFolder
            continue
          }
        }

        node.files.push(file)
      }

      return hierarchy
    },

  },

  methods: {
    duplicate() {
      if (!this.meta.selection || !this.meta.selection.file) {
        return
      }

      let preventDefault = false

      this.$emit('file-duplicating', {
        file: this.meta.selection.file,
        preventDefault: () => preventDefault = true,
      })

      if (preventDefault) {
        return
      }

      const duplicate = util.deepcopy(this.meta.selection.file)

      this.$emit('file-duplicated', {
        original: this.meta.selection.file,
        duplicate,
      })

      this.$emit('file-created', {
        file: duplicate,
      })
    },

    setSelection(fileOrFolder) {
      let preventDefault = false

      this.$emit('selection-changing', {
        oldValue: this.meta.selection,
        newValue: fileOrFolder,
        preventDefault: () => preventDefault = true,
      })

      if (preventDefault) {
        return
      }

      const oldValue = this.meta.selection
      this.meta.selection = fileOrFolder

      this.$emit('selection-changed', {
        oldValue: oldValue,
        newValue: this.meta.selection
      })
    },
  },

  mounted() {
    this.bus.on('click', this.setSelection)
  },
}



function pathTokens(path) {
  let tokens = path ? path.split('/') : []
  if (path.length > 0 && path[0].length === 0) {
    tokens = tokens.splice(0, 1)
  }

  return tokens.filter(t => Boolean(t))
}
</script>


<style scoped>
.menu {
  float: right;
}
</style>
