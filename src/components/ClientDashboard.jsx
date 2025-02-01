import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import './FileUpload.css'; // Assuming the updated CSS is in FileUpload.css

const ClientDashboard = () => {
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [files, setFiles] = useState([]);
  const [web3, setWeb3] = useState(null);
  const [lawyers, setLawyers] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedLawyer, setSelectedLawyer] = useState(null);
  const [message, setMessage] = useState('');
  const [user, setUser] = useState({ name: 'John Doe' }); // Replace with actual user data fetching logic

  const CONTRACT_ADDRESS = '0x91263b573922bc13b89Da72E7adCeAa46ed9eb41';
  const CONTRACT_ABI = [{
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "fileName",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "caseNumber",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "ipfsHash",
        "type": "string"
      }
    ],
    "name": "FileUploaded",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "fileName",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "caseNumber",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "ipfsHash",
        "type": "string"
      }
    ],
    "name": "uploadFile",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAllFiles",
    "outputs": [
      {
        "components": [
          {
            "internalType": "string",
            "name": "fileName",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "caseNumber",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "ipfsHash",
            "type": "string"
          }
        ],
        "internalType": "struct MyContract.FileInfo[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [],
    "name": "getUserFiles",
    "outputs": [
      {
        "components": [
          {
            "internalType": "string",
            "name": "fileName",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "caseNumber",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "ipfsHash",
            "type": "string"
          }
        ],
        "internalType": "struct MyContract.FileInfo[]",
        "name": "",
        "type": "tuple[]"
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
        "name": "ipfsHash",
        "type": "string"
      }
    ],
    "name": "getFileByHash",
    "outputs": [
      {
        "components": [
          {
            "internalType": "string",
            "name": "fileName",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "caseNumber",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "ipfsHash",
            "type": "string"
          }
        ],
        "internalType": "struct MyContract.FileInfo",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  }
  ]; // Updated path


  useEffect(() => {
    const init = async () => {
      try {
        const web3Instance = new Web3('http://127.0.0.1:7545'); // Replace with your Ganache RPC URL
        setWeb3(web3Instance);

        // const contract = await getContract(web3);
        // setContract(contract);

        // Initialize contract
        const contractInstance = new web3Instance.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
        setContract(contractInstance);

        fetchFilesFromBlockchain(contractInstance);
        fetchLawyers();
      } catch (error) {
        console.error('Error:', error);
      }
    };
    init();
  }, []);

  const fetchFilesFromBlockchain = async (contractInstance) => {
    try {
      const files = await contractInstance.methods.getAllFiles().call();
      setFiles(files);
    } catch (error) {
      console.error('Error fetching files:', error);
    }
  };

  const fetchLawyers = async () => {
    try {
      const response = await fetch('http://localhost:5000/lawyers');
      if (response.ok) {
        const result = await response.json();
        setLawyers(result);
      } else {
        console.error('Failed to fetch lawyers');
      }
    } catch (error) {
      console.error('Error fetching lawyers:', error);
    }
  };

  const handleShare = async () => {
    if (!selectedFile || !selectedLawyer) {
      setMessage('Please select a file and a lawyer to share.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/share', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ fileName: selectedFile, lawyerId: selectedLawyer })
      });

      if (response.ok) {
        const result = await response.text();
        setMessage(result);
      } else {
        const errorMessage = await response.text();
        setMessage(errorMessage);
      }
    } catch (error) {
      console.error('Error sharing file:', error);
      setMessage('Error sharing file.');
    }
  };

  const handleDownload = async (ipfsHash) => {
    try {
      const url = `http://127.0.0.1:8080/ipfs/${ipfsHash}?download=true&filename=${ipfsHash}.pdf`;
      window.open(url, '_blank');
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };
  

  return (
    <div className="file-upload-container">
      <h1>Client Dashboard</h1>
      <p>Welcome, {user.name}</p>

      <h2>Uploaded Files</h2>
      <table className="file-table">
        <thead>
          <tr>
            <th>File Name</th>
            <th>Case Number</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {files.map(file => (
            <tr key={file.ipfsHash}>
              <td>{file.fileName}</td>
              <td>{file.caseNumber}</td>
              <td>
                <button
                  className="download-button"
                  onClick={() => handleDownload(file.ipfsHash)}
                > 
                  Download
                </button>
                <button className='c-btn' onClick={() => setSelectedFile(file.fileName)}>Share</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedFile && (
        <div className="share-section">
          <h3>Share {selectedFile} with a Lawyer</h3>
          <select onChange={(e) => setSelectedLawyer(e.target.value)}>
            <option value="">Select a Lawyer</option>
            {lawyers.map(lawyer => (
              <option key={lawyer.id} value={lawyer.id}>
                {lawyer.name}
              </option>
            ))}
          </select>
          <button onClick={handleShare}>Share</button>
        </div>
      )}

      {message && <p>{message}</p>}
    </div>
  );
};

export default ClientDashboard;
