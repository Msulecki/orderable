import React, { useState } from 'react';
import List from './List';
import '../styles/App.scss';

function App() {

  console.log('app render');

  const data = [
    {
      title: "Item One",
      order: 0
    },
    {
      title: "Item Two",
      order: 1
    },
    {
      title: "Item Three",
      order: 2
    },
    {
      title: "Item Four",
      order: 3
    },
    {
      title: "Item Five",
      order: 4
    },
    {
      title: "Item Six",
      order: 5
    },
    {
      title: "Item Seven",
      order: 6
    },
    {
      title: "Item Eight",
      order: 7
    },
    {
      title: "Item Nine",
      order: 8
    },
    {
      title: "Item Ten",
      order: 9
    },
  ]

  const [newData, setNewData] = useState([...data]);



  return (
    <div className="app">
      <List newData={newData} setNewData={setNewData} />
    </div>
  );
}

export default App;
