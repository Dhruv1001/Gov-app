import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import courtData from "./courtDataIndia.json"; // Import your JSON file

const Services = () => {
  const [startDate, setStartDate] = useState(null);
  const [selectedState, setSelectedState] = useState("");
  const [selectedCourt, setSelectedCourt] = useState("");
  const [courtOptions, setCourtOptions] = useState([]);
  const [benchOptions, setBenchOptions] = useState([]);
  const [yearOptions, setYearOptions] = useState([]);
  const [actTypeOptions, setActTypeOptions] = useState([]);
  const navigate = useNavigate(); // Initialize navigate

  // Handle state change and update court options
  const handleStateChange = (e) => {
    const state = e.target.value;
    setSelectedState(state);
    const courts = state ? courtData[state]?.courts || [] : [];
    const actTypes = state ? courtData[state]?.actTypes || [] : [];
    setCourtOptions(courts);
    setActTypeOptions(actTypes); // Set act types for the state
    setSelectedCourt(""); // Reset court selection
    setBenchOptions([]); // Reset bench options
    setYearOptions([]); // Reset year options
  };

  // Handle court change and update bench options and years
  const handleCourtChange = (e) => {
    const court = e.target.value;
    setSelectedCourt(court);
    const benches = selectedState
      ? courtData[selectedState]?.benches[court] || []
      : [];
    const years = selectedState ? courtData[selectedState]?.years || [] : [];
    setBenchOptions(benches); // Update bench options based on court selection
    setYearOptions(years); // Update years based on state
  };

  const handleDocumentClick = () => {
    navigate("/doc");
  };

  const handleCaseDocumentClick = () => {
    navigate("/casedoc");
  };
  const handleFirnum = () => {
    navigate("/Fir");
  };
  const handleCasenum = () => {
    navigate("/Casenum");
  };
  // const handleserv = () => {
  //   navigate("/service");
  // };

  return (
    <div className="case-status-search">
      <h2 className="title">Case Status: Search by Act Type</h2>

      <div className="button-group">
        <button className="btn" onClick={handleCasenum}>
          Case Number
        </button>
        <button className="btn" onClick={handleFirnum}>
          FIR Number
        </button>
        <button className="btn">Party Name</button>
        <button className="btn">Advocate Name</button>
        <button className="btn">Case Code</button>
        <button className="btn">Act</button>
        <button className="btn" onClick={handleDocumentClick}>
          Form-28
        </button>
        <button className="btn" onClick={handleCaseDocumentClick}>
          Case Document
        </button>
      </div>

      <div className="search-form">
        <form>
          {/* State field */}
          <div className="form-group">
            <label htmlFor="state">
              State <span className="required">*</span>
            </label>
            <select id="state" onChange={handleStateChange} required>
              <option value="">--Select--</option>
              {Object.keys(courtData).map((state, index) => (
                <option key={index} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>

          {/* Court field */}
          <div className="form-group">
            <label htmlFor="court">
              Court <span className="required">*</span>
            </label>
            <select id="court" onChange={handleCourtChange} required>
              <option value="">--Select--</option>
              {courtOptions.map((court, index) => (
                <option key={index} value={court}>
                  {court}
                </option>
              ))}
            </select>
          </div>

          {/* Bench field */}
          <div className="form-group">
            <label htmlFor="bench">
              Bench <span className="required">*</span>
            </label>
            <select id="bench" required>
              <option value="">--Select--</option>
              {benchOptions.map((bench, index) => (
                <option key={index} value={bench}>
                  {bench}
                </option>
              ))}
            </select>
          </div>

          {/* Case year */}
          <div className="form-group">
            <label htmlFor="caseYear">
              Case Year <span className="required">*</span>
            </label>
            <select id="caseYear" required>
              <option value="">--Select--</option>
              {yearOptions.map((year, index) => (
                <option key={index} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          {/* Act Type field */}
          <div className="form-group">
            <label htmlFor="actType">
              Act Type <span className="required">*</span>
            </label>
            <select id="actType" required>
              <option value="">--Select--</option>
              {actTypeOptions.map((actType, index) => (
                <option key={index} value={actType}>
                  {actType}
                </option>
              ))}
            </select>
          </div>

          {/* Order date */}
          <div className="form-group">
            <label htmlFor="orderDate">
              Order Date <span className="required">*</span>
            </label>
            <DatePicker
              id="orderDate"
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              placeholderText="Select Order Date"
              dateFormat="dd/MM/yyyy"
              className="datepicker"
            />
          </div>

          <div className="form-group">
            <label htmlFor="captcha">
              Please Enter the Captcha <span className="required">*</span>
            </label>
            <div className="captcha-box">
              <img src="captcha_image_placeholder.png" alt="Captcha" />
              <button type="button" className="btn-refresh">
                ⟳
              </button>
              <button type="button" className="btn-sound">
                🔊
              </button>
            </div>
            <input
              type="text"
              id="captcha"
              placeholder="Enter Captcha Code"
              required
            />
          </div>

          <div className="button-group">
            <button type="submit" className="btn">
              Submit
            </button>
            <button type="reset" className="btn btn-reset">
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Services;
