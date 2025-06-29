import React, { useEffect, useState } from "react";
import "./../MF-Home/App.css";
import MutualFundCard from "./../MF-Home/MutualFundCard";
import Modal from "./../MF-Home/Modal";
import Cookies from "universal-cookie";
import toast, { Toaster } from "react-hot-toast";

function Saved() {
  let ITEMS_PER_PAGE = 12;
  const cookies = new Cookies();

  const userId = cookies.get("token");
  if (!userId) {
    window.location.href = "/login"; // Redirect to login if not authenticated
  }
  const [savedFunds, setSavedFunds] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFund, setSelectedFund] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/mutualfunds", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userId}`, // Include token for authentication
      },
    })
      .then((res) => {
        if (!res.ok) {
          toast.error("Failed to fetch saved funds: " + res.statusText);
        }
        return res.json();
      })
      .then((data) => setSavedFunds(data))
      .catch((err) => toast.error("Failed to fetch saved funds: " + err.message));
  }, []);

  const fetchDetails = async (code) => {
    console.log(code + "djljnj");
    const res = await fetch(`https://api.mfapi.in/mf/${code}`);
    const json = await res.json();
    setSelectedFund(json);
    setModalOpen(true);
  };

  const totalPages = Math.ceil(savedFunds?.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems =
    savedFunds?.length > 0 &&
    savedFunds.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const toggleSave = async (fund) => {
    let updated;
    const alreadySaved = savedFunds.find(
      (f) => f.schemeCode === fund.schemeCode
    );
    if (alreadySaved) {
      updated = savedFunds.filter((f) => f.schemeCode !== fund.schemeCode);
      fetch(`http://127.0.0.1:5000/api/mutualfunds/${fund.schemeCode}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies.get("token")}`, // Use token from localStorage
        },
      });
    } else {
      updated = [...savedFunds, fund];
    }

    setSavedFunds(updated);
  };

  return (
    <div className="app">
      <Toaster position="top-center" reverseOrder={false} />

      <h2 className="title">Saved Mutual Funds</h2>

      {savedFunds?.length === 0 ? (
        <p className="no-results">You haven't saved any funds yet.</p>
      ) : (
        <div className="card-container">
          {currentItems?.length > 0 &&
            currentItems.map((fund) => (
              <div onClick={() => fetchDetails(fund.schemeCode)}>
                <MutualFundCard
                  key={fund.schemeCode}
                  fund={fund}
                  isSaved={true}
                  onToggleSave={toggleSave} // Optional here
                />
              </div>
            ))}
        </div>
      )}

      {savedFunds?.length > ITEMS_PER_PAGE && (
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
        allFunds={savedFunds}
      />
    </div>
  );
}

export default Saved;
