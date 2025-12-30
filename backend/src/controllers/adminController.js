// CHECK THIS PATH: Is your folder named 'model' or 'models'? 
// Based on previous steps, it is likely 'models'.
import User from '../model/User.js'; 

const getUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // 1. Get the actual data for this page
        const users = await User.find({})
            .select('-password')
            .skip(skip)
            .limit(limit);

        // 2. Get the total count of documents in the collection
        // FIX: Call this on the 'User' model, not the 'users' array
        const total = await User.countDocuments({});

        res.status(200).json({
            users, // Send the array
            total,
            page,
            totalPages: Math.ceil(total / limit) // Standardized name 'totalPages'
        });

    } catch (error) {
        console.error("Error in getUsers:", error); // Log error to terminal to see details
        res.status(500).json({ message: error.message });
    }
};

const updateUserStatus = async (req, res) => {
    try {
        const { id } = req.params;
        
        // FIX: Incorrect destructuring in your code
        // content was: const {status} = req.body.status; (This is wrong)
        const { status } = req.body; 

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        user.status = status;
        await user.save();
        
        res.status(200).json({ message: 'User status updated successfully' });
    } catch (error) {
        console.error("Error in updateUserStatus:", error);
        res.status(500).json({ message: error.message });
    }
}

export { getUsers, updateUserStatus };