import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { create } from "ipfs-http-client";
import { Buffer } from "buffer";
import Web3 from "web3";
import "./serv.css";
import caseTypes from "./caseTypes.json"; // Import caseTypes.json file

const CONTRACT_ADDRESS = "0x5Fe1D03B4124DD5D19931c139Cb08634c2663288"; // Contract address on your Ganache or other Ethereum network
const CONTRACT_ABI = [
  {
 "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "string",
          "name": "caseType",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "subType",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "fileHash",
          "type": "string"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "uploader",
          "type": "address"
        }
      ],
      "name": "DocumentUploaded",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "documents",
      "outputs": [
        {
          "internalType": "string",
          "name": "caseType",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "subType",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "fileHash",
          "type": "string"
        },
        {
          "internalType": "address",
          "name": "uploader",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_caseType",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_subType",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_fileHash",
          "type": "string"
        }
      ],
      "name": "uploadDocument",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getDocuments",
      "outputs": [
        {
          "components": [
            {
              "internalType": "string",
              "name": "caseType",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "subType",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "fileHash",
              "type": "string"
            },
            {
              "internalType": "address",
              "name": "uploader",
              "type": "address"
            }
          ],
          "internalType": "struct casedoc.Document[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    }
];

const ipfs = create({ host: "localhost", port: "5001", protocol: "http" });

const Casedoc = () => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedType, setSelectedType] = useState("");
  const [subType, setSubType] = useState("");
  const [subTypeOptions, setSubTypeOptions] = useState([]);
  const [uploadMessage, setUploadMessage] = useState("");
  const [documents, setDocuments] = useState([]);
  const navigate = useNavigate();

  const handleDocumentClick = () => {
    navigate("/Services");
  };

  const handleCaseDocumentClick = () => {
    navigate("/doc");
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

  useEffect(() => {
    const initBlockchain = async () => {
      try {
        // Connect to the blockchain via HTTP provider (Ganache or other network)
        const web3 = new Web3("http://localhost:7545"); // Adjust to your Ganache or custom RPC provider URL
        setWeb3(web3);

        // Fetch accounts directly from the connected blockchain
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts);

        // Initialize the contract instance
        const contractInstance = new web3.eth.Contract(
          CONTRACT_ABI,
          CONTRACT_ADDRESS
        );
        setContract(contractInstance);

        // Fetch documents from the blockchain
        const docs = await contractInstance.methods.getDocuments().call();
        setDocuments(docs);
      } catch (error) {
        console.error("Error initializing blockchain:", error);
      }
    };

    initBlockchain();
  }, []);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setUploadMessage(""); // Clear any previous message
  };

  const handleCaseTypeChange = (e) => {
    const caseType = e.target.value;
    setSelectedType(caseType);

    // Update subtypes based on selected case type
    const subTypes = caseType ? caseTypes[caseType] || [] : [];
    setSubTypeOptions(subTypes);
  };

  const handleFileUpload = async () => {
    if (!selectedFile || !selectedType || !subType) {
      alert("Please complete all fields and select a file!");
      return;
    }

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const buffer = Buffer.from(reader.result);
        const ipfsResponse = await ipfs.add(buffer);

        console.log("File uploaded to IPFS with hash:", ipfsResponse.path);
        setUploadMessage(
          "File uploaded successfully! IPFS Hash: " + ipfsResponse.path
        );

        // Store file metadata on the blockchain
        if (contract && account) {
          await contract.methods
            .uploadDocument(selectedType, subType, ipfsResponse.path)
            .send({ from: account[0], gas: 6721975 });
          setUploadMessage("File successfully stored on blockchain!");

          // Update document list
          const updatedDocs = await contract.methods.getDocuments().call();
          setDocuments(updatedDocs);
        } else {
          setUploadMessage("Blockchain connection error.");
        }
      };

      reader.readAsArrayBuffer(selectedFile);
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadMessage("File upload failed. Please try again.");
    }
  };

  const handleDownloadFile = async (ipfsHash) => {
    try {
      const url = `http://127.0.0.1:8080/ipfs/${ipfsHash}?download=true&filename=${ipfsHash}.pdf`;
      window.open(url, "_blank");
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  return (
    <div className="doc-container case-status-search">
      <h2 className="title">Case Status: Search by Case Document Type</h2>

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
        <button className="btn">Case Document</button>
      </div>

      <div className="document-upload">
        <h2>Case Upload</h2>
        <div className="case-d">
          {/* Case Type Dropdown */}
          <label htmlFor="caseType">
            Case file Type<span className="requd">*</span>
          </label>
          <select id="caseType" onChange={handleCaseTypeChange} required>
            <option value="">--Select--</option>
            {Object.keys(caseTypes).map((caseType, index) => (
              <option key={index} value={caseType}>
                {caseType}
              </option>
            ))}
          </select>

          {/* Sub Type Dropdown */}
          {selectedType && subTypeOptions.length > 0 && (
            <>
              <label htmlFor="subType">
                Sub Type<span className="required">*</span>
              </label>
              <select
                id="subType"
                onChange={(e) => setSubType(e.target.value)}
                required
              >
                <option value="">--Select--</option>
                {subTypeOptions.map((subType, index) => (
                  <option key={index} value={subType}>
                    {subType}
                  </option>
                ))}
              </select>
            </>
          )}

          <input type="file" onChange={handleFileChange} />
          <button onClick={handleFileUpload} className="upload-btn">
            Upload
          </button>
          {uploadMessage && <p className="upload-message">{uploadMessage}</p>}

          <div className="document-list">
            <h2>Uploaded Documents</h2>
            <table>
              <thead>
                <tr className="table_tr">
                  <th>Case Type</th>
                  <th>Sub Type</th>
                  <th>IPFS Hash</th>
                  <th>Uploader</th>
                  <th>Download</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc, index) => (
                  <tr key={index}>
                    <td>{doc.caseType}</td>
                    <td>{doc.subType}</td>
                    <td>{doc.fileHash}</td>
                    <td>{doc.uploader}</td>
                    <td>
                      <button
                        className="btn_color"
                        onClick={() => handleDownloadFile(doc.fileHash)}
                      >
                        Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Casedoc;
