import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useStore } from './store/useStore';
import Layout from './components/Layout';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';

const hexToHsl = (hexColor: string) => {
  const sanitized = hexColor.replace('#', '');
  const value = sanitized.length === 3
    ? sanitized.split('').map((char) => `${char}${char}`).join('')
    : sanitized;
  const r = parseInt(value.slice(0, 2), 16) / 255;
  const g = parseInt(value.slice(2, 4), 16) / 255;
  const b = parseInt(value.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const lightness = (max + min) / 2;
  const delta = max - min;

  if (delta === 0) {
    return { hue: 0, saturation: 0, lightness };
  }

  const saturation = lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);
  let hue = 0;

  if (max === r) {
    hue = (g - b) / delta + (g < b ? 6 : 0);
  } else if (max === g) {
    hue = (b - r) / delta + 2;
  } else {
    hue = (r - g) / delta + 4;
  }

  return {
    hue: hue / 6,
    saturation,
    lightness,
  };
};

const hslToHex = (hue: number, saturation: number, lightness: number) => {
  if (saturation === 0) {
    const gray = Math.round(lightness * 255);
    return `#${gray.toString(16).padStart(2, '0').repeat(3)}`;
  }

  const hueToRgb = (p: number, q: number, t: number) => {
    let adjustedT = t;
    if (adjustedT < 0) adjustedT += 1;
    if (adjustedT > 1) adjustedT -= 1;
    if (adjustedT < 1 / 6) return p + (q - p) * 6 * adjustedT;
    if (adjustedT < 1 / 2) return q;
    if (adjustedT < 2 / 3) return p + (q - p) * (2 / 3 - adjustedT) * 6;
    return p;
  };

  const q = lightness < 0.5 ? lightness * (1 + saturation) : lightness + saturation - lightness * saturation;
  const p = 2 * lightness - q;
  const red = Math.round(hueToRgb(p, q, hue + 1 / 3) * 255);
  const green = Math.round(hueToRgb(p, q, hue) * 255);
  const blue = Math.round(hueToRgb(p, q, hue - 1 / 3) * 255);

  return `#${[red, green, blue].map((value) => value.toString(16).padStart(2, '0')).join('')}`;
};

const getSecondaryColor = (primaryColor: string) => {
  if (!/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(primaryColor)) {
    return '#1e40af';
  }

  const { hue, saturation, lightness } = hexToHsl(primaryColor);
  const adjustedLightness = Math.max(0, Math.min(1, lightness - 0.14));
  const adjustedSaturation = Math.max(0, Math.min(1, saturation + 0.08));
  return hslToHex(hue, adjustedSaturation, adjustedLightness);
};

function App() {
  const { theme, whiteLabelConfig } = useStore();

  useEffect(() => {
    document.documentElement.style.colorScheme = theme;
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    document.documentElement.style.setProperty('--color-primary', whiteLabelConfig.primaryColor);
    document.documentElement.style.setProperty('--color-secondary', getSecondaryColor(whiteLabelConfig.primaryColor));
  }, [whiteLabelConfig.primaryColor]);

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
