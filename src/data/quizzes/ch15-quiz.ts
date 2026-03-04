import type { ChapterQuiz } from '@/types/quiz';

export const ch15Quiz: ChapterQuiz = {
  chapterId: 'ch15',
  title: 'Security & Privacy Quiz',
  description: 'Test your understanding of adversarial attacks, model security, differential privacy, and federated learning.',
  passingScore: 70,
  selectCount: 5,
  pool: [
    {
      id: 'ch15-q1',
      question: 'What is an adversarial example in ML?',
      options: [
        'A training sample from a competitor\'s dataset',
        'A carefully crafted input with imperceptible perturbations designed to cause a model to make incorrect predictions',
        'A difficult test case that any model would get wrong',
        'An example used to train adversarial networks (GANs)',
      ],
      correctIndex: 1,
      explanation:
        'Adversarial examples exploit model vulnerabilities by adding small, often imperceptible perturbations to inputs that cause confident misclassification. For example, changing a few pixels in an image can flip a classifier\'s prediction while looking identical to humans.',
      difficulty: 'easy',
    },
    {
      id: 'ch15-q2',
      question: 'What is a model inversion attack?',
      options: [
        'Running the model backward to speed up inference',
        'An attack that reconstructs training data or sensitive attributes by querying the model and analyzing its outputs',
        'Inverting the model weights to create a new model',
        'Reversing the order of layers in a neural network',
      ],
      correctIndex: 1,
      explanation:
        'Model inversion attacks exploit the information leaked through model predictions. By systematically querying a model and analyzing confidence scores, an attacker can reconstruct approximate representations of training data, potentially revealing private information.',
      difficulty: 'medium',
    },
    {
      id: 'ch15-q3',
      question: 'What is differential privacy in the context of ML?',
      options: [
        'Keeping different models private from each other',
        'A mathematical framework that provides provable privacy guarantees by adding calibrated noise during training, ensuring no single data point significantly influences the output',
        'Encrypting the training dataset',
        'Using different passwords for different models',
      ],
      correctIndex: 1,
      explanation:
        'Differential privacy (DP) adds carefully calibrated noise to gradients during training (DP-SGD) so that the trained model\'s parameters are nearly the same whether or not any individual data point was included. This provides a formal, provable privacy guarantee.',
      difficulty: 'hard',
    },
    {
      id: 'ch15-q4',
      question: 'What is federated learning?',
      options: [
        'Training one large model on a centralized server',
        'A distributed training paradigm where models are trained on decentralized data at each participant, sharing only model updates (not raw data)',
        'A technique for training multiple models simultaneously',
        'Learning from federated databases that share a common schema',
      ],
      correctIndex: 1,
      explanation:
        'Federated learning trains models across many devices (phones, hospitals, organizations) without centralizing data. Each participant trains on local data and sends only gradient updates to a server that aggregates them. This preserves data privacy and locality.',
      difficulty: 'medium',
    },
    {
      id: 'ch15-q5',
      question: 'What is a model stealing (model extraction) attack?',
      options: [
        'Physically stealing a GPU server',
        'Querying a deployed model systematically to create a functionally equivalent copy that replicates its behavior',
        'Downloading open-source model weights',
        'Copying model code from a public repository',
      ],
      correctIndex: 1,
      explanation:
        'Model extraction attacks send carefully chosen inputs to a target API and use the returned predictions to train a surrogate model that closely approximates the original. This steals the intellectual property embedded in the model without accessing the original weights or training data.',
      difficulty: 'medium',
    },
    {
      id: 'ch15-q6',
      question: 'What is data poisoning in the context of ML security?',
      options: [
        'Corrupting data during network transmission',
        'An attack where malicious samples are injected into the training dataset to compromise the model\'s behavior on specific inputs',
        'Using expired training data',
        'Accidentally using test data during training',
      ],
      correctIndex: 1,
      explanation:
        'Data poisoning attacks inject carefully crafted malicious examples into the training set. These can create backdoors (model behaves normally except on trigger inputs) or degrade overall performance. They are particularly dangerous for models trained on web-scraped or crowdsourced data.',
      difficulty: 'medium',
    },
    {
      id: 'ch15-q7',
      question: 'What is the privacy-utility trade-off in differential privacy?',
      options: [
        'There is no trade-off; you can have both perfect privacy and perfect accuracy',
        'Stronger privacy guarantees require more noise, which reduces model accuracy; practitioners must balance acceptable privacy loss against utility',
        'Privacy only affects model size, not accuracy',
        'Utility decreases because differential privacy requires smaller datasets',
      ],
      correctIndex: 1,
      explanation:
        'The privacy parameter epsilon controls the noise magnitude in DP. Lower epsilon means stronger privacy but more noise (lower accuracy). Higher epsilon means less noise (better accuracy) but weaker privacy. This fundamental trade-off requires careful calibration per application.',
      difficulty: 'hard',
    },
    {
      id: 'ch15-q8',
      question: 'What is adversarial training as a defense mechanism?',
      options: [
        'Training two competing models against each other (like GANs)',
        'Including adversarial examples in the training set so the model learns to correctly classify both clean and perturbed inputs',
        'Training the model for more epochs to make it robust',
        'Using adversarial hardware to speed up training',
      ],
      correctIndex: 1,
      explanation:
        'Adversarial training generates adversarial perturbations during training and includes them in the training process. This forces the model to learn representations that are robust to small input perturbations, though it typically incurs some accuracy cost on clean data.',
      difficulty: 'hard',
    },
    {
      id: 'ch15-q9',
      question: 'What is the main challenge of federated learning compared to centralized training?',
      options: [
        'Federated learning is always less accurate',
        'Non-IID data across participants, communication overhead, and handling heterogeneous device capabilities and availability',
        'Federated learning cannot use GPUs',
        'Federated learning requires more training data overall',
      ],
      correctIndex: 1,
      explanation:
        'Federated learning faces non-IID data (each device has a biased data sample), expensive communication rounds (model updates over networks), device heterogeneity (different compute speeds and availability), and privacy concerns even in shared gradients.',
      difficulty: 'hard',
    },
    {
      id: 'ch15-q10',
      question: 'What is a membership inference attack?',
      options: [
        'Determining which team members trained a model',
        'An attack that determines whether a specific data point was used in a model\'s training set by analyzing the model\'s output behavior',
        'Inferring the membership of model parameters in specific layers',
        'Predicting whether a user is a member of a social network',
      ],
      correctIndex: 1,
      explanation:
        'Membership inference exploits the fact that models often behave differently on data they were trained on (higher confidence, lower loss) vs. unseen data. This can reveal private information — for example, confirming someone was in a medical study\'s dataset.',
      difficulty: 'easy',
    },
  ],
};
