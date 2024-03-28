import axios from "axios";
import { getJWTFromLocalStorage } from "./auth";

const axiosCall = async (method, url) => {
  const jwt = getJWTFromLocalStorage();

  return axios({
    method,
    url,
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${jwt}`,
    },
  });
};

// Need to merge this and upper function
// and need to handel headers to send it as parameter
const axiosCallSecond = async (method, url, headersData) => {
  return axios({
    method,
    url,
    headers: {
      ...headersData,
    },
  }).then((res) => {
    return res.data;
  });
};

export const signUp = async (userData) => {
  return await axios.post(
    `${process.env.NEXT_PUBLIC_STRAPI_URL}/auth/local/register`,
    userData
  );
};

export const getSyncUsers = async (offset, limit) => {
  const url = `${process.env.NEXT_PUBLIC_STRAPI_URL}/user/sync-users?limit=${limit}&offset=${offset}`;
  return axiosCall("GET", url);
};

export const getReviews = async (company_address, { limit, lastElementId }) => {
  const returnData = [];
  let url = `https://api.app.outscraper.com/maps/reviews-v3?query=${company_address}&reviewsLimit=${limit}&async=false&sort=newest&fields=reviews_data`;

  if (lastElementId !== "") {
    url += `&lastPaginationId=${lastElementId}`;
  }

  const headers = {
    "x-api-key": process.env.NEXT_PUBLIC_OUTSCRAPER_API_KEY,
  };

  const reviewResponse = await axiosCallSecond("GET", url, headers);

  return reviewResponse.data[0].reviews_data;
};
