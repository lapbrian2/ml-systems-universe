import type { ChapterSection, GlossaryTerm } from '@/types/chapter';

export const sections: ChapterSection[] = [
  {
    id: 'ch13-s1',
    heading: 'CI/CD for Machine Learning',
    body: 'Continuous Integration and Continuous Delivery for ML extends traditional CI/CD practices to handle the unique challenges of ML systems. Unlike conventional software where changes are primarily code-based, ML systems must also manage changes to data, model configurations, hyperparameters, and training environments.\n\nML CI pipelines validate code changes through unit tests, integration tests, and data validation checks. They also verify that model training can complete successfully and that model quality meets minimum thresholds. These checks prevent regressions from entering the main branch and catch issues early in the development cycle.\n\nML CD pipelines automate the progression from a validated model to production deployment. This typically involves model packaging, deployment to a staging environment, shadow mode evaluation (running alongside the production model without serving predictions), canary deployment (serving a small percentage of traffic), and gradual rollout to full production.\n\nAutomated pipelines must handle ML-specific concerns like data dependency management, training reproducibility, and model artifact tracking. Tools like Kubeflow Pipelines, MLflow, and Vertex AI Pipelines provide ML-aware pipeline orchestration that integrates with model registries, feature stores, and monitoring systems.',
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
