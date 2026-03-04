import type { ChapterQuiz } from '@/types/quiz';

export const ch16Quiz: ChapterQuiz = {
  chapterId: 'ch16',
  title: 'Robust AI Quiz',
  description: 'Test your understanding of distribution shift, out-of-distribution detection, and building reliable ML systems.',
  passingScore: 70,
  selectCount: 5,
  pool: [
    {
      id: 'ch16-q1',
      question: 'What is distribution shift in ML systems?',
      options: [
        'Shifting data between different storage systems',
        'When the data distribution encountered at deployment differs from the training distribution, causing model performance to degrade',
        'A technique for redistributing model weights',
        'Moving a model from one server to another',
      ],
      correctIndex: 1,
      explanation:
        'Distribution shift (also called dataset shift) occurs when the statistical properties of the data change between training and deployment. This is the norm, not the exception, in production ML systems, and is a primary cause of model degradation over time.',
      difficulty: 'easy',
    },
    {
      id: 'ch16-q2',
      question: 'What is the difference between covariate shift and concept drift?',
      options: [
        'They are identical phenomena',
        'Covariate shift is a change in input distribution P(X) while concept drift is a change in the relationship P(Y|X) between inputs and outputs',
        'Covariate shift only affects images; concept drift only affects text',
        'Covariate shift is gradual; concept drift is always sudden',
      ],
      correctIndex: 1,
      explanation:
        'Covariate shift means inputs look different (e.g., new camera angles in production). Concept drift means the underlying relationship changes (e.g., user preferences evolve). Both degrade model performance but require different detection and mitigation strategies.',
      difficulty: 'medium',
    },
    {
      id: 'ch16-q3',
      question: 'What is out-of-distribution (OOD) detection?',
      options: [
        'Removing outliers from the training set',
        'Identifying inputs at inference time that are significantly different from the training distribution, flagging them for special handling instead of producing unreliable predictions',
        'Detecting when the model is deployed in the wrong location',
        'Finding distribution bugs in the software',
      ],
      correctIndex: 1,
      explanation:
        'OOD detection identifies inputs that fall outside the training data distribution. Rather than making unreliable predictions on unfamiliar inputs, the system can flag them for human review, use a fallback strategy, or abstain from predicting.',
      difficulty: 'medium',
    },
    {
      id: 'ch16-q4',
      question: 'What is data augmentation\'s role in improving model robustness?',
      options: [
        'It only increases the training set size',
        'It exposes the model to transformed versions of the training data, teaching it to be invariant to expected real-world variations',
        'It replaces the need for a validation set',
        'It is only useful for image classification tasks',
      ],
      correctIndex: 1,
      explanation:
        'Data augmentation systematically introduces the kinds of variations expected in production (rotation, lighting changes, noise, paraphrasing) during training. This builds robustness to these variations, reducing the impact of mild distribution shifts at deployment time.',
      difficulty: 'easy',
    },
    {
      id: 'ch16-q5',
      question: 'What is graceful degradation in ML systems?',
      options: [
        'Slowly reducing model accuracy over time on purpose',
        'Designing the system to fall back to simpler models, rules, or human review when the primary model is uncertain or unavailable, rather than failing entirely',
        'Gradually phasing out an old model',
        'Reducing model precision to save resources',
      ],
      correctIndex: 1,
      explanation:
        'Graceful degradation ensures the system maintains acceptable behavior even when the ML model is uncertain, encounters OOD inputs, or goes offline. Fallback strategies (simpler models, rule-based systems, human escalation) prevent catastrophic failures.',
      difficulty: 'medium',
    },
    {
      id: 'ch16-q6',
      question: 'Why can high model confidence be misleading for out-of-distribution inputs?',
      options: [
        'High confidence always means the prediction is correct',
        'Neural networks often assign high confidence to OOD inputs because softmax forces the output to sum to 1, even for unfamiliar data that should have low confidence',
        'OOD inputs always produce low confidence scores',
        'Confidence scores are not related to input distribution',
      ],
      correctIndex: 1,
      explanation:
        'Softmax produces a valid probability distribution regardless of input. A model can be confidently wrong on OOD data because it has never learned to express uncertainty about unfamiliar inputs. This makes raw softmax confidence unreliable for OOD detection.',
      difficulty: 'hard',
    },
    {
      id: 'ch16-q7',
      question: 'What is an ensemble approach to improving robustness?',
      options: [
        'Using a single large model instead of multiple small ones',
        'Combining predictions from multiple diverse models to reduce variance, improve accuracy, and provide better uncertainty estimates',
        'Training one model on multiple datasets simultaneously',
        'Running the same model multiple times on the same input',
      ],
      correctIndex: 1,
      explanation:
        'Ensembles combine predictions from multiple independently trained models. Disagreement among ensemble members signals uncertainty (useful for OOD detection), and the averaged prediction is typically more robust and accurate than any single model.',
      difficulty: 'medium',
    },
    {
      id: 'ch16-q8',
      question: 'What is the purpose of stress testing an ML system?',
      options: [
        'To check if the server hardware can handle the model size',
        'To evaluate model behavior under challenging conditions like noisy inputs, edge cases, adversarial perturbations, and distribution shift',
        'To measure how stressed developers are when debugging the model',
        'To increase training data by generating difficult examples',
      ],
      correctIndex: 1,
      explanation:
        'Stress testing goes beyond standard evaluation to probe failure modes: What happens with corrupted inputs? Rare subgroups? Adversarial perturbations? Shifted distributions? This reveals vulnerabilities that standard test set accuracy masks.',
      difficulty: 'easy',
    },
    {
      id: 'ch16-q9',
      question: 'What is calibration in the context of ML model predictions?',
      options: [
        'Adjusting the model weights after deployment',
        'Ensuring that a model\'s predicted probability of an event matches the actual observed frequency — a 70% confidence prediction should be correct about 70% of the time',
        'Setting up the hardware for optimal performance',
        'Initializing model weights before training',
      ],
      correctIndex: 1,
      explanation:
        'A well-calibrated model\'s confidence scores are meaningful: when it says 80% confidence, it should be right about 80% of the time. Poorly calibrated models (common in deep learning) require post-hoc calibration techniques like temperature scaling or Platt scaling.',
      difficulty: 'hard',
    },
    {
      id: 'ch16-q10',
      question: 'What is the role of monitoring for robustness in production ML?',
      options: [
        'Monitoring is unnecessary if the model was well-tested during development',
        'Continuously tracking input distributions, prediction patterns, and performance metrics to detect degradation from distribution shift before it causes significant harm',
        'Monitoring only CPU and memory usage',
        'Checking model weights for corruption once a month',
      ],
      correctIndex: 1,
      explanation:
        'Even well-tested models degrade in production due to inevitable distribution shifts. Continuous monitoring of statistical tests on input features, prediction distribution changes, and downstream business metrics enables early detection and timely retraining or intervention.',
      difficulty: 'hard',
    },
  ],
};
