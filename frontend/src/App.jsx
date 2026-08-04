import { Route, Routes } from 'react-router'
import './App.css'
import ListingsPage from './pages/ListingsPage'
import PropertyDetailPage from './pages/PropertyDetailPage'

function App() {
  return (
    <>
      <header className='app-header'>
        <h1>Property Search</h1>
      </header>
      
      {/* <main>
        <ListingsPage></ListingsPage>
      </main> */}

      <Routes>
        <Route path='/' element={<ListingsPage />} />
        <Route path='/property/:id' element={<PropertyDetailPage />} />
      </Routes>
    </>
  )
}

export default App