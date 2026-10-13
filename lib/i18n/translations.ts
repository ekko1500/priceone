export type Language = 'en' | 'my';

export interface TranslationDictionary {
  appName: string;
  tagline: string;
  roleRetailer: string;
  roleWholesaler: string;
  roleAdmin: string;
  dashboard: string;
  catalog: string;
  pricing: string;
  inventory: string;
  orders: string;
  connections: string;
  notifications: string;
  adminPortal: string;
  logout: string;
  login: string;
  register: string;
  demoMode: string;
  resetDemoData: string;
  
  // Pricing & Gemini
  updateWholesalePrice: string;
  manualUpdate: string;
  pasteSupplierMessage: string;
  csvUpload: string;
  extractWithGemini: string;
  extracting: string;
  originalMessage: string;
  extractedDetails: string;
  productName: string;
  category: string;
  unit: string;
  currentPrice: string;
  newPrice: string;
  priceDifference: string;
  percentageChange: string;
  effectiveDate: string;
  confirmAndPublish: string;
  publishing: string;
  pricePublishedSuccess: string;
  
  // Margin Calculator
  retailerMarginImpact: string;
  currentSellingPrice: string;
  grossProfitBefore: string;
  grossMarginBefore: string;
  grossProfitAfter: string;
  grossMarginAfter: string;
  targetMargin: string;
  recommendedSellingPrice: string;
  marginErosionWarning: string;
  disclaimerGrossMargin: string;
  
  // Orders
  orderNumber: string;
  wholesaler: string;
  retailer: string;
  items: string;
  totalAmount: string;
  orderStatus: string;
  paymentStatus: string;
  placeOrder: string;
  confirmReceipt: string;
  stockUpdatedReceipt: string;
  
  // Common
  save: string;
  cancel: string;
  confirm: string;
  status: string;
  action: string;
  date: string;
  switchLanguage: string;
}

