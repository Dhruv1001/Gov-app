const MyContract = artifacts.require("MyContract");
const CaseDocument = artifacts.require("casedoc");

module.exports = function (deployer) {
  deployer.deploy(MyContract);
  deployer.deploy(CaseDocument);
};
