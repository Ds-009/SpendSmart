"""
ML Models for SpendSmart AI Features
"""
import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest, RandomForestClassifier, RandomForestRegressor, GradientBoostingRegressor
from sklearn.linear_model import LinearRegression, HuberRegressor
from sklearn.preprocessing import StandardScaler, RobustScaler
from prophet import Prophet
from datetime import datetime, timedelta
import json
import warnings
warnings.filterwarnings('ignore')


class MonthlyReportGenerator:
    """Random forest ensemble forecasting for monthly spending patterns"""
    
    @staticmethod
    def generate_forecast(transactions):
        """
        Generate spending forecast using a RandomForest/GradientBoosting ensemble.

        Args:
            transactions: List of transaction dicts with 'date', 'amount', 'type' fields

        Returns:
            Dict with forecast_next_month, trend, and confidence bounds
        """
        try:
            expenses = [t for t in transactions if t.get('type') == 'expense']
            if len(expenses) < 6:
                return None

            df = pd.DataFrame(expenses)
            df['ds'] = pd.to_datetime(df['date'], errors='coerce')
            df['y'] = pd.to_numeric(df['amount'], errors='coerce')
            df = df.dropna(subset=['ds', 'y'])

            if df.empty:
                return None

            df['month'] = df['ds'].dt.to_period('M').dt.to_timestamp()
            monthly = df.groupby('month')['y'].sum().reset_index().sort_values('month')

            if len(monthly) < 5:
                return None

            monthly['month_index'] = np.arange(len(monthly))
            monthly['lag_1'] = monthly['y'].shift(1)
            monthly['lag_2'] = monthly['y'].shift(2)
            monthly['lag_3'] = monthly['y'].shift(3)
            monthly['rolling_mean_3'] = monthly['y'].rolling(window=3).mean()
            monthly['month_of_year'] = monthly['month'].dt.month

            training = monthly.dropna().copy()
            if len(training) < 4:
                return None

            features = ['month_index', 'lag_1', 'lag_2', 'lag_3', 'rolling_mean_3']
            X_train = training[features].values
            y_train = training['y'].values

            models = [
                RandomForestRegressor(n_estimators=50, random_state=42),
                GradientBoostingRegressor(n_estimators=50, random_state=42),
                HuberRegressor()
            ]

            forecasts = []
            for model in models:
                try:
                    model.fit(X_train, y_train)
                    next_index = monthly['month_index'].iloc[-1] + 1
                    next_lag_1 = monthly['y'].iloc[-1]
                    next_lag_2 = monthly['y'].iloc[-2] if len(monthly) > 1 else next_lag_1
                    next_lag_3 = monthly['y'].iloc[-3] if len(monthly) > 2 else next_lag_1
                    next_rolling_mean = monthly['y'].tail(3).mean()
                    next_features = np.array([[next_index, next_lag_1, next_lag_2, next_lag_3, next_rolling_mean]])
                    prediction = model.predict(next_features)[0]
                    forecasts.append(float(prediction))
                except Exception:
                    continue

            if not forecasts:
                return None

            forecast_next_month = float(np.median(forecasts))
            forecast_next_month = max(0.0, forecast_next_month)
            trend_direction = 'up' if forecast_next_month > monthly['y'].iloc[-1] else 'down' if forecast_next_month < monthly['y'].iloc[-1] else 'stable'
            forecast_month_label = (monthly['month'].iloc[-1] + pd.offsets.MonthBegin(1)).strftime('%b %Y')

            return {
                'forecast_next_month': forecast_next_month,
                'forecast_month_label': forecast_month_label,
                'trend': trend_direction,
                'confidence': {
                    'lower': float(np.percentile(forecasts, 25)),
                    'upper': float(np.percentile(forecasts, 75))
                }
            }
        except Exception as e:
            print(f"Forecast generation error: {str(e)}")
            return None


