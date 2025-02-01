// Login.js
import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import AccountForm from './AccountForm';
import './login.css';

// Define the ABI and address for your contract
const CONTRACT_ADDRESS = '0x960de7c7715995997254FD597e01a4B7D1401cAb';
const CONTRACT_ABI = [{
  "inputs": [
    {
      "internalType": "string",
      "name": "_username",
      "type": "string"
    },
    {
      "internalType": "string",
      "name": "_password",
      "type": "string"
    }
  ],
  "name": "register",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
},
{
  "inputs": [
    {
      "internalType": "string",
      "name": "_password",
      "type": "string"
    }
  ],
  "name": "login",
  "outputs": [
    {
      "internalType": "bool",
      "name": "",
      "type": "bool"
    }
  ],
  "stateMutability": "view",
  "type": "function",
  "constant": true
},
{
  "inputs": [],
  "name": "getUsername",
  "outputs": [
    {
      "internalType": "string",
      "name": "",
      "type": "string"
    }
  ],
  "stateMutability": "view",
  "type": "function",
  "constant": true
}];

const Login = () => {
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [loginStatus, setLoginStatus] = useState(false);
  const [retrievedUsername, setRetrievedUsername] = useState('');

  useEffect(() => {
    const init = async () => {
      try {
        // Initialize web3
        const web3 = new Web3(Web3.givenProvider || 'http://localhost:7545'); // Use Ganache or your provider
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);

        // Initialize contract
        const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
        setContract(contract);

        console.log('Page has been loaded');
      } catch (error) {
        console.error('Error:', error);
      }
    };
    init();
  }, []);

  const handleLogin = async (password) => {
    if (contract) {
      const passwordHash = Web3.utils.sha3(password);
      const result = await contract.methods.login(passwordHash).call({ from: account });
      setLoginStatus(result);
    }
  };

  const getUsername = async () => {
    if (contract) {
      const username = await contract.methods.getUsername().call({ from: account });
      setRetrievedUsername(username);
    }
  };

  return (
    <div>
      <AccountForm contract={contract} account={account} />
      <button onClick={getUsername}>Retrieve Username</button>
      <div>
        {retrievedUsername && <p>Retrieved Username: {retrievedUsername}</p>}
        <p>Login Status: {loginStatus ? 'Logged in' : 'Not logged in'}</p>
      </div>
    </div>
  );
};

export default Login;
