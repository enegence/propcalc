# PropCalc — Property Investment Calculator

A comprehensive, single-page rental property investment analysis tool. No backend required — runs entirely in the browser.

**[Live Demo →](https://ericwastaken.github.io/propcalc)**

## Features

- **Real-time calculations** — every slider and input triggers instant recalculation
- **Break-even rent analysis** — Year 1, average, and final-year projections
- **Expense inflation modeling** — compound growth on taxes, insurance, maintenance, and fees
- **Mortgage calculator** — standard amortization with adjustable rate/term/down payment
- **ROI & appreciation analysis** — total and annualized return on investment
- **Investment comparison** — side-by-side vs. S&P 500, HYSA, or a custom rate
- **Print-ready report** — detailed PDF-quality output with educational notes
- **Optional API integrations**:
  - [RentCast](https://app.rentcast.io/app/api) — auto-fill property details from an address
  - [API Ninjas](https://api-ninjas.com/api/propertytax) — look up local property tax rates by ZIP

## Getting Started

PropCalc is a static site — no build step, no server required.

### Run locally

```bash
# Any static file server works. For example:
npx serve .
# or
python3 -m http.server 8080
```

Then open `http://localhost:8080` in your browser.

### Deploy

Drop the repo on any static host:

| Host | Command |
|------|---------|
| GitHub Pages | Push to `main`, enable Pages in repo settings |
| Netlify | Drag & drop the repo folder |
| Vercel | `vercel --prod` |

## Project Structure

```
propcalc/
├── index.html          # Main application
├── assets/
│   ├── css/
│   │   └── styles.css  # All styles (responsive + print)
│   └── js/
│       └── calculator.js  # All calculation logic & event handlers
└── docs/
    └── test-scenarios.md  # Manual test cases & expected values
```

## API Keys (Optional)

Both APIs offer free tiers and are not required for the calculator to work.

| API | Free Tier | Used For |
|-----|-----------|----------|
| [RentCast](https://app.rentcast.io/app/api) | 50 calls/month | Auto-fill sqft, beds/baths, year built from address |
| [API Ninjas](https://api-ninjas.com/api/propertytax) | 50,000 calls/month | Look up effective property tax rate by ZIP code |

API keys are entered in the browser and never stored or sent anywhere except the respective API.

## Default Values

| Input | Default | Notes |
|-------|---------|-------|
| Purchase Price | $60,000 | |
| Monthly Rent | $400 | |
| Property Tax Rate | 2.55% | Adjustable; use API lookup for accuracy |
| Landlord Insurance | $900/yr | |
| Maintenance | 2% of value | Industry standard: 1–4% |
| Investment Horizon | 20 years | |
| Appreciation Rate | 1.5% | Conservative for smaller markets |
| Down Payment | 20% | When financing enabled |
| Interest Rate | 7.0% | |
| Loan Term | 30 years | |

## License

MIT
