// user/resolvers.ts
import { PrismaClient } from "@prisma/client";
import axios, { AxiosError } from "axios";
import { prisma_client } from "../../clients/db";
import JWT_SERVICE from "../../services/jwt";
import { GqlContext } from "../../interfaces";
import { User } from ".";
interface GoogleTokenResult {
    iss?: string;
    azp?: string;
    aud?: string;
    sub?: string;
    email: string;
    email_verified?: string;
    nbf?: string;
    name: string;
    picture: string;
    given_name?: string;
    locale?: string;
    iat?: string;
    exp?: string;
    jti?: string;
    alg?: string;
    kid?: string;
    typ?: string;
  }
  
  
export const resolvers = {
  Query: {
    verifyGoogleToken: async (parent: any, { token }: { token: string }) => {
      try {
        const googleToken = token;
        const googleOAuthURL = new URL("https://oauth2.googleapis.com/tokeninfo");
        googleOAuthURL.searchParams.set("id_token", googleToken);

        const { data } = await axios.get<GoogleTokenResult>(googleOAuthURL.toString(), {
          responseType: "json",
        });
        const user = await prisma_client.user.findUnique({ where: { email: data.email } });
        
        if (!user) {
          await prisma_client.user.create({
            data: {
              email: data.email,
              firstName: data.name,
              LastName: data.given_name,
              profileImage: data.picture,
            },
        });
    }
    const user_inDB = await prisma_client.user.findUnique({ where: { email: data.email } });
     
    if(!user_inDB) throw new Error ("No user")
        const userToken = JWT_SERVICE.generateToken(user_inDB)

         
        return userToken;
    

      } 
      catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError;
          console.error("Axios Error Details:", axiosError.message);
          console.error("Axios Error Response:", axiosError.response?.data);
        } else {

          console.error("Generic Error Details:", (error as Error).message);
        }
        throw error;
      }
    },
    getCurrentUser: async(parent:any , args: any , ctx: GqlContext)=>{
      return ctx.user
    }
  },
};
