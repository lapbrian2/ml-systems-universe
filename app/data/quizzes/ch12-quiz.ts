import type { ChapterQuiz } from '~/types/quiz';

export const ch12Quiz: ChapterQuiz = {
  chapterId: 'ch12',
  title: 'Benchmarking Quiz',
  description: 'Test your understanding of ML benchmarking, MLPerf, profiling tools, and performance measurement.',
  passingScore: 70,
  selectCount: 5,
  pool: [
    {
      id: 'ch12-q1',
      question: 'What is MLPerf?',
      options: [
        'A machine learning framework developed by Google',
        'An industry-standard benchmark suite for measuring ML system performance across training and inference',
        'A profiling tool built into PyTorch',
        'A leaderboard for academic ML research papers',
      ],
      correctIndex: 1,
      explanation:
        'MLPerf is a consortium-driven benchmark suite that provides standardized benchmarks for both ML training and inference. It enables fair, reproducible comparisons across hardware platforms, software stacks, and model architectures.',
      difficulty: 'easy',
    },
    {
      id: 'ch12-q2',
      question: 'What is the difference between latency and throughput as benchmarking metrics?',
      options: [
        'They measure the same thing in different units',
        'Latency measures the time for a single request; throughput measures the number of requests processed per unit time',
        'Latency is for GPUs; throughput is for CPUs',
        'Throughput is always more important than latency',
      ],
      correctIndex: 1,
      explanation:
        'Latency (e.g., p50, p99 in milliseconds) matters for interactive applications where users wait for responses. Throughput (e.g., images/second) matters for batch processing. Optimizing one often trades off against the other (e.g., batching improves throughput but increases latency).',
      difficulty: 'easy',
    },
    {
      id: 'ch12-q3',
      question: 'What is the significance of p99 latency in production benchmarking?',
      options: [
        'It is the average latency across all requests',
        'It is the latency below which 99% of requests complete, capturing worst-case tail behavior that affects user experience',
        'It measures the 99th percentile of model accuracy',
        'It is the time to process 99 requests',
      ],
      correctIndex: 1,
      explanation:
        'Tail latencies (p99, p999) are critical because even if median latency is low, the slowest 1% of requests can ruin user experience. In large-scale systems, every user request may fan out to many services, so tail latencies compound multiplicatively.',
      difficulty: 'medium',
    },
    {
      id: 'ch12-q4',
      question: 'What is profiling in the context of ML performance optimization?',
      options: [
        'Creating a profile page for an ML model on a website',
        'Instrumenting code to measure where time and resources are spent, identifying bottlenecks in computation, memory, and I/O',
        'Profiling the demographics of an ML dataset',
        'Benchmarking model accuracy across different test sets',
      ],
      correctIndex: 1,
      explanation:
        'Profiling tools (like NVIDIA Nsight, PyTorch Profiler, TensorBoard) break down execution time by operation, kernel, and hardware resource. This reveals whether bottlenecks are in computation, memory transfer, data loading, or I/O, guiding optimization efforts.',
      difficulty: 'medium',
    },
    {
      id: 'ch12-q5',
      question: 'Why is the roofline model useful for benchmarking?',
      options: [
        'It predicts model accuracy based on architecture',
        'It shows the theoretical performance ceiling based on hardware specs and reveals whether a workload is compute-bound or memory-bound',
        'It compares the cost of different cloud providers',
        'It measures the environmental impact of ML training',
      ],
      correctIndex: 1,
      explanation:
        'The roofline model visualizes the maximum attainable performance given a hardware\'s peak compute and memory bandwidth. By plotting an operation\'s actual performance, engineers can see how close they are to the theoretical limit and which resource is the bottleneck.',
      difficulty: 'medium',
    },
    {
      id: 'ch12-q6',
      question: 'What common pitfall can make ML benchmarks misleading?',
      options: [
        'Using standardized datasets',
        'Not accounting for warmup time, I/O overhead, and variance across runs, or cherry-picking favorable batch sizes and precision settings',
        'Running benchmarks on the same hardware used for training',
        'Using too many test samples',
      ],
      correctIndex: 1,
      explanation:
        'Benchmarks can be gamed or misleading if they exclude warmup overhead, use unrealistically large batch sizes, select favorable precision, or report only best-case numbers without variance. Rigorous benchmarking requires controlled conditions and statistical rigor.',
      difficulty: 'hard',
    },
    {
      id: 'ch12-q7',
      question: 'What does "time-to-accuracy" measure in training benchmarks?',
      options: [
        'The number of epochs to reach a target accuracy',
        'The total wall-clock time required for the training system to reach a specified accuracy threshold on a standard dataset',
        'The accuracy achieved after a fixed number of minutes',
        'The time to write training code',
      ],
      correctIndex: 1,
      explanation:
        'Time-to-accuracy measures the end-to-end wall-clock time (including data loading, computation, and communication) to reach a defined quality target. This is the primary metric in MLPerf Training, as it captures the real-world speed of the entire system.',
      difficulty: 'medium',
    },
    {
      id: 'ch12-q8',
      question: 'What is the importance of measuring energy efficiency in ML benchmarks?',
      options: [
        'It is irrelevant since energy is cheap',
        'Energy efficiency (performance per watt) determines operational cost and environmental impact, especially at scale and on battery-powered edge devices',
        'Only data center operators care about energy',
        'Energy is only relevant for training, not inference',
      ],
      correctIndex: 1,
      explanation:
        'At scale, energy cost can dominate ML infrastructure expenses. On edge devices, power budget directly limits model complexity. MLPerf has introduced power measurement tracks, recognizing that performance without power context is incomplete.',
      difficulty: 'hard',
    },
    {
      id: 'ch12-q9',
      question: 'What is a "closed division" vs. "open division" in MLPerf?',
      options: [
        'Closed is for companies; open is for universities',
        'Closed division uses fixed models and training recipes for apples-to-apples hardware comparison; open division allows any model and technique for maximum innovation',
        'Closed benchmarks are private; open benchmarks are published',
        'They refer to whether the source code is shared',
      ],
      correctIndex: 1,
      explanation:
        'MLPerf\'s closed division fixes the model, optimizer, and data augmentation to isolate hardware and system software differences. The open division allows any approach, encouraging algorithmic innovation. Together, they provide complementary insights.',
      difficulty: 'hard',
    },
    {
      id: 'ch12-q10',
      question: 'Why should you measure model accuracy alongside performance when benchmarking?',
      options: [
        'Accuracy and performance are completely independent',
        'Performance optimizations (like quantization or pruning) can degrade accuracy, so both must be reported together to give an honest picture',
        'Accuracy is only measured during training',
        'Performance benchmarks already include accuracy metrics',
      ],
      correctIndex: 1,
      explanation:
        'A model that runs 10x faster but has significantly degraded accuracy is not truly better. Reporting performance and accuracy together prevents misleading claims and ensures that optimizations provide genuine value for the deployment scenario.',
      difficulty: 'easy',
    },
  ],
};
