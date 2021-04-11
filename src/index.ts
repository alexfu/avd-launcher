import {Command, flags} from '@oclif/command'
import AVDManager from './avdmanager'
import * as inquirer from 'inquirer'

class AvdLauncher extends Command {
  static description = 'Launch an Android Virtual Device.'

  static flags = {
    version: flags.version({char: 'v'}),
    help: flags.help({char: 'h'}),
  }

  async run() {
    const avdManager = new AVDManager()
    const availableAvds = await avdManager.getAll()
    const answer = await inquirer.prompt([this.selectDevicesQuestion(availableAvds)])
    const avdsToLaunch: string[] = answer.avds
    avdsToLaunch.forEach(avd => {
      process.stdout.write(`Launching ${avd}...`)
      avdManager.launch(avd)
      process.stdout.write('done.\n')
    })
  }

  private selectDevicesQuestion(avds: string[]) {
    return {
      type: 'checkbox',
      name: 'avds',
      message: 'Select a device',
      choices: avds,
    }
  }
}

export = AvdLauncher
