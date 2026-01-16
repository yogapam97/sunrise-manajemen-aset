// program to generate random strings

// declare all characters
const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

export default function generateRandomString(length: number) {
  let result = " ";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i + 1) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}
