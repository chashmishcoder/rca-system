# Agent Learning Documentation
# Phase 5: Multi-Agent RCA System

## 📚 Overview

This document describes the learning mechanisms and self-improvement capabilities of the Multi-Agent RCA System. The Learning Agent processes operator feedback to continuously improve diagnostic accuracy, reasoning quality, and planning effectiveness.

---

## 🎯 Learning Architecture

### Components

```
┌─────────────────────────────────────────────────────────────┐
│                     FEEDBACK LOOP                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Operator/Engineer ──► Feedback Input                      │
│        │                    │                               │
│        │                    ▼                               │
│        │            ┌──────────────┐                       │
│        │            │  Learning    │                       │
│        │            │    Agent     │                       │
│        │            └──────┬───────┘                       │
│        │                   │                               │
│        │          Meta-Learning Analysis                   │
│        │                   │                               │
│        │           ┌───────▼────────┐                      │
│        │           │ Knowledge      │                      │
│        └───────────┤   Updates      │                      │
│                    └───────┬────────┘                      │
│                            │                               │
│              ┌─────────────┼─────────────┐                │
│              ▼             ▼             ▼                │
│         Diagnostic     Reasoning     Planning             │
│           Agent         Agent         Agent               │
│        (Confidence)  (Patterns)   (Strategies)            │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

---

## 🧠 Learning Agent

### Purpose

The Learning Agent implements **meta-learning** - learning about learning. It:
1. Analyzes operator feedback on RCA results
2. Identifies patterns in correct/incorrect diagnoses
3. Generates knowledge updates for other agents
4. Calibrates confidence thresholds
5. Suggests strategy improvements

### Prompting Technique

**Meta-Learning + Self-Reflection**

```python
"""
Step 1: Self-Reflection
- Was our diagnosis accurate? Why or why not?
- What did we miss or misinterpret?
- Were our confidence levels calibrated correctly?

Step 2: Pattern Extraction
- What patterns can we learn from this feedback?
- Are there symptom-cause correlations to remember?
- Should we adjust our reasoning strategies?

Step 3: Knowledge Updates
- What should the Diagnostic Agent learn?
- What should the Reasoning Agent remember?
- What should the Planning Agent improve?

Step 4: Confidence Calibration
- Were we overconfident or underconfident?
- How should we adjust confidence thresholds?
"""
```

### Implementation

**Location**: `phase5_langgraph_agentic_reasoning.ipynb`, Cell 20 (Learning Agent)

**Function**: `learning_agent(state: AgentState, feedback: Optional[Dict] = None)`

**Input**:
- Original RCA workflow state
- Feedback dictionary with:
  - `feedback_type`: 'correct', 'partially_correct', 'incorrect'
  - `actual_root_cause`: Ground truth from investigation
  - `diagnostic_accuracy`: Accuracy assessment
  - `reasoning_accuracy`: Reasoning quality assessment
  - `planning_effectiveness`: Plan quality assessment
  - `comments`: Free-text operator feedback
  - `corrective_actions`: Actions actually taken

**Output**:
- `feedback_summary`: Analysis of feedback
- `learning_updates`: List of knowledge updates for agents
- `confidence_calibration`: Threshold adjustments

---

## 📊 Feedback Types

### 1. Correct Feedback

**Criteria**:
- Diagnosis matched actual root cause
- Remediation plan was effective
- No major issues identified

**Learning Actions**:
- Reinforce successful patterns
- Increase confidence slightly (+0.02 to +0.05)
- Log successful symptom→cause correlations

**Example**:
```json
{
  "feedback_type": "correct",
  "actual_root_cause": "Power System Failure",
  "diagnostic_accuracy": "correct",
  "reasoning_accuracy": "correct",
  "planning_effectiveness": "effective",
  "comments": "Diagnosis accurate, plan worked within 2 hours"
}
```

**Learning Updates**:
```json
{
  "agent": "diagnostic",
  "update_type": "pattern",
  "description": "Reinforced: High torque + speed deviation → Power failure",
  "confidence_adjustment": +0.03
}
```

### 2. Partially Correct Feedback

**Criteria**:
- General root cause correct, but details missed
- Remediation plan partially effective
- Some unnecessary actions recommended

**Learning Actions**:
- Refine pattern recognition
- Adjust specificity of diagnoses
- Update action prioritization
- Minor confidence adjustment (-0.01 to +0.02)

**Example**:
```json
{
  "feedback_type": "partially_correct",
  "actual_root_cause": "Bearing Failure (thrust bearing)",
  "diagnostic_accuracy": "correct",
  "reasoning_accuracy": "partially_correct",
  "planning_effectiveness": "partially_effective",
  "comments": "General diagnosis correct, but specific component not identified"
}
```

**Learning Updates**:
```json
[
  {
    "agent": "reasoning",
    "update_type": "strategy",
    "description": "Improve component-level specificity in mechanical failures",
    "confidence_adjustment": -0.02
  },
  {
    "agent": "planning",
    "update_type": "rule",
    "description": "Prioritize bearing inspection over lubrication in high-torque anomalies",
    "confidence_adjustment": 0.00
  }
]
```

### 3. Incorrect Feedback

**Criteria**:
- Wrong root cause identified
- Ineffective remediation plan
- Major misdiagnosis

**Learning Actions**:
- Identify failure mode
- Update symptom interpretation
- Revise reasoning strategies
- Significant confidence reduction (-0.05 to -0.15)

**Example**:
```json
{
  "feedback_type": "incorrect",
  "actual_root_cause": "Software Configuration Error",
  "diagnostic_accuracy": "incorrect",
  "reasoning_accuracy": "incorrect",
  "planning_effectiveness": "ineffective",
  "comments": "Misdiagnosed as hardware failure, was software parameter issue"
}
```

**Learning Updates**:
```json
[
  {
    "agent": "diagnostic",
    "update_type": "pattern",
    "description": "Add software/configuration hypothesis for torque-speed anomalies",
    "confidence_adjustment": -0.10
  },
  {
    "agent": "reasoning",
    "update_type": "rule",
    "description": "Check software parameters before concluding hardware failure",
    "confidence_adjustment": -0.08
  }
]
```

---

## 🔄 Learning Workflow

### Step-by-Step Process

1. **RCA Execution**
   - Diagnostic, Reasoning, Planning agents run
   - Results saved with workflow_id

2. **Operator Investigation**
   - Operator follows remediation plan
   - Determines actual root cause
   - Notes effectiveness of recommended actions

3. **Feedback Submission**
   - Via API: `POST /api/rca/feedback`
   - Via Notebook: `process_operator_feedback()`
   - Includes accuracy assessments and comments

4. **Learning Agent Processing**
   - Analyzes discrepancies between prediction and reality
   - Identifies patterns in successes/failures
   - Generates agent-specific knowledge updates
   - Calibrates confidence thresholds

5. **Knowledge Update Application**
   - Updates saved to learning logs
   - (Future) Updates applied to agent prompts
   - (Future) Updates integrated into KG

6. **Performance Monitoring**
   - Track accuracy trends over time
   - Monitor confidence calibration
   - Identify recurring failure modes

---

## 📈 Learning Metrics

### Tracked Metrics

1. **Diagnostic Accuracy**
   - Correct symptom identification rate
   - Severity classification accuracy
   - Affected entity identification accuracy

2. **Reasoning Accuracy**
   - Root cause match rate
   - Confidence calibration (predicted vs actual)
   - Causal chain completeness

3. **Planning Effectiveness**
   - Action success rate
   - Redundant action rate
   - Timeline accuracy

4. **Overall Performance**
   - End-to-end RCA accuracy
   - Time to resolution
   - Operator satisfaction

### Metric Calculation

```python
# Diagnostic Accuracy
diagnostic_accuracy = (
    correct_diagnoses / total_cases
) * 100

