import { Routes, Route, Link } from 'react-router-dom'
import Login from './components/Login_Register/Login'
import Register from './components/Login_Register/Register'
import Todo from './components/To-Do/Todo'
import VerifyEmail from './components/Login_Register/VerifyEmail'
import Achievements from './components/achievments/Achievments'
import Header from './components/header_footer/Header'
import Footer from './components/header_footer/Footer'
import AboutUs from './components/about_us/AboutUs'
import Pomodoro from './components/pomodoro/Pomodoro' 
import Guide from './components/guide/Guide'
import AudioPlayer from './components/audioPlayer/AudioPlayer'
import { ToastContainer, toast } from "react-toastify";

function App() {
  return (
    <div>
      <ToastContainer />
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='/register' element={<Register/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/todo' element={<div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                                                  <Header />
                                                  <div className="main_" style={{ flex: 1 }}>
                                                    <div>
                                                        <Pomodoro/>
                                                        <Todo />
                                                        
                                                    </div>                           
                                                  </div>
                                                  <Footer />
                                                </div>}/>
        <Route path='/verify-email' element={<VerifyEmail/>} />
        <Route path='/achieve' element={<div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                                                  <Header />
                                                  <div style={{ flex: 1 }}>
                                                    <Achievements />
                                                    
                                                  </div>
                                                  <Footer />
                                                </div>} />
        <Route path='/about-us' element={<div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                                                  <Header />
                                                  <div style={{ flex: 1 }}>
                                                    <AboutUs />
                                                    
                                                  </div>
                                                  <Footer />
                                                </div>}/>
        <Route path='/guide' element={<div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                                                  <Header />
                                                  <div style={{ flex: 1 }}>
                                                    <Guide />
                                                    
                                                  </div>
                                                  <Footer />
                                                </div>}/>
      </Routes>
    </div>
  )


    
}

export default App
