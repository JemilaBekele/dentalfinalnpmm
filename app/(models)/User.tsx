import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please provide a username"],
    minlength: 3,
    maxlength: 50, // Fixed typo from "maxkength"
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
  },
  role: {
    type: String,
    enum: ['admin', 'doctor', 'reception'],
    required: [true, "Please provide a role"],
  },
  phone: {
    type: String,
    required: [true, "Please provide a phone number"],
  },
});




const User = mongoose.models.User || mongoose.model("User", userSchema);



export default User;
