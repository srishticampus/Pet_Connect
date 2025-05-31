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
    console.log("Current user ID:", currentUserId);

    // Fetch all users except the current user
    const allUsers = await User.find({
      _id: { $ne: currentUserId }, // Exclude the current user
    }).select('_id name profilePic role'); // Select necessary fields

    console.log("Number of users found (excluding current):", allUsers.length);
    console.log("Roles of users found:", allUsers.map(user => user.role));


    // Structure the response based on frontend requirements, categorizing by role
    // Fetch unread message counts for each user
    const usersWithUnreadCounts = await Promise.all(allUsers.map(async (user) => {
      const unreadCount = await Message.countDocuments({
        sender: user._id,
        recipient: currentUserId,
        read: false,
      });
      return {
        ...user.toObject(), // Convert Mongoose document to plain object
        unreadCount,
      };
    }));

    // Structure the response based on frontend requirements, categorizing by role
    const structuredConversations = {
      adopters: usersWithUnreadCounts.filter(user => user.role === 'adopter').map(user => ({ id: user._id, name: user.name, profilePic: user.profilePic, unreadCount: user.unreadCount,role:user.role })),
      fosters: usersWithUnreadCounts.filter(user => user.role === 'foster').map(user => ({ id: user._id, name: user.name, profilePic: user.profilePic, unreadCount: user.unreadCount,role:user.role })),
      petOwners: usersWithUnreadCounts.filter(user => user.role === 'pet_owner').map(user => ({ id: user._id, name: user.name, profilePic: user.profilePic, unreadCount: user.unreadCount,role:user.role })), // Corrected role name
      rescueShelters: usersWithUnreadCounts.filter(user => user.role === 'rescue-shelter').map(user => ({ id: user._id, name: user.name, profilePic: user.profilePic, unreadCount: user.unreadCount,role:user.role })), // Added rescue shelters
      admins: usersWithUnreadCounts.filter(user => user.role === 'admin').map(user => ({ id: user._id, name: user.name, profilePic: user.profilePic, unreadCount: user.unreadCount,role:user.role })), // Added admins
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
        { sender: currentUserId, recipient: userId }, // Changed from receiver to recipient
        { sender: userId, recipient: currentUserId }, // Changed from receiver to recipient
      ],
    }).sort({ timestamp: 1 });

    // Format timestamps for the frontend (optional, depends on frontend needs)
    const formattedMessages = messages.map(message => ({
      ...message.toObject(), // Convert Mongoose document to plain object
      timestamp: new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), // Use createdAt
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
      recipient: userId, // Changed from receiver to recipient
      content: content,
      // timestamp: new Date(), // Removed explicit timestamp setting, using schema default createdAt
    });
    await newMessage.save();

    // Respond with the saved message, formatting the createdAt timestamp
    const sentMessage = {
      sender: newMessage.sender,
      recipient: newMessage.recipient,
      content: newMessage.content,
      timestamp: new Date(newMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), // Use createdAt
      _id: newMessage._id, // Include the message ID
    };

    res.status(201).json(sentMessage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error sending message" });
  }
});

// Route to mark messages in a conversation as read
router.post("/conversations/:userId/mark-as-read", auth, async (req, res) => {
  console.log("POST /chat/conversations/:userId/mark-as-read route hit");
  try {
    const { userId } = req.params;
    const currentUserId = req.user.id; // Assuming user is authenticated

    // Update messages where the sender is userId, recipient is currentUserId, and read is false
    const result = await Message.updateMany(
      {
        sender: userId,
        recipient: currentUserId,
        read: false,
      },
      {
        $set: { read: true },
      }
    );

    console.log(`Marked ${result.modifiedCount} messages as read for conversation with user ${userId}`);

    res.status(200).json({ message: "Messages marked as read", modifiedCount: result.modifiedCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error marking messages as read" });
  }
});

// Route to get the total number of unread messages for the logged-in user
router.get("/unread-count", auth, async (req, res) => {
  console.log("GET /chat/unread-count route hit");
  try {
    const currentUserId = req.user.id; // Assuming user is authenticated

    // Count unread messages where the recipient is the current user
    const totalUnreadCount = await Message.countDocuments({
      recipient: currentUserId,
      read: false,
    });

    console.log(`Total unread messages for user ${currentUserId}: ${totalUnreadCount}`);

    res.status(200).json({ totalUnreadCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error fetching unread count" });
  }
});

export { router };
