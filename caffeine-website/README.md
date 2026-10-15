# Caffeiné — Premium Coffee Website

A static, responsive multi-page website for a specialty coffee shop. Built with semantic HTML5, CSS with CSS Custom Properties, and vanilla JavaScript (ES5-compatible IIFE pattern). No backend required—serves as a demonstration and template.

---

## Project Structure

```
caffeine-website/
├── index.html              # Home page
├── about.html              # About our craft
├── menu.html               # Full menu with search & filter
├── gallery.html            # Photo gallery with lightbox
├── contact.html            # Contact form (demonstration)
├── login.html              # Login page (demo auth, admin/client roles)
├── admin.html              # Admin dashboard (requires auth: admin)
├── client.html             # Client dashboard (requires auth: client)
├── css/
│   └── style.css           # All styles (1,603 lines)
├── js/
│   ├── main.js             # Mobile menu toggle, year display
│   ├── menu.js             # Menu search, category filters, product modal
│   ├── gallery.js          # Dynamic gallery markup + lightbox
│   ├── contact.js          # Contact form validation (demonstration)
│   └── login.js            # Login/auth: validation, mock session, role guards
└── assets/
    ├── images/
    │   ├── branding/       # Empty — add logo files here
    │   ├── gallery/        # Empty — add gallery photos here
    │   └── products/       # 9 product PNG images
    └── videos/
        ├── coffee-brewing.mp4
        ├── coffee-hero.mp4
        └── latte-art.mp4
```

---

## How to Run Locally

This is a static site — no build step, no server required.

### Option 1: Open directly in a browser

Double-click any `.html` file to open it. All assets load via relative URLs.

### Option 2: Local development server

```bash
# Python 3
python -m http.server 8000

# Node.js (if serve is installed)
npx serve .

# Or use any static server
npx live-server
```

Then open `http://localhost:8000` in your browser.

---

## How to Replace Images and Video

### Product Images
Product images live in `assets/images/products/`. Each file is named after the product (e.g., `latte.png`). Replace any file with a new image of the same name to update the website.

| File | Product |
|---|---|
| `americano.png` | Americano |
| `cappuccino.png` | Cappuccino |
| `caramel-macchiato.png` | Caramel Macchiato |
| `cinnamon-dulce.png` | Cinnamon Dolce |
| `durian-latte.png` | Durian Latte |
| `latte.png` | Latte |
| `mochaccino.png` | Mochaccino |
| `signature-coffee.png` | Signature Coffee |
| `spanish-latte.png` | Spanish Latte |

### Gallery Images
The homepage (`index.html`) references `assets/images/gallery/gallery-1.jpg` through `gallery-4.jpg`, but these files do **not currently exist**. Add real photographs to the `assets/images/gallery/` directory and the references will resolve automatically. The standalone gallery page (`gallery.html`) uses product images dynamically via `js/gallery.js`, which can be reconfigured to point to gallery-specific images.

### Video Assets
Three video files exist in `assets/videos/`:
- `coffee-hero.mp4` — intended for a hero video background
- `coffee-brewing.mp4` — intended for a brewing process section
- `latte-art.mp4` — intended for a latte art showcase

These are **not currently referenced** in any HTML file. To use them, add a `<video>` element with the appropriate `src` or `<source>` tag.

---

## How to Customize Business Contact Details

Contact information is displayed in two places: the **Contact page** (`contact.html`) and the **shared footer** (present on all pages).

### Footer (all pages)
The footer uses `data-config` attributes that JavaScript can populate dynamically. Currently, `js/main.js` does not populate these — values are static HTML text.

To update manually, edit the footer `<p>` elements:
```html
<p class="footer-business-name" data-config="business-name">Caffeiné</p>
<p class="footer-address" data-config="address">123 Coffee Street</p>
<p class="footer-phone" data-config="phone">(555) 123-4567</p>
<p class="footer-email" data-config="email">hello@caffiene.com</p>
```

To populate dynamically via JavaScript, add to `js/main.js`:
```js
var config = {
  'business-name': 'Your Café Name',
  'address': '123 Main St, City, State ZIP',
  'phone': '(555) 123-4567',
  'email': 'hello@yourcafe.com',
  'hours': 'Mon-Fri: 7am - 7pm'
};
Object.keys(config).forEach(function(key) {
  var el = document.querySelector('[data-config="' + key + '"]');
  if (el) el.textContent = config[key];
});
```

### Contact Page
The contact page (`contact.html`) uses bracketed placeholders for all contact fields:
```html
<p class="location-name" data-config="business-name">[Café Name]</p>
<address class="location-address" data-config="address">
    [Street Address]<br>
    [City, State ZIP]
</address>
```
Replace the bracketed placeholders with real values, or use the `data-config` approach above.

### Google Maps Embed
The contact page includes a Google Maps iframe with a placeholder `src`. Replace the `data-map-src` attribute value with a real Google Maps embed URL:
```html
<div class="map-wrapper" data-config="map">
    <iframe
        class="map-embed"
        data-map-src="https://www.google.com/maps/embed?pb=..."
        title="Map of Your Café Name"
        src="https://www.google.com/maps/embed?pb=..."
        ...
    >
```

