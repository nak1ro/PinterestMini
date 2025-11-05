# Backend Instructions: Followers/Following Lists for Other Users

## Overview
The frontend now allows users to view followers and following lists for any user profile (not just their own). This uses existing endpoints but should be verified to work for any userId.

## Endpoints Used

### 1. Get Followers List
**Endpoint:** `GET /follow/{userId}/followers`

**Description:** Returns a list of users who follow the specified user.

**Request:**
- Path parameter: `userId` (string/GUID) - The ID of the user whose followers you want to retrieve

**Response:**
```json
[
  {
    "id": "user-id-1",
    "username": "username1",
    "profilePictureUrl": "https://...",
    "displayName": "Display Name" // optional
  },
  {
    "id": "user-id-2",
    "username": "username2",
    "profilePictureUrl": "https://...",
    "displayName": "Display Name" // optional
  }
]
```

**Requirements:**
- Should work for any valid userId (not just the authenticated user)
- Should return an array of user objects with at minimum: `id`, `username`, `profilePictureUrl`
- Optional: `displayName` field for additional user information
- Should return empty array `[]` if user has no followers
- Should return 404 if userId doesn't exist

---

### 2. Get Following List
**Endpoint:** `GET /follow/{userId}/following`

**Description:** Returns a list of users that the specified user is following.

**Request:**
- Path parameter: `userId` (string/GUID) - The ID of the user whose following list you want to retrieve

**Response:**
```json
[
  {
    "id": "user-id-1",
    "username": "username1",
    "profilePictureUrl": "https://...",
    "displayName": "Display Name" // optional
  },
  {
    "id": "user-id-2",
    "username": "username2",
    "profilePictureUrl": "https://...",
    "displayName": "Display Name" // optional
  }
]
```

**Requirements:**
- Should work for any valid userId (not just the authenticated user)
- Should return an array of user objects with at minimum: `id`, `username`, `profilePictureUrl`
- Optional: `displayName` field for additional user information
- Should return empty array `[]` if user is not following anyone
- Should return 404 if userId doesn't exist

---

## Verification Checklist

- [ ] Endpoints work for any userId (not just authenticated user's own ID)
- [ ] Endpoints return proper 404 when userId doesn't exist
- [ ] Response format matches the expected structure (array of user objects)
- [ ] User objects include: `id`, `username`, `profilePictureUrl`
- [ ] Empty arrays are returned when user has no followers/following
- [ ] Authentication is not required (or works for unauthenticated users viewing public profiles)

## Notes

- These endpoints are already implemented and used in the user's own profile page
- The frontend will only fetch data when the modal is opened (lazy loading)
- No new endpoints are required - only verification that existing endpoints work for any userId

