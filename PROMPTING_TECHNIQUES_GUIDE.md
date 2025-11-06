# 🎓 Prompting Techniques Guide for AI Agents

## 📚 Complete Reference for Phase 5 Implementation

---

## 1️⃣ Chain-of-Thought (CoT) Prompting

### **What It Is**
Forces the LLM to reason step-by-step explicitly, showing its "thinking process."

### **When to Use**
- Complex reasoning tasks
- Multi-step analysis
- Debugging incorrect outputs
- Need transparency in reasoning

### **Implementation in Diagnostic Agent**

```python
prompt = """Think step by step:

1. **Identify Symptoms**: What abnormal behaviors are indicated?
   - Consider temperature, torque, speed, wear
   - High reconstruction error suggests deviation

2. **Classify Severity**: Based on symptoms
   - Critical: Immediate failure risk
   - High: Potential failure within hours
   - Medium: Monitoring required
   - Low: Minor deviations

3. **Map to Equipment**: Which components affected?
   - Use domain knowledge

4. **Confidence Assessment**: Rate confidence (0-1)

Now analyze: [Anomaly Data]
"""
```

### **Why It Works**
- Breaks complex task into manageable steps
- Reduces reasoning errors
- Makes LLM's logic auditable
- Improves accuracy by 20-30%

### **Pro Tips**
- Use numbered steps for clarity
- Include decision criteria for each step
- Ask "Why?" after each step
- End with explicit output format

---

## 2️⃣ ReAct (Reasoning + Acting) Pattern

### **What It Is**
Interleaves reasoning ("thoughts") with tool usage ("actions") and observations.

### **When to Use**
- Agents need to use tools/APIs
- Multi-step problem solving
- Decision-making with external data
- Autonomous workflows

### **Implementation in Reasoning Agent**

```python
prompt = """ReAct Framework:

**Thought 1**: Let me analyze the symptoms.
- What pattern do symptoms suggest?
- Are there correlations?

**Observation 1**: Based on KG context and SWRL rules:
{kg_context}
{swrl_rules}
{similar_cases}

**Thought 2**: Let me form causal hypotheses.
- What are possible root causes?
- Which explains ALL symptoms?

**Observation 2**: Evidence strength:
- Strong: SWRL rules, similar cases
- Weak: Low similarity, contradictions

**Thought 3**: Let me rank hypotheses.
- Consider evidence strength
- Evaluate completeness

**CONCLUSION**: [Root cause determination]
"""
```

### **Why It Works**
- Mimics human problem-solving
- Grounds reasoning in observations
- Enables tool usage
- Self-correcting through iteration

### **Pro Tips**
- Alternate Thought → Action → Observation
- Provide actual tool results in observations
- Allow multiple reasoning cycles
- End with explicit conclusion

---

## 3️⃣ Few-Shot Learning

### **What It Is**
Provides 2-5 examples of input-output pairs before asking LLM to solve new case.

### **When to Use**
- Consistent output format needed
- Domain-specific reasoning
- Teaching new concepts
- Improving accuracy

### **Implementation in Diagnostic Agent**

```python
prompt = """**FEW-SHOT EXAMPLES**:

Example 1:
Input: Temperature[K]=320, Speed[rpm]=1200, Torque[Nm]=55
Reasoning: High temp + low speed + high torque = heat buildup
Output: 
  Symptoms: ["Temperature elevation", "Torque-speed imbalance", "Cooling issue"]
  Severity: High
  Entities: ["Motor", "CoolingSystem", "TemperatureSensor"]
  Confidence: 0.85

Example 2:
Input: ToolWear[min]=240, Torque[Nm]=45, Type=L
Reasoning: Extended wear + elevated torque = tool degradation
Output:
  Symptoms: ["Excessive tool wear", "Torque fluctuations"]
  Severity: Medium
  Entities: ["CuttingTool", "TorqueSensor"]
  Confidence: 0.78

**NOW ANALYZE**:
Input: {new_anomaly_data}
Output: ?
"""
```

### **Why It Works**
- Teaches by demonstration
- Establishes output format
- Transfers domain knowledge
- Reduces ambiguity

### **Pro Tips**
- Use 2-5 examples (sweet spot)
- Examples should be diverse
- Show reasoning, not just answers
- Match examples to problem difficulty

---

## 4️⃣ Self-Refinement Prompting

### **What It Is**
LLM generates output, then critiques and improves it.

### **When to Use**
- Quality is critical
- Complex planning tasks
- Creative generation
- Error-prone outputs

### **Implementation in Planning Agent**

