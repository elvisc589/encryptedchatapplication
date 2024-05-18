export const encryptMessage = async (text, derivedKey) => {
  const encodedText = new TextEncoder().encode(text);
  console.log("Encoded", encodedText)

  const encryptedData = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv: new TextEncoder().encode("Initialization Vector") },
    derivedKey,
    encodedText
  );
  console.log("Encrypted Data", encryptedData)

  const uintArray = new Uint8Array(encryptedData);
  console.log("uintarray ", uintArray)
  const string = String.fromCharCode.apply(null, uintArray);
  console.log("string ", string)
  const base64Data = btoa(string);
  console.log("base64data ", base64Data)
  return base64Data;
};

export const decryptMessage = async (text, derivedKey) => {
  try {
    const string = atob(text);
    const uintArray = new Uint8Array(
      [...string].map((char) => char.charCodeAt(0))
    );
    const algorithm = {
      name: "AES-GCM",
      iv: new TextEncoder().encode("Initialization Vector"),
    };
    const decryptedData = await window.crypto.subtle.decrypt(
      algorithm,
      derivedKey,
      uintArray
    );

    return new TextDecoder().decode(decryptedData);
  } catch (e) {
    return `error decrypting message: ${e}`;
  }
      }