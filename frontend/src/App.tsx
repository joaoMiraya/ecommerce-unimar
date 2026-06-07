import './stylesheets/index.css'

import { Outlet } from 'react-router'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { useSelector } from 'react-redux';
import type { RootState } from './store/root_reducer';

function App() {
const isInitialized = useSelector((state: RootState) => state.auth.isInitialized);

if (!isInitialized) return <>Loading</>;
  return (
    <>
      <Header/>
      <div className='p-4 min-h-screen'>
        <Outlet/>
      </div>
      <Footer/>
    </>
  )
}

export default App
