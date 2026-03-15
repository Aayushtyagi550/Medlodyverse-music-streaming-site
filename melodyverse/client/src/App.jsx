import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useMusic } from './context/MusicContext';
import TopNavbar from './components/TopNavbar';
import Sidebar from './components/Sidebar';
import MusicPlayer from './components/MusicPlayer';
import AIAssistant from './components/AIAssistant';
import MoodCamera from './components/MoodCamera';
import Home from './pages/Home';
import Search from './pages/Search';
import Artists from './pages/Artists';
import ArtistPage from './pages/ArtistPage';
import CategoryPage from './pages/CategoryPage';
import Favorites from './pages/Favorites';
import Playlists from './pages/Playlists';
import TimeMachine from './pages/TimeMachine';
import Admin from './pages/Admin';
import './App.css';

function App() {
  const { showPlayer } = useMusic();

  return (
    <div className="app-container">
      <Sidebar />
      <div className="app-main-content">
        <TopNavbar />
        <main className={`main-scroll ${showPlayer ? 'player-active' : ''}`}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/artists" element={<Artists />} />
            <Route path="/artist/:id" element={<ArtistPage />} />
            <Route path="/category/:name" element={<CategoryPage />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/playlists" element={<Playlists />} />
            <Route path="/time-machine" element={<TimeMachine />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
        {showPlayer && <MusicPlayer />}
        <MoodCamera />
        <AIAssistant />
        <Toaster position="bottom-right" toastOptions={{ className: 'toast-custom', duration: 3000 }} />
      </div>
    </div>
  );
}

export default App;
