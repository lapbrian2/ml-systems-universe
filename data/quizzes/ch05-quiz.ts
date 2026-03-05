import type { ChapterQuiz } from '~/types/quiz';

export const ch05Quiz: ChapterQuiz = {
  chapterId: 'ch05',
  title: 'AI Workflow Quiz',
  description: 'Test your understanding of ML development lifecycle, experiment tracking, and reproducibility.',
  passingScore: 70,
  selectCount: 5,
  pool: [
    {
      id: 'ch05-q1',
      question: 'What is experiment tracking in ML development?',
      options: [
        'Recording the time spent by each team member',
        'Systematically logging hyperparameters, metrics, code versions, and artifacts for each training run',
        'Tracking the number of experiments in a Jupyter notebook',
        'Monitoring GPU temperature during training',
      ],
      correctIndex: 1,
      explanation:
        'Experiment tracking tools (like MLflow, Weights & Biases, or Neptune) record the complete context of each experiment — code, data, config, hyperparameters, and results — enabling reproducibility, comparison, and informed decision-making.',
      difficulty: 'easy',
    },
    {
      id: 'ch05-q2',
      question: 'Why is reproducibility so critical in ML systems engineering?',
      options: [
        'It is only needed for academic publications',
        'It ensures results can be verified, debugged, and built upon reliably by any team member',
        'It reduces GPU costs by avoiding duplicate runs',
        'It is a legal requirement in all industries',
      ],
      correctIndex: 1,
      explanation:
        'Without reproducibility, teams cannot verify that model improvements are real (vs. random seed artifacts), debug regression issues, or confidently iterate. Reproducibility requires versioning data, code, environment, and all configuration.',
      difficulty: 'medium',
    },
    {
      id: 'ch05-q3',
      question: 'What does model versioning track beyond code versioning?',
      options: [
        'Nothing — model versioning is the same as git versioning',
        'The dataset version, hyperparameters, trained weights, and evaluation metrics associated with each model artifact',
        'Only the model architecture diagram',
        'The deployment URL of the model',
      ],
      correctIndex: 1,
      explanation:
        'Model versioning extends beyond code to capture the full lineage: which data was used, which hyperparameters were set, the resulting weights, and performance metrics. This lineage is essential for auditing, rollback, and compliance.',
      difficulty: 'medium',
    },
    {
      id: 'ch05-q4',
      question: 'What is the purpose of a validation set in the ML workflow?',
      options: [
        'To train the model with additional data',
        'To tune hyperparameters and make model selection decisions without contaminating the test set',
        'To generate synthetic training data',
        'To deploy the model to production',
      ],
      correctIndex: 1,
      explanation:
        'The validation set provides an unbiased estimate of model performance during development. Using it for hyperparameter tuning and model selection preserves the test set as a truly held-out measure of final generalization.',
      difficulty: 'easy',
    },
    {
      id: 'ch05-q5',
      question: 'What is data leakage in the ML workflow?',
      options: [
        'When training data is accidentally deleted',
        'When information from the test or future data inadvertently leaks into the training process',
        'When data is stored in an unsecured database',
        'When too much data is used for training',
      ],
      correctIndex: 1,
      explanation:
        'Data leakage causes inflated performance metrics during development that do not generalize to production. Common causes include using future timestamps in features, including target-derived variables, or improper train-test splitting.',
      difficulty: 'medium',
    },
    {
      id: 'ch05-q6',
      question: 'What is the role of a model registry in the ML lifecycle?',
      options: [
        'A database for storing raw training data',
        'A centralized catalog for managing model versions, their metadata, and promotion stages (staging, production, archived)',
        'A tool for writing model documentation',
        'A GPU cluster management interface',
      ],
      correctIndex: 1,
      explanation:
        'A model registry (like MLflow Model Registry or Vertex AI Model Registry) provides a single source of truth for model artifacts and their lifecycle stages. It enables governance, approval workflows, and clear visibility into which models are deployed where.',
      difficulty: 'medium',
    },
    {
      id: 'ch05-q7',
      question: 'Why might a model perform well in development but poorly in production?',
      options: [
        'Production GPUs are always slower than development GPUs',
        'Distribution shift between training data and live data, training-serving skew, or data leakage during evaluation',
        'Production users ask harder questions',
        'The model was trained for too many epochs',
      ],
      correctIndex: 1,
      explanation:
        'The gap between development and production performance often stems from distribution shift (live data differs from training data), training-serving skew (different preprocessing), or overly optimistic evaluation due to data leakage during development.',
      difficulty: 'hard',
    },
    {
      id: 'ch05-q8',
      question: 'What is the benefit of using containerization (e.g., Docker) for ML experiments?',
      options: [
        'It makes models more accurate',
        'It packages code, dependencies, and environment into a reproducible unit that runs identically across machines',
        'It eliminates the need for version control',
        'It replaces the need for GPUs',
      ],
      correctIndex: 1,
      explanation:
        'ML experiments depend on specific library versions, system packages, and CUDA configurations. Containers capture this entire environment, ensuring that an experiment produces the same results regardless of where it runs.',
      difficulty: 'hard',
    },
    {
      id: 'ch05-q9',
      question: 'What is an ML pipeline, and why is it preferred over ad-hoc scripts?',
      options: [
        'A pipeline is just another name for a Jupyter notebook',
        'A pipeline is a DAG of modular, reusable steps that enables automation, reproducibility, and incremental re-execution',
        'A pipeline is only useful for data preprocessing',
        'Pipelines are slower but more readable than scripts',
      ],
      correctIndex: 1,
      explanation:
        'ML pipelines define each step (data loading, preprocessing, training, evaluation) as a modular component in a directed acyclic graph. This structure enables caching unchanged steps, automatic re-execution on input changes, and consistent end-to-end runs.',
      difficulty: 'hard',
    },
    {
      id: 'ch05-q10',
      question: 'What is hyperparameter tuning and why should it be automated?',
      options: [
        'Hyperparameters are learned during training and do not need tuning',
        'Hyperparameter tuning searches for optimal settings (learning rate, batch size, architecture choices) that cannot be learned by gradient descent, and automation ensures systematic and reproducible exploration',
        'It is the same as feature engineering',
        'Manual tuning always produces better results than automated methods',
      ],
      correctIndex: 1,
      explanation:
        'Hyperparameters (learning rate, regularization strength, layer sizes) control the training process but are not optimized by backpropagation. Automated tuning (grid search, Bayesian optimization, Hyperband) systematically explores the space and produces reproducible results.',
      difficulty: 'medium',
    },
    {
      id: 'ch05-q11',
      question: 'What is the difference between offline evaluation and online evaluation (A/B testing)?',
      options: [
        'They are the same thing performed at different times of day',
        'Offline evaluation measures model quality on held-out data; online evaluation measures real-world impact on users through controlled experiments in production',
        'Online evaluation is less reliable than offline evaluation',
        'Offline evaluation can only be done once before deployment',
      ],
      correctIndex: 1,
      explanation:
        'Offline evaluation on test sets can miss real-world factors like user interaction patterns and feedback loops. A/B testing in production provides ground truth about actual impact but is expensive and risky. Both are complementary stages of the evaluation workflow.',
      difficulty: 'medium',
    },
    {
      id: 'ch05-q12',
      question: 'A team cannot reproduce a colleague\'s model results from last month. Which workflow component most likely failed?',
      options: [
        'The GPU was too slow',
        'Insufficient versioning of data, code, environment, or random seeds, making it impossible to recreate the exact training conditions',
        'The model architecture was too complex',
        'The team used too many epochs',
      ],
      correctIndex: 1,
      explanation:
        'Reproducibility requires versioning every input: code (git), data (DVC), environment (Docker/conda), configuration (hyperparameters), and random seeds. Missing any one of these makes exact reproduction impossible, which is a common workflow failure.',
      difficulty: 'hard',
    },
    {
      id: 'ch05-q13',
      question: 'What is continuous training (CT) in the MLOps workflow?',
      options: [
        'Training a model 24 hours a day without stopping',
        'Automatically retraining models when new data arrives or performance degradation is detected, keeping models fresh in production',
        'Continuously increasing the model size during deployment',
        'Running training on a continuous integration server',
      ],
      correctIndex: 1,
      explanation:
        'Continuous training extends CI/CD to ML by automatically triggering retraining when data drift is detected, new labeled data arrives, or scheduled intervals pass. This keeps production models aligned with current data distributions.',
      difficulty: 'medium',
    },
    {
      id: 'ch05-q14',
      question: 'What is a feature store and how does it fit into the AI workflow?',
      options: [
        'A marketplace for buying pre-trained features',
        'A centralized system for computing, storing, and serving features consistently, bridging the gap between training and serving pipelines',
        'A database that only stores raw data',
        'A version control system for model weights',
      ],
      correctIndex: 1,
      explanation:
        'Feature stores like Feast or Tecton provide a single source of truth for feature definitions and values. They ensure training and serving use identical feature computation logic, preventing training-serving skew and enabling feature reuse across teams and models.',
      difficulty: 'hard',
    },
  ],
};
