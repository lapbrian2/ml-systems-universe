import type { ChapterSection, GlossaryTerm } from '@/types/chapter';

export const sections: ChapterSection[] = [
  {
    id: 'ch16-s1',
    heading: 'Building Reliable ML Systems',
    body: 'Reliability in ML systems means consistently producing correct outputs under expected conditions and degrading gracefully under unexpected conditions. Unlike traditional software where correctness is binary, ML systems operate on a spectrum of quality, making reliability a more nuanced engineering challenge.\n\nReliability engineering for ML draws on principles from site reliability engineering (SRE) and adapts them for the unique characteristics of ML systems. Key practices include defining service level objectives for model quality, implementing automated testing at multiple levels, and establishing incident response procedures specific to model failures.\n\nThe reliability of an ML system depends on every component in the pipeline: data collection, preprocessing, model inference, postprocessing, and integration with downstream systems. A failure at any point can corrupt outputs. Reliability engineering must address all these components with appropriate testing, monitoring, and redundancy.\n\nMean time between failures (MTBF) and mean time to recovery (MTTR) are key reliability metrics. For ML systems, "failure" might mean model accuracy dropping below a threshold rather than a complete system crash. Reducing MTTR through automated detection, diagnosis, and rollback is often more achievable than preventing all failures.',
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
