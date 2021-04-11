import * as child_process from 'child_process'

function emulatorCmd(args?: string): string {
  if (args) {
    return `${process.env.ANDROID_HOME}/emulator/emulator ${args}`
  }

  return `${process.env.ANDROID_HOME}/emulator/emulator`
}

class AVDManager {
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

        resolve(this.parseListAVDs(stdout))
      })
    })
  }

  launch(name: string) {
    child_process
      .spawn(emulatorCmd(), ['-avd', name], {detached: true, stdio: 'ignore'})
      .unref()
  }

  private parseListAVDs(stdout: string): string[] {
    return stdout.trim().split('\n')
  }
}

export default AVDManager
