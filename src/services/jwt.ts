import jwt from 'jsonwebtoken';
import { User } from '@prisma/client';

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
}

export default JWT_SERVICE;
