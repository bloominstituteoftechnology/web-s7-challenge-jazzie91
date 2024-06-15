import React from 'react'
import Home from './Home'
import Form from './Form'
import { Route, Routes } from 'react-router-dom'
import {NavLink} from 'react-router-dom'

function App() {
  return (
    <div id="app">
      <nav>
      <NavLink to="/" exact activeClassName="active">Home</NavLink>
      <NavLink to="/order" exact activeClassName="active">Order</NavLink>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="order" element={<Form />} />
      </Routes>
      <Home />
      <Form />
    </div>
  )
}

export default App
