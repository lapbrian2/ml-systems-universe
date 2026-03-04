import type { ChapterSection, GlossaryTerm } from '~/types/chapter';

export const sections: ChapterSection[] = [
  {
    id: 'ch05-s1',
    heading: 'The ML Development Lifecycle',
    body: 'The ML development lifecycle provides a structured methodology for taking models from concept to production. Unlike traditional software development, ML development is fundamentally experimental: success requires systematic iteration across data preparation, model development, training, evaluation, and deployment stages.\n\nThe lifecycle begins with problem formulation, where engineers define the task, success metrics, and constraints. This stage is often underestimated but is critical for project success. A well-defined problem includes clear performance requirements, latency budgets, data availability assessments, and success criteria that align with business objectives.\n\nAfter problem formulation, the lifecycle moves through iterative cycles of data preparation, feature engineering, model selection, training, and evaluation. Each cycle produces artifacts: processed datasets, trained model weights, evaluation reports, and configuration files. Managing these artifacts with proper versioning and metadata is essential for reproducibility.\n\nThe deployment phase marks the transition from experimentation to production. This involves packaging the model, setting up serving infrastructure, implementing monitoring, and establishing feedback loops for continuous improvement. The lifecycle does not end at deployment; production models require ongoing monitoring, maintenance, and periodic retraining to maintain performance as the world changes.',
    blocks: [
      {
        type: 'paragraph',
        text: 'The ML development lifecycle provides a structured methodology for taking models from concept to production. Unlike traditional software development, ML development is fundamentally experimental: success requires systematic iteration across data preparation, model development, training, evaluation, and deployment stages.',
      },
      {
        type: 'definition',
        term: 'ML Development Lifecycle',
        definition: 'The structured sequence of stages from problem definition through data preparation, model development, training, evaluation, deployment, and monitoring that governs ML project development. It is inherently iterative, with feedback from later stages driving improvements to earlier ones.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Problem Formulation',
      },
      {
        type: 'paragraph',
        text: 'The lifecycle begins with problem formulation, where engineers define the task, success metrics, and constraints. This stage is often underestimated but is critical for project success.',
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'The Most Common Cause of ML Project Failure',
        text: 'The majority of failed ML projects fail not because of model quality but because of poor problem formulation. Building an accurate model for the wrong objective wastes months of engineering effort. Before writing any code, clearly define: What decision will this model inform? How will you measure success? What are the latency and cost constraints? Is there enough data?',
      },
      {
        type: 'list',
        ordered: true,
        items: [
          'Define the business objective and how ML predictions will be used',
          'Specify success metrics (accuracy, precision, recall, F1) with concrete thresholds',
          'Establish latency budgets and throughput requirements for serving',
          'Assess data availability, quality, and labeling needs',
          'Identify potential biases and ethical considerations',
          'Set a timeline and compute budget for experimentation',
        ],
      },
      {
        type: 'heading',
        level: 3,
        text: 'Iterative Development and Artifact Management',
      },
      {
        type: 'paragraph',
        text: 'After problem formulation, the lifecycle moves through iterative cycles of data preparation, feature engineering, model selection, training, and evaluation. Each cycle produces artifacts: processed datasets, trained model weights, evaluation reports, and configuration files.',
      },
      {
        type: 'table',
        headers: ['Artifact Type', 'Examples', 'Versioning Tool', 'Retention Policy'],
        rows: [
          ['Data', 'Training sets, evaluation splits, feature definitions', 'DVC, Delta Lake', 'Keep all versions for reproducibility'],
          ['Code', 'Training scripts, feature pipelines, configs', 'Git', 'Standard branch/tag strategy'],
          ['Models', 'Checkpoints, exported models, ONNX files', 'MLflow, W&B', 'Keep best N per experiment'],
          ['Metrics', 'Loss curves, evaluation reports, confusion matrices', 'MLflow, W&B', 'Keep all for comparison'],
          ['Configs', 'Hyperparameters, infrastructure definitions', 'Git, Hydra', 'Link to corresponding model'],
        ],
        caption: 'Table 5.1: ML lifecycle artifacts and their management strategies.',
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'Version Everything Together',
        text: 'Every trained model should be linked to the exact code commit, data version, configuration file, and random seed that produced it. If you cannot reproduce a training run from its metadata alone, your versioning strategy has a gap. Tools like MLflow and DVC make this straightforward when adopted from the start of a project.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'From Experimentation to Production',
      },
      {
        type: 'paragraph',
        text: 'The deployment phase marks the transition from experimentation to production. This involves packaging the model, setting up serving infrastructure, implementing monitoring, and establishing feedback loops for continuous improvement. The lifecycle does not end at deployment; production models require ongoing monitoring, maintenance, and periodic retraining.',
      },
      {
        type: 'callout',
        variant: 'note',
        title: 'The Lifecycle Never Ends',
        text: 'A deployed model is not a finished product. Data distributions shift, user behavior changes, and new edge cases emerge. Production models require continuous monitoring of prediction quality, periodic retraining on fresh data, and infrastructure maintenance. Plan for the full operational lifecycle, not just the initial deployment.',
      },
    ],
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
    blocks: [
      {
        type: 'paragraph',
        text: 'Experiment tracking is the systematic recording of all parameters, metrics, and artifacts associated with each training run. Without proper tracking, ML teams quickly lose the ability to reproduce results, compare approaches, or understand why certain configurations worked better than others.',
      },
      {
        type: 'definition',
        term: 'Experiment Tracking',
        definition: 'The systematic recording and organization of all parameters, metrics, code versions, data versions, and artifacts from ML training runs. Experiment tracking enables reproducibility, comparison across runs, and collaborative iteration within ML teams.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Tracking Platforms',
      },
      {
        type: 'paragraph',
        text: 'Modern experiment tracking platforms provide centralized dashboards for logging hyperparameters, training curves, evaluation metrics, and model artifacts. These tools enable teams to search, filter, and compare across hundreds of experiments.',
      },
      {
        type: 'table',
        headers: ['Platform', 'Type', 'Key Strength', 'Best For'],
        rows: [
          ['MLflow', 'Open-source', 'Full lifecycle management, model registry', 'Teams wanting self-hosted, vendor-neutral tooling'],
          ['Weights & Biases', 'SaaS (free tier)', 'Beautiful visualizations, easy team collaboration', 'Research teams and fast-moving startups'],
          ['Neptune', 'SaaS', 'Flexible metadata structure, strong comparison tools', 'Large teams with diverse experiment types'],
          ['TensorBoard', 'Open-source', 'Deep integration with TensorFlow and PyTorch', 'Individual researchers, quick local visualization'],
          ['ClearML', 'Open-source + SaaS', 'Automatic logging, pipeline orchestration', 'Teams wanting an all-in-one platform'],
        ],
        caption: 'Table 5.2: Comparison of popular experiment tracking platforms.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'What to Log',
      },
      {
        type: 'paragraph',
        text: 'Effective experiment tracking requires discipline in logging practices. Every run should record the complete configuration to enable exact reproduction.',
      },
      {
        type: 'list',
        ordered: false,
        items: [
          'Model architecture — Layer types, sizes, activation functions, number of parameters',
          'Hyperparameters — Learning rate, batch size, optimizer settings, regularization',
          'Data version — Hash or tag identifying the exact training and validation data',
          'Random seeds — All seeds (Python, NumPy, PyTorch/TensorFlow) for reproducibility',
          'Framework version — Exact versions of PyTorch/TensorFlow, CUDA, cuDNN',
          'Hardware environment — GPU type, number of devices, distributed training config',
          'Training metrics — Loss curves, gradient norms, learning rate schedule',
          'Evaluation metrics — Accuracy, F1, AUC, confusion matrix on validation set',
        ],
      },
      {
        type: 'code',
        language: 'python',
        code: '# Example: Logging an experiment with MLflow\nimport mlflow\n\nwith mlflow.start_run(run_name=\'resnet50-lr-sweep\'):\n    mlflow.log_params({\n        \'model\': \'resnet50\',\n        \'learning_rate\': 0.001,\n        \'batch_size\': 256,\n        \'optimizer\': \'adamw\',\n        \'data_version\': \'v2.3\',\n        \'seed\': 42,\n    })\n    # ... training loop ...\n    mlflow.log_metrics({\'val_accuracy\': 0.943, \'val_loss\': 0.187})\n    mlflow.pytorch.log_model(model, \'model\')',
        caption: 'Example: Structured experiment logging with MLflow.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Collaborative Workflows',
      },
      {
        type: 'paragraph',
        text: 'Beyond individual experiments, tracking systems support collaborative workflows where multiple team members contribute experiments toward shared objectives. Features like experiment groups, tags, and notes help organize work across team members.',
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'Establish Logging Conventions Early',
        text: 'Agree on naming conventions, tag taxonomy, and required metadata fields before the team starts experimenting. A shared convention like "task/model/variant" (e.g., "sentiment/bert-base/lr-sweep") makes it easy to find and compare experiments weeks or months later. Inconsistent naming is the top reason teams abandon their experiment tracking.',
      },
      {
        type: 'callout',
        variant: 'example',
        title: 'Tracking Saves a Team Weeks',
        text: 'A team of five ML engineers runs 200 experiments over two months to improve a recommendation model. When the best model fails in production, they use experiment tracking to identify that the improvement came from a data preprocessing change (not the architecture change they assumed). They revert the preprocessing, find the real issue (a data leak in validation), and recover in hours instead of rerunning weeks of experiments.',
      },
    ],
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
    blocks: [
      {
        type: 'paragraph',
        text: 'Reproducibility is the ability to obtain consistent results when repeating an experiment under the same conditions. In ML, achieving reproducibility is surprisingly difficult due to sources of non-determinism in hardware, software, and the training process itself.',
      },
      {
        type: 'definition',
        term: 'Reproducibility',
        definition: 'The ability to obtain consistent experimental results when repeating a procedure under the same conditions. In ML, this requires controlling random seeds, data versions, code versions, and hardware environment. It is a fundamental requirement for scientific validity and production reliability.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Sources of Non-Determinism',
      },
      {
        type: 'paragraph',
        text: 'Sources of non-determinism include random weight initialization, data shuffling, GPU floating-point operation ordering, and framework-level optimizations that sacrifice determinism for performance.',
      },
      {
        type: 'table',
        headers: ['Source', 'Cause', 'Mitigation', 'Performance Impact'],
        rows: [
          ['Weight initialization', 'Random number generators', 'Set all seeds (Python, NumPy, PyTorch)', 'None'],
          ['Data shuffling', 'Random batch ordering', 'Seed the DataLoader or use deterministic shuffling', 'None'],
          ['GPU operation ordering', 'Non-deterministic atomics on GPU', 'torch.use_deterministic_algorithms(True)', '10-30% slower'],
          ['cuDNN auto-tuning', 'Different algorithms chosen per run', 'Set cudnn.deterministic = True', '5-15% slower'],
          ['Floating-point reduction', 'Summation order varies in parallel', 'Use deterministic reductions', '5-10% slower'],
          ['Framework optimizations', 'Graph fusion, kernel selection', 'Disable torch.compile optimizations', 'Significant slowdown'],
        ],
        caption: 'Table 5.3: Sources of non-determinism in ML training and their mitigations.',
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Bit-for-Bit Reproducibility Has a Cost',
        text: 'Achieving exact bit-for-bit reproducibility often requires disabling GPU optimizations that sacrifice determinism for performance. This can slow training by 20-30%. In practice, "statistical reproducibility" (results within a small variance across runs) is usually sufficient. Reserve bit-exact reproducibility for debugging and validation, not production training.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Practical Reproducibility',
      },
      {
        type: 'code',
        language: 'python',
        code: '# Setting seeds for practical reproducibility in PyTorch\nimport random\nimport numpy as np\nimport torch\n\ndef set_seed(seed: int = 42):\n    random.seed(seed)\n    np.random.seed(seed)\n    torch.manual_seed(seed)\n    torch.cuda.manual_seed_all(seed)\n    # Optional: slower but deterministic\n    torch.backends.cudnn.deterministic = True\n    torch.backends.cudnn.benchmark = False',
        caption: 'Setting random seeds for reproducibility across Python, NumPy, and PyTorch.',
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'The Reproducibility Checklist',
        text: 'Before sharing results or deploying a model, verify you can answer "yes" to: (1) Can I rerun this experiment from its metadata? (2) Are all dependencies pinned to exact versions? (3) Is the training data versioned and accessible? (4) Are random seeds set and recorded? (5) Is the hardware environment documented?',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Version Control for ML',
      },
      {
        type: 'definition',
        term: 'DVC (Data Version Control)',
        definition: 'A tool that extends Git to handle large files and datasets, enabling versioning of data and models alongside code. DVC uses content-addressable storage to efficiently track changes to large files without storing them directly in Git.',
      },
      {
        type: 'paragraph',
        text: 'Version control for ML extends beyond code to include data, configurations, and model artifacts. Tools like DVC track large datasets and model files alongside code, enabling teams to switch between different versions of their entire ML pipeline.',
      },
      {
        type: 'callout',
        variant: 'example',
        title: 'DVC in Practice',
        text: 'A team uses DVC to version their 50 GB training dataset alongside their Git repository. When a model regression is detected in production, they run "dvc checkout v2.1" to restore the exact data used to train the previous good model. They discover that a recent data pipeline change introduced duplicate records. Without data versioning, this root cause would have taken days to identify.',
      },
    ],
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
    blocks: [
      {
        type: 'paragraph',
        text: 'MLOps brings DevOps principles to machine learning, establishing practices for continuous integration, delivery, and training of ML models. The goal is to reduce the time and friction involved in moving models from development to production while maintaining quality and reliability.',
      },
      {
        type: 'definition',
        term: 'MLOps',
        definition: 'The set of practices that combines ML development (Dev) with operations (Ops) to enable continuous integration, continuous delivery, and continuous training of ML models. MLOps automates the pipeline from experimentation through deployment while maintaining quality and reliability.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'The Three Pillars of MLOps',
      },
      {
        type: 'paragraph',
        text: 'A mature MLOps workflow automates the progression from code changes through testing, training, evaluation, and deployment.',
      },
      {
        type: 'table',
        headers: ['Pillar', 'Trigger', 'Actions', 'Output'],
        rows: [
          ['Continuous Integration (CI)', 'Code commit or PR', 'Unit tests, linting, data validation, schema checks', 'Pass/fail status, test reports'],
          ['Continuous Training (CT)', 'New data arrives or performance degrades', 'Retrain model, evaluate on holdout set, compare to baseline', 'New model candidate with metrics'],
          ['Continuous Delivery (CD)', 'Model passes validation gates', 'Package model, deploy to staging, canary, then production', 'Production-serving model'],
        ],
        caption: 'Table 5.4: The three pillars of MLOps and their automation.',
      },
      {
        type: 'callout',
        variant: 'note',
        title: 'MLOps Maturity Levels',
        text: 'Google defines three levels of MLOps maturity. Level 0: manual, script-driven process. Level 1: ML pipeline automation with continuous training. Level 2: CI/CD pipeline automation for both code and models. Most organizations should aim for Level 1 as their initial target, as the jump from Level 0 to Level 1 delivers the majority of operational benefits.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Pipeline Orchestration',
      },
      {
        type: 'paragraph',
        text: 'Pipeline orchestration is the backbone of MLOps workflows. Tools like Kubeflow Pipelines, Apache Airflow, and Prefect define ML workflows as composable steps with explicit dependencies.',
      },
      {
        type: 'list',
        ordered: false,
        items: [
          'Apache Airflow — General-purpose workflow orchestration with a large ecosystem of integrations',
          'Kubeflow Pipelines — ML-specific orchestration on Kubernetes with native GPU support',
          'Prefect — Python-native orchestration with strong local development and cloud deployment',
          'Dagster — Data-aware orchestration with built-in testing and observability',
          'ZenML — MLOps framework that abstracts across infrastructure providers',
        ],
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'Start With Simple Automation',
        text: 'You do not need a full orchestration platform on day one. Start by automating the most painful manual step — often retraining when new data arrives. A scheduled cron job that triggers a training script, evaluates the result, and sends a Slack notification is a perfectly valid first step toward MLOps maturity.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Model Registries and Promotion',
      },
      {
        type: 'definition',
        term: 'Model Registry',
        definition: 'A centralized repository for storing, versioning, and managing the lifecycle of trained ML models. Models progress through stages (development, staging, canary, production) based on validation gates, ensuring only thoroughly tested models reach production.',
      },
      {
        type: 'paragraph',
        text: 'Model registries serve as the central hub for managing model versions and their lifecycle states. A model in the registry progresses through stages like "staging," "canary," and "production" based on validation gates.',
      },
      {
        type: 'callout',
        variant: 'example',
        title: 'Model Promotion Pipeline',
        text: 'A new model is trained and registered as version 3.2 in "development" stage. Automated tests verify it meets minimum accuracy thresholds. It is promoted to "staging" where integration tests run against production data samples. After passing, it moves to "canary" where 5% of live traffic is routed to it for 24 hours. If all SLOs are met, it is promoted to "production" and the old model is archived.',
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Always Have a Rollback Plan',
        text: 'Every model deployment should have a tested rollback procedure. Keep the previous production model readily available (not archived or deleted) so traffic can be instantly routed back if the new model causes issues. Automated rollback triggered by SLO violations is ideal, but manual rollback should be achievable in under 5 minutes.',
      },
    ],
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
    blocks: [
      {
        type: 'paragraph',
        text: 'Hyperparameter tuning is the process of finding optimal configuration values that are not learned during training, such as learning rate, batch size, model architecture choices, and regularization strength. The hyperparameter space is often high-dimensional and expensive to explore, making efficient search strategies essential.',
      },
      {
        type: 'definition',
        term: 'Hyperparameter',
        definition: 'A configuration value that is set before training begins and is not updated by the optimization algorithm. Examples include learning rate, batch size, number of layers, dropout rate, and regularization strength. Choosing good hyperparameters is critical for model performance.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Search Strategies',
      },
      {
        type: 'paragraph',
        text: 'Grid search exhaustively evaluates all combinations of specified hyperparameter values, while random search samples randomly from the space. Research by Bergstra and Bengio showed that random search is more efficient than grid search for most problems because it covers more of the important dimensions.',
      },
      {
        type: 'table',
        headers: ['Strategy', 'Approach', 'Sample Efficiency', 'Best For'],
        rows: [
          ['Grid Search', 'Exhaustive evaluation of all combinations', 'Poor (exponential in dimensions)', 'Small spaces with < 3 hyperparameters'],
          ['Random Search', 'Random sampling from the space', 'Better than grid (Bergstra & Bengio, 2012)', 'Medium spaces, limited compute budget'],
          ['Bayesian Optimization', 'Probabilistic surrogate model guides search', 'Best (2-10x fewer trials than random)', 'Expensive training runs, moderate dimensions'],
          ['Hyperband', 'Adaptive resource allocation with early stopping', 'Good (quickly eliminates bad configs)', 'Large spaces with many cheap-to-evaluate configs'],
          ['Population-Based Training', 'Evolutionary approach during training', 'Good for schedules', 'Learning rate and schedule optimization'],
        ],
        caption: 'Table 5.5: Hyperparameter search strategies and their trade-offs.',
      },
      {
        type: 'callout',
        variant: 'note',
        title: 'Why Random Beats Grid',
        text: 'Grid search wastes trials by exhaustively covering unimportant dimensions. If only 2 out of 5 hyperparameters actually matter (common in practice), grid search evaluates many redundant combinations of the 3 unimportant ones. Random search distributes trials more evenly across the important dimensions, finding good configurations faster.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Bayesian Optimization',
      },
      {
        type: 'definition',
        term: 'Bayesian Optimization',
        definition: 'A sequential optimization strategy that builds a probabilistic surrogate model (typically a Gaussian Process or TPE) of the objective function and uses an acquisition function to balance exploration and exploitation when selecting the next configuration to evaluate.',
      },
      {
        type: 'paragraph',
        text: 'Bayesian optimization methods like Tree-structured Parzen Estimators (TPE) and Gaussian Processes build a probabilistic model of the objective function and use it to select promising configurations to evaluate next. These methods are significantly more sample-efficient than random search, particularly for expensive training runs.',
      },
      {
        type: 'code',
        language: 'python',
        code: '# Bayesian hyperparameter optimization with Optuna\nimport optuna\n\ndef objective(trial):\n    lr = trial.suggest_float(\'lr\', 1e-5, 1e-2, log=True)\n    batch_size = trial.suggest_categorical(\'batch_size\', [32, 64, 128, 256])\n    n_layers = trial.suggest_int(\'n_layers\', 2, 8)\n    dropout = trial.suggest_float(\'dropout\', 0.0, 0.5)\n\n    model = build_model(n_layers=n_layers, dropout=dropout)\n    val_accuracy = train_and_evaluate(model, lr=lr, batch_size=batch_size)\n    return val_accuracy\n\nstudy = optuna.create_study(direction=\'maximize\')\nstudy.optimize(objective, n_trials=100)',
        caption: 'Example: Bayesian hyperparameter search with Optuna using TPE.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'AutoML',
      },
      {
        type: 'paragraph',
        text: 'AutoML extends hyperparameter tuning to automate broader aspects of the ML pipeline, including feature engineering, model selection, and architecture design.',
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'AutoML Is Not a Silver Bullet',
        text: 'AutoML excels at finding good configurations within defined search spaces but cannot replace domain expertise in problem formulation, data quality assessment, or system design. An AutoML system optimizing the wrong metric or training on poor data will efficiently find the wrong answer. Always validate AutoML results against domain knowledge.',
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'Efficient Tuning Strategy',
        text: 'Start with a coarse random search (20-50 trials) to identify the right order of magnitude for each hyperparameter. Then use Bayesian optimization with a narrowed search space for fine-tuning. This two-phase approach is more efficient than running Bayesian optimization on a very wide initial space.',
      },
    ],
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

export const learningObjectives: string[] = [
  'Describe the complete model lifecycle from ideation through deployment and retirement',
  'Compare experiment tracking approaches and their role in reproducibility',
  'Design a model versioning and registry strategy for team collaboration',
  'Analyze CI/CD pipeline requirements specific to machine learning workflows',
  'Implement model governance practices including approval gates and audit trails',
];
