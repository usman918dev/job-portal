# Skills Feature Documentation

## Overview
LinkedIn-style skills management feature that allows users to add, search, and manage their professional skills with autocomplete suggestions.

## Feature Highlights
- ✅ **LinkedIn-Style Autocomplete** - Start typing and get instant skill suggestions
- ✅ **Keyboard Navigation** - Use arrow keys and Enter to select skills
- ✅ **Visual Feedback** - Beautiful animations and hover effects
- ✅ **Smart Filtering** - Only shows skills you haven't added yet
- ✅ **User-Only Feature** - Skills section only appears for regular users (not admins/recruiters)
- ✅ **Persistent Storage** - Skills are saved to MongoDB and synced across sessions
- ✅ **Maximum Limit** - Users can add up to 50 skills

---

## File Structure

### Frontend Files Created/Modified

#### 1. **`client/src/constants/skillsConstants.js`** (NEW)
Comprehensive list of 150+ professional skills across multiple categories:
- Programming Languages (JavaScript, Python, Java, etc.)
- Frontend Development (React, Vue, Angular, etc.)
- Backend Development (Node.js, Django, Spring Boot, etc.)
- Databases (MongoDB, MySQL, PostgreSQL, etc.)
- Cloud & DevOps (AWS, Docker, Kubernetes, etc.)
- Mobile Development (React Native, Flutter, Swift, etc.)
- Data Science & AI (Machine Learning, TensorFlow, etc.)
- Design (Figma, Adobe XD, UI/UX, etc.)
- Soft Skills (Leadership, Communication, etc.)

**Key Functions:**
```javascript
filterSkills(query, existingSkills) // Filters skills based on search query
MAX_SKILLS = 50 // Maximum skills allowed
MIN_CHARS_FOR_SUGGESTIONS = 1 // Minimum characters to show suggestions
```

#### 2. **`client/src/components/SkillsInput.jsx`** (NEW)
Reusable LinkedIn-style skills input component with:
- Real-time autocomplete dropdown
- Keyboard navigation (Arrow Up/Down, Enter, Escape)
- Click-to-remove skills
- Visual skill pills with gradient backgrounds
- Smooth animations using Framer Motion
- Accessibility features

**Props:**
```javascript
{
  skills: Array<string>,      // Current skills array
  onChange: Function,          // Callback when skills change
  disabled: Boolean,           // Disable editing
  maxSkills: Number           // Maximum skills (default: 50)
}
```

**Features:**
- Autocomplete suggestions appear as you type
- Arrow keys to navigate suggestions
- Enter to select highlighted suggestion
- Click outside to close suggestions
- Click skill pill to remove it
- Shows skill count (X / 50 skills added)

#### 3. **`client/src/pages/Profile.jsx`** (MODIFIED)
Added skills section to user profile:
- Imports SkillsInput component
- Added `handleSkillsChange()` handler
- Skills section only renders for non-admin roles
- Integrates with save profile functionality
- Skills persist to backend on save

**Role-based rendering:**
```javascript
{currentUser?.role !== 'admin' && 
 currentUser?.role !== 'Admin' && 
 currentUser?.role !== 'Recruiter' && (
  <SkillsInput ... />
)}
```

#### 4. **`client/src/utils/profileUtils.js`** (MODIFIED)
Updated `initializeFormData()` to include:
```javascript
skills: user?.skills || []
```

#### 5. **`client/src/services/profileService.js`** (MODIFIED)
Updated `updateUserProfile()` to use correct endpoint:
```javascript
PUT /api/auth/profile/:id
```

---

### Backend Files Created/Modified

#### 1. **`backend/models/User.js`** (MODIFIED)
Added skills field to User schema:
```javascript
skills: {
  type: [String],
  default: [],
  validate: {
    validator: function(skills) {
      return skills.length <= 50;
    },
    message: 'You cannot add more than 50 skills'
  }
}
```

Also added other profile fields:
- `phone`: String
- `location`: String
- `company`: String
- `position`: String
- `website`: String
- `bio`: String (max 500 characters)

#### 2. **`backend/routes/userRoute.js`** (MODIFIED)
Added profile update route for authenticated users:
```javascript
router.put('/profile/:id', verifyToken, updateUser);
```

**Endpoint:** `PUT /api/auth/profile/:id`  
**Middleware:** verifyToken (requires authentication)  
**Controller:** updateUser

#### 3. **`backend/controllers/userController.js`** (NO CHANGE)
Already handles profile updates through `updateUserService()`

#### 4. **`backend/services/userService.js`** (NO CHANGE)
`updateUser()` function already handles all user fields including skills

