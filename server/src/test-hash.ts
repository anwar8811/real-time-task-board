import { hashPassword, comparePassword } from "./utils/password";

async function main() {
  const plainPassword = "mySecret123";

  const hashed = await hashPassword(plainPassword);
  console.log("Plain password:  ", plainPassword);
  console.log("Hashed password: ", hashed);

  const correctMatch = await comparePassword("mySecret123", hashed);
  const wrongMatch = await comparePassword("wrongPassword", hashed);

  console.log("Correct password matches:", correctMatch);
  console.log("Wrong password matches:  ", wrongMatch);
}

main();
