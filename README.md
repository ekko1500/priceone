# PricePulse Myanmar

> **AI-Powered Wholesale–Retail Pricing Intelligence for Myanmar Small Businesses**  
> *Google AI Builder Cup 2026 Submission*  
> Target: Functional, Deployable, Demo-Ready Web Application

---

## 1. Overview & Problem Statement

In Myanmar, wholesale commodity prices (edible palm oil, Shwebo Pawsan rice, pulses, and condensed milk) fluctuate rapidly due to fuel, transport, and currency exchange shifts. Neighborhood retailers (ကုန်စုံဆိုင်) receive unstructured price change updates from multiple wholesalers across Bayintnaung and regional depots via informal chat messages (Viber, Telegram, SMS) written in Burmese and English.

**The Core Challenge:**
- Retailers fail to calculate how wholesale price spikes erode their gross margins until they run out of cash.
- Selling prices remain fixed at stale rates, resulting in silent financial losses (e.g., selling cooking oil at 5,600 MMK when wholesale cost has risen to 5,800 MMK).
- Generic POS or inventory software does not connect supplier price changes directly to gross margin erosion or recommended retail prices.

**The PricePulse Solution:**
PricePulse Myanmar bridges wholesalers and connected retailers:
1. **Wholesaler Capture**: Wholesalers paste unstructured supplier messages in English or Burmese (မြန်မာစာ).
2. **Gemini Extraction**: Google Gemini extracts structured price drafts (product, package size, unit, effective date, and prices) strictly on the server.
3. **Human Confirmation**: Wholesalers review, validate, and confirm the change before publication.
4. **Targeted Notifications**: Real-time persistent notifications reach only authorized, connected retailers.
5. **Deterministic Margin Intelligence**: Retailers immediately see their exact margin erosion (e.g. from 10.7% to -3.6%) and recommended retail selling prices rounded up to the next 100 MMK (e.g. 6,900 MMK).
6. **Explicit Receipt Confirmation**: Stock increases only when the retailer explicitly confirms physical receipt of goods, preventing duplicate counts.

---

## 2. Architecture & Tech Stack

- **Frontend & App Framework**: Next.js 14+ (App Router), React 18, TypeScript, Tailwind CSS, Lucide Icons.
- **AI Engine**: Google Gemini API (`@google/generative-ai` 1.5 / 2.0 Flash) on secure server routes (`/api/gemini/extract-price`), zero client credential exposure.
- **Persistence Architecture**:
  - Direct integration ready for Firebase Authentication & Cloud Firestore.
  - Built-in, crash-proof, fully typed persistent server store with exact Firestore collection semantics, enabling reliable offline judge evaluation and sandbox testing.
- **Mathematical Integrity**: 100% deterministic, unit-tested financial formulas (no generative AI hallucinations for arithmetic).
- **Localization (i18n)**: Instant switcher between English and Burmese (မြန်မာစာ).

---

## 3. Quick Start & Local Execution

### Prerequisites
- Node.js `v18+` or `v20+`
- npm `v9+` or `v10+`

### Installation
```bash
# Clone the repository
git clone https://github.com/your-repo/pricepulse-myanmar.git
cd pricepulse-myanmar

# Install dependencies
npm install
```

### Environment Configuration (Optional)
Create a `.env.local` file:
```env
# Optional: Google Gemini API key for live LLM extraction.
# If omitted, PricePulse automatically engages its resilient deterministic parser
# for all competition benchmark messages in English and Burmese.
GEMINI_API_KEY=your_gemini_api_key_here
```

### Run Automated Tests
```bash
npm test
```
*Executes all Vitest test suites (deterministic margin calculations, Gemini extraction, order receipt & stock idempotency).*

### Production Build & Launch
```bash
npm run build
npm run start
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 4. Benchmark Calculation Specification

As defined in the competition requirements:
- **Baseline**: Old Wholesale = 5,000 MMK, Retail Selling Price = 5,600 MMK
  - Gross Profit: `5,600 - 5,000 = 600 MMK`
  - Gross Margin: `(600 / 5,600) * 100 = 10.7%`
- **Wholesale Price Increase**: New Wholesale = 5,800 MMK
  - Gross Profit: `5,600 - 5,800 = -200 MMK`
  - Gross Margin: `(-200 / 5,600) * 100 = -3.6%`
- **Recommended Price (15% Target Margin)**:
  - Exact: `5,800 / (1 - 0.15) = 6,823.53 MMK`
  - Rounded UP to Next 100 MMK: **6,900 MMK**

---

## 5. Security & Isolation Highlights

1. **Server-Side API Guard**: All Gemini calls run on Next.js server runtime; zero client keys.
2. **Role Authorization**: Retailers, Wholesalers, and Admins operate with strictly segregated views and operations.
3. **Receipt Confirmation Idempotency**: Stock increment only occurs once upon retailer confirmation. Duplicate confirmation attempts return `409 Conflict`.
4. **Reset Demo Scenarios**: Judge demo reset is isolated to demo records, leaving live production data untouched.