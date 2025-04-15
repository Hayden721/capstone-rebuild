import {useThemeContext} from '../hooks/useThemeContext';
import { Button, useTheme, Text } from 'tamagui';

export function ThemeToggleButton() {
  const themes = useTheme();
  const {toggleTheme, themeMode} = useThemeContext();

  return (
    <Button onPress={toggleTheme}>
      <Text>{themeMode}</Text>
    </Button>
  )
}
