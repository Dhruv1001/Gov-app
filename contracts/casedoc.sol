// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract casedoc{
    struct Document {
        string caseType;
        string subType;
        string fileHash; // Use IPFS hash
        address uploader;
    }

    Document[] public documents;

    event DocumentUploaded(string caseType, string subType, string fileHash, address indexed uploader);

    function uploadDocument(string memory _caseType, string memory _subType, string memory _fileHash) public {
        documents.push(Document(_caseType, _subType, _fileHash, msg.sender));
        emit DocumentUploaded(_caseType, _subType, _fileHash, msg.sender);
    }

    function getDocuments() public view returns (Document[] memory) {
        return documents;
    }
}
