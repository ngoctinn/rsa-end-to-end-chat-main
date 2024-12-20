import bigInt from "big-integer";

class RSA {
  constructor() {
    this.publicKey = null;
    this.privateKey = null;
  }

  // Hàm tạo khóa công khai và khóa riêng tư
  generateKeys(bitLength = 10) {
    let e, p, q, n, phi, d;

    do {
      p = this.generatePrime(bitLength); // Tạo số nguyên tố p
      q = this.generatePrime(bitLength); // Tạo số nguyên tố q
      e = this.generateRandomExponent(bitLength); // Tạo số mũ ngẫu nhiên e
      n = p.multiply(q); // Tính n = p * q
      phi = p.subtract(1).multiply(q.subtract(1)); // Tính phi = (p-1) * (q-1)

      try {
        d = e.modInv(phi); // Tính d là nghịch đảo của e modulo phi
      } catch (error) {
        console.error("Error: ", error);
        d = bigInt(0);
      }
    } while (p.equals(q) || e.greater(phi) || d.equals(0) || !e.isPrime());

    this.publicKey = { e, n }; // Lưu khóa công khai
    this.privateKey = { d, n }; // Lưu khóa riêng tư
  }

  // Hàm tạo số nguyên tố ngẫu nhiên
  generatePrime(bitLength) {
    let prime;
    do {
      prime = bigInt.randBetween(
        bigInt(2).pow(Math.floor(bitLength / 4)),
        bigInt(2).pow(bitLength).subtract(1)
      );
    } while (!prime.isProbablePrime(32));
    return prime;
  }

  // Hàm tạo số mũ ngẫu nhiên
  generateRandomExponent(bitLength) {
    let exponent;
    do {
      exponent = bigInt.randBetween(
        bigInt(2).pow(Math.floor(bitLength / 4)),
        bigInt(2).pow(bitLength).subtract(1)
      );
    } while (!exponent.isProbablePrime(32));
    return exponent;
  }

  // Hàm mã hóa thông điệp
  encrypt(message, e, n) {
    e = bigInt(e);
    n = bigInt(n);
    return message
      .split("")
      .map((char) => {
        const asciiValue = char.charCodeAt(0); // Lấy mã ASCII của ký tự
        console.log("asciiValue", asciiValue);
        const asciiBigInt = bigInt(asciiValue);
        return asciiBigInt.modPow(e, n).toString(); // Mã hóa ký tự
      })
      .join(" ");
  }

  // Hàm giải mã thông điệp
  decrypt(encryptedMessage, d, n) {
    d = bigInt(d);
    n = bigInt(n);
    return encryptedMessage
      .split(" ")
      .map((encryptedChar) => {
        const encryptedBigInt = bigInt(encryptedChar);
        const decryptedAscii = encryptedBigInt.modPow(d, n).toJSNumber(); // Giải mã ký tự
        return String.fromCharCode(decryptedAscii);
      })
      .join("");
  }
}

export default RSA;
