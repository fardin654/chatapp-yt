const messagesModel = require("../model/messagesModel");

module.exports.addMessage = async (req, res, next) => {
    try {
        const { from, to, message } = req.body;
        const data = await messagesModel.create({
            message: { text: message },
            Users: [from, to],
            sender: from,
            createdAt: new Date(),
        });
        if (data) return res.json({ msg: "Message added successfully" });
        else return res.json({ msg: "Failed to add message to the database" });
    } catch (err) {
        next(err);
    }
};

module.exports.getAllMessage = async (req, res, next) => {
    try {
        const { from, to } = req.body;
        const messages = await messagesModel.find({
            Users: {
                $all: [from, to],
            },
        }).sort({ createdAt: 1 }); 
        const projectedMessages = messages.map((msg) => {
            return {
                fromSelf: msg.sender.toString() === from,
                message: msg.message.text,
                createdAt: msg.createdAt, 
            };
        });
        res.json(projectedMessages);
    } catch (err) {
        next(err);
    }
};
