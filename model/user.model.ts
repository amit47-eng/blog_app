import mongoose, { Document, Schema } from "mongoose"; // Import mongoose and types
import bcrypt from "bcrypt"; // Import bcrypt

// Define the interface for the communication schema
interface ICommunication {
  address_1: string;
  address_2: string;
  country: "INDIA" | "US" | "AUSTRALIA";
  phone_number_country_code: string;
  state: string;
}

// Define the interface for the user schema
interface IUser extends Document {
  firstname: string;
  lastname: string;
  about: string;
  email: string;
  password: string;
  username: string;
  role: "ADMIN" | "USER" | "QA-TESTER" | "CONTENT_WRITTER";
  isSubscribed: boolean;
  avatar: string;
  dob?: Date;
  phoneNumber: string;
  article: mongoose.Types.ObjectId[];
  communication_address: ICommunication;
}

const communicationSchema = new mongoose.Schema<ICommunication>({
  address_1: { type: String, required: true },
  address_2: { type: String, required: true },
  country: {
    type: String,
    enum: ["INDIA", "US", "AUSTRALIA"],
    default: "INDIA",
  },
  phone_number_country_code: { type: String, default: "+91" },
  state: { type: String, required: true },
});

const userSchema = new mongoose.Schema<IUser>(
  {
    firstname: {
      type: String,
      required: [true, "Please enter the First Name"],
      minLength: 3,
    },
    lastname: {
      type: String,
      required: [true, "Please enter the Second Name"],
      minLength: 3,
    },
    about: {
      type: String,
      required: [true, "Please enter the Summary of the user"],
      minLength: 10,
      maxLength: 200,
    },
    email: {
      type: String,
      lowercase: true,
      required: [true, "Please enter the email of the user"],
      unique: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please provide a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "Please input the user Password"],
    },
    username: {
      type: String,
      required: [true, "Please input the username"],
      unique: true,
      minLength: 3,
    },
    role: {
      type: String,
      enum: ["ADMIN", "USER", "QA-TESTER", "CONTENT_WRITTER"],
      default: "USER",
    },
    isSubscribed: { type: Boolean, default: false },
    avatar: { type: String, default: "" },
    dob: { type: Date },
    phoneNumber: {
      required: [true, "Kindly give the phone number"],
      type: String,
      minLength: 10,
      match: [
        /^\(?\+?[0-9]*\)?[-.\s]?[0-9]+[-.\s]?[0-9]+$/,
        "Please provide a valid phone number",
      ],
    },
    article: [{ type: mongoose.Schema.Types.ObjectId, ref: "Article" }],
    communication_address: communicationSchema,
  },
  { timestamps: true }
);

userSchema.pre<IUser>("save", async function (next) {
  if (this.isModified("password")) {
    try {
      this.password = await bcrypt.hash(this.password, 10);
    } catch (error) {
      return next();
    }
  }
  next();
});

const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema); // Check if the model already exists
export default User; // Use ES6 export
