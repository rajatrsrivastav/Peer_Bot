import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    name: { type: String },
    image: { type: String },
    googleId: { type: String, unique: true, sparse: true },
    provider: { type: String, enum: ['credentials', 'google'], default: 'credentials' },
  },
  { timestamps: true }
);
//middleware
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

const User =mongoose.models.User || mongoose.model("User", userSchema);

export default User;