---

## API Endpoints

### Update User Profile
**Endpoint:** `PUT /api/auth/profile/:id`  
**Authentication:** Required (JWT token)  
**Request Body:**
```json
{
  "name": "John Doe",
  "phone": "+1234567890",
  "location": "New York, USA",
  "company": "Tech Corp",
  "position": "Software Engineer",
  "website": "https://johndoe.com",
  "bio": "Passionate developer...",
  "skills": [
    "JavaScript",
    "React.js",
    "Node.js",
    "MongoDB",
    "AWS"
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "skills": ["JavaScript", "React.js", ...],
    ...
  }
}
```

---

## User Flow

### Adding Skills

1. **User navigates to Profile page**
   - Only visible for users with role: 'user', 'Job Seeker'
   - Not visible for 'admin', 'Admin', or 'Recruiter' roles

2. **User clicks "Edit Profile" button**
   - Profile fields become editable
   - Skills input is enabled

3. **User types in skills input field**
   - After 1 character, autocomplete dropdown appears
   - Shows matching skills from predefined list
   - Filters out already-added skills

4. **User navigates suggestions**
   - Arrow Down/Up: Navigate suggestions
   - Enter: Select highlighted suggestion
   - Click: Select suggestion
   - Escape: Close dropdown

5. **Selected skill appears as pill**
   - Blue gradient background
   - Shows in skills section below input
   - Hover to see remove (X) button

6. **User clicks "Save Changes"**
   - API call to `PUT /api/auth/profile/:id`
   - Skills saved to MongoDB
   - Success toast notification
   - Skills persist in localStorage and context

### Removing Skills

1. **Click on skill pill**
   - Skill is immediately removed from formData
   - Pill animates out
   - Skill becomes available in autocomplete again

2. **Click "Save Changes"**
   - Updated skills array saved to backend

---

## Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  password: String (hashed),
  role: String,
  // ... other fields
  
  // New profile fields
  phone: String,
  location: String,
  company: String,
  position: String,
  website: String,
  bio: String,
  skills: [String], // Array of skill names
  
  createdAt: Date,
  updatedAt: Date
}
```

**Validation:**
- Skills array maximum: 50 items
- Bio maximum: 500 characters

---

## Component Architecture

### SkillsInput Component

**State Management:**
```javascript
const [inputValue, setInputValue] = useState('')      // Current input
const [suggestions, setSuggestions] = useState([])     // Filtered suggestions
const [showSuggestions, setShowSuggestions] = useState(false)
const [selectedIndex, setSelectedIndex] = useState(-1) // Keyboard navigation
```

**Key Functions:**
- `handleInputChange()` - Filters and shows suggestions
- `addSkill()` - Adds skill to array with validation
- `removeSkill()` - Removes skill from array
- `handleSuggestionClick()` - Handles mouse selection
- `handleKeyDown()` - Handles keyboard navigation

**Animations:**
- Suggestions dropdown: Fade in/out with slide
- Skill pills: Scale in with stagger effect
- Hover effects: Shadow and transform transitions

---

## Styling

### CSS Classes
- **Input Field:** Rounded-xl, border-2, backdrop-blur, focus ring
- **Suggestions Dropdown:** White background, border-2, shadow-2xl, max-height 256px
- **Suggestion Items:** Gradient on hover/selected, smooth transitions
- **Skill Pills:** Blue gradient, rounded-lg, shadow-md, hover shadow-lg
- **Remove Icon:** Opacity 0 → 100 on hover

### Color Palette
- Primary: Blue-500 to Indigo-600 gradient
- Background: White with backdrop-blur
- Borders: Gray-200
- Text: Gray-700 (normal), White (selected/pills)
- Hover: Blue-50 background

---

## Testing Guide

### Manual Testing Steps

1. **Login as User Role**
   ```
   Email: user@example.com
   Role: user
   ```

2. **Navigate to Profile**
   - Click profile icon/menu
   - Verify skills section is visible

3. **Test Autocomplete**
   - Type "jav" → See "Java", "JavaScript"
   - Type "react" → See "React.js", "React Native"
   - Type "python" → See "Python"

4. **Test Keyboard Navigation**
   - Type "node"
   - Press Arrow Down → First suggestion highlighted
   - Press Arrow Down again → Second suggestion
   - Press Enter → Skill added

5. **Test Adding Skills**
   - Add 5 different skills
   - Verify each appears as pill
   - Verify count updates (5 / 50 skills added)

6. **Test Removing Skills**
   - Hover over skill pill → X appears
   - Click skill → Skill removed
   - Verify count updates

7. **Test Save Functionality**
   - Click "Edit Profile"
   - Add skills: "JavaScript", "React.js", "Node.js"
   - Click "Save Changes"
   - Verify success toast
   - Refresh page → Skills persist

8. **Test Role Restriction**
   - Login as Admin/Recruiter
   - Navigate to Profile
   - Verify skills section NOT visible

9. **Test Maximum Limit**
   - Add 50 skills
   - Try adding 51st skill
   - Verify input disabled with message

10. **Test Duplicate Prevention**
    - Add "JavaScript"
    - Try typing "javascript" again
    - Verify it doesn't appear in suggestions

### Backend API Testing

```bash
# Update profile with skills
curl -X PUT http://localhost:5000/api/auth/profile/USER_ID \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "skills": ["JavaScript", "React.js", "Node.js"]
  }'

