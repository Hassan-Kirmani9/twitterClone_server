import jwt from 'jsonwebtoken';
import { User } from '@prisma/client';
import { JWTUser } from '../interfaces';

const  JWT_SECRET = '$$$'
class JWT_SERVICE{
    public static async generateToken(user: User){

        const payload={
         id: user?.id,
         email: user?.email
        }

        const token = jwt.sign(payload,JWT_SECRET)
        return token

    }
    public static async decodeToken(token: string){
       return jwt.verify(token , JWT_SECRET) as JWTUser  
    }
}

export default JWT_SERVICE;
