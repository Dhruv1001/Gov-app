import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "./serv.css";
import { text } from "@fortawesome/fontawesome-svg-core";

const Doc = () => {
  const [drawnDate, setDrawnDate] = useState(null); // Separate state for Drawn Date
  const [filedDate, setFiledDate] = useState(null); // Separate state for Filed Date
  const [selectedFile, setSelectedFile] = useState(null);
  const [petitionersA, setPetitionersA] = useState([""]); // For Court A's petitioners
  const [petitionersB, setPetitionersB] = useState([""]); // For Court B's petitioners
  const [textAreas, setTextAreas] = useState({
    courtA: "",
    courtB: "",
    mostRespectfully: "",
    questionsOfLaw: "",
    declarationRule4: "",
    declarationRule6: "",
    grounds: "",
    groundInterm: "",
    mainPrayer: "",
    intermRelief: "",
  });
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleDocumentClick = () => {
    navigate("/Services");
  };

  const handleCaseDocumentClick = () => {
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
  const handleFileUpload = () => {
    if (selectedFile) {
      // Handle file upload logic here (e.g., send to server or IPFS)
      console.log("File uploaded:", selectedFile);
    } else {
      alert("Please select a file first!");
    }
  };

  // Add new petitioner's name field for Court A
  const handleAddPetitionerA = () => {
    setPetitionersA([...petitionersA, ""]);
  };

  // Add new petitioner's name field for Court B
  const handleAddPetitionerB = () => {
    setPetitionersB([...petitionersB, ""]);
  };

  // Handle petitioner name change for Court A
  const handlePetitionerChangeA = (index, event) => {
    const newPetitioners = [...petitionersA];
    newPetitioners[index] = event.target.value;
    setPetitionersA(newPetitioners);
  };

  // Handle petitioner name change for Court B
  const handlePetitionerChangeB = (index, event) => {
    const newPetitioners = [...petitionersB];
    newPetitioners[index] = event.target.value;
    setPetitionersB(newPetitioners);
  };

  // auto resize
  const textareaRefs = {
    courtA: useRef(null),
    courtB: useRef(null),
    mostRespectfully: useRef(null),
    questionsOfLaw: useRef(null),
    declarationRule4: useRef(null),
    declarationRule6: useRef(null),
    grounds: useRef(null),
    groundInterm: useRef(null),
    mainPrayer: useRef(null),
    intermRelief: useRef(null),
  };
  const handleChange = (field) => (event) => {
    const newValue = event.target.value;
    setTextAreas((prev) => ({ ...prev, [field]: newValue }));

    if (textareaRefs[field].current) {
      textareaRefs[field].current.style.height = "41px"; // Reset height
      textareaRefs[
        field
      ].current.style.height = `${textareaRefs[field].current.scrollHeight}px`; // Set height based on content
    }
  };
  useEffect(() => {
    // Set initial heights for all text areas
    Object.values(textareaRefs).forEach((ref) => {
      if (ref.current) {
        ref.current.style.height = "41px"; // Reset height
        ref.current.style.height = `${ref.current.scrollHeight}px`; // Set height based on content
      }
    });
  }, [textAreas]);
  return (
    <>
      <div className="doc-container case-status-search">
        <h2 className="title">Case Status: Search by Form-28 Type</h2>

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
          <button className="btn" onClick={handleDocumentClick}>
            Form-28
          </button>
          <button className="btn" onClick={handleCaseDocumentClick}>
            Case Document
          </button>
        </div>

        <div className="document-upload">
          <h2 style={{ textTransform: "uppercase", fontWeight: "500" }}>
            Form-28
          </h2>

          {/* Merged Form Section for Court A and Court B */}
          <div className="doc">
            <form action="">
              {/* Court A Section */}
              <textarea
                ref={textareaRefs.courtA}
                value={textAreas.courtA}
                onChange={handleChange("courtA")}
                type="text"
                placeholder="(A)"
                rows="2"
              />
              {petitionersA.map((petitioner, index) => (
                <div key={index}>
                  <input
                    type="text"
                    placeholder="PETITIONER, RESPONDENT NAME"
                    value={petitioner}
                    onChange={(event) => handlePetitionerChangeA(index, event)}
                  />
                </div>
              ))}
              <button
                type="button"
                className="upload-btn"
                style={{ marginBottom: "8px" }}
                onClick={handleAddPetitionerA}
              >
                Add Petitioner's Name (A)
              </button>
              {/* Court B Section */}
              <textarea
                ref={textareaRefs.courtB}
                value={textAreas.courtB}
                onChange={handleChange("courtB")}
                type="text"
                placeholder="(B)"
                rows="2"
              />
              {petitionersB.map((petitioner, index) => (
                <div key={index}>
                  <input
                    type="text"
                    placeholder="PETITIONER, RESPONDENT NAME"
                    value={petitioner}
                    onChange={(event) => handlePetitionerChangeB(index, event)}
                  />
                </div>
              ))}
              <button
                type="button"
                className="upload-btn"
                onClick={handleAddPetitionerB}
              >
                Add Petitioner's Name (B)
              </button>
              {/* General Information Section */}
              <label>
                1.MOST RESPECTFULLY SHEWETH:<span className="required">*</span>
              </label>
              <textarea
                ref={textareaRefs.mostRespectfully}
                value={textAreas.mostRespectfully}
                onChange={handleChange("mostRespectfully")}
                cols="30"
                rows="10"
              ></textarea>
              <label>
                2.QUESTIONS OF LAW:
                <span className="required">*</span>
              </label>
              <textarea
                ref={textareaRefs.questionsOfLaw}
                value={textAreas.questionsOfLaw}
                onChange={handleChange("questionsOfLaw")}
                cols="30"
                rows="10"
              ></textarea>
              <label>
                3. DECLARATION IN TERMS OF RULE 4(2):
                <span className="required">*</span>
              </label>
              <textarea
                ref={textareaRefs.declarationRule4}
                value={textAreas.declarationRule4}
                onChange={handleChange("declarationRule4")}
                cols="30"
                rows="10"
              ></textarea>
              <label>
                4. DECLARATION IN TERMS OF RULE 6:
                <span className="required">*</span>
              </label>
              <textarea
                ref={textareaRefs.declarationRule6}
                value={textAreas.declarationRule6}
                onChange={handleChange("declarationRule6")}
                cols="30"
                rows="10"
              ></textarea>
              <label>
                5. GROUNDS:
                <span className="required">*</span>
              </label>
              <textarea
                ref={textareaRefs.grounds}
                value={textAreas.grounds}
                onChange={handleChange("grounds")}
                cols="30"
                rows="10"
              ></textarea>
              <label>
                6. GROUNDS FOR INTERIM RELIEF
                <span className="required">*</span>
              </label>
              <textarea
                ref={textareaRefs.groundInterm}
                value={textAreas.groundInterm}
                onChange={handleChange("groundInterm")}
                cols="30"
                rows="10"
              ></textarea>
              <label>
                7. MAIN PRAYER
                <span className="required">*</span>
              </label>
              <textarea
                ref={textareaRefs.mainPrayer}
                value={textAreas.mainPrayer}
                onChange={handleChange("mainPrayer")}
                cols="30"
                rows="10"
              ></textarea>
              <label>
                8. INTERIM RELIEF:
                <span className="required">*</span>
              </label>
              <textarea
                ref={textareaRefs.intermRelief}
                value={textAreas.intermRelief}
                onChange={handleChange("intermRelief")}
                cols="30"
                rows="10"
              ></textarea>
              <label> DRAWN BY:</label>
              <input type="text" placeholder="Place" />
              <DatePicker
                id="Date"
                selected={drawnDate}
                onChange={(date) => setDrawnDate(date)}
                placeholderText="Drawn Date"
                dateFormat="dd/MM/yyyy"
                className="datepicker"
              />
              <DatePicker
                id="Date"
                selected={filedDate}
                onChange={(date) => setFiledDate(date)}
                placeholderText="Filed Date"
                dateFormat="dd/MM/yyyy"
                className="datepicker"
              />
              <input
                type="text"
                placeholder="Advocate for the Petitioner
"
              />
              {/* File Upload Section */}
              <div className="u_btn">
                <input type="file" onChange={handleFileChange} />
                <button onClick={handleFileUpload} className="upload-btn">
                  Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Doc;
