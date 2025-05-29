import User, { IUser } from "../model/User";


export const getUsers = () => User.find({ isDeleted: false });

export const getUserById = (id: string) => 
    User.findOne({ _id: id});

export const getUserByFirebaseUID = (firebaseUID: string) => 
    User.findOne({ firebaseUID, isDeleted: false });

export const createUser = (values: Partial<IUser>) => 
    new User(values).save().then((user) => user.toObject());

export const getUserByEmail = (email: string) => 
    User.findOne({ email, isDeleted: false });

export const softDeleteUserById = (id: string) => 
    User.findByIdAndUpdate(id, { isDeleted: true }, { new: true });

export const updateUserById = (id: string, values: Partial<IUser>) => 
    User.findByIdAndUpdate(id, values, { new: true });
