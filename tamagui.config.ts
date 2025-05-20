// tamagui.config.ts
import { createTamagui, createFont, createTokens } from 'tamagui'
import { defaultConfig } from '@tamagui/config/v4'
import { themes } from './themes';

const notoSans = createFont({
  family: 'NotoSans',
  weight: {
    1: '100',
    2: '200',
    3: '300',
    4: '400',
    5: '500',
    6: '600',
    7: '700',
    8: '800',
    9: '900'
  },
  size: {
    1: 12,
    2: 14,
    3: 16,
    4: 18,
    5: 20,
    6: 24,
    7: 30,
  },
  lineHeight: {
    1: 16,
    2: 20,
    3: 24,
    4: 28,
    5: 32,
    6: 36,
    7: 42,
  },
  letterSpacing: {
    1: 0,
    2: 0.5,
    3: 1,
  },
})

export const tamaguiConfig = createTamagui({
  ...defaultConfig,
  themes,
  fonts: {
    ...defaultConfig.fonts, // 기존 폰트 설정 유지
    notoSans, // notoSans 폰트만 추가
  },
  defaultFont: 'notoSans', // 기본 폰트로는 설정 가능
})

export default tamaguiConfig

export type Conf = typeof tamaguiConfig

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}