### Social Media Links
On the contact page, social links use `href="#"` placeholders. Replace with real URLs:
```html
<a href="#" class="social-link" data-config="social-facebook">Facebook</a>
<a href="#" class="social-link" data-config="social-instagram">Instagram</a>
<a href="#" class="social-link" data-config="social-twitter">Twitter</a>
```

### Opening Hours
Replace the bracketed placeholders:
```html
<dd data-config="hours-weekday">[Opening hours]</dd>
<dd data-config="hours-weekend">[Opening hours]</dd>
```

---

## Features

### Authentication (Login System)
The site includes a client-side demonstration login system with role-based access:

- **Login page** (`login.html`) — Form with email, password, and role selector (admin/client). Any email and password (min. 6 characters) will authenticate.
- **Admin dashboard** (`admin.html`) — Protected page; requires `admin` role. Shows order, menu, and gallery management placeholders.
- **Client dashboard** (`client.html`) — Protected page; requires `client` role. Shows order history, preferences, and favorites placeholders.
- **Session storage** — Auth state is stored in `localStorage` under key `caffiene_auth` with `{ role, email, loggedIn }` structure.
- **Route guards** — Dashboard pages use `<body data-requires-auth="admin">` (or `"client"`) to enforce role-based access via `js/login.js`.
- **Redirect logic** — Already-logged-in users visiting `login.html` are redirected to their dashboard. Unauthenticated users visiting dashboard pages are redirected to `login.html`.
- **Logout** — `window.caffieneAuth.logout()` clears storage and redirects to login.

> **Note:** This is a client-side mock — no real authentication, password hashing, or server-side validation. Replace with a real backend for production use.

### Working Features
- **Responsive mobile navigation** — `js/main.js` toggles the mobile menu with backdrop, focus management, and Escape-to-close
- **Current year display** — `js/main.js` auto-populates the copyright year
- **Product modal** — `js/menu.js` opens/closes a modal with product details on card click; supports Escape-to-close
- **Menu search** — `js/menu.js` provides debounced search filtering
- **Category filters** — `js/menu.js` filters products by category (All, Espresso, Non-Espresso, Alternatives)
- **Gallery lightbox** — `js/gallery.js` creates a dynamic gallery and lightbox with prev/next navigation, keyboard controls, and accessibility
- **Contact form validation** — `js/contact.js` validates required fields, email format, and minlength constraints

### Demonstration Features (No Backend)
| Feature | File | Description |
|---|---|---|
| Contact form | `contact.html` + `js/contact.js` | Form validates client-side and shows a success message, but does **not** send an email. Configure a backend endpoint in the form `action` attribute to enable submissions. |
| Gallery lightbox | `gallery.html` + `js/gallery.js` | Uses product images as gallery content. Add real gallery photos to `assets/images/gallery/` and update `GALLERY_DATA` in `js/gallery.js` to display them. |
| Footer config | All pages | Uses `data-config` attributes with placeholder text. `js/main.js` does not yet populate these dynamically. |
| Product modal images | `menu.html` | Modal displays product images and details; uses the same product images from `assets/images/products/`. |
| Login system | `login.html`, `admin.html`, `client.html` + `js/login.js` | Mock authentication with role-based routing (admin/client). Any credentials accepted. Stores session in `localStorage`. Replace with real backend for production. |

### Not Implemented
- **Theme toggle** — No theme toggle button exists in the HTML. The `data-color-*` attributes on the `<html>` tag suggest this was planned but never built. The site is dark-themed only.
- **Backend integration** — No server-side processing. Contact form, if enabled, would need a backend service.

---

## CSS Architecture

The stylesheet (`css/style.css`) is organized in this order:
1. Root variables and color palette
2. Reset & base styles
3. Typography
4. Layout utilities (`.container`, `.visually-hidden`)
5. Header & navigation (sticky header, mobile menu, backdrop)
6. Buttons (`.btn`, `.btn-primary`, `.btn-secondary`, `.btn-outline`)
7. Hero section
8. Featured drinks / Menu products (`.drink-card`, `.product-card`)
9. Brand introduction
10. Why Choose section
11. Menu controls (search, category filters)
12. About page sections (alternating layout)
13. Gallery preview + lightbox
14. Testimonials
15. Forms (form controls, validation helpers, contact page layout)
16. Login & dashboard pages
17. Modal (product modal + lightbox share the pattern)
18. Footer
19. Social links
20. Responsive breakpoints (tablet, laptop, desktop, mobile landscape)
21. Reduced motion
22. Selection styles
23. Print styles

---

## JavaScript Conventions

All scripts use the same pattern:
- IIFE (Immediately Invoked Function Expression) with `'use strict'`
- `var` declarations (ES5-compatible)
- `SELECTORS` object for element references
- Feature-detection guards (`if (!element) return;`)
- `addEventListener` for event binding
- `classList.add/remove/toggle` for state management
- `aria-expanded`, `aria-hidden`, `aria-invalid` for accessibility
- `e.preventDefault()` on form submission to prevent page reload
- `e.keyCode` fallback alongside `e.key` for cross-browser compatibility
