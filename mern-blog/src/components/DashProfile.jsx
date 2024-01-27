import { useSelector } from "react-redux"
import { Alert, Button, TextInput } from "flowbite-react"
import { useEffect, useRef, useState } from "react"
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage"
import { app } from "../firebase"
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export default function DashProfile() {
  const { currentUser } = useSelector(state => state.user)
  const [image, setImage] = useState(null)
  const [imageUrl, setImageUrl] = useState(null)
  const filePicker = useRef()
  const [imageUploading, setImageUploding] = useState(null)
  const [imageError, setImageError] = useState(false)

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


  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      <form className="flex flex-col gap-4">
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
        <TextInput type="text" id="username" placeholder="username" defaultValue={currentUser.username} />
        <TextInput type="email" id="email" placeholder="username" defaultValue={currentUser.email} />
        <TextInput type="password" placeholder="password" id="password" />
        <Button type="submit" gradientDuoTone='purpleToBlue'> Update</Button>
      </form>
      <div className="text-red-500 flex justify-between mt-5">
        <span className="curser-pointer">Delete account</span>
        <span className="curser-pointer">Sign Out</span>
      </div>
    </div>
  )
}
