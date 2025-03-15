/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

export const colors = {
  // Main colors
  background: '#282828',
  backgroundSecondary: '#3c3836',
  text: '#ebdbb2',
  textSecondary: '#a89984',
  
  // Accent colors
  primaryYellow: '#fabd2f',
  secondaryYellow: '#d79921',
  orange: '#fe8019',
  red: '#fb4934',
  green: '#b8bb26',
  blue: '#83a598',
  purple: '#d3869b',
  aqua: '#8ec07c',
  
  // UI specific colors
  tabBarActive: '#fabd2f',
  tabBarInactive: '#a89984',
  border: '#504945',
  
  // Transparency versions for overlays
  backgroundTransparent: 'rgba(40, 40, 40, 0.9)',
};

export default colors;
