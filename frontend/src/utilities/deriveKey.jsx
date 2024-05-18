import axios from 'axios';

export const deriveKey = async (username) => {
    try {
        const res = await axios.get(`http://localhost:3001/api/messages/key/${username}`, 
            { withCredentials: true });
        
        const contactKey = res.data; 
        console.log('Retrieved contact key:', contactKey);

        const importedContactKey = await window.crypto.subtle.importKey(
            "jwk",
            contactKey,
            {
                name: "ECDH",
                namedCurve: "P-256"
            },
            true,
            []
        );

        const privateKeyJwk = JSON.parse(sessionStorage.getItem('privateKey'));

        const privateKey = await window.crypto.subtle.importKey(
            "jwk",
            privateKeyJwk,
            {
                name: "ECDH",
                namedCurve: "P-256",
            },
            true,
            ["deriveKey", "deriveBits"]
        );

        const symmetricKey = await window.crypto.subtle.deriveKey(
            { name: "ECDH", public: importedContactKey },
            privateKey,
            { name: "AES-GCM", length: 256 },
            true,
            ["encrypt", "decrypt"]
        );

        return symmetricKey
        

    } catch (error) {
        console.error('Error fetching contact key:', error.message);
    }
};