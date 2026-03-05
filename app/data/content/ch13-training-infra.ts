import type { ChapterSection, GlossaryTerm } from '~/types/chapter';

export const sections: ChapterSection[] = [
  {
    id: 'ch13-s1',
    heading: 'CI/CD for Machine Learning',
    body: 'Continuous Integration and Continuous Delivery for ML extends traditional CI/CD practices to handle the unique challenges of ML systems. Unlike conventional software where changes are primarily code-based, ML systems must also manage changes to data, model configurations, hyperparameters, and training environments.\n\nML CI pipelines validate code changes through unit tests, integration tests, and data validation checks. They also verify that model training can complete successfully and that model quality meets minimum thresholds. These checks prevent regressions from entering the main branch and catch issues early in the development cycle.\n\nML CD pipelines automate the progression from a validated model to production deployment. This typically involves model packaging, deployment to a staging environment, shadow mode evaluation (running alongside the production model without serving predictions), canary deployment (serving a small percentage of traffic), and gradual rollout to full production.\n\nAutomated pipelines must handle ML-specific concerns like data dependency management, training reproducibility, and model artifact tracking. Tools like Kubeflow Pipelines, MLflow, and Vertex AI Pipelines provide ML-aware pipeline orchestration that integrates with model registries, feature stores, and monitoring systems.',
    blocks: [
      {
        type: 'paragraph',
        text: 'Continuous Integration and Continuous Delivery for ML extends traditional CI/CD practices to handle the unique challenges of ML systems. Unlike conventional software where changes are primarily code-based, ML systems must also manage changes to data, model configurations, hyperparameters, and training environments.',
      },
      {
        type: 'definition',
        term: 'ML CI/CD',
        definition: 'Continuous Integration and Continuous Delivery practices adapted for machine learning systems, which must validate not only code changes but also data quality, model performance, and configuration consistency through automated pipelines.',
      },
      {
        type: 'figure',
        caption: 'ML training infrastructure pipeline. From data ingestion through feature engineering, training, validation, model registry, to deployment, with resource requirements at each stage.',
        alt: 'Pipeline diagram showing ML training infrastructure stages as connected boxes, with Kubernetes pods, GPU clusters, and artifact storage components labeled.',
        number: 'Figure 13.1',
        component: 'TrainingInfrastructure',
      },
      {
        type: 'callout',
        variant: 'note',
        title: 'Beyond Code Changes',
        text: 'Traditional CI/CD only needs to handle code changes. ML CI/CD must also detect and validate changes in data schemas, feature distributions, hyperparameter configurations, and training environments. A change to the training data can break a model just as easily as a code bug.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'ML Continuous Integration',
      },
      {
        type: 'paragraph',
        text: 'ML CI pipelines validate code changes through unit tests, integration tests, and data validation checks. They also verify that model training can complete successfully and that model quality meets minimum thresholds. These checks prevent regressions from entering the main branch and catch issues early in the development cycle.',
      },
      {
        type: 'list',
        ordered: true,
        items: [
          'Code validation — Lint, type-check, and unit-test all pipeline code.',
          'Data validation — Check schema conformance, distribution statistics, and missing value rates.',
          'Training smoke test — Run a short training loop to verify convergence on a small data subset.',
          'Model quality gate — Ensure metrics (accuracy, loss) meet minimum thresholds on a held-out validation set.',
          'Integration test — Verify the full pipeline from data loading through prediction output.',
        ],
      },
      {
        type: 'heading',
        level: 3,
        text: 'ML Continuous Delivery',
      },
      {
        type: 'paragraph',
        text: 'ML CD pipelines automate the progression from a validated model to production deployment. This typically involves model packaging, deployment to a staging environment, shadow mode evaluation, canary deployment, and gradual rollout to full production.',
      },
      {
        type: 'table',
        headers: ['Deployment Stage', 'Description', 'Risk Level', 'Rollback Strategy'],
        rows: [
          ['Shadow Mode', 'New model runs alongside production; predictions logged but not served', 'Zero', 'Simply disable shadow model'],
          ['Canary', 'New model serves 1-5% of live traffic', 'Low', 'Route all traffic back to old model'],
          ['Gradual Rollout', 'Incrementally increase traffic (10% -> 25% -> 50% -> 100%)', 'Medium', 'Reduce traffic share; revert if metrics drop'],
          ['Full Production', 'New model serves 100% of traffic', 'High', 'Immediate rollback to previous version'],
        ],
        caption: 'Table 13.1: Progressive deployment stages for ML models.',
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'Shadow Mode First',
        text: 'Always deploy new models in shadow mode before serving live traffic. Shadow mode lets you compare the new model\'s predictions against the production model on real data without any user impact. This catches issues that offline evaluation misses, such as latency problems or unexpected prediction distributions.',
      },
      {
        type: 'paragraph',
        text: 'Automated pipelines must handle ML-specific concerns like data dependency management, training reproducibility, and model artifact tracking. Tools like Kubeflow Pipelines, MLflow, and Vertex AI Pipelines provide ML-aware pipeline orchestration.',
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Reproducibility Is Non-Negotiable',
        text: 'Every model deployed to production must be reproducible. Pin random seeds, record the exact data version (not just "latest"), snapshot the training environment as a container image, and store the full configuration alongside the model artifact. Without reproducibility, debugging production issues becomes nearly impossible.',
      },
    ],
    order: 0,
    keyConcepts: [
      { term: 'ML CI/CD', definition: 'Continuous Integration and Delivery practices adapted for ML systems, handling automated testing, validation, and deployment of models alongside code changes.' },
      { term: 'Shadow Mode', definition: 'A deployment strategy where a new model runs alongside the production model, receiving real traffic but not serving predictions, to evaluate performance safely.' },
    ],
  },
  {
    id: 'ch13-s2',
    heading: 'Experiment Tracking at Scale',
    body: 'As ML teams grow and projects multiply, experiment tracking evolves from an individual tool into a critical organizational capability. Enterprise experiment tracking must support multiple teams, projects, and environments while providing cross-cutting visibility into resource usage, model lineage, and comparative analysis.\n\nScalable experiment tracking platforms like Weights & Biases, MLflow, and Neptune organize experiments into projects and workspaces with role-based access control. They provide APIs for programmatic logging, rich dashboards for visualization, and integrations with training frameworks that minimize the effort required to instrument code.\n\nMetadata management becomes increasingly important at scale. Every experiment should capture the complete context: code version, data version, environment specification, hyperparameters, hardware configuration, and dependencies. This metadata enables debugging of failures, reproduction of successful experiments, and automated analysis of what factors correlate with model improvements.\n\nExperiment analytics across thousands of runs can reveal patterns invisible in individual experiments. Hyperparameter importance analysis identifies which settings matter most. Learning curve analysis helps predict when training should be stopped. Cross-experiment comparison reveals which architectural choices consistently perform well across different data conditions.',
    blocks: [
      {
        type: 'paragraph',
        text: 'As ML teams grow and projects multiply, experiment tracking evolves from an individual tool into a critical organizational capability. Enterprise experiment tracking must support multiple teams, projects, and environments while providing cross-cutting visibility into resource usage, model lineage, and comparative analysis.',
      },
      {
        type: 'definition',
        term: 'Experiment Tracking',
        definition: 'The systematic recording and organization of all parameters, metrics, artifacts, and metadata associated with ML training runs, enabling reproducibility, comparison, and knowledge sharing across teams.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Scalable Tracking Platforms',
      },
      {
        type: 'paragraph',
        text: 'Scalable experiment tracking platforms like Weights & Biases, MLflow, and Neptune organize experiments into projects and workspaces with role-based access control. They provide APIs for programmatic logging, rich dashboards for visualization, and integrations with training frameworks that minimize the effort required to instrument code.',
      },
      {
        type: 'table',
        headers: ['Platform', 'Deployment', 'Key Strengths', 'Best For'],
        rows: [
          ['Weights & Biases', 'Cloud SaaS or self-hosted', 'Rich visualization, hyperparameter sweeps, report sharing', 'Teams needing collaborative analysis and experiment dashboards'],
          ['MLflow', 'Self-hosted (open source)', 'Model registry, flexible backend, wide framework support', 'Organizations preferring open-source and on-premise control'],
          ['Neptune', 'Cloud SaaS or self-hosted', 'Custom metadata, comparison views, team workspaces', 'Research teams needing flexible experiment organization'],
          ['Vertex AI Experiments', 'GCP managed', 'Tight GCP integration, pipeline tracking, autologging', 'Teams already invested in the Google Cloud ecosystem'],
        ],
        caption: 'Table 13.2: Popular experiment tracking platforms compared.',
      },
      {
        type: 'code',
        language: 'python',
        code: 'import wandb\n\n# Initialize experiment tracking\nwandb.init(\n    project=\'image-classification\',\n    config={\n        \'learning_rate\': 3e-4,\n        \'batch_size\': 128,\n        \'architecture\': \'resnet50\',\n        \'dataset\': \'imagenet-v2.3\',\n        \'optimizer\': \'adamw\',\n    }\n)\n\n# Log metrics during training\nfor epoch in range(num_epochs):\n    train_loss = train_one_epoch(model, loader)\n    val_acc = evaluate(model, val_loader)\n    wandb.log({\'train_loss\': train_loss, \'val_acc\': val_acc, \'epoch\': epoch})',
        caption: 'Example: Instrumenting training code with Weights & Biases for experiment tracking.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Metadata Management',
      },
      {
        type: 'paragraph',
        text: 'Metadata management becomes increasingly important at scale. Every experiment should capture the complete context: code version, data version, environment specification, hyperparameters, hardware configuration, and dependencies.',
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'The "Which Run Was That?" Problem',
        text: 'Without comprehensive metadata, teams inevitably encounter the situation where a promising result cannot be reproduced because no one recorded the exact data version, random seed, or environment configuration. Capture metadata automatically through framework integrations rather than relying on manual logging.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Experiment Analytics at Scale',
      },
      {
        type: 'paragraph',
        text: 'Experiment analytics across thousands of runs can reveal patterns invisible in individual experiments. Hyperparameter importance analysis identifies which settings matter most. Learning curve analysis helps predict when training should be stopped.',
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'Automated Hyperparameter Importance',
        text: 'After running a hyperparameter sweep, use tools like Weights & Biases\' parameter importance plots or SHAP analysis on your sweep results. These often reveal that only 2-3 hyperparameters meaningfully affect final performance, letting you fix the rest and focus tuning effort where it matters.',
      },
    ],
    order: 1,
    keyConcepts: [
      { term: 'Experiment Tracking', definition: 'The systematic recording of all parameters, metrics, artifacts, and metadata associated with ML training runs for reproducibility and analysis.' },
      { term: 'Metadata Management', definition: 'The practice of capturing and organizing contextual information about experiments, including code versions, data versions, and environment specifications.' },
    ],
  },
  {
    id: 'ch13-s3',
    heading: 'Model Monitoring and Observability',
    body: 'Model monitoring extends traditional software monitoring to track ML-specific metrics like prediction quality, feature distributions, and model behavior over time. Unlike software bugs that typically cause immediate failures, model degradation can be gradual and silent, making proactive monitoring essential.\n\nKey monitoring dimensions include data drift (changes in input feature distributions), concept drift (changes in the relationship between features and targets), prediction drift (changes in output distributions), and performance drift (changes in model accuracy against ground truth). Each type of drift requires different detection methods and may warrant different responses.\n\nStatistical methods for drift detection include the Kolmogorov-Smirnov test, Population Stability Index (PSI), and Jensen-Shannon divergence for continuous features; chi-squared tests for categorical features; and multivariate methods like Maximum Mean Discrepancy (MMD) for detecting complex distributional shifts.\n\nAlerting and response automation connect drift detection to remediation actions. Minor drift may trigger alerts for human review. Moderate drift may automatically initiate model retraining with recent data. Severe drift may trigger automatic rollback to a previous model version. Defining appropriate thresholds and response policies requires collaboration between ML engineers and domain experts.',
    blocks: [
      {
        type: 'paragraph',
        text: 'Model monitoring extends traditional software monitoring to track ML-specific metrics like prediction quality, feature distributions, and model behavior over time. Unlike software bugs that typically cause immediate failures, model degradation can be gradual and silent, making proactive monitoring essential.',
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Silent Model Failure',
        text: 'The most dangerous aspect of ML model degradation is that the system continues to produce outputs — they are simply wrong. A software crash triggers an immediate alert. A model that slowly loses accuracy continues serving predictions with no error signal. This is why proactive monitoring with statistical drift detection is essential, not optional.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Monitoring Dimensions',
      },
      {
        type: 'paragraph',
        text: 'Key monitoring dimensions include data drift, concept drift, prediction drift, and performance drift. Each type of drift requires different detection methods and may warrant different responses.',
      },
      {
        type: 'table',
        headers: ['Drift Type', 'What Changes', 'Detection Method', 'Typical Response'],
        rows: [
          ['Data Drift', 'Input feature distributions', 'KS test, PSI, JS divergence', 'Alert; investigate data pipeline'],
          ['Concept Drift', 'Feature-target relationship', 'Performance monitoring with ground truth', 'Retrain model on recent data'],
          ['Prediction Drift', 'Output distribution', 'Distribution comparison of predictions', 'Alert; compare with data drift signals'],
          ['Performance Drift', 'Model accuracy metrics', 'Metric tracking against thresholds', 'Rollback or retrain depending on severity'],
        ],
        caption: 'Table 13.3: Types of drift in production ML systems.',
      },
      {
        type: 'definition',
        term: 'Data Drift',
        definition: 'Changes in the statistical distribution of input features over time. Data drift can degrade model performance even when the underlying relationship between features and targets remains unchanged, because the model encounters inputs outside its training distribution.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Statistical Detection Methods',
      },
      {
        type: 'paragraph',
        text: 'Statistical methods for drift detection include the Kolmogorov-Smirnov test, Population Stability Index (PSI), and Jensen-Shannon divergence for continuous features; chi-squared tests for categorical features; and multivariate methods like Maximum Mean Discrepancy (MMD) for detecting complex distributional shifts.',
      },
      {
        type: 'equation',
        latex: 'PSI = \\sum_{i=1}^{n} (p_i - q_i) \\cdot \\ln\\left(\\frac{p_i}{q_i}\\right)',
        label: 'Equation 13.1: Population Stability Index (PSI), where p and q are the proportion of observations in each bin for the reference and current distributions. PSI < 0.1 indicates no significant drift; PSI > 0.25 indicates significant drift.',
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'PSI Thresholds in Practice',
        text: 'For PSI-based drift detection: PSI < 0.1 means no meaningful change — no action needed. PSI between 0.1 and 0.25 means moderate shift — investigate and monitor closely. PSI > 0.25 means significant drift — trigger retraining or rollback. These thresholds are guidelines; calibrate them to your specific use case.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Automated Response',
      },
      {
        type: 'paragraph',
        text: 'Alerting and response automation connect drift detection to remediation actions. Defining appropriate thresholds and response policies requires collaboration between ML engineers and domain experts.',
      },
      {
        type: 'callout',
        variant: 'example',
        title: 'Automated Drift Response Pipeline',
        text: 'A credit scoring model monitors PSI on all input features hourly. When PSI for the "income" feature exceeds 0.25, the system automatically: (1) sends an alert to the ML team Slack channel, (2) captures a snapshot of the current data distribution for analysis, (3) triggers a retraining job using the last 90 days of data, and (4) deploys the retrained model in shadow mode for 48 hours before promoting.',
      },
    ],
    order: 2,
    keyConcepts: [
      { term: 'Data Drift', definition: 'Changes in the statistical distribution of input features over time, which can degrade model performance even when the model itself has not changed.' },
      { term: 'Concept Drift', definition: 'Changes in the underlying relationship between input features and the target variable, requiring model retraining to maintain accuracy.' },
    ],
  },
  {
    id: 'ch13-s4',
    heading: 'Drift Detection and Response',
    body: 'Drift detection is the practice of continuously monitoring for distributional changes that could impact model performance. Effective drift detection requires establishing a baseline distribution from the training or validation data and comparing incoming production data against this baseline.\n\nWindow-based drift detection compares statistics computed over a recent window of production data to the baseline. The window size controls the trade-off between detection sensitivity and false positive rate: smaller windows detect drift faster but are noisier. Adaptive windowing algorithms like ADWIN automatically adjust window size based on observed change rates.\n\nFeature-level monitoring tracks each input feature independently, while model-level monitoring tracks the joint distribution of features and predictions. Feature-level monitoring is simpler and more interpretable but may miss changes that only appear in feature interactions. Model-level monitoring captures these interactions but is harder to diagnose.\n\nResponse strategies depend on the severity and type of drift detected. Retraining with recent data is the most common response, but it requires maintaining a reliable retraining pipeline. In cases of sudden, severe drift, it may be better to fall back to a simpler model or rule-based system while investigating the root cause. The monitoring system should integrate with the CI/CD pipeline to enable automated response actions.',
    blocks: [
      {
        type: 'paragraph',
        text: 'Drift detection is the practice of continuously monitoring for distributional changes that could impact model performance. Effective drift detection requires establishing a baseline distribution from the training or validation data and comparing incoming production data against this baseline.',
      },
      {
        type: 'definition',
        term: 'Drift Detection',
        definition: 'Automated statistical methods for identifying changes in data distributions or model behavior relative to a baseline, enabling early warning of performance degradation before it impacts users.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Window-Based Detection',
      },
      {
        type: 'paragraph',
        text: 'Window-based drift detection compares statistics computed over a recent window of production data to the baseline. The window size controls the trade-off between detection sensitivity and false positive rate: smaller windows detect drift faster but are noisier.',
      },
      {
        type: 'callout',
        variant: 'note',
        title: 'The Window Size Trade-off',
        text: 'A 1-hour window detects drift within hours but may produce false positives from normal hourly variation (e.g., business hours vs. night traffic). A 7-day window is more stable but takes a week to detect even severe drift. Adaptive windowing algorithms like ADWIN solve this by automatically adjusting the window based on observed change rates.',
      },
      {
        type: 'definition',
        term: 'ADWIN',
        definition: 'Adaptive Windowing, an algorithm that maintains a variable-length window of recent observations and automatically shrinks the window when a statistically significant change is detected, enabling fast detection of drift at multiple time scales.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Feature-Level vs. Model-Level Monitoring',
      },
      {
        type: 'paragraph',
        text: 'Feature-level monitoring tracks each input feature independently, while model-level monitoring tracks the joint distribution of features and predictions. Feature-level monitoring is simpler and more interpretable but may miss changes that only appear in feature interactions.',
      },
      {
        type: 'table',
        headers: ['Monitoring Approach', 'Granularity', 'Interpretability', 'Interaction Detection', 'Computational Cost'],
        rows: [
          ['Feature-level (univariate)', 'Per feature', 'High — pinpoints which feature drifted', 'Misses feature interactions', 'Low — O(n) for n features'],
          ['Model-level (multivariate)', 'All features jointly', 'Low — detects drift but hard to diagnose', 'Captures all interactions', 'High — scales with dimensionality'],
          ['Prediction-level', 'Model output', 'Medium — shows effect but not cause', 'Captures downstream impact', 'Low — single distribution'],
        ],
        caption: 'Table 13.4: Monitoring approaches compared.',
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'Layered Monitoring Strategy',
        text: 'Use all three monitoring levels together. Prediction-level monitoring is your first alert that something is wrong. Feature-level monitoring diagnoses which input changed. Model-level monitoring catches interaction effects that per-feature monitoring misses. This layered approach provides both early warning and diagnostic capability.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Response Strategies',
      },
      {
        type: 'paragraph',
        text: 'Response strategies depend on the severity and type of drift detected. Retraining with recent data is the most common response, but it requires maintaining a reliable retraining pipeline. In cases of sudden, severe drift, it may be better to fall back to a simpler model or rule-based system while investigating the root cause.',
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Don\'t Blindly Retrain on Drifted Data',
        text: 'Automated retraining is powerful but dangerous if the drift represents a data quality issue rather than a genuine distribution shift. Retraining on corrupted data embeds the corruption into the model. Always include data validation checks in the retraining pipeline, and hold back a stable test set that is not affected by the drift.',
      },
      {
        type: 'callout',
        variant: 'example',
        title: 'Sudden Drift: When to Fall Back',
        text: 'A fraud detection model sees PSI spike to 0.8 on transaction amount features after a payment processor changes its API format, doubling all values. Retraining on this data would learn incorrect patterns. The correct response is to fall back to a rule-based system, fix the data pipeline, and then retrain once the input data is correct.',
      },
    ],
    order: 3,
    keyConcepts: [
      { term: 'Drift Detection', definition: 'Automated statistical methods for identifying changes in data distributions or model behavior that could indicate degraded performance.' },
      { term: 'ADWIN', definition: 'Adaptive Windowing, an algorithm that automatically adjusts its monitoring window size to detect distributional changes at different time scales.' },
    ],
  },
  {
    id: 'ch13-s5',
    heading: 'MLOps Platform Architecture',
    body: 'A comprehensive MLOps platform integrates experiment tracking, pipeline orchestration, model registry, feature store, monitoring, and deployment management into a cohesive system. The architecture of this platform determines how effectively teams can develop, deploy, and maintain ML models at scale.\n\nPlatform architecture decisions include build versus buy (custom platform vs. managed services), centralized versus decentralized (shared platform team vs. team-specific tools), and open versus proprietary (open-source stack vs. vendor solutions). Each choice has implications for flexibility, cost, maintenance burden, and team productivity.\n\nOpen-source MLOps stacks typically combine tools like MLflow (experiment tracking), Kubeflow (pipeline orchestration), Feast (feature store), Seldon Core (model serving), and Prometheus/Grafana (monitoring). These components are powerful individually but require significant integration effort. Managed platforms from cloud providers (SageMaker, Vertex AI, Azure ML) provide tighter integration at the cost of vendor lock-in.\n\nThe maturity of an organization\'s MLOps practice can be assessed along dimensions like automation level, reproducibility, monitoring coverage, and deployment velocity. Google\'s MLOps maturity model defines three levels: ML Level 0 (manual process), ML Level 1 (ML pipeline automation), and ML Level 2 (CI/CD pipeline automation). Most organizations are still at Level 0 or early Level 1.',
    blocks: [
      {
        type: 'paragraph',
        text: 'A comprehensive MLOps platform integrates experiment tracking, pipeline orchestration, model registry, feature store, monitoring, and deployment management into a cohesive system. The architecture of this platform determines how effectively teams can develop, deploy, and maintain ML models at scale.',
      },
      {
        type: 'definition',
        term: 'MLOps Platform',
        definition: 'An integrated system combining experiment tracking, pipeline orchestration, model registry, feature store, serving infrastructure, and monitoring to support the complete machine learning lifecycle from development through production operations.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Build vs. Buy Decisions',
      },
      {
        type: 'paragraph',
        text: 'Platform architecture decisions include build versus buy, centralized versus decentralized, and open versus proprietary. Each choice has implications for flexibility, cost, maintenance burden, and team productivity.',
      },
      {
        type: 'table',
        headers: ['Decision', 'Option A', 'Option B', 'Key Consideration'],
        rows: [
          ['Build vs. Buy', 'Custom platform (OSS tools)', 'Managed service (cloud vendor)', 'Integration effort vs. vendor lock-in'],
          ['Centralized vs. Decentralized', 'Shared platform team', 'Team-specific tool choices', 'Consistency vs. autonomy'],
          ['Open vs. Proprietary', 'Open-source stack', 'Vendor solutions', 'Flexibility vs. support and polish'],
        ],
        caption: 'Table 13.5: Key MLOps platform architecture decisions.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Open-Source vs. Managed Stacks',
      },
      {
        type: 'paragraph',
        text: 'Open-source MLOps stacks typically combine tools like MLflow (experiment tracking), Kubeflow (pipeline orchestration), Feast (feature store), Seldon Core (model serving), and Prometheus/Grafana (monitoring). These components are powerful individually but require significant integration effort.',
      },
      {
        type: 'list',
        ordered: false,
        items: [
          'MLflow — Experiment tracking, model registry, and model packaging.',
          'Kubeflow Pipelines — Kubernetes-native ML pipeline orchestration.',
          'Feast — Feature store for consistent feature serving across training and inference.',
          'Seldon Core / KServe — Model serving with scaling, monitoring, and A/B testing.',
          'Prometheus + Grafana — Metrics collection, alerting, and visualization.',
          'DVC — Data versioning and pipeline management for reproducibility.',
        ],
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'Start Small, Grow Incrementally',
        text: 'Don\'t try to build a complete MLOps platform from day one. Start with experiment tracking and a model registry (MLflow is a great starting point). Add pipeline orchestration when manual processes become painful. Add a feature store when training-serving skew becomes a problem. Each component should solve a real, observed pain point.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'MLOps Maturity Model',
      },
      {
        type: 'paragraph',
        text: 'The maturity of an organization\'s MLOps practice can be assessed along dimensions like automation level, reproducibility, monitoring coverage, and deployment velocity. Google\'s MLOps maturity model defines three levels.',
      },
      {
        type: 'table',
        headers: ['Maturity Level', 'Description', 'Characteristics', 'Typical Deployment Frequency'],
        rows: [
          ['Level 0: Manual', 'Manual, script-driven process', 'No pipeline automation, manual deployment, limited tracking', 'Monthly or less'],
          ['Level 1: Pipeline Automation', 'Automated training pipelines', 'Automated retraining, model registry, basic monitoring', 'Weekly'],
          ['Level 2: CI/CD Automation', 'Full CI/CD for ML', 'Automated testing, deployment, monitoring, and rollback', 'Daily or on-demand'],
        ],
        caption: 'Table 13.6: Google\'s MLOps maturity model.',
      },
      {
        type: 'callout',
        variant: 'note',
        title: 'Where Most Organizations Stand',
        text: 'Despite the growing sophistication of MLOps tooling, surveys consistently show that most organizations remain at Level 0 (manual) or early Level 1. The gap between available tools and adopted practices represents both a challenge and an opportunity for ML teams to gain competitive advantage through operational excellence.',
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Avoid Tool Sprawl',
        text: 'The MLOps ecosystem has hundreds of tools, and it is tempting to adopt many of them. Resist this urge. Each additional tool in your stack adds integration complexity, maintenance burden, and cognitive load. Choose a cohesive set of tools that work well together, and commit to them.',
      },
    ],
    order: 4,
    keyConcepts: [
      { term: 'MLOps Platform', definition: 'An integrated system combining experiment tracking, pipeline orchestration, model management, and monitoring to support the complete ML lifecycle.' },
      { term: 'MLOps Maturity Model', definition: 'A framework for assessing the automation and sophistication level of an organization\'s ML operations practices, from manual to fully automated.' },
    ],
  },
];

