// Backend

// /utils/encryption.js  <- File
const crypto = require('crypto');

// Encrypt a message
function encryptMessage(message, key, iv) {
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
    let encrypted = cipher.update(message, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag();
    return { encrypted, iv: iv.toString('hex'), authTag: authTag.toString('hex') };
}

// Decrypt a message
function decryptMessage(encrypted, key, iv, authTag) {
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, Buffer.from(iv, 'hex'));
    decipher.setAuthTag(Buffer.from(authTag, 'hex'));
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

module.exports = { encryptMessage, decryptMessage };






// FrontEnd

// src/services/encryptionService.js  <- File
import forge from 'node-forge';

export function generateClientKeys() {
    const dh = forge.pki.dh.generateKeyPair(2048);
    return {
        publicKey: forge.pki.publicKeyToPem(dh.publicKey),
        privateKey: dh.privateKey,
        dh
    };
}

export function computeSharedSecret(dh, serverPublicKey) {
    const serverKey = forge.pki.publicKeyFromPem(serverPublicKey);
    return dh.computeSecret(serverKey);
}
