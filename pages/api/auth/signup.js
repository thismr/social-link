import prisma from "@/lib/prisma/prisma";
import Cookies from "cookies";
import Cryptr from "cryptr";

export default async function handler(req, res) {
  if (req.method == "POST") {
    const username = req.body["username"];
    const email = req.body["email"];
    const password = req.body["password"];

    const usernameAvailable = await prisma.user.findFirst({
      where: { OR: [{ email: email }, { username: username }] },
    });
    if (usernameAvailable) {
      if (usernameAvailable.email === email)
        return res.redirect("/auth/signup?error=A user already has this email");

      return res.redirect(
        "/auth/signup?error=A user already has this username"
      );
    }
    const cryptr = new Cryptr(process.env.SECRET_KEY);
    const password_hash = cryptr.encrypt(password);
    const encryptedEmail = cryptr.encrypt(email);
    const splittedEmail = email.split("@");
    await prisma.user
      .create({
        data: {
          username,
          name: splittedEmail[0],
          email,
          password: password_hash,
          role: { connect: { id: 2 } },
        },
      })
      .then((res) => {
        return prisma.link__group.create({
          data: {
            user: { connect: { id: res.id } },
            name: "default",
            path: `/`,
          },
        });
      });
    const cookies = new Cookies(req, res);
    cookies.set("auth", encryptedEmail);
    res.redirect("/admin");
  }
}
