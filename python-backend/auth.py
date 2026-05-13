import os
import httpx
from fastapi import HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt

bearer = HTTPBearer()

async def get_current_user_id(
    credentials: HTTPAuthorizationCredentials = Security(bearer),
) -> str:
    token = credentials.credentials
    jwks_url = f"https://{os.getenv('CLERK_DOMAIN')}/.well-known/jwks.json"

    async with httpx.AsyncClient() as client:
        resp = await client.get(jwks_url)
        jwks = resp.json()

    public_keys = {
        key["kid"]: jwt.algorithms.RSAAlgorithm.from_jwk(key)
        for key in jwks["keys"]
    }

    header = jwt.get_unverified_header(token)
    key = public_keys.get(header["kid"])
    if not key:
        raise HTTPException(status_code=401, detail="Invalid token key")

    try:
        payload = jwt.decode(token, key, algorithms=["RS256"], options={"verify_aud": False})
        return payload["sub"]
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
