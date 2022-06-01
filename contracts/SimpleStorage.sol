// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
pragma experimental ABIEncoderV2;

contract SimpleStorage {
  
  struct Ipfsinfo {
        uint256 patientId;
        string pname;
        string result;
  }

  Ipfsinfo[] public ipfsinfoarr;
  uint256 public arrcount;

  function set(string memory _pname, string memory _result) public {
    arrcount += 1;
    ipfsinfoarr.push(Ipfsinfo(arrcount, _pname, _result));
  }

  function get() public view returns (Ipfsinfo[] memory) {
    return ipfsinfoarr;
  }

  function getArrSize() public view returns (uint256) {
    return arrcount;
  }
}