export const glossary: GlossaryTerm[] = [
  { term: 'MLOps', definition: 'The practices and tools for automating and managing the ML lifecycle from development through production operation.' },
  { term: 'Data Drift', definition: 'Statistical changes in input feature distributions that can degrade model performance over time.' },
  { term: 'Concept Drift', definition: 'Changes in the relationship between features and targets that require model retraining to maintain accuracy.' },
  { term: 'Model Registry', definition: 'A centralized versioned repository for managing trained model artifacts and their lifecycle stages.' },
  { term: 'Canary Deployment', definition: 'A gradual deployment strategy that routes a small percentage of traffic to a new model to validate behavior before full rollout.' },
  { term: 'Feature Store', definition: 'A centralized system for managing and serving ML features consistently across training and serving environments.' },
];

export const keyTakeaways: string[] = [
  'ML CI/CD must handle data, model, and configuration changes alongside traditional code changes.',
  'Model degradation can be gradual and silent, making proactive monitoring with drift detection essential.',
  'Data drift and concept drift require different detection methods and may warrant different response strategies.',
  'Experiment tracking at scale becomes a critical organizational capability for collaboration and knowledge management.',
  'MLOps maturity progresses from manual processes through pipeline automation to full CI/CD for ML.',
];

export const learningObjectives: string[] = [
  'Design CI/CD pipelines that validate code, data, and model quality for ML systems',
  'Compare experiment tracking platforms and implement structured logging for team-scale ML development',
  'Implement monitoring and observability strategies that detect model degradation in production',
  'Analyze data drift and concept drift detection methods and their appropriate response strategies',
  'Evaluate MLOps platform architectures and select tools appropriate for organizational maturity level',
];
