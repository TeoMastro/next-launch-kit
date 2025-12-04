# Stripe Setup Guide

## Invoice Finalization Settings

To ensure invoices are finalized immediately instead of waiting 72 hours:

### 1. Set Auto-Finalization in Stripe Dashboard

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Click **Settings** (top right gear icon)
3. Navigate to **Billing** → **Subscriptions and emails**
4. Under **"Invoices and receipts"** section, find **"Finalize draft invoices"**
5. Change from **"3 days before the invoice is due"** to **"Immediately"**
6. Click **Save**

This ensures all future invoices are finalized immediately when created.

### 2. For Existing Draft Invoices

If you already have draft invoices waiting:

**Via Dashboard:**
1. Go to **Invoices** in the left sidebar
2. Find the draft invoice
3. Click on it
4. Click **"Finalize invoice"** button

**Via Stripe CLI:**
```bash
# List draft invoices
stripe invoices list --status=draft

# Finalize a specific invoice
stripe invoices finalize <invoice_id>
```

## Test Clocks for Subscription Testing

### Creating a Test Clock

1. Go to [Stripe Dashboard](https://dashboard.stripe.com) → **Developers** → **Test clocks**
2. Click **"Create test clock"**
3. Set the initial time (usually current time)
4. Click **Create**
5. Copy the test clock ID (starts with `clock_`)

### Using Test Clocks

1. Add the test clock ID to your `.env` file:
   ```env
   STRIPE_TEST_CLOCK_ID=clock_xxxxxxxxxxxxx
   ```

2. Create a new subscription - it will automatically be linked to the test clock

3. Advance time in Stripe Dashboard:
   - Go to **Developers** → **Test clocks**
   - Click on your test clock
   - Use **"Advance time"** button to jump forward
   - This triggers webhooks for renewals, cancellations, etc.

### Testing Scenarios

**Test Monthly Renewal:**
1. Create subscription with test clock
2. Advance clock by 30 days
3. Watch for `invoice.payment_succeeded` webhook
4. Verify subscription renewed in your app

**Test Cancellation:**
1. Cancel subscription via billing portal
2. Advance clock past current period end
3. Watch for `customer.subscription.deleted` webhook
4. Verify subscription ended in your app

**Test Failed Payment:**
1. Use Stripe test card `4000000000000341` (requires authentication, will fail)
2. Advance clock to next billing date
3. Watch for `invoice.payment_failed` webhook
4. Verify subscription status changed to `past_due`

### Test Credit Cards

- **Success:** `4242424242424242`
- **Decline:** `4000000000000002`
- **Requires Authentication:** `4000002500003155`
- **Insufficient Funds:** `4000000000009995`

## Webhook Configuration

### Local Development

Use Stripe CLI to forward webhooks:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Copy the webhook signing secret (starts with `whsec_`) and add to `.env`:

```env
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
```

### Production

1. Go to **Stripe Dashboard** → **Developers** → **Webhooks**
2. Click **"Add endpoint"**
3. Enter your URL: `https://yourdomain.com/api/stripe/webhook`
4. Select events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy the signing secret and add to production environment variables

## Price IDs

Get your price IDs from Stripe Dashboard:

1. Go to **Products**
2. Click on your product
3. Copy the Price ID (starts with `price_`)
4. Add to `.env`:
   ```env
   STRIPE_PRICE_ID_MONTHLY=price_xxxxxxxxxxxxx
   STRIPE_PRICE_ID_YEARLY=price_xxxxxxxxxxxxx
   ```

## Environment Variables

Complete `.env` setup:

```env
# Stripe Keys (from Dashboard → Developers → API keys)
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx

# Webhook Secret (from stripe listen or Dashboard)
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx

# Price IDs
STRIPE_PRICE_ID_MONTHLY=price_xxxxxxxxxxxxx
STRIPE_PRICE_ID_YEARLY=price_xxxxxxxxxxxxx

# Test Clock (optional, for testing only)
STRIPE_TEST_CLOCK_ID=clock_xxxxxxxxxxxxx
```

## Troubleshooting

### Webhooks Return 500 Error

Check server logs for specific error. Common issues:
- Invalid subscription status in database enum
- User not found (check customer ID mapping)
- Database connection issue

### Invoices Stay in Draft

- Change invoice finalization settings (see step 1 above)
- Manually finalize existing drafts
- Check if subscription has `collection_method: 'charge_automatically'`

### Test Clock Not Working

- Ensure test clock ID is in `.env`
- Restart dev server after adding test clock
- Create new customers after setting test clock (existing customers won't be linked)
- Check webhook logs for events when advancing time
