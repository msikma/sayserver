// @dada78641/sayserver <https://github.com/msikma/sayserver>
// © MIT license

export type VoiceParams = {volume?: number, rate?: number, pitch?: number, language?: string}

export type VoiceSet = {
  voices: (string | PartialVoice)[]
  gender: string
  generation: number
  params: VoiceParams
}

export type Voice = {
  name: string
  gender: string
  generation: number
  params: VoiceParams
}

export type PartialVoice = Partial<Voice>

export type VoiceSets = {
  [key: string]: VoiceSet
}

export type ProbeObject = {
  [key: string]: string | number | ProbeObject
}

export type ProbeJSON = {
  streams: ProbeObject[]
  format: ProbeObject
}

export type UtteranceData = {
  audio: Buffer
  utterance: {
    prompt: string
    seed: string
    service: string
    set: string | string[] | null
    voice: string | string[] | null
    resolvedVoice: Voice
  },
  metadata: AudioMetadata
}

export type ResponseUtteranceData = Omit<UtteranceData, 'audio'> & {
  audio: string
}

export type AudioMetadata = {
  duration: number
  size: number
  formatName: string
  codecName: string
  sampleRate: number
  channels: number
  channelLayout: string
}

export interface LocalProvider {
  type: string
  generateUtterance: (dir: string, voice: Voice, prompt: string) => Promise<{target: string, cmd: string[]}>
  getVoiceSets: () => VoiceSets
}

export interface LocalProviderInfo {
  name: string
  data: {
    type: string
    sets: string[]
    voices: string[]
  }
}

export interface LocalProviderConstructor {
  new (): LocalProvider
  getVoiceSetInfo(): LocalProviderInfo
  isUsable(): boolean
}

export interface ControllerSettings {
  set?: string | string[] | null
  voice?: string | string[] | null
  service?: string
}

export type Command = string[]

export interface CommandResult {
  stdout: string
  stderr: string
  exitCode: number | null
  abortSignal: AbortSignal | null
}
