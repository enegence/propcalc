// Initialize values
document.getElementById('purchasePrice').addEventListener('input', function() {
    const value = parseInt(this.value);
    document.getElementById('purchasePriceValue').textContent = value.toLocaleString();
    // Sync purchase price to current value (they should be the same for new purchase)
    document.getElementById('currentValue').value = value;
    // Trigger recalculation
    calculateInvestment();
});

document.getElementById('monthlyRent').addEventListener('input', function() {
    document.getElementById('monthlyRentValue').textContent = parseInt(this.value).toLocaleString();
    calculateInvestment();
});

document.getElementById('propertyTaxRate').addEventListener('input', function() {
    document.getElementById('propertyTaxRateValue').textContent = parseFloat(this.value).toFixed(2);
    calculateInvestment();
});

document.getElementById('insuranceAnnual').addEventListener('input', function() {
    document.getElementById('insuranceAnnualValue').textContent = parseInt(this.value).toLocaleString();
    calculateInvestment();
});

document.getElementById('maintenancePercent').addEventListener('input', function() {
    document.getElementById('maintenancePercentValue').textContent = parseFloat(this.value).toFixed(1);
    calculateInvestment();
});

document.getElementById('investmentHorizon').addEventListener('input', function() {
    document.getElementById('investmentHorizonValue').textContent = parseInt(this.value);
    calculateInvestment();
});

document.getElementById('appreciationRate').addEventListener('input', function() {
    document.getElementById('appreciationRateValue').textContent = parseFloat(this.value).toFixed(1);
    calculateInvestment();
});

document.getElementById('customRate').addEventListener('input', function() {
    document.getElementById('customRateValue').textContent = parseFloat(this.value).toFixed(1);
    calculateInvestment();
});

document.getElementById('propertyTaxInflation').addEventListener('input', function() {
    document.getElementById('propertyTaxInflationValue').textContent = parseFloat(this.value).toFixed(1);
    calculateInvestment();
});

document.getElementById('insuranceInflation').addEventListener('input', function() {
    document.getElementById('insuranceInflationValue').textContent = parseFloat(this.value).toFixed(1);
    calculateInvestment();
});

document.getElementById('feeInflation').addEventListener('input', function() {
    document.getElementById('feeInflationValue').textContent = parseFloat(this.value).toFixed(1);
    calculateInvestment();
});

document.getElementById('maintenanceInflation').addEventListener('input', function() {
    document.getElementById('maintenanceInflationValue').textContent = parseFloat(this.value).toFixed(1);
    calculateInvestment();
});

// Show/hide financing details
document.getElementById('isFinanced').addEventListener('change', function() {
    const financingDetails = document.getElementById('financingDetails');
    if (this.checked) {
        financingDetails.style.display = 'block';
        calculateMortgage();
        calculateInvestment();
    } else {
        financingDetails.style.display = 'none';
        calculateInvestment();
    }
});

// Financing sliders
document.getElementById('downPaymentPercent').addEventListener('input', function() {
    document.getElementById('downPaymentPercentValue').textContent = parseInt(this.value);
    calculateMortgage();
    calculateInvestment();
});

document.getElementById('interestRate').addEventListener('input', function() {
    document.getElementById('interestRateValue').textContent = parseFloat(this.value).toFixed(1);
    calculateMortgage();
    calculateInvestment();
});

document.getElementById('loanTerm').addEventListener('input', function() {
    document.getElementById('loanTermValue').textContent = parseInt(this.value);
    calculateMortgage();
    calculateInvestment();
});

// Function to calculate mortgage payment
function calculateMortgage() {
    const purchasePrice = parseFloat(document.getElementById('purchasePrice').value);
    const downPaymentPercent = parseFloat(document.getElementById('downPaymentPercent').value) / 100;
    const interestRate = parseFloat(document.getElementById('interestRate').value) / 100;
    const loanTerm = parseInt(document.getElementById('loanTerm').value);

    const downPayment = purchasePrice * downPaymentPercent;
    const loanAmount = purchasePrice - downPayment;

    // Calculate monthly payment using standard mortgage formula
    // M = P[r(1+r)^n]/[(1+r)^n-1]
    const monthlyRate = interestRate / 12;
    const numPayments = loanTerm * 12;

    let monthlyPayment = 0;
    if (monthlyRate > 0) {
        monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
                        (Math.pow(1 + monthlyRate, numPayments) - 1);
    } else {
        monthlyPayment = loanAmount / numPayments;
    }

    const totalPaid = monthlyPayment * numPayments;
    const totalInterest = totalPaid - loanAmount;

    // Update display
    document.getElementById('downPaymentAmount').textContent = downPayment.toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 0});
    document.getElementById('monthlyMortgage').textContent = monthlyPayment.toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 0});
    document.getElementById('loanAmount').textContent = loanAmount.toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 0});
    document.getElementById('totalInterest').textContent = totalInterest.toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 0});
    document.getElementById('totalPaid').textContent = totalPaid.toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 0});
    document.getElementById('loanTermDisplay').textContent = loanTerm;
}

