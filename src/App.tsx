import { useState } from 'react'
import './App.css'
import { FlowerEncyclopedia } from './views/Flowerapp'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <FlowerEncyclopedia />
    </>
  )
}

export default App
