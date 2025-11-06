// Neo4j Cypher Rule Implementations\n\n// MANUFACTURING_RULES RULES\n// MFG_R001: Tool Wear Threshold Rule\n
                MATCH (e:ManufacturingEquipment)
                WHERE e.tool_wear > 200
                CREATE (e)-[:HAS_FAILURE]->(f:Failure:ToolWearFailure {
                    id: 'TWF_' + e.id + '_' + toString(timestamp()),
                    predicted_by: 'Tool_Wear_Threshold_Rule',
                    confidence: 0.85
                })
                \n\n// MFG_R002: Heat Dissipation Failure Rule\n
                MATCH (e:ManufacturingEquipment)
                WHERE e.process_temperature - e.air_temperature > 10
                CREATE (e)-[:HAS_FAILURE]->(f:Failure:HeatDissipationFailure {
                    id: 'HDF_' + e.id + '_' + toString(timestamp()),
                    predicted_by: 'Heat_Dissipation_Rule',
                    confidence: 0.78
                })
                \n\n// MFG_R003: Power Failure Rule\n
                MATCH (e:ManufacturingEquipment)  
                WHERE e.torque < 30 AND e.rotational_speed > 1600
                CREATE (e)-[:HAS_FAILURE]->(f:Failure:PowerFailure {
                    id: 'PWF_' + e.id + '_' + toString(timestamp()),
                    predicted_by: 'Power_Failure_Rule',
                    confidence: 0.72
                })
                \n\n// MFG_R004: Quality-Based Maintenance Rule\n
                MATCH (e:ManufacturingEquipment)
                WHERE e.product_type = 'L'
                CREATE (e)-[:REQUIRES_MAINTENANCE]->(m:MaintenanceAction:PreventiveMaintenance {
                    id: 'PREV_MAINT_' + e.id + '_' + toString(timestamp()),
                    reason: 'Low_Quality_Production',
                    priority: 'high'
                })
                \n\n// TRANSPORTATION_RULES RULES\n// TRANS_R001: Compressor Failure Rule\n
                MATCH (e:TransportationEquipment)-[:HAS_COMPONENT]->(c:Compressor)
                WHERE c.status = 0 AND e.pressure < -0.05
                CREATE (c)-[:HAS_FAILURE]->(f:Failure {
                    id: 'COMP_FAIL_' + c.id + '_' + toString(timestamp()),
                    failure_type: 'CompressorFailure',
                    predicted_by: 'Compressor_Failure_Rule',
                    confidence: 0.88
                })
                \n\n// TRANS_R002: Oil Temperature Anomaly Rule\n
                MATCH (e:TransportationEquipment)
                WHERE e.oil_temperature > 70
                CREATE (e)-[:HAS_ANOMALY]->(a:Anomaly:TemperatureAnomaly {
                    id: 'TEMP_ANOM_' + e.id + '_' + toString(timestamp()),
                    anomaly_type: 'TemperatureAnomaly',
                    value: e.oil_temperature,
                    threshold: 70,
                    severity: 'high'
                })
                \n\n// TRANS_R003: Motor Current Spike Rule\n
                MATCH (e:TransportationEquipment)
                WHERE e.motor_current > 5.0
                CREATE (e)-[:HAS_ANOMALY]->(a:Anomaly:CurrentAnomaly {
                    id: 'CURR_ANOM_' + e.id + '_' + toString(timestamp()),
                    anomaly_type: 'CurrentAnomaly', 
                    value: e.motor_current,
                    threshold: 5.0,
                    severity: 'medium'
                })
                \n\n// CROSS_DOMAIN_RULES RULES\n// CROSS_R001: Cascade Failure Prevention Rule\n
                MATCH (e:Equipment)-[:HAS_COMPONENT]->(c1:Component)-[:HAS_FAILURE]->()
                MATCH (e)-[:HAS_COMPONENT]->(c2:Component)
                WHERE c1 <> c2
                CREATE (c2)-[:REQUIRES_INSPECTION]->(i:Inspection {
                    id: 'INSP_' + c2.id + '_' + toString(timestamp()),
                    reason: 'Cascade_Failure_Prevention',
                    priority: 'high'
                })
                \n\n// PHYSICS_RULES RULES\n// PHYS_R001: Thermal Expansion Rule\n
                MATCH (e:Equipment)
                WHERE e.temperature_differential > 15
                CREATE (e)-[:HAS_ANOMALY]->(a:Anomaly {
                    id: 'THERMAL_STRESS_' + e.id + '_' + toString(timestamp()),
                    anomaly_type: 'ThermalStressAnomaly',
                    cause: 'High_Temperature_Differential'
                })
                \n\n// PHYS_R002: Energy Conservation Rule\n
                MATCH (e:Equipment)
                WHERE e.work_output / e.power_consumption < 0.5
                CREATE (e)-[:HAS_ANOMALY]->(a:Anomaly {
                    id: 'EFF_ANOM_' + e.id + '_' + toString(timestamp()),
                    anomaly_type: 'EfficiencyAnomaly',
                    efficiency: e.work_output / e.power_consumption
                })
                \n\n// STATISTICAL_RULES RULES\n// STAT_R001: Moving Average Deviation Rule\n
                MATCH (s:Sensor)
                WHERE abs(s.current_value - s.moving_average) > 2 * s.standard_deviation
                CREATE (s)-[:HAS_ANOMALY]->(a:Anomaly:StatisticalAnomaly {
                    id: 'STAT_ANOM_' + s.id + '_' + toString(timestamp()),
                    z_score: abs(s.current_value - s.moving_average) / s.standard_deviation,
                    threshold: 2.0
                })
                \n\n// EXPERT_RULES RULES\n// EXP_R001: Maintenance Schedule Rule\n
                MATCH (e:Equipment)
                WHERE size((e)-[:HAS_ANOMALY]->()) >= 2
                CREATE (e)-[:REQUIRES_MAINTENANCE]->(m:MaintenanceAction {
                    id: 'IMM_MAINT_' + e.id + '_' + toString(timestamp()),
                    maintenance_type: 'ImmediateMaintenance',
                    priority: 'critical',
                    reason: 'Multiple_Anomalies'
                })
                \n\n