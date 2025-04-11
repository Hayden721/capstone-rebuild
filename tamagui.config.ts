// tamagui.config.ts
import { createTamagui, TamaguiConfig } from 'tamagui'
import { defaultConfig } from '@tamagui/config/v4'
import { themes } from './themes'

const { themes: _, ...rest } = defaultConfig

export const config: TamaguiConfig = createTamagui({
  themes,
  ...rest,
})