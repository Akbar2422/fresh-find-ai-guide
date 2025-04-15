
import { GeminiResponse, GeminiError } from "@/types/gemini";

const API_KEY = "AIzaSyB9I-f_Qketm5vbCKwMbKX8gDT27N6oYcQ";

export const analyzeImage = async (imageFile: File): Promise<GeminiResponse | GeminiError> => {
  try {
    // Convert the image to base64
    const base64Image = await fileToBase64(imageFile);
    
    // Prepare the prompt for Gemini
    const prompt = `
      When a user uploads an image of a fruit or vegetable, provide in JSON format:
      {
        "Identification": {
          "name": "",
          "varieties": ""
        },
        "QualityCheck": {
          "rate": "Good | Average | Bad",
          "reason": ""
        },
        "NutritionInfo": {
          "calories": "",
          "protein": "",
          "carbohydrates": "",
          "fats": "",
          "fiber": "",
          "waterContent": ""
        },
        "RecipeSuggestions": [
          {
            "name": "",
            "steps": "",
            "youtube_url": ""
          }
        ],
        "StorageAdvice": {
          "method": "",
          "expiry_duration": ""
        },
        "FridgeReminder": "",
        "LeaderboardInfo": "1 upload for leaderboard tracking",
        "FunFact": "",
        "ArtificialCoatingDetection": {
          "signs": "",
          "confidence": "80%"
        }
      }
      
      Restriction:
      If not a fruit or vegetable, return: {"error": "Unsupported image type. Please upload a clear image of a fruit or vegetable."}
    `;

    // Call Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: prompt },
                {
                  inline_data: {
                    mime_type: imageFile.type,
                    data: base64Image.split(',')[1],
                  },
                },
              ],
            },
          ],
          generation_config: {
            temperature: 0.4,
            top_p: 1,
            top_k: 32,
            max_output_tokens: 4096,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API error:', errorData);
      return { error: 'Failed to analyze image. Please try again.' };
    }

    const data = await response.json();
    
    // Parse the text response which should contain the JSON
    const textResponse = data.candidates[0].content.parts[0].text;
    
    // Find and extract the JSON part from the text
    const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      const jsonString = jsonMatch[0];
      return JSON.parse(jsonString);
    } else {
      return { error: 'Failed to parse analysis results. Please try again.' };
    }
  } catch (error) {
    console.error('Error analyzing image:', error);
    return { error: 'An unexpected error occurred. Please try again.' };
  }
};

// Helper function to convert File to base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};
