import React from 'react';
import { Outlet } from 'react-router-dom';
import MyTasks from './components/MyTasks';

const App = () => {
  return (
    <div>      
      <MyTasks />
    </div>
  );
};

export default App;