import React, { useEffect, useState } from "react";
import api from "../../services/api";
import ChallengeCard from "./ChallengeCard";
import ChallengeFilters from "../../components/ChallengeFilters";
import SearchBar from "../../components/SearchBar";
import "./challenges.css";
import AppNavbar from "../../components/navbar/navbar";
import Footer from "../../components/footer/footer"

const Challenges = () => {
  const [allChallenges, setAllChallenges] = useState([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("popular");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 6;

  
  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    try {
      const res = await api.get("/Challenges"); 
      setAllChallenges(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  /*  RESET PAGE ON FILTER CHANGE  */
  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedCategory, selectedDifficulty, sortBy]);

  

  let filtered = [...allChallenges];

  // Category filter (using tags[0])
  if (selectedCategory !== "All") {
  filtered = filtered.filter(
    (c) =>
      c.category &&
      c.category.toLowerCase() === selectedCategory.toLowerCase()
  );
}

  // Difficulty filter (using level)
  if (selectedDifficulty.length > 0) {
    filtered = filtered.filter((c) =>
      selectedDifficulty.includes(c.level)
    );
  }

  // Search filter
  if (search.trim() !== "") {
    filtered = filtered.filter((c) =>
      c.title.toLowerCase().includes(search.toLowerCase())
    );
  }

  // Sorting
  if (sortBy === "popular") {
    filtered.sort((a, b) => b.participants - a.participants); 
  }

  if (sortBy === "duration") {
    filtered.sort((a, b) => b.duration - a.duration);
  }

  /*  PAGES*/

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;

  const paginatedChallenges = filtered.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <>
    <AppNavbar/>
    <div className="challenges-page">

      {/* SIDEBAR */}
      <ChallengeFilters
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedDifficulty={selectedDifficulty}
        setSelectedDifficulty={setSelectedDifficulty}
      />

      {/*  MAIN CONTENT  */}
      <div className="challenges-content">

        <SearchBar
          search={search}
          setSearch={setSearch}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />

        <h2 className="browse-title">Browse Challenges</h2>

        {/* GRID */}
        <div className="challenges-grid">
          {paginatedChallenges.length > 0 ? (
            paginatedChallenges.map((challenge) => (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
              />
            ))
          ) : (
            <p className="no-results">No challenges found.</p>
          )}
        </div>

        {/* PAGES */}
        {totalPages > 1 && (
          <div className="pagination">
            <span
              onClick={() =>
                setCurrentPage((prev) =>
                  prev > 1 ? prev - 1 : prev
                )
              }
            >
              Previous
            </span>

            {[...Array(totalPages)].map((_, i) => (
              <span
                key={i}
                className={
                  currentPage === i + 1 ? "active-page" : ""
                }
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </span>
            ))}

            <span
              onClick={() =>
                setCurrentPage((prev) =>
                  prev < totalPages ? prev + 1 : prev
                )
              }
            >
              Next
            </span>
          </div>
        )}
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default Challenges;