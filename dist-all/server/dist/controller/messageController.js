"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessage = void 0;
const imagekit_1 = __importDefault(require("../config/imagekit"));
const Message_1 = __importDefault(require("../model/Message"));
const firebaseAdmin_1 = __importDefault(require("../config/firebaseAdmin"));
const User_1 = __importDefault(require("../model/User"));
const sendMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const senderId = req.user.id;
        const { receiverId, content } = req.body;
        let attachments = [];
        const files = req.files;
        if (files && files.length > 0) {
            const result = yield Promise.all(files.map(f => imagekit_1.default.upload({
                file: f.buffer.toString("base64"),
                fileName: f.originalname,
                folder: "/message-attachments"
            })));
            attachments = result.map(r => r.url);
        }
        //luu tin nhan
        const msg = yield Message_1.default.create({
            sender: senderId,
            receiver: receiverId,
            content: content || undefined,
            attachments,
        });
        //push notification
        const receiver = yield User_1.default.findById(receiverId).select("fcmToken");
        if (receiver === null || receiver === void 0 ? void 0 : receiver.fcmToken) {
            const payload = {
                notification: {
                    title: `Tin nhắn mới từ ${req.user.email}`,
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
            yield firebaseAdmin_1.default.messaging().send(Object.assign({ token: receiver.fcmToken }, payload));
        }
        res.status(201).json(msg);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error sending message", error: err.message });
    }
});
exports.sendMessage = sendMessage;
