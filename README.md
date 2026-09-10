# rankrent-be

Billing and invoicing backend for a rank-and-rent local lead generation business. Manages customers, subscription terms and per-niche pricing, generates invoices, and delivers them by email.

Express + MariaDB, containerised with Docker. Serves the API and data layer behind the rankrent frontend.

## What it does

A rank-and-rent operation runs local service websites — one per niche, per locality — and rents each to a business in that market. Billing gets awkward fast: pricing varies by both niche and subscription length, customers renew on different cycles, and invoices need to go out reliably without manual work.

This service owns that side of it:

- **Customer records** — accounts and contact details
- **Term-based pricing** — 1, 3, 6 and 12 month subscription terms
- **Per-niche rates** — pricing resolved from the niche and term together, not a flat rate
- **Locality and niche catalogue** — driven by `locality.csv` and the definitions in `niches/`
- **Invoice generation** — rendered server-side with EJS
- **Email delivery** — invoices sent via nodemailer
- **Apple Pay support** — HTTPS with a self-signed certificate for local development

## Tech stack

| Layer | Choice |
|---|---|
| Runtime | Node.js |
| Framework | Express |
| Database | MariaDB |
| Templating | EJS |
| Email | nodemailer |
| Data ingest | csv-parser, js-yaml |
| Container | Docker |

## Data model

Pricing is normalised across three tables rather than stored per customer, so a rate change is one row update instead of a migration.

```sql
CREATE TABLE Customers (
    CustomerNumber INT AUTO_INCREMENT PRIMARY KEY,
    CustomerName   VARCHAR(255) NOT NULL,
    EmailAddress   VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE TermAmounts (
    termId INT AUTO_INCREMENT PRIMARY KEY,
    term   VARCHAR(50),
    amount DECIMAL(10, 2)
);

CREATE TABLE LocniTypes (
    locniId   INT AUTO_INCREMENT PRIMARY KEY,
    locniType VARCHAR(100)
);

CREATE TABLE LocniPricing (
    pricingId INT AUTO_INCREMENT PRIMARY KEY,
    termId    INT,
    locniId   INT,
    amount    DECIMAL(10, 2),
    FOREIGN KEY (termId)  REFERENCES TermAmounts(termId),
    FOREIGN KEY (locniId) REFERENCES LocniTypes(locniId)
);
```

Resolving a price for a given niche and term:

```sql
SELECT t.term, l.locniType, p.amount
FROM LocniPricing p
JOIN TermAmounts t ON p.termId  = t.termId
JOIN LocniTypes  l ON p.locniId = l.locniId
WHERE l.locniType = ? AND t.term = ?;
```

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Create the database

```bash
mysql -u root -p
```

```sql
CREATE DATABASE RankRentBilling;
USE RankRentBilling;
-- then run the schema above
```

Seed the reference tables:

```sql
INSERT INTO TermAmounts (term, amount) VALUES
  ('1 month', 0.00), ('3 months', 0.00),
  ('6 months', 0.00), ('12 months', 0.00);

INSERT INTO LocniTypes (locniType) VALUES ('CPA'), ('Tree Service');
```

Then populate `LocniPricing` with your own rates for each term and niche combination.

### 3. Environment variables

```
DB_HOST=
DB_USER=
DB_PASSWORD=
DB_NAME=RankRentBilling
SMTP_HOST=
SMTP_USER=
SMTP_PASSWORD=
```

### 4. Local HTTPS certificate

Apple Pay requires HTTPS, so local development needs a self-signed certificate. Generate one — do not commit the output:

```bash
openssl genrsa -out localhost.key 2048
openssl req -new -x509 -key localhost.key -out localhost.crt -days 365 -subj "/CN=localhost"
```

### 5. Run

```bash
npm run devStart
```

## Docker

```bash
docker build -t rankrent-be .
docker run -p 3000:3000 --env-file .env rankrent-be
```

## Notes on some decisions

**Pricing as a join, not a column.** Rates depend on both niche and term, which is a matrix rather than a list. Modelling it as `LocniPricing` keyed on two foreign keys means adding a niche or a term is a data change, not a schema change.

**Server-rendered invoices.** Invoices are EJS templates rendered server-side rather than generated on a client. The invoice is a record that has to survive being emailed, so it can't depend on a browser to assemble it.

**CSV and YAML as the source for localities and niches.** The site matrix changes more often than the code does. Keeping it in flat files that non-developers can edit avoids a deploy for every new market.
