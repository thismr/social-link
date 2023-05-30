import { Container } from "@/components/molecules/container";
import { InputLink } from "@/components/molecules/inputLink/inputLink";
import { Navbar } from "@/components/organism/navbar";
import prisma from "@/lib/prisma/prisma";
import {
  LinkIcon,
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

export function SignIn({ user }) {
  const router = useRouter();
  const [showInput, setShowInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [linkList, setLinkList] = useState([]);
  const [image, setImage] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  async function getLinks() {
    await axios(`/api/admin/link?groupId=${user.groupId}`).then((res) => {
      if (res.data.code === 200) {
        setLinkList(res.data.data);
      }
    });
  }

  useEffect(() => {
    if (isLoading === false) getLinks();
  }, [isLoading]);

  const refreshData = () => {
    router.replace(router.asPath);
  };
  async function onSubmitHandler(event) {
    event.preventDefault();

    const getData = new FormData(event.target);

    setIsLoading(true);
    setShowInput(false);
    axios
      .post("/api/admin/link", {
        userId: user.id,
        url: getData.get("url"),
      })
      .then((res) => {
        setIsLoading(false);
        alert("Link added!");
        console.log(res);
      });
  }

  async function onUpdateHandler(event) {
    setButtonLoading(true);
    event.preventDefault();
    try {
      if (!selectedImage) return;
      const formData = new FormData(event.target);
      const { data } = await axios.post("/api/upload/image", formData);
      console.log(data);
      refreshData();
    } catch (err) {
      console.error(err.response.data);
    }
    setButtonLoading(false);
  }

  return (
    <>
      {/* Form */}
      <Container>
        <Navbar isLoggedIn={true} user={user} />
        <div className="flex-row md:flex md:flex-row-reverse max-w-7xl h-full space-y-5 md:space-y-0 space-x-0 md:space-x-5 justify-between items-start xl:mx-28 z-10">
          <div className="flex-row w-full h-full justify-center items-center pt-32 md:w-1/2 space-y-10 px-2 md:px-20">
            <div className="flex justify-center items-center">
              {image || user.img ? (
                <img
                  src={!image ? user.img : image}
                  className="h-32 w-32 rounded-full object-cover"
                />
              ) : (
                <div className="bg-white rounded-full bg-opacity-50 backdrop-blur-lg">
                  <UserIcon className="h-32 w-32  text-gray-800 " />
                </div>
              )}
            </div>
            <form onSubmit={onUpdateHandler}>
              <div className="flex">
                <input
                  minLength="3"
                  name="img"
                  id="img"
                  type="file"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setImage(URL.createObjectURL(e.target.files[0]));
                      setSelectedImage(e.target.files[0]);
                      // console.log(e.target.files[0]);
                    } else {
                      setImage("");
                      setSelectedImage("");
                    }
                  }}
                  accept="image/*"
                  placeholder="Image"
                  className="w-full p-3 px-2 mr-10 bg-transparent text-gray-100 opacity-70 hover:opacity-100 placeholder:text-gray-500 focus:outline-none border-b-2 border-b-gray-800   "
                  required
                />
                <button type="submit" disabled={buttonLoading}>
                  <div className="flex justify-center items-center bg-gray-100 opacity-70 hover:opacity-50 backdrop-blur-sm  p-2 px-4 rounded-full  text-gray-800">
                    {buttonLoading ? "Updating..." : "Update"}
                  </div>
                </button>
              </div>
            </form>
          </div>
          <div className="flex-row w-full h-full md:pt-28 pb-10 md:w-1/2 space-y-5 px-2 md:px-0">
            <div
              onClick={() => {
                if (!showInput) setShowInput(true);
              }}
              className={`flex-row w-full p-4 px-8 justify-center items-center ${
                !showInput && "hover:cursor-pointer hover:bg-opacity-50"
              } bg-white text-gray-800 bg-opacity-70 backdrop-blur-sm rounded-3xl`}
            >
              {!showInput && (
                <div className="flex justify-center items-center">
                  <PlusIcon className="w-[20px] h-[20px] mr-1" />
                  <span className="font-semibold">Add Link</span>
                </div>
              )}
              {showInput && (
                <>
                  <div className="flex justify-between items-center mb-5">
                    <span className="font-semibold text-lg">Enter URL</span>
                    <XMarkIcon
                      onClick={() => setShowInput(false)}
                      className="w-[20px] h-[20px] opacity-50 mr-1 hover:cursor-pointer"
                    />
                  </div>
                  <form onSubmit={onSubmitHandler}>
                    <div className="flex justify-between items-center">
                      <input
                        minLength="3"
                        name="url"
                        id="url"
                        type="text"
                        placeholder="URL"
                        className="w-full p-3 px-2 mr-10 bg-transparent placeholder:text-gray-500 focus:outline-none border-b-2 border-b-gray-800   "
                        required
                      />
                      <button type="submit">
                        <div className="flex justify-center items-center bg-gray-800 hover:opacity-80 p-3 px-8 rounded-full  text-gray-300">
                          Add
                        </div>
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
            {linkList
              ?.sort((a, b) => (a.order_list > b.order_list ? 1 : -1))
              .map((link, index) => {
                return (
                  <div
                    key={index}
                    className={`flex p-3 px-4 md:px-8 justify-between items-center bg-white text-gray-800 bg-opacity-70  backdrop-blur-sm rounded-3xl`}
                  >
                    <div className="flex-row space-y-1 ">
                      <InputLink
                        title={link.title}
                        id="title"
                        name="Title"
                        linkId={link.id}
                        maxLength={20}
                        bold
                      />
                      <InputLink
                        title={link.url}
                        id="url"
                        name="URL"
                        linkId={link.id}
                      />
                    </div>
                    <div
                      onClick={() => {
                        const confirm = window.confirm(
                          `Apakah kamu yakin ingin menghapus ${link.title} ?`
                        );
                        setIsLoading(true);
                        if (confirm)
                          axios
                            .delete(`/api/admin/link?id=${link.id}`)
                            .then((res) => {
                              setIsLoading(false);
                              alert(`Link ${res.data.data.title} deleted`);
                            });
                      }}
                    >
                      <TrashIcon className="w-[18px] h-[18px] opacity-50 hover:opacity-70 hover:cursor-pointer hover:text-red-500" />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </Container>
    </>
  );
}

export default SignIn;

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
    where: { email: cryptr.decrypt(email) },
    select: {
      id: true,
      username: true,
      name: true,
      email: true,
      verified: true,
      img: true,
      role_id: true,
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
        destination: "/api/auth/logout",
      },
    };
  }

  return {
    props: { user: { ...user, groupId: links.id } }, // will be passed to the page component as props
  };
}
