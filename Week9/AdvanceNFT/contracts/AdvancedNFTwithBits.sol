// SPDX-License-Identifier: MIT
pragma solidity 0.8.1;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/structs/BitMaps.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "./WhiteList.sol";

contract AdvancedNFT is ERC721, Ownable, ReentrancyGuard {
    //~~~~~~~ Libraries ~~~~~~~
    //Import the BitMap library and point it to the data type BitMaps.BitMap struct
    using BitMaps for BitMaps.BitMap;

    //~~~~~~~ Events ~~~~~~~
    event RevealedRandomTokenId(uint256 _randomNumber, address _owner);

    //~~~~~~~ Structs ~~~~~~~
    struct Commit {
        bytes32 commitedHash;
        uint256 blockNumber;
        uint256 tokenIdForNFT;
    }

    //~~~~~~~ Enum ~~~~~~~
    enum States {
        CLOSED,
        MINT_PRIVATE_LIST,
        MINT_PUBLIC_LIST
    }

    //~~~~~~~ State variables ~~~~~~~
    uint256 private immutable START_FROM = 1;
    uint256 public immutable MAX_SUPPLY;
    uint256 public immutable PRIVATE_MINT_SUPPLY;
    bytes32 public immutable PRIVATE_LIST_MERKLE_ROOT;
    bytes32 public immutable PUBLIC_LIST_MERKLE_ROOT;
    uint256 private s_tokenCount;
    uint256 public s_totalSupply;
    States public s_state;
    WhiteListForERC721 public s_whitelist;
    mapping(address => Commit) public s_commits;
    mapping(uint256 => uint256) private tokenMatrix;
    BitMaps.BitMap private s_myBitMap;


    //~~~~~~~ Constructor ~~~~~~~
    constructor(
        bytes32 _privateRoot,
        bytes32 _publicRoot,
        WhiteListForERC721 _whiteList
    ) ERC721("NFBIT", "NFB") {
        s_state = States.MINT_PRIVATE_LIST;
        s_whitelist = _whiteList;
        MAX_SUPPLY = s_whitelist.MAX_SUPPLY_PUBLIC_LIST();
        PRIVATE_MINT_SUPPLY = s_whitelist.MAX_SUPPLY_PRIVATE_LIST();
        PRIVATE_LIST_MERKLE_ROOT = _privateRoot;
        PUBLIC_LIST_MERKLE_ROOT = _publicRoot;
    }

    //~~~~~~~ onlyAdmin/Team Functions ~~~~~~~

    //Activate the preSale state
    function openPrivateMint() external onlyOwner {
        s_state = States.MINT_PRIVATE_LIST;
    }

    function openPublicMint() external onlyOwner {
        s_state = States.MINT_PUBLIC_LIST;
    }

    //~~~~~~~ External / Public Functions ~~~~~~~

    //1st step of minting/buying --> setYourCommit() user will set the commit putting a number and a salt
    function setYourCommit(bytes32 _yourHash) external {
        Commit memory _commit;
        _commit.commitedHash = _yourHash;
        _commit.blockNumber = block.number;
        s_commits[msg.sender] = _commit;
    }

    //2nd step of minting/buying --> getYourTokenId() by verifying your commit
    function getYourTokenId(uint256 _randomUserNumber, uint256 _salt) internal {
        Commit memory _commit = s_commits[msg.sender];
        require(
            _commit.tokenIdForNFT == 0,
            "NFB: Random token ID was already revealed"
        );
        require(
            block.number < _commit.blockNumber + 255,
            "NFB: Too late, please submit your commit again"
        );
        require(
            block.number > _commit.blockNumber + 10,
            "NFB: Please verify after 10 blocks."
        );
        require(
            getYourHash(_randomUserNumber, _salt) == _commit.commitedHash,
            "NFB: Wrong hash"
        );
        bytes32 commitedBlockHash = blockhash(_commit.blockNumber);
        uint256 randomNumber = uint256(bytes32(
            keccak256(abi.encodePacked(commitedBlockHash, _commit.commitedHash)))
        );

        uint256 tokenId = _getRandomTokenId(randomNumber);

        s_commits[msg.sender].tokenIdForNFT = tokenId;
        emit RevealedRandomTokenId(randomNumber, msg.sender);
    }

    function availableTokenCount() public view returns (uint256) {
        return MAX_SUPPLY - s_tokenCount;
    }

    modifier ensureAvailability() {
        require(availableTokenCount() > 0, "No more tokens available");
        _;
    }

    function _getRandomTokenId(uint256 randomNumber) internal ensureAvailability returns (uint256){
        uint256 maxIndex = MAX_SUPPLY - s_tokenCount;
        uint random = randomNumber % maxIndex;
        uint256 value = 0;

        if (tokenMatrix[random] == 0) {
            // If this matrix position is empty, set the value to the generated random number.
            value = random;
        } else {
            // Otherwise, use the previously stored number from the matrix.
            value = tokenMatrix[random];
        }

        // If the last available tokenID is still unused...
        if (tokenMatrix[maxIndex - 1] == 0) {
            // ...store that ID in the current matrix position.
            tokenMatrix[random] = maxIndex - 1;
        } else {
            // ...otherwise copy over the stored number to the current matrix position.
            tokenMatrix[random] = tokenMatrix[maxIndex - 1];
        }

        // Increment counts
        s_tokenCount++;

        return value + START_FROM;
    }

    //3rd step of minting/buying --> mint()

    //Only users registered in the early private round can mint here
    function privateRoundMint(bytes32[] memory _proof) external {
        require(
            s_state == States.MINT_PRIVATE_LIST,
            "NFB: Minting is not in private minting state."
        );
        uint256 _ticketNumber = _getTicketNumberFromUser(msg.sender);
        require(_validatePreMint(_ticketNumber, _proof));
        _allocateToken();
    }

    //Only users registered for the public sale can mint here
    function publicRoundMint(bytes32[] memory _proof) external {
        require(
            s_state == States.MINT_PUBLIC_LIST,
            "NFB: Minting is not in public minting state."
        );
        uint256 _ticketNumber = _getTicketNumberFromUser(msg.sender);
        require(_validatePreMint(_ticketNumber, _proof));
        _allocateToken();
    }

    //~~~~~~~ Internal Functions ~~~~~~~

    function _validatePreMint(uint256 _ticketNumber, bytes32[] memory _proof)
        internal
        returns (bool)
    {
        require(
            s_commits[msg.sender].tokenIdForNFT != 0,
            "NFB: Please set and verify your commit first."
        );
        require(
            _userHasAValidTicketMerkleProof(_ticketNumber, _proof),
            "NFB: Invalid ticket number"
        );
        require(
            _verifyAndUseTicketBitMaps(_ticketNumber),
            "NFB: Ticket was already spent."
        );
        return true;
    }

    function _userHasAValidTicketMerkleProof(
        uint256 _ticketNumber,
        bytes32[] memory _proof
    ) internal view returns (bool) {
        bytes32 _root;
        if (s_state == States.MINT_PRIVATE_LIST) {
            _root = PRIVATE_LIST_MERKLE_ROOT;
        } else {
            _root = PUBLIC_LIST_MERKLE_ROOT;
        }
        bytes32 _leaf = keccak256(
            abi.encodePacked(keccak256(abi.encode(msg.sender, _ticketNumber)))
        );
        return MerkleProof.verify(_proof, _root, _leaf);
    }

    function _verifyAndUseTicketBitMaps(uint256 _ticketNumber)
        internal
        returns (bool)
    {
        require(!s_myBitMap.get(_ticketNumber), "NFB: Ticket already spent.");
        s_myBitMap.set(_ticketNumber);
        return true;
    }

    function _allocateToken() internal {
        s_totalSupply++;
        uint256 _totalSupply = s_totalSupply;
        uint256 _tokenId = s_commits[msg.sender].tokenIdForNFT;
        _safeMint(msg.sender, _tokenId);
        _updateState(_totalSupply);
    }

    function _updateState(uint256 _totalSupply) internal {
        //Change state to PUBLIC_MINT, once PRIVATE_MINT_SUPPLY has been minted.
        if (_totalSupply == PRIVATE_MINT_SUPPLY) {
            s_state = States.MINT_PUBLIC_LIST;
        }
        //Change state to CLOSED, once MAX_SUPPLY has been reached
        else if (_totalSupply == MAX_SUPPLY) {
            s_state = States.CLOSED;
        }
    }

    //~~~~~~~ Pure / View Functions ~~~~~~~
    function getYourHash(uint256 _randomUserNumber, uint256 _salt)
        public
        pure
        returns (bytes32)
    {
        return keccak256(abi.encodePacked(_randomUserNumber, _salt));
    }

    function _getTicketNumberFromUser(address _user)
        internal
        view
        returns (uint256)
    {
        uint256 _ticketNumber = s_whitelist.getTicketNumber(_user);
        require(_ticketNumber != 0, "NFB: Ticket number is invalid.");
        return _ticketNumber;
    }

    function totalSupply() public view returns(uint256){
        return s_totalSupply;
    }



    //~~~~ Manage the data structure bits ~~~~~
    function getBit(uint256 _index) external view returns (bool) {
        return s_myBitMap.get(_index);
    }

}
