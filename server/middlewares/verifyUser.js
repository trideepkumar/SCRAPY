import jwt from 'jsonwebtoken'

export const  verifyUser = (req,res,next)=>{

    console.log("user verifying")
    const token = req.headers.authorization.split(' ')[1]
    console.log(token)
    if(!token){
       return res.status(404).send('Unauthorized user ,cookie not found in the backend!')
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.error('JWT verification error:', err.message);
            return res.status(403).send('Forbidden, token not verified!');
        }
        req.user = decoded;
        console.log("token verified successfully !!")
        next();
    });
    
}