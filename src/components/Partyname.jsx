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
  const handleCasenum = () => {
    navigate("/Casenum");
  };
  const handleFirnum = () => {
    navigate("/Fir");
  };
  const handleParty = () => {
    navigate("/Party");
  };

  return (
    <div className="doc-container case-status-search">
      <h2 className="title">Party Name: Search by Party Name</h2>

      <div className="button-group">
        <button className="btn" onClick={handleCasenum}>
          Case Number
        </button>
        <button className="btn" onClick={handleFirnum}>
          FIR Number
        </button>
        <button className="btn" onClick={handleParty}>
          Party Name
        </button>
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
