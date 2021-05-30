import {Command, flags} from '@oclif/command'
import AVDManager from '../avdmanager'
import AVDLaunchOptions from '../avdlaunchoptions'
import * as inquirer from 'inquirer'

function getRandomAVDs(avds: string[]): string[] {
  const randomIndex = Math.floor(Math.random() * avds.length)
  return [avds[randomIndex]]
}

async function getUserSelectedAVDs(avds: string[]): Promise<string[]> {
  const answer = await inquirer.prompt([selectDevicesQuestion(avds)])
  return answer.avds
}

function createLaunchOptions(flags: {cold: boolean}): AVDLaunchOptions {
  return {
    noSnapshotLoad: flags.cold,
  }
}

function selectDevicesQuestion(avds: string[]) {
  return {
    type: 'checkbox',
    name: 'avds',
    message: 'Select a device',
    choices: avds,
  }
}

export default class Launch extends Command {
  static description = 'Launch an Android Virtual Device.'

  static flags = {
    cold: flags.boolean({char: 'c', description: 'Performs a cold boot and saves the emulator state on exit.'}),
    random: flags.boolean({char: 'r', description: 'Launches a random AVD.'}),
    version: flags.version({char: 'v'}),
    help: flags.help({char: 'h'}),
  }

  async run() {
    // Handle built-in flags
    const {flags} = this.parse(Launch)

    const avdManager = new AVDManager()
    const availableAvds = await avdManager.getAll()

    let avdsToLaunch: string[]
    if (flags.random) {
      avdsToLaunch = getRandomAVDs(availableAvds)
    } else {
      avdsToLaunch = await getUserSelectedAVDs(availableAvds)
    }

    avdsToLaunch.forEach(avd => {
      process.stdout.write(`Launching ${avd}...`)
      avdManager.launch(avd, createLaunchOptions(flags))
      process.stdout.write('done.\n')
    })
  }
}
