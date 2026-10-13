# PricePulse Myanmar — Competition Pitch & Value Proposition
**Google AI Builder Cup 2026**

---

## 1. The High-Impact Problem

In Myanmar, small corner grocery shops (ကုန်စုံဆိုင်) operate on razor-thin gross margins, often between 10% and 15%. Over 90% of inventory replenishment happens through informal wholesale networks (Bayintnaung Wholesale Market and regional depots), where prices fluctuate almost daily due to transport, fuel, and supply shocks.

Wholesalers announce these price increases not through structured APIs or ERP systems, but through informal messages in Viber, Telegram, or SMS—written in Burmese, English, or colloquial abbreviations.

**The Fatal Margin Trap:**
When a supplier increases the wholesale price of a staple like cooking oil from 5,000 MMK to 5,800 MMK, the shopkeeper—preoccupied with daily store traffic—often continues selling existing and new stock at 5,600 MMK. Instead of earning their expected 10.7% gross margin (+600 MMK), they are losing -200 MMK (-3.6% negative margin) on every bottle sold. By the time they realize their profit has vanished, their operating capital has eroded.

---

## 2. Why PricePulse Myanmar Wins

PricePulse Myanmar is **not** a generic Point-of-Sale (POS) or inventory tracker. It is a purpose-built **wholesale-to-retail pricing intelligence platform**:

1. **AI-Assisted Natural Language Capture**:
   Wholesalers don’t need to fill complex ERP forms. They simply paste their supplier message (e.g., *"Starting tomorrow, cooking oil will cost 5,800 MMK per bottle instead of 5,000 MMK"* or *"မနက်ဖြန်မှစပြီး စားသုံးဆီ တစ်ပုလင်း ၅,၈၀၀ ကျပ် ဖြစ်ပါမည်"*). Google Gemini extracts the product, package size, unit, old price, new price, and effective date.

2. **Strict Human-in-the-Loop Confirmation**:
   Gemini acts as an intelligent assistant, never an autonomous publisher. Wholesalers review the exact change, diff, and catalog match before hitting "Confirm & Publish".

3. **Targeted, Scoped Notification Delivery**:
   Only authorized, actively connected retailers receive instant in-app alerts. Competitors and unconnected businesses are never exposed to private wholesale pricing.

4. **Deterministic Margin Calculations (Zero AI Math Hallucinations)**:
   Financial decisions require 100% mathematical precision. PricePulse uses tested deterministic code to show retailers the exact gross profit impact and computes recommended selling prices rounded up to the next 100 MMK (e.g., 6,900 MMK for a 15% target margin).

5. **Supplier Comparison & Strategic Sourcing**:
   Retailers compare side-by-side prices from connected suppliers (e.g., Yangon vs. Mandalay depots) and highlight the lowest-cost option, putting them in control of their procurement.

6. **Strict Physical Receipt Stock Rule**:
   Unlike generic tools that prematurely increment inventory when a supplier ships an order, PricePulse increases stock only when the retailer physically confirms receipt of goods, avoiding phantom inventory.

---

## 3. Product Differentiation Summary

| Feature | Generic POS / Inventory App | PricePulse Myanmar |
| :--- | :--- | :--- |
| **Price Ingestion** | Tedious manual row-by-row data entry | Natural language message extraction via Google Gemini |
| **Wholesaler–Retailer Network** | Siloed standalone store software | Connected supplier-to-retailer intelligence network |
| **Language Support** | English-only or broken fonts | Native English and Burmese (မြန်မာစာ) with instant switcher |
| **Margin Impact Warning** | Shows historical sales only | Proactive margin erosion alerts before losses occur |
| **Selling Price Recommendations** | Fixed markups or manual guesswork | Deterministic target-margin pricing rounded up to next 100 MMK |
| **Stock Accounting** | Automatic increment on order creation | Explicit retailer receipt confirmation (anti-double count) |

---

## 4. Vision & Roadmap

- **Phase 1 (Achieved & Functional Prototype)**: Gemini 1.5/2.0 Flash message extraction, human review, targeted alerts, deterministic gross margin engine, side-by-side supplier comparison, and receipt-confirmed inventory management.
- **Future Growth**: Regional transport cost modeling, localized voice input in Myanmar dialects, and automated Viber/Telegram bot webhooks for automated wholesale broadcast intake.