import 'dotenv/config';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import db from './db/index.js';
import { users } from './db/schema.js';

(async () => {
  try {
    const allUsers = await db.select().from(users).limit(1);
    if (allUsers.length === 0) {
       console.log('No users found in DB to mock token for.');
       return;
    }
    
    const user = allUsers[0];
    console.log('Found user to mock:', user.id, user.email);

    const token = jwt.sign(
      { id: user.id, email: user.email }, 
      process.env.JWT_SECRET || 'styleai_jwt_secret_k9x2m7p4q8r1w5y3_2026', 
      { expiresIn: '1h' }
    );
    
    const boundary = '----WebKitFormBoundary7x9D2t';
    const filePath = 'C:/Users/pc/.gemini/antigravity/brain/cf075679-27dc-4b89-80a8-d0d66dfe57cd/outfit_flatlay_1774121804350.png';
    const imageBuffer = fs.readFileSync(filePath);
    
    const body = Buffer.concat([
      Buffer.from('--' + boundary + '\r\n'),
      Buffer.from('Content-Disposition: form-data; name="image"; filename="test.png"\r\n'),
      Buffer.from('Content-Type: image/png\r\n\r\n'),
      imageBuffer,
      Buffer.from('\r\n--' + boundary + '--\r\n')
    ]);

    console.log('Testing upload to AI...');
    const uploadRes = await fetch('http://localhost:3001/api/fit-check', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'multipart/form-data; boundary=' + boundary
      },
      body: body
    });
    
    const result = await uploadRes.json();
    console.log(JSON.stringify(result, null, 2));
  } catch(e) {
    console.error(e);
  }
  process.exit(0);
})();
