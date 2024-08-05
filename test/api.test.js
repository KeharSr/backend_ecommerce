const request = require('supertest');
const path = require('path');

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

    // testcase(3) for get current user
    it('GET /api/user/current | Response with body', async () => {
        const response = await request(app).get('/api/user/current').set('Authorization', `Bearer ${token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
    }
    );

    // testcase(4) for adding product
    // it('POST /api/product/create | Response with body', async () => {
    //     const response = await request(app).post('/api/product/create').send({
    //         productName: 'Product 1',
    //         productPrice: 100,
    //         productCategory: 'Category 1',
    //         productDescription: 'Description 1',
    //         productQuantity: 10,
    //         productImage: ('productImage', path.join(__dirname, 'testImage.jpg'))
    //     });

    //     expect(response.statusCode).toBe(201);
    //     expect(response.body.success).toBe(true);
    // });

    // testcase(5) for getting all products
    it('GET Products | Fetch all products',async()=>{
        const response = await request(app).get('/api/product/get_all_products').set('authorization',`Bearer ${token}`);
        expect (response.statusCode).toBe(201);
        expect (response.body).toBeDefined();
        expect(response.body.message).toEqual('Products Fetched Successfully!')
    })

    // testcase(6) for getting single product
    it('GET Single Product | Fetch single product', async () => {
        const response = await request(app).get('/api/product/get_single_product/66881b58d7263074b6405d66').set('authorization', `Bearer ${token}`);
        expect(response.statusCode).toBe(200);
        expect(response.body).toBeDefined();
        expect(response.body.message).toEqual('product fetched');
    });

    // testcase(7) for adding product to cart
    it('POST /api/cart/add_to_cart | Response with body', async () => {
        const response = await request(app).post('/api/cart/add_to_cart').set('authorization', `Bearer ${token}`).send({
            productId: '668d19d3545b7f4efec6f99c',
            quantity: 1
        });

        expect(response.statusCode).toBe(201);
        expect(response.body.success).toBe(true);
    });

    // testcase(8) for adding product to favorites
    it('POST /api/favourite/add_favourite | Response with body', async () => {
        const response = await request(app).post('/api/favourite/add_favourite').set('authorization', `Bearer ${token}`).send({
            productId: '66881b58d7263074b6405d66'
        });
    
        if (response.statusCode !== 200) {
            console.log(response.body);
        }
    
        expect(response.statusCode).toBe(200);
        expect(response.body).toBeDefined();
        expect(response.body.message).toEqual('Product added to favorites');
    });

    // testcase(9) for getting all favorites
    it('GET /api/favourite/get_favourite | Response with body', async () => {
        const response = await request(app).get('/api/favourite/get_favourite').set('authorization', `Bearer ${token}`);
    
        if (response.statusCode !== 200) {
            console.log(response.body);
        }
    
        expect(response.statusCode).toBe(200);
        expect(response.body).toBeDefined();
        expect(response.body.message).toEqual('Favorites fetched successfully');
    });

    // testcase(10) for adding review
    it('POST /api/review/post_reviews | Response with body', async () => {
        const response = await request(app).post('/api/review/post_reviews').set('authorization', `Bearer ${token}`).send({
            productId: '66881b58d7263074b6405d66',
            rating: 5,
            review: 'Great product!'
        });
    
        if (response.statusCode !== 201) {
            console.log('Response Body:', response.body);
        }
    
        expect(response.statusCode).toBe(201);
        expect(response.body).toBeDefined();
        expect(response.body.message).toEqual('Review added successfully');
    });
    

 })


