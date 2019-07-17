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

  interface Compiler {
    createCompilation(): webpack.compilation.Compilation

    emitAssets(compilation: webpack.compilation.Compilation, callback: Function): void
  }
}
