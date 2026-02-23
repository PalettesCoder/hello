# A Guide to Professional Website Protection

This guide explains why you cannot hide your website's front-end code (HTML, CSS, JavaScript) and details the correct, professional methods for securing your website and its intellectual property.

## The Myth: Hiding Client-Side Code

It is **fundamentally impossible** to hide HTML, CSS, and client-side JavaScript from the browser. For your website to be displayed, the browser *must* download and process these files. If the browser can access the code to render the page, a user can access it using built-in tools.

*   **View Source**: Shows the raw HTML code sent from the server.
*   **Inspect Element**: A more powerful developer tool showing the live, current state of the page after CSS has been applied and JavaScript has run.

Any attempt to "hide" this code (like disabling right-click) is easily bypassed and creates a poor user experience. It offers no real protection.

## The Solution: Secure with a Server-Side Backend

The professional standard is to assume that **all code on the client is public**. Security is achieved by keeping sensitive information and logic on the server.

### Key Principles:

1.  **Never Trust the Client**: Treat any data coming from the browser (form inputs, API requests) as potentially malicious. Always validate and sanitize it on the server.
2.  **Keep Secrets on the Server**: Your server is a secure, controlled environment; the user's browser is not.
    *   **DO NOT** store database passwords, API keys, or private credentials in your HTML, CSS, or JavaScript files.
    *   **DO** store these secrets in environment variables or secure configuration files on your server. Your server-side code will use them to make authenticated requests.

### Example: A Secure vs. Insecure Price Calculation

Imagine you have a "secret" formula for calculating a discount.

#### Insecure Method (Client-Side JavaScript - Bad Practice)

```html
<!-- index.html -->
<script>
  function calculateDiscount(price) {
    // Your secret formula is exposed here!
    const discount = price * 0.75 - 10;
    document.getElementById('final-price').innerText = discount;
  }
</script>
```
In this case, anyone can view the source and steal your calculation logic.

#### Secure Method (Server-Side Logic - Good Practice)

With a backend, the client never sees the logic.

**1. Client-Side JavaScript (Public)**: The script simply sends a request to the server.

```javascript
// js/main.js
async function getDiscount(price) {
  const response = await fetch('/api/calculate-discount', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ price: price })
  });
  const data = await response.json();
  document.getElementById('final-price').innerText = data.finalPrice;
}
```

**2. Server-Side Code (Private & Secure)**: A file on your server (e.g., `server.js` if using Node.js) contains the secret logic. This file is **never** sent to the browser.

```javascript
// server.js (Node.js/Express example) - THIS FILE STAYS ON YOUR SERVER
const express = require('express');
const app = express();
app.use(express.json());

app.post('/api/calculate-discount', (req, res) => {
  const price = req.body.price;

  // Your secret formula is safe on the server
  const finalPrice = price * 0.75 - 10;

  res.json({ finalPrice: finalPrice });
});

app.listen(3000);
```
In this model, the client only knows the result. Your intellectual property is protected.

## New Security Features

### Nginx Configuration

The `nginx.conf.example` file has been updated to include a more secure configuration. It now includes:
- A redirect from `www` to non-`www`.
- A server block for HTTPS on port 443.
- A more restrictive location block to only allow access to necessary files.

### .htaccess Configuration

The `.htaccess` file has been updated to include a more secure configuration. It now includes:
- A redirect from `www` to non-`www`.
- A rule to force HTTPS.
- A more restrictive set of rules to only allow access to necessary files.

### Manifest Configuration

The `manifest.json` file has been updated to include a more secure configuration. It now includes:
- A more specific name and short name for the website.
- A scope to restrict the app to the website's domain.
- A more specific start URL.

### Service Worker Configuration

The `sw.js` file has been updated to include a more secure configuration. It now includes:
- Caching for all the new files that have been added.

### GitHub Actions Configuration

The `.github/workflows/static.yml` file has been updated to include a more secure configuration. It now includes:
- A step to run a linter on the HTML and CSS files.

## Other Security Measures

### Client Certificates (mTLS)

Secure and authenticate your APIs and web applications with client certificates. You can block traffic from devices that do not have a valid client SSL/TLS certificate using mTLS (Mutual TLS) rules.

#### How to Generate the Keys and Certificates

