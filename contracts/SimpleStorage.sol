// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
pragma experimental ABIEncoderV2;

contract SimpleStorage {
  
  struct Ipfsinfo {
        string patientId;
        string result;
  }

  Ipfsinfo[] public ipfsinfoarr;
  uint256 public arrcount;

  function set(string memory _patientId, string memory _result) public {
    ipfsinfoarr.push(Ipfsinfo(_patientId, _result));
    arrcount += 1;
  }

  function get(uint _i) public view returns (Ipfsinfo memory) {
    return ipfsinfoarr[_i];
  }

  function getArrSize() public view returns (uint256) {
    return arrcount;
  }
}
