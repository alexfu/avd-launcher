import * as child_process from 'child_process'
import AVDLaunchOptions from './avdlaunchoptions'

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

  launch(name: string, options?: AVDLaunchOptions) {
    const args = ['-avd', name].concat(serializeLaunchOptions(options))
    child_process
      .spawn(emulatorCmd(), args, {detached: true, stdio: 'ignore'})
      .unref()
  }
}
