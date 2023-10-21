import ora from "ora"
import logSymbols from "log-symbols"
import process from "child_process"
import fs from "fs"
import path from "path"

const useExec = () => {
  return new Promise((resolve, reject) => {
    process.exec("tsc", (err, stdout, stderr) => {
      if (err) {
        reject(err)
      }

      resolve({
        stdout,
        stderr,
      })
    })
  })
}

const useCopyFile = (src, dest) => {
  return new Promise((resolve, reject) => {
    fs.copyFile(src, dest, (err) => {
      if (err) {
        reject(err)
      }

      resolve()
    })
  })
}

const removeDir = (dir) => {
  const files = fs.readdirSync(dir)
  for (let i = 0; i < files.length; i++) {
    let newPath = path.join(dir, files[i])
    let stat = fs.statSync(newPath)
    if (stat.isDirectory()) {
      removeDir(newPath)
    } else {
      fs.unlinkSync(newPath)
    }
  }
  fs.rmdirSync(dir)
}

const main = async () => {
  const spinner = ora("编译中").start()

  if (fs.existsSync("./dist")) {
    removeDir("./dist")
  }

  try {
    await useExec()
    await useCopyFile("./src/template.html", "./dist/template.html")
    spinner.stop()
    console.log(logSymbols.success, "编译完成")
  } catch (err) {
    spinner.stop()
    console.log(logSymbols.error, err)
  }
}

main()
