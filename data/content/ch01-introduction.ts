import type { ChapterSection, GlossaryTerm } from '~/types/chapter';

export const sections: ChapterSection[] = [
  {
    id: 'ch01-s1',
    heading: 'Why ML Systems Matter',
    body: 'Machine learning has moved far beyond research papers and Jupyter notebooks. Today, ML is embedded in billions of devices, from cloud data centers processing petabytes of data to microcontrollers running on milliwatts of power. This shift demands a systems-level understanding that bridges the gap between algorithmic innovation and real-world deployment.\n\nThe field of ML systems engineering recognizes that building a good model is only a small fraction of the overall challenge. Google famously illustrated this with the "hidden technical debt" paper, showing that ML code represents a tiny portion of a production ML system. The surrounding infrastructure for data collection, feature extraction, monitoring, and serving dwarfs the model itself.\n\nSystems thinking provides a framework for reasoning about these complex, interconnected components. Rather than optimizing a single metric in isolation, ML systems engineers must balance accuracy, latency, throughput, energy consumption, cost, and reliability simultaneously. This holistic perspective is what separates a research prototype from a production system serving millions of users.',
    blocks: [
      {
        type: 'paragraph',
        text: 'Machine learning has moved far beyond research papers and Jupyter notebooks. Today, ML is embedded in billions of devices, from cloud data centers processing petabytes of data to microcontrollers running on milliwatts of power. This shift demands a systems-level understanding that bridges the gap between algorithmic innovation and real-world deployment.',
      },
      {
        type: 'quote',
        text: 'Everyone wants to do the model work, not the plumbing. But it is the plumbing that makes or breaks a real-world ML system.',
        attribution: 'D. Sculley et al., "Hidden Technical Debt in Machine Learning Systems," NeurIPS 2015',
      },
      {
        type: 'definition',
        term: 'ML Systems Engineering',
        definition: 'The discipline of designing, building, and maintaining the complete infrastructure required to develop, deploy, and operate machine learning models in production environments. It encompasses data pipelines, training infrastructure, serving systems, and monitoring — not just the model itself.',
      },
      {
        type: 'paragraph',
        text: 'The field of ML systems engineering recognizes that building a good model is only a small fraction of the overall challenge. Google famously illustrated this with the "hidden technical debt" paper, showing that ML code represents a tiny portion of a production ML system. The surrounding infrastructure for data collection, feature extraction, monitoring, and serving dwarfs the model itself.',
      },
      {
        type: 'callout',
        variant: 'note',
        title: 'The 5% Rule',
        text: 'Google\'s landmark "Hidden Technical Debt in Machine Learning Systems" paper (Sculley et al., 2015) found that ML model code accounts for only about 5% of the total code in a production ML system. The remaining 95% consists of data pipelines, configuration, serving infrastructure, monitoring, and feature engineering.',
      },
      {
        type: 'figure',
        caption: 'Components of a production ML system. The ML model code (center, dark) is dwarfed by the surrounding infrastructure required for reliable operation.',
        alt: 'Diagram showing that ML code is a small box at the center of a much larger system, surrounded by data verification, feature extraction, configuration, monitoring, serving infrastructure, and process management.',
        number: 'Figure 1.1',
        component: 'MLSystemComponentsDiagram',
      },
      {
        type: 'paragraph',
        text: 'Systems thinking provides a framework for reasoning about these complex, interconnected components. Rather than optimizing a single metric in isolation, ML systems engineers must balance accuracy, latency, throughput, energy consumption, cost, and reliability simultaneously. This holistic perspective is what separates a research prototype from a production system serving millions of users.',
      },
      {
        type: 'list',
        ordered: false,
        items: [
          'Accuracy — Does the model produce correct predictions?',
          'Latency — How quickly does the system respond to a single request?',
          'Throughput — How many requests can the system process per second?',
          'Energy consumption — What is the power cost of training and inference?',
          'Monetary cost — What are the cloud compute and storage expenses?',
          'Reliability — Does the system operate correctly under failures and load?',
        ],
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'Think in Systems, Not Models',
        text: 'When evaluating any ML project, ask: "What happens to the prediction after the model produces it?" If you cannot trace the full path from raw data to user-facing outcome, you are thinking about a model — not a system.',
      },
    ],
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
    blocks: [
      {
        type: 'paragraph',
        text: 'The machine learning lifecycle encompasses every stage from problem formulation to model retirement. It begins with defining the problem and identifying the right data sources, moves through data collection and preprocessing, model development and training, evaluation and validation, and finally deployment and monitoring.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Stages of the ML Pipeline',
      },
      {
        type: 'figure',
        caption: 'The ML pipeline is a cycle, not a linear sequence. Feedback from monitoring in production drives improvements across every upstream stage.',
        alt: 'Circular diagram of the ML pipeline showing data collection, preprocessing, training, evaluation, deployment, and monitoring connected by arrows, with feedback loops from monitoring back to earlier stages.',
        number: 'Figure 1.2',
        component: 'MLPipelineDiagram',
      },
      {
        type: 'table',
        headers: ['Pipeline Stage', 'Primary Activity', 'Key Systems Challenge', 'Typical Tools'],
        rows: [
          ['Data Collection', 'Gathering raw data from sources', 'Scale, freshness, and labeling quality', 'Spark, Kafka, Airflow'],
          ['Preprocessing', 'Cleaning, transforming, feature engineering', 'Reproducibility and skew between training/serving', 'dbt, Feast, tf.Transform'],
          ['Training', 'Fitting model parameters to data', 'Efficient use of compute (GPUs/TPUs)', 'PyTorch, JAX, Ray Train'],
          ['Evaluation', 'Measuring model quality offline', 'Meaningful metrics that predict production performance', 'MLflow, Weights & Biases'],
          ['Deployment', 'Serving model predictions to users', 'Latency, throughput, and rollback safety', 'TF Serving, Triton, KServe'],
          ['Monitoring', 'Tracking live model behavior', 'Detecting data drift and silent failures', 'Prometheus, Evidently, Grafana'],
        ],
        caption: 'Table 1.1: ML pipeline stages and their associated systems challenges.',
      },
      {
        type: 'paragraph',
        text: 'Unlike traditional software, ML systems have a dual lifecycle: the software lifecycle and the model lifecycle. The software components follow conventional engineering practices, but the model must be continuously retrained and updated as data distributions shift over time. This creates unique challenges around versioning, reproducibility, and rollback strategies.',
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Data Distribution Shift',
        text: 'A model trained on last year\'s data may silently degrade when user behavior changes. Unlike a software bug that produces an error, a stale model continues to produce outputs — they are simply wrong. Continuous monitoring is not optional; it is a core requirement of any production ML system.',
      },
      {
        type: 'paragraph',
        text: 'Each stage of the lifecycle presents distinct systems challenges. Data collection requires robust pipelines that handle scale and quality. Training demands efficient use of compute resources. Deployment must meet strict latency and throughput requirements. Monitoring must detect when model performance degrades. Understanding these stages holistically is the foundation of ML systems engineering.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Feedback Loops and Iteration',
      },
      {
        type: 'paragraph',
        text: 'The iterative nature of ML development means that teams frequently cycle back through earlier stages. A model that underperforms in production may reveal data quality issues that require revisiting the collection pipeline. This feedback loop is a defining characteristic of ML systems and must be supported by the underlying infrastructure.',
      },
      {
        type: 'callout',
        variant: 'example',
        title: 'Iteration in Practice',
        text: 'A fraud detection team deploys a new model and monitors its precision in production. After two weeks, precision drops from 94% to 87%. Investigation reveals that a partner merchant changed their transaction format, introducing null values the preprocessing pipeline did not handle. The fix requires changes to the data pipeline — not the model — demonstrating why the lifecycle is a loop, not a line.',
      },
      {
        type: 'equation',
        latex: 'L = \\frac{1}{N}\\sum_{i=1}^{N}(y_i - \\hat{y}_i)^2',
        label: 'Equation 1.1: Mean Squared Error — a fundamental loss function used during the training stage to measure how far model predictions deviate from true values.',
      },
      {
        type: 'callout',
        variant: 'note',
        title: 'Why Loss Functions Matter at the Systems Level',
        text: 'The choice of loss function (Equation 1.1) is not purely a modeling decision. MSE penalizes large errors quadratically, which affects training time (more epochs to converge on outlier-heavy data), hardware requirements (gradient magnitudes influence numerical precision needs), and monitoring thresholds (acceptable loss values depend on the function\'s scale).',
      },
    ],
    order: 1,
    keyConcepts: [
      { term: 'ML Lifecycle', definition: 'The complete sequence of stages a machine learning model passes through, from problem definition and data collection through training, deployment, monitoring, and eventual retirement.' },
    ],
  },
  {
    id: 'ch01-s3',
    heading: 'Embedded ML and TinyML',
    body: 'Embedded machine learning brings inference capabilities directly to edge devices such as smartphones, wearables, and IoT sensors. Rather than sending data to the cloud for processing, embedded ML enables real-time, on-device decision-making with lower latency, improved privacy, and reduced bandwidth costs.\n\nTinyML takes this concept to the extreme, targeting microcontrollers with as little as 256 KB of memory and operating on microwatts of power. Despite these severe resource constraints, TinyML enables always-on sensing applications like keyword detection, gesture recognition, and anomaly detection on battery-powered devices.\n\nThe systems challenges for embedded and TinyML are fundamentally different from cloud-based ML. Engineers must consider memory footprints measured in kilobytes, inference latency in microseconds, and energy budgets in millijoules. Model optimization techniques like quantization, pruning, and knowledge distillation become essential rather than optional.\n\nThe growth of TinyML has created a new design paradigm where hardware constraints directly influence model architecture choices. Rather than designing the best possible model and then compressing it, practitioners increasingly co-design models and hardware together to achieve optimal efficiency within strict resource budgets.',
    blocks: [
      {
        type: 'paragraph',
        text: 'Embedded machine learning brings inference capabilities directly to edge devices such as smartphones, wearables, and IoT sensors. Rather than sending data to the cloud for processing, embedded ML enables real-time, on-device decision-making with lower latency, improved privacy, and reduced bandwidth costs.',
      },
      {
        type: 'definition',
        term: 'Edge Computing',
        definition: 'A computing paradigm where data processing occurs near the source of data — on or close to the device — rather than in a centralized cloud data center. For ML, this means running inference locally on phones, sensors, or gateways to reduce latency and network dependency.',
      },
      {
        type: 'figure',
        caption: 'Data flow in an edge ML system. Raw sensor data is processed locally on the device, with only aggregated results or anomalies transmitted to the cloud.',
        alt: 'Diagram showing sensor data flowing into an edge device running a local ML model, with a narrow channel of summarized results sent to the cloud, contrasted with a traditional architecture where all raw data is sent to the cloud.',
        number: 'Figure 1.3',
        component: 'DataFlowDiagram',
      },
      {
        type: 'heading',
        level: 3,
        text: 'TinyML: ML at the Extreme Edge',
      },
      {
        type: 'paragraph',
        text: 'TinyML takes this concept to the extreme, targeting microcontrollers with as little as 256 KB of memory and operating on microwatts of power. Despite these severe resource constraints, TinyML enables always-on sensing applications like keyword detection, gesture recognition, and anomaly detection on battery-powered devices.',
      },
      {
        type: 'definition',
        term: 'TinyML',
        definition: 'A subfield of embedded ML focused on running machine learning models on microcontrollers with extremely limited memory (often under 1 MB) and power budgets (milliwatts or less). TinyML enables always-on intelligent sensing at the extreme edge of the computing spectrum.',
      },
      {
        type: 'table',
        headers: ['Resource', 'Cloud ML', 'Mobile ML', 'TinyML'],
        rows: [
          ['Memory', '100s of GB', '4–12 GB', '256 KB – 1 MB'],
          ['Compute', 'GPU/TPU clusters', 'Mobile GPU/NPU', 'Cortex-M MCU'],
          ['Power', '200–300 W per GPU', '3–5 W', '1–100 mW'],
          ['Latency budget', '100s of ms (network)', '10–50 ms', '<1 ms (on-chip)'],
          ['Model size', 'Billions of parameters', 'Millions of parameters', 'Thousands of parameters'],
          ['Example', 'GPT-4, Gemini', 'On-device Siri, Google Lens', 'Keyword spotting, wake word'],
        ],
        caption: 'Table 1.2: Resource comparison across ML deployment targets.',
      },
      {
        type: 'paragraph',
        text: 'The systems challenges for embedded and TinyML are fundamentally different from cloud-based ML. Engineers must consider memory footprints measured in kilobytes, inference latency in microseconds, and energy budgets in millijoules. Model optimization techniques like quantization, pruning, and knowledge distillation become essential rather than optional.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Key Optimization Techniques',
      },
      {
        type: 'list',
        ordered: false,
        items: [
          'Quantization — Reducing numerical precision (e.g., 32-bit float to 8-bit integer) to shrink model size and accelerate computation.',
          'Pruning — Removing weights or neurons that contribute little to model output, yielding sparser and faster models.',
          'Knowledge distillation — Training a small "student" model to mimic the behavior of a larger "teacher" model.',
          'Neural architecture search (NAS) — Automatically discovering efficient architectures tailored to specific hardware constraints.',
        ],
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'Co-Design Thinking',
        text: 'The growth of TinyML has created a new design paradigm where hardware constraints directly influence model architecture choices. Rather than designing the best possible model and then compressing it, practitioners increasingly co-design models and hardware together to achieve optimal efficiency within strict resource budgets. Always ask: "What hardware will this model run on?" before choosing an architecture.',
      },
      {
        type: 'callout',
        variant: 'example',
        title: 'TinyML in the Real World',
        text: 'A wildlife conservation project uses solar-powered acoustic sensors in the Amazon rainforest to detect illegal chainsaw sounds. Each sensor runs a TinyML keyword-detection model on an ARM Cortex-M4 microcontroller. Because the model runs locally, the sensor only activates its satellite radio (the most power-hungry component) when a threat is detected — extending battery life from days to months.',
      },
    ],
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
    blocks: [
      {
        type: 'paragraph',
        text: 'Systems thinking is the practice of understanding how components interact within a larger whole, rather than analyzing each component in isolation. For ML systems, this means considering how data pipelines, model architectures, hardware platforms, and deployment infrastructure influence each other.',
      },
      {
        type: 'definition',
        term: 'Systems Thinking',
        definition: 'An analytical approach that focuses on how the components of a system interrelate and work together over time, rather than examining each component in isolation. In ML, it means reasoning about the interactions among data, models, hardware, and infrastructure as a unified whole.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'The Whole Is Greater Than the Sum of Its Parts',
      },
      {
        type: 'paragraph',
        text: 'A key principle of systems thinking is that optimizing individual components does not necessarily optimize the overall system. A model with 99% accuracy is worthless if the serving infrastructure cannot meet latency requirements. Similarly, the fastest inference engine provides no value if the data pipeline cannot deliver clean inputs reliably.',
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Local Optima Trap',
        text: 'Teams that optimize components in isolation often fall into the local optima trap. For example, a research team spends months improving model accuracy from 96% to 98%, only to discover that the 2x larger model cannot be served within the product\'s 50ms latency budget. A systems-aware team would have identified this constraint before investing the effort.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Trade-off Analysis',
      },
      {
        type: 'paragraph',
        text: 'Trade-off analysis is central to ML systems thinking. Every design decision involves balancing competing objectives. Understanding these trade-offs requires both theoretical knowledge and practical engineering experience.',
      },
      {
        type: 'definition',
        term: 'Trade-off Analysis',
        definition: 'The systematic evaluation of competing design objectives — such as accuracy vs. latency, model size vs. quality, or training cost vs. generalization — to find solutions that best satisfy overall system requirements within given constraints.',
      },
      {
        type: 'table',
        headers: ['Trade-off', 'Option A', 'Option B', 'Typical Resolution'],
        rows: [
          ['Accuracy vs. Latency', 'Larger model, higher accuracy', 'Smaller model, faster inference', 'Distill large model into a fast student model'],
          ['Model Size vs. Quality', 'Full-precision weights', 'Quantized / pruned weights', 'Post-training quantization with calibration'],
          ['Training Cost vs. Generalization', 'Train longer on more data', 'Train quickly on less data', 'Progressive training with early stopping'],
          ['Freshness vs. Stability', 'Retrain hourly', 'Retrain weekly', 'Canary deployments with rollback'],
          ['Privacy vs. Utility', 'Keep all user data', 'Anonymize / federate', 'Differential privacy or on-device learning'],
        ],
        caption: 'Table 1.3: Common trade-offs in ML systems design.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Feedback Loops and Emergent Behavior',
      },
      {
        type: 'paragraph',
        text: 'Systems thinking also emphasizes feedback loops and emergent behaviors. In ML systems, feedback loops can be particularly dangerous: a recommendation system that biases toward popular content creates a reinforcing loop that reduces content diversity over time. Identifying and managing these dynamics is a critical skill for ML systems engineers.',
      },
      {
        type: 'callout',
        variant: 'example',
        title: 'Feedback Loop in Recommendations',
        text: 'A music streaming service uses a model trained on listening history to recommend songs. Popular songs get recommended more, increasing their play counts, which makes the model recommend them even more. Over several months, the "long tail" of niche artists receives virtually zero recommendations — not because users dislike them, but because the feedback loop starved them of exposure. Breaking this loop requires deliberate exploration strategies such as epsilon-greedy or Thompson sampling.',
      },
      {
        type: 'quote',
        text: 'The most dangerous feedback loops in ML systems are the ones you do not know exist. Instrument everything, question every assumption, and remember that your model is changing the distribution it was trained on.',
        attribution: 'Adapted from principles in "Reliable Machine Learning" by Cathy Chen et al., O\'Reilly 2022',
      },
    ],
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
    blocks: [
      {
        type: 'paragraph',
        text: 'This course is structured around six major themes that mirror the lifecycle of building production ML systems. Each theme builds on the previous one, progressing from foundational understanding to advanced deployment and governance.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Part I: Foundations',
      },
      {
        type: 'paragraph',
        text: 'The foundations section establishes the theoretical and architectural knowledge needed to understand deep learning from a systems perspective. You will study how neural networks map to hardware, how memory hierarchies affect training throughput, and why computational graphs are the lingua franca of modern ML frameworks.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Part II: Design Principles',
      },
      {
        type: 'paragraph',
        text: 'The design principles section covers the practical methodology of ML development, including workflow management, data engineering, framework selection, and training strategies. These chapters equip learners with the tools and techniques used by practicing ML engineers.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Part III: Performance Engineering',
      },
      {
        type: 'paragraph',
        text: 'Performance engineering forms the third major theme, addressing how to make ML systems fast, efficient, and cost-effective. This includes model optimization, hardware acceleration, and systematic benchmarking.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Part IV: Deployment and Operations',
      },
      {
        type: 'paragraph',
        text: 'The deployment section covers how to reliably operate ML systems in production, including on-device deployment, security, and robustness.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Part V: Trustworthy AI',
      },
      {
        type: 'paragraph',
        text: 'Trustworthy AI covers the ethical, social, and environmental dimensions of ML systems. These chapters address fairness, accountability, transparency, and the growing environmental cost of large-scale model training.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Part VI: Frontiers',
      },
      {
        type: 'paragraph',
        text: 'The frontiers section examines emerging trends and future directions that will shape the field in coming years. Throughout all sections, the emphasis remains on the systems perspective that connects theory to practice.',
      },
      {
        type: 'table',
        headers: ['Part', 'Theme', 'Core Question'],
        rows: [
          ['I', 'Foundations', 'How do ML models map to hardware and software abstractions?'],
          ['II', 'Design Principles', 'How do we manage data, frameworks, and training at scale?'],
          ['III', 'Performance Engineering', 'How do we make ML systems fast and efficient?'],
          ['IV', 'Deployment & Operations', 'How do we serve models reliably in production?'],
          ['V', 'Trustworthy AI', 'How do we build ML systems that are fair, safe, and sustainable?'],
          ['VI', 'Frontiers', 'What comes next in ML systems research and practice?'],
        ],
        caption: 'Table 1.4: Course structure at a glance.',
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'How to Use This Textbook',
        text: 'Each chapter includes interactive visualizations, key concept definitions, and a glossary. Start with the sections most relevant to your current work, but return to the foundations chapters if you encounter unfamiliar systems concepts. The most effective way to learn ML systems engineering is by combining reading with hands-on experimentation.',
      },
      {
        type: 'list',
        ordered: true,
        items: [
          'Read the chapter narrative and study the diagrams.',
          'Review the key concepts and definitions at the end of each section.',
          'Explore the interactive visualizations to build intuition.',
          'Attempt the review questions before checking the glossary.',
          'Revisit earlier chapters as later topics reveal deeper connections.',
        ],
      },
    ],
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
