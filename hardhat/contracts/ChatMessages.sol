// Copy of ChatMessages.sol for deployment
// Paste your ChatMessages.sol code here
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./ChatNFT.sol";

contract ChatMessages {
    struct Message {
        uint256 tokenId;
        address sender;
        string content;
        uint256 timestamp;
        bool isFromCharacter;
    }

    struct ChatSession {
        uint256 tokenId;
        address user;
        uint256 startTime;
        uint256 messageCount;
        bool isActive;
    }

    ChatNFT public nftContract;
    
    mapping(bytes32 => Message[]) public chatHistory;
    mapping(bytes32 => ChatSession) public chatSessions;
    mapping(uint256 => mapping(address => bytes32)) public userChatIds;

    event MessageSent(
        bytes32 indexed chatId,
        uint256 indexed tokenId,
        address indexed sender,
        string content,
        bool isFromCharacter
    );

    event ChatStarted(
        bytes32 indexed chatId,
        uint256 indexed tokenId,
        address indexed user
    );

    constructor(address _nftContract) {
        nftContract = ChatNFT(_nftContract);
    }

    function startChat(uint256 tokenId) public returns (bytes32) {
        require(
            nftContract.hasChatAccess(tokenId, msg.sender),
            "No chat access to this NFT"
        );

        bytes32 chatId = keccak256(abi.encodePacked(tokenId, msg.sender, block.timestamp));
        
        chatSessions[chatId] = ChatSession({
            tokenId: tokenId,
            user: msg.sender,
            startTime: block.timestamp,
            messageCount: 0,
            isActive: true
        });

        userChatIds[tokenId][msg.sender] = chatId;

        emit ChatStarted(chatId, tokenId, msg.sender);
        return chatId;
    }

    function sendMessage(
        bytes32 chatId,
        string memory content,
        bool isFromCharacter
    ) public {
        require(chatSessions[chatId].isActive, "Chat session not active");
        require(
            chatSessions[chatId].user == msg.sender || isFromCharacter,
            "Not authorized to send message"
        );

        Message memory newMessage = Message({
            tokenId: chatSessions[chatId].tokenId,
            sender: msg.sender,
            content: content,
            timestamp: block.timestamp,
            isFromCharacter: isFromCharacter
        });

        chatHistory[chatId].push(newMessage);
        chatSessions[chatId].messageCount++;

        emit MessageSent(
            chatId,
            chatSessions[chatId].tokenId,
            msg.sender,
            content,
            isFromCharacter
        );
    }

    function getChatHistory(bytes32 chatId) 
        public 
        view 
        returns (Message[] memory) 
    {
        require(
            chatSessions[chatId].user == msg.sender,
            "Not authorized to view chat"
        );
        return chatHistory[chatId];
    }

    function getUserChatId(uint256 tokenId, address user) 
        public 
        view 
        returns (bytes32) 
    {
        return userChatIds[tokenId][user];
    }

    function getChatSession(bytes32 chatId) 
        public 
        view 
        returns (ChatSession memory) 
    {
        require(
            chatSessions[chatId].user == msg.sender,
            "Not authorized to view session"
        );
        return chatSessions[chatId];
    }

    function endChat(bytes32 chatId) public {
        require(
            chatSessions[chatId].user == msg.sender,
            "Not authorized to end chat"
        );
        chatSessions[chatId].isActive = false;
    }
}

