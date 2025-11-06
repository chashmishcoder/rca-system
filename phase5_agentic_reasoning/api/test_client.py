"""
API Client Example - Multi-Agent RCA System
============================================

This script demonstrates how to interact with the RCA API.
"""

import requests
import time
import json
from typing import Dict, Any

class RCAClient:
    """Client for interacting with the Multi-Agent RCA API"""
    
    def __init__(self, base_url: str = "http://localhost:8000"):
        self.base_url = base_url
        
    def analyze_anomaly(self, anomaly_data: Dict[str, Any]) -> str:
        """Submit an anomaly for RCA analysis"""
        response = requests.post(
            f"{self.base_url}/api/rca/analyze",
            json=anomaly_data
        )
        response.raise_for_status()
        result = response.json()
        return result["workflow_id"]
    
    def get_status(self, workflow_id: str) -> Dict[str, Any]:
        """Get workflow status"""
        response = requests.get(
            f"{self.base_url}/api/rca/status/{workflow_id}"
        )
        response.raise_for_status()
        return response.json()
    
    def get_result(self, workflow_id: str) -> Dict[str, Any]:
        """Get RCA result"""
        response = requests.get(
            f"{self.base_url}/api/rca/result/{workflow_id}"
        )
        response.raise_for_status()
        return response.json()
    
    def submit_feedback(self, feedback_data: Dict[str, Any]) -> Dict[str, Any]:
        """Submit feedback for learning"""
        response = requests.post(
            f"{self.base_url}/api/rca/feedback",
            json=feedback_data
        )
        response.raise_for_status()
        return response.json()
    
    def check_health(self) -> Dict[str, Any]:
        """Check API health"""
        response = requests.get(f"{self.base_url}/api/agents/health")
        response.raise_for_status()
        return response.json()
    
    def wait_for_completion(self, workflow_id: str, poll_interval: int = 10, timeout: int = 600) -> Dict[str, Any]:
        """Wait for workflow to complete"""
        start_time = time.time()
        
        while True:
            if time.time() - start_time > timeout:
                raise TimeoutError(f"Workflow {workflow_id} timed out after {timeout}s")
            
            status = self.get_status(workflow_id)
            
            if status['status'] == 'completed':
                return status
            elif status['status'] == 'failed':
                raise Exception(f"Workflow failed: {status.get('error')}")
            
            print(f"Status: {status['status']}... waiting {poll_interval}s")
            time.sleep(poll_interval)


def main():
    """Example usage of the RCA API client"""
    
    print("=" * 70)
    print("Multi-Agent RCA System - API Client Example")
    print("=" * 70)
    
    # Initialize client
    client = RCAClient()
    
    # Check health
    print("\n1. Checking API health...")
    try:
        health = client.check_health()
        print(f"   Status: {health['status']}")
        print(f"   LLM: {health['llm_status']}")
        print(f"   KG: {health['kg_status']}")
    except Exception as e:
        print(f"   ❌ Health check failed: {e}")
        print("   Make sure the API is running: python rca_api.py")
        return
    
    # Submit anomaly
    print("\n2. Submitting anomaly for analysis...")
    anomaly_data = {
        "anomaly_id": "test_anomaly_api_1",
        "timestamp": "2025-11-06T14:00:00",
        "reconstruction_error": 0.4397,
        "top_contributing_features": [
            {"feature_name": "Rotational speed [rpm]", "error": 0.2156},
            {"feature_name": "Torque [Nm]", "error": 0.1534},
            {"feature_name": "Tool wear [min]", "error": 0.0892}
        ],
        "severity": "high",
        "metadata": {
            "machine_id": "M001",
            "process_type": "milling"
        }
    }
    
    try:
        workflow_id = client.analyze_anomaly(anomaly_data)
        print(f"   Workflow started: {workflow_id}")
    except Exception as e:
        print(f"   ❌ Failed to submit anomaly: {e}")
        return
    
    # Wait for completion
    print("\n3. Waiting for RCA completion...")
    try:
        status = client.wait_for_completion(workflow_id, poll_interval=15)
        print(f"   ✅ Workflow completed!")
        print(f"   Root Cause: {status.get('root_cause', 'N/A')}")
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return
    
    # Get full results
    print("\n4. Retrieving full RCA results...")
    try:
        result = client.get_result(workflow_id)
        
        print(f"\n   📊 DIAGNOSTIC RESULTS:")
        print(f"      Symptoms: {len(result['symptoms'])}")
        for symptom in result['symptoms'][:3]:
            print(f"        • {symptom}")
        print(f"      Severity: {result['severity'].upper()}")
        print(f"      Affected: {', '.join(result['affected_entities'][:3])}")
        print(f"      Confidence: {result['diagnostic_confidence']:.2f}")
        
        print(f"\n   🧠 REASONING RESULTS:")
        print(f"      Root Cause: {result['root_cause']}")
        print(f"      Causal Chain: {' → '.join(result['causal_chain'][:3])}")
        print(f"      Hypotheses: {len(result['causal_hypotheses'])}")
        print(f"      Confidence: {result['reasoning_confidence']:.2f}")
        
        print(f"\n   📋 PLANNING RESULTS:")
        print(f"      Actions: {len(result['recommended_actions'])}")
        print(f"      Top Actions:")
        for action in result['recommended_actions'][:3]:
            priority = action.get('priority', 'N/A').upper()
            name = action.get('action_name', 'N/A')
            print(f"        • [{priority}] {name}")
        print(f"      Confidence: {result['planning_confidence']:.2f}")
        
        if result.get('final_explanation'):
            preview = result['final_explanation'][:200] + "..."
            print(f"\n   📝 EXPLANATION (preview):")
            print(f"      {preview}")
            print(f"      Full: {result['explanation_file']}")
        
    except Exception as e:
        print(f"   ❌ Failed to get results: {e}")
        return
    
    # Submit feedback
    print("\n5. Submitting feedback for learning...")
    feedback_data = {
        "workflow_id": workflow_id,
        "anomaly_id": result['anomaly_id'],
        "feedback_type": "correct",
        "actual_root_cause": result['root_cause'],
        "diagnostic_accuracy": "correct",
        "reasoning_accuracy": "correct",
        "planning_effectiveness": "effective",
        "comments": "API test - diagnosis was accurate"
    }
    
    try:
        learning = client.submit_feedback(feedback_data)
        print(f"   ✅ Feedback processed!")
        print(f"   Learning Updates: {len(learning['learning_updates'])}")
        
        if learning['learning_updates']:
            print(f"   Updates:")
            for update in learning['learning_updates'][:3]:
                agent = update.get('agent', 'N/A')
                update_type = update.get('update_type', 'N/A')
                desc = update.get('description', 'N/A')
                print(f"      • [{agent}] {update_type}: {desc}")
        
        if learning['confidence_adjustments']:
            print(f"   Confidence Adjustments:")
            for agent, adjustment in learning['confidence_adjustments'].items():
                print(f"      • {agent}: {adjustment:+.2f}")
                
    except Exception as e:
        print(f"   ❌ Failed to submit feedback: {e}")
    
    print("\n" + "=" * 70)
    print("✅ API Client Example Completed Successfully!")
    print("=" * 70)


if __name__ == "__main__":
    main()