class OverspendingDetector:
    """Isolation Forest-based anomaly detection for spending spikes"""
    
    @staticmethod
    def detect_anomalies(transactions):
        """
        Detect overspending anomalies using robust statistical methods

        Args:
            transactions: List of transaction dicts

        Returns:
            List of detected anomalies with severity levels
        """
        try:
            expenses = [t for t in transactions if t.get('type') == 'expense']
            if len(expenses) < 10:  # Reduced threshold for better detection
                return []

            anomalies = []

            # First pass: Detect extremely high transactions (potential data errors)
            all_amounts = [float(t.get('amount', 0)) for t in expenses]
            if all_amounts:
                median_amount = np.median(all_amounts)
                mad = np.median([abs(x - median_amount) for x in all_amounts])  # Median Absolute Deviation

                for exp in expenses:
                    amount = float(exp.get('amount', 0))
                    # Modified Z-score using MAD (more robust than standard deviation)
                    if mad > 0:
                        modified_z = 0.6745 * (amount - median_amount) / mad
                        if modified_z > 3.5:  # Very conservative threshold
                            anomalies.append({
                                'category': exp.get('category', 'Other'),
                                'amount': amount,
                                'severity': 'critical',
                                'z_score': float(modified_z),
                                'message': f'Extremely high transaction detected: INR {amount:,.0f} in {exp.get("category", "Other")}'
                            })

            # Second pass: Category-wise anomaly detection
            categories = {}
            for exp in expenses:
                cat = exp.get('category', 'Other')
                if cat not in categories:
                    categories[cat] = []
                categories[cat].append(float(exp.get('amount', 0)))

            for category, amounts in categories.items():
                if len(amounts) < 3:  # Need at least 3 transactions per category
                    continue

                # Use robust statistics for category analysis
                amounts_array = np.array(amounts)
                Q1 = np.percentile(amounts_array, 25)
                Q3 = np.percentile(amounts_array, 75)
                IQR = Q3 - Q1

                if IQR > 0:  # Avoid division by zero
                    # Calculate outlier bounds
                    lower_bound = Q1 - 1.5 * IQR
                    upper_bound = Q3 + 1.5 * IQR

                    for amount in amounts:
                        if amount > upper_bound:
                            # Calculate severity based on how far from normal
                            deviation_factor = amount / Q3
                            severity = 'high' if deviation_factor > 3 else 'medium'

                            anomalies.append({
                                'category': category,
                                'amount': float(amount),
                                'severity': severity,
                                'z_score': float(deviation_factor),
                                'message': f'Unusual {severity} spending detected in {category}: INR {amount:.0f} (normal range: INR {Q1:.0f}-{Q3:.0f})'
                            })

            # Remove duplicates and sort by severity and amount
            seen = set()
            unique_anomalies = []
            for anomaly in anomalies:
                key = (anomaly['category'], anomaly['amount'], anomaly['severity'])
                if key not in seen:
                    seen.add(key)
                    unique_anomalies.append(anomaly)

            unique_anomalies.sort(key=lambda x: (
                -1 if x['severity'] == 'critical' else (-0.5 if x['severity'] == 'high' else 0),
                -x['amount']
            ))

            return unique_anomalies[:8]  # Return top 8 anomalies

        except Exception as e:
            print(f"Anomaly detection error: {str(e)}")
            return []


