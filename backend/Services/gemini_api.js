// import { GoogleGenAI } from "@google/genai";
const { GoogleGenAI } = require("@google/genai");
require('dotenv').config();
// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({
    apiKey:process.env.GEMINI_API_KEY
});

const generateResponse = async(prompt) => {
  console.log('im in prompt')
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    // model: "gemini-1.5-flash",

    contents: `create a list of category for this prompt ${prompt} as an array no other sentences just arrays of category `,
  });
  console.log('im out prompt',response.text)
  return response.text;
//   console.log(response.text);
}



module.exports = generateResponse;