# Admin Panel Setup Guide

## How to Access the Admin Panel

The admin panel is available at: **`/admin`**

You'll see an "Admin Panel" button in the bottom-left corner of the homepage when logged in as an admin.

## How to Make Yourself an Admin

Since you don't have admin access yet, you need to assign the admin role to your account:

### Step 1: Sign Up for an Account
1. Go to `/auth` route
2. Create an account with your email and password
3. Log in with your credentials

### Step 2: Assign Admin Role

You need to add yourself to the `user_roles` table in the database:

1. **Get Your User ID:**
   - After signing up, check the authentication logs or query the database
   - Or use this SQL query to find your user ID:
   ```sql
   SELECT id, email FROM auth.users ORDER BY created_at DESC LIMIT 5;
   ```

2. **Assign Admin Role:**
   - Run this SQL query in your database (replace `YOUR_USER_ID` with your actual user ID):
   ```sql
   INSERT INTO public.user_roles (user_id, role)
   VALUES ('YOUR_USER_ID', 'admin');
   ```

### Step 3: Access the Admin Panel
1. Log out and log back in (or refresh the page)
2. You should now see the "Admin Panel" button in the bottom-left corner
3. Click it or navigate to `/admin` directly

## Admin Panel Features

### 📊 Dashboard Tab
- **Total Orders**: View all orders received
- **Total Revenue**: See total earnings from paid orders
- **Paid Orders**: Count of successfully paid orders
- **Today's Orders**: Orders received today
- **Quick Stats**: Conversion rate and average order value

### 🛒 Orders Tab
- **View All Orders**: Complete list with customer details
- **Customer Information**: Name, email, phone number
- **Order Details**: Amount, payment ID, gift options
- **Update Order Status**: Change status (Created → Paid → Processing → Shipped → Delivered)
- **Export to CSV**: Download all order data as CSV file
- **Filter & Search**: Find specific orders quickly

### 📝 Content Tab
- **Edit Landing Page**: Modify page content directly
- **Update Text**: Change titles, descriptions, button text
- **Quick Updates**: Save changes instantly

## Order Statuses

You can update orders through these statuses:
1. **Created** - Order initiated
2. **Paid** - Payment confirmed
3. **Processing** - Order being prepared
4. **Shipped** - Order dispatched
5. **Delivered** - Order completed
6. **Cancelled** - Order cancelled

## Exporting Order Data

Click the "Export CSV" button in the Orders tab to download:
- Order ID
- Date & Time
- Customer Name
- Email Address
- Phone Number
- Amount
- Payment Status
- Gift Wrap Details
- Gift Note
- Razorpay Payment ID

## Security Notes

⚠️ **Important Security Information:**

1. **Role-Based Access**: Only users with admin role can access the panel
2. **Protected Routes**: Automatically redirects non-admins to home page
3. **Secure Authentication**: Uses Supabase authentication
4. **RLS Policies**: Database-level security enforced

## Troubleshooting

**Can't see Admin Panel button?**
- Make sure you're logged in
- Verify you have admin role in `user_roles` table
- Try logging out and back in

**Access Denied error?**
- Check that your user_id matches in the `user_roles` table
- Verify the role is exactly 'admin' (lowercase)

**Orders not showing?**
- Ensure RLS policies are correctly set on orders table
- Check that admin role policy is enabled

## Next Steps

Once you have admin access:
1. Test the payment flow by making a test order
2. Update order status to track fulfillment
3. Export data regularly for record-keeping
4. Customize page content as needed

For additional help, check the database structure in Supabase or review the RLS policies.
