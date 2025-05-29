import mongoose, {Document, Types, Schema } from "mongoose";

export interface IMessage extends Document {
    sender: mongoose.Types.ObjectId;
    receiver: mongoose.Types.ObjectId;
    content: string;
    attachments?: string[];
    createdAt: Date;
}

const messageSchema = new Schema<IMessage>(
    {
        sender: 
        { 
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,                
        },
        receiver:  
        {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        content:
        {
            type: String,
            required: false,
        },
        attachments: [{ type: String }]
    },

    {timestamps: true}
);

export default mongoose.model<IMessage>("Message", messageSchema);
