import './App.css'
import ListingsPage from './pages/ListingsPage'

function App() {
  return (
    <>
      <header className='app-header'>
        <h1>Property Search</h1>
      </header>
      
      <main>
        <ListingsPage></ListingsPage>
      </main>
    </>
  )
}

export default App