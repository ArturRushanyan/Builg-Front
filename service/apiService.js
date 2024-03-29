import axios from "axios";
import { getJWTFromLocalStorage } from "./auth";

const axiosCall = async (data) => {
  return axios({ ...data }).then((res) => {
    return res.data;
  });
};

export const signIn = async (userData) => {
  const axiosParams = {
    method: "POST",
    url: `${process.env.NEXT_PUBLIC_STRAPI_URL}/auth/local`,
    data: userData,
  };

  return axiosCall(axiosParams);
};

export const signUp = async (userData) => {
  const axiosParams = {
    method: "POST",
    url: `${process.env.NEXT_PUBLIC_STRAPI_URL}/auth/local/register`,
    data: userData,
  };

  return axiosCall(axiosParams);
};

export const updateMe = (updatedUserInfo) => {
  const jwt = getJWTFromLocalStorage();

  const axiosParams = {
    method: "PUT",
    url: `${process.env.NEXT_PUBLIC_STRAPI_URL}/user/me`,
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${jwt}`,
    },
    data: updatedUserInfo,
  };

  return axiosCall(axiosParams);
};

export const getSyncUsers = async (offset, limit) => {
  const jwt = getJWTFromLocalStorage();

  const axiosParams = {
    method: "GET",
    url: `${process.env.NEXT_PUBLIC_STRAPI_URL}/user/sync-users?limit=${limit}&offset=${offset}`,
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${jwt}`,
    },
  };
  return axiosCall(axiosParams);
};

export const getReviews = async (company_address, limit, lastElementId) => {
  let outscraperUrl = `https://api.app.outscraper.com/maps/reviews-v3?query=${company_address}&reviewsLimit=${limit}&async=false&sort=newest&fields=reviews_data`;

  if (lastElementId !== "") {
    outscraperUrl += `&lastPaginationId=${lastElementId}`;
  }

  const axiosParams = {
    method: "GET",
    url: outscraperUrl,
    headers: {
      "x-api-key": process.env.NEXT_PUBLIC_OUTSCRAPER_API_KEY,
    },
  };

  const reviewResponse = await axiosCall(axiosParams);
  return reviewResponse.data[0].reviews_data;
};
