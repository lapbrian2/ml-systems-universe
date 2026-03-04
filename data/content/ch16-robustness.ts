import type { ChapterSection, GlossaryTerm } from '~/types/chapter';

export const sections: ChapterSection[] = [
  {
    id: 'ch16-s1',
    heading: 'Building Reliable ML Systems',
    body: 'Reliability in ML systems means consistently producing correct outputs under expected conditions and degrading gracefully under unexpected conditions. Unlike traditional software where correctness is binary, ML systems operate on a spectrum of quality, making reliability a more nuanced engineering challenge.\n\nReliability engineering for ML draws on principles from site reliability engineering (SRE) and adapts them for the unique characteristics of ML systems. Key practices include defining service level objectives for model quality, implementing automated testing at multiple levels, and establishing incident response procedures specific to model failures.\n\nThe reliability of an ML system depends on every component in the pipeline: data collection, preprocessing, model inference, postprocessing, and integration with downstream systems. A failure at any point can corrupt outputs. Reliability engineering must address all these components with appropriate testing, monitoring, and redundancy.\n\nMean time between failures (MTBF) and mean time to recovery (MTTR) are key reliability metrics. For ML systems, "failure" might mean model accuracy dropping below a threshold rather than a complete system crash. Reducing MTTR through automated detection, diagnosis, and rollback is often more achievable than preventing all failures.',
    blocks: [
      {
        type: 'paragraph',
        text: 'Reliability in ML systems means consistently producing correct outputs under expected conditions and degrading gracefully under unexpected conditions. Unlike traditional software where correctness is binary, ML systems operate on a spectrum of quality, making reliability a more nuanced engineering challenge.',
      },
      {
        type: 'definition',
        term: 'ML Reliability',
        definition: 'The ability of an ML system to consistently produce correct outputs under expected conditions and degrade gracefully under unexpected conditions. Unlike traditional software where failures are binary (crash or no crash), ML reliability operates on a continuous spectrum of prediction quality.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'SRE Principles for ML',
      },
      {
        type: 'paragraph',
        text: 'Reliability engineering for ML draws on principles from site reliability engineering (SRE) and adapts them for the unique characteristics of ML systems. Key practices include defining service level objectives for model quality, implementing automated testing, and establishing incident response procedures.',
      },
      {
        type: 'callout',
        variant: 'note',
        title: 'SLOs for ML Systems',
        text: 'Traditional SLOs measure uptime and latency. ML SLOs must also measure prediction quality. Example: "The recommendation model shall maintain click-through rate within 10% of baseline for 99.5% of weekly measurement periods." Defining these ML-specific SLOs requires collaboration between ML engineers, product managers, and SRE teams.',
      },
      {
        type: 'table',
        headers: ['Metric', 'Traditional Software', 'ML System Equivalent'],
        rows: [
          ['Uptime', '99.9% availability', '99.9% availability + model accuracy > threshold'],
          ['Latency', 'P99 < 200ms', 'P99 < 200ms including model inference'],
          ['Correctness', 'Returns expected output', 'Prediction accuracy > SLO target'],
          ['Error Budget', 'Allowed downtime minutes', 'Allowed accuracy degradation periods'],
          ['MTTR', 'Time to restore service', 'Time to detect + diagnose + rollback model'],
        ],
        caption: 'Table 16.1: Translating SRE concepts to ML systems.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'End-to-End Pipeline Reliability',
      },
      {
        type: 'paragraph',
        text: 'The reliability of an ML system depends on every component in the pipeline: data collection, preprocessing, model inference, postprocessing, and integration with downstream systems. A failure at any point can corrupt outputs.',
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'The Weakest Link',
        text: 'ML pipeline reliability follows the chain rule: the overall reliability is bounded by the least reliable component. A 99.99% available model is worthless if the feature pipeline fails 1% of the time. Map every component in your pipeline, measure its failure rate independently, and prioritize improving the least reliable component.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'MTBF and MTTR',
      },
      {
        type: 'paragraph',
        text: 'Mean time between failures (MTBF) and mean time to recovery (MTTR) are key reliability metrics. For ML systems, "failure" might mean model accuracy dropping below a threshold rather than a complete system crash.',
      },
      {
        type: 'equation',
        latex: 'Availability = \\frac{MTBF}{MTBF + MTTR}',
        label: 'Equation 16.1: System availability as a function of MTBF and MTTR. Reducing MTTR is often more practical than increasing MTBF for ML systems, since some model failures are inherently unpredictable.',
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'Invest in MTTR Over MTBF',
        text: 'For ML systems, preventing all failures is impractical — data distributions shift, upstream APIs change, and the real world is unpredictable. Focus investment on reducing MTTR: automated drift detection (fast detection), pre-built runbooks (fast diagnosis), and one-click rollback (fast recovery). A team that can recover in 5 minutes is more reliable than one that tries to prevent all failures but takes 4 hours to recover when one occurs.',
      },
    ],
    order: 0,
    keyConcepts: [
      { term: 'ML Reliability', definition: 'The ability of an ML system to consistently produce correct outputs under expected conditions and degrade gracefully under unexpected conditions.' },
      { term: 'MTTR', definition: 'Mean Time To Recovery, the average time required to detect, diagnose, and resolve a system failure, a key reliability metric.' },
    ],
  },
  {
    id: 'ch16-s2',
    heading: 'Error Handling and Graceful Degradation',
    body: 'ML systems must handle errors at multiple levels: infrastructure failures (GPU errors, network outages), data errors (missing features, invalid inputs), and model errors (low confidence predictions, out-of-distribution inputs). Each type requires appropriate handling strategies.\n\nGraceful degradation means the system continues to provide value even when components fail. For an ML-powered recommendation system, graceful degradation might mean falling back from a personalized model to a popularity-based model, and from that to a curated default list. Each fallback level provides less value but maintains system availability.\n\nConfidence-based routing sends predictions through different paths based on model confidence. High-confidence predictions are served directly. Low-confidence predictions might be routed to a more expensive but more accurate model, queued for human review, or handled by a rule-based fallback system. This approach balances quality and efficiency.\n\nCircuit breaker patterns, borrowed from distributed systems engineering, prevent cascading failures in ML serving systems. If a model serving endpoint begins returning errors or high latencies, the circuit breaker trips and routes traffic to a fallback system. After a cooldown period, the circuit breaker tests the primary system and restores traffic if it has recovered.',
    blocks: [
      {
        type: 'paragraph',
        text: 'ML systems must handle errors at multiple levels: infrastructure failures (GPU errors, network outages), data errors (missing features, invalid inputs), and model errors (low confidence predictions, out-of-distribution inputs). Each type requires appropriate handling strategies.',
      },
      {
        type: 'table',
        headers: ['Error Level', 'Examples', 'Detection', 'Handling Strategy'],
        rows: [
          ['Infrastructure', 'GPU OOM, network timeout, disk full', 'Health checks, resource monitoring', 'Retry, failover to backup, circuit breaker'],
          ['Data', 'Missing features, invalid types, NaN values', 'Schema validation, range checks', 'Default values, feature imputation, reject request'],
          ['Model', 'Low confidence, OOD input, inconsistent output', 'Confidence thresholds, OOD detection', 'Fallback model, human review, cached response'],
        ],
        caption: 'Table 16.2: Error types in ML systems and their handling strategies.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Graceful Degradation',
      },
      {
        type: 'definition',
        term: 'Graceful Degradation',
        definition: 'A system design strategy where components fail incrementally rather than catastrophically, with each fallback level providing reduced but still useful functionality. In ML systems, this typically means falling back to simpler models or heuristics when the primary model is unavailable or unreliable.',
      },
      {
        type: 'paragraph',
        text: 'Graceful degradation means the system continues to provide value even when components fail. Each fallback level provides less value but maintains system availability.',
      },
      {
        type: 'callout',
        variant: 'example',
        title: 'Recommendation System Fallback Chain',
        text: 'Level 1: Personalized ML model (best quality). Level 2: Collaborative filtering fallback (if personalized model is down). Level 3: Popularity-based ranking (if all models are unavailable). Level 4: Curated editorial list (if all computation fails). Each level is pre-computed and cached, ensuring the system always has something to show the user.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Confidence-Based Routing',
      },
      {
        type: 'paragraph',
        text: 'Confidence-based routing sends predictions through different paths based on model confidence. High-confidence predictions are served directly. Low-confidence predictions might be routed to a more expensive model, queued for human review, or handled by a fallback system.',
      },
      {
        type: 'code',
        language: 'python',
        code: '# Confidence-based routing pseudocode\ndef serve_prediction(input_data):\n    prediction, confidence = primary_model.predict(input_data)\n    \n    if confidence >= 0.95:\n        return prediction  # High confidence: serve directly\n    elif confidence >= 0.7:\n        # Medium confidence: use ensemble for verification\n        ensemble_pred = ensemble_model.predict(input_data)\n        return ensemble_pred\n    else:\n        # Low confidence: fall back or escalate\n        if is_time_sensitive:\n            return rule_based_fallback(input_data)\n        else:\n            queue_for_human_review(input_data)\n            return cached_default_response()',
        caption: 'Pseudocode for confidence-based prediction routing.',
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'Calibrate Before Routing',
        text: 'Confidence-based routing only works if the model\'s confidence scores are well-calibrated — meaning a 90% confidence prediction should actually be correct 90% of the time. Apply temperature scaling or Platt scaling to calibrate confidence scores before using them for routing decisions.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Circuit Breaker Pattern',
      },
      {
        type: 'definition',
        term: 'Circuit Breaker',
        definition: 'A design pattern borrowed from electrical engineering and distributed systems that monitors for failures and automatically routes traffic to a fallback system when the primary system becomes unhealthy. The circuit breaker has three states: closed (normal), open (fallback), and half-open (testing recovery).',
      },
      {
        type: 'paragraph',
        text: 'Circuit breaker patterns prevent cascading failures in ML serving systems. If a model serving endpoint begins returning errors or high latencies, the circuit breaker trips and routes traffic to a fallback system.',
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Cascading Failures',
        text: 'Without circuit breakers, a slow model endpoint causes upstream services to queue requests, consuming memory and threads. This can cascade through the entire system. A circuit breaker that trips after 5 consecutive failures or latency exceeding 3x the P99 baseline prevents this cascade by immediately routing to the fallback.',
      },
    ],
    order: 1,
    keyConcepts: [
      { term: 'Graceful Degradation', definition: 'A design strategy where system components fail incrementally, falling back to simpler alternatives rather than complete failure.' },
      { term: 'Circuit Breaker', definition: 'A pattern that detects failures and prevents cascading damage by routing traffic to fallback systems when the primary system is unhealthy.' },
    ],
  },
  {
    id: 'ch16-s3',
    heading: 'Robustness to Distribution Shift',
    body: 'Distribution shift occurs when the data encountered in production differs from the training data distribution. This is inevitable in real-world systems because the world changes over time, and no training dataset can perfectly represent all future conditions. Building models that are robust to these shifts is a central challenge of reliable ML.\n\nCovariate shift refers to changes in the input distribution while the relationship between inputs and outputs remains stable. Domain adaptation techniques address covariate shift by learning representations that are invariant across domains. Simple approaches like input normalization and batch normalization provide basic robustness, while more sophisticated methods use adversarial training or distribution matching.\n\nLabel shift occurs when the class proportions change between training and deployment. For example, a disease detection model trained on balanced data may encounter highly imbalanced real-world prevalence. Calibration techniques and class-weight adjustment help models handle label shift, but the most robust approach is to train on data that reflects realistic class proportions.\n\nOut-of-distribution (OOD) detection identifies inputs that are fundamentally different from anything seen during training. Rather than making potentially unreliable predictions on OOD inputs, the system can flag them for human review or route them to a fallback. OOD detection methods include softmax confidence thresholds, energy-based methods, and Mahalanobis distance in feature space.',
    blocks: [
      {
        type: 'paragraph',
        text: 'Distribution shift occurs when the data encountered in production differs from the training data distribution. This is inevitable in real-world systems because the world changes over time, and no training dataset can perfectly represent all future conditions.',
      },
      {
        type: 'definition',
        term: 'Distribution Shift',
        definition: 'A change between the training data distribution and the data encountered in production. Distribution shift is inevitable in real-world systems and is the primary cause of model performance degradation over time. It encompasses covariate shift, label shift, and concept drift.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Covariate Shift',
      },
      {
        type: 'paragraph',
        text: 'Covariate shift refers to changes in the input distribution while the relationship between inputs and outputs remains stable. Domain adaptation techniques address covariate shift by learning representations that are invariant across domains.',
      },
      {
        type: 'equation',
        latex: 'P_{train}(X) \\neq P_{test}(X) \\quad \\text{but} \\quad P_{train}(Y|X) = P_{test}(Y|X)',
        label: 'Equation 16.2: Covariate shift definition. The input distribution P(X) changes, but the conditional relationship P(Y|X) remains the same.',
      },
      {
        type: 'table',
        headers: ['Shift Type', 'What Changes', 'What Stays Constant', 'Example'],
        rows: [
          ['Covariate Shift', 'Input distribution P(X)', 'Conditional P(Y|X)', 'Camera images at night vs. daytime'],
          ['Label Shift', 'Class proportions P(Y)', 'Conditional P(X|Y)', 'Disease prevalence changes seasonally'],
          ['Concept Drift', 'Relationship P(Y|X)', 'Potentially everything', 'Customer preferences evolve over time'],
          ['Domain Shift', 'Both P(X) and P(Y|X)', 'Task structure', 'Model trained on hospital A, deployed at hospital B'],
        ],
        caption: 'Table 16.3: Types of distribution shift in ML systems.',
      },
      {
        type: 'callout',
        variant: 'note',
        title: 'Domain Adaptation Approaches',
        text: 'Simple domain adaptation includes input normalization and batch normalization, which center each batch to reduce covariate shift. More sophisticated methods include adversarial domain adaptation (learning features that a domain discriminator cannot distinguish) and distribution matching (minimizing Maximum Mean Discrepancy between source and target feature distributions).',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Label Shift',
      },
      {
        type: 'paragraph',
        text: 'Label shift occurs when the class proportions change between training and deployment. A disease detection model trained on balanced data may encounter highly imbalanced real-world prevalence.',
      },
      {
        type: 'callout',
        variant: 'example',
        title: 'Label Shift in Medical AI',
        text: 'A skin cancer classifier trained on a balanced dataset (50% benign, 50% malignant) encounters real-world prevalence of 98% benign, 2% malignant. Without adjustment, the model\'s precision on malignant predictions will be much lower than expected from validation. Calibration and class-weight adjustment account for this prevalence difference, but the most robust approach is to evaluate and train with realistic class proportions.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Out-of-Distribution Detection',
      },
      {
        type: 'definition',
        term: 'Out-of-Distribution (OOD) Detection',
        definition: 'Methods for identifying inputs that differ significantly from the training distribution, enabling the system to flag uncertain predictions for human review or route them to fallback systems rather than making unreliable predictions.',
      },
      {
        type: 'paragraph',
        text: 'OOD detection identifies inputs that are fundamentally different from anything seen during training. Rather than making potentially unreliable predictions, the system can flag them for human review or route them to a fallback.',
      },
      {
        type: 'list',
        ordered: false,
        items: [
          'Softmax confidence thresholds — Simple but unreliable; neural networks are often overconfident on OOD inputs.',
          'Energy-based methods — Use the energy score (log-sum-exp of logits) as an OOD indicator; more reliable than softmax.',
          'Mahalanobis distance — Compute distance from class centroids in feature space; effective for detecting semantic OOD.',
          'Ensemble disagreement — High variance across ensemble members suggests the input is unlike training data.',
        ],
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Overconfident on OOD Inputs',
        text: 'Standard neural networks are notoriously overconfident on out-of-distribution inputs. A classifier trained on cats and dogs may assign 99% confidence to an image of a car. Do not rely on raw softmax confidence for OOD detection. Use dedicated OOD scoring methods like energy scores or Mahalanobis distance, which are specifically designed to distinguish in-distribution from OOD inputs.',
      },
    ],
    order: 2,
    keyConcepts: [
      { term: 'Distribution Shift', definition: 'The difference between the training data distribution and the data encountered in production, a primary cause of model performance degradation.' },
      { term: 'Out-of-Distribution Detection', definition: 'Methods for identifying inputs that differ significantly from the training distribution, enabling appropriate handling rather than unreliable predictions.' },
    ],
  },
  {
    id: 'ch16-s4',
    heading: 'Testing ML Systems',
    body: 'Testing ML systems requires approaches beyond traditional software testing because ML behavior is learned from data rather than explicitly programmed. A comprehensive testing strategy includes unit tests for data processing code, integration tests for the pipeline, and model-specific tests that validate learned behavior.\n\nBehavioral testing, inspired by the CheckList framework, tests specific model capabilities through targeted test suites. Minimum functionality tests verify basic capabilities. Invariance tests check that irrelevant input changes do not affect predictions. Directional expectation tests verify that specific input changes produce expected directional changes in output.\n\nMetamorphic testing addresses the oracle problem (not knowing the correct output for arbitrary inputs) by testing relationships between inputs. If a model should be invariant to rotation, rotating an input and checking that the output is unchanged provides a test without needing to know the correct output. This approach is particularly valuable for testing complex models where ground truth is expensive.\n\nStress testing and chaos engineering for ML systems deliberately inject failures, noise, and adversarial conditions to verify system resilience. This includes testing with corrupted inputs, missing features, model serving failures, and data pipeline outages. These tests reveal how the system behaves under adversity and whether failover mechanisms work correctly.',
    blocks: [
      {
        type: 'paragraph',
        text: 'Testing ML systems requires approaches beyond traditional software testing because ML behavior is learned from data rather than explicitly programmed. A comprehensive testing strategy includes unit tests for data processing code, integration tests for the pipeline, and model-specific tests that validate learned behavior.',
      },
      {
        type: 'table',
        headers: ['Test Level', 'What It Tests', 'Example', 'When to Run'],
        rows: [
          ['Unit Tests', 'Data processing functions, feature engineering', 'Verify feature scaler produces expected output', 'Every commit'],
          ['Integration Tests', 'Pipeline components working together', 'Verify data flows from ingestion through prediction', 'Every PR merge'],
          ['Model Tests', 'Learned model behavior', 'Behavioral tests, invariance tests, minimum functionality', 'Every model training run'],
          ['System Tests', 'End-to-end with real infrastructure', 'Latency under load, failover behavior', 'Pre-deployment'],
        ],
        caption: 'Table 16.4: ML testing pyramid from unit tests to system tests.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Behavioral Testing (CheckList)',
      },
      {
        type: 'definition',
        term: 'Behavioral Testing',
        definition: 'A testing methodology inspired by the CheckList framework that validates specific model capabilities through three test types: Minimum Functionality Tests (basic capability), Invariance Tests (robustness to irrelevant changes), and Directional Expectation Tests (correct response to meaningful changes).',
      },
      {
        type: 'paragraph',
        text: 'Behavioral testing tests specific model capabilities through targeted test suites. Minimum functionality tests verify basic capabilities. Invariance tests check that irrelevant input changes do not affect predictions. Directional expectation tests verify expected directional output changes.',
      },
      {
        type: 'callout',
        variant: 'example',
        title: 'CheckList for Sentiment Analysis',
        text: 'Minimum Functionality: "This movie is excellent" should be positive. "This movie is terrible" should be negative. Invariance: Changing "movie" to "film" should not change the prediction. Changing "I watched in the theater" to "I watched at home" should not change sentiment. Directional: Adding "but the ending was disappointing" to a positive review should reduce the positive score.',
      },
      {
        type: 'code',
        language: 'python',
        code: '# Behavioral test suite example\ndef test_minimum_functionality():\n    """Basic capabilities the model MUST have."""\n    assert model.predict(\'This is great!\') == \'positive\'\n    assert model.predict(\'This is terrible.\') == \'negative\'\n\ndef test_invariance():\n    """Irrelevant changes should NOT affect predictions."""\n    base = model.predict(\'The food was excellent.\')\n    assert model.predict(\'The food was excellent!\') == base  # Punctuation\n    assert model.predict(\'The FOOD was excellent.\') == base  # Capitalization\n\ndef test_directional():\n    """Meaningful changes should produce expected direction."""\n    base_score = model.score(\'Good product.\')\n    modified_score = model.score(\'Good product but broke after a week.\')\n    assert modified_score < base_score  # Adding negative context reduces score',
        caption: 'Example behavioral test suite for a sentiment analysis model.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Metamorphic Testing',
      },
      {
        type: 'definition',
        term: 'Metamorphic Testing',
        definition: 'A testing strategy that verifies relationships between inputs and outputs rather than requiring knowledge of the correct output for each test case. Useful when ground truth is unavailable or expensive, which is common in ML applications.',
      },
      {
        type: 'paragraph',
        text: 'Metamorphic testing addresses the oracle problem by testing relationships between inputs. If a model should be invariant to rotation, rotating an input and checking that the output is unchanged provides a test without needing to know the correct output.',
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'Designing Metamorphic Relations',
        text: 'Start by asking: "What transformations should NOT change the output?" and "What transformations should change the output in a predictable direction?" For image classifiers: rotation, cropping, and brightness should not change the class. For regression models: scaling inputs by a constant should scale outputs proportionally if the relationship is linear.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Stress Testing and Chaos Engineering',
      },
      {
        type: 'paragraph',
        text: 'Stress testing and chaos engineering for ML systems deliberately inject failures, noise, and adversarial conditions to verify system resilience.',
      },
      {
        type: 'list',
        ordered: false,
        items: [
          'Corrupted inputs — Feed null values, extreme outliers, wrong data types to test input validation.',
          'Missing features — Drop random features to verify the model handles missing data gracefully.',
          'Model serving failures — Kill model serving pods to test failover to backup models.',
          'Data pipeline outages — Disconnect the feature store to verify cached/default features are used.',
          'Latency injection — Add artificial delay to model inference to test timeout handling.',
          'Adversarial inputs — Test with known adversarial examples to verify detection and routing.',
        ],
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Test Failures in Staging, Not Production',
        text: 'Chaos engineering is powerful but must be conducted in a controlled staging environment that mirrors production. Never inject failures in production without comprehensive safeguards, automatic rollback, and team readiness. Start with the simplest failure mode (e.g., single pod restart) and gradually increase severity.',
      },
    ],
    order: 3,
    keyConcepts: [
      { term: 'Behavioral Testing', definition: 'A testing approach that validates specific model capabilities through targeted test suites, including invariance, directional, and minimum functionality tests.' },
      { term: 'Metamorphic Testing', definition: 'A testing strategy that verifies relationships between inputs and outputs rather than requiring knowledge of correct outputs for each test case.' },
    ],
  },
  {
    id: 'ch16-s5',
    heading: 'Robustness Engineering Practices',
    body: 'Ensemble methods improve robustness by combining predictions from multiple models. Individual models may be sensitive to specific types of distribution shift, but their errors tend to be uncorrelated. Averaging predictions across an ensemble reduces variance and provides more stable predictions, particularly on out-of-distribution inputs.\n\nData augmentation during training improves robustness by exposing the model to a wider range of input variations. Augmentations should be designed to simulate the types of distribution shift expected in production. For example, adding Gaussian noise simulates sensor noise, while color jittering simulates lighting changes.\n\nCalibration ensures that model confidence scores accurately reflect the true probability of correct prediction. A well-calibrated model that says it is 80% confident should be correct approximately 80% of the time. Temperature scaling and Platt scaling are simple post-hoc calibration methods. Calibrated confidence enables reliable confidence-based routing and better human-AI collaboration.\n\nContinuous monitoring and automated retraining form a feedback loop that maintains robustness over time. When monitoring detects distribution shift or performance degradation, automated retraining pipelines incorporate recent data and produce updated models. This closed-loop approach is more sustainable than manually triggered retraining and responds faster to changes in the deployment environment.',
    blocks: [
      {
        type: 'heading',
        level: 3,
        text: 'Ensemble Methods',
      },
      {
        type: 'definition',
        term: 'Ensemble Methods',
        definition: 'Techniques that combine predictions from multiple independently trained models to improve accuracy and robustness. Because individual models tend to make different errors, averaging their predictions reduces variance and provides more stable outputs, especially on out-of-distribution inputs.',
      },
      {
        type: 'paragraph',
        text: 'Ensemble methods improve robustness by combining predictions from multiple models. Individual models may be sensitive to specific types of distribution shift, but their errors tend to be uncorrelated.',
      },
      {
        type: 'equation',
        latex: '\\hat{y}_{ensemble} = \\frac{1}{M} \\sum_{m=1}^{M} f_m(x)',
        label: 'Equation 16.3: Simple ensemble averaging. The ensemble prediction is the average of M individual model predictions. Variance decreases by a factor of M when errors are uncorrelated.',
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'Diversity Matters More Than Size',
        text: 'An ensemble of 5 diverse models (different architectures, training data splits, or random seeds) provides more robustness than 20 copies of the same architecture. Maximize diversity: use different model families, different feature subsets, or different training epochs. If all ensemble members agree on an OOD input, none of them detected the shift.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Data Augmentation for Robustness',
      },
      {
        type: 'paragraph',
        text: 'Data augmentation during training improves robustness by exposing the model to a wider range of input variations. Augmentations should simulate the types of distribution shift expected in production.',
      },
      {
        type: 'table',
        headers: ['Augmentation', 'Simulates', 'Best For'],
        rows: [
          ['Gaussian noise', 'Sensor noise, signal degradation', 'Audio, time series, sensor data'],
          ['Color jittering', 'Lighting and white balance changes', 'Camera-based vision systems'],
          ['Random crop and resize', 'Varying object scale and position', 'Object detection, classification'],
          ['Mixup / CutMix', 'Class boundary smoothing', 'General robustness and calibration'],
          ['Back-translation', 'Paraphrasing, style variation', 'NLP text classification'],
          ['SpecAugment', 'Acoustic variability', 'Speech recognition'],
        ],
        caption: 'Table 16.5: Data augmentation strategies matched to production distribution shifts.',
      },
      {
        type: 'callout',
        variant: 'note',
        title: 'Augmentation Should Match Deployment',
        text: 'The most effective augmentations simulate the actual distribution shifts your model will encounter. If deploying a vision model in outdoor environments, augment with weather effects (rain, fog, glare) and time-of-day variations. If deploying an NLP model across domains, augment with vocabulary and style variations. Generic augmentation helps, but targeted augmentation based on deployment analysis helps more.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Model Calibration',
      },
      {
        type: 'definition',
        term: 'Model Calibration',
        definition: 'The process of adjusting a model\'s confidence scores so they accurately reflect the true probability of correct prediction. A perfectly calibrated model that reports 80% confidence should be correct approximately 80% of the time across all such predictions.',
      },
      {
        type: 'paragraph',
        text: 'Calibration ensures that model confidence scores accurately reflect the true probability of correct prediction. Temperature scaling and Platt scaling are simple post-hoc calibration methods.',
      },
      {
        type: 'equation',
        latex: 'p_{calibrated} = \\sigma\\left(\\frac{z}{T}\\right)',
        label: 'Equation 16.4: Temperature scaling. The logits z are divided by a learned temperature T > 1 before applying softmax sigma, which "softens" overconfident predictions. T is optimized on the validation set.',
      },
      {
        type: 'callout',
        variant: 'example',
        title: 'Calibration for Human-AI Collaboration',
        text: 'A medical diagnostic model provides predictions with calibrated confidence. When it reports >95% confidence, doctors trust the prediction and move quickly. When it reports 60-80% confidence, doctors examine the case more carefully. When it reports <50% confidence, the case is flagged for specialist review. This tiered workflow is only possible because the confidence scores are calibrated — uncalibrated scores would mislead the clinical workflow.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Continuous Monitoring and Retraining',
      },
      {
        type: 'paragraph',
        text: 'Continuous monitoring and automated retraining form a feedback loop that maintains robustness over time. This closed-loop approach is more sustainable than manually triggered retraining.',
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Retraining Is Not Free',
        text: 'Automated retraining pipelines must include validation gates that prevent deploying a model that is worse than the current production model. Always compare the retrained model against the production model on both recent data and a stable holdout set. Without these gates, retraining on noisy or corrupted recent data can degrade production quality.',
      },
    ],
    order: 4,
    keyConcepts: [
      { term: 'Model Calibration', definition: 'The process of adjusting model confidence scores so they accurately reflect the true probability of correct prediction.' },
      { term: 'Ensemble Methods', definition: 'Techniques that combine predictions from multiple models to improve accuracy and robustness through error diversification.' },
    ],
  },
];

