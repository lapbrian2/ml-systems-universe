import type { ChapterQuiz } from '@/types/quiz';

export const ch09Quiz: ChapterQuiz = {
  chapterId: 'ch09',
  title: 'Efficient AI Quiz',
  description: 'Test your understanding of model compression, knowledge distillation, and efficient architecture design.',
  passingScore: 70,
  selectCount: 5,
  pool: [
    {
      id: 'ch09-q1',
      question: 'What is model compression in the context of efficient AI?',
      options: [
        'Zipping model files for faster download',
        'A family of techniques that reduce model size, computation, or memory while preserving as much accuracy as possible',
        'Removing comments from model code',
        'Using shorter variable names in the model definition',
      ],
      correctIndex: 1,
      explanation:
        'Model compression encompasses quantization, pruning, knowledge distillation, and architectural efficiency — all aimed at making models smaller and faster for deployment on resource-constrained devices while minimizing accuracy loss.',
      difficulty: 'easy',
    },
    {
      id: 'ch09-q2',
      question: 'What is knowledge distillation?',
      options: [
        'Extracting rules from a neural network in plain English',
        'Training a smaller student model to mimic the soft probability outputs of a larger teacher model',
        'Removing redundant layers from a deep network',
        'Converting a model from one framework to another',
      ],
      correctIndex: 1,
      explanation:
        'Knowledge distillation transfers "dark knowledge" from a large teacher to a compact student by training the student to match the teacher\'s soft output distribution (not just hard labels). The soft probabilities contain richer information about class relationships.',
      difficulty: 'medium',
    },
    {
      id: 'ch09-q3',
      question: 'What are FLOPs, and why are they important for efficient AI?',
      options: [
        'Floating-point operations, measuring the total arithmetic work needed for a model inference, indicating computational cost',
        'Failed looping operations in training code',
        'The number of floating-point parameters in a model',
        'The rate at which a GPU processes data',
      ],
      correctIndex: 0,
      explanation:
        'FLOPs (Floating Point Operations) quantify the arithmetic complexity of a model\'s forward pass. While not a perfect proxy for wall-clock time (memory access patterns also matter), FLOPs provide a hardware-independent measure for comparing model efficiency.',
      difficulty: 'easy',
    },
    {
      id: 'ch09-q4',
      question: 'What is the difference between structured and unstructured pruning?',
      options: [
        'Structured pruning removes individual weights; unstructured pruning removes entire channels or layers',
        'Structured pruning removes entire channels, filters, or layers; unstructured pruning removes individual weights based on magnitude',
        'They are the same technique applied to different model types',
        'Structured pruning only applies to CNNs; unstructured pruning only applies to Transformers',
      ],
      correctIndex: 1,
      explanation:
        'Unstructured pruning zeros individual weights (creating sparse tensors that require special hardware for speedup). Structured pruning removes entire units like channels or attention heads, directly reducing dimensions and achieving actual speedup on standard hardware.',
      difficulty: 'medium',
    },
    {
      id: 'ch09-q5',
      question: 'What is the "lottery ticket hypothesis"?',
      options: [
        'Only randomly selected training examples matter for model performance',
        'Dense networks contain sparse subnetworks (winning tickets) that can match the full network\'s accuracy when trained in isolation from initialization',
        'Larger models always outperform smaller ones',
        'The best hyperparameters can be found by random search',
      ],
      correctIndex: 1,
      explanation:
        'Frankle and Carlin (2019) showed that within randomly initialized dense networks, there exist sparse subnetworks that, when reset to their initial weights and retrained, achieve comparable accuracy. This suggests most parameters may be unnecessary.',
      difficulty: 'hard',
    },
    {
      id: 'ch09-q6',
      question: 'What is an efficient architecture design, such as MobileNet?',
      options: [
        'A model designed to only work on mobile phones',
        'An architecture that uses design innovations like depthwise separable convolutions to achieve strong accuracy with significantly fewer FLOPs and parameters',
        'A model that trains faster but has lower accuracy',
        'Any model with fewer than 1 million parameters',
      ],
      correctIndex: 1,
      explanation:
        'Efficient architectures like MobileNet, EfficientNet, and ShuffleNet use building blocks (depthwise separable convolutions, inverted residuals, squeeze-and-excitation) designed to maximize the accuracy-per-FLOP ratio for resource-constrained deployment.',
      difficulty: 'medium',
    },
    {
      id: 'ch09-q7',
      question: 'Why does reducing model size not always proportionally reduce inference latency?',
      options: [
        'Smaller models always run faster by exactly the same factor',
        'Inference speed also depends on memory bandwidth, hardware utilization, parallelism, and software optimization — not just operation count',
        'Latency is determined solely by the number of parameters',
        'GPU clock speed is the only factor that affects latency',
      ],
      correctIndex: 1,
      explanation:
        'A model with 50% fewer FLOPs may not be 2x faster because inference speed depends on memory access patterns, kernel launch overhead, hardware parallelism utilization, and whether the bottleneck is compute-bound or memory-bound (see the roofline model).',
      difficulty: 'hard',
    },
    {
      id: 'ch09-q8',
      question: 'What is early exit in efficient inference?',
      options: [
        'Stopping training early when the model converges',
        'Attaching intermediate classifiers to a network so that easy inputs can be classified at earlier layers without running the full model',
        'Removing the last few layers of a pre-trained model',
        'Terminating inference if it takes too long',
      ],
      correctIndex: 1,
      explanation:
        'Early exit networks attach classifier heads at intermediate layers. For easy inputs where the early classifier is confident, inference stops early, saving computation. Harder inputs proceed through deeper layers. This provides adaptive computation per input.',
      difficulty: 'hard',
    },
    {
      id: 'ch09-q9',
      question: 'What is the accuracy-efficiency trade-off in model design?',
      options: [
        'More efficient models are always more accurate',
        'There is no trade-off; you can have both maximum accuracy and maximum efficiency',
        'Making models smaller or faster typically costs some accuracy, and the goal is to find the best balance for the deployment constraints',
        'Accuracy only matters in research, not in production',
      ],
      correctIndex: 2,
      explanation:
        'Efficient AI recognizes that real-world deployment imposes constraints (latency, memory, power, cost). The goal is not maximum accuracy but the best accuracy achievable within the resource budget — the Pareto frontier of accuracy vs. efficiency.',
      difficulty: 'easy',
    },
    {
      id: 'ch09-q10',
      question: 'What role does hardware-aware design play in efficient AI?',
      options: [
        'It is irrelevant since all hardware runs models the same way',
        'Designing model architectures and optimizations that account for the specific capabilities and bottlenecks of target hardware',
        'It only matters for custom ASIC chips',
        'It means buying the most expensive hardware available',
      ],
      correctIndex: 1,
      explanation:
        'Different hardware has different strengths: GPUs favor large parallel matrix operations, edge NPUs may prefer specific operation types. Hardware-aware NAS and optimization (like using operations that map well to the target hardware) can dramatically improve real-world performance.',
      difficulty: 'medium',
    },
  ],
};
