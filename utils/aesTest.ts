const CryptoJS = require("crypto-js");

const secretKey = "myName070233Islamic2021".slice(0, 16);
const iv = "a1b2c3d4e5f6g7h8";

 function EncryptData_JS(plaintext) {
  const encrypted = CryptoJS.AES.encrypt(
    plaintext,
    CryptoJS.enc.Utf8.parse(secretKey),
    {
      iv: CryptoJS.enc.Utf8.parse(iv),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }
  );

  return encrypted.toString(); // base64
}

 function DecryptData_JS(ciphertext) {
  try {
    const bytes = CryptoJS.AES.decrypt(
      ciphertext,
      CryptoJS.enc.Utf8.parse(secretKey),
      {
        iv: CryptoJS.enc.Utf8.parse(iv),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }
    );

    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (err) {
    console.error("Decrypt error:", err);
    return null;
  }
}

function generate16DigitNumber() {
  return Math.floor(
    1e15 + Math.random() * 9e15
  ).toString();
}

 function generateEncryptedToken() {
  const rnd1 = generate16DigitNumber();
  const rnd2 = generate16DigitNumber();

  const raw = `${rnd1}|ThematicQuiz2025|${rnd2}`;
  const encrypted = EncryptData_JS(raw);

  return {
    raw,
    encrypted,
  };
}


// ---------------------------------------
// TEST 1: Encrypt in JS → Decrypt in JS
// ---------------------------------------
console.log("\n--- TEST 1: JS → JS ---");
const jsEnc = EncryptData_JS("2025-12-08|ThematicQuiz2025|2025-12-09");
console.log("JS Encrypted:", jsEnc);
console.log("JS Decrypted:", DecryptData_JS(jsEnc));

// ---------------------------------------
// TEST 2: Simulate PHP Encrypted string 
//        (copy from actual PHP result)
// ---------------------------------------
const encryptedFromPHP = jsEnc; // replace with real PHP ciphertext

console.log("\n--- TEST 2: PHP → JS ---");
console.log("PHP Encrypted:", encryptedFromPHP);
console.log("JS Decrypted:", DecryptData_JS(encryptedFromPHP));

// ---------------------------------------
// TEST 3: Generate and encrypt custom string

const {encrypted} = generateEncryptedToken()
console.log("\n--- TEST 3: Generate and Decrypt ---");
console.log("Generated Encrypted:", encrypted);
console.log("JS Decrypted:", DecryptData_JS('rkg62m8uhCSj0+e6hkRm0YQcU2B8q+zUEKq0am0AQJLRyosrsrykUYIch7UG693e'));

// ---------------------------------------
// Export functions for future integration
// ---------------------------------------
module.exports = {
  EncryptData_JS,
  DecryptData_JS,
  generateEncryptedToken
};
