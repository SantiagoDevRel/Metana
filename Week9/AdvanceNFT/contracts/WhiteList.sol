// SPDX-License-Identifier: MIT
pragma solidity 0.8.1;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/finance/PaymentSplitter.sol";

contract WhiteListForERC721 is Ownable, PaymentSplitter {
    //~~~~~~~ State variables ~~~~~~~
    uint256 public immutable MAX_SUPPLY_PRIVATE_LIST;
    uint256 public immutable MAX_SUPPLY_PUBLIC_LIST;
    uint256 public immutable PRICE_FOR_PRIVATE_LIST_IN_WEI;
    uint256 public immutable PRICE_FOR_PUBLIC_LIST_IN_WEI;
    uint256 public s_totalTicketSold; //number of ticket sold
    State private s_state; //state of the contract
    bytes32[] private s_privateListIDs; //array of hashes of the msg.sender+ticketNumber
    bytes32[] private s_publicListIDs; //array of hashes of the msg.sender+ticketNumber
    mapping(address => uint256) private s_ticketNumber; //mapping with the ticket numbers of each address

    //~~~~~~~ Enum states ~~~~~~~
    enum State {
        PRIVATE_SALE,
        PUBLIC_SALE,
        SOLD_OUT
    }

    //~~~~~~~ Constructor ~~~~~~~
    constructor(
        uint256 _maxSupplyPrivateList,
        uint256 _maxSupplyPublicList,
        uint256 _priceForPrivate,
        uint256 _priceForPublic,
        address[] memory _teamMembers,
        uint256[] memory _shares
    ) PaymentSplitter(_teamMembers, _shares) {
        MAX_SUPPLY_PRIVATE_LIST = _maxSupplyPrivateList;
        MAX_SUPPLY_PUBLIC_LIST = _maxSupplyPublicList;
        PRICE_FOR_PRIVATE_LIST_IN_WEI = _priceForPrivate;
        PRICE_FOR_PUBLIC_LIST_IN_WEI = _priceForPublic;
        s_state = State.PRIVATE_SALE;
    }

    //~~~~~~~ Internal Functions ~~~~~~~
    function _updateState(uint256 _ticketsSold) internal {
        if (_ticketsSold == MAX_SUPPLY_PRIVATE_LIST) {
            s_state = State.PUBLIC_SALE;
        } else if (_ticketsSold == MAX_SUPPLY_PUBLIC_LIST) {
            s_state = State.SOLD_OUT;

        }
    }

    //~~~~~~~ External/Public Functions ~~~~~~~
    function buyPrivateTicket() external payable {
        require(
            s_state == State.PRIVATE_SALE,
            "WhiteList: State must be in Private Sale."
        );
        require(msg.value == PRICE_FOR_PRIVATE_LIST_IN_WEI, "WhiteList: Please send the right ether amount");
        address _buyer = msg.sender;
        require(
            s_ticketNumber[_buyer] == 0,
            "WhiteList: You are already on the list :)"
        );
        s_totalTicketSold++;
        uint256 _ticketSoldNumber = s_totalTicketSold;
        bytes32 _ticketID = keccak256(
            abi.encodePacked(_buyer, _ticketSoldNumber)
        );
        s_privateListIDs.push(_ticketID);
        s_ticketNumber[_buyer] = _ticketSoldNumber;
        _updateState(_ticketSoldNumber);
    }

    function buyPublicTicket() external payable {
        require(
            s_state == State.PUBLIC_SALE,
            "WhiteList: State must be in Private Sale."
        );
        require(
            msg.value == PRICE_FOR_PUBLIC_LIST_IN_WEI,
            "WhiteList: Please send the right ether amount"
        );
        address _buyer = msg.sender;
        require(
            s_ticketNumber[_buyer] == 0,
            "WhiteList: You are already on the list :)"
        );
        s_totalTicketSold++;
        uint256 _ticketSoldNumber = s_totalTicketSold;
        bytes32 _ticketID = keccak256(
            abi.encodePacked(_buyer, _ticketSoldNumber)
        );
        s_publicListIDs.push(_ticketID);
        s_ticketNumber[_buyer] = _ticketSoldNumber;
        _updateState(_ticketSoldNumber);
    }

    //~~~~~~~ View/Pure Functions ~~~~~~~
    function getTicketNumber(address _user) external view returns (uint256) {
        return s_ticketNumber[_user];
    }

    function getPrivateListIDs() external view returns (bytes32[] memory) {
        return s_privateListIDs;
    }

    function getPublicListIDs() external view returns (bytes32[] memory) {
        return s_publicListIDs;
    }
}
