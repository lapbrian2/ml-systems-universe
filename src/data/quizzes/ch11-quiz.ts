import type { ChapterQuiz } from '@/types/quiz';

export const ch11Quiz: ChapterQuiz = {
  chapterId: 'ch11',
  title: 'AI Acceleration Quiz',
  description: 'Test your understanding of GPUs, TPUs, FPGAs, NPUs, and the roofline model for hardware-aware optimization.',
  passingScore: 70,
  selectCount: 5,
  pool: [
    {
      id: 'ch11-q1',
      question: 'Why are GPUs well-suited for deep learning workloads?',
      options: [
        'They have faster clock speeds than CPUs',
        'They have thousands of cores optimized for parallel matrix arithmetic, which is the dominant computation in neural networks',
        'They can only run ML workloads, not general-purpose computation',
        'They use less power than any other processor type',
      ],
      correctIndex: 1,
      explanation:
        'Deep learning is dominated by matrix multiplications and element-wise operations. GPUs have thousands of simple cores organized for massively parallel computation, making them ideal for the data-parallel nature of neural network operations.',
      difficulty: 'easy',
    },
    {
      id: 'ch11-q2',
      question: 'What is the roofline model in the context of hardware performance?',
      options: [
        'A model that predicts when hardware will become obsolete',
        'A visual model showing attainable performance as limited by either computational throughput or memory bandwidth, depending on operational intensity',
        'A neural network architecture for building detection',
        'A cost model for cloud GPU pricing',
      ],
      correctIndex: 1,
      explanation:
        'The roofline model plots attainable FLOPS against operational intensity (FLOPs/byte). Operations with low intensity are memory-bound (limited by bandwidth); operations with high intensity are compute-bound (limited by peak FLOPS). It reveals the true bottleneck.',
      difficulty: 'medium',
    },
    {
      id: 'ch11-q3',
      question: 'What distinguishes a TPU (Tensor Processing Unit) from a GPU?',
      options: [
        'TPUs can run any general-purpose software',
        'TPUs are custom ASICs designed specifically for matrix multiplication in neural networks, using a systolic array architecture',
        'TPUs are simply rebranded GPUs',
        'TPUs are slower but cheaper than GPUs',
      ],
      correctIndex: 1,
      explanation:
        'Google\'s TPUs are application-specific integrated circuits (ASICs) with a systolic array architecture optimized for dense matrix operations (the core of neural network computation). They sacrifice generality for extreme efficiency on ML-specific operations.',
      difficulty: 'medium',
    },
    {
      id: 'ch11-q4',
      question: 'What is the advantage of FPGAs for ML inference?',
      options: [
        'FPGAs are always faster than GPUs for any ML workload',
        'FPGAs offer reconfigurable hardware that can be customized for specific model architectures, providing good efficiency and flexibility',
        'FPGAs do not require any programming',
        'FPGAs have more memory than any other accelerator',
      ],
      correctIndex: 1,
      explanation:
        'FPGAs (Field-Programmable Gate Arrays) can be reprogrammed to create custom data paths tailored to specific neural network operations. They offer a middle ground between the flexibility of GPUs and the efficiency of custom ASICs, with lower power consumption.',
      difficulty: 'medium',
    },
    {
      id: 'ch11-q5',
      question: 'What is "operational intensity" in the roofline model?',
      options: [
        'The difficulty level of implementing an operation',
        'The ratio of floating-point operations to bytes moved from memory (FLOPs/byte), determining whether computation is memory- or compute-bound',
        'The percentage of GPU cores being utilized',
        'The power consumption per operation',
      ],
      correctIndex: 1,
      explanation:
        'Operational intensity (also called arithmetic intensity) measures how much computation is done per byte of data moved. Low intensity means the operation is starved for data (memory-bound); high intensity means the hardware\'s compute is the limit (compute-bound).',
      difficulty: 'hard',
    },
    {
      id: 'ch11-q6',
      question: 'What is the role of Tensor Cores in modern NVIDIA GPUs?',
      options: [
        'They manage memory allocation for tensors',
        'They are specialized hardware units that perform mixed-precision matrix multiply-and-accumulate operations in a single cycle',
        'They provide additional CPU cores for data preprocessing',
        'They are used exclusively for graphics rendering',
      ],
      correctIndex: 1,
      explanation:
        'Tensor Cores perform small matrix multiplications (e.g., 4x4) in one clock cycle at mixed precision (FP16 inputs, FP32 accumulate). This dramatically accelerates the dominant operation in deep learning — matrix multiplication — compared to standard CUDA cores.',
      difficulty: 'hard',
    },
    {
      id: 'ch11-q7',
      question: 'What is an NPU (Neural Processing Unit)?',
      options: [
        'A software library for neural network optimization',
        'A dedicated low-power accelerator designed for on-device neural network inference in mobile and edge devices',
        'A type of CPU designed by NVIDIA',
        'A debugging tool for neural networks',
      ],
      correctIndex: 1,
      explanation:
        'NPUs are specialized processors built into mobile SoCs (e.g., Apple Neural Engine, Qualcomm Hexagon) specifically for efficient neural network inference. They are optimized for low power consumption and common ML operations at reduced precision (INT8, INT4).',
      difficulty: 'easy',
    },
    {
      id: 'ch11-q8',
      question: 'Why does memory bandwidth often matter more than peak compute for ML inference?',
      options: [
        'It does not; compute is always the bottleneck',
        'Many inference operations (especially at small batch sizes) have low operational intensity, making data movement the bottleneck rather than arithmetic',
        'Memory bandwidth only matters for training, not inference',
        'Modern GPUs have unlimited memory bandwidth',
      ],
      correctIndex: 1,
      explanation:
        'At inference (typically batch size 1 or small), many operations cannot fully saturate the compute units, and the time is dominated by loading weights from memory. This is why memory bandwidth and model size often determine real-world inference latency.',
      difficulty: 'hard',
    },
    {
      id: 'ch11-q9',
      question: 'What is the systolic array architecture used in TPUs?',
      options: [
        'A random access memory layout for storing activations',
        'A grid of processing elements where data flows rhythmically through the array, enabling efficient matrix multiplication with minimal memory access',
        'A software scheduling algorithm for GPU kernels',
        'A type of neural network layer',
      ],
      correctIndex: 1,
      explanation:
        'In a systolic array, processing elements are arranged in a grid. Data is loaded from memory once and flows through the array, being reused by multiple elements. This dramatically reduces memory accesses during matrix multiplication, which is the core of DNN computation.',
      difficulty: 'hard',
    },
    {
      id: 'ch11-q10',
      question: 'What is hardware-software co-design in the context of ML acceleration?',
      options: [
        'Using the same programming language for hardware and software',
        'Jointly designing model architectures and hardware accelerators so each is optimized for the other',
        'Running software directly on the hardware without an operating system',
        'Designing user interfaces for hardware monitoring dashboards',
      ],
      correctIndex: 1,
      explanation:
        'Co-design means considering hardware capabilities when designing models (e.g., using operations that map efficiently to the target chip) and conversely designing hardware to accelerate the most common model operations. This joint optimization yields the best efficiency.',
      difficulty: 'easy',
    },
  ],
};
