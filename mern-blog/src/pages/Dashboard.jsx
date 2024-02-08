import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import DashSidebar from "../components/DashSidebar"
import DashProfile from "../components/DashProfile"
import DashPosts from "../components/DashPosts"


export default function Dashboard() {
  const location = useLocation()
  const [tab, setatab] = useState()

  useEffect(() => {
    const urlparams = new URLSearchParams(location.search)
    const tapFromUrl = urlparams.get('tab')
    if (tapFromUrl) {
      setatab(tapFromUrl)

    };
  }, [location.search])
  return (
    <div className='min-h-screen flex flex-col md:flex-row'>
      <div className='md:w-56'>
        {/* Sidebar */}
        <DashSidebar />
      </div>
      {/* profile... */}
      {tab === 'profile' && <DashProfile />}
      {tab === 'posts' && <DashPosts />}

    </div>
  )
}