export const translations: Record<Language, TranslationDictionary> = {
  en: {
    appName: "PricePulse Myanmar",
    tagline: "AI-Powered Wholesale–Retail Pricing Intelligence",
    roleRetailer: "Retailer (ကုန်စုံဆိုင် / လက်လီ)",
    roleWholesaler: "Wholesaler (ကုန်သည် / လက္ကား)",
    roleAdmin: "Administrator",
    dashboard: "Dashboard",
    catalog: "Product Catalog",
    pricing: "Pricing Intelligence",
    inventory: "Store Inventory",
    orders: "Orders",
    connections: "Supplier Network",
    notifications: "Notifications",
    adminPortal: "Admin Oversight",
    logout: "Log Out",
    login: "Log In",
    register: "Register Business",
    demoMode: "Demonstration Mode",
    resetDemoData: "Reset Demo Data",
    
    updateWholesalePrice: "Update Wholesale Price",
    manualUpdate: "Manual Entry",
    pasteSupplierMessage: "Paste Supplier Message (Gemini AI)",
    csvUpload: "CSV / Excel Import",
    extractWithGemini: "Extract Price with Gemini",
    extracting: "Extracting with Gemini...",
    originalMessage: "Original Supplier Message",
    extractedDetails: "Gemini Extracted Draft",
    productName: "Product Name",
    category: "Category",
    unit: "Unit",
    currentPrice: "Current Wholesale Price",
    newPrice: "New Wholesale Price",
    priceDifference: "Price Difference",
    percentageChange: "Change (%)",
    effectiveDate: "Effective Date",
    confirmAndPublish: "Review & Publish Price",
    publishing: "Publishing & Notifying Retailers...",
    pricePublishedSuccess: "Price successfully published! Connected retailers have been notified.",
    
    retailerMarginImpact: "Retail Margin & Profit Impact",
    currentSellingPrice: "Current Retail Selling Price",
    grossProfitBefore: "Gross Profit (Before)",
    grossMarginBefore: "Gross Margin (Before)",
    grossProfitAfter: "Gross Profit (After Change)",
    grossMarginAfter: "Gross Margin (After Change)",
    targetMargin: "Target Gross Margin",
    recommendedSellingPrice: "Recommended Retail Price (Next 100 MMK)",
    marginErosionWarning: "Warning: Wholesale cost increase causes negative or eroded gross margin!",
    disclaimerGrossMargin: "* Gross profit before operating expenses and taxes. All calculations are deterministic.",
    
    orderNumber: "Order #",
    wholesaler: "Wholesaler",
    retailer: "Retailer",
    items: "Items",
    totalAmount: "Total Amount",
    orderStatus: "Order Status",
    paymentStatus: "Payment Status",
    placeOrder: "Place New Order",
    confirmReceipt: "Confirm Goods Received (Increases Stock)",
    stockUpdatedReceipt: "Receipt confirmed! Store inventory has been updated.",
    
    save: "Save",
    cancel: "Cancel",
    confirm: "Confirm",
    status: "Status",
    action: "Action",
    date: "Date",
    switchLanguage: "မြန်မာစာသို့ ပြောင်းရန်",
  },
  my: {
    appName: "PricePulse မြန်မာ",
    tagline: "AI အခြေပြု လက္ကား-လက်လီ ဈေးနှုန်းသတင်းစနစ်",
    roleRetailer: "လက်လီကုန်စုံဆိုင်",
    roleWholesaler: "လက္ကားဖြန့်ချိသူ",
    roleAdmin: "စီမံခန့်ခွဲသူ",
    dashboard: "ပင်မဒက်ရှ်ဘုတ်",
    catalog: "ကုန်ပစ္စည်းစာရင်း",
    pricing: "ဈေးနှုန်းအကဲဖြတ်မှု",
    inventory: "ဆိုင်ရှိလက်ကျန်စာရင်း",
    orders: "အမှာစာများ",
    connections: "ကုန်သည်ချိတ်ဆက်မှု",
    notifications: "အသိပေးချက်များ",
    adminPortal: "ကြီးကြပ်ရေးစနစ်",
    logout: "အကောင့်ထွက်ရန်",
    login: "အကောင့်ဝင်ရန်",
    register: "ဆိုင်အသစ်ဖွင့်ရန်",
    demoMode: "စမ်းသပ်ပြသမှုစနစ်",
    resetDemoData: "ဒေတာမူလပြန်ထားရန်",
    
    updateWholesalePrice: "လက္ကားဈေးနှုန်းအသစ်တင်ရန်",
    manualUpdate: "လက်ဖြင့်ရိုက်ထည့်ရန်",
    pasteSupplierMessage: "ကုန်သည်စာတိုကို ကူးထည့်ရန် (Gemini AI)",
    csvUpload: "CSV / Excel ဖိုင်ဖြင့်တင်ရန်",
    extractWithGemini: "Gemini ဖြင့် ဈေးနှုန်းထုတ်ယူရန်",
    extracting: "Gemini မှ ဈေးနှုန်းထုတ်ယူနေပါသည်...",
    originalMessage: "မူရင်းကုန်သည်စာတို",
    extractedDetails: "Gemini မှ ထုတ်ယူရရှိသောအချက်အလက်",
    productName: "ပစ္စည်းအမည်",
    category: "အမျိုးအစား",
    unit: "ယူနစ်",
    currentPrice: "လက်ရှိလက္ကားဈေး",
    newPrice: "လက္ကားဈေးအသစ်",
    priceDifference: "ဈေးနှုန်းကွာခြားချက်",
    percentageChange: "ပြောင်းလဲမှုရာခိုင်နှုန်း",
    effectiveDate: "စတင်အသက်ဝင်မည့်ရက်",
    confirmAndPublish: "အတည်ပြု၍ ဈေးနှုန်းထုတ်ပြန်ရန်",
    publishing: "ထုတ်ပြန်ပြီး ဆိုင်များထံ အကြောင်းကြားနေပါသည်...",
    pricePublishedSuccess: "ဈေးနှုန်းအသစ်ထုတ်ပြန်ပြီးပါပြီ။ ချိတ်ဆက်ထားသောဆိုင်များထံ အသိပေးပြီးပါပြီ။",
    
    retailerMarginImpact: "ဆိုင်အမြတ်ငွေနှင့် အမြတ်ရာခိုင်နှုန်း သက်ရောက်မှု",
    currentSellingPrice: "ဆိုင်လက်ရှိရောင်းဈေး",
    grossProfitBefore: "အရင်အမြတ်ငွေ (တစ်ယူနစ်)",
    grossMarginBefore: "အရင်အမြတ်ရာခိုင်နှုန်း",
    grossProfitAfter: "ဈေးတက်ပြီးနောက် အမြတ်ငွေ",
    grossMarginAfter: "ဈေးတက်ပြီးနောက် အမြတ်ရာခိုင်နှုန်း",
    targetMargin: "ရည်မှန်းထားသောအမြတ်ရာခိုင်နှုန်း",
    recommendedSellingPrice: "အကြံပြုလက်လီရောင်းဈေး (၁၀၀ ကျပ်အပြည့်)",
    marginErosionWarning: "သတိပေးချက်: လက္ကားဈေးတက်သဖြင့် အမြတ်ငွေအနုတ်ပြနေပါသည် သို့မဟုတ် လျော့ကျသွားပါသည်!",
    disclaimerGrossMargin: "* ဆိုင်လည်ပတ်စရိတ်များမနှုတ်မီ စုစုပေါင်းအမြတ်ငွေဖြစ်ပါသည်။ တွက်ချက်မှုများသည် တိကျသောဖော်မြူလာများဖြစ်ပါသည်။",
    
    orderNumber: "အမှာစာအမှတ်",
    wholesaler: "လက္ကားဆိုင်",
    retailer: "လက်လီဆိုင်",
    items: "ပစ္စည်းများ",
    totalAmount: "စုစုပေါင်းတန်ဖိုး",
    orderStatus: "အမှာစာအခြေအနေ",
    paymentStatus: "ငွေပေးချေမှုအခြေအနေ",
    placeOrder: "အမှာစာအသစ်တင်ရန်",
    confirmReceipt: "ပစ္စည်းလက်ခံရရှိကြောင်း အတည်ပြုရန် (လက်ကျန်တိုးမည်)",
    stockUpdatedReceipt: "ပစ္စည်းလက်ခံရရှိပြီးပါပြီ။ ဆိုင်လက်ကျန်စာရင်းတွင် ထည့်သွင်းပြီးပါပြီ။",
    
    save: "သိမ်းဆည်းမည်",
    cancel: "မလုပ်တော့ပါ",
    confirm: "အတည်ပြုမည်",
    status: "အခြေအနေ",
    action: "လုပ်ဆောင်ချက်",
    date: "ရက်စွဲ",
    switchLanguage: "Switch to English",
  },
};