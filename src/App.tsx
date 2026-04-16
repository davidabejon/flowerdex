import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { FlowerEncyclopedia } from './views/Flowerapp'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<FlowerEncyclopedia />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
