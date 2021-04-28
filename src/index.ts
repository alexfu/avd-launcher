import {Command, flags} from '@oclif/command'
import AVDManager from './avdmanager'
import AVDLaunchOptions from './avdlaunchoptions'
import * as inquirer from 'inquirer'

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

class AvdLauncher extends Command {
  static description = 'Launch an Android Virtual Device.'

  static flags = {
    cold: flags.boolean({char: 'c', description: 'Performs a cold boot and saves the emulator state on exit.'}),
    version: flags.version({char: 'v'}),
    help: flags.help({char: 'h'}),
  }

  async run() {
    // Handle built-in flags
    const {flags} = this.parse(AvdLauncher)

    const avdManager = new AVDManager()
    const availableAvds = await avdManager.getAll()
    const answer = await inquirer.prompt([selectDevicesQuestion(availableAvds)])
    const avdsToLaunch: string[] = answer.avds
    avdsToLaunch.forEach(avd => {
      process.stdout.write(`Launching ${avd}...`)
      avdManager.launch(avd, createLaunchOptions(flags))
      process.stdout.write('done.\n')
    })
  }
}

export = AvdLauncher
