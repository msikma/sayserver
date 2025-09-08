// @dada78641/sayserver <https://github.com/msikma/sayserver>
// © MIT license

import fs from 'node:fs/promises'
import path from 'node:path'
import tmp from 'tmp-promise'
import {pickArray} from '@dada78641/strim-prng'
import {findProvider} from './providers/index.ts'
import {compressAudioFile, probeAudioFile} from './cmds.ts'
import {runCommand, arrayWrap} from '../util/index.ts'
import type {UtteranceData, ControllerSettings, LocalProvider, VoiceSets, ProbeJSON, AudioMetadata, Voice, VoiceParams} from '../types.ts'

export class Controller {
  // Path to the ffmpeg binaries.
  private _binMpeg: string = 'ffmpeg'
  private _binProbe: string = 'ffprobe'
  // Seed used for the PRNG.
  private seed: string | null
  // Base settings for all generations.
  private settings: ControllerSettings

  constructor(seed?: string | null, settings?: ControllerSettings) {
    this.seed = seed ?? null
    this.settings = settings ?? {}
  }

  async generateUtterance(prompt: string, utteranceSeed?: string | null, utteranceSettings?: ControllerSettings): Promise<UtteranceData | null> {
    let utteranceResult: UtteranceData | null = null
    await tmp.withDir(
      async tmpDir => {
        const seed = utteranceSeed ?? this.seed ?? ''
        const settings = {...this.settings, ...utteranceSettings}
        const provider = this.resolveProvider(settings)
        const voice = this.resolveVoice(provider, seed, settings)

        const utterance = await provider.generateUtterance(this.getRawFilename(tmpDir.path), voice, prompt)
        const compressed = await this.compressAudio(utterance.target, this.getFinalFilename(tmpDir.path), provider.type)
        const metadata = await this.probeMetadata(compressed.target)

        const result = await this.wrapUtteranceResult(compressed.target, metadata, utterance.prompt, seed, settings, provider, voice)
        utteranceResult = result
      },
      {
        unsafeCleanup: true
      }
    )
    return utteranceResult
  }

  private getRawFilename(targetBaseDir: string) {
    return path.join(targetBaseDir, 'raw.wav')
  }

  private getFinalFilename(targetBaseDir: string) {
    return path.join(targetBaseDir, 'final.opus')
  }

  private async wrapUtteranceResult(inputPath: string, metadata: AudioMetadata, prompt: string, seed: string, settings: ControllerSettings, provider: LocalProvider, voice: Voice): Promise<UtteranceData> {
    try {
      const data = await fs.readFile(inputPath, null)
      return {
        audio: data,
        utterance: {
          prompt,
          seed,
          set: settings.set!,
          voice: settings.voice!,
          service: settings.service!,
          resolvedVoice: voice
        },
        metadata,
      }
    }
    catch {
      //
    }
    throw new Error('wrapping result failed')
  }

  private async probeMetadata(inputPath: string) {
    const cmd = probeAudioFile(this._binProbe, inputPath)
    const res = await runCommand(cmd)
    if (res.exitCode !== 0) {
      throw new Error('probing failed (exit != 0)')
    }
    let json
    try {
      json = JSON.parse(res.stdout) as ProbeJSON
    }
    catch {
      throw new Error('probing failed (no json)')
    }

    return this.parseMetadata(json)
  }

  private parseMetadata(data: ProbeJSON): AudioMetadata {
    // There should always be only one stream.
    const stream = data.streams[0]
    const format = data.format
    const metadata = {
      duration: Number(format.duration),
      size: Number(format.size),
      formatName: String(format.format_name),
      codecName: String(stream.codec_name),
      sampleRate: Number(stream.sample_rate),
      channels: Number(stream.channels),
      channelLayout: String(stream.channel_layout),
    }
    return metadata
  }

  private async compressAudio(inputPath: string, outputPath: string, providerType: string) {
    const cmd = compressAudioFile(this._binMpeg, inputPath, outputPath)
    const res = await runCommand(cmd)
    if (res.exitCode !== 0) {
      throw new Error('compression failed')
    }
    return {
      target: outputPath,
      cmd
    }
  }

  private resolveProvider(settings: ControllerSettings) {
    const constructor = findProvider(settings.service ?? '')
    const provider = new constructor()
    return provider
  }

  private resolveVoice(provider: LocalProvider, seed: string, settings: ControllerSettings): Voice {
    // Get all voices supplied by this provider.
    const allVoices = provider.getVoiceSets()

    // Get a list of just the voices we're interested in (per our settings).
    const applicableVoices = this.collectApplicableVoices(allVoices, settings)

    if (applicableVoices.length === 0) {
      throw new Error('no voices found')
    }

    // Now that we have a list of applicable voices, pick one of them randomly per our seed.
    const pickedVoice = pickArray(seed, applicableVoices)

    return pickedVoice
  }

  private collectApplicableVoices(voiceSets: VoiceSets, settings: ControllerSettings) {
    const sets = settings.set ? arrayWrap<string>(settings.set) : []
    const voices = settings.voice ? arrayWrap<string>(settings.voice) : []

    const collectedVoices: Voice[] = []
    const voiceBaseParams: VoiceParams = {volume: 1, rate: 1, pitch: 0}
    
    for (const [name, set] of Object.entries(voiceSets)) {
      if (sets.length !== 0 && !sets.includes(name) && voices.length === 0) {
        continue
      }
      const setParams = {...voiceBaseParams, ...set.params}
      const voiceBase = {gender: set.gender, generation: set.generation, params: setParams}
      for (const item of set.voices) {
        const itemName = typeof item === 'string' ? item : item.name!
        if (voices.length !== 0 && !voices.includes(itemName)) {
          continue
        }
        if (typeof item === 'string') {
          collectedVoices.push({name: item, ...voiceBase})
        }
        else {
          collectedVoices.push({name: '', ...voiceBase, ...item, params: {...(item.params ?? {}), ...setParams}})
        }
      }
    }

    return collectedVoices
  }

  getSeed(): string | null {
    return this.seed
  }

  getSettings(): ControllerSettings {
    return this.settings
  }
}
