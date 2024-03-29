"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { setLocalStorage } from "@/service/auth";
import { signIn } from "@/service/apiService";

const SignIn = () => {
  const router = useRouter();
  const [userData, setUserData] = useState({
    identifier: "",
    password: "",
  });

  const identifierChangeHandler = (event) => {
    setUserData((prevState) => {
      return { ...prevState, identifier: event.target.value };
    });
  };

  const passwordChangeHandler = (event) => {
    setUserData((prevState) => {
      return { ...prevState, password: event.target.value };
    });
  };

  const inputChangeHandler = (identifier, value) => {
    switch (identifier) {
      case "identifier":
        identifierChangeHandler(value);
        break;
      case "password":
        passwordChangeHandler(value);
        break;
      default:
        break;
    }
  };

  const submitHandler = async (event) => {
    event.preventDefault();

    const userInputData = {
      identifier: userData.identifier,
      password: userData.password,
    };

    try {
      const res = await signIn(userInputData);

      if (res) {
        setLocalStorage(res);
      } else {
        alert("Something went wrong");
      }

      router.replace("/dashboard");
    } catch (err) {
      alert(err.response.data.error.message);
    }

    setUserData(() => {
      return { identifier: "", password: "" };
    });
  };

  return (
    <main>
      <div className="flex justify-center items-center h-screen">
        <div className="p-8 bg-gray-200 rounded shadow-md">
          <h2 className="text-2xl mb-4">Sign In</h2>

          <form
            className="flex flex-wrap justify-between"
            onSubmit={submitHandler}
          >
            <div className="w-full lg:w-1/2 mb-4 px-2">
              <label className="block mb-2">Email</label>
              <input
                type="text"
                className="w-full px-4 py-2 border"
                onChange={(event) => {
                  inputChangeHandler("identifier", event);
                }}
              />
            </div>
            <div className="w-full lg:w-1/2 mb-4 px-2">
              <label className="block mb-2">Password</label>
              <input
                type="password"
                className="w-full px-4 py-2 border"
                onChange={(event) => {
                  inputChangeHandler("password", event);
                }}
              />
            </div>
            <button
              type="submit"
              className="w-full lg:w-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 ml-2 mr-2 rounded"
            >
              Log In
            </button>
          </form>
          <p className="mx-2 my-4">
            <Link href="/sign-up">Sign Up</Link>
          </p>
        </div>
      </div>
    </main>
  );
};

export default SignIn;
