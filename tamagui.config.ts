
import { color, radius, size, space, zIndex } from '@tamagui/themes'
import { createTamagui, createTokens } from 'tamagui'
import { themes } from './themes'
const tokens = createTokens({
  size,
  space,
  zIndex,
  color,
  radius,
})

const tamaguiConfig = createTamagui({
  themes,
  tokens,
  // ... see Configuration
})

export type Conf = typeof tamaguiConfig

declare module 'tamagui' {
  
  
  interface TamaguiCustomConfig extends Conf {}
}

export default tamaguiConfig