import type { ChapterSection, GlossaryTerm } from '~/types/chapter';

export const sections: ChapterSection[] = [
  {
    id: 'ch14-s1',
    heading: 'Deploying ML on Microcontrollers',
    body: 'Deploying ML on microcontrollers (MCUs) represents the extreme end of resource-constrained inference. MCUs typically have tens to hundreds of kilobytes of SRAM, megabytes of flash storage, and operate at clock speeds of tens to hundreds of megahertz. Yet despite these severe constraints, on-device ML enables always-on sensing applications that are impossible with cloud-based approaches.\n\nThe primary framework for MCU deployment is TensorFlow Lite Micro (TFLite Micro), which provides a stripped-down inference engine designed for bare-metal environments. TFLite Micro uses a static memory allocation scheme, operates without an operating system, and supports a subset of TensorFlow operations optimized for MCU architectures. Other options include microTVM, which brings compiler-based optimization to MCU targets.\n\nMemory management is the primary challenge for MCU deployment. The model weights must fit in flash memory, while the intermediate activations during inference must fit in SRAM. The "arena" memory allocation strategy used by TFLite Micro pre-allocates a fixed buffer for all intermediate tensors, avoiding dynamic allocation and heap fragmentation.\n\nPower consumption is a critical constraint for battery-powered MCU applications. Always-on keyword detection models, for example, must consume microwatts to enable months or years of battery life. Techniques like duty cycling (alternating between sleep and wake states), event-driven inference (triggering computation only when interesting input is detected), and hardware-level power gating help meet these extreme power budgets.',
    order: 0,
    keyConcepts: [
      { term: 'Microcontroller (MCU)', definition: 'A small, resource-constrained processor with integrated memory (typically KB of SRAM) used in embedded and IoT devices.' },
      { term: 'TFLite Micro', definition: 'A lightweight inference framework for running TensorFlow models on microcontrollers, designed for bare-metal environments without operating system support.' },
    ],
  },
  {
    id: 'ch14-s2',
    heading: 'Edge Deployment Strategies',
    body: 'Edge deployment places ML inference on devices closer to the data source, ranging from powerful edge servers to smartphones to IoT sensors. The primary motivations are latency reduction (eliminating round-trip to the cloud), privacy preservation (keeping data on-device), bandwidth savings (avoiding continuous data upload), and reliability (operating without network connectivity).\n\nModel conversion and optimization are essential steps in the edge deployment pipeline. Models trained in frameworks like PyTorch or TensorFlow must be converted to edge-optimized formats. TFLite for mobile devices, Core ML for Apple platforms, ONNX Runtime for cross-platform deployment, and TensorRT for NVIDIA edge devices each provide optimized inference runtimes.\n\nSplit inference distributes model computation between edge devices and the cloud, placing early layers on-device and later layers in the cloud. This approach can reduce latency and bandwidth while keeping the most computationally intensive portions on powerful cloud hardware. The split point is chosen to minimize the data transmitted between device and cloud.\n\nEdge deployment introduces unique operational challenges. Model updates must be distributed to potentially millions of devices across diverse hardware and software versions. A/B testing requires coordination across the device fleet. Monitoring and debugging are harder without direct access to devices. Robust deployment infrastructure must handle all these challenges reliably.',
    order: 1,
    keyConcepts: [
      { term: 'Edge Deployment', definition: 'Running ML inference on devices close to the data source, such as smartphones or IoT devices, rather than in centralized cloud servers.' },
      { term: 'Split Inference', definition: 'A deployment strategy that divides model computation between edge devices and cloud servers, balancing latency, bandwidth, and computational requirements.' },
    ],
  },
  {
    id: 'ch14-s3',
    heading: 'On-Device Inference Optimization',
    body: 'On-device inference optimization encompasses all techniques for making ML models run efficiently on resource-constrained devices. The goal is to meet latency, memory, and power requirements while maintaining acceptable model quality. This often requires a combination of model-level and system-level optimizations.\n\nQuantization is the single most impactful optimization for on-device inference. Converting models from FP32 to INT8 typically yields 4x reduction in model size, 2-4x speedup, and significant energy savings. Many edge processors include dedicated INT8 compute units that further accelerate quantized inference. INT4 and even binary quantization push these benefits further at the cost of accuracy.\n\nModel architecture choice is equally important. Architectures designed for efficiency, such as MobileNet, EfficientNet-Lite, and SqueezeNet, achieve better accuracy per FLOP than larger architectures compressed to the same size. Choosing an efficient base architecture and then applying quantization and pruning yields better results than starting with a large model.\n\nRuntime optimizations include operator fusion, memory planning (reusing buffers across non-overlapping operations), and hardware-specific kernel selection. Inference runtimes like TFLite, ONNX Runtime, and Core ML implement these optimizations automatically during model conversion, but understanding the underlying principles helps practitioners diagnose performance issues.',
    order: 2,
    keyConcepts: [
      { term: 'On-Device Inference', definition: 'Running ML model predictions directly on the end-user device without cloud connectivity, enabling low latency and data privacy.' },
      { term: 'Memory Planning', definition: 'An optimization that reuses memory buffers across non-overlapping tensor operations during inference, reducing peak memory consumption.' },
    ],
  },
  {
    id: 'ch14-s4',
    heading: 'On-Device Learning and Adaptation',
    body: 'On-device learning goes beyond inference to enable models to adapt and improve directly on the device using local data. This is particularly valuable for personalization, where the model adapts to individual user patterns, and for privacy-sensitive applications where training data should never leave the device.\n\nFederated learning enables distributed model improvement without centralizing data. Each device trains a local model update on its private data and sends only the model update (not the raw data) to a central server. The server aggregates updates from many devices to improve the global model. Google deploys federated learning for keyboard prediction on Android devices.\n\nOn-device fine-tuning is a simpler alternative where a pre-trained model is adapted to local conditions using on-device data. This can be as simple as updating the final classification layer or as complex as full fine-tuning with local data. The key challenge is performing gradient computation and weight updates within the device\'s memory and compute constraints.\n\nContinuous adaptation raises concerns about model stability and catastrophic forgetting. Without careful regularization, a model adapted to recent local data may lose its ability to handle less frequent inputs. Techniques like elastic weight consolidation and replay buffers help maintain a balance between adaptation to new data and retention of general knowledge.',
    order: 3,
    keyConcepts: [
      { term: 'Federated Learning', definition: 'A distributed ML approach where devices collaboratively train a model by sharing only model updates, never raw data, preserving user privacy.' },
      { term: 'Catastrophic Forgetting', definition: 'The tendency of neural networks to lose previously learned knowledge when adapted to new data, a key challenge for on-device continuous learning.' },
    ],
  },
  {
    id: 'ch14-s5',
    heading: 'Extreme Optimization for MCUs',
    body: 'Extreme optimization pushes the boundaries of what is possible on the most resource-constrained devices. When working with only 256 KB of memory and a few MHz of compute, every byte and every cycle counts. This requires rethinking standard ML practices from first principles.\n\nBinary and ternary neural networks represent weights and activations with just 1 or 2 bits, replacing multiplication with simple bitwise operations. While these extreme quantization approaches sacrifice significant accuracy, they enable ML on devices that could not otherwise support any neural network computation.\n\nModel-hardware co-design for MCUs involves selecting architectures that match the specific capabilities of the target hardware. ARM Cortex-M processors have SIMD instructions (CMSIS-NN) optimized for certain tensor shapes. Designing models to use these shapes natively can yield significant speedups compared to generic architectures.\n\nKnowledge distillation takes on heightened importance for MCU deployment. A large teacher model can be trained in the cloud and then distilled into an extremely compact student model designed specifically for the target MCU. This two-stage approach often produces better results than directly training a small model, because the teacher can learn from larger datasets and more complex features than the student could access directly.',
    order: 4,
    keyConcepts: [
      { term: 'Binary Neural Network', definition: 'A neural network where weights and/or activations are constrained to binary values (+1/-1), replacing multiplications with bitwise operations for extreme efficiency.' },
      { term: 'CMSIS-NN', definition: 'ARM\'s optimized neural network kernels for Cortex-M processors, providing efficient implementations of common ML operations for microcontrollers.' },
    ],
  },
];

