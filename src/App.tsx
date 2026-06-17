import { useGameEngine } from './hooks/useGameEngine';
import MenuScreen from './components/MenuScreen';
import GameScreen from './components/GameScreen';
import EndingScreen from './components/EndingScreen';
import GalleryScreen from './components/GalleryScreen';

const SAVE_KEY = 'redchamber_save_v2';

function App() {
  const engine = useGameEngine();
  const { state, startGame, goToMenu, goToGallery, loadSave } = engine;

  const hasSave = (() => {
    try {
      return !!localStorage.getItem(SAVE_KEY);
    } catch {
      return false;
    }
  })();

  const handleContinue = () => {
    const success = loadSave();
    if (!success) {
      startGame();
    }
  };

  if (state.gameScreen === 'menu') {
    return (
      <div key="menu" className="animate-fade-in">
        <MenuScreen
          onStart={startGame}
          onGallery={goToGallery}
          hasSave={hasSave}
          onContinue={handleContinue}
        />
      </div>
    );
  }

  if (state.gameScreen === 'gallery') {
    return (
      <div key="gallery" className="animate-fade-in">
        <GalleryScreen
          unlockedEndings={state.unlockedEndings}
          onBack={goToMenu}
        />
      </div>
    );
  }

  if (state.gameScreen === 'ending') {
    return (
      <div key="ending" className="animate-fade-in">
        <EndingScreen
          state={state}
          onGallery={goToGallery}
          onMenu={goToMenu}
        />
      </div>
    );
  }

  return (
    <div key="game" className="animate-fade-in">
      <GameScreen engine={engine} />
    </div>
  );
}

export default App;
