import {Route, Routes, BrowserRouter} from 'react-router-dom';
import Debug from './Debug';
import Page from './Page';
import OpenedCatalog from './OpenedCatalog';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/test' element={<Page Content={Debug}/>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
