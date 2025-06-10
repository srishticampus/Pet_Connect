import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export const generatePetDescription = async (req, res) => {
    try {
        const { name, species, breed, age, gender, size, temperament, medicalHistory, specialNeeds, behavior, color, location, status } = req.body;

        const prompt = `Generate a compelling and engaging adoption description for a pet with the following details:
        Name: ${name}
        Species: ${species}
        Breed: ${breed}
        Age: ${age}
        Gender: ${gender}
        Size: ${size}
        Temperament: ${temperament}
        Medical History: ${medicalHistory || 'None'}
        Special Needs: ${specialNeeds || 'None'}
        Behavior: ${behavior || 'Not specified'}
        Color: ${color || 'Not specified'}
        Location: ${location || 'Not specified'}
        Status: ${status || 'Available for adoption'}

        Focus on positive attributes and what makes this pet a great companion. Keep the description concise, engaging, and suitable for an adoption website. Highlight unique traits.`;

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.json({ description: text });
    } catch (error) {
        console.error('Error generating pet description:', error);
        res.status(500).json({ message: 'Failed to generate pet description', error: error.message });
    }
};