```python
prompt = """**STEP 1: Initial Plan Generation**
Think about:
- Immediate actions
- Root cause elimination
- Component repairs
- Preventive measures

[Generate initial plan]

**STEP 2: Self-Refinement Questions**
1. Does this address ROOT CAUSE (not symptoms)?
2. Are actions prioritized correctly?
3. Are there dependencies?
4. What could go wrong?
5. Are there better alternatives?

**STEP 3: Refined Plan**
Based on self-critique, provide improved plan:
[Refined output]
"""
```

### **Why It Works**
- Catches errors before user sees them
- Improves output quality 15-25%
- Encourages deeper reasoning
- Self-correcting mechanism

### **Pro Tips**
- Use critical questions
- Force consideration of failure modes
- Compare alternatives explicitly
- Mark improvements in refined version

---

## 5️⃣ Meta-Learning Prompting

### **What It Is**
LLM reflects on its own performance and generates learning updates.

### **When to Use**
- System should improve over time
- Feedback loops
- Calibrating confidence
- Identifying knowledge gaps

### **Implementation in Learning Agent**

```python
prompt = """**META-LEARNING TASK**:

**Original Results**: {diagnosis, reasoning, plan}
**Feedback Received**: {actual_outcome}

**Step 1: Self-Reflection**
- Was diagnosis accurate? Why/why not?
- What did we miss?
- Were confidence levels correct?

**Step 2: Pattern Extraction**
- What patterns can we learn?
- Symptom-cause correlations?
- Should we adjust strategies?

**Step 3: Knowledge Updates**
- Diagnostic Agent: Learn what?
- Reasoning Agent: Remember what?
- Planning Agent: Improve how?

**Step 4: Confidence Calibration**
- Overconfident or underconfident?
- Adjust thresholds how?

[Generate learning updates]
"""
```

### **Why It Works**
- System learns from experience
- Improves accuracy over time
- Calibrates confidence properly
- Identifies systematic errors

### **Pro Tips**
- Analyze both successes and failures
- Extract generalizable patterns
- Propagate learning to all agents
- Track improvement metrics

---

## 6️⃣ RAG (Retrieval-Augmented Generation)

### **What It Is**
Retrieve relevant context from knowledge base, then generate response using that context.

### **When to Use**
- Large knowledge bases
- Factual accuracy critical
- Reduce hallucination
- Domain-specific reasoning

### **Implementation in All Agents**

```python
# Step 1: Retrieve context
kg_context = query_knowledge_graph(entity)
swrl_rules = check_swrl_rules(conditions)
similar_cases = semantic_similarity_search(symptoms)

# Step 2: Augment prompt with context
prompt = f"""You are analyzing an anomaly.

**RETRIEVED CONTEXT**:

Knowledge Graph:
{json.dumps(kg_context, indent=2)}

SWRL Rules:
{json.dumps(swrl_rules, indent=2)}

Similar Historical Cases:
{json.dumps(similar_cases, indent=2)}

**TASK**: Use above context to determine root cause.
Cite specific evidence from context in your reasoning.
"""

# Step 3: Generate with context
response = llm.invoke(prompt)
```

### **Why It Works**
- Grounds reasoning in facts
- Reduces hallucination 70-90%
- Provides evidence for claims
- Scalable to large knowledge bases

### **Pro Tips**
- Retrieve diverse sources
- Limit context to ~2000 tokens
- Explicitly instruct to cite sources
- Use semantic search for retrieval

---

## 7️⃣ Structured Output Prompting

### **What It Is**
Force LLM to output in specific format (JSON, XML, etc.)

### **When to Use**
- Parsing LLM output programmatically
- Consistent data structure needed
- Multi-field outputs
- Integration with other systems

### **Implementation in All Agents**

```python
prompt = """Provide your analysis in JSON format:

{
  "reasoning_steps": "Detailed thinking process",
  "symptoms": ["symptom1", "symptom2"],
  "severity": "critical|high|medium|low",
  "affected_entities": ["entity1", "entity2"],
  "confidence": 0.0-1.0,
  "key_insights": "Important observations"
}

Rules:
- Must be valid JSON
- All fields required
- Confidence between 0 and 1
- Severity must be one of four values
"""

response = llm.invoke(prompt)
result = json.loads(response.content)
```

### **Why It Works**
- Enables programmatic parsing
- Enforces completeness
- Reduces ambiguity
- Easy integration

### **Pro Tips**
- Show example JSON in prompt
- Specify data types clearly
- Handle markdown code blocks
- Validate output structure

---

## 🎯 Combining Techniques

### **Multi-Technique Prompting** (Most Powerful)

