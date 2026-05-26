import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router';

import App from '../App.tsx'
import { PrivateRoute } from './route.private.tsx';
import { Profile } from '../pages/Profile.tsx';
import { Home } from '../pages/Home.tsx';

const root = createRoot(document.getElementById('root')!);

root.render(
  <BrowserRouter>
    <Routes>
      <Route path='/' element={ <App /> }>
      <Route path='/home' element={ <Home /> } />
        <Route path='/profile' element={ <PrivateRoute><Profile /></PrivateRoute> } />
      </Route>
    </Routes>
  </BrowserRouter>
)
