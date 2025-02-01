import MyContract from './contracts/MyContract.json';

const getContract = async (web3) => {
  const networkId = await web3.eth.net.getId();
  const deployedNetwork = MyContract.networks[networkId];
  const instance = new web3.eth.Contract(
    MyContract.abi,
    deployedNetwork && deployedNetwork.address,
  );
  return instance;
};

export default getContract;
