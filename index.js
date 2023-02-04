import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const audioFilePath = path.join(__dirname, 'audio.wav');

const url = 'https://speech.googleapis.com/v1p1beta1/speech:recognize';

const apiKey = '';

const requestOptions = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Goog-Api-Key': apiKey,
  },
};

const handleResponse = async (res) => {
  let responseData = '';
  for await (const chunk of res) {
    responseData += chunk;
  }
  if (res.statusCode === 200) {
    const { results } = JSON.parse(responseData);
    if (results && results.length > 0) {
      const transcription = results[0].alternatives[0].transcript;
      console.log('Transcription:', transcription);
    } else {
      console.log('No transcription results found.');
    }
  } else {
    throw new Error(responseData);
  }
};

async function convertSpeechToText() {
  try {
    const audioContent = fs.readFileSync(audioFilePath, 'base64');
    const requestBody = JSON.stringify({
      config: {
        encoding: 'LINEAR16',
        enableAutomaticPunctuation: true,
        // sampleRateHertz: 16000,
        languageCode: "es-US",
        model: "default"
      },
      audio: {
        content: audioContent,
      },
    });
    const req = https.request(url, requestOptions, handleResponse);
    req.on('error', (error) => {
      throw error;
    });
    req.write(requestBody);
    req.end();
  } catch (error) {
    console.error('Error in the speech-to-text request:', error);
  }
}

convertSpeechToText();
