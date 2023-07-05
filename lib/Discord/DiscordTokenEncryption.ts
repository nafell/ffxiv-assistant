import CryptoES from "crypto-es"

export function decryptDiscordToken(encryptedToken: string){
    return CryptoES.AES.decrypt(encryptedToken, process.env.CRYPTO_KEY).toString(CryptoES.enc.Utf8)
}

export function encryptDiscordToken(rawToken: string) {
    return CryptoES.AES.encrypt(rawToken, process.env.CRYPTO_KEY).toString()
}