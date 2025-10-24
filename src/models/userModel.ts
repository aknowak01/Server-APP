import mongoose, { Schema, Document } from 'mongoose'
import bcrypt from 'bcrypt'

export interface IUser extends Document {
    email: string
    password: string
    role: String
    comparePassword(candidatePassword: string): Promise <boolean>
}

const userSchema = new Schema<IUser>({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type:String,
        required: true,
    },
    role: {
        type: String,
        default: 'user',
    }
})

userSchema.pre('save', async function (next) {
    if(!this.isModified('password')) return next()
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
})


userSchema.methods.comparePassword = async function (candidate: string ) {
    return bcrypt.compare(candidate, this.password)
}

export default mongoose.model<IUser>('User', userSchema)
