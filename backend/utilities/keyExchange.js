// /utils/keyExchange.js  <- File
const crypto = require('crypto');

function generateKeys() {
    const dh = crypto.createDiffieHellman(2048);
    dh.generateKeys();
    return {
        publicKey: dh.getPublicKey(),
        privateKey: dh.getPrivateKey(),
        dh
    };
}

function computeSharedSecret(dh, clientPublicKey) {
    return dh.computeSecret(clientPublicKey);
}

module.exports = { generateKeys, computeSharedSecret };