# Confidence Calibration Error
calibration_error = abs(
    predicted_confidence - actual_success_rate
)

# Planning Efficiency
planning_efficiency = (
    effective_actions / total_recommended_actions
) * 100
```

---

## 💾 Learning Logs

### Log Structure

**File**: `learning_logs/learning_{workflow_id}_{timestamp}.json`

```json
{
  "workflow_id": "b312deee-b224-4c89-aeef-e3d29ada1ef7",
  "anomaly_id": "AI4I_anomaly_1",
  "timestamp": "2025-11-06T14:05:00",
  "feedback": {
    "feedback_type": "correct",
    "actual_root_cause": "Power System Failure",
    "diagnostic_accuracy": "correct",
    "reasoning_accuracy": "correct",
    "planning_effectiveness": "effective",
    "comments": "Diagnosis accurate, plan worked well",
    "corrective_actions": [
      "Replaced voltage regulator",
      "Tested under load"
    ]
  },
  "learning_updates": [
    {
      "agent": "diagnostic",
      "update_type": "pattern",
      "description": "Reinforced: High reconstruction error + speed/torque deviation → Power failure",
      "rationale": "Successful pattern match confirmed by operator feedback",
      "confidence_adjustment": 0.03
    },
    {
      "agent": "reasoning",
      "update_type": "rule",
      "description": "SWRL rule MFG_R003 confidence boosted for power-related symptoms",
      "rationale": "Rule correctly identified power failure in this case",
      "confidence_adjustment": 0.02
    }
  ],
  "feedback_summary": "Positive feedback confirms diagnostic approach. Power system failure pattern successfully identified..."
}
```

### Log Analysis

Learning logs can be analyzed to:
- Track accuracy trends over time
- Identify common failure patterns
- Evaluate confidence calibration
- Measure learning effectiveness

**Analysis Script** (future enhancement):
```python
def analyze_learning_trends(log_directory):
    """Analyze learning logs to compute performance metrics"""
    logs = load_all_logs(log_directory)
    
    accuracy_by_agent = {
        'diagnostic': [],
        'reasoning': [],
        'planning': []
    }
    
    for log in logs:
        feedback = log['feedback']
        accuracy_by_agent['diagnostic'].append(
            1 if feedback['diagnostic_accuracy'] == 'correct' else 0
        )
        # ... similar for other agents
    
    return {
        'diagnostic_accuracy': np.mean(accuracy_by_agent['diagnostic']),
        'reasoning_accuracy': np.mean(accuracy_by_agent['reasoning']),
        'planning_accuracy': np.mean(accuracy_by_agent['planning'])
    }
