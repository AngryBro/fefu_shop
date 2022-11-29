import {Route, Routes, BrowserRouter} from 'react-router-dom';
import Debug from './Debug';
import Page from './Page';
import MainPage from './MainPage';
import ProductPage from './ProductPage';
import CatalogPage from './CatalogPage';
import CartPage from './CartPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/test' element={<Debug/>}></Route>
        <Route path='/' element={<Page Content={MainPage} title='LOGO' />}></Route>
        <Route path='/product/:slug' element={<Page Content={ProductPage} />}></Route>
        <Route path='/catalog/:slug' element={<Page Content={CatalogPage} title='Каталог' />}/>
        <Route path='/catalog' element={<Page Content={CatalogPage} title='Каталог' />}/>
        <Route path='/cart' element={<Page Content={CartPage} title='Корзина' />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
