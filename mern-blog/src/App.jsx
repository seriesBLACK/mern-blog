import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import About from "./pages/About"
import Signin from "./pages/Signin"
import Signup from "./pages/Signup"
import Projects from "./pages/Projects"
import Dashboard from "./pages/Dashboard"
import Header from "./components/Header"
import FooterCom from "./components/Footer"
import PrivateRoute from "./components/PrivateRoute"
import AdminPrivteRoute from "./components/AdminPrivteRoute"
import CreatePost from "./pages/CreatePost"
import UpdatePost from "./pages/UpdatePost"
import PostPage from "./pages/PostPage"
import Search from "./pages/Search"

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/sign-in" element={<Signin />} />
        <Route path="/sign-up" element={<Signup />} />
        <Route path="/post/:postSlug" element={<PostPage />} />
        <Route path="/projects" element={<Projects />} />
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        <Route element={<AdminPrivteRoute />}>
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/update-post/:postId" element={<UpdatePost />} />
        </Route>
        <Route path="/about" element={<About />} />
      </Routes>
      <FooterCom />
    </BrowserRouter>
  )
}
