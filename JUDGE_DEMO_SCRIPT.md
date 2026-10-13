# PricePulse Myanmar — 3-Minute Judge Demonstration Script
**Google AI Builder Cup 2026**

---

### Step 1: Open Application & Show Role Ecosystem (30 seconds)
1. Navigate to the deployed web application at `http://localhost:3000` (or deployment URL).
2. Note the top persona bar:
   - **Wholesaler**: Aung Wholesale Distribution (Bayintnaung Market, Yangon)
   - **Retailer**: Shwe Family Grocery Store (Hledan, Kamayut)
   - **Admin Portal**: System Oversight & Immutable Auditing
3. Click the language switcher in the header to demonstrate real-time Burmese (`မြန်မာစာ`) and English localization.

---

### Step 2: Wholesaler Captures & Publishes Price with Gemini (1 minute)
1. Select the **Wholesaler (Aung)** persona.
2. In the "Gemini Price Publishing" tab, observe the supplier message text area.
3. Click the button: **"Section 8 Cooking Oil Benchmark"**:
   > *"Starting tomorrow, cooking oil will cost 5,800 MMK per bottle instead of 5,000 MMK."*
4. Click **"Extract Price with Gemini"**:
   - Google Gemini parses the unstructured natural text.
   - Shows extracted product name (*Cooking Oil*), unit (*1 Liter bottle*), current price (*5,000 MMK*), new price (*5,800 MMK*), and +16% difference.
5. Emphasize **Human-in-the-Loop Confirmation**:
   - The wholesaler reviews the difference and confirms by clicking **"Review & Publish Price"**.
   - Notice the success banner: Price is published, immutable timeline updated, and connected retailers are targeted.

---

### Step 3: Retailer Margin Intelligence & Supplier Comparison (1 minute)
1. Switch to the **Retailer (Shwe)** persona in the top navigation bar.
2. Notice the instant alert and the **Retail Margin & Intelligence** dashboard:
   - **Baseline (Before)**: Wholesale cost 5,000 MMK -> Selling price 5,600 MMK -> Profit: +600 MMK (10.7% margin).
   - **After Supplier Change**: Wholesale cost 5,800 MMK -> Current selling price 5,600 MMK -> **Negative Profit: -200 MMK (-3.6% margin)**.
   - **Margin Erosion Warning**: Prominent red banner alerts the merchant to severe profit erosion (-14.3 points).
   - **Recommended Selling Price (15% Target)**: Exactly **6,900 MMK** (computed deterministically and rounded UP to the next 100 MMK).
3. Scroll down to **Connected Wholesaler Comparison**:
   - Shows side-by-side comparison with Mandalay Commodity Depot (5,200 MMK).
   - Highlights the lowest-cost supplier to empower retailer purchasing decisions.

---

### Step 4: Orders & Strict Receipt Stock Rule (30 seconds)
1. Click the **"My Orders"** tab as the Retailer.
2. Find Order `#ORD-2026-001` with status **DELIVERED**.
3. Point out that inventory stock has **not** automatically increased just because the wholesaler marked it delivered.
4. Click **"Confirm Receipt (Updates Stock)"**:
   - Retailer explicitly confirms physical delivery.
   - Order transitions to `RECEIPT_CONFIRMED` and store inventory stock atomically increments.
   - Duplicate attempts are blocked idempotently.

---

### Step 5: System Auditing & Reset (15 seconds)
1. Click **"Admin Portal"** to show the immutable audit trail with every timestamp, actor, and action.
2. Click **"Reset Demo Data"** in the top header to cleanly restore the scenario to the baseline state for the next judge evaluation.