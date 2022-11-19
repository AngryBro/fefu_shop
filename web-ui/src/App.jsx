import {Route, Routes, BrowserRouter} from 'react-router-dom';
import Debug from './Debug';
import Page from './Page';
import MainPage from './MainPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/test' element={<Page Content={Debug}/>}></Route>
        <Route path='/' element={<Page Content={MainPage} />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
