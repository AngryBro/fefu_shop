import {Route, Routes, BrowserRouter} from 'react-router-dom';
import Debug from './Debug';
import Page from './Page';
import MainPage from './MainPage';
import ProductPage from './ProductPage';
import CatalogPage from './CatalogPage';
import CartPage from './CartPage';
import OrderPage from './OrderPage';
import OrderSentPage from './OrderSentPage';
import NotFoundPage from './NotFoundPage';
import AdminPage from './admin/AdminPage';
import OrdersPage from './admin/OrdersPage';
import UsersPage from './admin/UsersPage';
import AdminsPage from './admin/AdminsPage';
import ContactsPage from './admin/ContactsPage';

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
        <Route path='/order' element={<Page Content={OrderPage} title='Оформление'/>} />
        <Route path='/order/sent' element={<Page Content={OrderSentPage} title='Оформлен' />}/>
        <Route path='/admin' element={<Page Content={AdminPage} title='Админ' />}/>
        <Route path='/admin/orders' element={<Page Content={OrdersPage} title='Заказы' />}/>
        <Route path='/admin/users' element={<Page Content={UsersPage} title='Пользователи' />}/>
        <Route path='/admin/admins' element={<Page Content={AdminsPage} title='Администраторы' />}/>
        <Route path='/admin/contacts' element={<Page Content={ContactsPage} title='Контакты' />}/>

        <Route path='*' element={<Page Content={NotFoundPage} title='404'/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
