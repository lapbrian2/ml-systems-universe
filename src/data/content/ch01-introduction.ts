import type { ChapterSection, GlossaryTerm } from '@/types/chapter';

export const sections: ChapterSection[] = [
  {
    id: 'ch01-s1',
    heading: 'Why ML Systems Matter',
    body: 'Machine learning has moved far beyond research papers and Jupyter notebooks. Today, ML is embedded in billions of devices, from cloud data centers processing petabytes of data to microcontrollers running on milliwatts of power. This shift demands a systems-level understanding that bridges the gap between algorithmic innovation and real-world deployment.\n\nThe field of ML systems engineering recognizes that building a good model is only a small fraction of the overall challenge. Google famously illustrated this with the "hidden technical debt" paper, showing that ML code represents a tiny portion of a production ML system. The surrounding infrastructure for data collection, feature extraction, monitoring, and serving dwarfs the model itself.\n\nSystems thinking provides a framework for reasoning about these complex, interconnected components. Rather than optimizing a single metric in isolation, ML systems engineers must balance accuracy, latency, throughput, energy consumption, cost, and reliability simultaneously. This holistic perspective is what separates a research prototype from a production system serving millions of users.',
    order: 0,
    keyConcepts: [
      { term: 'ML Systems Engineering', definition: 'The discipline of designing, building, and maintaining the complete infrastructure required to develop, deploy, and operate machine learning models in production environments.' },
      { term: 'Hidden Technical Debt', definition: 'The accumulating maintenance costs in ML systems that arise from complex dependencies, data management challenges, and configuration issues beyond the model code itself.' },
    ],
  },
  {
    id: 'ch01-s2',
    heading: 'The ML Lifecycle',
    body: 'The machine learning lifecycle encompasses every stage from problem formulation to model retirement. It begins with defining the problem and identifying the right data sources, moves through data collection and preprocessing, model development and training, evaluation and validation, and finally deployment and monitoring.\n\nUnlike traditional software, ML systems have a dual lifecycle: the software lifecycle and the model lifecycle. The software components follow conventional engineering practices, but the model must be continuously retrained and updated as data distributions shift over time. This creates unique challenges around versioning, reproducibility, and rollback strategies.\n\nEach stage of the lifecycle presents distinct systems challenges. Data collection requires robust pipelines that handle scale and quality. Training demands efficient use of compute resources. Deployment must meet strict latency and throughput requirements. Monitoring must detect when model performance degrades. Understanding these stages holistically is the foundation of ML systems engineering.\n\nThe iterative nature of ML development means that teams frequently cycle back through earlier stages. A model that underperforms in production may reveal data quality issues that require revisiting the collection pipeline. This feedback loop is a defining characteristic of ML systems and must be supported by the underlying infrastructure.',
    order: 1,
    keyConcepts: [
      { term: 'ML Lifecycle', definition: 'The complete sequence of stages a machine learning model passes through, from problem definition and data collection through training, deployment, monitoring, and eventual retirement.' },
    ],
  },
  {
    id: 'ch01-s3',
    heading: 'Embedded ML and TinyML',
    body: 'Embedded machine learning brings inference capabilities directly to edge devices such as smartphones, wearables, and IoT sensors. Rather than sending data to the cloud for processing, embedded ML enables real-time, on-device decision-making with lower latency, improved privacy, and reduced bandwidth costs.\n\nTinyML takes this concept to the extreme, targeting microcontrollers with as little as 256 KB of memory and operating on microwatts of power. Despite these severe resource constraints, TinyML enables always-on sensing applications like keyword detection, gesture recognition, and anomaly detection on battery-powered devices.\n\nThe systems challenges for embedded and TinyML are fundamentally different from cloud-based ML. Engineers must consider memory footprints measured in kilobytes, inference latency in microseconds, and energy budgets in millijoules. Model optimization techniques like quantization, pruning, and knowledge distillation become essential rather than optional.\n\nThe growth of TinyML has created a new design paradigm where hardware constraints directly influence model architecture choices. Rather than designing the best possible model and then compressing it, practitioners increasingly co-design models and hardware together to achieve optimal efficiency within strict resource budgets.',
    order: 2,
    keyConcepts: [
      { term: 'Embedded ML', definition: 'The practice of running machine learning models directly on edge devices such as smartphones and IoT sensors, enabling real-time inference without cloud connectivity.' },
      { term: 'TinyML', definition: 'A subfield of embedded ML focused on running machine learning models on microcontrollers with extremely limited memory (often under 1 MB) and power budgets (milliwatts or less).' },
    ],
  },
  {
    id: 'ch01-s4',
    heading: 'Systems Thinking for ML',
    body: 'Systems thinking is the practice of understanding how components interact within a larger whole, rather than analyzing each component in isolation. For ML systems, this means considering how data pipelines, model architectures, hardware platforms, and deployment infrastructure influence each other.\n\nA key principle of systems thinking is that optimizing individual components does not necessarily optimize the overall system. A model with 99% accuracy is worthless if the serving infrastructure cannot meet latency requirements. Similarly, the fastest inference engine provides no value if the data pipeline cannot deliver clean inputs reliably.\n\nTrade-off analysis is central to ML systems thinking. Every design decision involves balancing competing objectives: accuracy versus latency, model size versus quality, training cost versus generalization, and many others. Understanding these trade-offs requires both theoretical knowledge and practical engineering experience.\n\nSystems thinking also emphasizes feedback loops and emergent behaviors. In ML systems, feedback loops can be particularly dangerous: a recommendation system that biases toward popular content creates a reinforcing loop that reduces content diversity over time. Identifying and managing these dynamics is a critical skill for ML systems engineers.',
    order: 3,
    keyConcepts: [
      { term: 'Systems Thinking', definition: 'An analytical approach that focuses on how components of a system interrelate and work together over time, rather than examining each component in isolation.' },
      { term: 'Trade-off Analysis', definition: 'The systematic evaluation of competing design objectives (such as accuracy vs. latency) to find solutions that best satisfy overall system requirements.' },
    ],
  },
  {
    id: 'ch01-s5',
    heading: 'Course Roadmap and Learning Path',
    body: 'This course is structured around six major themes that mirror the lifecycle of building production ML systems. The foundations section establishes the theoretical and architectural knowledge needed to understand deep learning from a systems perspective.\n\nThe design principles section covers the practical methodology of ML development, including workflow management, data engineering, framework selection, and training strategies. These chapters equip learners with the tools and techniques used by practicing ML engineers.\n\nPerformance engineering forms the third major theme, addressing how to make ML systems fast, efficient, and cost-effective. This includes model optimization, hardware acceleration, and systematic benchmarking. The deployment section then covers how to reliably operate ML systems in production, including on-device deployment, security, and robustness.\n\nThe course concludes with sections on trustworthy AI and frontier topics. Trustworthy AI covers the ethical, social, and environmental dimensions of ML systems. The frontiers section examines emerging trends and future directions that will shape the field in coming years. Throughout all sections, the emphasis remains on the systems perspective that connects theory to practice.',
    order: 4,
  },
];

