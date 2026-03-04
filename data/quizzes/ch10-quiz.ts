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
  ],
};
