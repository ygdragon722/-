import { useState, useEffect } from 'react';
import { useGameEngine } from './hooks/useGameEngine';
import MenuScreen from './components/MenuScreen';
import GameScreen from './components/GameScreen';
import EndingScreen from './components/EndingScreen';
import GalleryScreen from './components/GalleryScreen';

const SAVE_KEY = 'redchamber_save_v2';

function App() {
  const engine = useGameEngine();
  const { state, startGame, goToMenu, goToGallery, loadSave } = engine;
  const [hasSave, setHasSave] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(SAVE_KEY);
      setHasSave(!!saved);
    } catch {
      setHasSave(false);
    }
  }, [state.gameScreen]);

  const handleContinue = () => {
    const success = loadSave();
    if (!success) {
      startGame();
    }
  };

  if (state.gameScreen === 'menu') {
    return (
      <MenuScreen
        onStart={startGame}
        onGallery={goToGallery}
        hasSave={hasSave}
        onContinue={handleContinue}
      />
    );
  }

  if (state.gameScreen === 'gallery') {
    return (
      <GalleryScreen
        unlockedEndings={state.unlockedEndings}
        onBack={goToMenu}
      />
    );
  }

  if (state.gameScreen === 'ending') {
    return (
      <EndingScreen
        state={state}
        onGallery={goToGallery}
        onMenu={goToMenu}
      />
    );
  }

  return <GameScreen engine={engine} />;
}

export default App;
