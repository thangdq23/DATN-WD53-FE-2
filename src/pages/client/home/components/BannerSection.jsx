import React, { useEffect, useState } from "react";

const BannerSection = ({ images = [], interval = 3000 }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, interval);

    return () => clearInterval(timer);
  }, [images.length, interval]);

  const styles = {
    bannerWrap: {
      width: "100%",
      height: 700,
      borderRadius: 12,
      marginBottom: 0,
      overflow: "hidden",
      position: "relative",
    },
    bannerImg: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      display: "block",
      transition: "opacity 0.6s ease",
    },
  };

  if (images.length === 0) return null;

  return (
    <div style={styles.bannerWrap}>
      <img key={images[index]} src={images[index]} alt="Banner" style={styles.bannerImg} />
    </div>
  );
};

export default BannerSection;
