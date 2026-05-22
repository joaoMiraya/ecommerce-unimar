import { createRoot } from 'react-dom/client'
import './index.css'
import App from '../App.tsx'
import { BrowserRouter, Route, Routes } from 'react-router';
import { PrivateRoute } from './route.private.tsx';
import { Profile } from '../pages/Profile.tsx';

const root = createRoot(document.getElementById('root')!);

root.render(
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<App/>} />
      <Route path='/profile' element={<PrivateRoute><Profile/></PrivateRoute>} />
    </Routes>
  </BrowserRouter>
)
