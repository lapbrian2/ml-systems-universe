import type { ChapterSection, GlossaryTerm } from '~/types/chapter';

export const sections: ChapterSection[] = [
  {
    id: 'ch05-s1',
    heading: 'The ML Development Lifecycle',
    body: 'The ML development lifecycle provides a structured methodology for taking models from concept to production. Unlike traditional software development, ML development is fundamentally experimental: success requires systematic iteration across data preparation, model development, training, evaluation, and deployment stages.\n\nThe lifecycle begins with problem formulation, where engineers define the task, success metrics, and constraints. This stage is often underestimated but is critical for project success. A well-defined problem includes clear performance requirements, latency budgets, data availability assessments, and success criteria that align with business objectives.\n\nAfter problem formulation, the lifecycle moves through iterative cycles of data preparation, feature engineering, model selection, training, and evaluation. Each cycle produces artifacts: processed datasets, trained model weights, evaluation reports, and configuration files. Managing these artifacts with proper versioning and metadata is essential for reproducibility.\n\nThe deployment phase marks the transition from experimentation to production. This involves packaging the model, setting up serving infrastructure, implementing monitoring, and establishing feedback loops for continuous improvement. The lifecycle does not end at deployment; production models require ongoing monitoring, maintenance, and periodic retraining to maintain performance as the world changes.',
    order: 0,
    keyConcepts: [
      { term: 'ML Lifecycle', definition: 'The structured sequence of stages from problem definition through data preparation, model development, deployment, and monitoring that governs ML project development.' },
      { term: 'Problem Formulation', definition: 'The critical first stage of ML development where the task, success metrics, constraints, and data requirements are precisely defined.' },
    ],
  },
  {
    id: 'ch05-s2',
    heading: 'Experiment Tracking and Management',
    body: 'Experiment tracking is the systematic recording of all parameters, metrics, and artifacts associated with each training run. Without proper tracking, ML teams quickly lose the ability to reproduce results, compare approaches, or understand why certain configurations worked better than others.\n\nModern experiment tracking platforms like MLflow, Weights & Biases, and Neptune provide centralized dashboards for logging hyperparameters, training curves, evaluation metrics, and model artifacts. These tools enable teams to search, filter, and compare across hundreds of experiments, dramatically accelerating the development cycle.\n\nEffective experiment tracking requires discipline in logging practices. Every run should record the complete configuration: model architecture, hyperparameters, data version, random seeds, framework version, and hardware environment. This metadata enables exact reproduction of any experiment and provides a searchable history of what has been tried.\n\nBeyond individual experiments, tracking systems support collaborative workflows where multiple team members contribute experiments toward shared objectives. Features like experiment groups, tags, and notes help organize work across team members. Integration with version control ensures that code changes are linked to experimental results, creating a complete audit trail from code to metrics.',
    order: 1,
    keyConcepts: [
      { term: 'Experiment Tracking', definition: 'The systematic recording and organization of all parameters, metrics, code versions, and artifacts from ML training runs to enable reproducibility and comparison.' },
      { term: 'MLflow', definition: 'An open-source platform for managing the ML lifecycle, providing experiment tracking, model packaging, and deployment capabilities.' },
    ],
  },
  {
    id: 'ch05-s3',
    heading: 'Reproducibility in ML',
    body: 'Reproducibility is the ability to obtain consistent results when repeating an experiment under the same conditions. In ML, achieving reproducibility is surprisingly difficult due to sources of non-determinism in hardware, software, and the training process itself.\n\nSources of non-determinism include random weight initialization, data shuffling, GPU floating-point operation ordering, and framework-level optimizations that sacrifice determinism for performance. Achieving bit-for-bit reproducibility often requires disabling these optimizations, which can significantly impact training speed.\n\nPractical reproducibility focuses on controlling the factors that meaningfully impact results. Setting random seeds, version-pinning dependencies, using deterministic data loading, and documenting the hardware environment cover the most important sources of variation. The goal is not perfect reproducibility but sufficient reproducibility to validate claims and debug issues.\n\nVersion control for ML extends beyond code to include data, configurations, and model artifacts. Tools like DVC (Data Version Control) track large datasets and model files alongside code, enabling teams to switch between different versions of their entire ML pipeline. This infrastructure is essential for maintaining reproducibility across team members and over time.',
    order: 2,
    keyConcepts: [
      { term: 'Reproducibility', definition: 'The ability to obtain consistent experimental results when repeating a procedure under the same conditions, a fundamental requirement for scientific ML development.' },
      { term: 'DVC', definition: 'Data Version Control, a tool that extends Git to handle large files and datasets, enabling versioning of data and models alongside code.' },
    ],
  },
  {
    id: 'ch05-s4',
    heading: 'MLOps Workflow Methodology',
    body: 'MLOps brings DevOps principles to machine learning, establishing practices for continuous integration, delivery, and training of ML models. The goal is to reduce the time and friction involved in moving models from development to production while maintaining quality and reliability.\n\nA mature MLOps workflow automates the progression from code changes through testing, training, evaluation, and deployment. Continuous integration runs unit tests and data validation checks on every commit. Continuous training automatically retrains models when new data arrives or performance drops below thresholds. Continuous delivery packages and deploys validated models to production.\n\nPipeline orchestration is the backbone of MLOps workflows. Tools like Kubeflow Pipelines, Apache Airflow, and Prefect define ML workflows as composable steps with explicit dependencies. These orchestrators handle scheduling, retry logic, resource allocation, and monitoring, freeing engineers to focus on the ML-specific aspects of their work.\n\nModel registries serve as the central hub for managing model versions and their lifecycle states. A model in the registry progresses through stages like "staging," "canary," and "production" based on validation gates. This structured promotion process ensures that only thoroughly tested models reach production, reducing the risk of deploying a regression.',
    order: 3,
    keyConcepts: [
      { term: 'MLOps', definition: 'The set of practices that combines ML development with operations, enabling continuous delivery and automation of the ML lifecycle.' },
      { term: 'Model Registry', definition: 'A centralized repository for storing, versioning, and managing the lifecycle of trained ML models from development through production deployment.' },
    ],
  },
  {
    id: 'ch05-s5',
    heading: 'Hyperparameter Tuning and AutoML',
    body: 'Hyperparameter tuning is the process of finding optimal configuration values that are not learned during training, such as learning rate, batch size, model architecture choices, and regularization strength. The hyperparameter space is often high-dimensional and expensive to explore, making efficient search strategies essential.\n\nGrid search exhaustively evaluates all combinations of specified hyperparameter values, while random search samples randomly from the space. Research by Bergstra and Bengio showed that random search is more efficient than grid search for most problems because it covers more of the important dimensions.\n\nBayesian optimization methods like Tree-structured Parzen Estimators (TPE) and Gaussian Processes build a probabilistic model of the objective function and use it to select promising configurations to evaluate next. These methods are significantly more sample-efficient than random search, particularly for expensive training runs.\n\nAutoML extends hyperparameter tuning to automate broader aspects of the ML pipeline, including feature engineering, model selection, and architecture design. Platforms like Google AutoML, Auto-sklearn, and H2O AutoML lower the barrier to ML adoption but require understanding of their limitations. AutoML excels at finding good configurations within defined search spaces but cannot replace domain expertise in problem formulation and system design.',
    order: 4,
    keyConcepts: [
      { term: 'Hyperparameter Tuning', definition: 'The process of systematically searching for optimal values of parameters that are set before training begins, such as learning rate and model architecture choices.' },
      { term: 'Bayesian Optimization', definition: 'A sequential optimization strategy that builds a probabilistic surrogate model to efficiently guide the search for optimal hyperparameters.' },
    ],
  },
];

