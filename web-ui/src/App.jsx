import {Route, Routes, BrowserRouter} from 'react-router-dom';
import Debug from './Debug';
import Page from './Page';
import MainPage from './MainPage';
import ProductPage from './ProductPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/test' element={<Debug/>}></Route>
        <Route path='/' element={<Page Content={MainPage} />}></Route>
        <Route path='/product/:slug' element={<Page Content={ProductPage} />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
