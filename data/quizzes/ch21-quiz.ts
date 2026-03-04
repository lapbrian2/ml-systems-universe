import type { ChapterQuiz } from '~/types/quiz';

export const ch21Quiz: ChapterQuiz = {
  chapterId: 'ch21',
  title: 'Conclusion Quiz',
  description: 'Test your synthesis of ML systems engineering concepts, future trends, and the broader field landscape.',
  passingScore: 70,
  selectCount: 5,
  pool: [
    {
      id: 'ch21-q1',
      question: 'What is the most important takeaway about ML systems engineering?',
      options: [
        'Model accuracy is the only metric that matters',
        'Building production ML requires integrating model development with data engineering, infrastructure, deployment, monitoring, and responsible AI practices as a holistic system',
        'ML systems engineering is just software engineering applied to ML',
        'The theoretical foundations are more important than practical systems concerns',
      ],
      correctIndex: 1,
      explanation:
        'The central theme is that ML systems are more than models: they require orchestrating data pipelines, training infrastructure, deployment strategies, monitoring, security, fairness, and sustainability. Success depends on this holistic, systems-level perspective.',
      difficulty: 'easy',
    },
    {
      id: 'ch21-q2',
      question: 'Why is the concept of "ML technical debt" important for the future of ML systems?',
      options: [
        'It only matters for small companies',
        'Because ML systems accumulate hidden complexity from data dependencies, configuration, and feedback loops that compound over time if not actively managed',
        'Technical debt does not apply to ML systems',
        'It only refers to the financial cost of GPU compute',
      ],
      correctIndex: 1,
      explanation:
        'ML technical debt (Sculley et al., 2015) arises from data dependencies, entangled features, feedback loops, configuration complexity, and undeclared consumers. Unlike code debt, ML debt is often invisible until it causes production failures, making proactive management essential.',
      difficulty: 'medium',
    },
    {
      id: 'ch21-q3',
      question: 'What trend is driving the need for efficient ML at the edge?',
      options: [
        'Decreasing internet bandwidth',
        'The proliferation of IoT devices, privacy requirements, latency needs, and the desire for ML capabilities everywhere — from phones to sensors to medical devices',
        'Edge devices are becoming more powerful than data centers',
        'Cloud computing is becoming unavailable',
      ],
      correctIndex: 1,
      explanation:
        'Billions of IoT devices, combined with privacy regulations, real-time latency requirements, and the vision of pervasive intelligence, drive the need to run ML on resource-constrained edge hardware. This makes efficient ML (TinyML, quantization, efficient architectures) increasingly critical.',
      difficulty: 'easy',
    },
    {
      id: 'ch21-q4',
      question: 'How do hardware and software co-evolution shape the future of ML systems?',
      options: [
        'Hardware and software evolve independently',
        'New hardware architectures (NPUs, neuromorphic chips) enable new model designs, while model requirements drive hardware innovation, creating a virtuous cycle of improvement',
        'Software improvements have made hardware irrelevant',
        'Only hardware improvements matter for ML progress',
      ],
      correctIndex: 1,
      explanation:
        'The co-evolution of hardware and models creates a virtuous cycle: Transformers drove demand for tensor cores; efficient architectures were designed for mobile NPUs; sparse models motivate sparse hardware. Future progress depends on continued tight co-design of both.',
      difficulty: 'medium',
    },
    {
      id: 'ch21-q5',
      question: 'What is the significance of reproducibility and standardization for the ML field?',
      options: [
        'Reproducibility is only needed for academic papers',
        'Reproducibility enables scientific rigor, builds trust, facilitates collaboration, and is essential for regulatory compliance in safety-critical deployments',
        'Standardization slows down innovation',
        'Reproducibility is impossible in ML due to randomness',
      ],
      correctIndex: 1,
      explanation:
        'Reproducibility is foundational: it validates claims, enables debugging, facilitates audits, supports regulatory approval (healthcare, finance, autonomous systems), and builds trust. Standards (like MLPerf benchmarks, model cards, ONNX) provide the infrastructure for reproducibility at scale.',
      difficulty: 'medium',
    },
    {
      id: 'ch21-q6',
      question: 'What emerging research direction aims to make ML models more data-efficient?',
      options: [
        'Using larger and larger datasets only',
        'Few-shot learning, meta-learning, and self-supervised pre-training that enable models to learn effectively from limited labeled data',
        'Eliminating the need for data entirely',
        'Only using synthetic data for all training',
      ],
      correctIndex: 1,
      explanation:
        'Data efficiency techniques — few-shot learning (learning from examples), meta-learning (learning to learn), self-supervised pre-training (leveraging unlabeled data), and transfer learning — reduce the labeled data requirement, democratizing ML for domains where labeled data is scarce.',
      difficulty: 'medium',
    },
    {
      id: 'ch21-q7',
      question: 'Why is interdisciplinary collaboration essential for the future of ML systems?',
      options: [
        'ML engineers can solve all problems independently',
        'Building trustworthy, impactful ML systems requires combining ML expertise with domain knowledge, ethics, law, design, and social science',
        'Interdisciplinary work slows down development',
        'Only computer scientists should work on ML systems',
      ],
      correctIndex: 1,
      explanation:
        'Production ML touches healthcare, law, education, and many other domains. Building effective and responsible systems requires domain expertise to define the problem correctly, ethicists to assess impact, designers for usability, and social scientists to understand societal effects.',
      difficulty: 'easy',
    },
    {
      id: 'ch21-q8',
      question: 'What role does open-source play in the ML systems ecosystem?',
      options: [
        'Open source is irrelevant to ML systems',
        'Open-source frameworks, models, and tools democratize access, enable reproducibility, foster innovation through community collaboration, and lower barriers to entry',
        'Open source only benefits large companies',
        'Open-source ML models are always worse than proprietary ones',
      ],
      correctIndex: 1,
      explanation:
        'Open source (PyTorch, TensorFlow, Hugging Face, Linux, Kubernetes) has been foundational to ML progress. It enables researchers and practitioners worldwide to build on shared tools, reproduce results, and contribute improvements, accelerating the entire field.',
      difficulty: 'easy',
    },
    {
      id: 'ch21-q9',
      question: 'What is the concept of "responsible scaling" in AI development?',
      options: [
        'Scaling models as fast as possible without constraints',
        'Increasing AI capabilities only when accompanied by proportional investments in safety evaluations, alignment research, and governance mechanisms',
        'Reducing the size of all AI models',
        'Only scaling AI in certain countries',
      ],
      correctIndex: 1,
      explanation:
        'Responsible scaling means that as AI systems become more capable, organizations should invest proportionally in understanding and mitigating risks: safety testing, red-teaming, alignment research, governance frameworks, and preparedness for potential failure modes.',
      difficulty: 'hard',
    },
    {
      id: 'ch21-q10',
      question: 'What is the key systems engineering principle that connects all chapters of the course?',
      options: [
        'Always use the largest possible model',
        'Every design decision involves trade-offs — accuracy vs. efficiency, privacy vs. utility, innovation vs. safety — and ML engineers must navigate these trade-offs thoughtfully for their specific context',
        'There is one best approach that works for all ML systems',
        'Systems engineering is only relevant for deployment, not research',
      ],
      correctIndex: 1,
      explanation:
        'The unifying principle is that ML systems engineering is about understanding and navigating trade-offs: model size vs. latency, privacy vs. utility, fairness vs. accuracy, innovation speed vs. safety. There are no universal best answers — only context-dependent good engineering decisions.',
      difficulty: 'hard',
    },
  ],
};
