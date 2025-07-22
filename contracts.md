# TransformBuddy.AI Webinar Landing Page - API Contracts

## Overview
This document outlines the API contracts and integration points between the frontend and backend for the TransformBuddy.AI webinar landing page.

## Backend Endpoints

### 1. Webinar Registration
**Endpoint:** `POST /api/webinar-register`

**Request Body:**
```json
{
  "fullName": "string (required)",
  "email": "string (required, valid email)",
  "whatsapp": "string (required)",
  "referralSource": "string (optional)"
}
```

**Response:**
```json
{
  "status": "success" | "error",
  "message": "string"
}
```

**Functionality:**
- Validates and saves registration to MongoDB `webinar_registrations` collection
- Sends notification email to `support@transformbuddy.ai`
- Sends confirmation email to registered user
- Both emails sent via SendGrid in background tasks

### 2. Registration Statistics
**Endpoint:** `GET /api/webinar-stats`

**Response:**
```json
{
  "total_registrations": "number",
  "available_seats": "number",
  "referral_breakdown": [
    {
      "_id": "referral_source",
      "count": "number"
    }
  ]
}
```

**Functionality:**
- Returns real-time registration count
- Calculates available seats (100 total limit)
- Provides breakdown by referral source

### 3. Admin - View Registrations
**Endpoint:** `GET /api/webinar-registrations`

**Response:**
```json
[
  {
    "id": "string",
    "fullName": "string",
    "email": "string",
    "whatsapp": "string",
    "referralSource": "string",
    "timestamp": "datetime"
  }
]
```

## Frontend Integration Changes

### Mock Data Replacement
**File:** `/app/frontend/src/data/mockData.js`
- Remove `mockFormSubmission` function
- Keep static content data (benefits, testimonials, FAQ, etc.)
- Update urgency data to use real-time API data

### Form Integration
**File:** `/app/frontend/src/components/LandingPage.jsx`

**Changes Required:**
1. Replace mock form submission with real API call
2. Update urgency section to fetch live registration count
3. Add proper error handling for API failures
4. Update success message handling

**New Functions:**
```javascript
// Replace mockFormSubmission with:
const submitRegistration = async (formData) => {
  const response = await fetch(`${BACKEND_URL}/api/webinar-register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  });
  return response.json();
};

// Add for live stats:
const fetchWebinarStats = async () => {
  const response = await fetch(`${BACKEND_URL}/api/webinar-stats`);
  return response.json();
};
```

### Environment Variables
**File:** `/app/frontend/.env`
- Uses existing `REACT_APP_BACKEND_URL` for API calls

## Database Schema

### Collection: `webinar_registrations`
```javascript
{
  _id: ObjectId,
  id: "uuid-string",
  fullName: "string",
  email: "string", 
  whatsapp: "string",
  referralSource: "string | null",
  timestamp: Date
}
```

## Email Templates

### Admin Notification Email
- **To:** support@transformbuddy.ai
- **Subject:** "New Webinar Registration - {fullName}"
- **Content:** Professional HTML template with registration details
- **Styling:** Dark theme with neon green accents matching landing page

### User Confirmation Email  
- **To:** {user_email}
- **Subject:** "🎉 Welcome to TransformBuddy.AI Free Webinar!"
- **Content:** Welcome message with webinar details and next steps
- **Styling:** Branded HTML template with clear CTA and information

## Error Handling

### Backend Errors
- Email delivery failures: Registration still succeeds, user notified
- Database failures: Proper HTTP error codes returned
- Validation errors: 422 status with field-specific messages

### Frontend Errors
- Network failures: User-friendly error messages
- Validation: Client-side validation before API call
- Loading states: Proper loading indicators during submission

## Security Considerations
- SendGrid API key stored in backend environment variables only
- Email addresses validated on both frontend and backend
- CORS configured for frontend domain
- Rate limiting on registration endpoint (consider implementing)

## Testing Requirements
- Test email delivery to both admin and user
- Verify registration data persistence
- Test error scenarios (invalid emails, API failures)
- Verify live stats update correctly
- Test form submission with various referral sources

## Production Readiness
- Environment-specific sender email addresses
- SendGrid domain authentication setup
- Monitoring for email delivery rates
- Database indexing on timestamp and email fields
- Rate limiting and abuse prevention