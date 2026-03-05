import type { ChapterSection, GlossaryTerm } from '~/types/chapter';

export const sections: ChapterSection[] = [
  {
    id: 'ch06-s1',
    heading: 'Data Pipelines for ML',
    body: 'Data pipelines are the foundation of every ML system, responsible for collecting, transforming, and delivering data to training and serving infrastructure. A well-designed pipeline must handle diverse data sources, varying scales, and evolving schemas while maintaining data quality and freshness.\n\nBatch pipelines process large volumes of historical data on a schedule (hourly, daily) and are typically used for training data preparation. Stream pipelines process data in real-time as it arrives and are used for feature computation and online serving. Many production systems use a hybrid lambda architecture that combines both batch and stream processing.\n\nData pipeline reliability is crucial because downstream model quality is directly dependent on data quality. Pipeline failures, whether from infrastructure issues, schema changes, or data source problems, can silently corrupt training data and degrade model performance. Robust pipelines include data validation checks, schema enforcement, and alerting at every stage.\n\nScalability is a core design concern for ML data pipelines. As data volumes grow, pipelines must scale horizontally across distributed processing frameworks like Apache Spark, Apache Beam, or Dask. The choice of framework depends on factors like data volume, processing complexity, latency requirements, and the team\'s existing infrastructure.',
    blocks: [
      {
        type: 'paragraph',
        text: 'Data pipelines are the foundation of every ML system, responsible for collecting, transforming, and delivering data to training and serving infrastructure. A well-designed pipeline must handle diverse data sources, varying scales, and evolving schemas while maintaining data quality and freshness.',
      },
      {
        type: 'definition',
        term: 'Data Pipeline',
        definition: 'An automated system for collecting, transforming, validating, and delivering data from source systems to ML training and serving infrastructure. Pipelines handle the full ETL (Extract, Transform, Load) process and must maintain data quality, freshness, and schema consistency.',
      },
      {
        type: 'figure',
        caption: 'Lambda architecture combining batch and stream processing. Batch processing (blue) handles historical data while stream processing (green) handles real-time data, merging at the serving layer.',
        alt: 'Lambda architecture diagram with two parallel paths: batch processing on top and stream processing on bottom, both merging at a serving layer that feeds query results.',
        number: 'Figure 6.1',
        component: 'DataPipelineArchitecture',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Batch vs. Stream Processing',
      },
      {
        type: 'paragraph',
        text: 'Batch pipelines process large volumes of historical data on a schedule (hourly, daily) and are typically used for training data preparation. Stream pipelines process data in real-time as it arrives and are used for feature computation and online serving.',
      },
      {
        type: 'table',
        headers: ['Property', 'Batch Processing', 'Stream Processing'],
        rows: [
          ['Data arrival', 'Collected and processed in bulk', 'Processed as it arrives in real-time'],
          ['Latency', 'Minutes to hours', 'Milliseconds to seconds'],
          ['Use case', 'Training data preparation, daily reports', 'Real-time features, online serving'],
          ['Throughput', 'Very high (optimized for bulk)', 'Moderate (optimized for latency)'],
          ['Complexity', 'Simpler (no ordering concerns)', 'Higher (ordering, late data, exactly-once)'],
          ['Typical tools', 'Spark, Hive, dbt', 'Kafka, Flink, Spark Streaming'],
        ],
        caption: 'Table 6.1: Batch vs. stream processing characteristics for ML data pipelines.',
      },
      {
        type: 'definition',
        term: 'Lambda Architecture',
        definition: 'A data processing architecture that combines a batch layer (for accuracy and completeness) with a speed layer (for low-latency real-time data). A serving layer merges results from both, providing comprehensive and timely data to downstream consumers.',
      },
      {
        type: 'callout',
        variant: 'note',
        title: 'The Lambda Architecture Trade-off',
        text: 'Many production systems use a hybrid lambda architecture that combines both batch and stream processing. While this provides both accuracy and low latency, it requires maintaining two code paths that must produce consistent results — a significant engineering burden. The Kappa architecture simplifies this by using stream processing for everything, replaying the stream for batch-style reprocessing.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Pipeline Reliability',
      },
      {
        type: 'paragraph',
        text: 'Data pipeline reliability is crucial because downstream model quality is directly dependent on data quality. Pipeline failures can silently corrupt training data and degrade model performance.',
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Silent Data Corruption',
        text: 'The most dangerous pipeline failures are silent. A schema change in an upstream data source might cause a feature column to be filled with nulls instead of values. The pipeline runs successfully, the model trains without errors, but predictions degrade. Always validate data distributions and schema at pipeline boundaries.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Scaling Data Pipelines',
      },
      {
        type: 'paragraph',
        text: 'As data volumes grow, pipelines must scale horizontally across distributed processing frameworks. The choice of framework depends on factors like data volume, processing complexity, latency requirements, and the team\'s existing infrastructure.',
      },
      {
        type: 'list',
        ordered: false,
        items: [
          'Apache Spark — Mature distributed processing engine, strong for batch ETL, wide ecosystem',
          'Apache Beam — Unified batch and stream programming model, runs on multiple backends',
          'Dask — Python-native parallel computing, great for teams already using pandas/NumPy',
          'Apache Flink — Stream-first processing with strong exactly-once semantics',
          'Ray Data — Distributed data processing integrated with Ray\'s ML ecosystem',
        ],
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'Start Simple, Scale When Needed',
        text: 'If your training data fits in memory on a single machine (under ~100 GB), do not start with Spark or Beam. Use pandas or Dask for preprocessing and invest the saved complexity budget in data validation and testing. Migrate to distributed processing only when data volume demands it.',
      },
    ],
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
    blocks: [
      {
        type: 'paragraph',
        text: 'Data labeling is often the most expensive and time-consuming part of ML development. Supervised learning requires labeled examples, and the quality of labels directly determines the upper bound on model performance. Labeling strategies must balance quality, cost, and throughput.',
      },
      {
        type: 'callout',
        variant: 'note',
        title: 'The Labeling Bottleneck',
        text: 'Industry surveys consistently show that data labeling consumes 25-80% of the time and budget of ML projects. For a medical imaging project, a single expert radiologist might label 50 images per hour at $150/hour, meaning 10,000 labeled images costs $30,000 in labeling alone. This economic reality drives the search for more efficient labeling strategies.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Human Labeling',
      },
      {
        type: 'paragraph',
        text: 'Human labeling remains the gold standard for many tasks but faces challenges of scale, consistency, and cost. Labeling platforms provide workforce management, quality control, and tooling for annotation tasks.',
      },
      {
        type: 'table',
        headers: ['Platform', 'Workforce', 'Key Feature', 'Best For'],
        rows: [
          ['Labelbox', 'Your team or crowd', 'Strong ML-assisted labeling', 'Image and video annotation'],
          ['Scale AI', 'Managed workforce', 'High-quality at scale', 'Autonomous driving, enterprise'],
          ['SageMaker Ground Truth', 'Amazon Mechanical Turk + custom', 'AWS integration, active learning', 'AWS-native ML teams'],
          ['Label Studio', 'Self-managed (open source)', 'Flexible, customizable', 'Teams wanting full control'],
          ['Prodigy', 'Your domain experts', 'Active learning built-in', 'NLP tasks, small expert teams'],
        ],
        caption: 'Table 6.2: Comparison of data labeling platforms.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Active Learning',
      },
      {
        type: 'definition',
        term: 'Active Learning',
        definition: 'A strategy that selects the most informative unlabeled examples for human annotation, reducing labeling costs by focusing human effort where it most improves the model. The model queries for labels on examples where it is most uncertain, rather than labeling data randomly.',
      },
      {
        type: 'paragraph',
        text: 'Active learning reduces labeling costs by intelligently selecting the most informative samples for human annotation. Rather than labeling data randomly, active learning queries the model to identify examples where it is most uncertain.',
      },
      {
        type: 'callout',
        variant: 'example',
        title: 'Active Learning in Practice',
        text: 'A spam detection team has 1 million unlabeled emails and a budget to label 5,000. Instead of randomly selecting 5,000, they train an initial model on 500 random labels, then use uncertainty sampling to select the next 500 emails where the model is least confident. After 10 rounds of this active learning loop, their model with 5,000 strategically chosen labels outperforms a model trained on 20,000 randomly selected labels.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Weak Supervision and Programmatic Labeling',
      },
      {
        type: 'definition',
        term: 'Weak Supervision',
        definition: 'An approach that generates training labels programmatically using labeling functions — heuristics, patterns, external knowledge bases, or pre-trained models. The noisy labels from multiple functions are combined using statistical methods to produce aggregate training labels at massive scale.',
      },
      {
        type: 'paragraph',
        text: 'Weak supervision and programmatic labeling offer alternatives to manual annotation. Frameworks like Snorkel enable engineers to write labeling functions that encode heuristics, patterns, and external knowledge sources.',
      },
      {
        type: 'code',
        language: 'python',
        code: '# Example labeling functions in Snorkel\nfrom snorkel.labeling import labeling_function\n\n@labeling_function()\ndef lf_keyword_spam(x):\n    \"\"\"Flag emails containing common spam keywords.\"\"\"\n    spam_words = [\'free\', \'winner\', \'click here\', \'act now\']\n    return SPAM if any(w in x.text.lower() for w in spam_words) else ABSTAIN\n\n@labeling_function()\ndef lf_short_email(x):\n    \"\"\"Very short emails with links are often spam.\"\"\"\n    return SPAM if len(x.text) < 50 and \'http\' in x.text else ABSTAIN\n\n# Snorkel combines these noisy functions statistically\n# to produce probabilistic training labels',
        caption: 'Example: Programmatic labeling functions with Snorkel.',
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'Combining Labeling Strategies',
        text: 'The most effective approach often combines strategies: use weak supervision to label the bulk of data cheaply, active learning to select the most valuable examples for human annotation, and human labels as the ground truth for evaluation. This hybrid approach achieves near-human label quality at a fraction of the cost of labeling everything manually.',
      },
    ],
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
    blocks: [
      {
        type: 'paragraph',
        text: 'Data versioning tracks changes to datasets over time, enabling reproducibility, debugging, and rollback. Just as code version control is fundamental to software engineering, data version control is essential for ML engineering. Without it, teams cannot reliably reproduce past training runs or diagnose model regressions.',
      },
      {
        type: 'definition',
        term: 'Data Versioning',
        definition: 'The practice of tracking and managing changes to datasets over time, analogous to code version control. Data versioning enables teams to reproduce any past training run, compare dataset changes between versions, and roll back to a known good state when issues are detected.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Versioning Tools',
      },
      {
        type: 'paragraph',
        text: 'Tools like DVC, LakeFS, and Delta Lake provide versioning capabilities for large datasets, each taking a different approach to the problem.',
      },
      {
        type: 'table',
        headers: ['Tool', 'Approach', 'Key Feature', 'Best For'],
        rows: [
          ['DVC', 'Content-addressable storage alongside Git', 'Git integration, pipeline tracking', 'Teams using Git, moderate data sizes'],
          ['LakeFS', 'Git-like branches for data lakes', 'Branch/merge/diff for data', 'Data lake environments, S3-compatible'],
          ['Delta Lake', 'ACID transactions on Parquet files', 'Time travel, schema enforcement', 'Spark ecosystems, large-scale data'],
          ['Pachyderm', 'Data versioning with pipeline lineage', 'Automatic provenance tracking', 'Complex pipeline-driven workflows'],
          ['Apache Iceberg', 'Table format with snapshot isolation', 'Schema evolution, partition evolution', 'Data warehouse modernization'],
        ],
        caption: 'Table 6.3: Data versioning tools and their strengths.',
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'DVC for Most Teams',
        text: 'For most ML teams starting with data versioning, DVC is the best default choice. It integrates naturally with Git (so your data versions are linked to code commits), supports all major cloud storage backends, and requires minimal infrastructure changes. Start with DVC and migrate to LakeFS or Delta Lake only if your data scale or workflow demands it.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Data Lineage',
      },
      {
        type: 'definition',
        term: 'Data Lineage',
        definition: 'The complete record of data provenance, tracking every transformation applied to data from its original source through the ML pipeline to the final model. Lineage answers "where did this data come from?" and "what happened to it along the way?" for any datum in the system.',
      },
      {
        type: 'paragraph',
        text: 'Data lineage tracks the complete provenance of data through the pipeline, recording every transformation applied from source to model. This audit trail is essential for debugging data quality issues, understanding model behavior, and complying with regulations.',
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Regulatory Requirements',
        text: 'Regulations like GDPR (EU), CCPA (California), and industry-specific rules increasingly require organizations to explain how automated decisions are made. Data lineage is essential for this explainability: you must be able to trace from a model prediction back through the training data to its original source. Without lineage, regulatory compliance is extremely difficult.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Storage and Format Considerations',
      },
      {
        type: 'paragraph',
        text: 'Effective data versioning requires infrastructure decisions about storage, deduplication, and access patterns.',
      },
      {
        type: 'list',
        ordered: false,
        items: [
          'Content-addressable storage — Files stored by their hash, so identical content is never duplicated across versions',
          'Columnar formats (Parquet, Arrow) — Enable reading specific columns without scanning the full dataset',
          'Partitioning — Organize data by date, category, or other keys for efficient incremental processing',
          'Compression — Snappy for speed, ZSTD for size, Gzip for compatibility',
        ],
      },
      {
        type: 'callout',
        variant: 'example',
        title: 'Debugging a Model Regression with Lineage',
        text: 'A recommendation model\'s click-through rate drops by 15% after a weekly retrain. Using data lineage, the team traces the training data back through the pipeline and discovers that a new data source was added that includes bot traffic (non-human clicks). Lineage identifies exactly which pipeline stage introduced the bad data. The team adds a bot filter, reverts to the previous data version, and retrains — restoring performance within hours instead of days.',
      },
      {
        type: 'callout',
        variant: 'note',
        title: 'The Cost of Not Versioning',
        text: 'Teams that skip data versioning often realize its importance the hard way: a model regresses in production, and they cannot determine which data change caused it. Reproducing the previous good model is impossible because the training data has been overwritten. The cost of retroactively adding data versioning to an existing pipeline far exceeds the cost of building it in from the start.',
      },
    ],
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
    blocks: [
      {
        type: 'paragraph',
        text: 'Data augmentation artificially increases the effective size and diversity of training data by applying transformations to existing examples. This is one of the most effective regularization techniques, improving model generalization while reducing the need for additional labeled data.',
      },
      {
        type: 'definition',
        term: 'Data Augmentation',
        definition: 'The technique of creating modified versions of training examples through label-preserving transformations (crops, flips, noise, etc.), effectively increasing the dataset size and diversity. Augmentation acts as a powerful regularizer that improves model generalization.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Image Augmentation',
      },
      {
        type: 'paragraph',
        text: 'For image data, common augmentations include random cropping, flipping, rotation, color jittering, and cutout. More advanced techniques like MixUp and CutMix create synthetic examples by blending pairs of training images and their labels.',
      },
      {
        type: 'table',
        headers: ['Technique', 'How It Works', 'Typical Improvement', 'Complexity'],
        rows: [
          ['Random Crop & Flip', 'Random spatial crops and horizontal flips', '1-3% accuracy', 'Simple'],
          ['Color Jitter', 'Random brightness, contrast, saturation changes', '0.5-1% accuracy', 'Simple'],
          ['Cutout / Random Erasing', 'Mask random rectangular regions', '0.5-1.5% accuracy', 'Simple'],
          ['MixUp', 'Blend pairs of images and labels linearly', '1-2% accuracy', 'Moderate'],
          ['CutMix', 'Cut and paste patches between images', '1-3% accuracy', 'Moderate'],
          ['RandAugment', 'Apply N random augmentations at magnitude M', '1-3% accuracy', 'Auto-tuned'],
        ],
        caption: 'Table 6.4: Common image augmentation techniques and typical improvements on ImageNet.',
      },
      {
        type: 'definition',
        term: 'MixUp',
        definition: 'An augmentation technique that creates synthetic training examples by taking weighted linear combinations of pairs of examples and their labels. Given two samples (x_i, y_i) and (x_j, y_j), MixUp produces (lambda * x_i + (1-lambda) * x_j, lambda * y_i + (1-lambda) * y_j) where lambda is sampled from a Beta distribution.',
      },
      {
        type: 'equation',
        latex: '\\tilde{x} = \\lambda x_i + (1 - \\lambda) x_j, \\quad \\tilde{y} = \\lambda y_i + (1 - \\lambda) y_j, \\quad \\lambda \\sim \\text{Beta}(\\alpha, \\alpha)',
        label: 'Equation 6.1: MixUp augmentation. Examples and labels are linearly interpolated using a mixing coefficient lambda drawn from a Beta distribution.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Text and Tabular Augmentation',
      },
      {
        type: 'paragraph',
        text: 'For text data, augmentation techniques include synonym replacement, random insertion, back-translation, and paraphrase generation using language models. For tabular data, techniques like SMOTE address class imbalance by generating synthetic minority examples through interpolation.',
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'Back-Translation for NLP',
        text: 'Back-translation is one of the most effective text augmentation techniques. Translate your training text to another language (e.g., English to French) and then back (French to English). The resulting paraphrase preserves meaning while introducing lexical and syntactic variation. Use multiple target languages for greater diversity.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Systems Considerations',
      },
      {
        type: 'paragraph',
        text: 'From a systems perspective, data augmentation should be applied on-the-fly during training rather than pre-computed, to maximize diversity without increasing storage requirements.',
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Augmentation as CPU Bottleneck',
        text: 'If augmentation is performed on the CPU while the model trains on the GPU, slow augmentation can starve the GPU and waste expensive compute. Profile your data loading pipeline to ensure augmentation throughput exceeds GPU training throughput. Use multi-worker data loading (num_workers in PyTorch) and GPU-accelerated augmentation (NVIDIA DALI) when needed.',
      },
      {
        type: 'code',
        language: 'python',
        code: '# Efficient augmentation pipeline with Albumentations\nimport albumentations as A\nfrom albumentations.pytorch import ToTensorV2\n\ntransform = A.Compose([\n    A.RandomResizedCrop(224, 224, scale=(0.08, 1.0)),\n    A.HorizontalFlip(p=0.5),\n    A.ColorJitter(brightness=0.4, contrast=0.4, saturation=0.4),\n    A.CoarseDropout(max_holes=1, max_height=56, max_width=56, p=0.5),\n    A.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),\n    ToTensorV2(),\n])\n# Albumentations is 2-5x faster than torchvision.transforms',
        caption: 'Example: A fast augmentation pipeline using Albumentations.',
      },
      {
        type: 'callout',
        variant: 'note',
        title: 'On-the-Fly vs. Pre-Computed',
        text: 'On-the-fly augmentation generates different augmented versions each epoch, providing virtually infinite training data diversity from a fixed dataset. Pre-computed augmentation stores augmented examples on disk, which limits diversity but avoids CPU bottlenecks. For most training setups, on-the-fly augmentation with proper multi-worker loading is preferred.',
      },
    ],
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
    blocks: [
      {
        type: 'paragraph',
        text: 'Data quality is the single most important factor in ML system performance. The adage "garbage in, garbage out" applies with particular force to ML, where models can silently learn patterns from data errors, duplicates, and label noise without any obvious symptoms until deployment.',
      },
      {
        type: 'quote',
        text: 'Your model is only as good as your data. No amount of architectural innovation can compensate for fundamentally flawed training data.',
        attribution: 'Common ML engineering axiom',
      },
      {
        type: 'definition',
        term: 'Data Quality',
        definition: 'The measure of data fitness for its intended use in ML, encompassing dimensions like completeness (no missing values), accuracy (correct labels), consistency (no conflicting records), freshness (up-to-date), and representativeness (covers the target distribution).',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Data Validation Frameworks',
      },
      {
        type: 'paragraph',
        text: 'Data validation frameworks enable teams to define expectations about data distributions, schema constraints, and statistical properties. These checks run automatically as part of the pipeline, catching issues before they corrupt training data.',
      },
      {
        type: 'table',
        headers: ['Framework', 'Type', 'Key Feature', 'Integration'],
        rows: [
          ['Great Expectations', 'Open-source', 'Declarative expectations with rich documentation', 'Airflow, Spark, pandas, SQL'],
          ['TFDV', 'Open-source (Google)', 'Automatic schema inference and drift detection', 'TFX pipeline, Apache Beam'],
          ['Pandera', 'Open-source', 'Pandas DataFrame type checking', 'pytest, CI pipelines'],
          ['Deequ', 'Open-source (Amazon)', 'Unit tests for data on Spark', 'Spark, AWS Glue'],
          ['Monte Carlo', 'SaaS', 'Automated anomaly detection, lineage', 'Most data warehouses and tools'],
        ],
        caption: 'Table 6.5: Data validation frameworks for ML data quality.',
      },
      {
        type: 'code',
        language: 'python',
        code: '# Data validation with Great Expectations\nimport great_expectations as gx\n\ncontext = gx.get_context()\nvalidator = context.sources.pandas_default.read_csv(\"training_data.csv\")\n\n# Define expectations\nvalidator.expect_column_values_to_not_be_null(\"user_id\")\nvalidator.expect_column_values_to_be_between(\"age\", min_value=0, max_value=150)\nvalidator.expect_column_mean_to_be_between(\"purchase_amount\", min_value=10, max_value=500)\nvalidator.expect_column_proportion_of_unique_values_to_be_between(\"email\", 0.95, 1.0)\n\nresults = validator.validate()\nif not results.success:\n    raise ValueError(\"Data quality checks failed!\")',
        caption: 'Example: Defining data quality expectations with Great Expectations.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Data Quality Dimensions',
      },
      {
        type: 'list',
        ordered: false,
        items: [
          'Completeness — Are there missing values? What is the null rate per column?',
          'Consistency — Do records conflict with each other or with business rules?',
          'Accuracy — Are labels correct? What is the estimated label noise rate?',
          'Freshness — How old is the data? Is it current enough for the model\'s purpose?',
          'Representativeness — Does the data cover the target distribution? Are minority groups underrepresented?',
          'Uniqueness — Are there duplicate records that would bias the training distribution?',
        ],
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Label Noise Is Everywhere',
        text: 'Real-world labels are rarely perfect. Studies have found 3-10% label error rates in popular benchmarks like ImageNet and CIFAR. In production data with crowd-sourced labels, error rates can reach 10-20%. Models trained on noisy labels learn the noise as signal, which degrades generalization. Use techniques like confident learning, label smoothing, and multi-annotator agreement to mitigate label noise.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Proactive Data Quality Management',
      },
      {
        type: 'paragraph',
        text: 'Proactive data quality management is more effective than reactive debugging. This includes establishing data contracts between producers and consumers, implementing continuous monitoring, and building automated alerts for drift detection.',
      },
      {
        type: 'definition',
        term: 'Data Contract',
        definition: 'A formal agreement between data producers and consumers that specifies the schema, quality constraints, freshness requirements, and SLAs for a data source. Data contracts prevent upstream changes from silently breaking downstream ML pipelines.',
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'Invest in Data Quality Early',
        text: 'Investing in data quality infrastructure early in a project pays dividends throughout the system lifetime. A data validation pipeline that catches a corrupted batch before it enters training saves far more than the cost of building the validation. Teams that skip data quality work inevitably spend more time debugging mysterious model regressions.',
      },
      {
        type: 'callout',
        variant: 'example',
        title: 'Data Contract Prevents Outage',
        text: 'An upstream team plans to change a feature column from integer to string representation. Because a data contract exists, their schema change fails validation in the CI pipeline before deployment. The ML team is notified, updates their feature pipeline to handle the new format, and both changes deploy together. Without the contract, the schema change would have caused the ML pipeline to fail silently or produce incorrect features.',
      },
    ],
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

export const learningObjectives: string[] = [
  'Design data pipelines that handle ingestion, transformation, and storage at scale',
  'Compare batch vs. streaming data processing architectures and their trade-offs',
  'Implement data quality validation and monitoring strategies',
  'Explain feature engineering best practices and feature store architectures',
  'Evaluate data versioning and lineage tracking solutions for ML workflows',
];
