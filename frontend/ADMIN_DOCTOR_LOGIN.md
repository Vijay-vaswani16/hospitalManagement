# Admin and Doctor Login Guide

## How to Login as Admin or Doctor

### Option 1: Sign Up with Role Selection

1. Go to the **Sign Up** page
2. Fill in your details (Name, Email, Password)
3. Select your **Account Type** from the dropdown:
   - **Patient** - For regular patients
   - **Doctor** - For medical doctors
   - **Administrator** - For system administrators
4. Click **Sign Up**
5. You will be automatically logged in with the selected role

### Option 2: Use Existing Demo Credentials

The system may have demo accounts configured. Try these credentials:

**Admin Account:**
- Username: `admin`
- Password: `pass`

**Patient Account:**
- Username: `patient`
- Password: `pass`

### Option 3: Create Account and Assign Role Later

1. Sign up as a **Patient** (default role)
2. An existing **Admin** user can then:
   - Assign **DOCTOR** role by onboarding you as a doctor via the Admin Dashboard
   - Assign **ADMIN** role directly in the database (requires backend access)

## How Roles Work

### Patient Role
- Default role for new signups
- Can book appointments
- Can view their profile
- Access: Patient Dashboard

### Doctor Role
- Can be assigned during signup OR
- Can be assigned by an Admin through the "Onboard Doctor" feature
- Can view their appointments
- Access: Doctor Dashboard

### Admin Role
- Can be assigned during signup OR
- Must be assigned manually in the database
- Full system access
- Can manage patients
- Can onboard doctors
- Access: Admin Dashboard

## Important Notes

1. **Role Selection During Signup**: The signup form now allows you to select your role. However, in production environments, ADMIN role assignment should be restricted and managed by system administrators.

2. **Multiple Roles**: Users can have multiple roles simultaneously. For example, a user can be both a DOCTOR and an ADMIN.

3. **Role Detection**: After login, the system automatically detects your roles by testing access to role-specific endpoints.

4. **Doctor Onboarding**: If you sign up as a Patient but need Doctor access, an Admin can onboard you as a doctor using the Admin Dashboard's "Onboard Doctor" feature.

## Troubleshooting

### Can't Access Admin/Doctor Features
- Make sure you selected the correct role during signup
- Check that your account has the required role assigned
- Try logging out and logging back in to refresh your roles
- Contact an administrator to verify your role assignment

### Role Not Detected
- The system detects roles by testing access to role-specific endpoints
- If role detection fails, try:
  1. Logging out and logging back in
  2. Clearing browser cache and localStorage
  3. Verifying your role in the backend database

## Backend Configuration

If you need to manually assign roles in the backend:

1. **Database**: Update the `app_user` table's roles column
2. **Via Admin Endpoint**: Use the `/admin/onBoardNewDoctor` endpoint to assign DOCTOR role
3. **Direct User Update**: Modify the user's roles set in the database

## Security Note

In a production environment:
- Admin role assignment should be restricted
- Only trusted administrators should be able to assign ADMIN roles
- Consider implementing role approval workflows
- Use proper authentication and authorization mechanisms

