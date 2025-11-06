"""
Workflow Loader - Loads RCA workflow components from parent directory
"""
import os
import sys
import json
from pathlib import Path

# Add parent directories to path
current_dir = Path(__file__).parent
parent_dir = current_dir.parent
grandparent_dir = parent_dir.parent

sys.path.insert(0, str(parent_dir))
sys.path.insert(0, str(grandparent_dir))

# Try to import workflow components
try:
    # Import LangChain/LangGraph components
    from typing import TypedDict, List, Dict, Any, Optional
    from langchain_google_genai import ChatGoogleGenerativeAI
    from langgraph.graph import StateGraph, END
    from langgraph.checkpoint.memory import MemorySaver
    
    # Load environment
    import os
    GOOGLE_API_KEY = os.getenv('GOOGLE_API_KEY', '')
    
    # Define AgentState
    class AgentState(TypedDict):
        """State for the multi-agent RCA workflow"""
        anomaly_id: str
        anomaly_data: Dict[str, Any]
        symptoms: List[str]
        severity: str
        affected_entities: List[str]
        diagnostic_confidence: float
        diagnostic_reasoning: str
        causal_hypotheses: List[str]
        root_cause: str
        causal_chain: List[str]
        reasoning_evidence: List[str]
        reasoning_confidence: float
        reasoning_steps: str
        remediation_plan: Dict[str, Any]
        recommended_actions: List[Dict[str, Any]]
        planning_rationale: str
        planning_confidence: float
        feedback_summary: Optional[Dict[str, Any]]
        learning_updates: Optional[List[Dict[str, Any]]]
        messages: List[Any]
        workflow_id: str
        current_agent: str
    
    # Initialize LLM
    llm = ChatGoogleGenerativeAI(
        model="gemini-1.5-pro",
        google_api_key=GOOGLE_API_KEY,
        temperature=0.3
    )
    
    # Load global context
    BASE_DIR = str(grandparent_dir)
    PHASE5_DIR = str(parent_dir)
    KG_DIR = os.path.join(grandparent_dir, 'knowledge_graph')
    
    # Load knowledge graph components
    GLOBAL_CONTEXT = {}
    
    # Try to load mappings
    mappings_path = os.path.join(KG_DIR, 'mappings', 'semantic_mappings.json')
    if os.path.exists(mappings_path):
        with open(mappings_path, 'r') as f:
            GLOBAL_CONTEXT['kg_mappings'] = json.load(f)
    
    # Try to load SWRL rules
    swrl_path = os.path.join(KG_DIR, 'rules', 'swrl_rules.json')
    if os.path.exists(swrl_path):
        with open(swrl_path, 'r') as f:
            GLOBAL_CONTEXT['swrl_rules'] = json.load(f).get('rules', [])
    
    # Try to load cross-domain bridges
    bridges_path = os.path.join(parent_dir, 'phase4_kg_embeddings', 'mappings', 'cross_domain_bridges.json')
    if os.path.exists(bridges_path):
        with open(bridges_path, 'r') as f:
            GLOBAL_CONTEXT['cross_domain_bridges'] = json.load(f)
    
    # Create a mock workflow app for API
    # In production, this would load the actual compiled workflow
    class MockWorkflowApp:
        def invoke(self, state: Dict[str, Any], config: Dict = None) -> Dict[str, Any]:
            """Mock workflow execution - returns a simple result"""
            import time
            import random
            
            # Simulate processing time
            time.sleep(2)
            
            # Generate mock results
            result = {
                **state,
                'symptoms': [
                    'High reconstruction error detected',
                    'Abnormal sensor readings',
                    'System performance degradation'
                ],
                'severity': 'high',
                'affected_entities': ['Sensor', 'Processing Unit', 'Control System'],
                'diagnostic_confidence': 0.88,
                'diagnostic_reasoning': 'Multiple anomalies detected in system parameters',
                'root_cause': 'Sensor calibration drift leading to control system instability',
                'reasoning_confidence': 0.85,
                'reasoning_steps': 'Analyzed sensor data patterns and correlated with system behavior',
                'recommended_actions': [
                    {
                        'action': 'Recalibrate sensors',
                        'priority': 'high',
                        'estimated_time': '30 minutes',
                        'description': 'Perform full sensor recalibration procedure'
                    },
                    {
                        'action': 'Verify control system parameters',
                        'priority': 'high',
                        'estimated_time': '15 minutes',
                        'description': 'Check and adjust control system settings'
                    },
                    {
                        'action': 'Monitor system for 24 hours',
                        'priority': 'medium',
                        'estimated_time': '24 hours',
                        'description': 'Continuous monitoring to ensure stability'
                    }
                ],
                'planning_confidence': 0.90,
                'planning_rationale': 'Actions prioritized based on impact and urgency',
                'current_agent': 'completed'
            }
            
            return result
        
        def stream(self, state: Dict[str, Any], config: Dict = None):
            """Mock stream method that yields workflow results"""
            # Simulate streaming by yielding final result
            final_result = self.invoke(state, config)
            yield {"completed": final_result}
    
    # Create mock app instance
    app = MockWorkflowApp()
    
    # Mock learning agent
    def learning_agent(state: Dict[str, Any]) -> Dict[str, Any]:
        """Mock learning agent"""
        learning_updates = [
            {
                'agent': 'diagnostic',
                'update_type': 'pattern',
                'description': 'Updated pattern recognition for similar anomalies',
                'confidence_adjustment': 0.05
            }
        ]
        
        return {
            **state,
            'learning_updates': learning_updates
        }
    
    print("✅ Workflow components loaded successfully")
    
except Exception as e:
    print(f"⚠️  Warning: Could not load full workflow: {e}")
    print("   API will operate in mock mode")
    
    # Provide minimal fallback
    from typing import TypedDict, List, Dict, Any, Optional
    import time
    
    class AgentState(TypedDict):
        pass
    
    class MockWorkflowApp:
        def invoke(self, state, config=None):
            time.sleep(2)  # Simulate processing
            return {
                **state,
                'symptoms': ['Mock symptom'],
                'root_cause': 'Mock root cause - Sensor drift',
                'recommended_actions': [
                    {'action': 'Recalibrate sensors', 'priority': 'high'}
                ],
                'diagnostic_confidence': 0.85,
                'reasoning_confidence': 0.85,
                'planning_confidence': 0.90,
                'current_agent': 'completed'
            }
        
        def stream(self, state, config=None):
            """Mock stream method"""
            final_result = self.invoke(state, config)
            yield {"completed": final_result}
    
    app = MockWorkflowApp()
    llm = None
    GLOBAL_CONTEXT = {}
    
    def learning_agent(state):
        return {
            **state,
            'learning_updates': [
                {'agent': 'diagnostic', 'update_type': 'pattern', 'confidence_adjustment': 0.05}
            ]
        }
