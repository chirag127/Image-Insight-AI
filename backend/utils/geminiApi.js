const { GoogleGenerativeAI } = require("@google/generative-ai");

/**
 * Analyzes an image using Gemini 2.0 Flash Lite API
 * @param {string} imageUrl - URL of the image to analyze
 * @returns {Promise<Object>} - Analysis results
 */
const analyzeImage = async (imageUrl) => {
  try {
    // Initialize the Gemini API with the API key
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("Gemini API key is not configured");
    }
    
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Get the model
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-lite",
    });
    
    // Configuration for the generation
    const generationConfig = {
      temperature: 0.7,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 1024,
    };
    
    // Create the prompt with the image URL
    const prompt = `Analyze the following image from this URL: ${imageUrl}. Provide:
- A short description of the image.
- Any emotions or scene context.
- Tags/keywords that describe it.

Format your response as JSON with the following structure:
{
  "description": "A detailed description of what's in the image",
  "emotions": "Emotions or scene context detected in the image",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"]
}`;
    
    // Start a chat session
    const chatSession = model.startChat({
      generationConfig,
      history: [],
    });
    
    // Send the message with the prompt
    const result = await chatSession.sendMessage(prompt);
    const responseText = result.response.text();
    
    // Parse the JSON response
    try {
      // Try to parse the response as JSON
      const jsonResponse = JSON.parse(responseText);
      return {
        description: jsonResponse.description || "No description available",
        emotions: jsonResponse.emotions || "No emotions detected",
        tags: jsonResponse.tags || [],
        rawResponse: responseText
      };
    } catch (parseError) {
      // If parsing fails, extract information manually
      console.error("Error parsing Gemini response as JSON:", parseError.message);
      
      // Extract description, emotions, and tags using regex or string manipulation
      const descriptionMatch = responseText.match(/description[:\s]+"([^"]+)"/i) || 
                              responseText.match(/description[:\s]+(.+?)(?=\n|$)/i);
      const emotionsMatch = responseText.match(/emotions[:\s]+"([^"]+)"/i) || 
                           responseText.match(/emotions[:\s]+(.+?)(?=\n|$)/i);
      const tagsMatch = responseText.match(/tags[:\s]+\[(.*?)\]/is);
      
      const description = descriptionMatch ? descriptionMatch[1].trim() : "No description available";
      const emotions = emotionsMatch ? emotionsMatch[1].trim() : "No emotions detected";
      const tagsString = tagsMatch ? tagsMatch[1] : "";
      const tags = tagsString
        .split(',')
        .map(tag => tag.trim().replace(/"/g, ''))
        .filter(tag => tag.length > 0);
      
      return {
        description,
        emotions,
        tags,
        rawResponse: responseText
      };
    }
  } catch (error) {
    console.error("Error analyzing image with Gemini:", error.message);
    throw error;
  }
};

module.exports = { analyzeImage };
