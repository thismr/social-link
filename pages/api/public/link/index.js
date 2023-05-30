import Cookies from "cookies";
import prisma from "@/lib/prisma/prisma";
import Cryptr from "cryptr";

export default async function handle(req, res) {
  if (req.method == "GET") {
    const { username } = req.query;

    const group = await prisma.link__group.findFirst({
      select: {
        id: true,
      },
      where: { user: { is: { username: username } } },
    });

    if (!group)
      return res.status(404).json({ code: 404, msg: "incorrect username" });

    const links = await prisma.link.findMany({
      where: {
        AND: [
          {
            link__group: {
              is: {
                user: {
                  is: {
                    username: username,
                  },
                },
              },
            },
          },
          { group_id: Number(group.id) },
        ],
      },
    });
    return res.status(200).json({ code: 200, data: links, msg: "success" });
  }
}
