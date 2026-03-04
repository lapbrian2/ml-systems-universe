import type { ChapterSection, GlossaryTerm } from '~/types/chapter';

export const sections: ChapterSection[] = [
  {
    id: 'ch11-s1',
    heading: 'GPU Architecture for ML',
    body: 'Graphics Processing Units (GPUs) have become the dominant hardware platform for ML training and inference due to their massive parallelism. Unlike CPUs that have a few powerful cores optimized for sequential tasks, GPUs contain thousands of simpler cores designed to execute the same operation across many data elements simultaneously.\n\nNVIDIA GPUs organize computation into Streaming Multiprocessors (SMs), each containing multiple CUDA cores, tensor cores, and shared memory. Tensor cores are specialized matrix multiplication units that can compute a 4x4 matrix multiply-accumulate in a single cycle, providing enormous throughput for the dense linear algebra operations that dominate deep learning.\n\nThe GPU memory hierarchy is critical for ML performance. Global memory (HBM) provides large capacity but limited bandwidth. Shared memory and L1 cache provide much higher bandwidth but limited capacity. Efficient ML kernels must carefully manage data movement between these levels to avoid becoming memory-bandwidth-bound.\n\nNVIDIA\'s GPU architecture has evolved rapidly to meet ML demands. The A100 (Ampere) introduced third-generation tensor cores with support for sparsity and BF16. The H100 (Hopper) added the Transformer Engine with FP8 support and improved interconnect bandwidth. Each generation roughly doubles ML performance, maintaining a pace that has far outstripped Moore\'s Law for general-purpose computing.',
    order: 0,
    keyConcepts: [
      { term: 'GPU', definition: 'A massively parallel processor with thousands of cores optimized for executing the same operation across many data elements simultaneously.' },
      { term: 'Tensor Core', definition: 'Specialized hardware units in NVIDIA GPUs that perform matrix multiply-accumulate operations at extremely high throughput for ML workloads.' },
    ],
  },
  {
    id: 'ch11-s2',
    heading: 'TPUs and Custom ML Accelerators',
    body: 'Google\'s Tensor Processing Units (TPUs) are application-specific integrated circuits (ASICs) designed specifically for ML workloads. TPUs feature large systolic arrays optimized for matrix multiplication, high-bandwidth memory, and custom interconnects for distributed training. TPU v4 pods can deliver over an exaFLOP of compute for ML training.\n\nTPUs trade general-purpose flexibility for ML-specific performance. The systolic array architecture pipelines matrix operations through a grid of multiply-accumulate units, achieving near-peak utilization for the regular computation patterns found in neural networks. This specialization allows TPUs to achieve higher performance-per-watt than GPUs for supported operations.\n\nBeyond Google\'s TPUs, numerous companies are developing custom ML accelerators. AWS Trainium and Inferentia, Intel Habana Gaudi, Graphcore IPUs, and Cerebras WSE each take different approaches to optimizing ML computation. These accelerators offer various trade-offs in programmability, performance, and cost.\n\nThe diversity of ML accelerators creates challenges for software portability. Code written for NVIDIA GPUs does not automatically run on TPUs or other accelerators. Frameworks and compilers (JAX/XLA, ONNX Runtime) provide abstraction layers that enable writing hardware-portable ML code, though achieving peak performance on each platform often still requires hardware-specific tuning.',
    order: 1,
    keyConcepts: [
      { term: 'TPU', definition: 'Google\'s Tensor Processing Unit, a custom ASIC designed specifically for ML workloads with systolic arrays optimized for matrix operations.' },
      { term: 'Systolic Array', definition: 'A grid of processing elements that pipelines data through regular computation patterns, achieving high utilization for matrix multiplication.' },
    ],
  },
  {
    id: 'ch11-s3',
    heading: 'FPGAs and Edge Accelerators',
    body: 'Field-Programmable Gate Arrays (FPGAs) offer a middle ground between the flexibility of CPUs and the efficiency of ASICs. FPGAs can be reconfigured to implement custom hardware architectures, making them suitable for ML workloads that require specialized processing or very low latency that software-programmable devices cannot achieve.\n\nFPGAs excel in scenarios requiring extremely low latency, deterministic timing, and custom precision. Financial trading ML models, real-time video processing, and certain edge deployment scenarios benefit from FPGA implementation. However, FPGAs are significantly harder to program than GPUs, requiring hardware description languages like VHDL or Verilog, or high-level synthesis (HLS) tools.\n\nEdge ML accelerators are designed specifically for inference on resource-constrained devices. Google\'s Coral Edge TPU, NVIDIA Jetson, Intel Neural Compute Stick, and ARM\'s Ethos NPU provide dedicated ML acceleration in mobile and IoT form factors. These devices typically support INT8 inference and consume just a few watts of power.\n\nThe hardware landscape for ML is diversifying rapidly. Neuromorphic chips like Intel Loihi process information using spike-based computation inspired by biological neurons. Photonic accelerators use light instead of electrons for matrix operations. In-memory computing architectures perform computation within memory arrays to avoid the data movement bottleneck. While most of these are still early-stage, they represent potential paradigm shifts in ML hardware.',
    order: 2,
    keyConcepts: [
      { term: 'FPGA', definition: 'Field-Programmable Gate Array, a reconfigurable integrated circuit that can implement custom hardware architectures for specialized ML workloads.' },
      { term: 'Edge Accelerator', definition: 'A low-power specialized processor designed for running ML inference on resource-constrained edge devices like smartphones and IoT sensors.' },
    ],
  },
  {
    id: 'ch11-s4',
    heading: 'Hardware-Aware Optimization',
    body: 'Hardware-aware optimization tailors model architecture and computation to exploit the specific capabilities of the target hardware platform. Rather than designing models in a hardware-agnostic manner and hoping for good performance, hardware-aware approaches directly incorporate hardware characteristics into the design process.\n\nHardware-aware NAS includes hardware metrics like latency, energy, and memory usage in the search objective function. Instead of optimizing only for accuracy, the search finds architectures that achieve the best accuracy within a given hardware budget. This approach has produced models like EfficientNet and MnasNet that are Pareto-optimal for specific hardware targets.\n\nKernel auto-tuning optimizes the low-level implementation of individual operations for the target hardware. Tools like TVM\'s AutoTVM and Ansor search over implementation strategies (tile sizes, loop ordering, vectorization) to find the fastest configuration for each operation on each device. This can yield significant speedups over hand-written or default kernel implementations.\n\nThe concept of hardware-software co-design takes optimization further by jointly designing the model architecture, the compilation strategy, and even the hardware itself. This holistic approach recognizes that the best system emerges from optimizing all components together rather than sequentially. Co-design is increasingly practiced at companies that control both the hardware and software stack.',
    order: 3,
    keyConcepts: [
      { term: 'Hardware-Aware Optimization', definition: 'The practice of incorporating target hardware characteristics into model and system design to achieve optimal performance on specific platforms.' },
      { term: 'Kernel Auto-Tuning', definition: 'Automated search for optimal low-level implementation parameters (tile sizes, loop ordering) for each operation on each target hardware platform.' },
    ],
  },
  {
    id: 'ch11-s5',
    heading: 'Accelerator Design and Co-Design',
    body: 'ML accelerator design is driven by the observation that neural network workloads have predictable, regular computation patterns dominated by matrix multiplication and convolution. By specializing hardware for these operations, accelerators achieve orders-of-magnitude better performance-per-watt than general-purpose processors.\n\nKey design decisions for ML accelerators include the compute architecture (systolic array, dataflow, SIMD), the memory hierarchy (on-chip SRAM size, memory bandwidth), the interconnect topology (for multi-chip systems), and the supported data formats (FP32, FP16, BF16, INT8, FP8). Each choice has implications for what models can be efficiently executed.\n\nThe memory wall is the fundamental bottleneck for ML accelerators. As compute throughput increases faster than memory bandwidth, an increasing fraction of operations become memory-bound. This has driven the adoption of high-bandwidth memory (HBM), larger on-chip SRAM caches, and processing-in-memory architectures that bring computation closer to data.\n\nSoftware support is as important as hardware capability for accelerator success. An accelerator with outstanding hardware specifications will fail in the market if it lacks compiler support, framework integration, and developer tooling. The NVIDIA ecosystem advantage (CUDA, cuDNN, TensorRT, NGC containers) demonstrates the importance of software maturity in hardware adoption.',
    order: 4,
    keyConcepts: [
      { term: 'Memory Wall', definition: 'The growing gap between processor compute throughput and memory bandwidth that increasingly limits ML system performance.' },
      { term: 'Hardware-Software Co-Design', definition: 'The practice of jointly optimizing hardware architecture, compiler strategy, and model design to achieve optimal system-level performance.' },
    ],
  },
];

