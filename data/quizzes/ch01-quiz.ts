import type { ChapterQuiz } from '~/types/quiz';

export const ch01Quiz: ChapterQuiz = {
  chapterId: 'ch01',
  title: 'Introduction Quiz',
  description: 'Test your understanding of ML Systems engineering fundamentals.',
  passingScore: 70,
  selectCount: 5,
  pool: [
    {
      id: 'ch01-q1',
      question: 'What is the primary distinction between ML research and ML systems engineering?',
      options: [
        'ML research focuses on accuracy while ML systems engineering focuses on speed',
        'ML research develops algorithms while ML systems engineering designs end-to-end production systems',
        'ML research uses Python while ML systems engineering uses C++',
        'There is no meaningful distinction between them',
      ],
      correctIndex: 1,
      explanation:
        'ML systems engineering goes beyond algorithm development to encompass the entire lifecycle: data pipelines, training infrastructure, deployment, monitoring, and maintenance of production ML systems.',
      difficulty: 'easy',
    },
    {
      id: 'ch01-q2',
      question: 'Why is "systems thinking" critical in ML engineering?',
      options: [
        'It helps write faster code',
        'It ensures models achieve state-of-the-art accuracy',
        'It reveals how components interact and where failures propagate across the full ML stack',
        'It is required by most ML frameworks',
      ],
      correctIndex: 2,
      explanation:
        'Systems thinking helps engineers understand that changes in one component (e.g., data quality) ripple through training, inference, and deployment. Isolated optimization without understanding system interactions leads to brittle ML systems.',
      difficulty: 'medium',
    },
    {
      id: 'ch01-q3',
      question: 'What percentage of code in a real-world ML system is typically the ML model itself?',
      options: [
        'About 80-90%',
        'About 50-60%',
        'About 20-30%',
        'Only about 5-10%',
      ],
      correctIndex: 3,
      explanation:
        'Research by Google (Sculley et al., 2015) showed that ML model code represents only a small fraction of a real ML system. The majority is infrastructure: data collection, feature engineering, serving, monitoring, and configuration.',
      difficulty: 'medium',
    },
    {
      id: 'ch01-q4',
      question: 'Which of these is NOT a typical component of an ML system?',
      options: [
        'Data validation pipeline',
        'Model serving infrastructure',
        'Manual feature annotation at inference time',
        'Monitoring and alerting system',
      ],
      correctIndex: 2,
      explanation:
        'Production ML systems automate feature computation at inference time. Manual annotation is part of data labeling during training, not a component of the inference pipeline.',
      difficulty: 'easy',
    },
    {
      id: 'ch01-q5',
      question: 'What is "technical debt" in the context of ML systems?',
      options: [
        'The financial cost of cloud computing for ML',
        'Hidden complexity and maintenance burden that accumulates from shortcuts in ML system design',
        'The time spent debugging model accuracy issues',
        'The cost of GPU hardware depreciation',
      ],
      correctIndex: 1,
      explanation:
        'ML systems are particularly prone to technical debt due to data dependencies, configuration complexity, and the difficulty of testing ML components. This debt compounds over time, making systems harder to maintain and evolve.',
      difficulty: 'medium',
    },
    {
      id: 'ch01-q6',
      question: 'What does "the ML lifecycle" refer to?',
      options: [
        'The time it takes to train a single model',
        'The full iterative process from problem definition through data, modeling, deployment, and monitoring',
        'The deprecation schedule for ML frameworks',
        'The hardware upgrade cycle for ML infrastructure',
      ],
      correctIndex: 1,
      explanation:
        'The ML lifecycle encompasses the complete journey: defining the problem, collecting and preparing data, selecting and training models, validating results, deploying to production, monitoring performance, and iterating on improvements.',
      difficulty: 'easy',
    },
    {
      id: 'ch01-q7',
      question: 'Why is reproducibility particularly challenging in ML systems?',
      options: [
        'Programming languages change too frequently',
        'ML depends on non-deterministic operations, data versions, and complex environment configurations',
        'Cloud providers prevent reproducible deployments',
        'ML models are too simple to reproduce',
      ],
      correctIndex: 1,
      explanation:
        'ML reproducibility is complicated by floating-point non-determinism, GPU parallelism, data drift, software version dependencies, and the interaction between many configurable hyperparameters. This requires careful versioning of data, code, and environment.',
      difficulty: 'hard',
    },
    {
      id: 'ch01-q8',
      question: 'According to the course, what is the relationship between model accuracy and system quality?',
      options: [
        'They are the same thing',
        'Higher model accuracy always leads to better system quality',
        'Model accuracy is one factor among many including latency, reliability, cost, and fairness',
        'System quality is irrelevant if model accuracy is high enough',
      ],
      correctIndex: 2,
      explanation:
        'A highly accurate model that is too slow, too expensive, unreliable, or biased fails as a system. Production ML requires balancing accuracy with latency, throughput, cost, fairness, interpretability, and operational robustness.',
      difficulty: 'medium',
    },
    {
      id: 'ch01-q9',
      question: 'What did Sculley et al. (2015) describe as "hidden technical debt" in ML systems?',
      options: [
        'The cost of GPU cloud instances',
        'Maintenance burden from data dependencies, configuration complexity, and entanglement that makes ML systems harder to change over time',
        'The salary cost of hiring ML engineers',
        'Bugs in open-source ML frameworks',
      ],
      correctIndex: 1,
      explanation:
        'The seminal Google paper identified ML-specific forms of technical debt beyond traditional software: data dependency chains, feedback loops, configuration as a liability, undeclared consumers, and entanglement where changing one feature affects all others.',
      difficulty: 'hard',
    },
    {
      id: 'ch01-q10',
      question: 'In an embedded ML (TinyML) scenario, which constraint most differentiates it from cloud-based ML?',
      options: [
        'The need for higher model accuracy',
        'Severe limitations in memory, compute, and power that require ultra-efficient models',
        'The inability to use neural networks at all',
        'The requirement to always be connected to the internet',
      ],
      correctIndex: 1,
      explanation:
        'TinyML targets microcontrollers with kilobytes of RAM and milliwatt power budgets. Models must be quantized, pruned, and purpose-built to fit within these extreme constraints, often running entirely on-device without cloud connectivity.',
      difficulty: 'medium',
    },
    {
      id: 'ch01-q11',
      question: 'A company deploys an ML model that works well initially but degrades over months. What is the most likely systems-level cause?',
      options: [
        'The GPU hardware is wearing out',
        'Data drift or concept drift has caused the production data distribution to shift from the training distribution',
        'The model weights have decayed due to bit rot in storage',
        'The programming language was updated',
      ],
      correctIndex: 1,
      explanation:
        'Data drift (input distribution changes) and concept drift (the relationship between inputs and outputs changes) are the most common causes of model degradation over time. This is why continuous monitoring and retraining pipelines are essential ML system components.',
      difficulty: 'hard',
    },
    {
      id: 'ch01-q12',
      question: 'Why is ML systems engineering considered more challenging than traditional software engineering?',
      options: [
        'ML uses more programming languages',
        'ML systems have additional complexity from data dependencies, model behavior that is learned rather than specified, and the difficulty of testing statistical outputs',
        'Traditional software is always simpler to build',
        'ML engineers have fewer tools available',
      ],
      correctIndex: 1,
      explanation:
        'Unlike traditional software where behavior is explicitly coded, ML system behavior emerges from data. This creates unique challenges: data quality directly affects correctness, testing is statistical rather than deterministic, and debugging requires understanding both code and data.',
      difficulty: 'medium',
    },
    {
      id: 'ch01-q13',
      question: 'What role does monitoring play in the ML lifecycle that distinguishes it from traditional software monitoring?',
      options: [
        'ML monitoring only tracks CPU utilization',
        'ML monitoring must track data quality, prediction distributions, and model performance metrics in addition to system health',
        'ML systems do not need monitoring once deployed',
        'Monitoring is only important during the training phase',
      ],
      correctIndex: 1,
      explanation:
        'Traditional monitoring tracks uptime and errors. ML monitoring must additionally track input data distributions, prediction distributions, feature drift, model accuracy on live data, and business metrics to detect silent model degradation.',
      difficulty: 'easy',
    },
  ],
};
