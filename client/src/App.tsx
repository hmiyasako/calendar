import { Calendar } from './components/Calendar';
import { ThemeSelector } from './components/ThemeSelector';
import { useTheme } from './hooks/useTheme';
import './styles/themes.css';
import './App.css';

function App() {
  const { theme, setTheme, themes } = useTheme();

  return (
    <div className="app">
      <header className="app-header">
        <h1>Calendar</h1>
        <ThemeSelector
          currentTheme={theme}
          themes={themes}
          onThemeChange={setTheme}
        />
      </header>
      <main>
        <Calendar />
      </main>
    </div>
  );
}

export default App;
