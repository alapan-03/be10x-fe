import React from "react";
import "./App.css";

function MutualFundCard({ fund, isSaved, onToggleSave, saveLoading }) {
  return (
    <div className="card">
      <div className="card-header">
        <h2>{fund.schemeName}</h2>
        <button
          className={`save-btn ${isSaved ? "saved" : ""}`}
          onClick={(e) => {
            e.stopPropagation(); // prevent opening modal
            onToggleSave(fund);
          }}
          title={isSaved ? "Unsave" : "Save"}
        >
          {isSaved ? "★" : "☆"}
        </button>
      </div>
      <p>
        <strong>Scheme Code:</strong> {fund.schemeCode}
      </p>
      {fund.isinGrowth && (
        <p>
          <strong>ISIN Growth:</strong> {fund.isinGrowth}
        </p>
      )}
      {fund.isinDivReinvestment && (
        <p>
          <strong>ISIN Reinvestment:</strong> {fund.isinDivReinvestment}
        </p>
      )}
    </div>
  );
}

export default MutualFundCard;
