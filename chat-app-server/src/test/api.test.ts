import request from 'supertest';
import { app } from '../index'; // import app ที่เรา export มา

describe('API Endpoints', () => {
  
  // Test 1: ทดสอบว่า GET /roles ทำงานถูกต้องไหม
  it('GET /roles should return 4 default roles', async () => {
    const res = await request(app).get('/roles');
    
    // เช็คว่า Status Code ต้องเป็น 200 (OK)
    expect(res.statusCode).toEqual(200);
    
    // เช็คว่าต้องได้ข้อมูลเป็น Array
    expect(Array.isArray(res.body)).toBeTruthy();
    
    // เช็คว่าต้องมี 4 คน (David, Simo, Loki, Thor)
    expect(res.body.length).toEqual(4);
    
    // เช็คว่าคนแรกชื่อ David
    expect(res.body[0].name).toEqual('David');
  });

});