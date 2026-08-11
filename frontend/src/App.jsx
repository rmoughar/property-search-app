import { Route, Routes, Link } from 'react-router'
import './App.css'
import ListingsPage from './pages/ListingsPage'
import PropertyDetailPage from './pages/PropertyDetailPage'
import { FavoritesProvider } from './context/provider/FavoritesProvider'

function App() {

  return (
    <>
  
      <header className='app-header'>
        {/* <h1>Property Search</h1> */}
        <Link className='title-link' to={'/'}><h1>Property Search</h1></Link>
      </header>

      <FavoritesProvider>
        <Routes>
            <Route path='/' element={<ListingsPage />} />
            <Route path='/property/:id' element={<PropertyDetailPage />} />
        </Routes>
      </FavoritesProvider>
      
    </>
  )
}

export default App