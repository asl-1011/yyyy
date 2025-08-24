import mongoose, { type Document, Schema, Types } from "mongoose"
import bcrypt from "bcryptjs"

// --------------------
// Address Interface (Subdocument)
// --------------------
export interface IAddress extends Types.Subdocument {
  _id: Types.ObjectId
  label?: string
  street: string
  city: string
  state: string
  pincode: string
  country: string
  latitude?: number
  longitude?: number
  isDefault?: boolean
}

// --------------------
// User Interface
// --------------------
export interface IUser extends Document {
  _id: Types.ObjectId
  name: string
  email: string
  password: string
  phone?: string
  addresses: Types.DocumentArray<IAddress>  // ✅ Explicitly DocumentArray
  role: "user" | "admin"
  createdAt: Date
  updatedAt: Date
  comparePassword(candidatePassword: string): Promise<boolean>
}

// --------------------
// Address Schema
// --------------------
const AddressSchema = new Schema<IAddress>({
  label: { type: String, default: "Home" },
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  country: { type: String, required: true, default: "India" },
  latitude: { type: Number },
  longitude: { type: Number },
  isDefault: { type: Boolean, default: false },
})

// --------------------
// User Schema
// --------------------
const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, select: false },
    phone: { type: String },
    // ✅ Ensure Mongoose knows this is a subdocument array
    addresses: {
      type: [AddressSchema],
      default: (): IAddress[] => [],  // 👈 Fixes the "never[]" problem
    },
    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  { timestamps: true }
)

// --------------------
// Password Hash Middleware
// --------------------
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()

  try {
    const salt = await bcrypt.genSalt(12)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error: any) {
    next(error)
  }
})

// --------------------
// Compare Password Method
// --------------------
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password)
}

// --------------------
// Model Export
// --------------------
const User =
  (mongoose.models.User as mongoose.Model<IUser>) ||
  mongoose.model<IUser>("User", UserSchema)

export default User
