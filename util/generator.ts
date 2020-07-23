//Several generators for ids, tokens, etc.
import { shake128, shake256 } from 'js-sha3';

export function generateClientID(ip : string) {
    return shake128(ip + Date.now(), 128);
}

export function generateSessionToken(id : string, timeleft : number) {
    return shake256(id + timeleft.toString() + id, 512);
}