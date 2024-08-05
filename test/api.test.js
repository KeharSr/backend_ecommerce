const request = require('supertest');

// Import the express app

const app = require('../index');

// test token for admin
const token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2OGE2ZWI1ZDUxOWQ4ZmQzZWMwMTRmMiIsImlzQWRtaW4iOnRydWUsImlhdCI6MTcyMjc4NTExOX0.uoB5-oJjf9Q2eA_U8YDI-v7ThWQ5U2zyYHn2rRaQQ6o"

// describe (List of test cases)

describe('',()=>{

    // testing '/test' api
    it('GET/Lensify | Response with text', async()=>{
        // request sending
        const response = await request(app).get('/Lensify')

        //if its sucessful, status code
        expect (response.statusCode).toBe(200)

        expect(response.text).toEqual('Test API is Working!....')
    });


    // testcase(1) for user registration
    it('POST /api/user/create | Response with body', async () => {
        const response = await request(app).post('/api/user/create').send({
            firstName: 'John',
            lastName: 'Doe',
            userName: 'johndoe',
            email: 'john.doe@gmail.com',
            phoneNumber: '1234567890',
            password: 'password'
        });

        if (!response.body.success) {
            expect(response.statusCode).toBe(400);
            expect(response.body.message).toEqual('User with this phone number already exists!');
        } else {
            expect(response.statusCode).toBe(201);
            expect(response.body.message).toEqual('User created successfully');
        }
    });

    it('POST /api/user/create | Missing details', async () => {
        const response = await request(app).post('/api/user/create').send({
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@gmail.com',
            password: 'password'
        });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toEqual('Please enter all details!');
    });

    // testcase(2) for user login
    it('POST /api/user/login | Response with body', async () => {
        const response = await request(app).post('/api/user/login').send({
            email: 'ram@gmail.com',
            password: 'password'
        });

        if (!response.body.success) {
            expect(response.statusCode).toBe(400);
            expect(response.body.message).toEqual('Invalid credentials');
        } else {
            expect(response.statusCode).toBe(200);
            expect(response.body.message).toEqual( "User Logged in Successfully!" );
        }
    });

    
    
 })


