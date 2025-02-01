import React, { useState, useEffect } from "react";
import Web3 from "web3";
import { create } from "ipfs-http-client";
import "./upload.css";
import CONTRACT_JSON from "../contracts/MyContract.json"; // Updated path
console.log(Array.isArray(CONTRACT_JSON)); //T or F

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState([]);
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [accounts, setAccounts] = useState([]);

  const CONTRACT_ADDRESS = "0x4B7e13DcCE9433bAb07fB5a6a36E97038bF79EB3";
  const CONTRACT_ABI = [
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "user",
          type: "address",
        },
        {
          indexed: false,
          internalType: "string",
          name: "fileName",
          type: "string",
        },
        {
          indexed: false,
          internalType: "string",
          name: "caseNumber",
          type: "string",
        },
        {
          indexed: false,
          internalType: "string",
          name: "ipfsHash",
          type: "string",
        },
      ],
      name: "FileUploaded",
      type: "event",
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "fileName",
          type: "string",
        },
        {
          internalType: "string",
          name: "caseNumber",
          type: "string",
        },
        {
          internalType: "string",
          name: "ipfsHash",
          type: "string",
        },
      ],
      name: "uploadFile",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "getAllFiles",
      outputs: [
        {
          components: [
            {
              internalType: "string",
              name: "fileName",
              type: "string",
            },
            {
              internalType: "string",
              name: "caseNumber",
              type: "string",
            },
            {
              internalType: "string",
              name: "ipfsHash",
              type: "string",
            },
          ],
          internalType: "struct MyContract.FileInfo[]",
          name: "",
          type: "tuple[]",
        },
      ],
      stateMutability: "view",
      type: "function",
      constant: true,
    },
    {
      inputs: [],
      name: "getUserFiles",
      outputs: [
        {
          components: [
            {
              internalType: "string",
              name: "fileName",
              type: "string",
            },
            {
              internalType: "string",
              name: "caseNumber",
              type: "string",
            },
            {
              internalType: "string",
              name: "ipfsHash",
              type: "string",
            },
          ],
          internalType: "struct MyContract.FileInfo[]",
          name: "",
          type: "tuple[]",
        },
      ],
      stateMutability: "view",
      type: "function",
      constant: true,
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "ipfsHash",
          type: "string",
        },
      ],
      name: "getFileByHash",
      outputs: [
        {
          components: [
            {
              internalType: "string",
              name: "fileName",
              type: "string",
            },
            {
              internalType: "string",
              name: "caseNumber",
              type: "string",
            },
            {
              internalType: "string",
              name: "ipfsHash",
              type: "string",
            },
          ],
          internalType: "struct MyContract.FileInfo",
          name: "",
          type: "tuple",
        },
      ],
      stateMutability: "view",
      type: "function",
      constant: true,
    },
  ]; // Updated path
  console.log(CONTRACT_ABI);
  // Create IPFS client instance pointing to the local node
  const ipfs = create({ host: "localhost", port: "5001", protocol: "http" });

  useEffect(() => {
    const initWeb3 = async () => {
      try {
        // Connect to local Ganache instance
        const web3Instance = new Web3("http://127.0.0.1:7545"); // Replace with your Ganache RPC URL
        setWeb3(web3Instance);

        // Get accounts from Ganache
        const accounts = await web3Instance.eth.getAccounts();
        setAccounts(accounts);

        // Initialize contract
        const contractInstance = new web3Instance.eth.Contract(
          CONTRACT_ABI,
          CONTRACT_ADDRESS
        );
        setContract(contractInstance);

        // Fetch files from blockchain
        fetchFilesFromBlockchain(contractInstance);
      } catch (error) {
        console.error("Error initializing Web3:", error);
      }
    };

    initWeb3();
  }, []);

  const fetchFilesFromBlockchain = async (contractInstance) => {
    try {
      const files = await contractInstance.methods.getAllFiles().call();
      setFiles(files);
      // setMessage('Successfully fetched files from blockchain.');
    } catch (error) {
      console.error("Error fetching files from blockchain:", error);
      // setMessage('Error fetching files from blockchain.');
      // setMessage(`Error fetching files: ${error.message}`);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !contract) {
      setMessage("Please select a file or initialize the contract.");
      return;
    }

    try {
      if (file.type !== "application/pdf") {
        setMessage("Please upload a PDF file.");
        return;
      }

      const addedFile = await ipfs.add(file);
      const ipfsHash = addedFile.path;

      const caseNumber = `C/${Math.floor(Math.random() * 10000)}/${Date.now()}`;

      await contract.methods
        .uploadFile(file.name, caseNumber, ipfsHash)
        .send({ from: accounts[0], gas: 6721975 });
      setMessage("File uploaded successfully.🎉");

      fetchFilesFromBlockchain(contract);
    } catch (error) {
      console.error("Error uploading file:", error);
      setMessage("Please Wait !!!.");
    }
  };

  return (
    <div className="judge-cont">
      <h1>File Upload</h1>
      <form onSubmit={handleSubmit} className="upload-con">
        <div className="file-input-wrapper">
          <label htmlFor="file" className="file-input-label"></label>
          <input type="file" id="file" onChange={handleFileChange} required />
        </div>
        <button type="submit" className="upload-button">
          Upload
        </button>
      </form>
      <p>{message}</p>
      <h2>Uploaded Files:</h2>
      <table className="file-table">
        <thead>
          <tr>
            <th>File Name</th>
            <th>Case Number</th>
            <th>Hash</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file, index) => (
            <tr key={index}>
              <td>{file.fileName}</td>
              <td>{file.caseNumber}</td>
              <td>
                <a
                  href={`http://127.0.0.1:8080/ipfs/${file.ipfsHash}?download=true&filename=${file.ipfsHash}.pdf`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {file.ipfsHash}
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FileUpload;
