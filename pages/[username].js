import { Container } from "@/components/molecules/container";
import { Navbar } from "@/components/organism/navbar";
import prisma from "@/lib/prisma/prisma";
import { UserIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import { useRouter } from "next/router";

import React, { useEffect, useState } from "react";

export default function Links({ user }) {
  const [list, setList] = useState([]);

  useEffect(() => {
    axios
      .get(`/api/public/link?username=${user.username}`)
      .then((res) => setList(res.data.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <>
      <Container>
        <div className="flex w-full h-screen justify-center items-center z-10">
          <div className="flex-row w-full xl:w-1/3 justify-center items-center space-y-5 mx-2 sm:mx-10 xl:mx-0">
            <div className="flex-row mb-10 space-y-5">
              <div className="flex justify-center items-center">
                {user.img ? (
                  <img
                    src={user.img}
                    className="w-[80px] h-[80px] rounded-full object-cover"
                  />
                ) : (
                  <UserIcon className="w-[50px] h-[50px] opacity-50 text-gray-100 " />
                )}
              </div>
              <div className="flex justify-center items-center ">
                <span className="text-2xl text-gray-100 opacity-80">
                  @{user.username}
                </span>
              </div>
            </div>
            {list
              ?.sort((a, b) => (a.order_list > b.order_list ? 1 : -1))
              .map((res, index) => {
                return (
                  <a
                    key={index}
                    href={res.url}
                    rel="noreferrer"
                    className="flex w-full bg-white text-gray-800 bg-opacity-80 rounded-3xl backdrop-blur-sm justify-center items-center py-4 text-lg hover:bg-opacity-50 hover:cursor-pointer"
                  >
                    {res.title}
                  </a>
                );
              })}
          </div>
        </div>
      </Container>
    </>
  );
}
export async function getServerSideProps(context) {
  const { username } = context.query;

  const [getUser] = await prisma.user.findMany({
    where: { username: username },
    select: {
      username: true,
      name: true,
      email: true,
      verified: true,
      img: true,
    },
  });
  if (!getUser) {
    return {
      redirect: {
        permanent: false,
        destination: "/page/not-found",
      },
    };
  }
  return {
    props: { user: getUser }, // will be passed to the page component as props
  };
}
