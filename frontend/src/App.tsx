import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import ItemsPage from "./pages/ItemsPage.tsx";
import SearchPage from "./pages/SearchPage.tsx";

function App() {
    const [currentPage, setCurrentPage] = useState<'home' | 'items' | 'search'>('home')

  return (
    <>
      <section id="center">
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>
        <div>
          <h1>Все возможности</h1>
            {currentPage !== 'home' && (
                <nav className="navbar">
                    <button onClick={() => setCurrentPage('home')}>Главная</button>
                    <button onClick={() => setCurrentPage('items')}>Items</button>
                    <button onClick={() => setCurrentPage('search')}>Поиск</button>
                </nav>
            )}

            {currentPage === 'home' && (
                <header className="App-header">
                    <button onClick={() => setCurrentPage('items')}>Перейти к items</button>
                    <button onClick={() => setCurrentPage('search')}>Перейти к поиску</button>
                </header>
            )}

            {currentPage === 'items' && <ItemsPage />}
            {currentPage === 'search' && <SearchPage />}
        </div>
      </section>
    </>
  )
}

export default App
