import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import {Navbar,CtaSection,FeaturesSection,HeroSection,Statusbar,Footer} from "./components"

const App = () => {
  return (
    <>
    <Navbar/>
    <HeroSection/>
    <Statusbar/>
    <FeaturesSection/>
    <CtaSection/>
    <Footer/>
    </>
  )
}

export default App