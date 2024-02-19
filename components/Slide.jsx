"use client";
import { useEffect, useState } from "react";
import "../styles/Banner.scss";

const Slide = () => {
  const [randomStaticText, setRandomStaticText] = useState("");

  useEffect(() => {
    // Array of possible static texts
    const staticTexts = [
      "Click, Shop, Smile - Elevate Your Everyday with Unbeatable Deals!",
      "Discover Amazing Deals That Will Make Your Day!",
      "Shop Smart, Shop Now - Unbelievable Discounts Await!",
      "Your One-Stop Shop for Irresistible Bargains!",

      // Add more text options as needed
    ];

    // Select a random index from the array
    const randomIndex = Math.floor(Math.random() * staticTexts.length);

    // Get the random static text
    const randomStaticText = staticTexts[randomIndex];

    // Set the random static text in the state
    setRandomStaticText(randomStaticText);
  }, []); // Empty dependency array ensures this effect runs only once on mount

  return (
    <div className="banner" suppressHydrationWarning={true}>
      <h1>{randomStaticText}</h1>
    </div>
  );
};

export default Slide;
