import type { ChapterSection, GlossaryTerm } from '~/types/chapter';

export const sections: ChapterSection[] = [
  {
    id: 'ch06-s1',
    heading: 'Data Pipelines for ML',
    body: 'Data pipelines are the foundation of every ML system, responsible for collecting, transforming, and delivering data to training and serving infrastructure. A well-designed pipeline must handle diverse data sources, varying scales, and evolving schemas while maintaining data quality and freshness.\n\nBatch pipelines process large volumes of historical data on a schedule (hourly, daily) and are typically used for training data preparation. Stream pipelines process data in real-time as it arrives and are used for feature computation and online serving. Many production systems use a hybrid lambda architecture that combines both batch and stream processing.\n\nData pipeline reliability is crucial because downstream model quality is directly dependent on data quality. Pipeline failures, whether from infrastructure issues, schema changes, or data source problems, can silently corrupt training data and degrade model performance. Robust pipelines include data validation checks, schema enforcement, and alerting at every stage.\n\nScalability is a core design concern for ML data pipelines. As data volumes grow, pipelines must scale horizontally across distributed processing frameworks like Apache Spark, Apache Beam, or Dask. The choice of framework depends on factors like data volume, processing complexity, latency requirements, and the team\'s existing infrastructure.',
    order: 0,
    keyConcepts: [
      { term: 'Data Pipeline', definition: 'An automated system for collecting, transforming, validating, and delivering data from source systems to ML training and serving infrastructure.' },
      { term: 'Lambda Architecture', definition: 'A data processing architecture that combines batch processing for accuracy with stream processing for low latency, providing both historical and real-time views.' },
    ],
  },
  {
    id: 'ch06-s2',
    heading: 'Data Labeling and Annotation',
    body: 'Data labeling is often the most expensive and time-consuming part of ML development. Supervised learning requires labeled examples, and the quality of labels directly determines the upper bound on model performance. Labeling strategies must balance quality, cost, and throughput.\n\nHuman labeling remains the gold standard for many tasks but faces challenges of scale, consistency, and cost. Labeling platforms like Labelbox, Scale AI, and Amazon SageMaker Ground Truth provide workforce management, quality control, and tooling for annotation tasks ranging from image classification to complex sequence labeling.\n\nActive learning reduces labeling costs by intelligently selecting the most informative samples for human annotation. Rather than labeling data randomly, active learning queries the model to identify examples where it is most uncertain, focusing human effort where it will have the greatest impact on model improvement.\n\nWeak supervision and programmatic labeling offer alternatives to manual annotation. Frameworks like Snorkel enable engineers to write labeling functions that encode heuristics, patterns, and external knowledge sources. These noisy labels are then combined using statistical methods to produce training labels that, while imperfect, can be generated at massive scale with minimal human effort.',
    order: 1,
    keyConcepts: [
      { term: 'Active Learning', definition: 'A strategy that selects the most informative unlabeled examples for human annotation, reducing labeling costs by focusing effort where it most improves the model.' },
      { term: 'Weak Supervision', definition: 'An approach that generates training labels programmatically using heuristics and external knowledge sources rather than manual annotation.' },
    ],
  },
  {
    id: 'ch06-s3',
    heading: 'Data Versioning and Lineage',
    body: 'Data versioning tracks changes to datasets over time, enabling reproducibility, debugging, and rollback. Just as code version control is fundamental to software engineering, data version control is essential for ML engineering. Without it, teams cannot reliably reproduce past training runs or diagnose model regressions.\n\nTools like DVC, LakeFS, and Delta Lake provide versioning capabilities for large datasets. DVC integrates with Git to track data files through content-addressable storage, while LakeFS provides Git-like branching and merging for data lakes. Delta Lake adds ACID transactions and time travel to data lake storage.\n\nData lineage tracks the complete provenance of data through the pipeline, recording every transformation applied from source to model. This audit trail is essential for debugging data quality issues, understanding model behavior, and complying with regulations that require explainability of automated decisions.\n\nEffective data versioning requires infrastructure decisions about storage, deduplication, and access patterns. Content-addressable storage avoids duplicating unchanged data across versions. Columnar formats like Parquet and Arrow enable efficient access to specific features without reading entire datasets. These infrastructure choices have significant implications for storage costs and pipeline performance.',
    order: 2,
    keyConcepts: [
      { term: 'Data Versioning', definition: 'The practice of tracking and managing changes to datasets over time, analogous to code version control, enabling reproducibility and rollback.' },
      { term: 'Data Lineage', definition: 'The complete record of data provenance, tracking every transformation applied to data from its original source through the ML pipeline.' },
    ],
  },
  {
    id: 'ch06-s4',
    heading: 'Data Augmentation Techniques',
    body: 'Data augmentation artificially increases the effective size and diversity of training data by applying transformations to existing examples. This is one of the most effective regularization techniques, improving model generalization while reducing the need for additional labeled data.\n\nFor image data, common augmentations include random cropping, flipping, rotation, color jittering, and cutout. More advanced techniques like MixUp and CutMix create synthetic examples by blending pairs of training images and their labels. RandAugment and AutoAugment learn optimal augmentation policies through search.\n\nFor text data, augmentation techniques include synonym replacement, random insertion, back-translation (translating to another language and back), and paraphrase generation using language models. For tabular data, techniques like SMOTE address class imbalance by generating synthetic minority examples through interpolation.\n\nFrom a systems perspective, data augmentation should be applied on-the-fly during training rather than pre-computed, to maximize diversity without increasing storage requirements. This requires efficient augmentation implementations that do not become a CPU bottleneck during GPU training. Libraries like Albumentations and torchvision.transforms provide optimized augmentation pipelines that can keep up with GPU training throughput.',
    order: 3,
    keyConcepts: [
      { term: 'Data Augmentation', definition: 'The technique of creating modified versions of training examples through transformations, increasing effective dataset size and improving model generalization.' },
      { term: 'MixUp', definition: 'An augmentation technique that creates synthetic training examples by taking convex combinations of pairs of examples and their labels.' },
    ],
  },
  {
    id: 'ch06-s5',
    heading: 'Data Quality Management',
    body: 'Data quality is the single most important factor in ML system performance. The adage "garbage in, garbage out" applies with particular force to ML, where models can silently learn patterns from data errors, duplicates, and label noise without any obvious symptoms until deployment.\n\nData validation frameworks like Great Expectations and TensorFlow Data Validation (TFDV) enable teams to define expectations about data distributions, schema constraints, and statistical properties. These checks run automatically as part of the pipeline, catching issues like unexpected null values, distribution shifts, and schema changes before they corrupt training data.\n\nData quality dimensions include completeness (missing values), consistency (conflicting records), accuracy (correct labels), freshness (up-to-date information), and representativeness (coverage of the target distribution). Each dimension requires specific monitoring and mitigation strategies.\n\nProactive data quality management is more effective than reactive debugging. This includes establishing data contracts between producers and consumers, implementing continuous monitoring of data statistics, and building automated alerts for drift detection. Investing in data quality infrastructure early in a project pays dividends throughout the system lifetime by preventing costly model failures and debugging sessions.',
    order: 4,
    keyConcepts: [
      { term: 'Data Quality', definition: 'The measure of data fitness for its intended use in ML, encompassing dimensions like completeness, accuracy, consistency, and representativeness.' },
      { term: 'Data Validation', definition: 'Automated checks that verify data meets specified quality constraints before it enters the ML pipeline, preventing silent data corruption.' },
    ],
  },
];

