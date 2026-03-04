import type { ChapterSection, GlossaryTerm } from '~/types/chapter';

export const sections: ChapterSection[] = [
  {
    id: 'ch14-s1',
    heading: 'Deploying ML on Microcontrollers',
    body: 'Deploying ML on microcontrollers (MCUs) represents the extreme end of resource-constrained inference. MCUs typically have tens to hundreds of kilobytes of SRAM, megabytes of flash storage, and operate at clock speeds of tens to hundreds of megahertz. Yet despite these severe constraints, on-device ML enables always-on sensing applications that are impossible with cloud-based approaches.\n\nThe primary framework for MCU deployment is TensorFlow Lite Micro (TFLite Micro), which provides a stripped-down inference engine designed for bare-metal environments. TFLite Micro uses a static memory allocation scheme, operates without an operating system, and supports a subset of TensorFlow operations optimized for MCU architectures. Other options include microTVM, which brings compiler-based optimization to MCU targets.\n\nMemory management is the primary challenge for MCU deployment. The model weights must fit in flash memory, while the intermediate activations during inference must fit in SRAM. The "arena" memory allocation strategy used by TFLite Micro pre-allocates a fixed buffer for all intermediate tensors, avoiding dynamic allocation and heap fragmentation.\n\nPower consumption is a critical constraint for battery-powered MCU applications. Always-on keyword detection models, for example, must consume microwatts to enable months or years of battery life. Techniques like duty cycling (alternating between sleep and wake states), event-driven inference (triggering computation only when interesting input is detected), and hardware-level power gating help meet these extreme power budgets.',
    blocks: [
      {
        type: 'paragraph',
        text: 'Deploying ML on microcontrollers (MCUs) represents the extreme end of resource-constrained inference. MCUs typically have tens to hundreds of kilobytes of SRAM, megabytes of flash storage, and operate at clock speeds of tens to hundreds of megahertz. Yet despite these severe constraints, on-device ML enables always-on sensing applications that are impossible with cloud-based approaches.',
      },
      {
        type: 'definition',
        term: 'Microcontroller (MCU)',
        definition: 'A compact integrated circuit containing a processor, memory (typically KB of SRAM and MB of flash), and I/O peripherals on a single chip. MCUs power billions of embedded and IoT devices, and are increasingly capable of running lightweight ML inference.',
      },
      {
        type: 'table',
        headers: ['Resource', 'Typical MCU', 'Smartphone', 'Cloud GPU'],
        rows: [
          ['RAM', '64-512 KB SRAM', '4-12 GB', '16-80 GB HBM'],
          ['Storage', '1-4 MB Flash', '64-256 GB', 'TB-scale SSD'],
          ['Clock Speed', '48-400 MHz', '2-3 GHz', '1.5-2 GHz + 10K cores'],
          ['Power Budget', '1-100 mW', '3-5 W', '200-700 W'],
          ['Model Size Limit', '10s-100s KB', '10s-100s MB', 'Billions of parameters'],
        ],
        caption: 'Table 14.1: Resource constraints across deployment targets.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Inference Frameworks for MCUs',
      },
      {
        type: 'paragraph',
        text: 'The primary framework for MCU deployment is TensorFlow Lite Micro (TFLite Micro), which provides a stripped-down inference engine designed for bare-metal environments. TFLite Micro uses a static memory allocation scheme, operates without an operating system, and supports a subset of TensorFlow operations optimized for MCU architectures.',
      },
      {
        type: 'callout',
        variant: 'note',
        title: 'TFLite Micro Design Principles',
        text: 'TFLite Micro is designed for bare-metal execution: no dynamic memory allocation, no operating system required, no file system access, and no standard C library dependency. It uses a pre-allocated "arena" buffer for all intermediate tensors, avoiding heap fragmentation that would be catastrophic in KB-scale memory environments.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Memory Management Challenges',
      },
      {
        type: 'paragraph',
        text: 'Memory management is the primary challenge for MCU deployment. The model weights must fit in flash memory, while the intermediate activations during inference must fit in SRAM. The arena memory allocation strategy pre-allocates a fixed buffer for all intermediate tensors, avoiding dynamic allocation and heap fragmentation.',
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'Fitting Models in Flash and SRAM',
        text: 'Model weights are read-only and can reside in flash memory (larger, cheaper, non-volatile). Activations must be in SRAM (smaller, faster, volatile). When optimizing for MCU deployment, focus on reducing peak activation memory (the largest intermediate tensor) as this determines the minimum SRAM requirement. Tools like TFLite Micro\'s memory planner report peak arena usage.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Power Management',
      },
      {
        type: 'paragraph',
        text: 'Power consumption is a critical constraint for battery-powered MCU applications. Always-on keyword detection models must consume microwatts to enable months or years of battery life.',
      },
      {
        type: 'list',
        ordered: false,
        items: [
          'Duty cycling — Alternate between deep sleep and wake states to reduce average power.',
          'Event-driven inference — Only run the ML model when a simple threshold detector indicates interesting input.',
          'Hardware power gating — Shut down unused peripherals and memory banks during inference.',
          'Cascaded models — Use a tiny always-on model as a trigger for a larger, more accurate model.',
        ],
      },
      {
        type: 'callout',
        variant: 'example',
        title: 'Always-On Keyword Detection',
        text: 'A smart speaker uses a 14 KB neural network running on a Cortex-M4 MCU for "wake word" detection. The MCU consumes 1 mW in always-on listening mode. When the wake word is detected, the system powers on the main application processor (consuming 2 W) for full speech recognition. This cascaded approach enables months of battery life while maintaining responsiveness.',
      },
    ],
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
    blocks: [
      {
        type: 'paragraph',
        text: 'Edge deployment places ML inference on devices closer to the data source, ranging from powerful edge servers to smartphones to IoT sensors. The primary motivations are latency reduction, privacy preservation, bandwidth savings, and reliability.',
      },
      {
        type: 'definition',
        term: 'Edge Deployment',
        definition: 'Running ML inference on devices close to the data source rather than in centralized cloud servers. Edge deployment reduces latency, preserves privacy by keeping data on-device, saves network bandwidth, and enables operation without connectivity.',
      },
      {
        type: 'list',
        ordered: false,
        items: [
          'Latency reduction — Eliminate the network round-trip to the cloud, achieving sub-millisecond inference.',
          'Privacy preservation — Sensitive data (face images, health signals) never leaves the device.',
          'Bandwidth savings — Process raw sensor data locally, transmitting only results or anomalies.',
          'Reliability — Operate continuously even without network connectivity.',
        ],
      },
      {
        type: 'heading',
        level: 3,
        text: 'Model Conversion and Optimization',
      },
      {
        type: 'paragraph',
        text: 'Models trained in frameworks like PyTorch or TensorFlow must be converted to edge-optimized formats. Each target platform has its own optimized inference runtime.',
      },
      {
        type: 'table',
        headers: ['Runtime', 'Target Platform', 'Input Format', 'Key Optimizations'],
        rows: [
          ['TFLite', 'Android, embedded Linux', 'TensorFlow SavedModel', 'Quantization, delegate support (GPU, NNAPI)'],
          ['Core ML', 'iOS, macOS, Apple Silicon', 'PyTorch, TensorFlow, ONNX', 'Neural Engine acceleration, FP16 conversion'],
          ['ONNX Runtime', 'Cross-platform', 'ONNX', 'Graph optimization, EP-based acceleration'],
          ['TensorRT', 'NVIDIA edge GPUs (Jetson)', 'ONNX, TensorFlow', 'Layer fusion, FP16/INT8, kernel auto-tuning'],
          ['microTVM', 'MCUs, RISC-V', 'Relay IR', 'Compiler-based kernel optimization, auto-scheduling'],
        ],
        caption: 'Table 14.2: Edge inference runtimes and their target platforms.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Split Inference',
      },
      {
        type: 'paragraph',
        text: 'Split inference distributes model computation between edge devices and the cloud, placing early layers on-device and later layers in the cloud. The split point is chosen to minimize the data transmitted between device and cloud.',
      },
      {
        type: 'callout',
        variant: 'note',
        title: 'Choosing the Split Point',
        text: 'The optimal split point minimizes the size of the intermediate tensor transmitted from device to cloud. Early convolutional layers often reduce spatial dimensions significantly, making the output of the third or fourth layer much smaller than the raw input image. Split at the layer that produces the smallest intermediate representation.',
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'When Split Inference Makes Sense',
        text: 'Split inference is most valuable when: (1) the device can handle early feature extraction but not the full model, (2) network bandwidth is limited but latency requirements are not extreme, and (3) intermediate representations are much smaller than raw inputs. It is less useful when strict privacy requires all data to stay on-device.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Operational Challenges at Fleet Scale',
      },
      {
        type: 'paragraph',
        text: 'Edge deployment introduces unique operational challenges. Model updates must be distributed to potentially millions of devices across diverse hardware and software versions. Monitoring and debugging are harder without direct access to devices.',
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Fleet Heterogeneity',
        text: 'Unlike cloud deployment where you control the hardware, edge fleets span multiple device models, OS versions, and hardware capabilities. A model that works perfectly on a flagship phone may crash on a budget device with less memory. Always test on the lowest-capability device in your fleet, and implement runtime capability checks that fall back gracefully.',
      },
      {
        type: 'callout',
        variant: 'example',
        title: 'Edge Model Update Strategy',
        text: 'A mobile keyboard app deploys a next-word prediction model to 500 million devices. Updates use a staged rollout: 0.1% canary for 24 hours, 1% for 48 hours, 10% for a week, then full rollout. Each stage monitors crash rates, latency P99, and prediction quality. If any metric degrades beyond threshold, the rollout automatically halts and devices revert to the previous model version.',
      },
    ],
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
    blocks: [
      {
        type: 'paragraph',
        text: 'On-device inference optimization encompasses all techniques for making ML models run efficiently on resource-constrained devices. The goal is to meet latency, memory, and power requirements while maintaining acceptable model quality. This often requires a combination of model-level and system-level optimizations.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Quantization: The Most Impactful Optimization',
      },
      {
        type: 'paragraph',
        text: 'Quantization is the single most impactful optimization for on-device inference. Converting models from FP32 to INT8 typically yields 4x reduction in model size, 2-4x speedup, and significant energy savings.',
      },
      {
        type: 'definition',
        term: 'Quantization',
        definition: 'The process of reducing the numerical precision of model weights and activations (e.g., from 32-bit floating point to 8-bit integer), resulting in smaller model size, faster inference, and lower energy consumption, typically with minimal accuracy loss.',
      },
      {
        type: 'equation',
        latex: 'x_q = \\text{round}\\left(\\frac{x}{s}\\right) + z',
        label: 'Equation 14.1: Uniform quantization formula, where x is the original value, s is the scale factor, z is the zero point, and x_q is the quantized integer value.',
      },
      {
        type: 'table',
        headers: ['Precision', 'Bits per Weight', 'Model Size Reduction', 'Typical Speedup', 'Accuracy Impact'],
        rows: [
          ['FP32 (baseline)', '32', '1x', '1x', 'None'],
          ['FP16', '16', '2x', '1.5-2x', 'Negligible'],
          ['INT8', '8', '4x', '2-4x', 'Small (<1% loss)'],
          ['INT4', '4', '8x', '3-6x', 'Moderate (1-3% loss)'],
          ['Binary (1-bit)', '1', '32x', '10-30x', 'Significant (5-15% loss)'],
        ],
        caption: 'Table 14.3: Quantization levels and their typical trade-offs.',
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'Post-Training vs. Quantization-Aware Training',
        text: 'Post-training quantization (PTQ) is faster and requires no retraining — just calibrate on a representative dataset. Quantization-aware training (QAT) simulates quantization during training and recovers most accuracy loss, but requires access to the training pipeline. Start with PTQ; use QAT only if the accuracy drop is unacceptable.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Efficient Model Architectures',
      },
      {
        type: 'paragraph',
        text: 'Model architecture choice is equally important. Architectures designed for efficiency achieve better accuracy per FLOP than larger architectures compressed to the same size.',
      },
      {
        type: 'list',
        ordered: false,
        items: [
          'MobileNetV3 — Depthwise separable convolutions with squeeze-and-excitation for mobile GPUs.',
          'EfficientNet-Lite — Compound-scaled architecture optimized for on-device inference.',
          'SqueezeNet — Fire modules that minimize parameters while maintaining accuracy.',
          'MobileViT — Lightweight vision transformer designed for mobile deployment.',
          'TinyBERT — Distilled BERT variant for on-device NLP tasks.',
        ],
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Start Small, Don\'t Shrink Large',
        text: 'A common mistake is training a large model (e.g., ResNet-152) and then compressing it for deployment. In practice, starting with an efficient architecture (e.g., MobileNetV3) and applying quantization yields better accuracy at the same latency budget than compressing a large model. Choose the right architecture first.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Runtime Optimizations',
      },
      {
        type: 'paragraph',
        text: 'Runtime optimizations include operator fusion, memory planning, and hardware-specific kernel selection. Inference runtimes implement these optimizations automatically during model conversion.',
      },
      {
        type: 'callout',
        variant: 'note',
        title: 'Operator Fusion',
        text: 'Operator fusion combines multiple sequential operations (e.g., convolution + batch normalization + ReLU) into a single kernel. This eliminates intermediate memory writes and reads, which is critical for memory-bound operations. Most inference runtimes apply common fusion patterns automatically, but custom fusion may be needed for non-standard architectures.',
      },
    ],
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
    blocks: [
      {
        type: 'paragraph',
        text: 'On-device learning goes beyond inference to enable models to adapt and improve directly on the device using local data. This is particularly valuable for personalization and for privacy-sensitive applications where training data should never leave the device.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Federated Learning',
      },
      {
        type: 'definition',
        term: 'Federated Learning',
        definition: 'A distributed machine learning approach where multiple devices collaboratively train a shared model by computing updates locally and sharing only model gradients or parameters — never raw data — with a central aggregation server.',
      },
      {
        type: 'paragraph',
        text: 'Federated learning enables distributed model improvement without centralizing data. Each device trains a local model update on its private data and sends only the model update to a central server. The server aggregates updates from many devices to improve the global model.',
      },
      {
        type: 'code',
        language: 'python',
        code: '# Simplified Federated Averaging (FedAvg) pseudocode\ndef federated_averaging(global_model, devices, rounds):\n    for r in range(rounds):\n        local_updates = []\n        # Select subset of devices for this round\n        selected = random.sample(devices, k=fraction * len(devices))\n        for device in selected:\n            local_model = copy(global_model)\n            # Train locally for E epochs on device data\n            for epoch in range(E):\n                local_model.train(device.data)\n            local_updates.append(local_model.weights - global_model.weights)\n        # Aggregate: weighted average of updates\n        avg_update = weighted_average(local_updates, weights=device_data_sizes)\n        global_model.weights += avg_update\n    return global_model',
        caption: 'Pseudocode for the Federated Averaging (FedAvg) algorithm.',
      },
      {
        type: 'callout',
        variant: 'example',
        title: 'Federated Learning at Google',
        text: 'Google\'s Gboard keyboard uses federated learning to improve next-word prediction for billions of users. Each phone trains on locally typed text, computes a model update, and uploads only the encrypted update. The server aggregates thousands of updates using secure aggregation. No individual user\'s typing data ever leaves their device.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'On-Device Fine-Tuning',
      },
      {
        type: 'paragraph',
        text: 'On-device fine-tuning is a simpler alternative where a pre-trained model is adapted to local conditions. The key challenge is performing gradient computation and weight updates within the device\'s memory and compute constraints.',
      },
      {
        type: 'table',
        headers: ['Approach', 'What Updates', 'Memory Cost', 'Personalization Quality'],
        rows: [
          ['Last-layer fine-tuning', 'Only the final classification layer', 'Very low', 'Moderate'],
          ['Adapter tuning', 'Small adapter modules inserted between frozen layers', 'Low', 'Good'],
          ['Full fine-tuning', 'All model parameters', 'High (need full gradient storage)', 'Best'],
          ['Prompt tuning', 'Learned input tokens (LLMs)', 'Very low', 'Good for NLP tasks'],
        ],
        caption: 'Table 14.4: On-device fine-tuning strategies and their trade-offs.',
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'Start with Last-Layer Fine-Tuning',
        text: 'For most on-device personalization use cases, updating only the final classification layer provides surprisingly good results at minimal computational cost. This approach requires storing gradients only for the last layer, making it feasible even on memory-constrained devices.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Catastrophic Forgetting',
      },
      {
        type: 'paragraph',
        text: 'Continuous adaptation raises concerns about model stability and catastrophic forgetting. Without careful regularization, a model adapted to recent local data may lose its ability to handle less frequent inputs.',
      },
      {
        type: 'definition',
        term: 'Catastrophic Forgetting',
        definition: 'The tendency of neural networks to abruptly lose previously learned knowledge when trained on new data. In on-device learning, this means a model personalized to recent user behavior may forget how to handle less frequent but important inputs.',
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Preventing Forgetting on Device',
        text: 'Elastic Weight Consolidation (EWC) penalizes changes to weights that were important for previous tasks. Replay buffers store a small subset of past examples for periodic review. On devices with limited memory, distillation-based approaches — where the personalized model is regularized to stay close to the original model\'s predictions — are often the most practical.',
      },
    ],
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
    blocks: [
      {
        type: 'paragraph',
        text: 'Extreme optimization pushes the boundaries of what is possible on the most resource-constrained devices. When working with only 256 KB of memory and a few MHz of compute, every byte and every cycle counts. This requires rethinking standard ML practices from first principles.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Binary and Ternary Neural Networks',
      },
      {
        type: 'definition',
        term: 'Binary Neural Network (BNN)',
        definition: 'A neural network where weights and/or activations are constrained to binary values (+1 and -1). Multiplications become XNOR operations and additions become popcount, enabling inference using only bitwise CPU instructions with dramatic reductions in model size and compute.',
      },
      {
        type: 'paragraph',
        text: 'Binary and ternary neural networks represent weights and activations with just 1 or 2 bits, replacing multiplication with simple bitwise operations. While these extreme quantization approaches sacrifice significant accuracy, they enable ML on devices that could not otherwise support any neural network computation.',
      },
      {
        type: 'equation',
        latex: 'y = \\text{popcount}(\\text{XNOR}(\\mathbf{w}_b, \\mathbf{x}_b))',
        label: 'Equation 14.2: Binary convolution replaces multiply-accumulate with XNOR followed by population count (popcount), reducing each multiply to a single bitwise operation.',
      },
      {
        type: 'callout',
        variant: 'note',
        title: 'When Binary Networks Make Sense',
        text: 'Binary neural networks sacrifice 10-15% accuracy on ImageNet compared to full-precision models, which is unacceptable for many applications. However, for simple classification tasks (wake word detection, gesture recognition, anomaly detection) where the alternative is no ML at all, binary networks enable intelligence on devices with only a few KB of memory.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Model-Hardware Co-Design',
      },
      {
        type: 'paragraph',
        text: 'Model-hardware co-design for MCUs involves selecting architectures that match the specific capabilities of the target hardware. ARM Cortex-M processors have SIMD instructions (CMSIS-NN) optimized for certain tensor shapes.',
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'Design for the Hardware',
        text: 'CMSIS-NN on ARM Cortex-M is optimized for specific tensor dimensions (multiples of 4 for INT8 SIMD). Design your model layers to use these native dimensions. A depthwise convolution with 32 filters runs significantly faster than one with 30 filters due to SIMD alignment. Profile on the actual target MCU — simulators can miss these effects.',
      },
      {
        type: 'table',
        headers: ['MCU Family', 'ML Acceleration', 'Typical SRAM', 'Key Optimization'],
        rows: [
          ['ARM Cortex-M4', 'CMSIS-NN (DSP instructions)', '128-256 KB', 'INT8 SIMD, depthwise separable convolutions'],
          ['ARM Cortex-M7', 'CMSIS-NN + double-precision FPU', '256-512 KB', 'FP16 support, larger models'],
          ['ARM Cortex-M55 (Ethos-U55)', 'Dedicated ML accelerator (NPU)', '256 KB-4 MB', 'NPU offload for supported operations'],
          ['ESP32-S3', 'Vector extensions', '512 KB', 'INT8 inference, audio/sensor models'],
        ],
        caption: 'Table 14.5: Popular MCU families and their ML capabilities.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Knowledge Distillation for MCUs',
      },
      {
        type: 'paragraph',
        text: 'Knowledge distillation takes on heightened importance for MCU deployment. A large teacher model trained in the cloud is distilled into an extremely compact student model designed specifically for the target MCU.',
      },
      {
        type: 'equation',
        latex: 'L_{distill} = \\alpha \\cdot L_{CE}(y, \\hat{y}_s) + (1 - \\alpha) \\cdot T^2 \\cdot KL(\\sigma(z_t / T) \\| \\sigma(z_s / T))',
        label: 'Equation 14.3: Knowledge distillation loss. The student learns from both the ground truth labels (cross-entropy) and the teacher\'s soft predictions (KL divergence), with temperature T controlling the softness.',
      },
      {
        type: 'callout',
        variant: 'example',
        title: 'Distillation for Keyword Spotting',
        text: 'A cloud-trained transformer model achieves 97% accuracy on a keyword spotting task. Direct training of a small CNN for the target MCU achieves only 89%. Using the transformer as a teacher and distilling into the same CNN architecture yields 94% accuracy — a 5 percentage point improvement from the richer training signal provided by the teacher\'s soft labels.',
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Verify on Real Hardware',
        text: 'Simulated latency and memory estimates can diverge significantly from real MCU performance. Cache effects, memory alignment, DMA transfer patterns, and interrupt handling all affect real-world performance. Always benchmark your final model on the actual target MCU before committing to a design.',
      },
    ],
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