export const glossary: GlossaryTerm[] = [
  { term: 'Experiment Tracking', definition: 'Systematic logging and organization of training run parameters, metrics, and artifacts for reproducibility and comparison.' },
  { term: 'Reproducibility', definition: 'The ability to consistently obtain the same results from an ML experiment given the same inputs, code, and configuration.' },
  { term: 'MLOps', definition: 'DevOps principles applied to ML, enabling automation and monitoring of the complete ML lifecycle from training to production.' },
  { term: 'Model Registry', definition: 'A versioned repository for managing trained model artifacts and their lifecycle stages through deployment.' },
  { term: 'Hyperparameter', definition: 'A configuration value set before training that controls the learning process but is not updated by the optimization algorithm.' },
  { term: 'AutoML', definition: 'Automated Machine Learning systems that automate model selection, hyperparameter tuning, and feature engineering.' },
];

export const keyTakeaways: string[] = [
  'The ML lifecycle is inherently iterative and experimental, requiring systematic tracking and management of all artifacts.',
  'Experiment tracking platforms are essential for reproducibility, collaboration, and efficient hyperparameter exploration.',
  'Practical reproducibility requires controlling random seeds, versioning data and dependencies, and documenting the environment.',
  'MLOps automates the pipeline from code changes through training, validation, and deployment with continuous integration and delivery.',
  'Bayesian optimization is significantly more sample-efficient than grid or random search for hyperparameter tuning.',
];
