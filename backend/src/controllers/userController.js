import User from '../model/User.js';
import bcrypt from 'bcryptjs';

const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if(!user){
            return res.status(404).json({message: 'User not found'});
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if(!user){
            return res.status(404).json({message: 'User not found'});
        }
        user.fullName = req.body.fullName || user.fullName;
        user.email = req.body.email || user.email;
        if(req.body.password){
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(req.body.password, salt);
        }
        const updatedUser = await user.save();
        res.status(200).json({
            _id: updatedUser._id,
            fullName: updatedUser.fullName,
            email: updatedUser.email,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export {getProfile, updateProfile};