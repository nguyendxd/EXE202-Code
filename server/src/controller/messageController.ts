import { Request, Response } from "express";
import Blog, { IBlog } from "../model/Blog";
import { Types } from "mongoose";
import imagekit from "../config/imagekit";
import Message, { IMessage } from "../model/Message";
import admin from "../config/firebaseAdmin";
import User from "../model/User";

export interface AuthenticatedRequest extends Request {
    user?: {id: string; uid: string; role: string; email: string};
}

export const sendMessage = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const senderId = req.user!.id;
        const {receiverId, content} = req.body;
        
        let attachments: string[] = [];
        const files = req.files as Express.Multer.File[] | undefined;
        if (files && files.length > 0){
            const result = await Promise.all(
                files.map(f =>
                    imagekit.upload({
                        file: f.buffer.toString("base64"),
                        fileName: f.originalname,
                        folder: "/message-attachments"
                    })
                )
            );
            attachments = result.map(r => r.url);
        }

        //luu tin nhan
        const msg = await Message.create({
            sender: senderId,
            receiver: receiverId,
            content: content || undefined,
            attachments,
        }) as IMessage & { _id: Types.ObjectId };

        //push notification
        const receiver = await User.findById(receiverId).select("fcmToken");
        if (receiver?.fcmToken) {
            const payload: admin.messaging.MessagingPayload = {
                notification: {
                    title: `Tin nhắn mới từ ${req.user!.email}`,
                    body: content
                        ? content.slice(0, 100)
                        : `Bạn có ${attachments.length} tệp đính kèm`,
                },
                data: {
                    messageId: msg._id.toString(),
                    senderId,
                    receiverId,
                    attachments: JSON.stringify(attachments),
                },
            };
            await admin.messaging().send({
                token: receiver.fcmToken,
                ...payload
            });
        }

        res.status(201).json(msg);

    } catch (err: any) {
        console.error(err);
        res.status(500).json({ message: "Error sending message", error: err.message });
    }
}