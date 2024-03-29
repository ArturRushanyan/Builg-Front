"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import InfiniteScroll from "react-infinite-scroll-component";

import Nav from "../nav/page";
import { getUserFromLocalStorage } from "../../service/auth";
import { getSyncUsers, getReviews } from "../../service/apiService";

const Dashboard = () => {
  const router = useRouter();

  const [showReviewsInfo, setShowReviewsInfo] = useState({
    company_address: "",
    company_name: "",
    showReviews: false,
  });

  const [usersList, setUsersList] = useState([]);

  const [syncedUser, setSyncedUser] = useState(false);

  const [userInfiniteScrollInfo, setUserInfiniteScrollInfo] = useState({
    offset: 0,
    limit: 10,
    hasMore: true,
  });

  const [reviewInfiniteScrollInfo, setReviewInfiniteScrollInfo] = useState({
    limit: 20,
    hasMore: true,
    lastReviewId: "",
  });

  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const userData = JSON.parse(getUserFromLocalStorage());
    if (!userData) {
      return router.replace("/");
    }
    if (userData.sync_google_reviews) {
      setSyncedUser(userData.sync_google_reviews);

      getSyncUsers(userInfiniteScrollInfo.offset, userInfiniteScrollInfo.limit)
        .then((usersList) => {
          setUserInfiniteScrollInfo((prevState) => {
            return {
              ...prevState,
              offset:
                userInfiniteScrollInfo.offset + userInfiniteScrollInfo.limit,
            };
          });
          setUsersList((prevState) => {
            return [...prevState, ...usersList.syncUsers];
          });
        })
        .catch((error) => {
          alert(error);
        });
    }
  }, []);

  const detailedReviewCloseHandler = () => {
    setShowReviewsInfo({
      company_address: "",
      company_name: "",
      showReviews: false,
    });

    setReviewInfiniteScrollInfo({
      limit: 4,
      hasMore: true,
      lastReviewId: "",
    });

    setReviews([]);
  };

  const reviewsDetailsHandler = async (item) => {
    setReviews([]);

    setShowReviewsInfo(() => {
      return {
        company_address: item.company_address,
        company_name: item.company_name,
        showReviews: true,
      };
    });

    setReviewInfiniteScrollInfo({
      limit: 20,
      hasMore: true,
      lastReviewId: "",
    });

    const responseData = await getReviews(
      `${item.company_address} ${item.company_name}`,
      reviewInfiniteScrollInfo.limit,
      reviewInfiniteScrollInfo.lastReviewId
    );
    if (responseData.length === 0) {
      alert("There is no place");
      setShowReviewsInfo((prevState) => {
        return { ...prevState, showReviews: false };
      });
      return;
    }
    const lastReviewItem = responseData.slice(-1);

    setReviewInfiniteScrollInfo((prevState) => {
      return {
        ...prevState,
        lastReviewId: lastReviewItem[0].review_pagination_id,
      };
    });

    setReviews(responseData);
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  const getMoreUsers = async () => {
    setUserInfiniteScrollInfo((prevState) => {
      return {
        ...prevState,
        offset: userInfiniteScrollInfo.offset + userInfiniteScrollInfo.limit,
      };
    });

    const res = await getSyncUsers(
      userInfiniteScrollInfo.offset,
      userInfiniteScrollInfo.limit
    );

    if (res.syncUsers.length === 0) {
      setUserInfiniteScrollInfo((prevState) => {
        return { ...prevState, hasMore: false };
      });
    }
    setUsersList((prevState) => {
      return [...prevState, ...res.syncUsers];
    });
  };

  const getMoreReviews = async () => {
    const reviewsData = await getReviews(
      `${showReviewsInfo.company_address} ${showReviewsInfo.company_name}`,
      reviewInfiniteScrollInfo.limit,
      reviewInfiniteScrollInfo.lastReviewId
    );

    if (reviewsData.length === 0) {
      setReviewInfiniteScrollInfo((prevState) => {
        return { ...prevState, hasMore: false };
      });
      return;
    }

    const lastReview = reviewsData.slice(-1);

    setReviews((prevState) => {
      return [...prevState, ...reviewsData];
    });

    setReviewInfiniteScrollInfo((prevState) => {
      return {
        ...prevState,
        lastReviewId: lastReview[0].review_pagination_id,
      };
    });
  };

  return (
    <main>
      <Nav />
      {syncedUser && (
        <div className="h-[calc(100vh-160px)] m-10 flex flex-row bg-white relative">
          <div className="w-full flex flex-col overflow-auto h-full p-5">
            <InfiniteScroll
              dataLength={usersList.length}
              next={getMoreUsers}
              hasMore={userInfiniteScrollInfo.hasMore}
              loader={<h3 className="text-center"> Loading...</h3>}
              height={"700px"}
              endMessage={<h4 className="text-center">Nothing more to show</h4>}
              style={{ maxHeight: "h-full" }}
            >
              {usersList.map((item) => (
                <div key={`${item.id} - ${Math.random()}`}>
                  <div className="bg-whit border border-gry-700 my-4 grid grid-cols-2">
                    <div className="flex flex-row">
                      <div>
                        <img
                          src="user.png"
                          width={"50px"}
                          className="m-2 ml-5 object-contain"
                        />
                      </div>
                      <div className="m-2 flex flex-col">
                        <span>
                          {item.first_name} {item.last_name}
                        </span>
                        <span>{item.email}</span>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <button
                        className="text-3xl mr-2"
                        onClick={() => reviewsDetailsHandler(item)}
                      >
                        &gt;
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </InfiniteScroll>
          </div>
          {showReviewsInfo.showReviews && (
            <div className="flex flex-col w-full 1/2 text-left my-4 mx-10 py-5">
              <div id="top" className="grid grid-cols-2">
                <div className="flex flex-row">
                  <div className="flex flex-col">
                    <span className="justify-start font-bold my-2">
                      {showReviewsInfo.company_name}
                    </span>
                    <div className="flex flex-row mb-3">
                      <img
                        src="location.png"
                        width={22}
                        className="object-contain"
                      />
                      <p>{showReviewsInfo.company_address}</p>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    className="text-3xl flex mr-1"
                    onClick={() => detailedReviewCloseHandler()}
                  >
                    &#10005;
                  </button>
                </div>
              </div>
              <hr />
              <div className="overflow-auto h-full pr-8">
                <InfiniteScroll
                  dataLength={reviews.length}
                  next={getMoreReviews}
                  hasMore={reviewInfiniteScrollInfo.hasMore}
                  loader={<h3 className="text-center"> Loading...</h3>}
                  height={"700px"}
                  endMessage={
                    <h4 className="text-center">Nothing more to show</h4>
                  }
                  style={{ maxHeight: "h-full" }}
                >
                  {reviews.map((item) => (
                    <div
                      key={item.author_id + Math.random()}
                      className="my-10 "
                    >
                      <div className="grid grid-cols-2">
                        <div className="flex flex-row">
                          <img
                            src={item.author_image}
                            width={"25px"}
                            className="mb-2 object-contain"
                          />
                          <span className="ml-2">{item.author_title}</span>
                        </div>
                        <div className="flex justify-end">
                          {formatDate(item.review_datetime_utc)}
                        </div>
                      </div>
                      <div className="text-left flex-grow">
                        <p>{item.review_text}</p>
                      </div>
                    </div>
                  ))}
                </InfiniteScroll>
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  );
};

export default Dashboard;
