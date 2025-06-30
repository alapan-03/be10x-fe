import React, { useEffect, useState } from "react";
import "./App.css";
import MutualFundCard from "./MutualFundCard";
import Modal from "./Modal";
import { zoomies } from "ldrs";
import Cookies from "universal-cookie";
import toast, { Toaster } from "react-hot-toast";
import URL from "./../../url.js";
import { ring } from "ldrs";
ring.register();
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
  const [saveLoading, setSaveLoading] = useState(false);

  // Fetch saved on load
  useEffect(() => {
    fetch(`${URL}/api/mutualfunds`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookies.get("token")}`, 
      },
    })
      .then((res) => res.json())
      .then((data) => setSavedFunds(data))
      .catch((err) => {
        toast.error("Failed to fetch saved funds");
        // return;
        console.error("Failed to fetch saved funds", err);
      });
  }, []);

  const toggleSave = async (fund) => {
    setSaveLoading(true);
    const token = cookies.get("token");

    if (!token) {
      toast.error("You need to be logged in to save funds");
      return;
    }

    const alreadySaved =
      savedFunds &&
      savedFunds.length > 0 &&
      savedFunds.find((f) => f.schemeCode === fund.schemeCode);

    try {
      if (alreadySaved) {
        // UNSAVE: Remove from backend and local state
        const res = await fetch(`${URL}/api/mutualfunds/${fund.schemeCode}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          toast.error("Failed to remove fund");
          throw new Error(`Remove failed: ${res.status}`);
        }

        // Update frontend state
        setSavedFunds((prev) =>
          prev.filter((f) => f.schemeCode !== fund.schemeCode)
        );
      } else {
        // SAVE: Send just this fund
        const res = await fetch(`${URL}/api/mutualfunds`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(fund),
        });

        // if (!res.ok) {
        //   toast.error("Failed to save fund");
        //   throw new Error(`Save failed: ${res.status}`);
        // }

        // Update frontend state
        // setSavedFunds((prev) => [...prev, fund]);
        setSavedFunds((prev) => (Array.isArray(prev) ? [...prev, fund] : [fund]));

      }

      setSaveLoading(false);
    } catch (err) {
      console.error("Error while saving/removing fund:", err);
      toast.error("Something went wrong");
      setSaveLoading(false);
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

  const filteredData =
    data?.length > 0 &&
    data.filter((fund) =>
      fund.schemeName.toLowerCase().includes(search.toLowerCase())
    );

  const totalPages = Math.ceil(filteredData?.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems =
    filteredData &&
    filteredData?.length > 0 &&
    filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="app">
      <h1 className="title" id="scroll-entry">
        Mutual Fund Explorer
      </h1>
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

      {loading && (
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

      <div className="card-container">
        {currentItems.length === 0 ? (
          <p className="no-results">No matching mutual funds found.</p>
        ) : (
          currentItems &&
          currentItems.length > 0 &&
          currentItems?.map((fund) => (
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
                  !!savedFunds?.length > 0 &&
                  savedFunds?.find((f) => f.schemeCode === fund.schemeCode)
                }
                saveLoading={saveLoading}
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
