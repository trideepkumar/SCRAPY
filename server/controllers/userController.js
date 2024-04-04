import bcryptjs from 'bcryptjs'
import User from '../models/user.js'
import Listing from '../models/Listing.js'


export const test = (req, res) => {
    res.send('Hello world!! tesyong')
}


export const updateUser = async (req, res) => {
    if (req.user.id !== req.params.id) {
        res.status(400).send('User can update only their own account!')
    }
    try {
        console.log(req.body)
        //   const hashedPassword = bcryptjs.hashSync(password, 10)

        const updateduser = await User.findByIdAndUpdate(req.params.id, {
            $set: {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                avatar: req.body.avatar
            }
        }, { new: true })

        console.log("updateduser", updateduser)

        const { password, ...rest } = updateduser._doc
        const user = {
            user: rest,
        }
        res.status(200).json(user)
    } catch (err) {
        return res
            .status(500)
            .json({ message: "Something went wrong. Please try again later" })
    }
}

export const deleteUser = async (req, res) => {
    if (req.user.id !== req.params.id) {
        res.status(400).send('User can delete only their own account!')
    }
    try {
        await User.findByIdAndDelete(req.params.id)
        res.clearCookie('access_token');
        res.status(200).json('User Deleted Successfully!')
    } catch (err) {
        return res
            .status(500)
            .json({ message: "Something went wrong in deleting User. Please try again later" })
    }
}

export const getUserlisting = async (req, res) => {
    
    if (req.user.id === req.params.id) {
        console.log("fetching lists...")
        try {
            const listing = await Listing.find({ userRef: req.params.id })
            res.status(200).json(listing)
        } catch (err) {
            console.log(err)
            res.status(401).json({ message: "Something went wrong in deleting User. Please try again later" })
        }
    } else {
        res.status(401).send('Cannot Authenticate the user !')
    }

}

export const getUser = async(req,res) =>{
    try{
        const user = await User.findById(req.params.id)
        if(!user){
            return res.status(404).json("User not Found !")
        }
        const  {password: pass, ...rest } = user._doc

         return res.status(200).json(rest)
    }catch(err){
        console.log(err)
        res.status(401).json({ message: "Something went wrong in deleting User. Please try again later" })
    }
}