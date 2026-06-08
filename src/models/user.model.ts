import { User } from "@/types/user.types";
import mongoose, { Document } from "mongoose";
import bcrypt from "bcryptjs";


interface UserDocument extends Omit<User, "_id">, Document {
  comparePass(candidatePassword: string): boolean
}

const userSchema = new mongoose.Schema<UserDocument>(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      trim: true,
      required: [true, "Email is required"],
      unique: true,
    },
    mobile: {
      type: String,
      minLength: [10, "Min 10 chars required"],
      maxLength: [10, "Max 10 chars required"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minLength: [6, "Min 6 chars required"],
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", function () {
  if (!this.isModified("password")) return;
  this.password = bcrypt.hashSync(this.password, 10);
});

userSchema.methods.comparePass = function (candidatePassword: string) {
  return bcrypt.compareSync(candidatePassword, this.password);
};

const userModel = (mongoose.models.User as mongoose.Model<UserDocument>) || mongoose.model<UserDocument>("User", userSchema);

export default userModel;
