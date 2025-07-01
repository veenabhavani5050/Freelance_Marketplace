import React, { useState, useEffect } from "react";
import "./GigCard.scss";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { ShimmerPostItem } from "react-shimmer-effects"; // Import ShimmerPostItem

const GigCard = ({ item }) => {
  const [isLoadingDelayed, setIsLoadingDelayed] = useState(true); // State to manage delayed loading
  const { isLoading, error, data } = useQuery({
    queryKey: [item.userId],
    queryFn: () =>
      newRequest.get(`/users/${item.userId}`).then((res) => {
        return res.data;
      }),
  });

  useEffect(() => {
    // Simulate a delay before displaying the actual content
    const timer = setTimeout(() => {
      setIsLoadingDelayed(false);
    }, 1000); // Adjust the delay time as needed

    return () => clearTimeout(timer); // Cleanup timer on component unmount
  }, []);

  return (
    <Link to={`/gig/${item._id}`} className="link">
      {/* Conditionally render the shimmer effect or the GigCard component */}
      {isLoadingDelayed ? ( // Check for delayed loading state
        <ShimmerPostItem card title text cta imageWidth={300} 
        imageHeight={210} />
      ) : isLoading ? (
        <ShimmerPostItem card title text cta imageWidth={300} 
        imageHeight={210}/> // Use shimmer effect while loading
      ) : error ? (
        <div className="gigCard">
          <p>Something went wrong!</p>
        </div>
      ) : (
        <div className="gigCard">
          <img src={item.cover} alt="" />
          <div className="info">
            <div className="user">
              <img src={data.img || "/img/noavatar.jpg"} alt="" />
              <span>{data.username}</span>
            </div>
            <p>{item.title}</p>
            <div className="star">
              <img src="./img/star.png" alt="" />
              <span>
                {!isNaN(item.totalStars / item.starNumber) &&
                  Math.round(item.totalStars / item.starNumber)}
              </span>
            </div>
          </div>
          <div className="detail">
            <img src="./img/heart.png" alt="" />
            <div className="price">
              <span>STARTING AT</span>
              <h2>₹ {item.price}</h2>
            </div>
          </div>
        </div>
      )}
    </Link>
  );
};

export default GigCard;
