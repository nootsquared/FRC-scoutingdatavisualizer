import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default (req: NextApiRequest, res: NextApiResponse) => {
    try {
        console.log(req.method);
        if (req.method === 'POST') {
            const data = req.body;
            const filePath = path.resolve('./app/data/formData.json');
            fs.mkdirSync(path.dirname(filePath), { recursive: true });

            // Read existing data
            let existingData: any[] = [];
            if (fs.existsSync(filePath)) {
                const fileContent = fs.readFileSync(filePath, 'utf-8');
                // Check if file is not empty and contains a valid JSON array
                if (fileContent.trim() !== '' && fileContent.trim().startsWith('[') && fileContent.trim().endsWith(']')) {
                    existingData = JSON.parse(fileContent);
                }
            }

            // Append new data
            existingData.push(data);

            // Write everything back to the file
            fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2));

            res.status(200).json({ message: "Data saved successfully" });
        } else {
            res.status(405).json({ message: 'Method not allowed' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred' });
    }
};