"""
Testing script for ML models
"""
import json
from ml_models import (
    MonthlyReportGenerator,
    OverspendingDetector,
    SavingsPlanOptimizer,
    AIInsightGenerator
)

# Sample test data
test_transactions = [
    # Recent transactions
    {"date": "2024-04-10", "amount": 150, "category": "Food & Dining", "type": "expense"},
    {"date": "2024-04-10", "amount": 5000, "category": "Salary", "type": "income"},
    {"date": "2024-04-09", "amount": 300, "category": "Transport", "type": "expense"},
    {"date": "2024-04-09", "amount": 200, "category": "Entertainment", "type": "expense"},
    {"date": "2024-04-08", "amount": 100, "category": "Utilities", "type": "expense"},
    {"date": "2024-04-08", "amount": 400, "category": "Food & Dining", "type": "expense"},
    {"date": "2024-04-07", "amount": 50, "category": "Transport", "type": "expense"},
    {"date": "2024-04-07", "amount": 2000, "category": "Salary", "type": "income"},
    {"date": "2024-04-06", "amount": 500, "category": "Food & Dining", "type": "expense"},
    {"date": "2024-04-06", "amount": 150, "category": "Entertainment", "type": "expense"},
    {"date": "2024-04-05", "amount": 10000, "category": "Food & Dining", "type": "expense"},  # Anomaly!
    {"date": "2024-04-05", "amount": 80, "category": "Transport", "type": "expense"},
    {"date": "2024-04-04", "amount": 200, "category": "Food & Dining", "type": "expense"},
    {"date": "2024-04-03", "amount": 120, "category": "Transport", "type": "expense"},
    {"date": "2024-04-02", "amount": 300, "category": "Food & Dining", "type": "expense"},
    {"date": "2024-04-01", "amount": 5000, "category": "Salary", "type": "income"},
]

print("=" * 60)
print("SpendSmart ML Service Testing")
print("=" * 60)

# Test 1: Monthly Report Generator
print("\n1. Monthly Report Generator (Prophet)")
print("-" * 60)
monthly_result = MonthlyReportGenerator.generate_forecast(test_transactions)
if monthly_result:
    print(f"✓ Forecast generated successfully")
    print(f"  Next month forecast: INR {monthly_result['forecast_next_month']:.2f}")
    print(f"  Daily average: INR {monthly_result['daily_average']:.2f}")
    print(f"  Trend: {monthly_result['trend']}")
    print(f"  Confidence: {monthly_result['confidence']['lower']:.2f} - {monthly_result['confidence']['upper']:.2f}")
else:
    print("✗ Prophet forecast failed or insufficient data")

# Test 2: Overspending Detector
print("\n2. Overspending Detector (Isolation Forest)")
print("-" * 60)
anomalies = OverspendingDetector.detect_anomalies(test_transactions)
if anomalies:
    print(f"✓ Detected {len(anomalies)} anomalies")
    for anom in anomalies:
        print(f"  - {anom['category']}: INR {anom['amount']:.2f} [Severity: {anom['severity']}]")
else:
    print("✗ No anomalies detected (data insufficient)")

# Test 3: Savings Plan Optimizer
print("\n3. Savings Plan Optimizer (Linear Regression)")
print("-" * 60)
savings_result = SavingsPlanOptimizer.optimize_plan(test_transactions, 50000, 12)
if savings_result and 'error' not in savings_result:
    print(f"✓ Plan generated successfully")
    print(f"  Monthly income: INR {savings_result['monthly_income']:.2f}")
    print(f"  Monthly expense: INR {savings_result['monthly_expense']:.2f}")
    print(f"  Monthly capacity: INR {savings_result['monthly_capacity']:.2f}")
    print(f"  Required monthly: INR {savings_result['required_monthly']:.2f}")
    print(f"  Goal achievable: {savings_result['goal_achievable']}")
    print(f"  Recommendations:")
    for rec in savings_result['recommendations']:
        print(f"    - {rec}")
elif savings_result and 'error' in savings_result:
    print(f"✗ Plan generation error: {savings_result['message']}")
else:
    print("✗ Savings plan failed")

# Test 4: AI Insight Generator
print("\n4. AI Insight Generator (Random Forest)")
print("-" * 60)
tips = AIInsightGenerator.generate_tips(test_transactions)
if tips:
    print(f"✓ Generated {len(tips)} insights")
    for i, tip in enumerate(tips, 1):
        print(f"  {i}. [{tip['type'].upper()}] {tip['message']}")
else:
    print("✗ No insights generated (data insufficient)")

# Test 5: Error handling
print("\n5. Error Handling Tests")
print("-" * 60)

# Test with invalid goal
print("  Testing with unrealistic goal...")
invalid_result = SavingsPlanOptimizer.optimize_plan(test_transactions, 1_000_000_000, 1)
if 'error' in invalid_result:
    print(f"  ✓ Correctly rejected: {invalid_result['message']}")
else:
    print(f"  ✗ Should have rejected unrealistic goal")

print("\n" + "=" * 60)
print("Testing Complete!")
print("=" * 60)
print("\nIf all tests passed, the ML service is ready! 🎉")
