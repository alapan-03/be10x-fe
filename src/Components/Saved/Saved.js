import React, { useEffect, useState } from "react";
import "./../MF-Home/App.css";
import MutualFundCard from "./../MF-Home/MutualFundCard";
import Modal from "./../MF-Home/Modal";
import Cookies from "universal-cookie";
import toast, { Toaster } from "react-hot-toast";
import URL from "../../url.js";
import useToggleSave from "../../utils/useToggleSave.js";
import { Zoomies } from "ldrs/react";
import "ldrs/react/Zoomies.css";
import { useNavigate } from "react-router-dom";

function Saved() {
  const navigate = useNavigate();

  let ITEMS_PER_PAGE = 12;
  const cookies = new Cookies();

  // const [savedFunds, setSavedFunds] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFund, setSelectedFund] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const userId = cookies.get("token");
  if (!userId) {
    navigate("/login"); // Redirect to login if not authenticated
  }

  const { savedFunds, setSavedFunds, toggleSave, saveLoading } =
    useToggleSave();

  useEffect(() => {
    setLoading(true);
    fetch(`${URL}/api/mutualfunds`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userId}`, // Include token for authentication
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => setSavedFunds(data))
      .catch((err) => toast.error("Failed to fetch saved funds"))
      .finally(() => setLoading(false));
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

  return (
    <div className="app">
      <Toaster position="top-center" reverseOrder={false} />

      <h2 className="title">Saved Mutual Funds</h2>

      {loading ? (
        <Zoomies
          size="80"
          stroke="5"
          bgOpacity="0.1"
          speed="1.4"
          color="black"
        />
      ) : savedFunds?.length === 0 ? (
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
                  className="card"
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
