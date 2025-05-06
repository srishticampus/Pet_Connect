import express from "express";
// Import necessary models and middleware here
import Message from "../models/message.js";
import User from "../models/user.js"; // Assuming a User model exists
import auth from "../middleware/auth.js"; // Assuming authentication middleware exists

const router = express.Router();

// Route to get conversations for the logged-in user
// This might involve fetching users the current user has chatted with,
// potentially categorized by role as seen in the frontend.
router.get("/conversations", auth, async (req, res) => {
  console.log("GET /chat/conversations route hit");
  try {
    console.log("Fetching conversations for user:", req.user ? req.user.id : 'User not authenticated');
    const currentUserId = req.user.id;

    // Find unique user IDs involved in conversations with the current user
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [
            { sender: currentUserId },
            { receiver: currentUserId },
          ],
        },
      },
      {
        $group: {
          _id: null,
          participants: {
            $addToSet: {
              $cond: {
                if: { $eq: ["$sender", currentUserId] },
                then: "$receiver",
                else: "$sender",
              },
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          participants: 1,
        },
      },
    ]);

    const participantIds = conversations.length > 0 ? conversations[0].participants : [];

    // Fetch details of the participants
    const participants = await User.find({
      _id: { $in: participantIds },
    }).select('_id name avatar role'); // Select necessary fields

    // Structure the response based on frontend requirements
    const structuredConversations = {
      adopters: participants.filter(p => p.role === 'adopter').map(p => ({ id: p._id, name: p.name, avatar: p.avatar })),
      fosters: participants.filter(p => p.role === 'foster').map(p => ({ id: p._id, name: p.name, avatar: p.avatar })),
      petOwners: participants.filter(p => p.role === 'petOwner').map(p => ({ id: p._id, name: p.name, avatar: p.avatar })),
    };

    res.status(200).json(structuredConversations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error fetching conversations" });
  }
});

// Route to get messages for a specific conversation
// A conversation is between the logged-in user and another user (userId).
router.get("/conversations/:userId/messages", auth, async (req, res) => {
  console.log("GET /chat/conversations/:userId/messages route hit");
  try {
    const { userId } = req.params;
    const currentUserId = req.user ? req.user.id : 'User not authenticated'; // Assuming user is authenticated
    console.log(`Fetching messages between ${currentUserId} and ${userId}`);

    // Implement logic to fetch messages between currentUserId and userId
    const messages = await Message.find({
      $or: [
        { sender: currentUserId, receiver: userId },
        { sender: userId, receiver: currentUserId },
      ],
    }).sort({ timestamp: 1 });

    // Format timestamps for the frontend (optional, depends on frontend needs)
    const formattedMessages = messages.map(message => ({
      ...message.toObject(), // Convert Mongoose document to plain object
      timestamp: new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }));

    res.status(200).json(formattedMessages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error fetching messages" });
  }
});

// Route to send a new message
router.post("/conversations/:userId/messages", auth, async (req, res) => {
  console.log("POST /chat/conversations/:userId/messages route hit");
  try {
    const { userId } = req.params;
    const { content } = req.body;
    const senderId = req.user ? req.user.id : 'User not authenticated'; // Assuming user is authenticated

    console.log(`User ${senderId} sending message to ${userId}: ${content}`);

    // Implement logic to save the new message
    const newMessage = new Message({
      sender: senderId,
      receiver: userId,
      content: content,
      timestamp: new Date(), // Or use schema default
    });
    await newMessage.save();

    // Respond with the saved message, formatting the timestamp
    const sentMessage = {
      sender: newMessage.sender,
      receiver: newMessage.receiver,
      content: newMessage.content,
      timestamp: new Date(newMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      _id: newMessage._id, // Include the message ID
    };

    res.status(201).json(sentMessage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error sending message" });
  }
});

export { router };