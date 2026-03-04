import type { ChapterQuiz } from '@/types/quiz';

export const ch14Quiz: ChapterQuiz = {
  chapterId: 'ch14',
  title: 'On-Device Learning Quiz',
  description: 'Test your understanding of edge deployment, TFLite, on-device inference, and resource-constrained ML.',
  passingScore: 70,
  selectCount: 5,
  pool: [
    {
      id: 'ch14-q1',
      question: 'What is edge deployment in the context of ML?',
      options: [
        'Deploying models on the latest cutting-edge hardware',
        'Running ML inference directly on end-user devices (phones, MCUs, sensors) rather than sending data to the cloud',
        'Deploying models at the edge of a data center',
        'Using edge detection algorithms for computer vision',
      ],
      correctIndex: 1,
      explanation:
        'Edge deployment moves inference to the device where data is generated — smartphones, IoT sensors, microcontrollers. This reduces latency, preserves privacy (data stays on-device), works offline, and reduces bandwidth and cloud costs.',
      difficulty: 'easy',
    },
    {
      id: 'ch14-q2',
      question: 'What is TensorFlow Lite Micro (TFLite Micro)?',
      options: [
        'A smaller version of TensorFlow for laptops',
        'A lightweight inference engine designed to run neural networks on microcontrollers with kilobytes of memory and no OS',
        'A micro-service architecture for TensorFlow',
        'A dataset of microscopic images for ML training',
      ],
      correctIndex: 1,
      explanation:
        'TFLite Micro is designed for bare-metal microcontrollers with as little as 16KB of RAM. It has no dynamic memory allocation, no OS dependencies, and supports only a subset of operators — specifically optimized for the extreme constraints of TinyML devices.',
      difficulty: 'medium',
    },
    {
      id: 'ch14-q3',
      question: 'What are the main constraints when deploying ML on microcontrollers?',
      options: [
        'There are no significant constraints; MCUs are powerful enough for any model',
        'Extremely limited memory (KB), limited compute (MHz), restricted power budget, and no floating-point unit on some chips',
        'Microcontrollers can only run image classification models',
        'The only constraint is network connectivity',
      ],
      correctIndex: 1,
      explanation:
        'Microcontrollers typically have 16-512KB RAM, clock speeds of 1-400 MHz, milliwatt power budgets, and often lack floating-point hardware. Models must be aggressively quantized (INT8 or below), pruned, and architecturally designed for these extreme constraints.',
      difficulty: 'easy',
    },
    {
      id: 'ch14-q4',
      question: 'What is on-device training (as opposed to on-device inference)?',
      options: [
        'Training a model on a server and deploying it to a device',
        'Performing model parameter updates directly on the edge device, allowing the model to adapt to local data without cloud connectivity',
        'Using device data to train models in the cloud',
        'Pre-loading training data onto a device',
      ],
      correctIndex: 1,
      explanation:
        'On-device training updates model weights on the edge device itself using local data. This enables personalization (adapting to individual user patterns), privacy preservation, and operation in disconnected environments, though with significant compute and memory challenges.',
      difficulty: 'medium',
    },
    {
      id: 'ch14-q5',
      question: 'What is the ONNX Runtime and why is it used for edge deployment?',
      options: [
        'A training framework for building models from scratch',
        'A cross-platform inference engine that runs ONNX models efficiently on various hardware including edge devices',
        'A runtime for online neural network experiments',
        'A cloud-only model serving platform',
      ],
      correctIndex: 1,
      explanation:
        'ONNX Runtime provides a unified inference engine that optimizes and runs ONNX-format models across CPUs, GPUs, and specialized accelerators. Its hardware-specific execution providers (like NNAPI, CoreML) make it effective for diverse edge deployment targets.',
      difficulty: 'medium',
    },
    {
      id: 'ch14-q6',
      question: 'Why is INT8 quantization particularly important for edge ML?',
      options: [
        'INT8 is more accurate than FP32',
        'INT8 reduces model size by 4x vs FP32, enables integer-only arithmetic (faster on MCUs), and dramatically reduces memory bandwidth requirements',
        'INT8 is only used for image models',
        'INT8 quantization does not affect model performance',
      ],
      correctIndex: 1,
      explanation:
        'Edge devices often lack floating-point units or have slow FP operations. INT8 quantization provides 4x size reduction over FP32, enables fast integer arithmetic on all hardware (including MCUs without FPU), and reduces memory traffic — all critical for constrained devices.',
      difficulty: 'medium',
    },
    {
      id: 'ch14-q7',
      question: 'What is the benefit of model containerization (e.g., Docker) for ML deployment?',
      options: [
        'It makes models smaller',
        'It packages the model with its runtime dependencies into a portable, reproducible unit that runs consistently across environments',
        'It encrypts the model for security',
        'It eliminates the need for model optimization',
      ],
      correctIndex: 1,
      explanation:
        'Containers encapsulate the model, inference runtime, libraries, and system dependencies into a self-contained package. This ensures consistent behavior across development, testing, and production environments, and simplifies scaling and orchestration.',
      difficulty: 'easy',
    },
    {
      id: 'ch14-q8',
      question: 'What is model partitioning for edge-cloud inference?',
      options: [
        'Splitting the training dataset between edge and cloud',
        'Executing initial layers on the edge device and sending intermediate representations to the cloud for the remaining computation',
        'Running the same model on both edge and cloud independently',
        'Storing part of the model on edge and the rest in cloud storage',
      ],
      correctIndex: 1,
      explanation:
        'Model partitioning splits inference between edge and cloud: early layers run locally (reducing bandwidth by sending compact features instead of raw data), while computationally heavy later layers run in the cloud. This balances latency, privacy, and compute requirements.',
      difficulty: 'hard',
    },
    {
      id: 'ch14-q9',
      question: 'What is a key challenge of deploying ML models to heterogeneous edge devices?',
      options: [
        'All edge devices have identical hardware, so there is no challenge',
        'Different devices have different hardware capabilities, instruction sets, and memory constraints, requiring device-specific optimization and testing',
        'Edge devices can only run one type of model',
        'Edge devices do not support any ML frameworks',
      ],
      correctIndex: 1,
      explanation:
        'The edge ecosystem is fragmented: ARM vs. RISC-V, different NPU architectures, varying memory sizes, different OS versions. Models often need device-specific quantization profiles, operator support checks, and performance tuning for each target platform.',
      difficulty: 'hard',
    },
    {
      id: 'ch14-q10',
      question: 'What advantage does edge inference provide for privacy-sensitive applications?',
      options: [
        'Edge devices have built-in encryption that cloud servers lack',
        'Data never leaves the device, eliminating network transmission risks and cloud storage exposure',
        'Edge inference is always more accurate for private data',
        'Edge devices cannot be hacked',
      ],
      correctIndex: 1,
      explanation:
        'By running inference on-device, raw user data (voice, images, health data) stays local and never traverses a network or is stored on third-party servers. This is crucial for compliance with privacy regulations like GDPR and for building user trust.',
      difficulty: 'hard',
    },
  ],
};
