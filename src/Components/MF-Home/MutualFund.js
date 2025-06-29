import React, { useEffect, useState } from "react";
import "./App.css";
import MutualFundCard from "./MutualFundCard";
import Modal from "./Modal";
import { zoomies } from "ldrs";
import Cookies from "universal-cookie";
import toast, { Toaster } from "react-hot-toast";
zoomies.register();

const ITEMS_PER_PAGE = 12;

function App() {
  const cookies = new Cookies();
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFund, setSelectedFund] = useState(null);
  const [savedFunds, setSavedFunds] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch saved on load
  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/mutualfunds", {
      method: "GET",  
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookies.get("token")}`, // Use token from localStorage
      }
  })
      .then((res) => res.json())
      .then((data) => setSavedFunds(data))
      .catch((err) => {
        return; 
        console.error("Failed to fetch saved funds", err)
  }
);
  }, []);


  const toggleSave = async (fund) => {
  let updated = [];
  const token = cookies.get("token");

  const alreadySaved =savedFunds?.length>0 && savedFunds?.find(f => f.schemeCode === fund.schemeCode);

  try {
    if (alreadySaved) {
      // Remove from saved
      updated = savedFunds.filter(f => f.schemeCode !== fund.schemeCode);

      const res = await fetch(`http://127.0.0.1:5000/api/mutualfunds/${fund.schemeCode}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        toast.error("Failed to delete fund: " + res.statusText);
        throw new Error(`Failed to delete fund. Status: ${res.status}`);
      }
      setSavedFunds(updated);
    } else {
      // Add to saved
      updated = savedFunds && Array.isArray(savedFunds)
        ? [...savedFunds, fund]
        : [fund];
    }

    // Update state optimistically

    const res = await fetch("http://127.0.0.1:5000/api/mutualfunds", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updated),
    });

    if (!res.ok) {
      toast.error("Failed to update saved list: " + res.statusText);
      throw new Error(`Failed to update saved list. Status: ${res.status}`);
    }
          setSavedFunds(updated);

  } catch (err) {
    console.error("Error while saving/removing fund:", err);
    toast.error("Something went wrong: " + err.message);
    // Optional: rollback UI state if needed
  }
};


  useEffect(() => {
    fetch("https://api.mfapi.in/mf")
      .then((res) => {
        setLoading(false);
        return res.json();
      })
      .then((res) => setData(res))
      .catch((err) => console.error(err));
  }, []);

  const fetchFundDetails = async (schemeCode) => {
    try {
      const res = await fetch(`https://api.mfapi.in/mf/${schemeCode}`);
      const json = await res.json();
      setSelectedFund(json);
      setModalOpen(true);
    } catch (err) {
      console.error("Error fetching details", err);
    }
  };

  const filteredData = data?.length > 0 && data.filter((fund) =>
    fund.schemeName.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData?.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = filteredData && filteredData?.length > 0 && filteredData.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="app">
      <h1 className="title">Mutual Fund Explorer</h1>
<Toaster position="top-center" reverseOrder={false} />
      <input
        type="text"
        className="search-bar"
        placeholder="Search mutual funds..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setCurrentPage(1);
        }}
      />

      {(loading ) && (
        <div className="loading-container">
          <l-zoomies
            size="80"
            stroke="5"
            bg-opacity="0.1"
            speed="1.4"
            color="black"
          ></l-zoomies>
        </div>
      )}

      <div className="card-container" id="card-container">
        {currentItems.length === 0 ? (
          <p className="no-results">No matching mutual funds found.</p>
        ) : (
          currentItems&& currentItems.length>0 && currentItems?.map((fund) => (
            <div
              key={fund.schemeCode}
              onClick={() => fetchFundDetails(fund.schemeCode)}
              style={{ cursor: "pointer" }}
            >
              <MutualFundCard
                fund={fund}
                onClick={() => fetchFundDetails(fund.schemeCode)}
                onToggleSave={toggleSave && toggleSave}
                isSaved={
                  !!savedFunds?.length>0 && savedFunds?.find((f) => f.schemeCode === fund.schemeCode)
                }
              />
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {filteredData.length > ITEMS_PER_PAGE && (
        <div className="pagination">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            ⬅ Prev
          </button>

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next ➡
          </button>
        </div>
      )}

      <Modal
        show={modalOpen}
        onClose={() => setModalOpen(false)}
        fundDetail={selectedFund}
        allFunds={currentItems}
      />
    </div>
  );
}

export default App;
