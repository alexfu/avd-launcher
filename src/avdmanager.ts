import * as child_process from 'child_process'
import AVDLaunchOptions from './avdlaunchoptions'
import * as fs from 'fs'
import * as os from 'os'
import * as path from 'path'

function emulatorCmd(args?: string): string {
  if (args) {
    return `${process.env.ANDROID_HOME}/emulator/emulator ${args}`
  }

  return `${process.env.ANDROID_HOME}/emulator/emulator`
}

function serializeLaunchOptions(options?: AVDLaunchOptions): string[] {
  const serializedOptions: string[] = []

  if (options?.noSnapshotLoad) {
    serializedOptions.push('-no-snapshot-load')
  }

  return serializedOptions
}

function parseListAVDs(stdout: string): string[] {
  return stdout.trim().split('\n')
}

async function getFileStream(path: string): Promise<fs.WriteStream> {
  return new Promise(resolve => {
    const stream = fs.createWriteStream(path)
    stream.on('open', () => {
      resolve(stream)
    })
  })
}

async function getAVDLogFile(name: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const logDir = path.join(os.tmpdir(), 'avd')
    fs.mkdir(logDir, {recursive: true}, error => {
      if (error) {
        reject(error)
      } else {
        const logPath = path.join(logDir, `${name}.log`)
        resolve(logPath)
      }
    })
  })
}

export default class AVDManager {
  async getAll(): Promise<string[]> {
    return new Promise((resolve, reject) => {
      child_process.exec(emulatorCmd('-list-avds'), (error, stdout, stderr) => {
        if (error) {
          reject(error)
          return
        }

        if (stderr) {
          reject(stderr)
          return
        }

        resolve(parseListAVDs(stdout))
      })
    })
  }

  async launch(name: string, options?: AVDLaunchOptions) {
    const args = ['-avd', name].concat(serializeLaunchOptions(options))

    let stdio: child_process.StdioOptions
    try {
      const logFile = await getAVDLogFile(name)
      const stream = await getFileStream(logFile)
      console.log(`Writing logs to ${logFile}`)
      stdio = ['ignore', stream, stream]
    } catch {
      stdio = 'ignore'
    }

    child_process
      .spawn(emulatorCmd(), args, {detached: true, stdio: stdio})
      .unref()
  }
}