export const glossary: GlossaryTerm[] = [
  { term: 'MCU', definition: 'Microcontroller Unit, a compact integrated circuit with processor, memory, and peripherals used in embedded systems.' },
  { term: 'TFLite Micro', definition: 'TensorFlow Lite for Microcontrollers, a lightweight inference engine for running ML on bare-metal embedded devices.' },
  { term: 'Edge Deployment', definition: 'Deploying ML models on devices close to the data source rather than in centralized cloud infrastructure.' },
  { term: 'Federated Learning', definition: 'Distributed ML training that keeps data on-device, sharing only model updates to preserve privacy.' },
  { term: 'On-Device Learning', definition: 'Adapting ML models directly on end-user devices using local data, enabling personalization without data upload.' },
  { term: 'Duty Cycling', definition: 'Alternating between active and sleep states to reduce average power consumption for always-on ML applications.' },
  { term: 'Split Inference', definition: 'Dividing model computation between edge and cloud to balance latency, bandwidth, and computational cost.' },
];

export const keyTakeaways: string[] = [
  'MCU deployment requires extreme optimization, with models fitting in kilobytes of SRAM and flash storage.',
  'Edge deployment provides benefits in latency, privacy, and reliability, but introduces challenges in fleet management and monitoring.',
  'Quantization to INT8 is the single most impactful optimization for on-device inference, providing 4x size reduction.',
  'Federated learning enables distributed model improvement while keeping user data private on each device.',
  'Model-hardware co-design produces better results than generic optimization by matching architecture to specific hardware capabilities.',
];
