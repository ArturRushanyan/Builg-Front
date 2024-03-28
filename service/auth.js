"use client";

export const setLocalStorage = (data) => {
  localStorage.setItem("userData", JSON.stringify(data.user));
  localStorage.setItem("jwt", data.jwt);
};

export const unsetLocalStorage = () => {
  localStorage.removeItem("userData");
  localStorage.removeItem("jwt");
};

export const getUserFromLocalStorage = () => {
  return localStorage.getItem("userData");
};

export const setUserToLocalStorage = (user) => {
  localStorage.setItem("userData", JSON.stringify(user));
};

export const getJWTFromLocalStorage = () => {
  return localStorage.getItem("jwt");
};
