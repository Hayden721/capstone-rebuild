import {useThemeContext} from '../hooks/useThemeContext';
import { Button, useTheme, Text, Switch } from 'tamagui';

export function ThemeToggleButton() {
  const themes = useTheme();
  const {toggleTheme, themeMode} = useThemeContext();

  return (

    <Switch size="$3" onCheckedChange={toggleTheme}  defaultChecked={themeMode === 'dark'}>
      <Switch.Thumb animation="quicker"/>
    </Switch>


  )
}
