"""
Flask server for ML models
"""
from flask import Flask, request, jsonify
from flask_cors import CORS
from ml_models import (
    MonthlyReportGenerator,
    OverspendingDetector,
    SavingsPlanOptimizer,
    AIInsightGenerator
)
import json

app = Flask(__name__)
CORS(app)


@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'}), 200


@app.route('/api/monthly-report', methods=['POST'])
def monthly_report():
    """Generate monthly report using Prophet"""
    try:
        data = request.get_json()
        transactions = data.get('transactions', [])
        
        result = MonthlyReportGenerator.generate_forecast(transactions)
        
        if result is None:
            return jsonify({
                'error': 'Insufficient data for forecast',
                'message': 'Need at least 10 transactions to generate forecast'
            }), 400
        
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/detect-overspending', methods=['POST'])
def detect_overspending():
    """Detect spending anomalies using Isolation Forest"""
    try:
        data = request.get_json()
        transactions = data.get('transactions', [])
        
        anomalies = OverspendingDetector.detect_anomalies(transactions)
        
        return jsonify({'anomalies': anomalies}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/savings-plan', methods=['POST'])
def savings_plan():
    """Generate optimized savings plan using Linear Regression"""
    try:
        data = request.get_json()
        transactions = data.get('transactions', [])
        goal_amount = data.get('goalAmount', 0)
        goal_months = data.get('goalMonths', 12)
        
        result = SavingsPlanOptimizer.optimize_plan(
            transactions, 
            goal_amount, 
            goal_months
        )
        
        # Check if result contains error
        if 'error' in result:
            return jsonify(result), 400
        
        return jsonify(result), 200
    except Exception as e:
        return jsonify({
            'error': 'Server error',
            'message': str(e)
        }), 500


@app.route('/api/ai-tips', methods=['POST'])
def ai_tips():
    """Generate personalized tips using Random Forest"""
    try:
        data = request.get_json()
        transactions = data.get('transactions', [])
        
        tips = AIInsightGenerator.generate_tips(transactions)
        
        return jsonify({'tips': tips}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(port=5000, debug=False)