// Show/hide tax relief section based on owner-occupied status
document.getElementById('ownerOccupied').addEventListener('change', function() {
    const taxReliefSection = document.getElementById('taxReliefSection');
    if (this.checked) {
        taxReliefSection.style.display = 'block';
    } else {
        taxReliefSection.style.display = 'none';
    }
});

// Show/hide family rental risks based on renter type
document.getElementById('renterType').addEventListener('change', function() {
    const familyRisks = document.getElementById('familyRentalRisks');
    if (this.value === 'family') {
        familyRisks.style.display = 'block';
    } else {
        familyRisks.style.display = 'none';
    }
});

// Function to fetch property tax rate from API Ninjas
async function fetchTaxRate() {
    const zipCode = document.getElementById('zipCode').value.trim();
    const apiKey = document.getElementById('apiNinjasKey').value.trim();
    const fetchButton = document.getElementById('fetchTaxButton');

    if (!zipCode) {
        showMessage('Please enter a ZIP code', 'error');
        return;
    }

    if (!apiKey) {
        showMessage('Please enter your API Ninjas API key. Get a free one at https://api-ninjas.com/api/propertytax (50,000 calls/month free)', 'warning');
        return;
    }

    fetchButton.disabled = true;
    fetchButton.textContent = 'Looking up tax rate...';
    showMessage('Fetching property tax rate for ZIP ' + zipCode + '...', 'info');

    try {
        const response = await fetch(`https://api.api-ninjas.com/v1/propertytax?zip=${zipCode}`, {
            method: 'GET',
            headers: {
                'X-Api-Key': apiKey
            }
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Invalid API key. Please check your API Ninjas API key.');
            } else if (response.status === 404) {
                throw new Error('No tax data found for this ZIP code.');
            } else {
                throw new Error(`API Error: ${response.status} - ${response.statusText}`);
            }
        }

        const data = await response.json();

        if (data && data.length > 0) {
            // Use median (50th percentile) tax rate
            const taxData = data[0];
            const medianRate = taxData['50th_percentile'];

            if (medianRate) {
                // Convert to percentage and update slider
                const ratePercent = parseFloat(medianRate);
                document.getElementById('propertyTaxRate').value = ratePercent.toFixed(2);
                document.getElementById('propertyTaxRateValue').textContent = ratePercent.toFixed(2);

                showMessage(
                    `Tax rate updated! Median effective rate for ${taxData.zip || zipCode}: ${ratePercent.toFixed(2)}% of market value. ` +
                    `(25th percentile: ${taxData['25th_percentile']}%, 75th percentile: ${taxData['75th_percentile']}%)`,
                    'success'
                );

                // Trigger recalculation
                calculateInvestment();
            } else {
                throw new Error('Tax rate data not available for this location.');
            }
        } else {
            throw new Error('No tax data found for this ZIP code.');
        }

    } catch (error) {
        console.error('Tax rate fetch error:', error);
        showMessage('Error: ' + error.message, 'error');
    } finally {
        fetchButton.disabled = false;
        fetchButton.textContent = 'Lookup Local Tax Rate';
    }
}

// Show/hide custom rate input
document.getElementById('alternativeInvestment').addEventListener('change', function() {
    const customSection = document.getElementById('customRateSection');
    if (this.value === 'custom') {
        customSection.style.display = 'block';
    } else {
        customSection.style.display = 'none';
    }
    calculateInvestment();
});

// Add listener to currentValue field for manual edits
document.getElementById('currentValue').addEventListener('input', function() {
    calculateInvestment();
});

// Add listeners to text/number inputs that affect calculations
['solidWasteFee', 'otherFees'].forEach(id => {
    document.getElementById(id).addEventListener('input', function() {
        calculateInvestment();
    });
});