```

---

## 🚀 Future Enhancements

### 1. Automated Knowledge Base Updates

**Goal**: Automatically update agent prompts based on learning

**Implementation**:
```python
def apply_learning_updates(updates):
    """Apply learning updates to agent prompts"""
    for update in updates:
        if update['agent'] == 'diagnostic':
            # Update few-shot examples in diagnostic prompt
            add_example_to_prompt(update['pattern'])
        elif update['agent'] == 'reasoning':
            # Update SWRL rule weights
            adjust_rule_confidence(update['rule_id'], update['adjustment'])
```

### 2. Active Learning

**Goal**: Identify uncertain cases for expert review

**Strategy**:
- Flag low-confidence predictions (<0.6)
- Prioritize feedback collection for uncertain cases
- Target learning efforts on failure modes

### 3. Transfer Learning

**Goal**: Apply learnings across domains (AI4I ↔ MetroPT)

**Strategy**:
- Identify cross-domain patterns
- Update cross-domain bridges
- Generalize successful strategies

### 4. Ensemble Learning

**Goal**: Combine multiple agent hypotheses

**Strategy**:
- Run multiple reasoning strategies
- Vote on root cause
- Weight by historical accuracy

### 5. Reinforcement Learning

**Goal**: Optimize agent behavior via rewards

**Rewards**:
- +1.0 for correct diagnosis
- +0.5 for partially correct
- -0.5 for incorrect
- Bonus for fast resolution

---

## 📝 Usage Examples

### Example 1: Submit Feedback via Notebook

```python
# After running RCA workflow
feedback_result = process_operator_feedback(
    rca_result=rca_results[0],
    feedback_type="correct",
    actual_root_cause="Power System Failure",
    diagnostic_accuracy="correct",
    reasoning_accuracy="correct",
    planning_effectiveness="effective",
    comments="Great analysis!",
    corrective_actions_taken=[
        "Replaced voltage regulator",
        "Tested system"
    ]
)

