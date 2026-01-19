import util from '../../lib/util.js'

interface SerializerData {
  [key: string]: unknown
}

class Serializer {
  parent: Record<string, unknown>
  data: SerializerData

  constructor(parent: Record<string, unknown>, data: SerializerData) {
    this.parent = parent
    this.data = data
  }

  inject(): void {
    Object.assign(this.parent, this.data)
  }

  serialize(): SerializerData {
    const output: SerializerData = {}
    for (const key of Object.keys(this.data)) {
      output[key] = this.parent[key]
    }
    return util.deepcopy(output)
  }
}

export { Serializer }
export type { SerializerData }
