// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MyContract {
    struct FileInfo {
        string fileName;
        string caseNumber;
        string ipfsHash;
    }

    FileInfo[] private files;
    mapping(address => FileInfo[]) private userFileList;

    event FileUploaded(address indexed user, string fileName, string caseNumber, string ipfsHash);

    function uploadFile(string memory fileName, string memory caseNumber, string memory ipfsHash) public {
        FileInfo memory newFile = FileInfo(fileName, caseNumber, ipfsHash);
        files.push(newFile);
        userFileList[msg.sender].push(newFile);
        emit FileUploaded(msg.sender, fileName, caseNumber, ipfsHash);
    }

    function getAllFiles() public view returns (FileInfo[] memory) {
        return files;
    }

    function getUserFiles() public view returns (FileInfo[] memory) {
        return userFileList[msg.sender];
    }

    function getFileByHash(string memory ipfsHash) public view returns (FileInfo memory) {
        for (uint i = 0; i < files.length; i++) {
            if (keccak256(abi.encodePacked(files[i].ipfsHash)) == keccak256(abi.encodePacked(ipfsHash))) {
                return files[i];
            }
        }
        revert("File not found");
    }
}