export const glossary: GlossaryTerm[] = [
  { term: 'Data Pipeline', definition: 'An automated system for ingesting, processing, and delivering data to ML training and serving systems.' },
  { term: 'Data Augmentation', definition: 'Techniques that create modified copies of training data to increase dataset diversity and improve model generalization.' },
  { term: 'Active Learning', definition: 'A labeling strategy that selects the most informative examples for annotation, maximizing model improvement per labeled sample.' },
  { term: 'Data Versioning', definition: 'Tracking changes to datasets over time to enable reproducibility, comparison, and rollback of ML experiments.' },
  { term: 'Feature Engineering', definition: 'The process of creating informative input features from raw data to improve model performance and training efficiency.' },
  { term: 'Data Lineage', definition: 'The complete provenance trail tracking data from source through every transformation to its final use in training or inference.' },
  { term: 'ETL', definition: 'Extract, Transform, Load; a pipeline pattern for moving data from source systems through transformations into target storage.' },
];

export const keyTakeaways: string[] = [
  'Data pipeline reliability is critical because model quality is directly bounded by data quality.',
  'Active learning and weak supervision can dramatically reduce labeling costs while maintaining model performance.',
  'Data versioning and lineage tracking are essential for reproducibility, debugging, and regulatory compliance.',
  'On-the-fly data augmentation maximizes training data diversity without increasing storage requirements.',
  'Proactive data quality management through validation frameworks prevents costly downstream model failures.',
];
