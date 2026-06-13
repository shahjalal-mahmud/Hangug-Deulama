# Hangug Deulama

## A Personalized K-Drama Recommendation System Using Swipe-Based User Interaction

### Software Development II Project Documentation

---

# 1. Project Information

**Project Title:** Hangug Deulama

**Project Type:** Web Application

**Project Category:** Entertainment & Personalized Recommendation System

**Frontend Technologies:**

- React.js
- Tailwind CSS

**Backend Technology:**

- PHP

**Database:**

- MySQL

**Development Methodology:**

- Incremental Development

---

# 2. Project Overview

Hangug Deulama is a simple and user-friendly K-Drama recommendation web application designed to help users discover dramas based on their personal interests and viewing preferences.

Instead of using traditional search and filter interfaces, the application introduces a swipe-based interaction similar to modern recommendation platforms. Users can quickly browse drama cards containing posters, titles, genres, and short descriptions, then express their preferences by swiping left or right.

The application continuously records user interactions and builds a preference profile that is later used to generate personalized drama recommendations.

The primary objective is to provide a fast, intuitive, and engaging way for users to discover new Korean dramas.

---

# 3. Problem Statement

With thousands of Korean dramas available across multiple streaming platforms, users often spend significant time searching for something to watch.

Traditional recommendation systems frequently require manual searching or complicated filtering options.

Hangug Deulama aims to simplify this process by allowing users to express their preferences naturally through swipe interactions and automatically generating recommendations based on accumulated user behavior.

---

# 4. Project Objectives

## Primary Objectives

- Develop a responsive web application for K-Drama recommendations.
- Build a swipe-based recommendation interface.
- Store and manage drama information using MySQL.
- Develop REST-like APIs using PHP.
- Create personalized recommendations based on user preferences.

## Secondary Objectives

- Maintain user watch history.
- Store liked and disliked dramas.
- Generate Top 10 personalized recommendations.
- Provide an easy-to-use and visually attractive interface.

---

# 5. Project Scope

The system will include:

- User registration and login
- User profile management
- Swipe-based recommendation interface
- Drama information management
- Like and dislike recording
- Watch history tracking
- Personalized recommendation generation
- Top 10 recommended dramas
- Responsive web interface

Future improvements such as AI-based recommendations, collaborative filtering, and streaming platform integration are outside the scope of this project.

---

# 6. Target Users

- K-Drama enthusiasts
- New viewers looking for recommendations
- Casual entertainment users
- Students and young adults

---

# 7. Functional Requirements

## User Management

- User Registration
- User Login
- User Authentication
- User Profile

### User Profile stores:

- Name
- Email
- Password
- Liked dramas
- Disliked dramas
- Watched dramas
- Recommendation history

---

## Drama Browsing

Each drama card will display:

- Poster/Banner
- Title
- Short Storyline
- Genre
- Rating
- Release Year

---

## Swipe System

### Right Swipe

- User likes the drama
- Save preference
- Increase genre preference score

### Left Swipe

- User dislikes the drama
- Save preference
- Exclude from future recommendations where appropriate

---

## Watched Button

The user can mark a drama as watched.

The system stores:

- Drama ID
- User ID
- Watch status
- Watch timestamp

---

## Recommendation Engine

The recommendation system will use:

- Liked dramas
- Disliked dramas
- Watched dramas
- Preferred genres
- User interaction history

The system will generate:

- Personalized recommendations
- Top 10 dramas to watch next

---

# 8. Non-Functional Requirements

## Performance

- Fast API responses
- Efficient database queries

## Usability

- Clean UI
- Mobile responsive
- Easy navigation
- Swipe-friendly interface

## Reliability

- Secure data storage
- Consistent recommendation generation

## Scalability

Database structure should support future expansion.

---

# 9. System Architecture

```
            React + Tailwind CSS
                     │
              HTTP API Requests
                     │
                 PHP Backend
                     │
               Business Logic
                     │
                  MySQL Database
```

The frontend communicates with the PHP backend through JSON APIs.

The backend processes requests, accesses the MySQL database, and returns structured JSON responses.

---

# 10. Technology Stack

Frontend:

- React.js
- Tailwind CSS

Backend:

- PHP

Database:

- MySQL

Communication:

- REST-style JSON API

Development Tools:

- Visual Studio Code
- XAMPP
- Git
- GitHub

---

# 11. Proposed Database Design

## Users

- user_id
- name
- email
- password
- created_at

---

## Dramas

- drama_id
- title
- storyline
- genre
- rating
- release_year
- poster_url
- banner_url

---

## User Swipes

- swipe_id
- user_id
- drama_id
- swipe_type
- created_at

swipe_type:

- Like
- Dislike

---

## Watched List

- watch_id
- user_id
- drama_id
- watched_at

---

## User Preferences

- preference_id
- user_id
- genre
- preference_score

---

# 12. Dataset Preparation Plan

The application will use a manually prepared dataset.

Project workflow:

1. Collect publicly available K-Drama information from trusted online sources.
2. Organize and clean the collected information.
3. Create a structured dataset.
4. Import the dataset into MySQL.
5. Retrieve data through PHP APIs.
6. Display information in the React frontend.

Each drama record may contain:

- Title
- Genre
- Synopsis
- Poster
- Banner
- Rating
- Release Year

---

# 13. Recommendation Strategy

Initially, a simple rule-based recommendation approach will be implemented.

Recommendation factors:

- Frequently liked genres
- Previously liked dramas
- Previously watched dramas
- User swipe history

The recommendation score will prioritize dramas matching the user's demonstrated interests while avoiding content they have already watched or consistently disliked.

---

# 14. API Planning

Example endpoints:

GET /api/dramas

Returns available drama list.

GET /api/drama/{id}

Returns drama details.

POST /api/swipe

Stores left or right swipe.

POST /api/watch

Marks drama as watched.

GET /api/recommendations

Returns personalized recommendations.

GET /api/profile

Returns user profile information.

---

# 15. User Interface Plan

Home Page

- Welcome section
- Start browsing button

Swipe Page

- Drama banner
- Poster
- Title
- Genre
- Storyline
- Left Swipe
- Right Swipe
- Watched button

Profile Page

- User information
- Liked dramas
- Disliked dramas
- Watched dramas
- Favorite genres

Recommendation Page

- Top 10 personalized recommendations

---

# 16. Development Plan

Phase 1

- Project setup
- Database design
- Environment configuration

Phase 2

- Dataset preparation
- MySQL integration

Phase 3

- PHP backend API development

Phase 4

- React frontend development

Phase 5

- Swipe interaction implementation

Phase 6

- Recommendation logic

Phase 7

- User profile integration

Phase 8

- Testing and bug fixing

Phase 9

- Final deployment and documentation

---

# 17. Expected Outcomes

After completion, the system should:

- Allow users to browse K-Dramas efficiently
- Record swipe interactions
- Track watched dramas
- Build personalized user profiles
- Recommend relevant dramas
- Display Top 10 personalized recommendations
- Provide a responsive and user-friendly experience

---

# 18. Future Improvements

- AI-powered recommendation engine
- Machine Learning integration
- Collaborative filtering
- Trending dramas
- Search functionality
- Advanced filtering
- User reviews and ratings
- Favorite lists
- Streaming platform links
- Multi-language support

---

# 19. Conclusion

Hangug Deulama aims to provide a simple, engaging, and personalized K-Drama discovery experience through swipe-based interaction and user preference analysis. By combining React, Tailwind CSS, PHP, and MySQL, the project demonstrates practical full-stack web development concepts while delivering an intuitive recommendation system suitable for academic learning and future expansion.
