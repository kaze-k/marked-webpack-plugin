import ejs from "ejs"
import format from "html-format"
import fs, { PathOrFileDescriptor } from "fs"
import path from "path"
import { Compiler } from "webpack"
import { marked } from "marked"

const TITLE = "change log"
const TEMPLATE: string = path.resolve(__dirname, "./template.html")

interface Options {
  input: PathOrFileDescriptor
  output: string
  title?: string
  template?: PathOrFileDescriptor
}

interface Opts {
  title: string
  content: string
}

class MarkedWebpackPlugin {
  private static options: Opts
  private input: PathOrFileDescriptor
  private output: string
  private template: PathOrFileDescriptor

  constructor(options: Options) {
    MarkedWebpackPlugin.options = {
      title: typeof options.title !== "undefined" ? options.title : TITLE,
      content: "",
    }

    this.input = options.input
    this.output = options.output

    if (typeof options.template !== "undefined") {
      this.template = options.template
    } else {
      this.template = TEMPLATE
    }
  }

  private readFile(filePath: PathOrFileDescriptor): Promise<string> {
    return new Promise((resolve: (value: string) => void, reject: (reason?: Error) => void): void => {
      fs.readFile(filePath, { encoding: "utf8", flag: "r" }, (error: Error | null, data: string): void => {
        if (error) {
          reject(error)
        }

        if (typeof data !== "undefined") {
          resolve(data.toString())
        }
      })
    })
  }

  private async writeFile(compiler: Compiler): Promise<void> {
    const content: string = await this.readFile(this.input)
    const template: string = await this.readFile(this.template)

    MarkedWebpackPlugin.options.content = marked.parse(content)

    const html: string = ejs.render(template, { markedWebpackPlugin: MarkedWebpackPlugin })

    const output: string = path.join(compiler.outputPath, this.output)

    return new Promise((resolve: (value: void | PromiseLike<void>) => void, reject: (reason?: Error) => void) => {
      fs.writeFile(output, format(html), { encoding: "utf8", flag: "w" }, (error: Error | null) => {
        if (error) {
          reject(error)
        }

        resolve()
      })
    })
  }

  public apply(compiler: Compiler): void {
    compiler.hooks.emit.tap("marked-webpack-plugin", (): void => {
      try {
        this.writeFile(compiler)
      } catch (err) {
        console.log(err)
        throw err
      }
    })
  }
}

export default MarkedWebpackPlugin
