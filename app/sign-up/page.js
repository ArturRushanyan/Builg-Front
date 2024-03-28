"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import { setLocalStorage } from "../../service/auth";
import { signUp } from "../../service/apiService";

const SignUp = () => {
  const router = useRouter();
  const [userData, setUserData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
  });

  const emailChangeHandler = (event) => {
    setUserData((prevState) => {
      return { ...prevState, email: event.target.value };
    });
  };

  const firstNameChangeHandler = (event) => {
    setUserData((prevState) => {
      return { ...prevState, firstName: event.target.value };
    });
  };

  const lastNameChangeHandler = (event) => {
    setUserData((prevState) => {
      return { ...prevState, lastName: event.target.value };
    });
  };

  const passwordChangeHandler = (event) => {
    setUserData((prevState) => {
      return { ...prevState, password: event.target.value };
    });
  };

  const confirmPasswordChangeHandler = (event) => {
    setUserData((prevState) => {
      return { ...prevState, confirmPassword: event.target.value };
    });
  };

  const handelSubmit = async (event) => {
    event.preventDefault();

    if (userData.password !== userData.confirmPassword) {
      alert("Passwords mismatch");
      return;
    }

    const userRegistrationData = {
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      password: userData.password,
      username: userData.email,
    };

    try {
      const res = await signUp(userRegistrationData);
      console.log("res =>>>", res);
      // const res = await axios.post(
      //   `${process.env.NEXT_PUBLIC_STRAPI_URL}/auth/local/register`,
      //   userRegistrationData
      // );
      if (res) {
        setLocalStorage(res.data);
      } else {
        alert("Something went wrong");
      }

      router.replace("/dashboard");
    } catch (err) {
      console.log("error =>>", err);
      alert(err.response.data.error.message);
    }
  };

  const inputChangeHandler = (identifier, value) => {
    switch (identifier) {
      case "email":
        emailChangeHandler(value);
        break;
      case "firstName":
        firstNameChangeHandler(value);
        break;
      case "lastName":
        lastNameChangeHandler(value);
        break;
      case "password":
        passwordChangeHandler(value);
        break;
      case "confirmPassword":
        confirmPasswordChangeHandler(value);
        break;
      default:
        break;
    }
  };

  return (
    <main>
      <div className="h-screen flex items-center justify-center">
        <div className="p-8 lg:w-auto bg-gray-200 rounded shadow-md">
          <h2 className="text-2xl mb-4">Sign Up</h2>

          <form className="items-center justify-center" onSubmit={handelSubmit}>
            <div className="w-full lg:w-auto mb-4">
              <label className="block mb-2">Email</label>
              <input
                type="text"
                className="w-full px-4 py-2 border"
                required={true}
                onChange={(event) => {
                  inputChangeHandler("email", event);
                }}
              />
            </div>
            <div className="w-full lg:w-auto mb-4">
              <label className="block mb-2">First Name</label>
              <input
                type="text"
                className="w-full px-4 py-2 border"
                onChange={(event) => {
                  inputChangeHandler("firstName", event);
                }}
              />
            </div>
            <div className="w-full lg:w-auto mb-4">
              <label className="block mb-2">Last Name</label>
              <input
                type="text"
                className="w-full px-4 py-2 border"
                onChange={(event) => {
                  inputChangeHandler("lastName", event);
                }}
              />
            </div>
            <div className="w-full lg:w-auto mb-4">
              <label className="block mb-2">Password</label>
              <input
                type="password"
                className="w-full px-4 py-2 border"
                onChange={(event) => {
                  inputChangeHandler("password", event);
                }}
              />
            </div>
            <div className="w-full lg:w-auto mb-4">
              <label className="block mb-2">Confirm password</label>
              <input
                type="password"
                className="w-full px-4 py-2 border"
                onChange={(event) => {
                  inputChangeHandler("confirmPassword", event);
                }}
              />
            </div>
            <button
              type="submit"
              className="w-full lg:w-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mr-2 rounded"
            >
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default SignUp;
