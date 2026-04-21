const request = require('supertest');
const mongoose = require('mongoose');
const express = require('express');
const User = require('../src/models/User');

// Create a mock app for testing
const app = express();
app.use(express.json());
const authRoutes = require('../src/routes/authRoutes');
app.use('/api/auth', authRoutes);
const errorHandler = require('../src/middleware/error');
app.use(errorHandler);

// Connect to a test database
beforeAll(async () => {
    const url = `mongodb://127.0.0.1/restaurant_menu_test`;
    await mongoose.connect(url);
});

// Clean up after each test
afterEach(async () => {
    await User.deleteMany();
});

// Close connection after all tests
afterAll(async () => {
    await mongoose.connection.close();
});

describe('Auth API', () => {
    it('should register a new user', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                name: 'Test Owner',
                email: 'owner@test.com',
                password: 'password123',
                role: 'owner'
            });
        
        expect(res.statusCode).toEqual(201);
        expect(res.body.success).toBe(true);
        expect(res.body.token).toBeDefined();
    });

    it('should not register user with duplicate email', async () => {
        await User.create({
            name: 'Existing',
            email: 'duplicate@test.com',
            password: 'password123',
            role: 'owner'
        });

        const res = await request(app)
            .post('/api/auth/register')
            .send({
                name: 'Test Owner',
                email: 'duplicate@test.com',
                password: 'password123',
                role: 'owner'
            });
        
        expect(res.statusCode).toEqual(400);
        expect(res.body.success).toBe(false);
    });

    it('should login an existing user', async () => {
        const user = await User.create({
            name: 'Login User',
            email: 'login@test.com',
            password: 'password123',
            role: 'owner'
        });

        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'login@test.com',
                password: 'password123'
            });
        
        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);
        expect(res.body.token).toBeDefined();
    });
});
