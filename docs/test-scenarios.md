# Property Investment Calculator - Test Verification

## Test Scenario 1: Cash Purchase (No Financing)
**Inputs:**
- Purchase Price: $60,000
- Monthly Rent: $400
- Property Tax Rate: 2.55%
- Insurance: $900/year
- Maintenance: 2% of value
- Solid Waste Fee: $90/year
- Other Fees: $0
- Investment Horizon: 20 years

**Expected Year 1 Calculations:**
- Annual Rent: $400 × 12 = $4,800
- Property Tax: $60,000 × 2.55% = $1,530
- Insurance: $900
- Maintenance: $60,000 × 2% = $1,200
- Solid Waste: $90
- Total Annual Expenses: $1,530 + $900 + $1,200 + $90 = $3,720
- Net Cash Flow Year 1: $4,800 - $3,720 = $1,080

**Break-Even Rent:**
- Year 1: $3,720 / 12 = $310/month

**Status:** ✓ Should show profitable ($400 > $310)

---

## Test Scenario 2: Financed Purchase (20% Down, 7% Interest, 30 Years)
**Inputs:**
- Purchase Price: $60,000
- Down Payment: 20% = $12,000
- Loan Amount: $48,000
- Interest Rate: 7.0%
- Loan Term: 30 years

**Expected Mortgage Calculation:**
Formula: M = P[r(1+r)^n]/[(1+r)^n-1]
Where:
- P = $48,000 (loan amount)
- r = 7%/12 = 0.005833 (monthly rate)
- n = 30 × 12 = 360 (total payments)

M = 48,000 × [0.005833 × (1.005833)^360] / [(1.005833)^360 - 1]
M = 48,000 × [0.005833 × 7.918] / [6.918]
M = 48,000 × 0.006661
M ≈ $319.50/month

**Expected Total Costs:**
- Monthly Mortgage: ~$320
- Annual Mortgage: ~$3,840
- Total Year 1 Expenses: $3,720 + $3,840 = $7,560
- Net Cash Flow Year 1: $4,800 - $7,560 = -$2,760

**Break-Even Rent:**
- Year 1: $7,560 / 12 = $630/month

**ROI Calculation (Cash Invested):**
- Actual cash invested: $12,000 (down payment only)
- If cash flow is negative but property appreciates...
- ROI should be calculated on $12,000, not $60,000

**Status:** Should show:
- ✗ Losing money at $400/month rent
- Need $630/month to break even
- But ROI percentages will be much higher (leveraged)

---

## Test Scenario 3: Property Tax Rate Lookup
**Test ZIP Codes:**
- 10001 (Manhattan, NY): ~0.88%
- 78701 (Austin, TX): ~1.81%
- 90210 (Beverly Hills, CA): ~1.05%
- 60601 (Chicago, IL): ~2.10%

**Expected Behavior:**
1. Enter ZIP code
2. Enter API key
3. Click "Lookup Local Tax Rate"
4. Should update property tax slider
5. All calculations should refresh automatically

---

## Test Scenario 4: Break-Even Rent with Inflation
**Inputs:**
- Same as Scenario 1
- Property Tax Inflation: 4.5%/year
- Insurance Inflation: 4%/year
- Investment Horizon: 20 years

**Expected:**
- Year 1 Break-Even: $310/month
- Year 20 Break-Even: Higher due to inflation
- Average Break-Even: Somewhere in between

**Year 20 Expenses:**
- Property Tax: $1,530 × (1.045)^19 ≈ $3,588
- Insurance: $900 × (1.04)^19 ≈ $1,872
- Maintenance: Increases with property value inflation
- Total Year 20 > Year 1

---

## Features to Verify:

### Auto-Calculation
- [ ] Moving any slider triggers instant recalculation
- [ ] No "Calculate" button needed
- [ ] Break-even rent updates in real-time

### Financing Toggle
- [ ] Unchecked by default
- [ ] Checking shows financing details
- [ ] Mortgage payment appears in breakdown table
- [ ] ROI calculated on down payment, not full price
- [ ] Break-even rent includes mortgage

### Property Tax Explanation
- [ ] Clear explanation of effective tax rate method
- [ ] Example calculation shown
- [ ] Regional ranges displayed

### Address Fields
- [ ] Empty by default (no Kansas address)
- [ ] ZIP code field present
- [ ] Both API buttons visible

### Renter Type
- [ ] Dropdown with two options
- [ ] Family risks hidden by default
- [ ] Shows when "family" selected

---

## Edge Cases to Test:

1. **Zero rent:** Should show all scenarios as "losing money"
2. **Very high rent:** Should show immediate profitability
3. **Zero down payment (100% financing):** Should calculate correctly
4. **50% down payment:** Should show lower mortgage
5. **Changing purchase price:** Should sync with current value
6. **0% interest rate:** Should calculate mortgage as simple division

---

## Known Correct Values (Verification):

**Mortgage Formula Verification:**
$100,000 loan at 6% for 30 years = $599.55/month
$200,000 loan at 7% for 30 years = $1,330.60/month
$48,000 loan at 7% for 30 years = $319.49/month ✓

**ROI with Leverage:**
If property appreciates $20,000 and you put down $12,000:
ROI = $20,000 / $12,000 = 166.7%
(vs. 33% if you paid cash for $60,000 property)
