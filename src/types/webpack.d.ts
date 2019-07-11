import * as webpack from 'webpack'

declare module 'webpack' {
  namespace compilation {
    interface Asset {
      size(): number
      source(): string
    }

    interface ChunkHash {
      digest(): string
    }

    interface Compilation {
      addChunk(name: string): webpack.compilation.Chunk
    }
  }

  class RawModule extends webpack.compilation.Module {
    constructor(source: string, identifier: string, readableIdentifier?: string)
    buildInfo: object
    buildMeta: object
    hash: string
  }

  interface Compiler {
    createCompilation(): webpack.compilation.Compilation

    emitAssets(
      compilation: webpack.compilation.Compilation,
      callback: Function
    ): void
  }
}
