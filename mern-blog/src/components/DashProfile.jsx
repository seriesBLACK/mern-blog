import { useDispatch, useSelector } from "react-redux"
import { Alert, Button, Modal, TextInput } from "flowbite-react"
import { useEffect, useRef, useState } from "react"
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage"
import { app } from "../firebase"
import { CircularProgressbar } from 'react-circular-progressbar';
import { Link, useNavigate } from 'react-router-dom'
import 'react-circular-progressbar/dist/styles.css';
import { updateFailure, updateStart, updateSuccess, signoutSuccess } from "../redux/user/userSlice"
import { HiOutlineExclamationCircle } from "react-icons/hi"


export default function DashProfile() {
  const dispatch = useDispatch()
  const [showModal, setShowModal] = useState(false)
  const navigate = useNavigate()
  const { currentUser, error, loading } = useSelector(state => state.user)
  const [image, setImage] = useState(null)
  const [imageUrl, setImageUrl] = useState(null)
  const filePicker = useRef()
  const [imageUploading, setImageUploding] = useState(null)
  const [imageError, setImageError] = useState(false)
  const [formData, setFormData] = useState({})
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null)
  const [updateUserError, setUpdateUserError] = useState(null)


  const handelImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(file)

    }
  }

  const uploadImage = async () => {
    const storage = getStorage(app)
    const fileName = new Date().getTime() + 'profile image'
    const storageRef = ref(storage, fileName)
    const uploadTask = uploadBytesResumable(storageRef, image)
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const prograss = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        setImageUploding(prograss.toFixed(0))
      },
      (error) => {
        setImageError('Could Not Upload Image, file should be less then 2mb')
        setImageUploding(null)
        setImageUrl(null)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
          setImageUrl(downloadUrl)
          setFormData({ ...formData, profilePicture: downloadUrl })
        })
      }
    )
  }


  useEffect(() => {
    if (image) {
      setImageError(null)
      uploadImage()
    }
  }, [image])



  function handelChange(e) {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }



  async function handelSubmit(e) {
    e.preventDefault();
    setUpdateUserError(null);
    setUpdateUserSuccess(null);
    if (Object.keys(formData).length === 0) return setUpdateUserError('No changes made');

    try {
      dispatch(updateStart())

      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json()

      if (!res.ok) {
        dispatch(updateFailure(data.message))
        setUpdateUserError(data.message);
      } else {
        dispatch(updateSuccess(data))
        setUpdateUserSuccess("User's profile updated successfully");
      }

    } catch (error) {
      dispatch(updateFailure(error.message))
      setUpdateUserError(error.message);
    }

  }


  async function handleDeleteUser() {

    try {
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE'
      });

      const data = await res.json()
      if (data.success === false) console.log('faile')
      console.log(data);
      navigate('/sign-in')

    } catch (error) {

    }

  };


  async function signOut() {
    try {
      await fetch('/api/auth/signout')
      dispatch(signoutSuccess())
      navigate('/sign-in')

    } catch (error) {
      console.log(error)
    }

  }


  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      <form className="flex flex-col gap-4" onSubmit={handelSubmit}>
        <input hidden ref={filePicker} type="file" accept="image/*" onChange={handelImageChange} />
        <div className="w-32 h-32 self-center cursor-pointer overflow-hidden shadow-md relative flex justify-center items-center" onClick={() => filePicker.current.click()}>
          <img src={imageUrl || currentUser.profilePicture} alt="user" className="rounded-full w-31 h-31 border-8 border-[lightgray]" />
          {imageUploading && imageUploading > 99 && (
            <CircularProgressbar value={imageUploading} strokeWidth={5}
              className=" absolute"
            />

          )}

        </div>
        {imageError &&
          (
            <Alert color='failure'>
              {imageError}
            </Alert>
          )}
        <TextInput onChange={handelChange} type="text" id="username" placeholder="username" defaultValue={currentUser.username} />
        <TextInput onChange={handelChange} type="email" id="email" placeholder="username" defaultValue={currentUser.email} />
        <TextInput onChange={handelChange} type="password" placeholder="password" id="password" />
        <Button type="submit" gradientDuoTone='purpleToBlue' disabled={loading || imageUploading}> {loading ? "Loading..." : "Update"}</Button>
        {
          currentUser.isAdmin && (
            <Link to={'create-post'}>
              <Button type="button" className="w-full" gradientDuoTone="purpleToPink">
                Create Post
              </Button>
            </Link>
          )
        }
      </form>
      <div className="text-red-500 flex justify-between mt-5">
        <span className="cursor-pointer" onClick={() => setShowModal(true)}>Delete account</span>
        <span className="cursor-pointer" onClick={signOut}>Sign Out</span>
      </div>
      {updateUserSuccess && (
        <Alert color='success' className='mt-5'>
          {updateUserSuccess}
        </Alert>
      )}
      {updateUserError && (
        <Alert color='failure' className='mt-5'>
          {updateUserError}
        </Alert>
      )}
      {error && (
        <Alert color='failure' className='mt-5'>
          {error}
        </Alert>
      )}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size='md'
      >
        <Modal.Header />
        <Modal.Body>
          <div className='text-center'>
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
              Are you sure you want to delete your account?
            </h3>
            <div className='flex justify-center gap-4'>
              <Button color='failure' onClick={handleDeleteUser}>
                Yes, I'm sure
              </Button>
              <Button color='gray' onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}
