export function ranInt(digits) {
    if (digits <= 0) {
      throw new Error("Number of digits must be greater than 0.");
    }
  
    const min = 10 ** (digits - 1);
    const max = 10 ** digits - 1;
  
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function ranAlpha(length) {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    let randomString = "";
  
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * alphabet.length);
      randomString += alphabet.charAt(randomIndex);
    }
  
    return randomString;
}

export function ranSpec(length) {
    const alphabet = "!@#$%^&*()-_+=[]{}|;:,.<>?";
    let randomString = "";
  
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * alphabet.length);
      randomString += alphabet.charAt(randomIndex);
    }
  
    return randomString;
}

