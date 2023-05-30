import { Container } from "@/components/molecules/container";
import { Navbar } from "@/components/organism/navbar";
import Cookies from "cookies";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
const { createHash } = require("crypto");

export function SignUp() {
  const router = useRouter();
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [usernameError, setUsernameError] = useState(false);
  const { error } = router.query;
  const emailRef = useRef(null);
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);

  async function onSubmitHandler(event) {
    event.preventDefault();

    const getData = new FormData(event.target);
    const data = {
      email: getData.get("email"),
      password: getData.get("password"),
    };
    console.log(createHash("sha256").update(data.password).digest("hex"));
  }

  const onBlurHandler = (refInput) => {
    if (refInput.current?.value === "") {
      if (refInput.current.name === "email") {
        setEmailError({
          name: refInput.current.name,
          msg: "Please enter email!",
        });
      } else if (refInput.current.name === "password") {
        setPasswordError({
          name: refInput.current.name,
          msg: "Please enter password!",
        });
      } else {
        setUsernameError({
          name: refInput.current.name,
          msg: "Please enter username!",
        });
      }
    } else {
      if (refInput.current.name === "email") {
        const splitted = refInput.current.value.split("@");
        if (
          !refInput.current?.value.includes("@") ||
          !splitted[1].includes(".")
        ) {
          setEmailError({
            name: refInput.current.name,
            msg: "Incorrect email format!",
          });
        } else {
          setEmailError(false);
        }
      } else {
        setPasswordError(false);
      }
    }
  };
  return (
    <>
      {/* Navbar */}
      <Navbar />

      {/* Form */}
      <Container>
        <div className="flex w-full h-screen justify-center items-center">
          <div className="flex-row w-full md:w-min p-10 mx-2 md:mx-0 bg-white bg-opacity-70 backdrop-blur-sm rounded-3xl ">
            <div className="flex-row mb-5 text-gray-800">
              <div>
                <h1 className="text-3xl font-bold">Sign Up</h1>
                <span className="text-sm opacity-50 ">
                  Please, log in to your account.
                </span>
              </div>
              {error && (
                <div className="flex items-center w-full md:w-80 bg-red-500 rounded-lg p-2 opacity-80 mt-2">
                  <span className="text-sm  text-gray-100 p-2">{error}</span>
                </div>
              )}
            </div>
            <form action="/api/auth/signup" method="POST">
              <div className="flex-row space-y-4 text-gray-800">
                <div className="flex-row">
                  <div>
                    <input
                      ref={usernameRef}
                      onBlur={onBlurHandler.bind(this, usernameRef)}
                      minLength="3"
                      name="username"
                      id="username"
                      type="text"
                      placeholder="Username"
                      className="w-full md:w-80 p-3 px-2 bg-transparent placeholder:text-gray-500 focus:outline-none border-b-2 border-b-gray-800   "
                      required
                    />
                  </div>
                  {usernameError && (
                    <span className="text-xs text-red-500 opacity-50 ">
                      {usernameError.msg}
                    </span>
                  )}
                </div>
                <div className="flex-row">
                  <div>
                    <input
                      ref={emailRef}
                      onBlur={onBlurHandler.bind(this, emailRef)}
                      minLength="3"
                      name="email"
                      id="email"
                      type="email"
                      placeholder="Email"
                      className="w-full md:w-80 p-3 px-2 bg-transparent placeholder:text-gray-500 focus:outline-none border-b-2 border-b-gray-800   "
                      required
                    />
                  </div>
                  {emailError && (
                    <span className="text-xs text-red-500 opacity-50 ">
                      {emailError.msg}
                    </span>
                  )}
                </div>
                <div className="flex-row">
                  <div>
                    <input
                      ref={passwordRef}
                      onBlur={onBlurHandler.bind(this, passwordRef)}
                      minLength="3"
                      name="password"
                      id="password"
                      type="password"
                      placeholder="Password"
                      className="w-full md:w-80 p-3 px-2 bg-transparent placeholder:text-gray-500 focus:outline-none border-b-2 border-b-gray-800   "
                      required
                    />
                  </div>
                  {passwordError && (
                    <span className="text-xs text-red-500 opacity-50 ">
                      {passwordError.msg}
                    </span>
                  )}
                </div>
              </div>
              <button type="submit" className="w-full">
                <div className="flex justify-center items-center mt-5 bg-gray-800 hover:opacity-80 p-4 rounded-full  text-gray-300">
                  Sign Up
                </div>
              </button>
            </form>
            <div className="flex justify-center items-center mt-5">
              <a
                href="/auth/login"
                className="text-gray-800 opacity-50 hover:opacity-100"
              >
                Back to Login
              </a>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}

export default SignUp;

export async function getServerSideProps(context) {
  const cookies = new Cookies(context.req, context.res);
  const email = cookies.get("auth");

  if (email !== undefined) {
    return {
      redirect: {
        permanent: false,
        destination: "/admin",
      },
    };
  }

  return {
    props: {}, // will be passed to the page component as props
  };
}
