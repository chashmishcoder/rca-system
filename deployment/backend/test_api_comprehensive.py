"""
Comprehensive API Test Suite
=============================

Tests all API endpoints with various scenarios.
"""

import requests
import time
import json
from typing import Dict, Any
import sys

# API Configuration
BASE_URL = "http://localhost:8000"
TEST_TIMEOUT = 600  # 10 minutes for RCA completion

# ANSI color codes for pretty output
GREEN = '\033[92m'
RED = '\033[91m'
YELLOW = '\033[93m'
BLUE = '\033[94m'
RESET = '\033[0m'

def print_header(text: str):
    """Print colored header"""
    print(f"\n{BLUE}{'='*70}{RESET}")
    print(f"{BLUE}{text}{RESET}")
    print(f"{BLUE}{'='*70}{RESET}")

def print_success(text: str):
    """Print success message"""
    print(f"{GREEN}✅ {text}{RESET}")

def print_error(text: str):
    """Print error message"""
    print(f"{RED}❌ {text}{RESET}")

def print_info(text: str):
    """Print info message"""
    print(f"{YELLOW}ℹ️  {text}{RESET}")


class APITester:
    """Comprehensive API testing class"""
    
    def __init__(self, base_url: str):
        self.base_url = base_url
        self.test_results = {
            'passed': 0,
            'failed': 0,
            'errors': []
        }
    
    def test_root_endpoint(self) -> bool:
        """Test 1: Root endpoint"""
        print_header("Test 1: Root Endpoint")
        
        try:
            response = requests.get(f"{self.base_url}/")
            
            if response.status_code == 200:
                data = response.json()
                print_success("Root endpoint responding")
                print(f"   Service: {data.get('service')}")
                print(f"   Version: {data.get('version')}")
                print(f"   Status: {data.get('status')}")
                self.test_results['passed'] += 1
                return True
            else:
                print_error(f"Root endpoint failed: {response.status_code}")
                self.test_results['failed'] += 1
                return False
                
        except Exception as e:
            print_error(f"Root endpoint error: {e}")
            self.test_results['failed'] += 1
            self.test_results['errors'].append(str(e))
            return False
    
    def test_health_endpoint(self) -> bool:
        """Test 2: Health check endpoint"""
        print_header("Test 2: Health Check Endpoint")
        
        try:
            response = requests.get(f"{self.base_url}/api/agents/health")
            
            if response.status_code == 200:
                data = response.json()
                print_success("Health endpoint responding")
                print(f"   Overall Status: {data.get('status')}")
                print(f"   LLM Status: {data.get('llm_status')}")
                print(f"   KG Status: {data.get('kg_status')}")
                print(f"   Agents: {data.get('agents')}")
                self.test_results['passed'] += 1
                return True
            else:
                print_error(f"Health endpoint failed: {response.status_code}")
                self.test_results['failed'] += 1
                return False
                
        except Exception as e:
            print_error(f"Health endpoint error: {e}")
            self.test_results['failed'] += 1
            self.test_results['errors'].append(str(e))
            return False
    
    def test_rca_workflow(self) -> Dict[str, Any]:
        """Test 3: Complete RCA workflow (submit → status → result)"""
        print_header("Test 3: Complete RCA Workflow")
        
        # Submit anomaly
        print_info("Step 1: Submitting anomaly for analysis...")
        
        anomaly_data = {
            "anomaly_id": "api_test_anomaly_1",
            "timestamp": "2025-11-06T15:00:00",
            "reconstruction_error": 0.3892,
            "top_contributing_features": [
                {"feature_name": "Rotational speed [rpm]", "error": 0.1923},
                {"feature_name": "Torque [Nm]", "error": 0.1456},
                {"feature_name": "Tool wear [min]", "error": 0.0513}
            ],
            "severity": "high",
            "metadata": {
                "machine_id": "TEST_M001",
                "test_run": True
            }
        }
        
        try:
            response = requests.post(
                f"{self.base_url}/api/rca/analyze",
                json=anomaly_data
            )
            
            if response.status_code != 200:
                print_error(f"Failed to submit anomaly: {response.status_code}")
                self.test_results['failed'] += 1
                return None
            
            submit_result = response.json()
            workflow_id = submit_result['workflow_id']
            
            print_success(f"Anomaly submitted successfully")
            print(f"   Workflow ID: {workflow_id}")
            print(f"   Status: {submit_result['status']}")
            print(f"   Estimated Time: {submit_result.get('estimated_time', 'N/A')}")
            
            # Poll for completion
            print_info("Step 2: Monitoring workflow status...")
            
            start_time = time.time()
            poll_count = 0
            
            while True:
                if time.time() - start_time > TEST_TIMEOUT:
                    print_error(f"Workflow timeout after {TEST_TIMEOUT}s")
                    self.test_results['failed'] += 1
                    return None
                
                status_response = requests.get(
                    f"{self.base_url}/api/rca/status/{workflow_id}"
                )
                
                if status_response.status_code != 200:
                    print_error(f"Failed to get status: {status_response.status_code}")
                    self.test_results['failed'] += 1
                    return None
                
                status = status_response.json()
                poll_count += 1
                
                print(f"   Poll #{poll_count}: {status['status']} ({int(time.time() - start_time)}s elapsed)")
                
                if status['status'] == 'completed':
                    print_success(f"Workflow completed in {int(time.time() - start_time)}s")
                    break
                elif status['status'] == 'failed':
                    print_error(f"Workflow failed: {status.get('error')}")
                    self.test_results['failed'] += 1
                    return None
                
                time.sleep(15)  # Poll every 15 seconds
            
            # Get results
            print_info("Step 3: Retrieving RCA results...")
            
            result_response = requests.get(
                f"{self.base_url}/api/rca/result/{workflow_id}"
            )
            
            if result_response.status_code != 200:
                print_error(f"Failed to get results: {result_response.status_code}")
                self.test_results['failed'] += 1
                return None
            
            result = result_response.json()
            
            print_success("RCA results retrieved successfully")
            print(f"\n   📊 DIAGNOSTIC:")
            print(f"      Symptoms: {len(result['symptoms'])}")
            print(f"      Severity: {result['severity'].upper()}")
            print(f"      Confidence: {result['diagnostic_confidence']:.2f}")
            
            print(f"\n   🧠 REASONING:")
            print(f"      Root Cause: {result['root_cause']}")
            print(f"      Confidence: {result['reasoning_confidence']:.2f}")
            
            print(f"\n   📋 PLANNING:")
            print(f"      Actions: {len(result['recommended_actions'])}")
            print(f"      Confidence: {result['planning_confidence']:.2f}")
            
            self.test_results['passed'] += 1
            return result
            
        except Exception as e:
            print_error(f"RCA workflow error: {e}")
            self.test_results['failed'] += 1
            self.test_results['errors'].append(str(e))
            return None
    
    def test_feedback_submission(self, workflow_id: str, anomaly_id: str) -> bool:
        """Test 4: Feedback submission"""
        print_header("Test 4: Feedback Submission")
        
        if not workflow_id:
            print_error("No workflow ID available (skip feedback test)")
            return False
        
        feedback_data = {
            "workflow_id": workflow_id,
            "anomaly_id": anomaly_id,
            "feedback_type": "correct",
            "actual_root_cause": "Test feedback",
            "diagnostic_accuracy": "correct",
            "reasoning_accuracy": "correct",
            "planning_effectiveness": "effective",
            "comments": "API test feedback - automated test run"
        }
        
        try:
            response = requests.post(
                f"{self.base_url}/api/rca/feedback",
                json=feedback_data
            )
            
            if response.status_code == 200:
                data = response.json()
                print_success("Feedback submitted successfully")
                print(f"   Feedback Processed: {data.get('feedback_processed')}")
                print(f"   Learning Updates: {len(data.get('learning_updates', []))}")
                
                if data.get('learning_updates'):
                    print(f"   Sample Update:")
                    update = data['learning_updates'][0]
                    print(f"      Agent: {update.get('agent')}")
                    print(f"      Type: {update.get('update_type')}")
                    print(f"      Adjustment: {update.get('confidence_adjustment', 0):+.2f}")
                
                self.test_results['passed'] += 1
                return True
            else:
                print_error(f"Feedback submission failed: {response.status_code}")
                print(f"   Response: {response.text}")
                self.test_results['failed'] += 1
                return False
                
        except Exception as e:
            print_error(f"Feedback submission error: {e}")
            self.test_results['failed'] += 1
            self.test_results['errors'].append(str(e))
            return False
    
    def test_error_handling(self) -> bool:
        """Test 5: Error handling (invalid requests)"""
        print_header("Test 5: Error Handling")
        
        tests_passed = 0
        tests_total = 3
        
        # Test 5a: Invalid workflow ID
        print_info("Test 5a: Invalid workflow ID...")
        try:
            response = requests.get(f"{self.base_url}/api/rca/status/invalid-id-12345")
            if response.status_code == 404:
                print_success("Correctly returns 404 for invalid workflow ID")
                tests_passed += 1
            else:
                print_error(f"Expected 404, got {response.status_code}")
        except Exception as e:
            print_error(f"Error: {e}")
        
        # Test 5b: Missing required fields
        print_info("Test 5b: Missing required fields...")
        try:
            response = requests.post(
                f"{self.base_url}/api/rca/analyze",
                json={"anomaly_id": "test"}  # Missing reconstruction_error
            )
            if response.status_code == 422:
                print_success("Correctly returns 422 for missing fields")
                tests_passed += 1
            else:
                print_error(f"Expected 422, got {response.status_code}")
        except Exception as e:
            print_error(f"Error: {e}")
        
        # Test 5c: Get result before completion
        print_info("Test 5c: Get result before completion...")
        try:
            # Submit a workflow
            response = requests.post(
                f"{self.base_url}/api/rca/analyze",
                json={
                    "reconstruction_error": 0.5,
                    "top_contributing_features": [
                        {"feature_name": "test", "error": 0.1}
                    ]
                }
            )
            workflow_id = response.json()['workflow_id']
            
            # Immediately try to get result
            response = requests.get(f"{self.base_url}/api/rca/result/{workflow_id}")
            if response.status_code == 400:
                print_success("Correctly returns 400 for incomplete workflow")
                tests_passed += 1
            else:
                print_error(f"Expected 400, got {response.status_code}")
        except Exception as e:
            print_error(f"Error: {e}")
        
        if tests_passed == tests_total:
            print_success(f"Error handling tests: {tests_passed}/{tests_total} passed")
            self.test_results['passed'] += 1
            return True
        else:
            print_error(f"Error handling tests: {tests_passed}/{tests_total} passed")
            self.test_results['failed'] += 1
            return False
    
    def print_summary(self):
        """Print test summary"""
        print_header("Test Summary")
        
        total = self.test_results['passed'] + self.test_results['failed']
        success_rate = (self.test_results['passed'] / total * 100) if total > 0 else 0
        
        print(f"\n   Total Tests: {total}")
        print(f"   {GREEN}Passed: {self.test_results['passed']}{RESET}")
        print(f"   {RED}Failed: {self.test_results['failed']}{RESET}")
        print(f"   Success Rate: {success_rate:.1f}%")
        
        if self.test_results['errors']:
            print(f"\n   {RED}Errors Encountered:{RESET}")
            for error in self.test_results['errors']:
                print(f"      • {error}")
        
        if self.test_results['failed'] == 0:
            print(f"\n   {GREEN}🎉 ALL TESTS PASSED!{RESET}")
        else:
            print(f"\n   {YELLOW}⚠️  Some tests failed. Review errors above.{RESET}")


def main():
    """Run all API tests"""
    print_header("Multi-Agent RCA System - Comprehensive API Test Suite")
    
    print_info("Testing API at: " + BASE_URL)
    print_info("Make sure the API server is running: python rca_api.py\n")
    
    # Check if API is reachable
    try:
        requests.get(BASE_URL, timeout=5)
    except Exception as e:
        print_error(f"Cannot reach API at {BASE_URL}")
        print_error(f"Error: {e}")
        print_info("Start the API server with: python rca_api.py")
        sys.exit(1)
    
    # Initialize tester
    tester = APITester(BASE_URL)
    
    # Run tests
    tester.test_root_endpoint()
    tester.test_health_endpoint()
    
    # Run RCA workflow and get workflow_id
    result = tester.test_rca_workflow()
    
    if result:
        workflow_id = result.get('workflow_id')
        anomaly_id = result.get('anomaly_id')
        tester.test_feedback_submission(workflow_id, anomaly_id)
    
    tester.test_error_handling()
    
    # Print summary
    tester.print_summary()
    
    # Exit with appropriate code
    sys.exit(0 if tester.test_results['failed'] == 0 else 1)


if __name__ == "__main__":
    main()
