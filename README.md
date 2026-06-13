# 🎬 Hangug Deulama

> A swipe-based K-Drama recommendation web application built with **React, Tailwind CSS, PHP, and MySQL**.

Hangug Deulama (한국 드라마) is a simple and user-friendly web application that helps users discover their next favorite K-Drama through an intuitive swipe experience. Inspired by the simplicity of swipe-based interfaces, users can quickly express their preferences and receive personalized recommendations based on their interactions.

> **Academic Project** — Developed for the **Software Development II** course.

---

## ✨ Features

- 🎭 Browse K-Dramas with beautiful banner images
- 👉 Swipe right to like a drama
- 👈 Swipe left to skip a drama
- ❤️ Save dramas to Favorites
- 🔖 Save dramas to Watch Later
- ✅ Mark dramas as Watched
- 👤 Personalized user profile
- 📊 Store complete user interaction history
- 🎯 Personalized Top 10 recommendations
- 📱 Responsive and modern UI
- ⚡ Fast JSON-based PHP API

---

## 🖼️ Drama Information

Each drama card may contain:

- Banner Image
- Title
- Release Year
- IMDb Rating
- Genre(s)
- Short Storyline
- Main Cast
- Status
- Episodes
- Runtime

Example:

```text
Title: Guardian: The Lonely and Great God

Banner:
(Image)

Year:
2016–2017

IMDb Rating:
8.5

Storyline:
In his quest for a bride to break his immortal curse, Dokkaebi, a 939-year-old guardian of souls, meets a grim reaper and a sprightly student with a tragic past.

Stars:
Gong Yoo
Kim Go-eun
Lee Dong-wook
```

---

## 🎯 How It Works

1. User browses K-Dramas.
2. User swipes:
   - 👉 Right = Like
   - 👈 Left = Skip

3. User can:
   - ❤️ Add to Favorites
   - 🔖 Add to Watch Later
   - ✅ Mark as Watched

4. Every interaction is saved to the user's profile.
5. The recommendation engine analyzes user preferences.
6. The system generates personalized recommendations and a Top 10 list.

---

## 🛠️ Tech Stack

### Frontend

- React.js
- Tailwind CSS
- React Router
- Axios

### Backend

- PHP

### Database

- MySQL

### Data Format

- JSON API

---

## 📂 Project Structure

```text
Hangug-Deulama/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── api/
│   ├── config/
│   ├── models/
│   └── controllers/
│
├── database/
│   ├── schema.sql
│   └── seed.sql
│
├── docs/
│
└── README.md
```

---

## 🗄️ Planned Database Structure

### Users

```text
id
name
email
password
created_at
```

### Dramas

```text
id
title
banner_url
release_year
imdb_rating
genre
storyline
stars
episodes
runtime
created_at
```

### User Swipes

```text
id
user_id
drama_id
swipe_type
created_at
```

`swipe_type`

- like
- dislike

### Favorites

```text
id
user_id
drama_id
created_at
```

### Watch Later

```text
id
user_id
drama_id
created_at
```

### Watched

```text
id
user_id
drama_id
watched_at
```

---

## 🎯 Recommendation Logic

Recommendations will be generated using:

- Liked dramas
- Disliked dramas
- Favorite dramas
- Watch Later list
- Watched history
- Preferred genres
- User interaction history

The system will suggest the most relevant K-Dramas while avoiding dramas the user has already watched.

---

## 📡 Planned API Endpoints

```http
GET    /api/dramas

GET    /api/dramas/{id}

POST   /api/swipe

POST   /api/favorites

POST   /api/watch-later

POST   /api/watched

GET    /api/recommendations

GET    /api/profile
```

---

## 📊 Dataset

The project will use a custom-built K-Drama dataset created from publicly available information collected from well-known entertainment sources.

Each record may include:

- Title
- Banner Image
- Release Year
- IMDb Rating
- Genres
- Storyline
- Main Cast
- Episodes
- Runtime

---

## 🚀 Future Improvements

- Smart recommendation algorithm
- Search functionality
- Genre filtering
- User ratings
- Reviews and comments
- Trending dramas
- Popular this week
- Dark mode
- Multi-language support
- AI-powered recommendations

---

## 🎓 Academic Purpose

This project is being developed as part of the **Software Development II** course to demonstrate:

- Full-stack web development
- REST-style API development
- Database design
- User interaction tracking
- Recommendation systems
- Responsive frontend development
- Modern UI/UX principles

---

## 👨‍💻 Developer

**Md. Shahajalal Mahmud**

- Full Stack Developer
- Android Developer
- Software Engineering Student

---

## 📄 License

This project is created for educational and academic purposes.
