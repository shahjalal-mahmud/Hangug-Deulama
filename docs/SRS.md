# Software Requirements Specification (SRS)

# Hangug Deulama

## A Swipe-Based Personalized K-Drama Recommendation System

**Version:** 1.0

**Project Type:** Academic Project

**Course:** Software Development II

---

# 1. Introduction

## 1.1 Purpose

The purpose of Hangug Deulama is to provide users with a simple, interactive, and personalized platform for discovering Korean dramas (K-Dramas). The system uses a swipe-based interface where users can express their preferences by liking or skipping dramas and receive recommendations based on their interaction history.

This Software Requirements Specification (SRS) defines the functional requirements, non-functional requirements, system architecture, constraints, and expected behavior of the application.

---

## 1.2 Scope

Hangug Deulama is a web-based recommendation system that enables users to:

- Browse K-Dramas
- Swipe right to like dramas
- Swipe left to skip dramas
- Save dramas to Favorites
- Save dramas to Watch Later
- Mark dramas as Watched
- Maintain a personalized profile
- Receive Top 10 personalized recommendations

The system will use:

- React.js for the frontend
- Tailwind CSS for styling
- PHP for backend API development
- MySQL for database management

The recommendation engine will use stored user interaction data rather than machine learning algorithms.

---

## 1.3 Objectives

The objectives of the project are:

- Build a responsive web application
- Create a swipe-based recommendation interface
- Store user interaction history
- Generate personalized recommendations
- Provide a clean and user-friendly experience
- Demonstrate full-stack web development concepts

---

## 1.4 Intended Users

- K-Drama enthusiasts
- Casual viewers
- Students
- Entertainment lovers
- General web users

---

# 2. Overall Description

## 2.1 Product Perspective

Hangug Deulama is an independent web application consisting of:

- Frontend (React)
- Backend API (PHP)
- MySQL Database

The frontend communicates with the backend through REST-style JSON APIs.

```
User
   │
   ▼

React Frontend

   │

HTTP Requests

   │

PHP Backend API

   │

Business Logic

   │

MySQL Database
```

---

## 2.2 Product Features

The system will provide:

- User Registration
- User Login
- User Profile
- Swipe-based K-Drama browsing
- Like functionality
- Dislike functionality
- Favorite list
- Watch Later list
- Watched history
- Personalized recommendations
- Top 10 recommendation list

---

## 2.3 User Characteristics

Users should be able to:

- Navigate basic web interfaces
- Browse entertainment content
- Interact with swipe gestures or buttons

No technical expertise is required.

---

## 2.4 Assumptions and Dependencies

- Users have internet access.
- Backend server is operational.
- MySQL database is available.
- Browser supports modern JavaScript.
- Dataset is pre-populated by the administrator.

---

# 3. Functional Requirements

## FR-1 User Registration

The system shall allow users to create an account.

Input:

- Name
- Email
- Password

Output:

- User account creation

---

## FR-2 User Login

The system shall authenticate registered users.

Input:

- Email
- Password

Output:

- Successful login
- Authentication session

---

## FR-3 User Profile

The system shall maintain user profile information including:

- Personal information
- Favorites
- Watch Later list
- Watched history
- Swipe history
- Recommendation preferences

---

## FR-4 Browse K-Dramas

The system shall display:

- Banner
- Title
- Release Year
- IMDb Rating
- Genre
- Storyline
- Main Cast

---

## FR-5 Swipe Right

When a user swipes right:

- Drama is marked as liked
- User preference is updated
- Swipe history is stored

---

## FR-6 Swipe Left

When a user swipes left:

- Drama is marked as skipped/disliked
- Swipe history is stored
- Preference data is updated

---

## FR-7 Add to Favorites

Users shall be able to save dramas to a Favorites list.

The system shall:

- Store favorite record
- Display favorites in profile

---

## FR-8 Add to Watch Later

Users shall be able to save dramas for future viewing.

The system shall:

- Store watch later record
- Display watch later list

---

## FR-9 Mark as Watched