```python
prompt = """
[Chain-of-Thought]
Think step by step:
1. Analyze symptoms
2. Retrieve context
3. Form hypotheses
4. Refine conclusions

[Few-Shot]
Example 1: [...]
Example 2: [...]

[RAG]
Retrieved Context:
{knowledge_graph_context}
{historical_cases}

[ReAct]
Thought: What do symptoms indicate?
Observation: {tool_results}
Thought: Which hypothesis best explains?
Conclusion: [Root cause]

[Self-Refinement]
Initial hypothesis: [...]
Critique: What's wrong?
Refined: [...]

[Structured Output]
Output format:
{
  "root_cause": "...",
  "confidence": 0.0-1.0,
  "evidence": [...]
}
"""
```

---

## 📊 Technique Comparison

| Technique | Accuracy Boost | Latency Impact | Use Case |
|-----------|----------------|----------------|----------|
| Chain-of-Thought | +20-30% | +30% | Complex reasoning |
| ReAct | +25-35% | +50% | Tool usage |
| Few-Shot | +15-25% | +10% | Format consistency |
| Self-Refinement | +15-25% | +80% | Quality critical |
| Meta-Learning | +5-15% (long-term) | +20% | Continuous improvement |
| RAG | +30-40% | +40% | Factual accuracy |
| Structured Output | +10% (parsability) | +5% | System integration |

---

## 🚀 Best Practices

### **1. Prompt Engineering Process**
```
Start Simple → Test → Add Technique → Test → Iterate
```

### **2. Prompt Length**
- Optimal: 500-2000 tokens
- Too short: Ambiguous, low quality
- Too long: Expensive, slower

### **3. Temperature Settings**
- 0.0-0.3: Deterministic (reasoning tasks)
- 0.5-0.7: Balanced (creative + accurate)
- 0.8-1.0: Creative (brainstorming)

### **4. Prompt Structure**
```
1. Role definition
2. Task description
3. Context/examples
4. Specific instructions
5. Output format
6. Constraints
```

### **5. Testing Strategy**
- Test on known cases first
- Measure accuracy vs. baseline
- Monitor token usage (cost)
- Track latency
- Collect failure cases

### **6. Iteration Cycle**
```
Baseline Prompt → Run Tests → Analyze Failures → 
Add Technique → Re-test → Compare Metrics → Deploy
```

---

## 💡 Common Mistakes

### ❌ **Don't**
- Vague instructions: "Analyze this"
- No examples for complex tasks
- Ignore output format
- Over-complicate simple tasks
- Trust output without validation

### ✅ **Do**
- Specific instructions: "Identify root cause using ReAct framework"
- Provide 2-3 examples
- Specify JSON schema
- Start simple, add complexity if needed
- Parse and validate outputs

---

## 📈 Measuring Prompt Quality

```python
def evaluate_prompt(prompt, test_cases):
    results = []
    for case in test_cases:
        response = llm.invoke(prompt.format(**case))
        
        metrics = {
            'accuracy': compare_to_ground_truth(response, case['expected']),
            'latency': measure_time(response),
            'token_cost': count_tokens(prompt + response),
            'parsability': can_parse_json(response),
            'completeness': all_fields_present(response)
        }
        results.append(metrics)
    
    return aggregate_metrics(results)
```

---

## 🎓 Learning Resources

1. **Chain-of-Thought**: Wei et al., "Chain-of-Thought Prompting" (2022)
2. **ReAct**: Yao et al., "ReAct: Synergizing Reasoning and Acting" (2022)
3. **RAG**: Lewis et al., "Retrieval-Augmented Generation" (2020)
4. **Few-Shot**: Brown et al., "Language Models are Few-Shot Learners" (2020)

---

## 🔧 Prompt Templates

### **Diagnostic Template**
```python
DIAGNOSTIC_TEMPLATE = """
[Role] You are an expert diagnostic agent.
[Task] Analyze anomaly symptoms step by step.
[Context] {anomaly_data}
[Instructions] Think through: 1) Symptoms 2) Severity 3) Equipment 4) Confidence
[Examples] {few_shot_examples}
[Output] JSON: {json_schema}
"""
```

### **Reasoning Template**
```python
REASONING_TEMPLATE = """
[Role] You are a causal reasoning expert.
[Task] Determine root cause using ReAct framework.
[Context] KG: {kg_context}, Rules: {swrl_rules}, Cases: {similar_cases}
[Instructions] Thought→Observation→Thought→Conclusion
[Output] JSON: {json_schema}
"""
```

### **Planning Template**
```python
PLANNING_TEMPLATE = """
[Role] You are a remediation planning expert.
[Task] Generate actionable plan with self-refinement.
[Context] Root cause: {root_cause}, Historical: {historical_plans}
[Instructions] Generate→Critique→Refine
[Output] JSON: {json_schema}
"""
```

---

**All these techniques are implemented in `phase5_langgraph_agentic_reasoning.ipynb`!**

**Start experimenting and iterate based on your results!** 🚀
