import { Container } from "@/components/molecules/container";
import { InputLink } from "@/components/molecules/inputLink/inputLink";
import { Navbar } from "@/components/organism/navbar";
import prisma from "@/lib/prisma/prisma";
import {
  LinkIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
  UserIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import axios from "axios";
import Cookies from "cookies";
import Cryptr from "cryptr";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
const { createHash } = require("crypto");

export function Users({ user, users }) {
  const userList = JSON.parse(users);
  const [input, setInput] = useState("");

  //pagination
  const indexPerPage = 2;
  const [startIndex, setStartIndex] = useState(1);
  const [endIndex, setEndIndex] = useState(indexPerPage);
  const pagination = Array.from(
    { length: Math.ceil(userList.length / indexPerPage) },
    (_, i) => i + 1
  );
  //endPagination

  return (
    <>
      {/* Navbar */}

      {/* Form */}
      <Container>
        <Navbar isLoggedIn={true} user={user} />
        <div className="flex max-w-7xl h-screen space-x-5 justify-center items-start xl:mx-28 z-10">
          <div className="flex-row w-full md:w-4/5 h-full pt-28 pb-10  space-y-5 mx-2 md:mx-0 text-white">
            <div className="flex w-full items-center text-gray-800 px-2 sm:px-0">
              <input
                type="text"
                name="search"
                id="search"
                placeholder="Search"
                className="focus:outline-none px-3 py-2 rounded-full  bg-white bg-opacity-50 w-full sm:w-1/2 lg:w-1/4 "
                onInput={(e) => {
                  setInput(e.target.value);
                }}
              />
              <div className="flex h-7 w-7 bg-white bg-opacity-50 -ml-9 backdrop-blur-lg justify-center items-center rounded-full">
                <MagnifyingGlassIcon className="w-5 h-5 p-0.3" />
              </div>
            </div>
            <div className="flex flex-col mx-2 md:mx-0">
              <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                  <div className="overflow-hidden">
                    <table className="min-w-full text-left text-sm font-light ">
                      <thead className="border-b font-medium dark:border-neutral-500 overflow-auto">
                        <tr>
                          <th scope="col" className="px-6 py-4">
                            #
                          </th>
                          <th scope="col" className=" px-6 py-4">
                            Image
                          </th>
                          <th scope="col" className=" px-6 py-4">
                            Username
                          </th>
                          <th scope="col" className="px-6 py-4">
                            Name
                          </th>
                          <th scope="col" className="px-6 py-4">
                            Email
                          </th>
                          <th scope="col" className="px-6 py-4">
                            Role
                          </th>
                          <th scope="col" className="px-6 py-4">
                            Verified
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {userList

                          .filter((res) =>
                            input
                              ? res.username.includes(input) ||
                                res.email.includes(input) ||
                                res.role.name.includes(input) ||
                                res.name.includes(input)
                              : res
                          )
                          .filter((res, index) => {
                            if (!input) {
                              index += 1;
                              return index >= startIndex && index <= endIndex;
                            } else {
                              return res;
                            }
                          })
                          .map((res, index) => {
                            return (
                              <tr
                                key={index}
                                className="border-b transition duration-300 ease-in-out hover:bg-white hover:bg-opacity-50 dark:border-neutral-500 dark:hover:bg-neutral-600"
                              >
                                <td className="whitespace-nowrap px-6 py-4 font-medium">
                                  {res.id}
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 font-medium">
                                  {res.img ? (
                                    <img
                                      src={res.img}
                                      className="h-8 w-8 rounded-full object-cover"
                                    />
                                  ) : (
                                    <UserIcon className="h-8 w-8 rounded-full object-cover" />
                                  )}
                                </td>
                                <td className="whitespace-nowrap px-6 py-4">
                                  {res.username}
                                </td>
                                <td className="whitespace-nowrap px-6 py-4">
                                  {res.name}
                                </td>
                                <td className="whitespace-nowrap px-6 py-4">
                                  {res.email}
                                </td>
                                <td className="whitespace-nowrap px-6 py-4">
                                  {res.role.name}
                                </td>
                                <td className="whitespace-nowrap px-6 py-4">
                                  {res.verified ? "Yes" : "No"}
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex w-full justify-center items-center space-x-2 mx-2 md:mx-0">
              {!input &&
                pagination.map((res, index) => {
                  const isActive =
                    startIndex === indexPerPage * res - indexPerPage + 1;
                  return (
                    <div key={index}>
                      <button
                        onClick={() => {
                          setStartIndex(indexPerPage * res - indexPerPage + 1);
                          setEndIndex(indexPerPage * res);
                        }}
                        className={`${
                          isActive
                            ? "bg-gray-800 hover:opacity-80"
                            : "hover:font-bold"
                        } h-8 w-8  rounded-full`}
                      >
                        {res}
                      </button>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}

export default Users;

export async function getServerSideProps(context) {
  const cryptr = new Cryptr(process.env.SECRET_KEY);
  const cookies = new Cookies(context.req, context.res);
  const email = cookies.get("auth");

  if (email === undefined) {
    return {
      redirect: {
        permanent: false,
        destination: "/auth/login",
      },
    };
  }

  const user = await prisma.user.findFirst({
    where: { AND: [{ email: cryptr.decrypt(email) }, { role_id: 1 }] },
    select: {
      id: true,
      username: true,
      name: true,
      email: true,
      role_id: true,
      img: true,
      verified: true,
    },
  });
  const users = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      name: true,
      email: true,
      role: true,
      img: true,
      verified: true,
    },
  });
  const links = await prisma.link__group.findFirst({
    select: {
      id: true,
    },
    where: { user: { is: { email: cryptr.decrypt(email) } } },
  });

  if (!user) {
    return {
      redirect: {
        permanent: false,
        destination: "/admin",
      },
    };
  }

  return {
    props: {
      user: { ...user, groupId: links.id },
      users: JSON.stringify(users),
    }, // will be passed to the page component as props
  };
}
