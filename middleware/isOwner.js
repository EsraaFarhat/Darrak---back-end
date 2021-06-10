const {User} = require('../models/user');
const {Advertisement} = require('../models/advertisement');

module.exports = async function (req, id) {
    const user = await User.findById(id);
    // const advertisement = await Advertisement.findById(id);
    // console.log(user._id);

        if(!user._id.equals(req.user._id) ){
            // return res.status(403).send({message: "You don't have the privilege to perform this action."})
            // console.log('false');
            return false;
        }
        // console.log('true');
        return true;
    
}