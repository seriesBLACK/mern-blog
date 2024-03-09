import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    require: true,
    unique: true,

  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String,
    default: 'https://media.istockphoto.com/id/526947869/vector/man-silhouette-profile-picture.jpg?s=612x612&w=0&k=20&c=5I7Vgx_U6UPJe9U2sA2_8JFF4grkP7bNmDnsLXTYlSc='
  },
  isAdmin: {
    type: Boolean,
    default: false,
  }

}, { timestamps: true })

const User = mongoose.model('User', userSchema)

export default User