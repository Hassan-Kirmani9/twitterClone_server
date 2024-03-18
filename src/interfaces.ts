export interface JWTUser{
 id: string, 
 email: string, 
}

export interface GqlContext{
 user?: JWTUser
}

