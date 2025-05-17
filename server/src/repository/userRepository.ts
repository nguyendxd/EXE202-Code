import User, { IUser } from "../model/User";

// Lấy tất cả người dùng
export const getUsers = () => User.find({ isDeleted: false });
//Lay nguoi dung qua id
export const getUserById = (id: string) => 
    User.findOne({ _id: id});
// Lấy người dùng qua firebaseUID
export const getUserByFirebaseUID = (firebaseUID: string) => 
    User.findOne({ firebaseUID, isDeleted: false });
// Tạo người dùng mới
export const createUser = (values: Partial<IUser>) => 
    new User(values).save().then((user) => user.toObject());

// Lấy người dùng qua email
export const getUserByEmail = (email: string) => 
    User.findOne({ email, isDeleted: false });

// Xóa người dùng qua ID (soft delete)
export const softDeleteUserById = (id: string) => 
    User.findByIdAndUpdate(id, { isDeleted: true }, { new: true });

// Cập nhật người dùng qua ID
export const updateUserById = (id: string, values: Partial<IUser>) => 
    User.findByIdAndUpdate(id, values, { new: true });
