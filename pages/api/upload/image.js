import Cookies from "cookies";
import prisma from "@/lib/prisma/prisma";
const { createHash } = require("node:crypto");
import Cryptr from "cryptr";
import formidable from "formidable";
import path from "path";
import fs from "fs/promises";

export const config = {
  api: {
    bodyParser: false,
  },
};
const readFile = (req, saveLocally) => {
  const options = {};
  if (saveLocally) {
    if (process.env.NODE_ENV === "development") {
      options.uploadDir = path.join(process.cwd(), "/public/upload");
    } else {
      options.uploadDir = path.join(__dirname, "../../../public/upload");
    }

    options.filename = (name, ext, path, form) => {
      return Date.now().toString() + "_" + path.originalFilename;
    };
  }
  const form = formidable(options);

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });
};

export default async function handle(req, res) {
  if (req.method == "POST") {
    const cryptr = new Cryptr(process.env.SECRET_KEY);
    const cookies = new Cookies(req, res);
    const email = cookies.get("auth");

    if (!email) {
      res.status(400).json({ code: 401, msg: "unauthorized" });
    }

    const user = await prisma.user.findFirst({
      where: { email: cryptr.decrypt(email) },
      select: {
        id: true,
      },
    });

    try {
      if (process.env.NODE_ENV === "development") {
        await fs.readdir(path.join(process.cwd(), "/public", "/upload"));
      } else {
        await fs.readdir(path.join(__dirname, "../../../public", "/upload"));
      }
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        await fs.mkdir(path.join(process.cwd(), "/public", "/upload"));
      } else {
        await fs.mkdir(path.join(__dirname, "../../../public", "/upload"));
      }
    }

    const data = await readFile(req, true).then((res) => {
      return prisma.user
        .update({
          where: { id: user.id },
          data: {
            img: `/upload/${res.files.img.newFilename}`,
          },
        })
        .then((user) => {
          return { ...res, user };
        });
    });
    return res.status(200).json({ code: 200, data, msg: "success" });
  }
}