print(f"Learning updates: {len(feedback_result['learning_updates'])}")
```

### Example 2: Submit Feedback via API

```python
import requests

feedback = {
    "workflow_id": "b312deee-...",
    "anomaly_id": "AI4I_anomaly_1",
    "feedback_type": "correct",
    "diagnostic_accuracy": "correct",
    "reasoning_accuracy": "correct",
    "planning_effectiveness": "effective"
}

response = requests.post(
    "http://localhost:8000/api/rca/feedback",
    json=feedback
)

learning = response.json()
print(f"Updates: {learning['learning_updates']}")
```

### Example 3: Analyze Learning Logs

```python
import json
import glob

# Load all learning logs
logs = []
for log_file in glob.glob("learning_logs/*.json"):
    with open(log_file) as f:
        logs.append(json.load(f))

# Calculate accuracy
correct = sum(1 for log in logs if log['feedback']['feedback_type'] == 'correct')
accuracy = correct / len(logs) * 100

print(f"Overall accuracy: {accuracy:.1f}%")
print(f"Total feedback received: {len(logs)}")
```

---

## 🎓 Best Practices

### 1. Feedback Quality

✅ **DO**:
- Provide specific comments
- Document actual actions taken
- Include timeline information
- Note unexpected observations

❌ **DON'T**:
- Provide vague feedback ("it worked" / "it didn't work")
- Submit feedback without investigation
- Skip important details

### 2. Feedback Frequency

**Recommended**:
- Provide feedback for **all critical cases**
- Sample 20-30% of routine cases
- Always provide feedback for **incorrect diagnoses**

### 3. Learning Cadence

**Recommended**:
- Review learning logs **weekly**
- Analyze trends **monthly**
- Update prompts/strategies **quarterly**

### 4. Confidence Calibration

**Guidelines**:
- Confidence adjustments should be **small** (±0.05 typical)
- Multiple feedback points before major changes (±0.10+)
- Monitor calibration error regularly

---

## 📚 References

### Academic Foundations

1. **Meta-Learning**: "Learning to Learn" (Thrun & Pratt, 1998)
2. **Reinforcement Learning from Human Feedback (RLHF)**: OpenAI, 2022
3. **Active Learning**: Settles, 2009
4. **Confidence Calibration**: Guo et al., 2017

### Implementation References

- LangChain Learning Tools: https://python.langchain.com/docs/modules/agents/
- LangGraph Feedback Loops: https://langchain-ai.github.io/langgraph/
- Gemini API: https://ai.google.dev/docs

---

## 🔗 Related Documentation

- [API Documentation](api/README.md)
- [PHASE5_COMPLETION_SUMMARY.md](../PHASE5_COMPLETION_SUMMARY.md)
- [PROMPTING_TECHNIQUES_GUIDE.md](../PROMPTING_TECHNIQUES_GUIDE.md)
- [RULE_BASED_VS_AI_AGENTS_COMPARISON.md](../RULE_BASED_VS_AI_AGENTS_COMPARISON.md)

---

**Last Updated**: November 6, 2025  
**Version**: 1.0  
**Author**: Phase 5 Development Team
