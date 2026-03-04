import type { ChapterQuiz } from '@/types/quiz';

export const ch13Quiz: ChapterQuiz = {
  chapterId: 'ch13',
  title: 'ML Operations Quiz',
  description: 'Test your understanding of MLOps, CI/CD for ML, experiment management, and production monitoring.',
  passingScore: 70,
  selectCount: 5,
  pool: [
    {
      id: 'ch13-q1',
      question: 'What is MLOps?',
      options: [
        'A new ML algorithm for operations research',
        'A set of practices that combines ML engineering with DevOps principles to automate and reliably deploy and maintain ML systems in production',
        'A cloud computing service provider',
        'A visualization tool for model architectures',
      ],
      correctIndex: 1,
      explanation:
        'MLOps extends DevOps practices to ML systems, addressing unique challenges like data versioning, model validation, continuous training, and monitoring for data/concept drift. It aims to make ML production deployments as reliable as traditional software deployments.',
      difficulty: 'easy',
    },
    {
      id: 'ch13-q2',
      question: 'Why is CI/CD for ML more complex than CI/CD for traditional software?',
      options: [
        'ML code is always more complex than traditional code',
        'ML systems require testing not only code but also data quality, model performance, and pipeline behavior, adding multiple dimensions beyond unit tests',
        'CI/CD tools do not support ML workflows',
        'ML does not require automated testing',
      ],
      correctIndex: 1,
      explanation:
        'Traditional CI/CD validates code correctness. ML CI/CD must additionally validate data schema and quality, model training convergence, prediction quality against baselines, serving performance, and absence of bias — making the validation pipeline much more involved.',
      difficulty: 'medium',
    },
    {
      id: 'ch13-q3',
      question: 'What is model monitoring in production, and what does it track?',
      options: [
        'Watching the model train in real-time on a dashboard',
        'Tracking model performance metrics, data distributions, prediction quality, and system health in production to detect degradation',
        'Recording how many users interact with the model',
        'Monitoring GPU temperature during inference',
      ],
      correctIndex: 1,
      explanation:
        'Production monitoring tracks input data distributions (for data drift), prediction distributions (for concept drift), model latency, error rates, and business metrics. Unlike traditional software, ML models can degrade silently without explicit errors.',
      difficulty: 'medium',
    },
    {
      id: 'ch13-q4',
      question: 'What is concept drift in the context of deployed ML models?',
      options: [
        'The model forgetting previously learned concepts',
        'A change in the underlying relationship between input features and the target variable over time, causing model accuracy to degrade',
        'A gradual increase in model latency',
        'Users changing their understanding of the model output',
      ],
      correctIndex: 1,
      explanation:
        'Concept drift occurs when the statistical relationship that the model learned (P(Y|X)) changes over time. For example, customer purchase behavior shifting due to economic changes. The model becomes stale and its predictions less accurate without retraining.',
      difficulty: 'hard',
    },
    {
      id: 'ch13-q5',
      question: 'What is a feature of a mature MLOps pipeline (Level 2)?',
      options: [
        'Manual model deployment with email approvals',
        'Fully automated training, validation, and deployment pipelines with continuous training triggered by data or performance drift',
        'Using Jupyter notebooks in production',
        'Deploying models without any testing',
      ],
      correctIndex: 1,
      explanation:
        'MLOps maturity levels range from Level 0 (manual, ad-hoc) through Level 1 (pipeline automation) to Level 2 (CI/CD for both code and data, automated retraining, A/B testing, and monitoring-triggered retraining). Level 2 enables continuous, reliable ML operations.',
      difficulty: 'medium',
    },
    {
      id: 'ch13-q6',
      question: 'What is the purpose of a shadow deployment (or shadow mode) for ML models?',
      options: [
        'Deploying models only at night to reduce server load',
        'Running a new model alongside the production model to compare their predictions on live traffic without affecting users',
        'Deploying models in a dark-themed UI',
        'Training a model using only dark images',
      ],
      correctIndex: 1,
      explanation:
        'Shadow deployment routes live production traffic to both the current and candidate models. The candidate\'s predictions are logged but not served to users. This allows evaluating the new model on real data distributions and traffic patterns before switching.',
      difficulty: 'hard',
    },
    {
      id: 'ch13-q7',
      question: 'What is data drift, and how does it differ from concept drift?',
      options: [
        'They are the same phenomenon',
        'Data drift is a change in input feature distributions (P(X)); concept drift is a change in the input-output relationship (P(Y|X))',
        'Data drift only affects training; concept drift only affects serving',
        'Data drift is caused by bugs; concept drift is caused by user behavior',
      ],
      correctIndex: 1,
      explanation:
        'Data drift (covariate shift) means the distribution of input features changes, even if the underlying relationship is stable. Concept drift means the relationship itself changes. Both require monitoring but demand different responses (retraining, feature updates, etc.).',
      difficulty: 'hard',
    },
    {
      id: 'ch13-q8',
      question: 'What is the role of a model validation gate in an ML pipeline?',
      options: [
        'To check if the model file can be opened',
        'An automated checkpoint that evaluates a newly trained model against performance thresholds and the current production model before allowing deployment',
        'To validate user authentication before model access',
        'To ensure the model was trained for enough epochs',
      ],
      correctIndex: 1,
      explanation:
        'A validation gate runs the candidate model through a suite of tests: accuracy on held-out data, bias checks, latency benchmarks, and comparison against the production baseline. Only models that pass all gates can proceed to deployment.',
      difficulty: 'medium',
    },
    {
      id: 'ch13-q9',
      question: 'What is the value of canary deployment for ML models?',
      options: [
        'It uses bird-inspired algorithms for optimization',
        'It gradually routes a small percentage of traffic to the new model, monitoring for regressions before full rollout',
        'It deploys models to a canary island server first',
        'It tests models using synthetic data only',
      ],
      correctIndex: 1,
      explanation:
        'Canary deployment sends a small fraction (e.g., 5%) of live traffic to the new model while the rest continues with the current model. If business metrics, accuracy, or latency degrade, the canary is rolled back. This limits the blast radius of a bad model update.',
      difficulty: 'easy',
    },
    {
      id: 'ch13-q10',
      question: 'Why is infrastructure-as-code important for ML systems?',
      options: [
        'It makes the code more readable',
        'It enables reproducible, version-controlled provisioning of the training and serving infrastructure, ensuring consistency across environments',
        'It replaces the need for cloud computing',
        'It is only important for data engineering',
      ],
      correctIndex: 1,
      explanation:
        'Infrastructure-as-code (Terraform, Pulumi) ensures that training clusters, serving endpoints, and monitoring systems are defined declaratively and version-controlled. This enables reproducible environments, disaster recovery, and consistent staging/production parity.',
      difficulty: 'easy',
    },
  ],
};
