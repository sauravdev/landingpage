#!/usr/bin/env python3
"""
Backend API Testing for TransformBuddy.AI Webinar Registration System
Tests all API endpoints with comprehensive scenarios
"""

import requests
import json
import time
from datetime import datetime
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv('/app/frontend/.env')

# Get backend URL from frontend environment
BACKEND_URL = os.getenv('REACT_APP_BACKEND_URL')
if not BACKEND_URL:
    print("❌ ERROR: REACT_APP_BACKEND_URL not found in frontend/.env")
    exit(1)

API_BASE_URL = f"{BACKEND_URL}/api"
print(f"🔗 Testing API at: {API_BASE_URL}")

class WebinarAPITester:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        })
        self.test_results = {
            'webinar_register': {'passed': 0, 'failed': 0, 'details': []},
            'webinar_stats': {'passed': 0, 'failed': 0, 'details': []},
            'webinar_registrations': {'passed': 0, 'failed': 0, 'details': []},
            'overall': {'critical_failures': 0, 'minor_issues': 0}
        }
        
    def log_result(self, endpoint, test_name, success, message, is_critical=True):
        """Log test result"""
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {endpoint} - {test_name}: {message}")
        
        if success:
            self.test_results[endpoint]['passed'] += 1
        else:
            self.test_results[endpoint]['failed'] += 1
            if is_critical:
                self.test_results['overall']['critical_failures'] += 1
            else:
                self.test_results['overall']['minor_issues'] += 1
                
        self.test_results[endpoint]['details'].append({
            'test': test_name,
            'success': success,
            'message': message,
            'critical': is_critical
        })

    def test_webinar_register_endpoint(self):
        """Test /api/webinar-register POST endpoint"""
        print("\n🧪 Testing Webinar Registration Endpoint")
        print("=" * 50)
        
        # Test 1: Valid registration
        valid_data = {
            "fullName": "Rajesh Kumar",
            "email": "rajesh.kumar@example.com",
            "whatsapp": "+91-9876543210",
            "referralSource": "LinkedIn"
        }
        
        try:
            response = self.session.post(f"{API_BASE_URL}/webinar-register", json=valid_data)
            
            if response.status_code == 200:
                data = response.json()
                if data.get('status') == 'success' and 'message' in data:
                    self.log_result('webinar_register', 'Valid Registration', True, 
                                  f"Registration successful with message: {data['message']}")
                else:
                    self.log_result('webinar_register', 'Valid Registration', False, 
                                  f"Invalid response format: {data}")
            else:
                self.log_result('webinar_register', 'Valid Registration', False, 
                              f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_result('webinar_register', 'Valid Registration', False, 
                          f"Request failed: {str(e)}")

        # Test 2: Invalid email format
        invalid_email_data = {
            "fullName": "Test User",
            "email": "invalid-email",
            "whatsapp": "+91-9876543210",
            "referralSource": "Google"
        }
        
        try:
            response = self.session.post(f"{API_BASE_URL}/webinar-register", json=invalid_email_data)
            
            if response.status_code == 422:  # Validation error expected
                self.log_result('webinar_register', 'Invalid Email Validation', True, 
                              "Correctly rejected invalid email format")
            else:
                self.log_result('webinar_register', 'Invalid Email Validation', False, 
                              f"Should reject invalid email, got HTTP {response.status_code}", False)
                
        except Exception as e:
            self.log_result('webinar_register', 'Invalid Email Validation', False, 
                          f"Request failed: {str(e)}", False)

        # Test 3: Missing required fields
        incomplete_data = {
            "fullName": "Test User",
            "email": "test@example.com"
            # Missing whatsapp field
        }
        
        try:
            response = self.session.post(f"{API_BASE_URL}/webinar-register", json=incomplete_data)
            
            if response.status_code == 422:  # Validation error expected
                self.log_result('webinar_register', 'Missing Fields Validation', True, 
                              "Correctly rejected incomplete data")
            else:
                self.log_result('webinar_register', 'Missing Fields Validation', False, 
                              f"Should reject incomplete data, got HTTP {response.status_code}", False)
                
        except Exception as e:
            self.log_result('webinar_register', 'Missing Fields Validation', False, 
                          f"Request failed: {str(e)}", False)

        # Test 4: Another valid registration for stats testing
        valid_data_2 = {
            "fullName": "Priya Sharma",
            "email": "priya.sharma@example.com",
            "whatsapp": "+91-8765432109",
            "referralSource": "Facebook"
        }
        
        try:
            response = self.session.post(f"{API_BASE_URL}/webinar-register", json=valid_data_2)
            
            if response.status_code == 200:
                data = response.json()
                if data.get('status') == 'success':
                    self.log_result('webinar_register', 'Second Valid Registration', True, 
                                  "Second registration successful for stats testing")
                else:
                    self.log_result('webinar_register', 'Second Valid Registration', False, 
                                  f"Invalid response: {data}")
            else:
                self.log_result('webinar_register', 'Second Valid Registration', False, 
                              f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_result('webinar_register', 'Second Valid Registration', False, 
                          f"Request failed: {str(e)}")

    def test_webinar_stats_endpoint(self):
        """Test /api/webinar-stats GET endpoint"""
        print("\n📊 Testing Webinar Stats Endpoint")
        print("=" * 50)
        
        try:
            response = self.session.get(f"{API_BASE_URL}/webinar-stats")
            
            if response.status_code == 200:
                data = response.json()
                
                # Check required fields
                required_fields = ['total_registrations', 'available_seats', 'referral_breakdown']
                missing_fields = [field for field in required_fields if field not in data]
                
                if not missing_fields:
                    total_reg = data['total_registrations']
                    available_seats = data['available_seats']
                    referral_breakdown = data['referral_breakdown']
                    
                    # Validate calculations
                    expected_available = max(0, 100 - total_reg)
                    if available_seats == expected_available:
                        self.log_result('webinar_stats', 'Stats Retrieval', True, 
                                      f"Stats retrieved: {total_reg} registrations, {available_seats} available seats")
                        
                        # Check referral breakdown format
                        if isinstance(referral_breakdown, list):
                            self.log_result('webinar_stats', 'Referral Breakdown Format', True, 
                                          f"Referral breakdown has {len(referral_breakdown)} sources")
                        else:
                            self.log_result('webinar_stats', 'Referral Breakdown Format', False, 
                                          "Referral breakdown should be a list", False)
                    else:
                        self.log_result('webinar_stats', 'Available Seats Calculation', False, 
                                      f"Available seats calculation wrong: got {available_seats}, expected {expected_available}")
                else:
                    self.log_result('webinar_stats', 'Stats Response Format', False, 
                                  f"Missing required fields: {missing_fields}")
            else:
                self.log_result('webinar_stats', 'Stats Retrieval', False, 
                              f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_result('webinar_stats', 'Stats Retrieval', False, 
                          f"Request failed: {str(e)}")

    def test_webinar_registrations_endpoint(self):
        """Test /api/webinar-registrations GET endpoint (admin view)"""
        print("\n👥 Testing Webinar Registrations Admin Endpoint")
        print("=" * 50)
        
        try:
            response = self.session.get(f"{API_BASE_URL}/webinar-registrations")
            
            if response.status_code == 200:
                data = response.json()
                
                if isinstance(data, list):
                    self.log_result('webinar_registrations', 'Registrations Retrieval', True, 
                                  f"Retrieved {len(data)} registrations")
                    
                    if len(data) > 0:
                        # Check first registration format
                        first_reg = data[0]
                        required_fields = ['id', 'fullName', 'email', 'whatsapp', 'timestamp']
                        missing_fields = [field for field in required_fields if field not in first_reg]
                        
                        if not missing_fields:
                            self.log_result('webinar_registrations', 'Registration Format', True, 
                                          "Registration objects have correct format")
                            
                            # Check if sorted by timestamp (newest first)
                            if len(data) > 1:
                                first_time = datetime.fromisoformat(data[0]['timestamp'].replace('Z', '+00:00'))
                                second_time = datetime.fromisoformat(data[1]['timestamp'].replace('Z', '+00:00'))
                                
                                if first_time >= second_time:
                                    self.log_result('webinar_registrations', 'Timestamp Sorting', True, 
                                                  "Registrations sorted by timestamp (newest first)")
                                else:
                                    self.log_result('webinar_registrations', 'Timestamp Sorting', False, 
                                                  "Registrations not properly sorted by timestamp", False)
                        else:
                            self.log_result('webinar_registrations', 'Registration Format', False, 
                                          f"Missing required fields in registration: {missing_fields}")
                    else:
                        self.log_result('webinar_registrations', 'Empty Registrations', True, 
                                      "No registrations found (empty list is valid)")
                else:
                    self.log_result('webinar_registrations', 'Response Format', False, 
                                  "Response should be a list of registrations")
            else:
                self.log_result('webinar_registrations', 'Registrations Retrieval', False, 
                              f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_result('webinar_registrations', 'Registrations Retrieval', False, 
                          f"Request failed: {str(e)}")

    def test_basic_connectivity(self):
        """Test basic API connectivity"""
        print("\n🔌 Testing Basic API Connectivity")
        print("=" * 50)
        
        try:
            response = self.session.get(f"{API_BASE_URL}/")
            
            if response.status_code == 200:
                data = response.json()
                if data.get('message') == 'Hello World':
                    print("✅ API connectivity successful")
                    return True
                else:
                    print(f"❌ Unexpected response: {data}")
                    return False
            else:
                print(f"❌ API connectivity failed: HTTP {response.status_code}")
                return False
                
        except Exception as e:
            print(f"❌ API connectivity failed: {str(e)}")
            return False

    def run_all_tests(self):
        """Run all API tests"""
        print("🚀 Starting TransformBuddy.AI Backend API Tests")
        print("=" * 60)
        
        # Test basic connectivity first
        if not self.test_basic_connectivity():
            print("\n❌ CRITICAL: Basic API connectivity failed. Stopping tests.")
            return
        
        # Run all endpoint tests
        self.test_webinar_register_endpoint()
        self.test_webinar_stats_endpoint()
        self.test_webinar_registrations_endpoint()
        
        # Print summary
        self.print_summary()

    def print_summary(self):
        """Print test summary"""
        print("\n" + "=" * 60)
        print("📋 TEST SUMMARY")
        print("=" * 60)
        
        total_passed = 0
        total_failed = 0
        
        for endpoint, results in self.test_results.items():
            if endpoint == 'overall':
                continue
                
            passed = results['passed']
            failed = results['failed']
            total_passed += passed
            total_failed += failed
            
            status = "✅" if failed == 0 else "❌"
            print(f"{status} {endpoint.upper()}: {passed} passed, {failed} failed")
            
            # Show critical failures
            critical_failures = [d for d in results['details'] if not d['success'] and d['critical']]
            if critical_failures:
                for failure in critical_failures:
                    print(f"   🔴 CRITICAL: {failure['test']} - {failure['message']}")
        
        print(f"\n📊 OVERALL: {total_passed} passed, {total_failed} failed")
        print(f"🔴 Critical failures: {self.test_results['overall']['critical_failures']}")
        print(f"🟡 Minor issues: {self.test_results['overall']['minor_issues']}")
        
        if self.test_results['overall']['critical_failures'] == 0:
            print("\n🎉 All critical functionality is working!")
        else:
            print(f"\n⚠️  {self.test_results['overall']['critical_failures']} critical issues need attention")

if __name__ == "__main__":
    tester = WebinarAPITester()
    tester.run_all_tests()