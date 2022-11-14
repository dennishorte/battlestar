<template>
  <div class="file-manager">
    <template v-if="fileStructure">

      <div class="menu">
        <Dropdown :notitle="true">
          <DropdownItem><button @click="newFile">New File</button></DropdownItem>
          <DropdownItem><button @click="duplicate">Duplicate</button></DropdownItem>
          <DropdownItem><button @click="edit">Edit</button></DropdownItem>
          <DropdownItem><button @click="move">Move</button></DropdownItem>
          <DropdownDivider />
          <DropdownItem><button @click="delete">Delete</button></DropdownItem>
        </Dropdown>
      </div>


      <Folder :content="fileStructure" :meta="meta" />
    </template>

    <div v-else class="alert alert-danger">Missing File Structure</div>
  </div>
</template>


<script>
import mitt from 'mitt'

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
    handleClick(event) {
      const oldValue = this.meta.selection
      this.meta.selection = event

      this.$emit('selection-changed', {
        oldValue: oldValue,
        newValue: this.meta.selection
      })
    },

    newFile() {

    },
  },

  mounted() {
    this.bus.on('click', this.handleClick)
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
