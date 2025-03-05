import React, { useState } from 'react';

const ChatBetSection = ({ isInGame, highestBet = 0, gameStage = 'preflop', gameRunning = false }) => {
  const [chatMessage, setChatMessage] = useState('');
  const [customBet, setCustomBet] = useState('');
  
  // Mock chat messages - in a real app, these would be loaded from state/props
  const chatMessages = [
    { sender: 'Alice', text: 'Hello everyone!' },
    { sender: 'Bob', text: 'Good luck!' },
    { sender: 'William', text: 'Thanks!' },
  ];

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      console.log('Sending message:', chatMessage);
      setChatMessage('');
      // In a real implementation, this would add the message to the chat
    }
  };

  const handleAction = (action) => {
    console.log('Player action:', action);
    // In a real implementation, this would trigger game actions
  };

  const handleRaise = () => {
    if (customBet && Number(customBet) > 0) {
      console.log('Raising by:', customBet);
      setCustomBet('');
      // In a real implementation, this would trigger a raise action
    }
  };

  // Betting options are only enabled when it's the player's turn and game is running
  const canBet = isInGame && gameRunning;

  return (
    <div className="flex h-full">
      {/* Chat section - left side */}
      <div className="w-1/2 border-r border-gray-700 flex flex-col p-2">
        <div className="flex-1 bg-gray-900 rounded mb-2 overflow-y-auto">
          {/* Chat messages */}
          <div className="p-2">
            {chatMessages.map((msg, index) => (
              <div key={index} className="text-gray-400 text-sm mb-1">
                <span className="font-semibold">{msg.sender}:</span> {msg.text}
              </div>
            ))}
          </div>
        </div>
        <div className="flex">
          <input 
            type="text" 
            value={chatMessage}
            onChange={(e) => setChatMessage(e.target.value)}
            placeholder="Type a message..." 
            className="flex-1 bg-gray-700 text-white px-3 py-1 rounded-l-md focus:outline-none"
          />
          <button 
            onClick={handleSendMessage}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-r-md"
          >
            Send
          </button>
        </div>
      </div>
      
      {/* Betting section - right side */}
      <div className="w-1/2 p-2 flex flex-col">
        {/* Game state info */}
        <div className="flex justify-between mb-2 text-white text-sm">
          <div>Stage: <span className="font-semibold">{gameStage}</span></div>
          <div>Highest Bet: <span className="font-semibold">${highestBet}</span></div>
        </div>
        
        <div className="flex-1 mb-2">
          {/* Action buttons */}
          <div className="flex justify-between mb-2">
            <button 
              onClick={() => handleAction('check')}
              disabled={!canBet}
              className={`px-3 py-1 rounded-md text-sm w-[30%] ${
                canBet 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'bg-gray-600 text-gray-300 cursor-not-allowed'
              }`}
            >
              Check
            </button>
            <button 
              onClick={() => handleAction('call')}
              disabled={!canBet}
              className={`px-3 py-1 rounded-md text-sm w-[30%] ${
                canBet 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'bg-gray-600 text-gray-300 cursor-not-allowed'
              }`}
            >
              Call
            </button>
            <button 
              onClick={() => handleAction('fold')}
              disabled={!canBet}
              className={`px-3 py-1 rounded-md text-sm w-[30%] ${
                canBet 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'bg-gray-600 text-gray-300 cursor-not-allowed'
              }`}
            >
              Fold
            </button>
          </div>
          
          {/* Bet amount buttons */}
          <div className="flex justify-between">
            <button 
              onClick={() => handleAction('bet10')}
              disabled={!canBet}
              className={`px-3 py-1 rounded-md text-sm w-[30%] ${
                canBet 
                  ? 'bg-yellow-600 hover:bg-yellow-700 text-white' 
                  : 'bg-gray-600 text-gray-300 cursor-not-allowed'
              }`}
            >
              $10
            </button>
            <button 
              onClick={() => handleAction('bet20')}
              disabled={!canBet}
              className={`px-3 py-1 rounded-md text-sm w-[30%] ${
                canBet 
                  ? 'bg-yellow-600 hover:bg-yellow-700 text-white' 
                  : 'bg-gray-600 text-gray-300 cursor-not-allowed'
              }`}
            >
              $20
            </button>
            <button 
              onClick={() => handleAction('bet50')}
              disabled={!canBet}
              className={`px-3 py-1 rounded-md text-sm w-[30%] ${
                canBet 
                  ? 'bg-yellow-600 hover:bg-yellow-700 text-white' 
                  : 'bg-gray-600 text-gray-300 cursor-not-allowed'
              }`}
            >
              $50
            </button>
          </div>
        </div>
        
        {/* Custom bet input */}
        <div className="flex">
          <input 
            type="number" 
            value={customBet}
            onChange={(e) => setCustomBet(e.target.value)}
            placeholder="Custom amount..." 
            disabled={!canBet}
            className={`flex-1 px-3 py-1 rounded-l-md ${
              canBet 
                ? 'bg-gray-700 text-white focus:outline-none' 
                : 'bg-gray-800 text-gray-500 cursor-not-allowed'
            }`}
          />
          <button 
            onClick={handleRaise}
            disabled={!canBet}
            className={`px-3 py-1 rounded-r-md ${
              canBet 
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : 'bg-gray-600 text-gray-300 cursor-not-allowed'
            }`}
          >
            Raise
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBetSection;