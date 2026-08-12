import { Route, Routes, Link } from 'react-router'
import './App.css'
import ListingsPage from './pages/ListingsPage'
import PropertyDetailPage from './pages/PropertyDetailPage'
import { FavoritesProvider } from './context/provider/FavoritesProvider'
import FavoritesPage from './pages/FavoritesPage'

function App() {

  return (
    <>
  
      <header className='app-header'>
        <div className='header-box'>
            <Link className='title-link' to={'/'}><h1>Property Search</h1></Link>
            <Link className='favorites-link' to={'/favorites'}><span>Favorites</span></Link>
        </div>
      </header>

      <FavoritesProvider>
        <Routes>
            <Route path='/' element={<ListingsPage />} />
            <Route path='/property/:id' element={<PropertyDetailPage />} />
            <Route path='/favorites' element={<FavoritesPage />}/>
        </Routes>
      </FavoritesProvider>
      
    </>
  )
}

export default App