export const glossary: GlossaryTerm[] = [
  { term: 'Distribution Shift', definition: 'The difference between training and production data distributions that can degrade model performance.' },
  { term: 'Graceful Degradation', definition: 'System design that maintains partial functionality when components fail rather than complete system failure.' },
  { term: 'Robustness', definition: 'The ability of an ML model to maintain performance under input perturbations, distribution shift, and adversarial conditions.' },
  { term: 'OOD Detection', definition: 'Out-of-Distribution detection, methods for identifying inputs significantly different from the training data.' },
  { term: 'Calibration', definition: 'Adjusting model confidence scores to accurately reflect true prediction probabilities.' },
  { term: 'Behavioral Testing', definition: 'Testing specific model capabilities through invariance, directional expectation, and minimum functionality tests.' },
];

export const keyTakeaways: string[] = [
  'ML reliability requires graceful degradation with fallback systems rather than brittle all-or-nothing designs.',
  'Distribution shift is inevitable in production; systems must detect and adapt to changes in data distributions over time.',
  'Behavioral and metamorphic testing complement traditional testing by validating learned model behaviors.',
  'Model calibration enables reliable confidence-based routing and better human-AI decision collaboration.',
  'Continuous monitoring and automated retraining form a feedback loop that maintains robustness over time.',
];

export const learningObjectives: string[] = [
  'Explain how SRE principles apply to ML systems including SLOs for model quality and error budgets',
  'Design graceful degradation strategies with fallback systems for ML service failures',
  'Analyze types of distribution shift and implement appropriate detection and response mechanisms',
  'Evaluate behavioral and metamorphic testing approaches for validating ML model correctness',
  'Implement model calibration techniques to produce reliable confidence scores for downstream decision-making',
];