export const glossary: GlossaryTerm[] = [
  { term: 'ML Systems', definition: 'The complete set of software, hardware, and processes required to develop, deploy, and maintain machine learning models in production.' },
  { term: 'TinyML', definition: 'Machine learning inference on microcontrollers and extremely resource-constrained devices, typically using less than 1 mW of power.' },
  { term: 'Edge Computing', definition: 'Processing data near its source rather than in a centralized cloud data center, reducing latency and bandwidth requirements.' },
  { term: 'Technical Debt', definition: 'The accumulated cost of shortcuts and suboptimal design decisions that increase future maintenance burden in software and ML systems.' },
  { term: 'Model Lifecycle', definition: 'The stages a model passes through from initial development to production deployment, monitoring, retraining, and eventual retirement.' },
  { term: 'Inference', definition: 'The process of using a trained machine learning model to make predictions on new, unseen data.' },
];

export const keyTakeaways: string[] = [
  'ML systems engineering goes far beyond model development, encompassing data pipelines, infrastructure, deployment, and monitoring.',
  'Systems thinking requires balancing competing objectives like accuracy, latency, cost, and energy consumption.',
  'The ML lifecycle is inherently iterative, with feedback loops between deployment monitoring and earlier development stages.',
  'Embedded ML and TinyML bring unique systems challenges around extreme resource constraints.',
  'Understanding trade-offs is the most important skill for an ML systems engineer.',
];
