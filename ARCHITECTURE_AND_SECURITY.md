# PricePulse Myanmar — Architecture & Security Specification
**Google AI Builder Cup 2026**

---

## 1. System Architecture Diagram

```
+-------------------------------------------------------------+
|                      Client Browser                         |
|     (Next.js 14 / React 18 / Tailwind CSS / Lucide Icons)   |
|   - Bilingual UI (English / မြန်မာစာ)                       |
|   - Role Persona Switcher (Wholesaler, Retailer, Admin)     |
|   - Deterministic Margin Calculator Visualizer              |
+------------------------------+------------------------------+
                               | HTTPS / JSON
                               v
+-------------------------------------------------------------+
|               Next.js Server Runtime (Node.js)              |
|                                                             |
|  [/api/gemini/extract-price]  <--- Server-Only Secret       |
|    - Google Gemini 1.5/2.0 Flash SDK                        |
|    - Grounding Catalog Context Injection                    |
|    - Validated JSON Schema Extraction                       |
|                                                             |
|  [/api/prices/publish]                                      |
|    - Concurrency-safe Price Update                          |
|    - Immutable Price History Record Creation                |
|    - Scoped Retailer Notification Dispatch                  |
|                                                             |
|  [/api/orders/confirm-receipt]                              |
|    - Retailer Receipt Stock Rule Enforcement                |
|    - Atomic Inventory Upsert & Duplicate Receipt Blocker    |
|                                                             |
|  [/api/demo/reset]                                          |
|    - Scoped Demo Restoration (Prune & Restore Demo Keys)    |
+------------------------------+------------------------------+
                               |
                               v
+-------------------------------------------------------------+
|                    Persistence Layer                        |
|  - Real Firebase Firestore & Auth integration ready         |
|  - Persistent Server-Backed Store (.pricepulse_data.json)   |
|  - Scoped Collections: Users, Businesses, Products,         |
|    PriceHistory, Inventory, Orders, Notifications, Audits   |
+-------------------------------------------------------------+
```

---

## 2. Security & Data Isolation Architecture

### A. Zero Credential Exposure
- Google Gemini API credentials (`GEMINI_API_KEY`) reside exclusively within server environment variables.
- Client bundles contain zero API keys, secrets, or privileged service accounts.

### B. Business Data Separation & Authorization
- **Wholesaler Isolation**: Wholesalers can only publish prices and view orders for products they own.
- **Retailer Isolation**: Retailers can only view wholesale prices from actively connected suppliers. Unconnected wholesaler private rates remain completely hidden.
- **Order Scoping**: Orders are visible strictly to the specific retailer and wholesaler participating in the transaction.

### C. Critical Stock Rule & Idempotency
- Wholesalers marking an order as "Delivered" does **not** modify retailer inventory.
- Inventory quantities increment **only** when the authorized purchasing retailer confirms receipt via `/api/orders/confirm-receipt`.
- Any secondary or duplicate receipt confirmation attempt returns an HTTP `409 Conflict` status, guaranteeing protection against inventory double-counting.

### D. Audit Logging
- Every sensitive operation (publishing wholesale prices, confirming order receipt, demo resets) creates an append-only, immutable `AuditLog` record with timestamp, actor ID, role, action, and target details.