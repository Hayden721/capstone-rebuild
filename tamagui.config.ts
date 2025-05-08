// tamagui.config.ts
import { createTamagui, createFont, createTokens } from 'tamagui'
import { defaultConfig } from '@tamagui/config/v4'
import { themes } from './themes';


const notoSans = createFont({
  family: 'NotoSans',
  size: {
    1: 12,
    2: 14,
    3: 16,
    4: 18,
    5: 20,
    6: 24,
    7: 28,
    8: 32,
    9: 36,
    10: 40,
    11: 44,
    12: 48,
  },
  letterSpacing: {
    4: 0,
  },
  lineHeight: {
    1: 16,
    2: 20,
    3: 24,
    4: 28,
    5: 32,
    6: 36,
    7: 40,
    8: 44,
    9: 48,
    10: 52,
    11: 56,
    12: 60,
  },
})


export const tamaguiConfig = createTamagui({
  ...defaultConfig,
  themes,
  fonts: {
    heading: notoSans,
    body: notoSans,
    mono: notoSans,
  },
  defaultFont: 'body', // 전역 폰트 지정
  
})

export default tamaguiConfig

export type Conf = typeof tamaguiConfig

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}