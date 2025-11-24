# ChatBox - แอปพลิเคชันแชท Telehealth แบบ Fullstack

แอปพลิเคชันส่งข้อความแบบ 1-ต่อ-1 ที่ทันสมัย ปลอดภัย และเสถียร พัฒนาด้วย React (Vite) + TypeScript และ Node.js + Express + TypeScript ออกแบบด้วยสถาปัตยกรรมที่สะอาด (Clean Architecture), มีความปลอดภัยของข้อมูล (Type Safety) และรองรับการทำงานแบบ Real-time

## **ฟีเจอร์หลัก (Features)**

**1. ระบบยืนยันตัวตนและผู้ใช้**

- ล็อกอินด้วยบทบาท: เลือกใช้งานจากบทบาทที่กำหนดไว้ (David, Simo, Loki, Thor)
- จดจำการเข้าสู่ระบบ: ใช้ localStorage เพื่อจดจำผู้ใช้ ไม่ต้องล็อกอินใหม่เมื่อรีเฟรชหน้าจอ
- ความเป็นส่วนตัว: ผู้ใช้จะเห็นและเข้าถึงได้เฉพาะห้องแชทที่ตนเองมีส่วนร่วมเท่านั้น

**2. การส่งข้อความ**
- อัปเดตแบบ Real-time: ใช้เทคนิค Short Polling เพื่อดึงข้อความใหม่โดยอัตโนมัติ ไม่ต้องกดรีเฟรชหน้าจอ
- หน้าจอแชท: ดีไซน์แบบ Bubble ทันสมัย (สีฟ้าสำหรับข้อความเรา, สีเทาสำหรับข้อความคนอื่น)
- จัดการห้องแชท: สามารถสร้างห้องแชทใหม่แบบ 1-ต่อ-1 และลบห้องแชทที่ไม่ต้องการได้

**3. จุดเด่นทางเทคนิค (Technical Highlights)**
- Fullstack TypeScript: ใช้ TypeScript ทั้งฝั่ง Frontend และ Backend เพื่อลดข้อผิดพลาดของ Type
- MVC Architecture: แยกส่วนการทำงานของ Backend เป็นชั้นๆ (routes, controllers, และ data) เพื่อความเป็นระเบียบ
- Validation: ใช้ Zod ในการตรวจสอบความถูกต้องของข้อมูล (Payload Validation) เพื่อป้องกันข้อมูลขยะ
- Environment Variables: ใช้ไฟล์ .env ในการเก็บค่า Config เพื่อความปลอดภัยและยืดหยุ่น (ไม่ฝัง URL ไว้ในโค้ด)
- Unit Testing: มีชุดทดสอบด้วย Jest สำหรับตรวจสอบการทำงานของ API Backend
- Modern UI/UX: พัฒนาด้วย Tailwind CSS ดีไซน์ธีมสีม่วงที่สวยงาม รองรับการใช้งานบนมือถือ (Responsive) และรองรับ Dark Mode

## **โครงสร้างโปรเจกต์ (Project Structure)**

ChatBox/
├── chat-app-server/       # ส่วน Backend (Node.js + Express + TypeScript)
│   ├── src/
│   │   ├── controllers/   # Logic การทำงาน (Chat & User)
│   │   ├── data/          # ข้อมูลจำลอง (In-memory data store)
│   │   ├── middleware/    # Middleware ตรวจสอบสิทธิ์ (Auth)
│   │   ├── routes/        # กำหนดเส้นทาง API (Routes)
│   │   ├── tests/         # ชุดทดสอบ Unit Tests (Jest)
│   │   ├── utils/         # ตัวตรวจสอบข้อมูล (Zod Validators)
│   │   └── index.ts       # จุดเริ่มต้นของ Server
│   └── package.json
│
└── client/                # ส่วน Frontend (React + Vite + TypeScript)
    ├── src/
    │   ├── components/    # UI Components (ChatWindow, List, Modal)
    │   ├── App.tsx        # Logic หลักและการจัดวางหน้าจอ
    │   └── main.tsx       # จุดเริ่มต้นของ Client
    └── package.json


## **วิธีเริ่มต้นใช้งาน (Getting Started)**

**สิ่งที่ต้องมี (Prerequisites)**

- Node.js (เวอร์ชัน 16 ขึ้นไป)

- npm หรือ yarn

**1. ติดตั้งฝั่ง Backend (Server)**

เข้าไปที่โฟลเดอร์ server:

cd chat-app-server


ติดตั้งแพ็กเกจต่างๆ:

npm install


สร้างไฟล์ .env:
(สร้างไฟล์ชื่อ .env แล้วใส่เนื้อหาด้านล่าง)

PORT=4000


เริ่มต้นเซิร์ฟเวอร์:

npm run dev

(เซิร์ฟเวอร์จะทำงานที่ http://localhost:4000)

**2. ติดตั้งฝั่ง Frontend (Client)**

เปิด Terminal ใหม่ แล้วเข้าไปที่โฟลเดอร์ client:

cd client


ติดตั้งแพ็กเกจต่างๆ:

npm install


สร้างไฟล์ .env:
(สร้างไฟล์ชื่อ .env แล้วใส่เนื้อหาด้านล่าง)

VITE_API_URL=http://localhost:4000


เริ่มต้นหน้าเว็บ:

npm run dev

(หน้าเว็บจะเปิดที่ http://localhost:5173)

การรันชุดทดสอบ (Running Tests)

หากต้องการรัน Unit Test ของ Backend (ด้วย Jest):

cd chat-app-server
npm test

ผู้พัฒนา: พลวิชญ์ ฉัตรแก้ว