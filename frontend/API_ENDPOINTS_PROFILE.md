# Profile API Endpoints Documentation

## Overview
This document describes the two new profile management endpoints for updating user profile information and deleting user accounts.

---

## 1. Update Profile Endpoint

### Endpoint
```
PUT /api/account/profile
```

### Description
Updates the authenticated user's profile information including username, bio, and profile picture.

### Authentication
Required - Bearer token in Authorization header

### Request Headers
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

### Request Body (FormData)
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `username` | string | Yes | New username for the user |
| `bio` | string | No | User's biography/description |
| `profilePicture` | File | No | Image file for profile picture (accepts: image/*) |

### Request Example
```javascript
const formData = new FormData();
formData.append('username', 'newusername');
formData.append('bio', 'This is my bio');
formData.append('profilePicture', file); // File object from input

const response = await fetch('/api/account/profile', {
    method: 'PUT',
    headers: {
        'Authorization': `Bearer ${token}`
    },
    body: formData
});
```

### Success Response (200 OK)
```json
{
    "id": 1,
    "username": "newusername",
    "email": "user@example.com",
    "bio": "This is my bio",
    "profilePictureUrl": "https://example.com/uploads/profile/123.jpg",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
}
```

### Error Responses

#### 400 Bad Request - Validation Error
```json
{
    "error": "Username is required",
    "message": "Username cannot be empty"
}
```

#### 401 Unauthorized
```json
{
    "error": "Unauthorized",
    "message": "Invalid or missing authentication token"
}
```

#### 409 Conflict - Username Already Exists
```json
{
    "error": "Username already taken",
    "message": "The username 'newusername' is already in use"
}
```

#### 500 Internal Server Error
```json
{
    "error": "Internal server error",
    "message": "Failed to update profile"
}
```

### Notes
- If `profilePicture` is not provided, the existing profile picture is retained
- If `bio` is not provided or is empty, it will be set to null
- Username must be unique across all users
- Profile picture file should be a valid image format (jpg, png, gif, etc.)
- Recommended maximum file size: 5MB
- Profile picture will be resized/optimized by the server

---

## 2. Delete Account Endpoint

### Endpoint
```
DELETE /api/account/delete
```

### Description
Permanently deletes the authenticated user's account and all associated data. This action cannot be undone.

### Authentication
Required - Bearer token in Authorization header

### Request Headers
```
Authorization: Bearer <token>
```

### Request Body
None required

### Request Example
```javascript
const response = await fetch('/api/account/delete', {
    method: 'DELETE',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
});
```

### Success Response (200 OK)
```json
{
    "success": true,
    "message": "Account deleted successfully"
}
```

### Error Responses

#### 401 Unauthorized
```json
{
    "error": "Unauthorized",
    "message": "Invalid or missing authentication token"
}
```

#### 403 Forbidden
```json
{
    "error": "Forbidden",
    "message": "You do not have permission to delete this account"
}
```

#### 500 Internal Server Error
```json
{
    "error": "Internal server error",
    "message": "Failed to delete account"
}
```

### Important Notes
- ⚠️ **This action is irreversible** - All user data will be permanently deleted including:
  - User profile information
  - All created pins
  - All saved pins
  - All boards
  - All comments
  - All likes and follows
- The client should show a confirmation dialog before calling this endpoint
- After successful deletion, the user should be logged out and redirected to the home page
- The authentication token becomes invalid immediately after account deletion
- Consider implementing a grace period (e.g., 30 days) before permanent deletion if required

---

## Implementation Notes

### Frontend Implementation Pattern
```javascript
// Update Profile
const formData = new FormData();
formData.append('username', username);
formData.append('bio', bio);
if (profilePicture) {
    formData.append('profilePicture', profilePicture);
}

const result = await updateProfile(formData);
if (result.success) {
    // Update user context with new data
    // Redirect to profile page
} else {
    // Show error message
}

// Delete Account
const confirmed = window.confirm(
    'Are you sure you want to delete your account? This action cannot be undone.'
);
if (confirmed) {
    const result = await deleteAccount();
    if (result.success) {
        // Logout user
        // Clear localStorage
        // Redirect to home page
    }
}
```

### Backend Implementation Suggestions

#### For Update Profile:
1. Validate username format (alphanumeric, underscores, min/max length)
2. Check username uniqueness
3. Validate file type and size for profile picture
4. Store uploaded image in cloud storage or file system
5. Update database record
6. Return updated user object

#### For Delete Account:
1. Verify authentication
2. Optionally implement soft delete (mark as deleted, delete after grace period)
3. Cascade delete or anonymize related data:
   - Delete or anonymize pins
   - Delete or anonymize comments
   - Remove from boards
   - Delete follow relationships
4. Delete user record
5. Invalidate all active sessions/tokens
6. Return success response

---

## Testing Examples

### cURL Examples

#### Update Profile
```bash
curl -X PUT "https://your-api.com/api/account/profile" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "username=newusername" \
  -F "bio=My new bio" \
  -F "profilePicture=@/path/to/image.jpg"
```

#### Delete Account
```bash
curl -X DELETE "https://your-api.com/api/account/delete" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

