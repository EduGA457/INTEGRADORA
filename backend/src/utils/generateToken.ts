import jwt from "jsonwebtoken";
const ACCES_SECRET="secret1234utd";



export const generateAccesToken=(user:string)=>{
    return jwt.sign(
        { user },
        ACCES_SECRET,
        {
        expiresIn:"15m"
        }
);
}


