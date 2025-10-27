import mongoose, { Schema, Document } from 'mongoose'
import bcrypt from 'bcrypt'

export type Role = 'USER' | 'ADMIN'

export interface IUser extends Document {
    email: string
    password: string
    role: Role
    isActive: boolean
    permissions: string[]
    comparePassword(candidate: string): Promise<boolean>
}

const userSchema = new Schema<IUser>({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Invalid email address'],
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        select: false, // ← nie zwracaj hasła domyślnie
    },
    role: {
        type: String,
        enum: ['USER', 'ADMIN'],
        default: 'USER',
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    permissions: {
        type: [String],
        default: [],
    },
}, {
    timestamps: true,
    versionKey: false,
    toJSON: {
        transform(_doc, ret: any) {
            delete ret.password
            return ret
        }
    }
})

// Hashowanie hasła przy save
userSchema.pre<IUser>('save', async function (next) {
    if (!this.isModified('password')) return next()
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
})

// (Opcjonalnie) Hash przy findOneAndUpdate, gdy zmieniasz hasło tym sposobem
userSchema.pre('findOneAndUpdate', async function (next) {
    const update = this.getUpdate() as any
    if (update?.password) {
        const salt = await bcrypt.genSalt(10)
        update.password = await bcrypt.hash(update.password, salt)
        this.setUpdate(update)
    }
    next()
})

// Porównanie haseł
userSchema.methods.comparePassword = async function (this: IUser, candidate: string) {
    // Uwaga: jeśli pobierasz usera bez select('+password'), this.password może być undefined
    return bcrypt.compare(candidate, this.password)
}

userSchema.index({ email: 1 }, { unique: true })

export default mongoose.model<IUser>('User', userSchema)
