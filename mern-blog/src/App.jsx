import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import About from "./pages/About"
import Signin from "./pages/Signin"
import Signup from "./pages/Signup"
import Projects from "./pages/Projects"
import Dashboard from "./pages/Dashboard"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="sign-in" element={<Signin />} />
        <Route path="sign-up" element={<Signup />} />
        <Route path="projects" element={<Projects />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="about" element={<About />} />
      </Routes>
    </BrowserRouter>
  )
}
