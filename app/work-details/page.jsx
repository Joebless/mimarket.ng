// Import necessary modules and components
"use client";
import "@styles/WorkDetails.scss";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Loader from "@components/Loader";
import Navbar from "@components/Navbar";
import Link from "next/link";

import {
  ArrowForwardIos,
  Edit,
  FavoriteBorder,
  ArrowBackIosNew,
  ShoppingCart,
  Favorite,
} from "@mui/icons-material";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const WorkDetails = () => {
  const [loading, setLoading] = useState(true);
  const [work, setWork] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visiblePhotos, setVisiblePhotos] = useState(5);
  const [selectedPhoto, setSelectedPhoto] = useState(0);
  const [error, setError] = useState(null);

  const searchParams = useSearchParams();
  const workId = searchParams.get("id");

  const { data: session, update } = useSession();
  const { workPhotoPaths, creator } = work;
  const userId = session?.user?._id;

  const router = useRouter();

  useEffect(() => {
    const getWorkDetails = async () => {
      try {
        const response = await fetch(`api/work/${workId}`, {
          method: "GET",
        });

        if (!response.ok) {
          throw new Error(
            `Failed to fetch work details. Status: ${response.status}`
          );
        }

        const data = await response.json();
        setWork(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching work details:", error);
        setError(`Failed to fetch work details. ${error.message}`);
        setLoading(false);
      }
    };

    if (workId) {
      getWorkDetails();
    }
  }, [workId]);

  const goToNextSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex + 1) % (workPhotoPaths?.length || 1)
    );
  };

  const goToPrevSlide = () => {
    setCurrentIndex(
      (prevIndex) =>
        (prevIndex - 1 + (workPhotoPaths?.length || 1)) %
        (workPhotoPaths?.length || 1)
    );
  };

  const loadMorePhotos = () => {
    setVisiblePhotos(workPhotoPaths?.length || 0);
  };

  const handleSelectedPhoto = (index) => {
    setSelectedPhoto(index);
    setCurrentIndex(index);
  };

  const { wishlist } = session?.user || {};
  const isLiked = wishlist?.find((item) => item?._id === work._id);

  const patchWishlist = async () => {
    try {
      const response = await fetch(`api/user/${userId}/wishlist/${work._id}`, {
        method: "PATCH",
      });

      if (!response.ok) {
        throw new Error("Failed to update wishlist");
      }

      const data = await response.json();
      update({ user: { wishlist: data.wishlist } });
    } catch (error) {
      console.error("Error updating wishlist:", error);
    }
  };

  const userCart = session?.user?.cart;
  const cart = Array.isArray(userCart) ? userCart : [];

  const isInCart = cart?.find((item) => item?.workId === workId);

  const addToCart = async () => {
    const newCartItem = {
      workId,
      image: workPhotoPaths?.[0],
      title: work.title,
      category: work.category,
      creator: work.creator,
      price: work.price,
      quantity: 1,
    };

    if (!isInCart) {
      const newCart = [...cart, newCartItem];

      try {
        await fetch(`/api/user/${userId}/cart`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ cart: newCart }),
        });
        update({ user: { cart: newCart } });
      } catch (err) {
        console.error("Error adding to cart:", err);
      }
    } else {
      confirm("This item is already in your cart");
    }
  };

  return (
    <>
      <Navbar />
      <div className="work-details">
        {loading ? (
          <Loader />
        ) : error ? (
          <div className="error-message">
            {error}{" "}
            <button onClick={() => router.reload()} className="retry-button">
              Retry
            </button>
          </div>
        ) : (
          <>
            <div className="title">
              <h1>{work.title}</h1>
              {creator?._id === userId ? (
                <div
                  className="save"
                  onClick={() => {
                    router.push(`/update-work?id=${workId}`);
                  }}
                >
                  <Edit />
                  <p>Edit</p>
                </div>
              ) : (
                <div className="save" onClick={patchWishlist}>
                  {isLiked ? (
                    <Favorite sx={{ color: "red" }} />
                  ) : (
                    <FavoriteBorder />
                  )}
                  <p>Save</p>
                </div>
              )}
            </div>

            <div className="slider-container">
              <div
                className="slider"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {workPhotoPaths?.map((photo, index) => (
                  <div className="slide" key={index}>
                    <img
                      src={photo}
                      alt="work"
                      loading="lazy" // Add lazy loading attribute
                    />
                    <div className="prev-button" onClick={goToPrevSlide}>
                      <ArrowBackIosNew sx={{ fontSize: "15px" }} />
                    </div>
                    <div className="next-button" onClick={goToNextSlide}>
                      <ArrowForwardIos sx={{ fontSize: "15px" }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="photos">
              {workPhotoPaths?.slice(0, visiblePhotos)?.map((photo, index) => (
                <img
                  src={photo}
                  alt="work-demo"
                  key={index}
                  onClick={() => handleSelectedPhoto(index)}
                  className={selectedPhoto === index ? "selected" : ""}
                  loading="lazy" // Add lazy loading attribute
                />
              ))}

              {visiblePhotos < (workPhotoPaths?.length || 0) && (
                <div className="show-more" onClick={loadMorePhotos}>
                  <ArrowForwardIos sx={{ fontSize: "40px" }} />
                  Show More
                </div>
              )}
            </div>

            <hr />

            <div className="profile">
              <img
                src={creator?.profileImagePath}
                alt="profile"
                onClick={() => router.push(`/shop?id=${creator?._id}`)}
              />
              <h3>Created by {creator?.username}</h3>
              <br />
              <span style={{ color: "blue" }}>
                Call: <span style={{ color: "red" }}>{work.phone}</span>
              </span>
            </div>
            <hr />

            <h3>About this product</h3>
            <p>{work.description}</p>

            <h1>#{work.price}</h1>
            {session?.user ? (
              <button type="submit" onClick={addToCart}>
                <ShoppingCart />
                ADD TO CART
              </button>
            ) : (
              <p>
                Please{" "}
                <Link href="/login">
                  <span
                    style={{
                      textDecoration: "underline",
                      color: "blue",
                      cursor: "pointer",
                    }}
                  >
                    log in
                  </span>
                </Link>{" "}
                to add items to your cart.
              </p>
            )}
          </>
        )}
        <Link href="/">Go Back</Link>
      </div>
    </>
  );
};

export default WorkDetails;
