// @dada78641/sayserver <https://github.com/msikma/sayserver>
// © MIT license

import DarwinSpeechSynthesizerProvider from '../providers/DarwinSpeechSynthesizer/index.ts'
import type {LocalProviderConstructor, LocalProviderInfo} from '../../types.ts'

export const providers: LocalProviderConstructor[] = [DarwinSpeechSynthesizerProvider]

export function getProviderInfo() {
  const services: {[key: string]: LocalProviderInfo['data']} = {}
  for (const provider of providers) {
    if (!provider.isUsable()) {
      continue
    }
    const info = provider.getVoiceSetInfo()
    services[info.name] = info.data
  }
  return services
}

/**
 * Returns provider by a given name.
 */
export function findProvider(identifier: string): LocalProviderConstructor {
  for (const provider of providers) {
    if (provider.name !== identifier) {
      continue
    }
    if (!provider.isUsable()) {
      throw new Error(`provider cannot run on this platform: ${process.platform}`)
    }
    return provider
  }
  throw new Error(`no provider: ${process.platform}`)
}
