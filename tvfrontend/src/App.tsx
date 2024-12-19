import React from 'react';

import './App.css'
import TvMontagem from './services/api';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Ferramentaria from './services/ferramentaria';

const App: React.FC = () => {
    
  return (
    <div className="">
      <Router>
        <Routes>
          <Route path='/' element={<TvMontagem />}></Route>
          <Route path='/ferramentaria' element={<Ferramentaria />}></Route>

        </Routes>
      </Router>
    </div>
  );
};

export default App;