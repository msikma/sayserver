// @dada78641/sayserver <https://github.com/msikma/sayserver>
// © MIT license

import {voiceSets} from './sets.ts'
import {generateUtterance} from './cmds.ts'
import {runCommand} from '../../../util/exec.ts'
import type {LocalProvider, Voice} from '../../../types.ts'

export default class DarwinSpeechSynthesizer implements LocalProvider {
  private static _name: string = 'DarwinSpeechSynthesizer'
  private static _type: string = 'local'
  private _bin: string = 'say'

  async generateUtterance(target: string, voice: Voice, prompt: string) {
    const cmd = generateUtterance(this._bin, voice, target, prompt)
    const res = await runCommand(cmd)
    if (res.exitCode !== 0) {
      throw new Error('generation failed')
    }
    return {
      target,
      cmd
    }
  }

  static getVoiceSetInfo() {
    const sets: string[] = []
    const voices: string[] = []
    for (const [name, set] of Object.entries(voiceSets)) {
      sets.push(name)
      for (const voice of set.voices) {
        voices.push(typeof voice === 'string' ? voice : voice.name!)
      }
    }
    return {
      name: this._name,
      data: {
        type: this._type,
        sets,
        voices,
      }
    }
  }

  getVoiceSets() {
    return voiceSets
  }

  static get name() {
    return DarwinSpeechSynthesizer._name
  }

  get type() {
    return DarwinSpeechSynthesizer._type
  }

  static isUsable(): boolean {
    return process.platform === 'darwin'
  }
}