# Expected Response:
{
  "success": true,
  "data": {
    "_id": "...",
    "skills": ["JavaScript", "React.js", "Node.js"],
    ...
  }
}
```

---

## Troubleshooting

### Issue: Skills not saving
**Solution:** 
- Check if user has `_id` field
- Verify JWT token in localStorage
- Check browser console for API errors
- Ensure backend server is running

### Issue: Autocomplete not showing
**Solution:**
- Type at least 1 character
- Check skillsConstants.js is properly imported
- Verify suggestions array has items

### Issue: 403 Forbidden error
**Solution:**
- Ensure using `/api/auth/profile/:id` endpoint (not `/api/users/:id`)
- Verify verifyToken middleware is applied
- Check JWT token is valid

### Issue: Skills appear for admin users
**Solution:**
- Check role condition in Profile.jsx
- Verify `currentUser.role` value
- Ensure condition checks all admin variants

---

## Future Enhancements

1. **Skill Endorsements** - Allow other users to endorse skills
2. **Skill Levels** - Add proficiency levels (Beginner, Intermediate, Expert)
3. **Custom Skills** - Allow users to add skills not in predefined list
4. **Skill Recommendations** - Suggest skills based on job applications
5. **Skill Sorting** - Drag and drop to reorder skills
6. **Skill Categories** - Group skills by type (Technical, Soft, etc.)
7. **Skill Analytics** - Show skill demand in job market
8. **Export Skills** - Export skills to resume/CV

---

## Performance Considerations

- Autocomplete limited to 10 suggestions (prevents UI clutter)
- Debouncing not implemented (instant feedback preferred)
- Skills array limited to 50 items (prevents database bloat)
- LocalStorage used for immediate feedback before API call
- Framer Motion animations optimized with GPU acceleration

---

## Security

- Skills validated on both frontend and backend
- Maximum 50 skills enforced in database schema
- XSS protection: Skills are strings, properly escaped in React
- Authentication required for profile updates
- Users can only update their own profiles

---

## Browser Compatibility

- Chrome: ✅ Fully supported
- Firefox: ✅ Fully supported
- Safari: ✅ Fully supported
- Edge: ✅ Fully supported
- Mobile browsers: ✅ Responsive design

---

## Dependencies

### Frontend
- `framer-motion`: Animations
- `lucide-react`: Icons (Plus, X, CheckCircle)
- `react-toastify`: Toast notifications
- `axios`: API calls

### Backend
- `mongoose`: MongoDB ORM
- `jsonwebtoken`: JWT authentication
- `express`: Web framework

---

## Code Examples

### Using SkillsInput Component
```jsx
import SkillsInput from '../components/SkillsInput';

function MyComponent() {
  const [skills, setSkills] = useState([]);
  
  return (
    <SkillsInput
      skills={skills}
      onChange={setSkills}
      disabled={false}
      maxSkills={50}
    />
  );
}
```

### Filtering Skills
```javascript
import { filterSkills } from '../constants/skillsConstants';

const currentSkills = ['JavaScript', 'React.js'];
const query = 'java';
const suggestions = filterSkills(query, currentSkills);
// Returns: ['Java'] (JavaScript excluded as already added)
```

### Updating Profile with Skills
```javascript
import { updateUserProfile } from '../services/profileService';

const updatedData = {
  skills: ['JavaScript', 'React.js', 'Node.js']
};

const result = await updateUserProfile(userId, updatedData);
```

---

## Conclusion

The skills feature provides a professional, LinkedIn-style experience for users to manage their skills. It's fully integrated with the backend, includes proper validation, and offers an intuitive user interface with keyboard and mouse interactions.

**Status:** ✅ Ready for Production

**Last Updated:** October 16, 2025
