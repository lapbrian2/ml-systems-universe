import type { ChapterQuiz } from '~/types/quiz';

export const ch06Quiz: ChapterQuiz = {
  chapterId: 'ch06',
  title: 'Data Engineering Quiz',
  description: 'Test your understanding of data pipelines, labeling strategies, data quality, and feature engineering.',
  passingScore: 70,
  selectCount: 5,
  pool: [
    {
      id: 'ch06-q1',
      question: 'What is the purpose of data augmentation in ML?',
      options: [
        'To reduce the size of the training dataset',
        'To artificially expand the training set by applying label-preserving transformations, improving generalization',
        'To remove noisy samples from the dataset',
        'To convert data into a standard file format',
      ],
      correctIndex: 1,
      explanation:
        'Data augmentation applies transformations (rotation, flipping, cropping, noise injection) that change the input while preserving the label. This effectively increases training set diversity, reduces overfitting, and improves model robustness.',
      difficulty: 'easy',
    },
    {
      id: 'ch06-q2',
      question: 'What is the difference between ETL and ELT in data engineering?',
      options: [
        'They are identical processes with different names',
        'ETL transforms data before loading into storage; ELT loads raw data first and transforms it within the destination system',
        'ETL is for structured data only; ELT is for unstructured data only',
        'ETL is batch processing; ELT is real-time processing',
      ],
      correctIndex: 1,
      explanation:
        'ETL (Extract-Transform-Load) cleans and transforms data before storage, which is traditional. ELT (Extract-Load-Transform) loads raw data into a data warehouse first and leverages its compute for transformation, which is more flexible for ML use cases.',
      difficulty: 'medium',
    },
    {
      id: 'ch06-q3',
      question: 'What is label noise and why is it problematic for ML?',
      options: [
        'Audio static in speech recognition datasets',
        'Incorrect or inconsistent labels in the training data that degrade model learning and evaluation reliability',
        'Missing feature values in the dataset',
        'Duplicate records in the training set',
      ],
      correctIndex: 1,
      explanation:
        'Label noise — caused by annotator errors, ambiguous guidelines, or automated mislabeling — teaches the model incorrect patterns. Even a few percent of noisy labels can significantly reduce model quality and make evaluation metrics unreliable.',
      difficulty: 'medium',
    },
    {
      id: 'ch06-q4',
      question: 'What is data versioning and why is it important for ML?',
      options: [
        'Compressing data to save storage space',
        'Tracking changes to datasets over time so experiments can be linked to the exact data they used',
        'Converting datasets between file formats',
        'Encrypting datasets for security compliance',
      ],
      correctIndex: 1,
      explanation:
        'Data versioning (using tools like DVC or LakeFS) ensures that each model can be traced back to the exact dataset it was trained on. This is essential for reproducibility, debugging, regulatory compliance, and understanding model behavior changes.',
      difficulty: 'medium',
    },
    {
      id: 'ch06-q5',
      question: 'What is the purpose of a data validation step in an ML pipeline?',
      options: [
        'To check that the model achieves target accuracy',
        'To detect anomalies, schema changes, and distribution shifts in incoming data before it reaches the model',
        'To validate that the code compiles correctly',
        'To approve data for public release',
      ],
      correctIndex: 1,
      explanation:
        'Data validation checks for schema violations, unexpected null values, distribution shifts, and statistical anomalies in new data batches. Catching these issues early prevents training on corrupted data and serving on out-of-distribution inputs.',
      difficulty: 'medium',
    },
    {
      id: 'ch06-q6',
      question: 'What is active learning in the context of data labeling?',
      options: [
        'Labeling all data as quickly as possible',
        'A strategy where the model selects the most informative unlabeled samples for human annotation, reducing labeling cost',
        'Training the model actively during data collection',
        'Using data augmentation to create labels automatically',
      ],
      correctIndex: 1,
      explanation:
        'Active learning iteratively identifies samples where the model is most uncertain or where labels would most improve performance. By prioritizing these for human annotation, it achieves better model quality with far fewer labeled examples.',
      difficulty: 'hard',
    },
    {
      id: 'ch06-q7',
      question: 'What is class imbalance and how does it affect ML models?',
      options: [
        'Having too many features compared to samples',
        'When some classes have far more training examples than others, causing the model to be biased toward majority classes',
        'When the test set is larger than the training set',
        'When different data types are mixed in the same dataset',
      ],
      correctIndex: 1,
      explanation:
        'With severe class imbalance, models can achieve high accuracy by simply predicting the majority class. Techniques like oversampling (SMOTE), undersampling, class weights, and focal loss address this by balancing the learning signal across classes.',
      difficulty: 'easy',
    },
    {
      id: 'ch06-q8',
      question: 'What is a data lineage system?',
      options: [
        'A family tree of data scientists working on a project',
        'A system that tracks the origin, transformations, and downstream usage of every piece of data in the pipeline',
        'A backup system for data storage',
        'A tool for generating synthetic data',
      ],
      correctIndex: 1,
      explanation:
        'Data lineage tracks the complete provenance chain: where data came from, what transformations were applied, and which models consumed it. This enables debugging data quality issues, complying with regulations like GDPR, and understanding model behavior.',
      difficulty: 'hard',
    },
    {
      id: 'ch06-q9',
      question: 'Why is it important to split data into train, validation, and test sets before any preprocessing?',
      options: [
        'It saves computational resources',
        'It prevents information leakage from the evaluation data into the preprocessing statistics',
        'The order of splitting and preprocessing does not matter',
        'Preprocessing after splitting takes less time',
      ],
      correctIndex: 1,
      explanation:
        'If preprocessing (e.g., normalization, feature selection) uses statistics from the entire dataset including test data, information leaks into training. Splitting first ensures preprocessing statistics come only from training data, giving honest evaluation results.',
      difficulty: 'hard',
    },
    {
      id: 'ch06-q10',
      question: 'What is a common challenge with real-world data collection for ML?',
      options: [
        'There is always too much perfectly labeled data available',
        'Real-world data is often incomplete, noisy, biased, and changes over time, requiring continuous engineering effort',
        'Real-world data is always in the perfect format for ML',
        'Data collection is fully automated and requires no human oversight',
      ],
      correctIndex: 1,
      explanation:
        'Real-world data suffers from missing values, inconsistent formats, selection bias, seasonal patterns, and concept drift. Data engineering for ML is an ongoing process, not a one-time setup, requiring continuous monitoring and pipeline maintenance.',
      difficulty: 'easy',
    },
    {
      id: 'ch06-q11',
      question: 'What is weak supervision and when is it useful?',
      options: [
        'Training a model with a very small learning rate',
        'Using heuristics, knowledge bases, or noisy labeling functions to programmatically generate approximate labels when manual labeling is too expensive',
        'Supervision with low-quality GPUs',
        'Training without any labels at all',
      ],
      correctIndex: 1,
      explanation:
        'Weak supervision (e.g., Snorkel) uses labeling functions written by domain experts to generate noisy labels at scale. A noise-aware model then learns from these imperfect labels, trading some label accuracy for massive reductions in labeling cost and time.',
      difficulty: 'hard',
    },
    {
      id: 'ch06-q12',
      question: 'You are building a fraud detection model and your dataset has 99.5% legitimate transactions. What strategy should you consider?',
      options: [
        'Use accuracy as the primary metric and train normally',
        'Apply techniques like oversampling the minority class (SMOTE), adjusting class weights, using focal loss, or evaluating with precision-recall instead of accuracy',
        'Remove all legitimate transactions to balance the classes',
        'Only train on the minority class',
      ],
      correctIndex: 1,
      explanation:
        'With extreme class imbalance, accuracy is misleading (99.5% accuracy by always predicting legitimate). Oversampling, class weighting, and focal loss rebalance learning. Precision-recall and AUPRC are more informative metrics than accuracy for imbalanced tasks.',
      difficulty: 'medium',
    },
    {
      id: 'ch06-q13',
      question: 'What is the difference between batch and streaming data pipelines for ML?',
      options: [
        'They are identical but use different names',
        'Batch pipelines process data periodically in large chunks; streaming pipelines process data continuously in real-time as it arrives',
        'Streaming pipelines are always more accurate',
        'Batch pipelines cannot be used for ML training',
      ],
      correctIndex: 1,
      explanation:
        'Batch pipelines (e.g., Spark, Airflow) process accumulated data at intervals, suited for training and offline feature computation. Streaming pipelines (e.g., Kafka, Flink) process events in real-time, essential for low-latency features and online serving.',
      difficulty: 'medium',
    },
    {
      id: 'ch06-q14',
      question: 'What is inter-annotator agreement and why does it matter for ML data quality?',
      options: [
        'A legal contract between data labelers',
        'A metric measuring how consistently multiple annotators label the same examples, indicating label quality and task clarity',
        'The speed at which annotators complete labeling tasks',
        'An agreement to use the same labeling tool',
      ],
      correctIndex: 1,
      explanation:
        'Metrics like Cohen\'s Kappa or Fleiss\' Kappa quantify labeling consistency. Low agreement suggests ambiguous annotation guidelines or a fundamentally subjective task. High agreement indicates reliable labels, which is a prerequisite for training trustworthy models.',
      difficulty: 'hard',
    },
    {
      id: 'ch06-q15',
      question: 'What is synthetic data generation and what are its trade-offs?',
      options: [
        'It is always better than real data',
        'Creating artificial training data algorithmically or with generative models, which can expand datasets but risks introducing distributional biases not present in real data',
        'It is only used for testing, never for training',
        'Synthetic data eliminates the need for data preprocessing',
      ],
      correctIndex: 1,
      explanation:
        'Synthetic data can address data scarcity, privacy concerns, and rare-event coverage. However, if the generation process does not faithfully capture real-world complexity, models may learn artifacts of the synthesis rather than true patterns.',
      difficulty: 'medium',
    },
  ],
};
