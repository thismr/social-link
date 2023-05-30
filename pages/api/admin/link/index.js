import Cookies from "cookies";
import prisma from "@/lib/prisma/prisma";
import Cryptr from "cryptr";

export default async function handle(req, res) {
  if (req.method == "POST") {
    const cryptr = new Cryptr(process.env.SECRET_KEY);
    const cookies = new Cookies(req, res);
    const email = cookies.get("auth");

    const userId = req.body["userId"];
    const url = req.body["url"];
    const withProtocol =
      url.includes("http://") || url.includes("https://") ? true : false;

    const group = await prisma.link__group.findFirst({
      where: { user_id: Number(userId) },
      include: {
        user: true,
      },
    });
    const link = await prisma.link.count({
      where: { group_id: Number(group.id) },
    });

    if (group.user.email !== cryptr.decrypt(email))
      return res.status(400).json({ code: 400, msg: "invalid token" });

    const create = await prisma.link.create({
      data: {
        link__group: { connect: { id: group.id } },
        title: url,
        icon: "",
        url: withProtocol ? url : `https://${url}`,
        order_list: Number(link) + 1,
      },
    });

    return res.status(200).json({ code: 200, data: create, msg: "success" });
  } else if (req.method == "GET") {
    const { groupId } = req.query;
    const cryptr = new Cryptr(process.env.SECRET_KEY);
    const cookies = new Cookies(req, res);
    const email = cookies.get("auth");

    if (!groupId)
      return res.status(400).json({ code: 400, msg: "incorrect groupId" });
    if (!email)
      return res.status(400).json({ code: 400, msg: "invalid token" });

    const links = await prisma.link.findMany({
      where: {
        AND: [
          {
            link__group: {
              is: {
                user: {
                  is: {
                    email: cryptr.decrypt(email),
                  },
                },
              },
            },
          },
          { group_id: Number(groupId) },
        ],
      },
    });
    return res.status(200).json({ code: 200, data: links, msg: "success" });
  } else if (req.method == "PUT") {
    const cryptr = new Cryptr(process.env.SECRET_KEY);
    const cookies = new Cookies(req, res);
    const email = cookies.get("auth");

    if (!email)
      return res.status(400).json({ code: 400, msg: "invalid token" });
    //must create verifyToken to most secure

    const linkId = req.body["linkId"];
    const title = req.body["title"];
    const urls = req.body["url"];
    const withProtocol =
      urls?.includes("http://") || urls?.includes("https://") ? true : false;
    const url = urls && (withProtocol ? urls : `https://${urls}`);

    const update = await prisma.link.update({
      where: {
        id: Number(linkId),
      },
      data: {
        url,
        title,
      },
    });

    return res.status(200).json({ code: 200, data: update, msg: "success" });
  } else if (req.method == "DELETE") {
    const cryptr = new Cryptr(process.env.SECRET_KEY);
    const cookies = new Cookies(req, res);
    const email = cookies.get("auth");
    const { id } = req.query;

    if (!email)
      return res.status(400).json({ code: 400, msg: "invalid token" });
    //must create verifyToken to most secure

    if (!id) return res.status(400).json({ code: 400, msg: "invalid request" });

    const update = await prisma.link.delete({
      where: {
        id: Number(id),
      },
    });

    return res.status(200).json({ code: 200, data: update, msg: "success" });
  }
}
