import { Button } from 'flowbite-react'
import { AiFillGoogleCircle } from "react-icons/ai"
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { app } from '../firebase'
import { useDispatch } from "react-redux"
import { signInSuccess } from "../redux/user/userSlice";
import { useNavigate } from 'react-router-dom'

export default function OAuth() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const handleGoogleClick = async () => {
    const auth = getAuth(app)
    const provider = new GoogleAuthProvider()

    try {
      const resFromGoogle = await signInWithPopup(auth, provider)
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: resFromGoogle.user.displayName,
          email: resFromGoogle.user.email,
          googlePhotoUrl: resFromGoogle.user.photoURL
        })
      })

      const data = await res.json()
      dispatch(signInSuccess(data))
      navigate('/');

    } catch (error) {
      console.log(error)

    };
  }

  return (
    <Button type='button' gradientDuoTone='pinkToOrange' outline onClick={handleGoogleClick}>
      <AiFillGoogleCircle className='w-6 h-6 mr-2' />
      Continue with Google
    </Button>
  )
}
