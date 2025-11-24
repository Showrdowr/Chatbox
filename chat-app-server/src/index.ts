import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv'; 
import apiRoutes from './routes/api'; 

dotenv.config();

// export app เพื่อให้ Test นำไปใช้ได้
export const app = express(); // <-- ใส่ export ตรงนี้

const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use('/', apiRoutes);

// เช็คว่าไฟล์ถูกเรียกตรงๆ หรือถูก import (เพื่อไม่ให้ Jest start server ซ้อน)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}