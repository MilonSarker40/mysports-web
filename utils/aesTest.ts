import CryptoJS from "crypto-js";

const secretKey = "myName070233Islamic2021".slice(0, 16);
const iv = "a1b2c3d4e5f6g7h8";

export function EncryptData_JS(plaintext: string): string {
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

export function DecryptData_JS(ciphertext: string): string | null {
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

function generate16DigitNumber(): string {
  return Math.floor(1e15 + Math.random() * 9e15).toString();
}

export function generateEncryptedToken() {
  const rnd1 = generate16DigitNumber();
  const rnd2 = generate16DigitNumber();

  const raw = `${rnd1}|ThematicQuiz2025|${rnd2}`;
  const encrypted = EncryptData_JS(raw);

  return {
    raw,
    encrypted,
  };
}
