import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import axios from 'axios';
import App from '../App.tsx';
import { PrivateRoute } from './route.private.tsx';
import { Profile } from '../pages/Profile.tsx';
import { Home } from '../pages/Home.tsx';
import { Login } from '../pages/Login.tsx';
import { Register } from '../pages/Register.tsx';
import { store, persistor } from '../store/store';
import { setCredentials, setInitialized, logout } from '../features/auth/store/auth_slice';
import { API_BASE_URL } from '../constants/api';
import { Products } from '../pages/Products.tsx';
import { Cart } from '../pages/Cart.tsx';
import { NotFound } from '../pages/NotFound.tsx';
import { Orders } from '../pages/Orders.tsx';
import { Sales } from '../pages/Sales.tsx';

async function bootstrap() {
  await new Promise<void>((resolve) => {
    const unsubscribe = persistor.subscribe(() => {
      const { bootstrapped } = persistor.getState();
      if (bootstrapped) {
        unsubscribe();
        resolve();
      }
    });
    if (persistor.getState().bootstrapped) resolve();
  });

  try {
    const { data } = await axios.post(
      `${API_BASE_URL}/auth/refresh`,
      {},
      { withCredentials: true }
    );
    store.dispatch(setCredentials(data));
  } catch {
    store.dispatch(logout());
  } finally {
    store.dispatch(setInitialized());
  }

  const root = createRoot(document.getElementById('root')!);
  root.render(
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<App />}>
              <Route path='*' element={<NotFound />} />
              <Route path='/' element={<Home />} />
              <Route path='/login' element={<Login />} />
              <Route path='/register' element={<Register />} />
              <Route path='/cart' element={<Cart />} />
              <Route path='/profile' element={<PrivateRoute><Profile /></PrivateRoute>} />
              <Route path='/products' element={<PrivateRoute><Products /></PrivateRoute>} />
              <Route path='/orders' element={<PrivateRoute><Orders /></PrivateRoute>} />
              <Route path='/sales' element={<PrivateRoute><Sales /></PrivateRoute>} />
            </Route>
          </Routes>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  );
}

bootstrap();