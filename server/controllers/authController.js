import User from "../models/user.js"
import bcryptjs from 'bcryptjs'
import { validateRegister } from "../helpers/auth.js"
import jwt from 'jsonwebtoken'

export const signup = async (req, res, next) => {
   try {
      const { username, password, email } = req.body
      const { errors, isValid } = validateRegister(req.body)
      if (!isValid) {
         return res.status(400).json(errors)
      }
      const existing = await User.findOne({ email })
      if (existing) {
         return res.status(409).json({ message: "User already exists... Go to Sign in" })
      }
      const usernameExisting = await User.findOne({ username })
      if (usernameExisting) {
         return res.status(409).json({ message: "Username already exists..." })
      }

      const hashedPassword = bcryptjs.hashSync(password, 10)
      const newUser = new User({ username, email, password: hashedPassword })
      await newUser.save()
      res.status(201).json('user signup successfull!!')
   } catch (err) {
      console.log(err)
      return res
         .status(500)
         .json({ message: "Something went wrong. Please try again later" })
   }
}

export const signin = async (req, res, next) => {
   try {
      const { email, password } = req.body;
      const existingUser = await User.findOne({ email: email });
      if (!existingUser) {
         return res.status(409).json({ message: "User not Found. Go to Sign Up." });
      }
      const validPassword = bcryptjs.compareSync(password, existingUser.password)
      if (!validPassword) {
         return res.status(409).json({ message: "Invalid password!!!" })
      }
      const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET)
      const { password: pass, ...rest } = existingUser._doc
      const user = {
         user: rest,
         token: token,
       };
      res.cookie('token', token, { expires: new Date(Date.now() + 900000), httpOnly: false,secure:true })
      .status(200)
      .json(user)
   } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal Server Error" });
   }
};


export const google = async (req, res, next) => {
   try {
      console.log("hello google")
      const user = await User.findOne({ email: req.body.email })
      if (user) {
         const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
         const { password: pass, ...rest } = user._doc
         console.log("dATA HERW 1", rest)
         res
            .cookie('access-token', token, { httpOnly: true })
            .status(200)
            .json(rest)
      } else {
         const generatePassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8)
         const hashedPassword = bcryptjs.hashSync(generatePassword, 10)
         const newUser = new User({ username: req.body.name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-4), email: req.body.email, password: hashedPassword, avatar: req.body.photo })
         await newUser.save()
         const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET)
         const { password: pass, ...rest } = newUser._doc
         console.log("dATA HERW", rest)
         res
         .cookie('access_token', token, { expires: new Date(Date.now() + 900000), httpOnly: true, secure: true })
         .status(200)
         .json(rest);
      }
   } catch (err) {
      console.log(err)
      return res.status(500).json({ message: "Internal Server Error" });

   }
}

export const signout = async (req,res) => {
   try{
      
      res.status(200).clearCookie('access_token')
   }catch (err) {
         console.error(err);
         return res.status(500).json({ message: "Internal Server Error" });
      }
}