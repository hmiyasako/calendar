import { ThemeName, Theme } from '../types';
import './ThemeSelector.css';

interface ThemeSelectorProps {
  currentTheme: ThemeName;
  themes: Theme[];
  onThemeChange: (theme: ThemeName) => void;
}

export function ThemeSelector({ currentTheme, themes, onThemeChange }: ThemeSelectorProps) {
  return (
    <div className="theme-selector">
      <label htmlFor="theme-select">Theme:</label>
      <select
        id="theme-select"
        value={currentTheme}
        onChange={(e) => onThemeChange(e.target.value as ThemeName)}
      >
        {themes.map((theme) => (
          <option key={theme.name} value={theme.name}>
            {theme.label}
          </option>
        ))}
      </select>
    </div>
  );
}
