// [الخطوة 1]: استيراد مكتبات React الأساسية وتصميم التطبيق
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css' // التصاميم والتنسيقات العامة للموقع
import App from './App.jsx' // المكون الأساسي الموجه للصفحات

// [الخطوة 2]: ربط وتغذية شجرة مكونات React داخل عنصر <div id="root"> الموجود في index.html
createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* StrictMode يساعد في اكتشاف المشاكل والأخطاء أثناء التطوير */}
    <App />
  </StrictMode>,
)



