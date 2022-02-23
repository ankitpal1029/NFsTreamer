//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;
pragma experimental ABIEncoderV2;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";
import "hardhat/console.sol";

contract LazyNFT is ERC721URIStorage, EIP712, Ownable, AccessControlEnumerable{
  using ECDSA for bytes32;

  // to keep track of tokenIds generated (that is the ones you make a voucher for)
  Counters.Counter private _tokenIds;
  // address of the NFTmarketplace

  bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");


  mapping (address => uint256) pendingWithdrawals;
  // mapping for approvedMinters
  // Market Item
  struct MarketItem{
      uint256 tokenId;
      address owner;
      address creator;
      uint256 price;
      string uri;
      string collection;
      uint256 tier;
  }
  mapping(address => MarketItem[]) nftsOwned;

  constructor()
    ERC721("LazyNFT", "LAZ") 
    EIP712("LazyNFT-Voucher", "1") {
      // giving owner of contract MINTER_ROLE and DEFAULT_ADMIN_ROLE
      _setupRole(MINTER_ROLE, msg.sender);
      _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);

    }

  /// @notice Represents an un-minted NFT, which has not yet been recorded into the blockchain. A signed voucher can be redeemed for a real NFT using the redeem function.
  struct NFTVoucher {
    /// @notice The id of the token to be redeemed. Must be unique - if another token with this ID already exists, the redeem function will revert.
    uint256 tokenId;

    /// @notice The minimum price (in wei) that the NFT creator is willing to accept for the initial sale of this NFT.
    uint256 minPrice;

    /// @notice The metadata URI to associate with this token.
    string uri;
    string collection;
    uint256 tier;
  }

  function setNewMinter(address _addr) public onlyOwner{
    grantRole(MINTER_ROLE, _addr);
  }

  function removeMinter(address _addr) public onlyOwner {
    revokeRole(MINTER_ROLE, _addr);
  }
  /// @notice Redeems an NFTVoucher for an actual NFT, creating it in the process.
  /// @param redeemer The address of the account which will receive the NFT upon success.
  /// @param voucher An NFTVoucher that describes the NFT to be redeemed.
  /// @param signature An EIP712 signature of the voucher, produced by the NFT creator.

  struct NFTCID {
    string v_url;
  }


  function redeem(address redeemer, NFTVoucher calldata voucher, NFTCID calldata meta,bytes memory signature) public payable returns (uint256) {
    // make sure signature is valid and get the address of the signer
    address signer = _verify(meta, signature);
    console.log("The signer is: ", signer);


    // make sure that the signer is authorized to mint NFTs
    require(hasRole(MINTER_ROLE, signer), "Signature invalid or unauthorized");

    // Check if 

    // make sure that the redeemer is paying enough to cover the buyer's cost
    require(msg.value >= voucher.minPrice, "Insufficient funds to redeem");

    // first assign the token to the signer, to establish provenance on-chain
    _mint(signer, voucher.tokenId);
    _setTokenURI(voucher.tokenId, voucher.uri);

    MarketItem memory newItemToPush = MarketItem({
                                          tokenId: voucher.tokenId, 
                                          owner: redeemer, 
                                          creator: signer, 
                                          price: voucher.minPrice, 
                                          uri: voucher.uri, 
                                          collection: voucher.collection,
                                          tier: voucher.tier
                                        });
    //nftsOwned[redeemer].push()
    nftsOwned[redeemer].push(newItemToPush);
    
    // transfer the token to the redeemer
    _transfer(signer, redeemer, voucher.tokenId);

    // record payment to signer's withdrawal balance
    pendingWithdrawals[signer] += msg.value;


    return voucher.tokenId;
  }

  function withdraw() public {
    require(hasRole(MINTER_ROLE, msg.sender), "Only authorized minters can withdraw");
    
    // IMPORTANT: casting msg.sender to a payable address is only safe if ALL members of the minter role are payable addresses.
    address payable receiver = payable(msg.sender);

    uint amount = pendingWithdrawals[receiver];
    // zero account before transfer to prevent re-entrancy attack
    pendingWithdrawals[receiver] = 0;
    receiver.transfer(amount);
  }

  function availableToWithdraw() public view returns (uint256) {
    return pendingWithdrawals[msg.sender];
  }


  
  function _hash(NFTCID calldata meta) internal view returns (bytes32) {

    return _hashTypedDataV4(keccak256(abi.encode(
      keccak256("NFTCID(string v_url)"),
      keccak256(bytes(meta.v_url))
    )));
  }


  
  function _verify(NFTCID calldata meta, bytes memory signature) internal view returns (address) {
    bytes32 digest = _hash(meta);
    return digest.toEthSignedMessageHash().recover(signature);
  }

  function supportsInterface(bytes4 interfaceId) public view virtual override (AccessControlEnumerable, ERC721) returns (bool) {
    return ERC721.supportsInterface(interfaceId) || AccessControl.supportsInterface(interfaceId);
  }

  function getAddress() public view returns (address){
    return address(this);
  }

  function fetchNFTsOwned(address _reqAddress) public view returns (MarketItem[] memory){
    console.log(_reqAddress);
    return nftsOwned[_reqAddress];
  }
}
