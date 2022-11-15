const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { AuthMiddleware } = require("../middleware/JWT");

router.post("/send-msg-to-admin", userController.sendMsgToAdmin)
router.post("/send-msg-to-user", userController.sendMsgToUser)
router.get("/get-chat", userController.getChat)
router.get("/get-all-contacts-and-chats", userController.getAllUser)
router.post("/add-chat-user", userController.addChatUser)
router.get("/checkToken", AuthMiddleware, userController.checkToken)
router.get("/refresh", AuthMiddleware, userController.refresh);
router.post("/login", userController.login);

module.exports = router;
