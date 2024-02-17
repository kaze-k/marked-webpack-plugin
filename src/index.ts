import ejs from "ejs"
import format from "html-format"
import fs, { PathOrFileDescriptor } from "fs"
import path from "path"
import { Compiler } from "webpack"
import { marked } from "marked"

const TITLE = "change log"
const TEMPLATE = path.resolve(__dirname, "./template.html")

interface Options {
  input: PathOrFileDescriptor
  output: PathOrFileDescriptor
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
  private output: PathOrFileDescriptor
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
    return new Promise((resolve: (value: string) => void, reject: (reason?: Error) => void) => {
      fs.readFile(filePath, { encoding: "utf8", flag: "r" }, (error: Error | null, data: string) => {
        if (error) {
          reject(error)
        }

        if (typeof data !== "undefined") {
          resolve(data.toString())
        }
      })
    })
  }

  private async writeFile(): Promise<void> {
    const content = await this.readFile(this.input)
    const template = await this.readFile(this.template)

    MarkedWebpackPlugin.options.content = marked.parse(content)

    const html = ejs.render(template, { markedWebpackPlugin: MarkedWebpackPlugin })

    return new Promise((resolve: (value: void | PromiseLike<void>) => void, reject: (reason?: Error) => void) => {
      fs.writeFile(this.output, format(html), { encoding: "utf8", flag: "w" }, (error: Error | null) => {
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
        this.writeFile()
      } catch (err) {
        console.log(err)
        throw err
      }
    })
  }
}

export default MarkedWebpackPlugin
