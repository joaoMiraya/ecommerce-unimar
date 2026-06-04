import './stylesheets/index.css'

import { Outlet } from 'react-router'
import { Header } from './components/Header'
import { Footer } from './components/Footer'

function App() {

  return (
    <>
      <Header/>
      <div className='bg-[#D1AC2B] p-4 min-h-screen'>
        <Outlet/>
      </div>
      <Footer/>
    </>
  )
}

export default App
