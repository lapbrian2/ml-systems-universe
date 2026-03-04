import type { ChapterSection, GlossaryTerm } from '~/types/chapter';

export const sections: ChapterSection[] = [
  {
    id: 'ch11-s1',
    heading: 'GPU Architecture for ML',
    body: 'Graphics Processing Units (GPUs) have become the dominant hardware platform for ML training and inference due to their massive parallelism. Unlike CPUs that have a few powerful cores optimized for sequential tasks, GPUs contain thousands of simpler cores designed to execute the same operation across many data elements simultaneously.\n\nNVIDIA GPUs organize computation into Streaming Multiprocessors (SMs), each containing multiple CUDA cores, tensor cores, and shared memory. Tensor cores are specialized matrix multiplication units that can compute a 4x4 matrix multiply-accumulate in a single cycle, providing enormous throughput for the dense linear algebra operations that dominate deep learning.\n\nThe GPU memory hierarchy is critical for ML performance. Global memory (HBM) provides large capacity but limited bandwidth. Shared memory and L1 cache provide much higher bandwidth but limited capacity. Efficient ML kernels must carefully manage data movement between these levels to avoid becoming memory-bandwidth-bound.\n\nNVIDIA\'s GPU architecture has evolved rapidly to meet ML demands. The A100 (Ampere) introduced third-generation tensor cores with support for sparsity and BF16. The H100 (Hopper) added the Transformer Engine with FP8 support and improved interconnect bandwidth. Each generation roughly doubles ML performance, maintaining a pace that has far outstripped Moore\'s Law for general-purpose computing.',
    blocks: [
      {
        type: 'paragraph',
        text: 'Graphics Processing Units (GPUs) have become the dominant hardware platform for ML training and inference due to their massive parallelism. Unlike CPUs that have a few powerful cores optimized for sequential tasks, GPUs contain thousands of simpler cores designed to execute the same operation across many data elements simultaneously.',
      },
      {
        type: 'definition',
        term: 'GPU (Graphics Processing Unit)',
        definition: 'A massively parallel processor originally designed for graphics rendering but now the dominant platform for ML computation. Modern GPUs contain thousands of cores organized into streaming multiprocessors, with specialized tensor cores for matrix operations. The SIMT (Single Instruction, Multiple Threads) architecture excels at data-parallel workloads like neural network training.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'GPU Architecture: SMs and Tensor Cores',
      },
      {
        type: 'paragraph',
        text: 'NVIDIA GPUs organize computation into Streaming Multiprocessors (SMs), each containing multiple CUDA cores, tensor cores, and shared memory. Tensor cores are specialized matrix multiplication units that can compute a 4x4 matrix multiply-accumulate in a single cycle, providing enormous throughput for the dense linear algebra operations that dominate deep learning.',
      },
      {
        type: 'callout',
        variant: 'note',
        title: 'Tensor Cores vs. CUDA Cores',
        text: 'Standard CUDA cores perform one floating-point operation per cycle per core. A tensor core performs a 4x4 matrix multiply-accumulate (128 operations) in a single cycle. For matrix-heavy ML workloads, tensor cores provide 8-16x the throughput of CUDA cores. This is why deep learning performance has grown much faster than general-purpose GPU performance.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'The Memory Hierarchy',
      },
      {
        type: 'paragraph',
        text: 'The GPU memory hierarchy is critical for ML performance. Global memory (HBM) provides large capacity but limited bandwidth. Shared memory and L1 cache provide much higher bandwidth but limited capacity. Efficient ML kernels must carefully manage data movement between these levels to avoid becoming memory-bandwidth-bound.',
      },
      {
        type: 'table',
        headers: ['Memory Level', 'Capacity (A100)', 'Bandwidth', 'Latency', 'Scope'],
        rows: [
          ['Registers', '~256 KB per SM', '~20 TB/s', '~1 cycle', 'Per thread'],
          ['Shared Memory / L1', '192 KB per SM', '~19 TB/s', '~20 cycles', 'Per SM (block)'],
          ['L2 Cache', '40 MB', '~5 TB/s', '~200 cycles', 'Global'],
          ['HBM2e (Global)', '80 GB', '2 TB/s', '~400 cycles', 'Global'],
          ['NVLink (inter-GPU)', 'N/A', '600 GB/s', 'Microseconds', 'Multi-GPU'],
        ],
        caption: 'Table 11.1: NVIDIA A100 GPU memory hierarchy — note the 10,000x bandwidth gap between registers and HBM.',
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'Exploiting the Memory Hierarchy',
        text: 'The key to GPU kernel performance is maximizing data reuse in fast memory (registers and shared memory) to minimize slow HBM accesses. This is exactly what Flash Attention does: it tiles the attention computation into blocks that fit in SRAM, avoiding materializing the full N x N attention matrix in HBM. Similar tiling strategies apply to any memory-bound operation.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Evolution of NVIDIA GPU Architectures',
      },
      {
        type: 'paragraph',
        text: 'NVIDIA\'s GPU architecture has evolved rapidly to meet ML demands. Each generation roughly doubles ML performance, maintaining a pace that has far outstripped Moore\'s Law for general-purpose computing.',
      },
      {
        type: 'table',
        headers: ['Architecture', 'Year', 'Key ML Features', 'FP16 Tensor TFLOPS'],
        rows: [
          ['Volta (V100)', '2017', 'First tensor cores, NVLink 2.0', '125'],
          ['Ampere (A100)', '2020', 'TF32, BF16, 2:4 sparsity, 3rd-gen tensor cores', '312'],
          ['Hopper (H100)', '2022', 'FP8, Transformer Engine, NVLink 4.0', '990'],
          ['Blackwell (B200)', '2024', '2nd-gen Transformer Engine, NVLink 5.0', '~2250'],
        ],
        caption: 'Table 11.2: NVIDIA GPU architecture evolution for ML workloads.',
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Peak TFLOPS vs. Achieved TFLOPS',
        text: 'Published TFLOPS numbers represent the theoretical peak under ideal conditions. Real ML workloads typically achieve 30-60% of peak due to memory bandwidth limits, kernel launch overhead, and time spent on non-tensor-core operations. An H100 rated at 990 TFLOPS FP16 might achieve 400-600 TFLOPS on a well-optimized Transformer training workload.',
      },
    ],
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
    blocks: [
      {
        type: 'paragraph',
        text: 'Google\'s Tensor Processing Units (TPUs) are application-specific integrated circuits (ASICs) designed specifically for ML workloads. TPUs feature large systolic arrays optimized for matrix multiplication, high-bandwidth memory, and custom interconnects for distributed training. TPU v4 pods can deliver over an exaFLOP of compute for ML training.',
      },
      {
        type: 'definition',
        term: 'TPU (Tensor Processing Unit)',
        definition: 'Google\'s custom-designed ML accelerator chip. Unlike GPUs that evolved from graphics rendering, TPUs were purpose-built for neural network computation from the ground up. Their systolic array architecture achieves very high utilization on matrix-multiply-heavy workloads, and custom high-bandwidth interconnects (ICI) enable efficient distributed training across thousands of chips.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Systolic Array Architecture',
      },
      {
        type: 'paragraph',
        text: 'TPUs trade general-purpose flexibility for ML-specific performance. The systolic array architecture pipelines matrix operations through a grid of multiply-accumulate units, achieving near-peak utilization for the regular computation patterns found in neural networks. This specialization allows TPUs to achieve higher performance-per-watt than GPUs for supported operations.',
      },
      {
        type: 'definition',
        term: 'Systolic Array',
        definition: 'A grid of processing elements (PEs) arranged in a regular pattern, where data flows rhythmically between neighbors (like a heartbeat — hence "systolic"). Each PE performs a multiply-accumulate operation and passes data to the next. For matrix multiplication, one matrix flows horizontally and the other flows vertically through the array, computing the entire result in a pipelined fashion.',
      },
      {
        type: 'callout',
        variant: 'note',
        title: 'TPU v4 at Scale',
        text: 'A TPU v4 pod connects up to 4,096 TPU v4 chips via a custom 3D torus interconnect (ICI), delivering over 1 exaFLOP of BF16 compute. Google used TPU v4 pods to train PaLM (540B parameters) and Gemini. The tight integration of compute, memory, and networking in a TPU pod provides efficiency advantages that are difficult to replicate with discrete GPUs connected by InfiniBand.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'The Accelerator Landscape',
      },
      {
        type: 'paragraph',
        text: 'Beyond Google\'s TPUs, numerous companies are developing custom ML accelerators. Each takes a different approach to optimizing ML computation, with various trade-offs in programmability, performance, and cost.',
      },
      {
        type: 'table',
        headers: ['Accelerator', 'Company', 'Architecture', 'Best For'],
        rows: [
          ['TPU v5e / v4', 'Google', 'Systolic array + ICI', 'Large-scale training via Google Cloud'],
          ['Trainium / Inferentia', 'AWS', 'Custom ASIC + NeuronLink', 'Cost-effective training/inference on AWS'],
          ['Gaudi 2/3', 'Intel (Habana)', 'GEMM engine + TPC', 'Price-competitive GPU alternative'],
          ['IPU', 'Graphcore', 'Bulk synchronous parallel', 'Sparse/irregular workloads, GNNs'],
          ['WSE-2', 'Cerebras', 'Wafer-scale (850K cores)', 'Extremely large models, sparsity'],
        ],
        caption: 'Table 11.3: The ML accelerator landscape beyond NVIDIA GPUs.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Software Portability Challenge',
      },
      {
        type: 'paragraph',
        text: 'The diversity of ML accelerators creates challenges for software portability. Code written for NVIDIA GPUs does not automatically run on TPUs or other accelerators. Frameworks and compilers (JAX/XLA, ONNX Runtime) provide abstraction layers that enable writing hardware-portable ML code, though achieving peak performance on each platform often still requires hardware-specific tuning.',
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Vendor Lock-In Risk',
        text: 'Custom CUDA kernels, NVIDIA-specific libraries (cuDNN, NCCL), and TensorRT-optimized models create strong lock-in to the NVIDIA ecosystem. If portability across accelerators is a requirement, prefer framework-level APIs (PyTorch, JAX) over hardware-specific libraries, and test regularly on multiple backends.',
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'JAX for Hardware Portability',
        text: 'JAX, via the XLA compiler, provides the best cross-accelerator portability today. The same JAX code can run on CPUs, NVIDIA GPUs, and Google TPUs with minimal changes. This makes JAX particularly attractive for organizations that may want to switch between hardware platforms based on cost and availability.',
      },
    ],
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
    blocks: [
      {
        type: 'paragraph',
        text: 'Field-Programmable Gate Arrays (FPGAs) offer a middle ground between the flexibility of CPUs and the efficiency of ASICs. FPGAs can be reconfigured to implement custom hardware architectures, making them suitable for ML workloads that require specialized processing or very low latency that software-programmable devices cannot achieve.',
      },
      {
        type: 'definition',
        term: 'FPGA (Field-Programmable Gate Array)',
        definition: 'A semiconductor device containing a matrix of configurable logic blocks connected by programmable interconnects. FPGAs can be "programmed" after manufacturing to implement arbitrary digital circuits, offering a middle ground between the flexibility of software (CPUs/GPUs) and the efficiency of fixed-function hardware (ASICs).',
      },
      {
        type: 'heading',
        level: 3,
        text: 'FPGA Advantages and Trade-offs',
      },
      {
        type: 'paragraph',
        text: 'FPGAs excel in scenarios requiring extremely low latency, deterministic timing, and custom precision. Financial trading ML models, real-time video processing, and certain edge deployment scenarios benefit from FPGA implementation. However, FPGAs are significantly harder to program than GPUs, requiring hardware description languages like VHDL or Verilog, or high-level synthesis (HLS) tools.',
      },
      {
        type: 'table',
        headers: ['Property', 'CPU', 'GPU', 'FPGA', 'ASIC (e.g., TPU)'],
        rows: [
          ['Flexibility', 'Highest', 'High', 'Moderate (reconfigurable)', 'Lowest (fixed function)'],
          ['Performance/Watt', 'Lowest', 'Moderate', 'High', 'Highest'],
          ['Development Time', 'Days', 'Weeks', 'Months', 'Years'],
          ['Unit Cost (at volume)', 'Low', 'Moderate', 'High', 'Lowest'],
          ['Latency', 'Moderate', 'Moderate (kernel launch)', 'Very low (deterministic)', 'Very low'],
          ['ML Tooling', 'Excellent', 'Excellent', 'Limited', 'Vendor-specific'],
        ],
        caption: 'Table 11.4: Hardware platform comparison for ML deployment.',
      },
      {
        type: 'callout',
        variant: 'note',
        title: 'When FPGAs Make Sense',
        text: 'FPGAs are rarely the right choice for general ML workloads (GPUs and ASICs are better). They shine in niche scenarios: (1) Ultra-low-latency inference where kernel launch overhead matters (e.g., high-frequency trading at <1 microsecond). (2) Custom precision requirements not supported by GPUs. (3) Environments where GPUs are unavailable (e.g., certain military or aerospace applications).',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Edge ML Accelerators',
      },
      {
        type: 'paragraph',
        text: 'Edge ML accelerators are designed specifically for inference on resource-constrained devices. Google\'s Coral Edge TPU, NVIDIA Jetson, Intel Neural Compute Stick, and ARM\'s Ethos NPU provide dedicated ML acceleration in mobile and IoT form factors. These devices typically support INT8 inference and consume just a few watts of power.',
      },
      {
        type: 'table',
        headers: ['Device', 'Compute', 'Power', 'Form Factor', 'Best For'],
        rows: [
          ['Google Coral Edge TPU', '4 TOPS (INT8)', '2 W', 'USB / M.2 module', 'Vision at the edge, prototyping'],
          ['NVIDIA Jetson Orin Nano', '40 TOPS', '7-15 W', 'SOM module', 'Robotics, autonomous systems'],
          ['Intel Neural Compute Stick 2', '~1 TOPS', '1.5 W', 'USB stick', 'Prototyping, low-volume edge'],
          ['ARM Ethos-U55', '0.5 TOPS', '<50 mW', 'On-chip IP', 'Microcontroller-class always-on ML'],
          ['Apple Neural Engine (M-series)', '15-38 TOPS', 'Shared SoC', 'Integrated in Apple SoC', 'On-device ML for Apple products'],
        ],
        caption: 'Table 11.5: Edge ML accelerators and their specifications.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Emerging Hardware Paradigms',
      },
      {
        type: 'paragraph',
        text: 'The hardware landscape for ML is diversifying rapidly. Neuromorphic chips like Intel Loihi process information using spike-based computation inspired by biological neurons. Photonic accelerators use light instead of electrons for matrix operations. In-memory computing architectures perform computation within memory arrays to avoid the data movement bottleneck. While most of these are still early-stage, they represent potential paradigm shifts in ML hardware.',
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'Evaluating New Hardware',
        text: 'When evaluating a new ML accelerator, look beyond the peak TOPS number. Key questions: (1) What software stack is supported (PyTorch, TensorFlow, ONNX)? (2) What operations and data types are actually accelerated? (3) What is the real-world throughput on your specific model? (4) What is the total cost of ownership including development time? A chip with half the TOPS but excellent software support often delivers more value in practice.',
      },
      {
        type: 'list',
        ordered: false,
        items: [
          'Neuromorphic computing (Intel Loihi, IBM TrueNorth) — Spike-based computation for event-driven, energy-efficient processing.',
          'Photonic accelerators (Lightmatter, Luminous) — Use light interference for matrix multiplication at the speed of light.',
          'In-memory computing (Mythic, Syntiant) — Perform multiply-accumulate within memory arrays, eliminating the data movement bottleneck.',
          'Analog compute (IBM Analog AI) — Use analog circuit properties for approximate matrix computation at extreme energy efficiency.',
        ],
      },
    ],
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
    blocks: [
      {
        type: 'paragraph',
        text: 'Hardware-aware optimization tailors model architecture and computation to exploit the specific capabilities of the target hardware platform. Rather than designing models in a hardware-agnostic manner and hoping for good performance, hardware-aware approaches directly incorporate hardware characteristics into the design process.',
      },
      {
        type: 'definition',
        term: 'Hardware-Aware Optimization',
        definition: 'An optimization approach that incorporates the characteristics of the target hardware platform (memory hierarchy, compute units, supported operations, interconnect topology) directly into the model design and compilation process. This contrasts with hardware-agnostic design, which optimizes for abstract metrics like FLOPs without considering how they map to real hardware.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Hardware-Aware Neural Architecture Search',
      },
      {
        type: 'paragraph',
        text: 'Hardware-aware NAS includes hardware metrics like latency, energy, and memory usage in the search objective function. Instead of optimizing only for accuracy, the search finds architectures that achieve the best accuracy within a given hardware budget. This approach has produced models like EfficientNet and MnasNet that are Pareto-optimal for specific hardware targets.',
      },
      {
        type: 'equation',
        latex: '\\max_{\\alpha} \\quad \\text{Accuracy}(\\alpha) \\quad \\text{s.t.} \\quad \\text{Latency}(\\alpha, h) \\leq T',
        label: 'Equation 11.1: Hardware-aware NAS optimizes accuracy subject to a latency constraint T on target hardware h.',
      },
      {
        type: 'callout',
        variant: 'example',
        title: 'MnasNet: Hardware-Aware Search in Practice',
        text: 'Google\'s MnasNet used a multi-objective search that directly measured inference latency on a Pixel phone. The search space included mobile-friendly operations (depthwise separable convolutions, squeeze-and-excite blocks) and the reward function was Accuracy(m) x [Latency(m)/T]^w where w=-0.07 penalizes slow models. The resulting architecture outperformed manually designed MobileNetV2 by 1.8% accuracy at the same latency.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Kernel Auto-Tuning',
      },
      {
        type: 'paragraph',
        text: 'Kernel auto-tuning optimizes the low-level implementation of individual operations for the target hardware. Tools like TVM\'s AutoTVM and Ansor search over implementation strategies (tile sizes, loop ordering, vectorization) to find the fastest configuration for each operation on each device. This can yield significant speedups over hand-written or default kernel implementations.',
      },
      {
        type: 'callout',
        variant: 'note',
        title: 'The Auto-Tuning Search Space',
        text: 'For a single matrix multiplication on a GPU, the auto-tuner must choose: tile sizes for shared memory blocking, thread block dimensions, loop unrolling factors, vectorization width, and memory access patterns. The search space easily reaches millions of configurations. Smart search strategies (learned cost models, genetic algorithms, simulated annealing) are essential to find good configurations in reasonable time.',
      },
      {
        type: 'code',
        language: 'python',
        code: '# TVM auto-tuning example (simplified)\nimport tvm\nfrom tvm import auto_scheduler\n\n# Define the workload\n@auto_scheduler.register_workload\ndef matmul(M, K, N):\n    A = te.placeholder((M, K), name="A")\n    B = te.placeholder((K, N), name="B")\n    k = te.reduce_axis((0, K), name="k")\n    C = te.compute((M, N),\n        lambda i, j: te.sum(A[i, k] * B[k, j], axis=k))\n    return [A, B, C]\n\n# Auto-tune for specific hardware target\ntask = auto_scheduler.SearchTask(func=matmul, args=(1024, 1024, 1024),\n                                  target="cuda -model=a100")\ntune_option = auto_scheduler.TuningOptions(num_measure_trials=1000)\nauto_scheduler.auto_schedule(task, tune_option)',
        caption: 'TVM auto-scheduler searches for the optimal kernel implementation for each operation on the target hardware.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Hardware-Software Co-Design',
      },
      {
        type: 'paragraph',
        text: 'The concept of hardware-software co-design takes optimization further by jointly designing the model architecture, the compilation strategy, and even the hardware itself. This holistic approach recognizes that the best system emerges from optimizing all components together rather than sequentially. Co-design is increasingly practiced at companies that control both the hardware and software stack.',
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'Co-Design in Practice',
        text: 'Apple exemplifies hardware-software co-design: the Neural Engine in Apple Silicon is co-designed with Core ML and model architectures used in iOS features. Google co-designs TPU hardware with XLA compiler passes and JAX programming patterns. This tight integration explains why these companies achieve higher efficiency than combining independently designed components.',
      },
    ],
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
    blocks: [
      {
        type: 'paragraph',
        text: 'ML accelerator design is driven by the observation that neural network workloads have predictable, regular computation patterns dominated by matrix multiplication and convolution. By specializing hardware for these operations, accelerators achieve orders-of-magnitude better performance-per-watt than general-purpose processors.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Accelerator Design Decisions',
      },
      {
        type: 'paragraph',
        text: 'Key design decisions for ML accelerators include the compute architecture (systolic array, dataflow, SIMD), the memory hierarchy (on-chip SRAM size, memory bandwidth), the interconnect topology (for multi-chip systems), and the supported data formats (FP32, FP16, BF16, INT8, FP8). Each choice has implications for what models can be efficiently executed.',
      },
      {
        type: 'table',
        headers: ['Design Dimension', 'Options', 'Trade-off'],
        rows: [
          ['Compute Architecture', 'Systolic array, dataflow, SIMD, CGRA', 'Specialization vs. flexibility'],
          ['On-chip Memory', 'Small SRAM (fast) vs. large SRAM (expensive)', 'Bandwidth vs. chip area and cost'],
          ['Off-chip Memory', 'HBM (high bandwidth) vs. DDR (lower cost)', 'Bandwidth vs. cost and power'],
          ['Interconnect', 'Mesh, torus, tree, crossbar', 'Scalability vs. per-link bandwidth'],
          ['Data Formats', 'FP32, FP16, BF16, INT8, FP8, INT4', 'Precision vs. throughput and efficiency'],
        ],
        caption: 'Table 11.6: Key design dimensions for ML accelerator architecture.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'The Memory Wall',
      },
      {
        type: 'paragraph',
        text: 'The memory wall is the fundamental bottleneck for ML accelerators. As compute throughput increases faster than memory bandwidth, an increasing fraction of operations become memory-bound. This has driven the adoption of high-bandwidth memory (HBM), larger on-chip SRAM caches, and processing-in-memory architectures that bring computation closer to data.',
      },
      {
        type: 'definition',
        term: 'Memory Wall',
        definition: 'The growing disparity between processor compute throughput and memory bandwidth. Compute has been doubling every ~2 years while memory bandwidth improves only ~1.2x per generation. For ML accelerators, this means that even with massive compute capacity, performance is increasingly limited by how fast data can be fed to the compute units.',
      },
      {
        type: 'equation',
        latex: '\\text{Arithmetic Intensity} = \\frac{\\text{FLOPs}}{\\text{Bytes transferred}} \\quad [\\text{FLOP/Byte}]',
        label: 'Equation 11.2: Arithmetic intensity determines whether an operation is compute-bound (high AI) or memory-bound (low AI).',
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Compute Growth Outpacing Memory',
        text: 'NVIDIA H100 compute (FP16 tensor): 990 TFLOPS. H100 memory bandwidth: 3.35 TB/s. To keep the compute fully utilized, every byte transferred must be used for ~300 FLOPs. Standard matrix multiplication at large batch sizes achieves this, but many other operations (element-wise, normalization, attention) have much lower arithmetic intensity and are memory-bound. This gap widens with each hardware generation.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'The Software Ecosystem Moat',
      },
      {
        type: 'paragraph',
        text: 'Software support is as important as hardware capability for accelerator success. An accelerator with outstanding hardware specifications will fail in the market if it lacks compiler support, framework integration, and developer tooling. The NVIDIA ecosystem advantage (CUDA, cuDNN, TensorRT, NGC containers) demonstrates the importance of software maturity in hardware adoption.',
      },
      {
        type: 'callout',
        variant: 'note',
        title: 'NVIDIA\'s Ecosystem Advantage',
        text: 'NVIDIA\'s dominance in ML is not primarily about raw hardware performance — it\'s about the ecosystem. CUDA (launched 2006) has 18+ years of maturity with millions of developers. cuDNN provides hand-optimized ML kernels. TensorRT automates inference optimization. NGC provides pre-built containers. PyTorch and TensorFlow have first-class CUDA support. This ecosystem creates a powerful moat that competitors struggle to overcome regardless of hardware specifications.',
      },
      {
        type: 'quote',
        text: 'Hardware is easy. Software is hard. The real barrier to entry in the accelerator market is not building a faster chip — it\'s building the compiler, the libraries, the framework integrations, and the developer community that make the chip usable.',
        attribution: 'Paraphrased from industry observations on ML hardware competition',
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'Evaluating Accelerator Software Maturity',
        text: 'When evaluating a new accelerator, test these checkpoints: (1) Can you run an unmodified PyTorch model? (2) Does the compiler handle your model\'s operations without fallbacks to CPU? (3) Are common libraries (attention, normalization) optimized? (4) Is there a profiling tool to identify bottlenecks? (5) How quickly are framework updates supported? Anything less than "yes" to all five means significant engineering effort to adopt.',
      },
    ],
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
