import User from '../model/User.js'; 

const getUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const users = await User.find({})
            .select('-password')
            .skip(skip)
            .limit(limit);
        const total = await User.countDocuments({});

        res.status(200).json({
            users,
            total,
            page,
            totalPages: Math.ceil(total / limit)
        });

    } catch (error) {
        console.error("Error in getUsers:", error);
        res.status(500).json({ message: error.message });
    }
};

const updateUserStatus = async (req, res) => {
    try {
        const { id } = req.params;
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