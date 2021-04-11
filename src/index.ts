import {Command, flags} from '@oclif/command'

class AvdLauncher extends Command {
  static description = 'Launch an Android Virtual Device.'

  static flags = {
    version: flags.version({char: 'v'}),
    help: flags.help({char: 'h'}),
  }

  async run() {
  }
}

export = AvdLauncher