export const glossary: GlossaryTerm[] = [
  { term: 'GPU', definition: 'Graphics Processing Unit, a massively parallel processor that has become the dominant platform for ML training and inference.' },
  { term: 'TPU', definition: 'Tensor Processing Unit, Google\'s custom ML accelerator featuring systolic arrays for matrix computation.' },
  { term: 'FPGA', definition: 'Field-Programmable Gate Array, a reconfigurable chip that can implement custom hardware designs for specialized ML workloads.' },
  { term: 'Tensor Core', definition: 'Specialized matrix multiplication units in NVIDIA GPUs that provide extremely high throughput for ML operations.' },
  { term: 'HBM', definition: 'High Bandwidth Memory, a type of memory technology that provides significantly higher bandwidth than standard DRAM, essential for ML accelerators.' },
  { term: 'CUDA', definition: 'NVIDIA\'s parallel computing platform and programming model for GPU computing.' },
  { term: 'Systolic Array', definition: 'A processor architecture that pipelines data through a regular grid of processing elements, optimized for matrix operations.' },
];

export const keyTakeaways: string[] = [
  'GPUs dominate ML compute due to massive parallelism and mature software ecosystem (CUDA, cuDNN, TensorRT).',
  'TPUs and custom accelerators achieve higher efficiency by specializing hardware for ML-specific operations like matrix multiplication.',
  'The memory wall is the fundamental bottleneck: compute grows faster than memory bandwidth, making many operations memory-bound.',
  'Hardware-aware optimization tailors models to specific hardware, often yielding better accuracy-efficiency trade-offs than hardware-agnostic design.',
  'Software ecosystem maturity is as important as raw hardware performance for accelerator adoption and practical utility.',
];