You can use OpenSSL to generate the necessary keys and certificates:

**1. Create a Certificate Authority (CA)**
```bash
# Generate CA private key
openssl genrsa -out ca.key 4096

# Generate CA root certificate
openssl req -new -x509 -days 3650 -key ca.key -out ca.crt -subj "/CN=My Custom CA"
```

**2. Generate the Client Certificate**
```bash
# Generate client private key
openssl genrsa -out client.key 2048

# Generate Certificate Signing Request (CSR) for the client
openssl req -new -key client.key -out client.csr -subj "/CN=Client1"

# Sign the client certificate with your CA
openssl x509 -req -days 365 -in client.csr -CA ca.crt -CAkey ca.key -set_serial 01 -out client.crt
```

**3. Package for Browsers / Clients**
Browsers and OS keychains usually require the client certificate and key to be packaged in a `.p12` or `.pfx` format:
```bash
openssl pkcs12 -export -out client.p12 -inkey client.key -in client.crt -certfile ca.crt
```
*(You will be prompted to create an export password. The user will need this password when installing the certificate on their device).*

#### Nginx Configuration for mTLS

Once you have generated your `ca.crt`, place it on your server and enforce client certificate verification by adding these lines to your `server { listen 443 ssl; ...}` block:

```nginx
    # Enforce Client Certificate Verification (mTLS)
    ssl_client_certificate /path/to/ca.crt;
    ssl_verify_client on;
```

### File and Directory Protection (`.htaccess`)

You can't hide `index.html` itself, but you can protect other files and prevent people from snooping around your directory structure. You can add this to your `.htaccess` file:

```htaccess
# --- Disable Directory Listings ---
# This prevents the server from displaying the contents of a directory if no index file is present.
Options -Indexes

# --- Deny Access to Sensitive Files ---
# Block access to files that might contain sensitive information.
# This includes dotfiles (like .git, .htaccess, .env) and configuration files.
<IfModule mod_rewrite.c>
    RewriteEngine On

    # Redirect www to non-www
    RewriteCond %{HTTP_HOST} ^www\.harsharoyal\.com$ [NC]
    RewriteRule ^(.*)$ https://harsharoyal.com/$1 [L,R=301]

    # Force HTTPS
    RewriteCond %{HTTPS} off
    RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

    # Rule to block access to any file or directory starting with a dot.
    RewriteRule "(^|/)\." - [F]
</IfModule>

# A more modern approach for Apache 2.4+. This is often used with the above for compatibility.
<FilesMatch "^\.">
    Require all denied
</FilesMatch>

# --- Control Access to File Types ---
# The following ruleset is a restrictive policy. It denies access to all files
# by default and then explicitly allows only the file types necessary for your website to run.
<IfModule mod_rewrite.c>
    RewriteEngine On

    # Allow the main index.html file.
    RewriteRule ^index\.html$ - [L]

    # Allow asset files (CSS, JS, images, fonts, media).
    # Add any other file extensions your site uses.
    RewriteRule \.(css|js|gif|jpe?g|png|svg|webp|woff2?|ttf|eot|otf|mp4|pdf|xml)$ - [L]
    
    # Allow sitemap and other verification files
    RewriteRule ^(sitemap|BingSiteAuth)\.xml$ - [L]
    RewriteRule ^(CNAME|robots\.txt)$ - [L]

    # Block everything else.
    # Any request that hasn't been allowed by the rules above will be forbidden.
    RewriteCond %{REQUEST_URI} !^/$
    RewriteRule . - [F]
</IfModule>
```

### Code Minification (Obfuscation)

Your project already uses minified files like `bootstrap.min.css`. Minification compacts code to improve performance. It also makes it very difficult for a casual observer to read.

*   **What it is**: `function calculateDiscount(price)` becomes `function a(p)`.
*   **What it is NOT**: This is **not security**. A determined person can use "beautifier" tools to reformat the code and analyze it. It's a deterrent, not a barrier.

## Summary: Best Practices

*   **Assume front-end code is public.**
*   **Build a server-side backend** for any logic, data processing, or calculations that are sensitive or proprietary.
*   **Never store secrets** (API keys, passwords) in client-side code.
*   Use your `.htaccess` file to **prevent directory listing**.
*   Use minification for **performance**, not for security.