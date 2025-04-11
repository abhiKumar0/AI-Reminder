import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Home } from './pages'
import Navbar from './components/Navbar'

const App = () => {
  const [tab, setTab] = useState("add");

  return (
    <div>
      <Navbar setTab={setTab}/>
      <Home tab={tab} />
    </div>
  )
}

export default App