# Simple Blog Platform - Serverless API

A full-stack blog platform built with AWS Lambda, API Gateway, MongoDB Atlas, and React.

## Live Deployment

- **API URL**: https://o2u1b8p1c6.execute-api.us-east-1.amazonaws.com
- **Frontend URL**: [Your frontend URL here]

## API Endpoints

### Authentication

- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user

### Posts

- `GET /posts` - Get all published posts
- `POST /posts` - Create new post (Author only)
- `GET /posts/:id` - Get single post
- `PUT /posts/:id` - Update post (Author only)
- `DELETE /posts/:id` - Delete post (Author only)

### Profile

- `GET /profile` - Get user profile (Authenticated)

## Architecture
