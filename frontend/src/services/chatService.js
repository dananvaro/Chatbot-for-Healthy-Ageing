// services/chatService.js
// This service handles all communication with the backend API

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/**
 * Send a chat message to the backend and get a response
 * @param {string} userMessage - The user's message
 * @param {string} threadID - The thread ID
 * @param {string} systemPrompt - The system prompt
 * @param {Object} settings - Bot settings (language, simplerLanguage, etc.)
 * @param {Object} onboardingData - User's onboarding preferences
 * @returns {Promise} - Response from the backend
 */
export const sendChatMessage = async (userMessage, threadID, systemPrompt, settings, onboardingData) => {
  try {
    const requestBody = {
      input: userMessage,
      threadID: threadID || null,
      systemPrompt: systemPrompt || null,
      settings: settings || null,
      onboardingData: onboardingData || null,
    };

    console.log('Sending request to backend:', requestBody);

    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Backend error:', errorData);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Backend response:', data);
    return data;
  } catch (error) {
    console.error('Error sending chat message:', error);
    throw error;
  }
};

/**
 * Send a chat message with streaming response
 * @param {Array} messages - Array of message objects
 * @param {Object} settings - Bot settings
 * @param {Object} onboardingData - User's onboarding preferences
 * @param {Function} onChunk - Callback for each chunk of data
 * @returns {Promise}
 */
export const sendChatMessageStream = async (messages, settings, onboardingData, onChunk) => {
  try {
    const response = await fetch(`${API_BASE_URL}/chat/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages,
        settings,
        onboardingData,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') {
            return;
          }
          try {
            const parsed = JSON.parse(data);
            onChunk(parsed);
          } catch (e) {
            console.error('Error parsing chunk:', e);
          }
        }
      }
    }
  } catch (error) {
    console.error('Error in streaming chat:', error);
    throw error;
  }
};

/**
 * Health check endpoint to verify backend is running
 * @returns {Promise}
 */
export const checkBackendHealth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    if (response.ok) {
      const data = await response.json();
      return data.status === 'ok';
    }
    return false;
  } catch (error) {
    console.error('Backend health check failed:', error);
    return false;
  }
};