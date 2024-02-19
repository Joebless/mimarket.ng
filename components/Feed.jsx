"use client";
import React, { useState, useEffect } from "react";
import { categories } from "@data";
import "@styles/Categories.scss";
import Loader from "./Loader";
import WorkList from "./WorkList";

const API_ENDPOINT = "/api/work/list/";

export default function Feed() {
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [workList, setWorkList] = useState([]);

  useEffect(() => {
    setLoading(true);
    getWorkList();
  }, [selectedCategory]);

  const getWorkList = async () => {
    try {
      const response = await fetch(`${API_ENDPOINT}${selectedCategory}`);
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      setWorkList(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="categories">
        {categories?.map((item) => (
          <p
            key={item}
            className={item === selectedCategory ? "selected" : ""}
            onClick={() => setSelectedCategory(item)}
          >
            {item}
          </p>
        ))}
      </div>

      {loading ? <Loader /> : <WorkList data={workList} />}
    </>
  );
}
