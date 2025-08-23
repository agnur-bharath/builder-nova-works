// Copy of ChatNFT.sol for deployment
// Paste your ChatNFT.sol code here
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract ChatNFT is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    struct Character {
        string name;
        string description;
        string personality;
        string avatarUrl;
        address creator;
        uint256 createdAt;
        bool isPublic;
    }

    mapping(uint256 => Character) public characters;
    mapping(address => uint256[]) public userNFTs;
    mapping(uint256 => mapping(address => bool)) public chatAccess;

    event CharacterCreated(
        uint256 indexed tokenId, 
        address indexed creator, 
        string name, 
        bool isPublic
    );
    
    event ChatAccessGranted(
        uint256 indexed tokenId, 
        address indexed user
    );

    constructor() ERC721("ChatNFT", "CNFT") {}

    function createCharacter(
        string memory name,
        string memory description,
        string memory personality,
        string memory avatarUrl,
        string memory tokenURI,
        bool isPublic
    ) public returns (uint256) {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();

        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI);

        characters[tokenId] = Character({
            name: name,
            description: description,
            personality: personality,
            avatarUrl: avatarUrl,
            creator: msg.sender,
            createdAt: block.timestamp,
            isPublic: isPublic
        });

        userNFTs[msg.sender].push(tokenId);
        
        // Creator always has chat access
        chatAccess[tokenId][msg.sender] = true;

        emit CharacterCreated(tokenId, msg.sender, name, isPublic);
        return tokenId;
    }

    function grantChatAccess(uint256 tokenId, address user) public {
        require(_exists(tokenId), "Token does not exist");
        require(
            ownerOf(tokenId) == msg.sender || characters[tokenId].isPublic,
            "Not authorized"
        );
        
        chatAccess[tokenId][user] = true;
        emit ChatAccessGranted(tokenId, user);
    }

    function hasChatAccess(uint256 tokenId, address user) public view returns (bool) {
        if (!_exists(tokenId)) return false;
        return chatAccess[tokenId][user] || characters[tokenId].isPublic;
    }

    function getCharacter(uint256 tokenId) public view returns (Character memory) {
        require(_exists(tokenId), "Token does not exist");
        return characters[tokenId];
    }

    function getUserNFTs(address user) public view returns (uint256[] memory) {
        return userNFTs[user];
    }

    function getPublicCharacters() public view returns (uint256[] memory) {
        uint256 totalSupply = _tokenIdCounter.current();
        uint256[] memory publicTokens = new uint256[](totalSupply);
        uint256 publicCount = 0;

        for (uint256 i = 0; i < totalSupply; i++) {
            if (characters[i].isPublic) {
                publicTokens[publicCount] = i;
                publicCount++;
            }
        }

        // Resize array to actual count
        uint256[] memory result = new uint256[](publicCount);
        for (uint256 i = 0; i < publicCount; i++) {
            result[i] = publicTokens[i];
        }

        return result;
    }


    // Required override for ERC721 and ERC721URIStorage
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
