# ROGUELAB All-in-One Store

One Node/Express website containing: storefront, customer orders, admin panel, products/prices/stock, package management, public package pages, and stable QR URLs.

## Run
Node.js 18+; copy .env.example to .env; set ADMIN_PASSWORD and JWT_SECRET; npm install; npm start.

## Routes
/ = shop
/admin.html = admin
/package/PKG001 = public package page
/api/package/PKG001/qr = QR PNG

## Deployment
Push to GitHub, then deploy as a Node Web Service on Render/Railway/etc. GitHub Pages cannot run this backend.

## Production notes
For real business use, replace JSON storage with PostgreSQL/Supabase, use cloud image storage, real payment gateway, notifications, backups, rate limiting, HTTPS/custom domain, and stronger authentication. Do not expose customers' full home addresses publicly.
