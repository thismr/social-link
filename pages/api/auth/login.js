import Cookies from "cookies";
import prisma from "@/lib/prisma/prisma";
const { createHash } = require("node:crypto");
import Cryptr from "cryptr";

export default async function handle(req, res) {
  if (req.method == "POST") {
    const email = req.body["email"];
    const pass = req.body["password"];

    if (!email || !pass) {
      res.redirect("/auth/login?error=Incorrect email or password");
    }

    const user = await prisma.user.findFirst({
      where: { email: email },
    });
    if (!user)
      return res.redirect("/auth/login?error=Incorrect email or password");

    const cryptr = new Cryptr(process.env.SECRET_KEY);
    const encryptedEmail = cryptr.encrypt(email);
    if (pass === cryptr.decrypt(user.password)) {
      const cookies = new Cookies(req, res);
      cookies.set("auth", encryptedEmail, { maxAge: 18e5 });
      return res.redirect("/admin");
    } else {
      return res.redirect("/auth/login?error=Incorrect email or password");
    }
  }
}
