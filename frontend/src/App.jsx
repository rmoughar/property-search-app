import { Route, Routes } from 'react-router'
import './App.css'
import ListingsPage from './pages/ListingsPage'
import PropertyDetailPage from './pages/PropertyDetailPage'
import { FavoritesProvider } from './utils/FavoritesProvider'
import FavoritesPage from './pages/FavoritesPage'
import Header from './components/Header'
import GlobalErrorBoundary from './components/errorboundaries/GlobalErrorBoundary'
import NaturalSearchPage from './pages/NaturalSearchPage'

function App() {
  return (
    <>
        <GlobalErrorBoundary fallback={<div>Something went wrong</div>}>
        <FavoritesProvider>
            <Header></Header>

            <Routes>
                <Route path='/' element={<ListingsPage />} />
                <Route path='/property/:id' element={<PropertyDetailPage />} />
                <Route path='/favorites' element={<FavoritesPage />}/>
                <Route path='/ai-search' element={<NaturalSearchPage />}/>
            </Routes>
        </FavoritesProvider>
        </GlobalErrorBoundary>
    </>
  )
}

export default App