class SavingsPlanOptimizer:
    """Robust ensemble model for savings goal planning with outlier handling"""

    @staticmethod
    def _validate_inputs(goal_amount, goal_months, monthly_income):
        """
        Validate and sanitize input parameters

        Returns:
            Tuple of (is_valid, error_message, sanitized_goal_amount, sanitized_goal_months)
        """
        # Type and conversion checks
        try:
            goal_amount = float(goal_amount)
            goal_months = int(goal_months)
        except (ValueError, TypeError):
            return False, "Invalid input types for goal amount or months", None, None

        # Sanity checks
        if goal_amount < 0:
            return False, "Goal amount cannot be negative", None, None

        if goal_months <= 0 or goal_months > 600:  # Max 50 years
            return False, "Goal duration must be between 1 and 600 months", None, None

        # Check for absurdly large values (cap at 10 crore)
        if goal_amount > 100_000_000:
            goal_amount = 100_000_000

        if goal_amount == 0:
            return False, "Goal amount must be greater than 0", None, None

        # Check if goal is absurd relative to income
        required_monthly = goal_amount / goal_months
        if required_monthly > monthly_income * 10:  # More than 10x monthly income per month
            return False, f"Goal is unrealistic (INR {required_monthly:.0f}/month vs income)", None, None

        return True, None, goal_amount, goal_months

    @staticmethod
    def _robust_regression_predict(X, y):
        """
        Use ensemble of robust regression models to predict spending trends

        Returns:
            Predicted trend coefficient
        """
        try:
            # Remove extreme outliers using IQR method
            Q1 = np.percentile(y, 25)
            Q3 = np.percentile(y, 75)
            IQR = Q3 - Q1
            lower_bound = Q1 - 1.5 * IQR
            upper_bound = Q3 + 1.5 * IQR

            # Filter out extreme outliers
            mask = (y >= lower_bound) & (y <= upper_bound)
            X_filtered = X[mask]
            y_filtered = y[mask]

            if len(X_filtered) < 3:
                # Fallback to simple mean if too few points
                return 0

            # Use multiple robust models
            models = [
                HuberRegressor(epsilon=1.35),  # Robust to outliers
                RandomForestRegressor(n_estimators=10, max_depth=3, random_state=42),
            ]

            predictions = []
            for model in models:
                try:
                    model.fit(X_filtered, y_filtered)
                    pred = model.predict(X_filtered)
                    # Calculate trend as slope
                    if len(pred) > 1:
                        trend = np.polyfit(X_filtered.flatten(), pred, 1)[0]
                        predictions.append(trend)
                except:
                    continue

            if predictions:
                # Return median of predictions for robustness
                return np.median(predictions)
            else:
                return 0

        except Exception as e:
            print(f"Robust regression error: {str(e)}")
            return 0
    
    @staticmethod
    def optimize_plan(transactions, goal_amount, goal_months):
        """
        Generate optimized savings plan using Linear Regression
        
        Args:
            transactions: List of transaction dicts
            goal_amount: Target savings amount
            goal_months: Time frame in months
            
        Returns:
            Dict with optimization recommendations or error dict
        """
        try:
            expenses = [t for t in transactions if t.get('type') == 'expense']
            income = [t for t in transactions if t.get('type') == 'income']
            
            if not expenses or not income:
                return {
                    'error': 'Insufficient data',
                    'message': 'Need both income and expense transactions'
                }
            
            # Calculate monthly averages
            monthly_expense = np.mean([float(e.get('amount', 0)) for e in expenses])
            monthly_income = np.mean([float(i.get('amount', 0)) for i in income])
            
            # Validate inputs relative to income
            is_valid, error_msg, validated_amount, validated_months = SavingsPlanOptimizer._validate_inputs(
                goal_amount, goal_months, monthly_income
            )
            
            if not is_valid:
                return {
                    'error': 'Invalid goal parameters',
                    'message': error_msg
                }
            
            goal_amount = validated_amount
            goal_months = validated_months
            
            # Current savings capacity
            monthly_capacity = monthly_income - monthly_expense
            
            if monthly_capacity <= 0:
                monthly_capacity = monthly_income * 0.1  # Assume 10% of income can be saved
            
            # Robust regression for trend analysis (replaces simple linear regression)
            spending_trend = 0
            try:
                if len(expenses) >= 5:
                    df = pd.DataFrame(expenses)
                    df['date'] = pd.to_datetime(df['date'], errors='coerce')
                    df = df.dropna(subset=['date'])  # Remove invalid dates
                    df['amount'] = pd.to_numeric(df['amount'], errors='coerce')
                    df = df.dropna(subset=['amount'])  # Remove invalid amounts

                    if len(df) >= 5:
                        df['day_num'] = (df['date'] - df['date'].min()).dt.days
                        df = df.sort_values('day_num')

                        X = df['day_num'].values.reshape(-1, 1)
                        y = df['amount'].values

                        # Check for NaN or infinite values
                        if np.isfinite(X).all() and np.isfinite(y).all():
                            spending_trend = SavingsPlanOptimizer._robust_regression_predict(X, y)

                            # Cap unrealistic trend values
                            if abs(spending_trend) > 1000:
                                spending_trend = np.sign(spending_trend) * 1000
            except Exception as e:
                print(f"Trend calculation warning: {str(e)}")
                spending_trend = 0
            
            # Calculate required monthly savings
            required_monthly = goal_amount / goal_months
            
            # Recommendations
            recommendations = []
            
            if required_monthly > monthly_capacity:
                deficit = required_monthly - monthly_capacity
                recommendations.append(f'Reduce spending by INR {deficit:.0f}/month to reach goal')
                recommendations.append(f'Cut unnecessary subscriptions (typical: INR 500-2000/month)')
            else:
                surplus = monthly_capacity - required_monthly
                recommendations.append(f'You can save INR {required_monthly:.0f}/month with INR {surplus:.0f} buffer')
                recommendations.append(f'Set up automatic transfer on salary day')
            
            if spending_trend > 0:
                recommendations.append('Spending is increasing - consider budget controls')
            
            return {
                'monthly_income': float(monthly_income),
                'monthly_expense': float(monthly_expense),
                'monthly_capacity': float(monthly_capacity),
                'required_monthly': float(required_monthly),
                'goal_achievable': required_monthly <= monthly_capacity * 1.2,  # 20% buffer
                'spending_trend': 'increasing' if spending_trend > 0 else 'decreasing' if spending_trend < 0 else 'stable',
                'recommendations': recommendations
            }
            
        except Exception as e:
            print(f"Savings plan error: {str(e)}")
            return {
                'error': 'Plan generation failed',
                'message': 'Unable to process savings plan with current data'
            }


