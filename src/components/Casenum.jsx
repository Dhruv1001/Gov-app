import React from "react";
import { useNavigate } from "react-router-dom";

function Casenum() {
  const navigate = useNavigate();

  const handleDocumentClick = () => {
    navigate("/Services");
  };

  const handleCaseDocumentClick = () => {
    navigate("/doc");
  };
  const handleCasDoc = () => {
    navigate("/casedoc");
  };

  return (
    <div className="doc-container case-status-search">
      <h2 className="title">Case Number: Search by Case Number Type</h2>

      <div className="button-group">
        <button className="btn">Case Number</button>
        <button className="btn">FIR Number</button>
        <button className="btn">Party Name</button>
        <button className="btn">Advocate Name</button>
        <button className="btn">Case Code</button>
        <button className="btn" onClick={handleDocumentClick}>
          Act
        </button>
        <button className="btn" onClick={handleCaseDocumentClick}>
          Form-28
        </button>
        <button className="btn" onClick={handleCasDoc}>
          Case Document
        </button>
      </div>
    </div>
  );
}

export default Casenum;
