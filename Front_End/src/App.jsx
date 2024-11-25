// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import Login from './component/login'
import logoimage from './assets/Right.svg'

function App() {
  return (
    <>
	<div className = "page">
      <div className="login">
		<Login />
	</div>
	<div className = "image">
		<img src = {logoimage}></img>
	  </div>
	</div>
    </>
  )
}

export default App