class AIInsightGenerator:
    """Random Forest for personalized spending insights and tips"""
    
    @staticmethod
    def generate_tips(transactions):
        """
        Generate personalized tips using ensemble ML models

        Args:
            transactions: List of transaction dicts

        Returns:
            List of personalized tips with confidence scores
        """
        try:
            expenses = [t for t in transactions if t.get('type') == 'expense']
            if len(expenses) < 8:  # Reduced threshold
                return []

            df = pd.DataFrame(expenses)
            df['date'] = pd.to_datetime(df['date'])
            df['amount'] = pd.to_numeric(df['amount'])
            df['day_of_week'] = df['date'].dt.dayofweek
            df['day_of_month'] = df['date'].dt.day
            df['is_weekend'] = df['day_of_week'] >= 5
            df['hour'] = df['date'].dt.hour if hasattr(df['date'].dt, 'hour') else 12  # Default to noon

            # Enhanced feature engineering
            tips = []

            # Category analysis
            category_spending = df.groupby('category')['amount'].agg(['sum', 'count', 'mean', 'std']).reset_index()

            for _, row in category_spending.iterrows():
                category = row['category']
                total_spent = row['sum']
                transaction_count = row['count']
                avg_amount = row['mean']
                std_amount = row['std'] if pd.notna(row['std']) else 0

                # High spending categories
                if total_spent > df['amount'].quantile(0.8):
                    tips.append({
                        'tip': f'Consider reducing spending in {category} (INR {total_spent:.0f} total)',
                        'category': category,
                        'confidence': min(0.9, total_spent / df['amount'].sum()),
                        'type': 'spending_reduction'
                    })

                # Frequent small purchases
                if transaction_count > len(expenses) * 0.3 and avg_amount < df['amount'].quantile(0.25):
                    tips.append({
                        'tip': f'Batch purchases in {category} to reduce transaction frequency',
                        'category': category,
                        'confidence': 0.7,
                        'type': 'consolidation'
                    })

            # Weekend vs weekday analysis
            weekend_spending = df[df['is_weekend']]['amount'].mean()
            weekday_spending = df[~df['is_weekend']]['amount'].mean()

            if weekend_spending > weekday_spending * 1.5:
                tips.append({
                    'tip': 'Weekend spending is significantly higher than weekdays',
                    'category': 'General',
                    'confidence': 0.8,
                    'type': 'timing'
                })

            # Trend analysis using simple moving averages
            if len(df) >= 10:
                df_sorted = df.sort_values('date')
                df_sorted['rolling_avg'] = df_sorted['amount'].rolling(window=5).mean()

                recent_avg = df_sorted['rolling_avg'].tail(5).mean()
                earlier_avg = df_sorted['rolling_avg'].head(5).mean()

                if recent_avg > earlier_avg * 1.2:
                    tips.append({
                        'tip': 'Spending has increased by over 20% recently',
                        'category': 'General',
                        'confidence': 0.85,
                        'type': 'trend'
                    })

            # Sort by confidence and return top tips
            tips.sort(key=lambda x: x['confidence'], reverse=True)
            return tips[:6]  # Return top 6 tips

        except Exception as e:
            print(f"AI tips generation error: {str(e)}")
            return []
            rf.fit(X, y)
            
            # Generate insights
            tips = []
            
            # Analyze category spending
            for cat in df['category'].unique():
                cat_expenses = df[df['category'] == cat]['amount'].values
                if len(cat_expenses) > 0:
                    avg = np.mean(cat_expenses)
                    max_val = np.max(cat_expenses)
                    
                    if max_val > avg * 2:
                        tips.append({
                            'category': cat,
                            'type': 'alert',
                            'message': f'Your {cat} spending varies widely. Consider setting a weekly budget.',
                            'confidence': 0.85
                        })
                    
                    if avg > 1000:
                        tips.append({
                            'category': cat,
                            'type': 'recommendation',
                            'message': f'Look for discounts or alternatives for {cat} - your average is INR {avg:.0f}.',
                            'confidence': 0.75
                        })
            
            # Check weekend vs weekday patterns
            weekend_spend = df[df['is_weekend'] == 1]['amount'].sum()
            weekday_spend = df[df['is_weekend'] == 0]['amount'].sum()
            
            if weekend_spend > weekday_spend * 1.5:
                tips.append({
                    'category': 'General',
                    'type': 'insight',
                    'message': 'You spend significantly more on weekends. Consider setting a weekend budget.',
                    'confidence': 0.8
                })
            
            return tips[:5]  # Top 5 tips
            
        except Exception as e:
            print(f"Insight generation error: {str(e)}")
            return []
