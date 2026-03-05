import type { ChapterQuiz } from '~/types/quiz';

export const ch10Quiz: ChapterQuiz = {
  chapterId: 'ch10',
  title: 'Model Optimizations Quiz',
  description: 'Test your understanding of quantization, pruning, NAS, and operator fusion for production models.',
  passingScore: 70,
  selectCount: 5,
  pool: [
    {
      id: 'ch10-q1',
      question: 'What is quantization in the context of model optimization?',
      options: [
        'Adding more training data to improve accuracy',
        'Reducing the numerical precision of model weights and activations (e.g., from FP32 to INT8) to decrease model size and speed up inference',
        'Dividing the model into smaller sub-models',
        'Quantifying model accuracy with numerical metrics',
      ],
      correctIndex: 1,
      explanation:
        'Quantization maps floating-point values to lower-precision representations (e.g., 32-bit floats to 8-bit integers). This reduces memory footprint by up to 4x and enables faster integer arithmetic, which is critical for edge and mobile deployment.',
      difficulty: 'easy',
    },
    {
      id: 'ch10-q2',
      question: 'What is the difference between post-training quantization (PTQ) and quantization-aware training (QAT)?',
      options: [
        'They produce identical results',
        'PTQ quantizes a pre-trained model without retraining; QAT simulates quantization during training so the model learns to be robust to lower precision',
        'PTQ is more accurate than QAT',
        'QAT cannot be used with INT8 precision',
      ],
      correctIndex: 1,
      explanation:
        'PTQ is simpler (quantize after training) but can lose accuracy, especially for aggressive quantization. QAT inserts fake quantization operations during training, allowing the model to adapt its weights to quantization error, typically preserving more accuracy.',
      difficulty: 'medium',
    },
    {
      id: 'ch10-q3',
      question: 'What is weight pruning?',
      options: [
        'Increasing model weights to improve accuracy',
        'Removing weights with small magnitudes (setting them to zero), reducing the effective number of parameters and potentially computation',
        'Duplicating important weights for redundancy',
        'Reordering weights for better cache locality',
      ],
      correctIndex: 1,
      explanation:
        'Pruning removes parameters that contribute least to model output (typically those with smallest magnitude). This creates a sparser model that requires less storage and, with hardware/software support for sparse operations, less computation.',
      difficulty: 'easy',
    },
    {
      id: 'ch10-q4',
      question: 'What is operator fusion, and what performance benefit does it provide?',
      options: [
        'Combining two different models into one',
        'Merging consecutive operations (like Conv + BatchNorm + ReLU) into a single kernel, reducing memory reads/writes and kernel launch overhead',
        'Running operations on both CPU and GPU simultaneously',
        'Replacing operations with lookup tables',
      ],
      correctIndex: 1,
      explanation:
        'Without fusion, each operation reads input from memory, computes, and writes output. Fusing operations into one kernel keeps intermediate results in fast registers/cache, eliminating redundant memory traffic. This is one of the most impactful compiler optimizations.',
      difficulty: 'medium',
    },
    {
      id: 'ch10-q5',
      question: 'What is Neural Architecture Search (NAS) in the context of optimization?',
      options: [
        'Manually tweaking layer sizes until the model is fast enough',
        'An automated approach to finding the most efficient model architecture that meets both accuracy and resource constraints',
        'Searching for bugs in neural network code',
        'A technique for finding optimal learning rates',
      ],
      correctIndex: 1,
      explanation:
        'NAS automates architecture design by searching over a space of possible structures (number of layers, filter sizes, connections) to find architectures that optimize for both accuracy and efficiency metrics like latency, FLOPs, or model size.',
      difficulty: 'medium',
    },
    {
      id: 'ch10-q6',
      question: 'What is the calibration step in post-training quantization?',
      options: [
        'Measuring GPU temperature before inference',
        'Running a representative dataset through the model to determine the dynamic range of activations, which informs quantization scale factors',
        'Adjusting the learning rate after training',
        'Checking model accuracy on the test set',
      ],
      correctIndex: 1,
      explanation:
        'Calibration passes representative data through the model to observe the actual range of activation values at each layer. These observed ranges determine the quantization scale and zero-point parameters, which map floating-point ranges to integer ranges.',
      difficulty: 'hard',
    },
    {
      id: 'ch10-q7',
      question: 'What is the difference between symmetric and asymmetric quantization?',
      options: [
        'Symmetric is more accurate; asymmetric is faster',
        'Symmetric maps a symmetric range [-a, a] to integers; asymmetric uses a zero-point offset to handle ranges not centered at zero',
        'They only differ in the number of bits used',
        'Symmetric quantization only works for weights; asymmetric only for activations',
      ],
      correctIndex: 1,
      explanation:
        'Symmetric quantization assumes the value range is centered at zero, simplifying computation. Asymmetric quantization adds a zero-point offset, better handling activations like ReLU outputs (range [0, max]) at the cost of slightly more complex arithmetic.',
      difficulty: 'hard',
    },
    {
      id: 'ch10-q8',
      question: 'Why is batch normalization folding important for inference optimization?',
      options: [
        'It adds batch normalization to models that lack it',
        'It merges batch normalization parameters into the preceding convolution weights, eliminating a separate computation step at inference time',
        'It removes batch normalization entirely from the model',
        'It applies batch normalization during data preprocessing instead',
      ],
      correctIndex: 1,
      explanation:
        'During inference, batch normalization uses fixed statistics (mean, variance). These can be algebraically folded into the preceding layer\'s weights and biases, eliminating the BN layer as a separate operation. This reduces computation and simplifies the graph for further optimization.',
      difficulty: 'medium',
    },
    {
      id: 'ch10-q9',
      question: 'What are the main challenges of deploying quantized models?',
      options: [
        'Quantized models are always too large for edge devices',
        'Accuracy degradation on sensitive operations, handling of dynamic ranges, and ensuring hardware support for quantized operations',
        'Quantized models cannot be serialized',
        'Quantization is only possible for image classification models',
      ],
      correctIndex: 1,
      explanation:
        'Quantization challenges include accuracy loss on sensitive layers (often the first and last layers are kept at higher precision), choosing calibration data, handling outlier activations, and ensuring the target hardware efficiently supports quantized operations.',
      difficulty: 'hard',
    },
    {
      id: 'ch10-q10',
      question: 'What is the role of a model optimization toolkit like TensorRT or ONNX Runtime?',
      options: [
        'To train models from scratch more efficiently',
        'To apply graph optimizations, operator fusion, quantization, and hardware-specific tuning to maximize inference performance on target hardware',
        'To visualize model architectures',
        'To manage model versioning and deployment',
      ],
      correctIndex: 1,
      explanation:
        'Optimization toolkits take a trained model and apply a suite of optimizations — graph simplification, operator fusion, precision calibration, kernel auto-tuning — tailored to specific hardware. This can yield 2-10x inference speedups over naive execution.',
      difficulty: 'easy',
    },
    {
      id: 'ch10-q11',
      question: 'What is the difference between per-tensor and per-channel quantization?',
      options: [
        'Per-tensor is always more accurate',
        'Per-tensor uses one scale/zero-point for an entire tensor; per-channel uses separate values for each output channel, preserving more accuracy at slightly higher implementation complexity',
        'Per-channel quantization is only for activation tensors',
        'There is no practical difference between them',
      ],
      correctIndex: 1,
      explanation:
        'Per-channel quantization computes separate scale factors for each output channel of a weight tensor, accommodating the fact that different channels may have very different value ranges. This typically improves accuracy over per-tensor, especially for depthwise convolutions.',
      difficulty: 'hard',
    },
    {
      id: 'ch10-q12',
      question: 'A model has been pruned to 90% sparsity but inference speed has not improved. What is the most likely reason?',
      options: [
        'Pruning never improves speed',
        'Unstructured sparsity produces irregular memory access patterns that standard hardware cannot exploit without specialized sparse computation libraries or hardware',
        'The model was pruned too aggressively',
        'The remaining 10% of weights are too large',
      ],
      correctIndex: 1,
      explanation:
        'Unstructured pruning creates random zero patterns that GPUs cannot exploit efficiently because they are optimized for dense matrix operations. Structured pruning (removing entire channels/heads) or sparse hardware/kernels are needed to translate sparsity into actual speedups.',
      difficulty: 'hard',
    },
    {
      id: 'ch10-q13',
      question: 'What is the "graph optimization" phase in model optimization toolkits?',
      options: [
        'Visualizing the model as a chart for presentations',
        'Simplifying the computational graph by removing redundant operations, folding constants, eliminating dead code, and restructuring for hardware efficiency',
        'Optimizing the training data graph structure',
        'Searching for the best neural architecture',
      ],
      correctIndex: 1,
      explanation:
        'Graph optimization transforms the model\'s computational graph to be more efficient: constant folding pre-computes static expressions, dead code elimination removes unreachable nodes, and algebraic simplification reduces unnecessary operations, all before hardware-specific lowering.',
      difficulty: 'medium',
    },
    {
      id: 'ch10-q14',
      question: 'Why is mixed precision (FP16/INT8 for some layers, FP32 for others) commonly used in optimized inference?',
      options: [
        'It is only used to save disk space',
        'Sensitive layers (often the first and last) maintain higher precision for accuracy, while the bulk of computation uses lower precision for speed, achieving the best accuracy-efficiency balance',
        'All layers must use the same precision for correct results',
        'Mixed precision is only possible during training, not inference',
      ],
      correctIndex: 1,
      explanation:
        'Different layers have different sensitivity to quantization error. First layers (processing raw input) and last layers (producing final outputs) often need higher precision. Middle layers tolerate lower precision well. This selective approach maximizes speed while minimizing accuracy loss.',
      difficulty: 'medium',
    },
    {
      id: 'ch10-q15',
      question: 'What is kernel auto-tuning in the context of model optimization?',
      options: [
        'Automatically choosing the operating system kernel version',
        'Benchmarking multiple implementation variants of each operation on the target hardware and selecting the fastest one for the specific tensor shapes',
        'Tuning the number of kernels in convolutional layers',
        'Adjusting the kernel size of all convolution operations',
      ],
      correctIndex: 1,
      explanation:
        'Different GPU implementations of the same operation (e.g., cuDNN convolution algorithms) perform differently depending on tensor shapes, data types, and hardware. Auto-tuning benchmarks all variants and selects the fastest per-operation configuration for the specific model and hardware.',
      difficulty: 'medium',
    },
  ],
};
