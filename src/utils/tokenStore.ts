interface TokenStore {
    [key: string]: string; // Use the appropriate type instead of `any`
  }


const refreshTokens :TokenStore= {};


export default refreshTokens