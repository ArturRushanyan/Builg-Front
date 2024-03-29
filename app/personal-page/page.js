"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Nav from "../nav/page";
import {
  getUserFromLocalStorage,
  setUserToLocalStorage,
} from "../../service/auth";
import { updateMe } from "@/service/apiService";

const PersonalDetails = () => {
  const router = useRouter();
  const [user, setUser] = useState({
    email: "",
    first_name: "",
    last_name: "",
    company_name: "",
    company_address: "",
    sync_google_reviews: false,
  });

  useEffect(() => {
    const cachedUserData = getUserFromLocalStorage();
    if (!cachedUserData) {
      return router.replace("/");
    }

    const cachedParsedData = JSON.parse(cachedUserData);

    setUser({
      email: cachedParsedData.email,
      first_name: cachedParsedData.first_name,
      last_name: cachedParsedData.last_name,
      company_address: cachedParsedData.company_address,
      company_name: cachedParsedData.company_name,
      sync_google_reviews: cachedParsedData.sync_google_reviews,
    });
  }, []);

  const submitHandler = async (event) => {
    event.preventDefault();

    if (user.sync_google_reviews) {
      if (
        user.company_address.trim() === "" ||
        user.company_name.trim() === ""
      ) {
        alert("Company Name and Company Address fields are required");
        return;
      }
    }

    const updatedUserInfo = {
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      company_address: user.company_address,
      company_name: user.company_name,
      sync_google_reviews: user.sync_google_reviews,
    };

    try {
      const res = await updateMe(updatedUserInfo);
      if (res) {
        setUserToLocalStorage(res.user);
        router.replace("/dashboard");
      } else {
        alert("Something went wrong");
      }
    } catch (err) {
      alert(err);
    }
  };

  const emailChangeHandler = (event) => {
    setUser((prevState) => {
      return { ...prevState, email: event.target.value };
    });
  };

  const firstNameChangeHandler = (event) => {
    setUser((prevState) => {
      return { ...prevState, first_name: event.target.value };
    });
  };

  const lastNameChangeHandler = (event) => {
    setUser((prevState) => {
      return { ...prevState, last_name: event.target.value };
    });
  };

  const companyNameChangeHandler = (event) => {
    setUser((prevState) => {
      return { ...prevState, company_name: event.target.value };
    });
  };

  const companyAddressChangeHandler = (event) => {
    setUser((prevState) => {
      return { ...prevState, company_address: event.target.value };
    });
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
      case "companyName":
        companyNameChangeHandler(value);
        break;
      case "companyAddress":
        companyAddressChangeHandler(value);
        break;
      default:
        break;
    }
  };

  const handelToggleChange = (event) => {
    setUser((prevState) => {
      return {
        ...prevState,
        sync_google_reviews: !prevState.sync_google_reviews,
      };
    });
  };

  return (
    <div>
      <Nav />
      <main className="h-[calc(100vh-60px)]">
        <div className="flex h-full items-center justify-center">
          <div className="p-8 lg:w-auto bg-gray-200 rounded shadow-md">
            <h2 className="text-2xl mb-4">User Details</h2>

            <form
              className="items-center justify-center"
              onSubmit={submitHandler}
            >
              <div className="w-full lg:w-auto mb-4 px-2">
                <label className="block mb-2">Email</label>
                <input
                  type="text"
                  value={user.email}
                  className="w-full px-4 py-2 border"
                  onChange={(event) => {
                    inputChangeHandler("email", event);
                  }}
                />
              </div>
              <div className="w-full lg:w-auto mb-4 px-2">
                <label className="block mb-2">First Name</label>
                <input
                  type="text"
                  value={user.first_name}
                  className="w-full px-4 py-2 border"
                  onChange={(event) => {
                    inputChangeHandler("firstName", event);
                  }}
                />
              </div>
              <div className="w-full lg:w-auto mb-4 px-2">
                <label className="block mb-2">Last Name</label>
                <input
                  type="text"
                  value={user.last_name}
                  className="w-full px-4 py-2 border"
                  onChange={(event) => {
                    inputChangeHandler("lastName", event);
                  }}
                />
              </div>
              <div className="w-full lg:w-auto mb-4 px-2">
                <label className="block mb-2">Company Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border-red"
                  value={user.company_name || ""}
                  disabled={!user.sync_google_reviews}
                  required={user.sync_google_reviews}
                  onChange={(event) => {
                    inputChangeHandler("companyName", event);
                  }}
                />
              </div>
              <div className="w-full lg:w-auto mb-4 px-2">
                <label className="block mb-2">Company address</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border"
                  value={user.company_address || ""}
                  disabled={!user.sync_google_reviews}
                  required={user.sync_google_reviews}
                  onChange={(event) => {
                    inputChangeHandler("companyAddress", event);
                  }}
                />
              </div>
              <div>
                <label className="inline-flex items-center cursor-pointer mx-2 my-4">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    onChange={handelToggleChange}
                    value={user.sync_google_reviews}
                    checked={user.sync_google_reviews}
                  />
                  <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-700">
                    Sync google reviews
                  </span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full lg:w-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 ml-2 mr-2 rounded"
              >
                Save
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PersonalDetails;