Users shall be able to mark dramas as watched.

The system shall:

- Save watched history
- Exclude watched dramas from future recommendations when appropriate

---

## FR-10 Personalized Recommendation

The recommendation engine shall analyze:

- Liked dramas
- Disliked dramas
- Favorite list
- Watch Later list
- Watched dramas
- Preferred genres

The system shall generate:

- Personalized recommendations
- Top 10 suggested dramas

---

## FR-11 Data Retrieval API

The backend shall provide JSON APIs for:

- Drama list
- Drama details
- User profile
- Swipe actions
- Favorites
- Watch Later
- Watched history
- Recommendations

---

# 4. Non-Functional Requirements

## 4.1 Performance

- Fast page loading
- Efficient database queries
- Responsive API responses

---

## 4.2 Reliability

The system should:

- Preserve user data
- Prevent data loss
- Maintain consistent recommendations

---

## 4.3 Usability

The interface should:

- Be intuitive
- Be mobile-friendly
- Be responsive
- Support simple navigation

---

## 4.4 Maintainability

The codebase should:

- Use modular architecture
- Separate frontend and backend
- Support future feature additions

---

## 4.5 Scalability

The database and backend should support:

- Larger drama datasets
- Additional recommendation features
- Future integrations

---

## 4.6 Security

The system should:

- Hash user passwords
- Validate user inputs
- Protect against SQL injection
- Protect against XSS attacks
- Authenticate protected endpoints

---

# 5. External Interface Requirements

## 5.1 User Interface

Pages include:

- Home
- Login
- Register
- Swipe Page
- Recommendations
- Favorites
- Watch Later
- Profile

The UI should use:

- Responsive layouts
- Modern cards
- Swipe interactions
- Clean typography

---

## 5.2 Software Interface

Frontend:

- React.js
- Tailwind CSS

Backend:

- PHP

Database:

- MySQL

Communication:

- JSON over HTTP

---

## 5.3 Hardware Interface

Requirements:

- Desktop
- Laptop
- Tablet
- Smartphone

Modern web browser required.

---

# 6. Database Requirements

## Users

- user_id
- name
- email
- password_hash
- created_at

---

## Dramas

- drama_id
- title
- banner_url
- release_year
- imdb_rating
- storyline
- genre
- stars

---

## Swipes

- swipe_id
- user_id
- drama_id
- swipe_type
- created_at

---

## Favorites

- favorite_id
- user_id
- drama_id

---

## Watch Later

- watch_later_id
- user_id
- drama_id

---

## Watched

- watched_id
- user_id
- drama_id
- watched_at

---

# 7. Recommendation Strategy

The recommendation engine will use rule-based logic.

Recommendation factors include:

- Frequently liked genres
- Liked dramas
- Favorite list
- Watch Later list
- Watched history
- Swipe history

The system will prioritize unseen dramas that best match user preferences.

---

# 8. Constraints

- PHP backend only
- MySQL database only
- React frontend
- Tailwind CSS styling
- Academic project scope
- Rule-based recommendation system
- No machine learning implementation

---

# 9. Future Enhancements

Potential future improvements include:

- AI-powered recommendations
- Machine learning integration
- User reviews
- Drama ratings
- Advanced filtering
- Search functionality
- Trending dramas
- Social sharing
- Multi-language support

---

# 10. Acceptance Criteria

The project will be considered successful if:

- Users can register and log in.
- Users can browse K-Dramas.
- Swipe interactions are stored correctly.
- Favorites work correctly.
- Watch Later works correctly.
- Watched history is maintained.
- User profiles display stored information.
- Personalized recommendations are generated.
- Top 10 recommendations are displayed.
- The application is responsive and user-friendly.

---

# 11. Conclusion

Hangug Deulama is designed to provide a simple, engaging, and personalized K-Drama discovery experience using a swipe-based interaction model. By combining React, Tailwind CSS, PHP, and MySQL, the project demonstrates practical full-stack web development concepts while delivering an intuitive recommendation system based on user behavior and preferences.
