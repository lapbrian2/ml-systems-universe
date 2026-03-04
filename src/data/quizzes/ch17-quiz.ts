import type { ChapterQuiz } from '@/types/quiz';

export const ch17Quiz: ChapterQuiz = {
  chapterId: 'ch17',
  title: 'Responsible AI Quiz',
  description: 'Test your understanding of fairness, bias detection, explainability, and AI governance.',
  passingScore: 70,
  selectCount: 5,
  pool: [
    {
      id: 'ch17-q1',
      question: 'What is algorithmic fairness in ML systems?',
      options: [
        'Ensuring all models have the same accuracy',
        'The principle that ML systems should not systematically disadvantage individuals or groups based on protected attributes like race, gender, or age',
        'Distributing computing resources equally among all models',
        'Using fair market pricing for ML services',
      ],
      correctIndex: 1,
      explanation:
        'Algorithmic fairness addresses the risk that ML models perpetuate or amplify societal biases present in training data. It requires careful consideration of which groups are affected, how "fair" is defined, and what mitigation strategies are appropriate.',
      difficulty: 'easy',
    },
    {
      id: 'ch17-q2',
      question: 'What is the difference between demographic parity and equalized odds?',
      options: [
        'They are the same fairness metric',
        'Demographic parity requires equal positive prediction rates across groups; equalized odds requires equal true positive and false positive rates across groups',
        'Demographic parity is about data; equalized odds is about models',
        'Demographic parity is stricter than equalized odds in all cases',
      ],
      correctIndex: 1,
      explanation:
        'Demographic parity (independence) requires P(Y_hat=1|A=a) = P(Y_hat=1|A=b) for groups a and b. Equalized odds (separation) requires equal TPR and FPR across groups. They encode different notions of fairness and are often mathematically incompatible.',
      difficulty: 'hard',
    },
    {
      id: 'ch17-q3',
      question: 'What is explainability (interpretability) in ML, and why does it matter?',
      options: [
        'Being able to explain ML to non-technical stakeholders',
        'The ability to understand and communicate why a model makes specific predictions, which is essential for trust, debugging, and regulatory compliance',
        'Writing detailed documentation for ML code',
        'Making the model architecture visible in a diagram',
      ],
      correctIndex: 1,
      explanation:
        'Explainability enables stakeholders to understand model reasoning, verify that predictions are based on appropriate features, detect bias, comply with regulations (like GDPR\'s right to explanation), and debug unexpected behavior in production.',
      difficulty: 'easy',
    },
    {
      id: 'ch17-q4',
      question: 'What is SHAP (SHapley Additive exPlanations)?',
      options: [
        'A neural network architecture',
        'A method based on game theory that assigns each feature an importance value for a particular prediction, showing how each feature contributes to the output',
        'A data augmentation technique',
        'A fairness metric for evaluating model bias',
      ],
      correctIndex: 1,
      explanation:
        'SHAP uses Shapley values from cooperative game theory to assign a contribution to each feature for each prediction. It provides both local explanations (why this prediction) and global explanations (which features matter overall), with theoretical guarantees.',
      difficulty: 'medium',
    },
    {
      id: 'ch17-q5',
      question: 'What is a bias audit for ML systems?',
      options: [
        'Checking if the model\'s code contains bugs',
        'A systematic evaluation of model predictions across demographic groups to identify and quantify disparate impact or discrimination',
        'Auditing the cost of ML system development',
        'Reviewing the training process for efficiency',
      ],
      correctIndex: 1,
      explanation:
        'A bias audit evaluates model performance (accuracy, false positive rates, etc.) broken down by sensitive attributes. It identifies groups that are disproportionately affected by errors and quantifies the magnitude of disparate impact to guide mitigation efforts.',
      difficulty: 'medium',
    },
    {
      id: 'ch17-q6',
      question: 'Why can removing protected attributes from training data fail to eliminate bias?',
      options: [
        'Protected attributes are never useful for predictions',
        'Other features (zip code, name, browsing history) can serve as proxies for protected attributes, allowing the model to indirectly learn biased patterns',
        'Removing features always improves model fairness',
        'Bias only comes from protected attributes, not other features',
      ],
      correctIndex: 1,
      explanation:
        'Simply removing race or gender from the feature set (fairness through unawareness) is insufficient because correlated proxy features (geography, language, activity patterns) carry the same information. The model can learn the same biased decision boundary through proxies.',
      difficulty: 'hard',
    },
    {
      id: 'ch17-q7',
      question: 'What are model cards?',
      options: [
        'Physical cards with model weights printed on them',
        'Standardized documentation that accompanies ML models, describing their intended use, performance across groups, limitations, and ethical considerations',
        'Credit cards used to pay for model training compute',
        'Flash cards for studying ML concepts',
      ],
      correctIndex: 1,
      explanation:
        'Model cards (Mitchell et al., 2019) standardize model documentation by requiring disclosure of intended use cases, evaluated populations, performance disaggregated by group, limitations, and ethical considerations. They promote transparency and informed deployment decisions.',
      difficulty: 'medium',
    },
    {
      id: 'ch17-q8',
      question: 'What is the tension between fairness and accuracy in ML?',
      options: [
        'There is never any tension; fair models are always more accurate',
        'Enforcing fairness constraints may reduce overall accuracy because the model is restricted from exploiting patterns that correlate with protected attributes',
        'Accuracy and fairness are completely independent metrics',
        'More accurate models are always more fair',
      ],
      correctIndex: 1,
      explanation:
        'When base rates differ across groups, optimizing for one fairness definition may lower overall accuracy (the so-called fairness-accuracy trade-off). Moreover, different fairness criteria are often mutually incompatible, requiring value judgments about which trade-offs are acceptable.',
      difficulty: 'hard',
    },
    {
      id: 'ch17-q9',
      question: 'What is AI governance in organizations?',
      options: [
        'Government regulation of AI companies',
        'The organizational policies, processes, and accountability structures that guide the responsible development and deployment of AI systems',
        'Using AI to automate corporate governance',
        'An AI model that manages other AI models',
      ],
      correctIndex: 1,
      explanation:
        'AI governance includes ethics review boards, impact assessments, deployment checklists, incident response plans, and clear ownership. It ensures that fairness, safety, and accountability are systematically addressed, not left to individual developer judgment.',
      difficulty: 'easy',
    },
    {
      id: 'ch17-q10',
      question: 'What are pre-processing, in-processing, and post-processing approaches to bias mitigation?',
      options: [
        'Three stages of data cleaning',
        'Debiasing at different stages: modifying training data (pre), adding fairness constraints during training (in), or adjusting model outputs after training (post)',
        'Three types of model architectures',
        'Steps in the model deployment pipeline',
      ],
      correctIndex: 1,
      explanation:
        'Pre-processing transforms training data to remove bias (e.g., reweighting, resampling). In-processing adds fairness constraints or regularization during training. Post-processing adjusts prediction thresholds per group. Each has trade-offs in flexibility, accuracy, and fairness guarantees.',
      difficulty: 'medium',
    },
  ],
};
