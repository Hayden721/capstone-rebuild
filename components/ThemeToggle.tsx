import {useThemeContext} from '../context/ThemeContext';
import { Button } from 'tamagui';

export function ThemeToggleButton() {
  const {toggleTheme, theme} = useThemeContext();

  return (
    <Button onPress={toggleTheme}>
      {theme}
    </Button>
  )
}