// Function to fetch property data from RentCast API
async function fetchPropertyData() {
    const address = document.getElementById('address').value.trim();
    const apiKey = document.getElementById('apiKey').value.trim();
    const fetchButton = document.getElementById('fetchButton');

    if (!address) {
        showMessage('Please enter a property address', 'error');
        return;
    }

    if (!apiKey) {
        showMessage('Please enter your RentCast API key. Get a free one at https://app.rentcast.io/app/api (50 calls/month free)', 'warning');
        return;
    }

    // Show loading state
    fetchButton.disabled = true;
    fetchButton.textContent = 'Fetching property data...';
    showMessage('Looking up property data...', 'info');

    try {
        const response = await fetch(`https://api.rentcast.io/v1/properties?address=${encodeURIComponent(address)}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'X-Api-Key': apiKey
            }
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Invalid API key. Please check your RentCast API key.');
            } else if (response.status === 404) {
                throw new Error('Property not found. Try a different address format or check the spelling.');
            } else {
                throw new Error(`API Error: ${response.status} - ${response.statusText}`);
            }
        }

        const data = await response.json();

        if (data && data.length > 0) {
            const property = data[0]; // Get first result

            // Populate form fields with fetched data
            if (property.squareFootage) {
                document.getElementById('sqft').value = property.squareFootage;
            }
            if (property.bedrooms) {
                document.getElementById('bedrooms').value = property.bedrooms;
            }
            if (property.bathrooms) {
                document.getElementById('bathrooms').value = property.bathrooms;
            }
            if (property.yearBuilt) {
                document.getElementById('yearBuilt').value = property.yearBuilt;
            }
            if (property.assessorID) {
                // Use assessed value if available
                if (property.assessedValue) {
                    document.getElementById('currentValue').value = Math.round(property.assessedValue / 0.115); // Convert assessed to market value
                }
            }

            // Update property tax info if available
            if (property.taxAssessment && property.taxAssessment.value) {
                const taxAmount = property.taxAssessment.value;
                const marketValue = parseInt(document.getElementById('currentValue').value);
                if (marketValue > 0) {
                    const effectiveRate = (taxAmount / marketValue) * 100;
                    document.getElementById('propertyTaxRate').value = effectiveRate.toFixed(2);
                    document.getElementById('propertyTaxRateValue').textContent = effectiveRate.toFixed(2);
                }
            }

            showMessage(`Property data loaded successfully! Found: ${property.bedrooms} bed, ${property.bathrooms} bath, ${property.squareFootage} sqft`, 'success');

            // Auto-calculate with new data
            setTimeout(function() {
                updateBreakEvenRent();
            }, 500);

        } else {
            throw new Error('No property data found for this address.');
        }

    } catch (error) {
        console.error('Property fetch error:', error);
        showMessage('Error: ' + error.message, 'error');
    } finally {
        fetchButton.disabled = false;
        fetchButton.textContent = 'Fetch Property Data';
    }
}

function showMessage(message, type) {
    const messageDiv = document.getElementById('apiMessage');
    messageDiv.style.display = 'block';
    messageDiv.textContent = message;

    if (type === 'success') {
        messageDiv.style.background = '#d4edda';
        messageDiv.style.borderLeft = '4px solid #28a745';
        messageDiv.style.color = '#155724';
    } else if (type === 'error') {
        messageDiv.style.background = '#f8d7da';
        messageDiv.style.borderLeft = '4px solid #dc3545';
        messageDiv.style.color = '#721c24';
    } else if (type === 'warning') {
        messageDiv.style.background = '#fff3cd';
        messageDiv.style.borderLeft = '4px solid #ffc107';
        messageDiv.style.color = '#856404';
    } else {
        messageDiv.style.background = '#d1ecf1';
        messageDiv.style.borderLeft = '4px solid #17a2b8';
        messageDiv.style.color = '#0c5460';
    }

    // Auto-hide success/info messages after 5 seconds
    if (type === 'success' || type === 'info') {
        setTimeout(function() {
            messageDiv.style.display = 'none';
        }, 5000);
    }
}

// Function to calculate and update break-even rent
function updateBreakEvenRent() {
    const propertyTaxRate = parseFloat(document.getElementById('propertyTaxRate').value) / 100;
    const currentValue = parseFloat(document.getElementById('currentValue').value);
    const insuranceAnnual = parseFloat(document.getElementById('insuranceAnnual').value);
    const maintenancePercent = parseFloat(document.getElementById('maintenancePercent').value) / 100;
    const solidWasteFee = parseFloat(document.getElementById('solidWasteFee').value);
    const otherFees = parseFloat(document.getElementById('otherFees').value);
    const monthlyRent = parseFloat(document.getElementById('monthlyRent').value);
    const investmentHorizon = parseInt(document.getElementById('investmentHorizon').value);

    // Get inflation rates
    const propertyTaxInflation = parseFloat(document.getElementById('propertyTaxInflation').value) / 100;
    const insuranceInflation = parseFloat(document.getElementById('insuranceInflation').value) / 100;
    const feeInflation = parseFloat(document.getElementById('feeInflation').value) / 100;
    const maintenanceInflation = parseFloat(document.getElementById('maintenanceInflation').value) / 100;

    // Get mortgage payment if financed
    const isFinanced = document.getElementById('isFinanced').checked;
    let monthlyMortgage = 0;

    if (isFinanced) {
        const purchasePrice = parseFloat(document.getElementById('purchasePrice').value);
        const downPaymentPercent = parseFloat(document.getElementById('downPaymentPercent').value) / 100;
        const interestRate = parseFloat(document.getElementById('interestRate').value) / 100;
        const loanTerm = parseInt(document.getElementById('loanTerm').value);

        const downPayment = purchasePrice * downPaymentPercent;
        const loanAmount = purchasePrice - downPayment;
        const monthlyRate = interestRate / 12;
        const numPayments = loanTerm * 12;

        if (monthlyRate > 0) {
            monthlyMortgage = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
                            (Math.pow(1 + monthlyRate, numPayments) - 1);
        } else {
            monthlyMortgage = loanAmount / numPayments;
        }
    }

    // Calculate Year 1 expenses
    const propertyTaxAnnual = currentValue * propertyTaxRate;
    const maintenanceAnnual = currentValue * maintenancePercent;
    const year1Expenses = propertyTaxAnnual + insuranceAnnual + maintenanceAnnual + solidWasteFee + otherFees + (monthlyMortgage * 12);
    const breakEvenYear1 = Math.ceil(year1Expenses / 12);

    // Calculate Final Year expenses (mortgage stays constant)
    const finalYearPropertyTax = propertyTaxAnnual * Math.pow(1 + propertyTaxInflation, investmentHorizon - 1);
    const finalYearInsurance = insuranceAnnual * Math.pow(1 + insuranceInflation, investmentHorizon - 1);
    const finalYearMaintenance = maintenanceAnnual * Math.pow(1 + maintenanceInflation, investmentHorizon - 1);
    const finalYearFees = (solidWasteFee + otherFees) * Math.pow(1 + feeInflation, investmentHorizon - 1);
    const finalYearExpenses = finalYearPropertyTax + finalYearInsurance + finalYearMaintenance + finalYearFees + (monthlyMortgage * 12);
    const breakEvenFinal = Math.ceil(finalYearExpenses / 12);

    // Calculate Average break-even across all years
    let totalExpensesAllYears = 0;
    for (let year = 1; year <= investmentHorizon; year++) {
        const yearPropertyTax = propertyTaxAnnual * Math.pow(1 + propertyTaxInflation, year - 1);
        const yearInsurance = insuranceAnnual * Math.pow(1 + insuranceInflation, year - 1);
        const yearMaintenance = maintenanceAnnual * Math.pow(1 + maintenanceInflation, year - 1);
        const yearFees = (solidWasteFee + otherFees) * Math.pow(1 + feeInflation, year - 1);
        totalExpensesAllYears += yearPropertyTax + yearInsurance + yearMaintenance + yearFees + (monthlyMortgage * 12);
    }
    const averageAnnualExpenses = totalExpensesAllYears / investmentHorizon;
    const breakEvenAverage = Math.ceil(averageAnnualExpenses / 12);

    // Update display
    document.getElementById('breakEvenRentYear1').textContent = breakEvenYear1.toLocaleString();
    document.getElementById('breakEvenRentAverage').textContent = breakEvenAverage.toLocaleString();
    document.getElementById('breakEvenRentFinal').textContent = breakEvenFinal.toLocaleString();
    document.getElementById('breakEvenFinalYear').textContent = investmentHorizon;
    document.getElementById('breakEvenFinalYearLabel').textContent = investmentHorizon;

    // Calculate comparison using AVERAGE break-even (most meaningful)
    const comparisonText = document.getElementById('rentComparisonText');
    const difference = monthlyRent - breakEvenAverage;
    const year1Diff = monthlyRent - breakEvenYear1;
    const finalDiff = monthlyRent - breakEvenFinal;

    if (difference > 0) {
        const profitable_throughout = finalDiff >= 0;
        const subtextMsg = profitable_throughout
            ? `You'll be profitable throughout the ${investmentHorizon}-year period`
            : `Profitable on average, but rising costs will exceed rent in later years`;
        const subtextColor = profitable_throughout ? '#666' : '#856404';
        comparisonText.innerHTML = `
            <div style="color: #28a745;">
                ✓ <strong>Profitable!</strong> Current rent ($${monthlyRent.toLocaleString()}) is <strong>$${difference.toLocaleString()} above</strong> average break-even
            </div>
            <div style="font-size: 0.9em; margin-top: 8px; color: ${subtextColor};">
                ${subtextMsg}
            </div>
        `;
    } else if (difference === 0) {
        comparisonText.innerHTML = `
            <div style="color: #856404;">
                = <strong>Break-even.</strong> Current rent exactly matches average expenses
            </div>
            <div style="font-size: 0.9em; margin-top: 8px; color: #666;">
                No profit or loss over the ${investmentHorizon}-year period
            </div>
        `;
    } else {
        comparisonText.innerHTML = `
            <div style="color: #dc3545;">
                ✗ <strong>Losing money!</strong> Current rent ($${monthlyRent.toLocaleString()}) is <strong>$${Math.abs(difference).toLocaleString()} below</strong> average break-even
            </div>
            <div style="font-size: 0.9em; margin-top: 8px; color: #666;">
                You'll lose approximately $${(Math.abs(difference) * 12 * investmentHorizon).toLocaleString()} over ${investmentHorizon} years
            </div>
        `;
    }

    // Add Year 1 / Final Year detail line
    let additionalInfo = '<div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #ddd; font-size: 0.9em;">';

    if (year1Diff >= 0 && finalDiff < 0) {
        additionalInfo += `<div style="color: #856404;">Year 1: $${year1Diff.toLocaleString()}/mo above break-even &rarr; Year ${investmentHorizon}: $${Math.abs(finalDiff).toLocaleString()}/mo below break-even</div>`;
    } else if (year1Diff < 0 && finalDiff < 0) {
        additionalInfo += `<div style="color: #dc3545;">Losing money from Year 1 and getting worse each year</div>`;
    } else if (year1Diff > 0 && finalDiff > 0) {
        additionalInfo += `<div style="color: #28a745;">✓ Year 1: $${year1Diff.toLocaleString()}/mo above break-even &rarr; Year ${investmentHorizon}: $${finalDiff.toLocaleString()}/mo above break-even</div>`;
    }

    additionalInfo += '</div>';
    comparisonText.innerHTML += additionalInfo;
}

function calculateInvestment() {
    // Get all input values
    const purchasePrice = parseFloat(document.getElementById('purchasePrice').value);
    const monthlyRent = parseFloat(document.getElementById('monthlyRent').value);
    const propertyTaxRate = parseFloat(document.getElementById('propertyTaxRate').value) / 100;
    const currentValue = parseFloat(document.getElementById('currentValue').value);
    const insuranceAnnual = parseFloat(document.getElementById('insuranceAnnual').value);
    const maintenancePercent = parseFloat(document.getElementById('maintenancePercent').value) / 100;
    const solidWasteFee = parseFloat(document.getElementById('solidWasteFee').value);
    const otherFees = parseFloat(document.getElementById('otherFees').value);
    const investmentHorizon = parseInt(document.getElementById('investmentHorizon').value);
    const appreciationRate = parseFloat(document.getElementById('appreciationRate').value) / 100;
    const alternativeInvestmentType = document.getElementById('alternativeInvestment').value;

    // Get inflation rates
    const propertyTaxInflation = parseFloat(document.getElementById('propertyTaxInflation').value) / 100;
    const insuranceInflation = parseFloat(document.getElementById('insuranceInflation').value) / 100;
    const feeInflation = parseFloat(document.getElementById('feeInflation').value) / 100;
    const maintenanceInflation = parseFloat(document.getElementById('maintenanceInflation').value) / 100;

    // Get financing details
    const isFinanced = document.getElementById('isFinanced').checked;
    let monthlyMortgage = 0;
    let actualCashInvested = purchasePrice; // For ROI calculations

    if (isFinanced) {
        const downPaymentPercent = parseFloat(document.getElementById('downPaymentPercent').value) / 100;
        const interestRate = parseFloat(document.getElementById('interestRate').value) / 100;
        const loanTerm = parseInt(document.getElementById('loanTerm').value);

        const downPayment = purchasePrice * downPaymentPercent;
        const loanAmount = purchasePrice - downPayment;
        actualCashInvested = downPayment; // Only down payment is your cash investment

        const monthlyRate = interestRate / 12;
        const numPayments = loanTerm * 12;

        if (monthlyRate > 0) {
            monthlyMortgage = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
                            (Math.pow(1 + monthlyRate, numPayments) - 1);
        } else {
            monthlyMortgage = loanAmount / numPayments;
        }
    }

    // Calculate YEAR 1 annual figures (baseline)
    const annualRent = monthlyRent * 12;
    const annualMortgage = monthlyMortgage * 12;
    const propertyTaxAnnual = currentValue * propertyTaxRate;
    const maintenanceAnnual = currentValue * maintenancePercent;
    const totalAnnualExpenses = propertyTaxAnnual + insuranceAnnual + maintenanceAnnual + solidWasteFee + otherFees + annualMortgage;
    const netAnnualCashFlow = annualRent - totalAnnualExpenses;

    // Calculate expenses over the full investment horizon with inflation
    let cumulativeExpenses = 0;
    let cumulativeRevenue = 0;
    let yearByYearData = [];

    for (let year = 1; year <= investmentHorizon; year++) {
        // Calculate inflated costs for this year
        const yearPropertyTax = propertyTaxAnnual * Math.pow(1 + propertyTaxInflation, year - 1);
        const yearInsurance = insuranceAnnual * Math.pow(1 + insuranceInflation, year - 1);
        const yearMaintenance = maintenanceAnnual * Math.pow(1 + maintenanceInflation, year - 1);
        const yearFees = (solidWasteFee + otherFees) * Math.pow(1 + feeInflation, year - 1);

        // Mortgage payment stays constant (fixed rate)
        const yearExpenses = yearPropertyTax + yearInsurance + yearMaintenance + yearFees + annualMortgage;
        const yearRevenue = annualRent; // Assuming rent stays constant (conservative)
        const yearCashFlow = yearRevenue - yearExpenses;

        cumulativeExpenses += yearExpenses;
        cumulativeRevenue += yearRevenue;

        yearByYearData.push({
            year: year,
            expenses: yearExpenses,
            revenue: yearRevenue,
            cashFlow: yearCashFlow
        });
    }

    const totalCashFlow = cumulativeRevenue - cumulativeExpenses;
    const averageAnnualExpenses = cumulativeExpenses / investmentHorizon;

    // Update summary cards
    document.getElementById('annualRevenue').textContent = annualRent.toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 0});
    document.getElementById('annualExpenses').textContent = totalAnnualExpenses.toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 0});

    const cashFlowElement = document.getElementById('netCashFlow');
    cashFlowElement.textContent = '$' + netAnnualCashFlow.toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 0});
    cashFlowElement.className = 'value ' + (netAnnualCashFlow >= 0 ? 'positive' : 'negative');

    // Create monthly breakdown table
    const breakdown = [
        { category: 'Rental Income', monthly: monthlyRent, annual: annualRent, isIncome: true },
        { category: 'Property Taxes', monthly: propertyTaxAnnual / 12, annual: propertyTaxAnnual, isIncome: false },
        { category: 'Landlord Insurance', monthly: insuranceAnnual / 12, annual: insuranceAnnual, isIncome: false },
        { category: 'Maintenance Reserve', monthly: maintenanceAnnual / 12, annual: maintenanceAnnual, isIncome: false },
        { category: 'Solid Waste Fee', monthly: solidWasteFee / 12, annual: solidWasteFee, isIncome: false },
    ];

    if (isFinanced && monthlyMortgage > 0) {
        breakdown.push({ category: 'Mortgage Payment (P&I)', monthly: monthlyMortgage, annual: annualMortgage, isIncome: false });
    }

    if (otherFees > 0) {
        breakdown.push({ category: 'Other Fees', monthly: otherFees / 12, annual: otherFees, isIncome: false });
    }

    breakdown.push({
        category: 'Net Cash Flow',
        monthly: netAnnualCashFlow / 12,
        annual: netAnnualCashFlow,
        isIncome: netAnnualCashFlow >= 0
    });

    let tableHTML = '';
    breakdown.forEach(item => {
        const colorClass = item.category === 'Net Cash Flow'
            ? (item.isIncome ? 'positive' : 'negative')
            : (item.isIncome ? '' : '');
        tableHTML += `
            <tr>
                <td><strong>${item.category}</strong></td>
                <td class="${colorClass}">$${item.monthly.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                <td class="${colorClass}">$${item.annual.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
            </tr>
        `;
    });
    document.getElementById('monthlyBreakdown').innerHTML = tableHTML;

    // Update inflation impact section
    document.getElementById('horizonYears').textContent = investmentHorizon;
    document.getElementById('finalYear').textContent = investmentHorizon;
    document.getElementById('cumulativeExpenses').textContent = cumulativeExpenses.toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 0});
    document.getElementById('staticExpenses').textContent = (totalAnnualExpenses * investmentHorizon).toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 0});
    document.getElementById('year1Expenses').textContent = totalAnnualExpenses.toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 0});
    document.getElementById('finalYearExpenses').textContent = yearByYearData[investmentHorizon - 1].expenses.toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 0});

    // Build year-by-year table (show every year for periods ≤10 years, or every 5th year for longer periods)
    let inflationTableHTML = '';
    const showEveryYear = investmentHorizon <= 10;

    yearByYearData.forEach((yearData, index) => {
        const year = yearData.year;
        if (showEveryYear || year === 1 || year === investmentHorizon || year % 5 === 0) {
            const yearPropertyTax = propertyTaxAnnual * Math.pow(1 + propertyTaxInflation, year - 1);
            const yearInsurance = insuranceAnnual * Math.pow(1 + insuranceInflation, year - 1);
            const yearMaintenance = maintenanceAnnual * Math.pow(1 + maintenanceInflation, year - 1);
            const yearFees = (solidWasteFee + otherFees) * Math.pow(1 + feeInflation, year - 1);

            const cashFlowClass = yearData.cashFlow >= 0 ? 'positive' : 'negative';

            inflationTableHTML += `
                <tr>
                    <td><strong>Year ${year}</strong></td>
                    <td>$${yearPropertyTax.toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 0})}</td>
                    <td>$${yearInsurance.toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 0})}</td>
                    <td>$${yearMaintenance.toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 0})}</td>
                    <td>$${yearFees.toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 0})}</td>
                    <td><strong>$${yearData.expenses.toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 0})}</strong></td>
                    <td class="${cashFlowClass}">$${yearData.cashFlow.toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 0})}</td>
                </tr>
            `;
        }
    });
    document.getElementById('inflationBreakdown').innerHTML = inflationTableHTML;

    // Calculate break-even time (more complex with inflation)
    let breakEvenHTML = '';
    let breakEvenDescHTML = '';

    if (netAnnualCashFlow > 0) {
        // With inflation, need to calculate when cumulative cash flow = purchase price
        let cumulativeCashFlow = 0;
        let breakEvenYear = 0;

        for (let year = 1; year <= 50; year++) { // Check up to 50 years
            const yearPropertyTax = propertyTaxAnnual * Math.pow(1 + propertyTaxInflation, year - 1);
            const yearInsurance = insuranceAnnual * Math.pow(1 + insuranceInflation, year - 1);
            const yearMaintenance = maintenanceAnnual * Math.pow(1 + maintenanceInflation, year - 1);
            const yearFees = (solidWasteFee + otherFees) * Math.pow(1 + feeInflation, year - 1);
            const yearExpenses = yearPropertyTax + yearInsurance + yearMaintenance + yearFees;
            const yearCashFlow = annualRent - yearExpenses;

            cumulativeCashFlow += yearCashFlow;

            if (cumulativeCashFlow >= purchasePrice) {
                breakEvenYear = year;
                break;
            }

            if (yearCashFlow <= 0) {
                // Cash flow becomes negative, will never break even
                breakEvenYear = -1;
                break;
            }
        }

        if (breakEvenYear > 0) {
            breakEvenHTML = `${breakEvenYear} year${breakEvenYear > 1 ? 's' : ''}`;
            breakEvenDescHTML = `Based on current rent of $${monthlyRent.toLocaleString()}/month with cost inflation`;
        } else if (breakEvenYear === -1) {
            breakEvenHTML = 'Never (Expenses Exceed Rent)';
            breakEvenDescHTML = `Rising costs will eventually exceed rent income`;
        } else {
            breakEvenHTML = 'Never (>50 years)';
            breakEvenDescHTML = `Would take more than 50 years at current rent levels`;
        }

        // Create recovery timeline
        let timelineHTML = '<h4 style="margin-bottom: 15px;">Investment Recovery Milestones (Cash Flow Only)</h4>';
        const milestones = [25, 50, 75, 100];
        milestones.forEach(percent => {
            const targetAmount = (purchasePrice * percent) / 100;
            let recoveryYear = 0;
            let cumulativeFlow = 0;

            for (let year = 1; year <= 100; year++) {
                const yearPropertyTax = propertyTaxAnnual * Math.pow(1 + propertyTaxInflation, year - 1);
                const yearInsurance = insuranceAnnual * Math.pow(1 + insuranceInflation, year - 1);
                const yearMaintenance = maintenanceAnnual * Math.pow(1 + maintenanceInflation, year - 1);
                const yearFees = (solidWasteFee + otherFees) * Math.pow(1 + feeInflation, year - 1);
                const yearExpenses = yearPropertyTax + yearInsurance + yearMaintenance + yearFees;
                const yearCashFlow = annualRent - yearExpenses;

                cumulativeFlow += yearCashFlow;

                if (cumulativeFlow >= targetAmount) {
                    recoveryYear = year;
                    break;
                }

                if (yearCashFlow <= 0) {
                    recoveryYear = -1;
                    break;
                }
            }

            if (recoveryYear > 0 && recoveryYear <= 100) {
                timelineHTML += `
                    <div class="timeline-item">
                        <h4>${percent}% Recovered ($${targetAmount.toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 0})})</h4>
                        <p>${recoveryYear} year${recoveryYear > 1 ? 's' : ''}</p>
                    </div>
                `;
            } else if (recoveryYear === -1) {
                timelineHTML += `
                    <div class="timeline-item" style="background: #f8d7da;">
                        <h4>${percent}% Recovered ($${targetAmount.toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 0})})</h4>
                        <p>Never - expenses will exceed rent before this point</p>
                    </div>
                `;
            } else {
                timelineHTML += `
                    <div class="timeline-item" style="background: #fff3cd;">
                        <h4>${percent}% Recovered ($${targetAmount.toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 0})})</h4>
                        <p>Beyond 100 years</p>
                    </div>
                `;
            }
        });
        document.getElementById('recoveryTimeline').innerHTML = timelineHTML;
    } else if (netAnnualCashFlow === 0) {
        breakEvenHTML = 'Never';
        breakEvenDescHTML = 'Year 1 income exactly matches expenses - cost inflation will make it worse';
        document.getElementById('recoveryTimeline').innerHTML = `
            <div class="warning">
                <strong>Warning:</strong> At current rent levels, you will never recover your investment as expenses equal or exceed income.
            </div>
        `;
    } else {
        breakEvenHTML = 'Never (Losing Money)';
        breakEvenDescHTML = `You are losing money from day one at current rent`;
        const minBreakEvenRent = Math.ceil((totalAnnualExpenses / 12) / 25) * 25;
        document.getElementById('recoveryTimeline').innerHTML = `
            <div class="warning">
                <strong>Warning:</strong> Current expenses exceed rental income. You need to collect at least $${minBreakEvenRent}/month just to break even on Year 1 costs. At $${monthlyRent}/month, you're losing money each year.
            </div>
        `;
    }

    document.getElementById('breakEvenTime').textContent = breakEvenHTML;
    document.getElementById('breakEvenDesc').textContent = breakEvenDescHTML;

    // Calculate Property Appreciation
    const futureValue = currentValue * Math.pow(1 + appreciationRate, investmentHorizon);
    const totalAppreciation = futureValue - purchasePrice;
    const combinedReturn = totalAppreciation + totalCashFlow;
    const totalROI = (combinedReturn / actualCashInvested) * 100; // Use actual cash invested (down payment if financed)
    const annualizedROI = (Math.pow(1 + (totalROI / 100), 1 / investmentHorizon) - 1) * 100;

    // Update appreciation section
    document.getElementById('purchasePriceDisplay').textContent = purchasePrice.toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 0});
    document.getElementById('futurePropertyValue').textContent = futureValue.toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 0});
    document.getElementById('yearsDisplay').textContent = investmentHorizon;
    document.getElementById('appreciationDisplay').textContent = (appreciationRate * 100).toFixed(1);
    document.getElementById('totalAppreciation').textContent = totalAppreciation.toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 0});

    const totalCashFlowElement = document.getElementById('totalCashFlowDisplay');
    totalCashFlowElement.textContent = '$' + totalCashFlow.toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 0});
    totalCashFlowElement.className = 'value ' + (totalCashFlow >= 0 ? 'positive' : 'negative');

    document.getElementById('combinedReturn').textContent = combinedReturn.toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 0});
    document.getElementById('totalROI').textContent = totalROI.toFixed(1);
    document.getElementById('annualizedROI').textContent = annualizedROI.toFixed(2);

    // Calculate Alternative Investment
    let alternativeRate = 0;
    let alternativeName = '';

    if (alternativeInvestmentType === 'sp500') {
        alternativeRate = 0.10; // 10% average
        alternativeName = 'S&P 500 Index Fund';
    } else if (alternativeInvestmentType === 'hysa') {
        alternativeRate = 0.04; // 4% current HYSA rate
        alternativeName = 'High-Yield Savings Account';
    } else {
        alternativeRate = parseFloat(document.getElementById('customRate').value) / 100;
        alternativeName = 'Custom Investment';
    }

    const alternativeFinalValue = actualCashInvested * Math.pow(1 + alternativeRate, investmentHorizon);
    const alternativeReturn = alternativeFinalValue - actualCashInvested;
    const alternativeROI = (alternativeReturn / actualCashInvested) * 100;
    const alternativeAnnualized = alternativeRate * 100;

    const propertyFinalValue = futureValue + totalCashFlow;
    const difference = propertyFinalValue - alternativeFinalValue;

    // Update comparison section
    document.getElementById('comparisonAmount').textContent = actualCashInvested.toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 0});
    document.getElementById('comparisonType').textContent = alternativeName.toLowerCase();
    document.getElementById('alternativeInvestmentName').textContent = alternativeName;
    document.getElementById('alternativeRateDisplay').textContent = (alternativeRate * 100).toFixed(1);

    document.getElementById('propertyFinalValue').textContent = propertyFinalValue.toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 0});
    document.getElementById('propertyROIPercent').textContent = totalROI.toFixed(1);
    document.getElementById('propertyAnnualizedPercent').textContent = annualizedROI.toFixed(2);

    document.getElementById('alternativeFinalValue').textContent = alternativeFinalValue.toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 0});
    document.getElementById('alternativeROIPercent').textContent = alternativeROI.toFixed(1);
    document.getElementById('alternativeAnnualizedPercent').textContent = alternativeAnnualized.toFixed(2);

    document.getElementById('fullAmount').textContent = actualCashInvested.toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 0});

    const comparisonDiffElement = document.getElementById('comparisonDifference');
    const comparisonResultCard = document.getElementById('comparisonResultCard');

    if (difference > 0) {
        comparisonDiffElement.textContent = '+$' + difference.toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 0});
        comparisonDiffElement.className = 'value positive';
        comparisonResultCard.style.background = '#d4edda';
        comparisonResultCard.style.borderLeft = '4px solid #28a745';
        document.getElementById('comparisonResultTitle').textContent = 'Property Investment Wins';
        document.getElementById('comparisonResultText').textContent = `Property investment would be worth $${Math.abs(difference).toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 0})} MORE than ${alternativeName.toLowerCase()} after ${investmentHorizon} years`;
    } else {
        comparisonDiffElement.textContent = '-$' + Math.abs(difference).toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 0});
        comparisonDiffElement.className = 'value negative';
        comparisonResultCard.style.background = '#f8d7da';
        comparisonResultCard.style.borderLeft = '4px solid #dc3545';
        document.getElementById('comparisonResultTitle').textContent = 'Alternative Investment Wins';
        document.getElementById('comparisonResultText').textContent = `${alternativeName} would be worth $${Math.abs(difference).toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 0})} MORE than property investment after ${investmentHorizon} years`;
    }

    // Update break-even rent display
    updateBreakEvenRent();
}

// Calculate on page load with default values
window.addEventListener('load', function() {
    calculateInvestment();
});
