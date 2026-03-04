import type { ChapterQuiz } from '@/types/quiz';

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
  ],
};
