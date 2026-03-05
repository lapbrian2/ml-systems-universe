import type { ChapterSection, GlossaryTerm } from '~/types/chapter';

export const sections: ChapterSection[] = [
  {
    id: 'ch12-s1',
    heading: 'MLPerf and Standard Benchmarks',
    body: 'MLPerf is the industry-standard benchmark suite for measuring ML system performance. Developed by a consortium of industry and academic organizations, MLPerf provides standardized workloads, datasets, and measurement rules that enable fair comparison across different hardware platforms, frameworks, and system configurations.\n\nMLPerf includes separate benchmark suites for training and inference. The training benchmarks measure time-to-train for workloads spanning image classification (ResNet-50), object detection (SSD, RetinaNet), natural language processing (BERT), recommendation (DLRM), and reinforcement learning. The inference benchmarks measure throughput and latency across similar workloads under different scenarios (server, offline, single-stream).\n\nStandardized benchmarks serve a critical role in the ML ecosystem by providing objective comparison points. However, they also have limitations. Benchmark workloads may not represent actual production workloads. Optimizations specific to benchmark rules may not generalize. And the competitive pressure to achieve top benchmark results can distort engineering priorities.\n\nBeyond MLPerf, domain-specific benchmarks serve particular needs. DAWNBench focuses on training cost efficiency. DeepBench isolates individual operation performance. Application-specific benchmarks in areas like autonomous driving, medical imaging, and natural language understanding provide more relevant metrics for practitioners in those domains.',
    blocks: [
      {
        type: 'paragraph',
        text: 'MLPerf is the industry-standard benchmark suite for measuring ML system performance. Developed by a consortium of industry and academic organizations, MLPerf provides standardized workloads, datasets, and measurement rules that enable fair comparison across different hardware platforms, frameworks, and system configurations.',
      },
      {
        type: 'definition',
        term: 'MLPerf',
        definition: 'An industry-standard benchmark suite maintained by the MLCommons consortium that provides standardized workloads, datasets, and measurement rules for comparing ML training and inference performance across hardware platforms and software frameworks.',
      },
      {
        type: 'figure',
        caption: 'Radar chart comparing benchmark dimensions across hardware targets. Each polygon represents a different platform (GPU, TPU, Edge) across throughput, latency, accuracy, power efficiency, memory, and cost.',
        alt: 'Radar chart with six axes showing benchmark dimensions, with overlapping colored polygons for GPU, TPU, and Edge hardware platforms.',
        number: 'Figure 12.1',
        component: 'BenchmarkRadar',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Training and Inference Benchmark Suites',
      },
      {
        type: 'paragraph',
        text: 'MLPerf includes separate benchmark suites for training and inference. The training benchmarks measure time-to-train for workloads spanning image classification (ResNet-50), object detection (SSD, RetinaNet), natural language processing (BERT), recommendation (DLRM), and reinforcement learning. The inference benchmarks measure throughput and latency across similar workloads under different scenarios.',
      },
      {
        type: 'table',
        headers: ['Benchmark Suite', 'What It Measures', 'Key Workloads', 'Primary Metric'],
        rows: [
          ['MLPerf Training', 'Time to reach target quality', 'ResNet-50, BERT, DLRM, RetinaNet', 'Time-to-train (minutes)'],
          ['MLPerf Inference', 'Throughput and latency', 'Same model architectures', 'Queries/sec, latency percentiles'],
          ['DAWNBench', 'Training cost efficiency', 'Image classification, QA', 'Dollar cost to target accuracy'],
          ['DeepBench', 'Individual operation speed', 'GEMM, convolution, RNN', 'TFLOPS, time per operation'],
        ],
        caption: 'Table 12.1: Major ML benchmark suites and their focus areas.',
      },
      {
        type: 'callout',
        variant: 'note',
        title: 'MLPerf Inference Scenarios',
        text: 'MLPerf Inference defines four scenarios: Single-Stream (one query at a time, measuring latency), Multi-Stream (multiple inputs per query, for multi-camera systems), Server (variable arrival rate, measuring tail latency), and Offline (all data available at once, measuring throughput). Each scenario reflects a distinct real-world deployment pattern.',
      },
      {
        type: 'paragraph',
        text: 'Standardized benchmarks serve a critical role in the ML ecosystem by providing objective comparison points. However, they also have limitations. Benchmark workloads may not represent actual production workloads. Optimizations specific to benchmark rules may not generalize. And the competitive pressure to achieve top benchmark results can distort engineering priorities.',
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Goodhart\'s Law in Benchmarking',
        text: 'When a measure becomes a target, it ceases to be a good measure. MLPerf scores drive hardware purchasing decisions worth millions of dollars, creating intense pressure to optimize specifically for benchmark workloads. Always verify that benchmark improvements translate to your actual production workloads before making investment decisions.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Domain-Specific Benchmarks',
      },
      {
        type: 'paragraph',
        text: 'Beyond MLPerf, domain-specific benchmarks serve particular needs. DAWNBench focuses on training cost efficiency. DeepBench isolates individual operation performance. Application-specific benchmarks in areas like autonomous driving, medical imaging, and natural language understanding provide more relevant metrics for practitioners in those domains.',
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'Choosing the Right Benchmark',
        text: 'Start with MLPerf for hardware comparison and vendor evaluation. Use domain-specific benchmarks when evaluating solutions for a particular application. Best of all, create an internal benchmark that mirrors your actual production workload — this provides the most actionable performance data.',
      },
      {
        type: 'list',
        ordered: false,
        items: [
          'MLPerf — Industry-standard suite for cross-platform comparison of training and inference.',
          'DAWNBench — Focuses on cost-to-accuracy, measuring dollar efficiency of training.',
          'DeepBench — Micro-benchmarks isolating individual DNN operations (GEMM, convolution).',
          'Application benchmarks — Domain-specific workloads for autonomous driving, NLP, medical imaging.',
        ],
      },
    ],
    order: 0,
    keyConcepts: [
      { term: 'MLPerf', definition: 'An industry-standard benchmark suite that provides standardized workloads and measurement rules for comparing ML system training and inference performance.' },
      { term: 'Benchmark Suite', definition: 'A collection of standardized workloads and measurement methodologies designed to evaluate and compare system performance across implementations.' },
    ],
  },
  {
    id: 'ch12-s2',
    heading: 'Profiling Tools and Techniques',
    body: 'Profiling is the systematic measurement of where time and resources are spent during model training or inference. Without profiling, optimization is guesswork. Profiling tools reveal the actual bottlenecks, which are often surprising and not where engineers initially expect them.\n\nGPU profilers like NVIDIA Nsight Systems and Nsight Compute provide detailed visibility into GPU utilization, memory bandwidth usage, kernel execution times, and communication overhead. Nsight Systems gives a timeline view of the entire application, showing how CPU, GPU, and network activities overlap. Nsight Compute provides deep analysis of individual kernel performance.\n\nFramework-level profilers like PyTorch Profiler and TensorBoard Profiler operate at a higher level of abstraction, showing time spent in specific operations, memory allocation patterns, and data loading bottlenecks. These tools are easier to use than hardware-level profilers and are sufficient for identifying most common performance issues.\n\nEffective profiling requires a systematic methodology. Start with a high-level timeline to identify whether the bottleneck is in data loading, forward pass, backward pass, or communication. Then drill down into the bottleneck using more detailed tools. Measure under realistic conditions (production batch sizes, data pipeline active) because bottlenecks shift with configuration.',
    blocks: [
      {
        type: 'paragraph',
        text: 'Profiling is the systematic measurement of where time and resources are spent during model training or inference. Without profiling, optimization is guesswork. Profiling tools reveal the actual bottlenecks, which are often surprising and not where engineers initially expect them.',
      },
      {
        type: 'definition',
        term: 'Profiling',
        definition: 'The systematic measurement of resource utilization — including time, memory, compute, and bandwidth — across all components of an ML system to identify performance bottlenecks and guide optimization efforts.',
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'Profile Before You Optimize',
        text: 'Engineers frequently spend days optimizing the wrong part of the system. A common pattern is spending effort on GPU kernel optimization when the real bottleneck is data loading on CPU. Always profile first to identify the actual bottleneck. Five minutes of profiling can save weeks of misdirected optimization.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Hardware-Level Profilers',
      },
      {
        type: 'paragraph',
        text: 'GPU profilers like NVIDIA Nsight Systems and Nsight Compute provide detailed visibility into GPU utilization, memory bandwidth usage, kernel execution times, and communication overhead. Nsight Systems gives a timeline view of the entire application, showing how CPU, GPU, and network activities overlap. Nsight Compute provides deep analysis of individual kernel performance.',
      },
      {
        type: 'table',
        headers: ['Profiling Tool', 'Level', 'What It Shows', 'Best For'],
        rows: [
          ['Nsight Systems', 'Hardware (system-wide)', 'CPU/GPU timeline, kernel launches, memory copies', 'Finding pipeline stalls and overlap issues'],
          ['Nsight Compute', 'Hardware (kernel-level)', 'SM utilization, memory throughput, instruction mix', 'Optimizing individual CUDA kernels'],
          ['PyTorch Profiler', 'Framework', 'Op-level timing, memory allocation, data loading', 'General training bottleneck identification'],
          ['TensorBoard Profiler', 'Framework', 'Op timing, device placement, input pipeline', 'TensorFlow/JAX training optimization'],
          ['Intel VTune', 'Hardware (CPU)', 'CPU utilization, cache misses, threading', 'CPU-bound preprocessing bottlenecks'],
        ],
        caption: 'Table 12.2: Profiling tools at different abstraction levels.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Framework-Level Profilers',
      },
      {
        type: 'paragraph',
        text: 'Framework-level profilers like PyTorch Profiler and TensorBoard Profiler operate at a higher level of abstraction, showing time spent in specific operations, memory allocation patterns, and data loading bottlenecks. These tools are easier to use than hardware-level profilers and are sufficient for identifying most common performance issues.',
      },
      {
        type: 'code',
        language: 'python',
        code: 'import torch\nfrom torch.profiler import profile, ProfilerActivity\n\nwith profile(\n    activities=[ProfilerActivity.CPU, ProfilerActivity.CUDA],\n    schedule=torch.profiler.schedule(wait=1, warmup=1, active=3),\n    on_trace_ready=torch.profiler.tensorboard_trace_handler(\'./log\'),\n    record_shapes=True,\n    with_stack=True,\n) as prof:\n    for step, batch in enumerate(dataloader):\n        train_step(model, batch)\n        prof.step()',
        caption: 'Example: Using PyTorch Profiler with TensorBoard integration.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Systematic Profiling Methodology',
      },
      {
        type: 'paragraph',
        text: 'Effective profiling requires a systematic methodology. Start with a high-level timeline to identify whether the bottleneck is in data loading, forward pass, backward pass, or communication. Then drill down into the bottleneck using more detailed tools. Measure under realistic conditions because bottlenecks shift with configuration.',
      },
      {
        type: 'list',
        ordered: true,
        items: [
          'Capture a high-level timeline (Nsight Systems or framework profiler) to see the big picture.',
          'Identify the dominant bottleneck: data loading, forward pass, backward pass, or communication.',
          'Drill down with a detailed profiler (Nsight Compute for GPU kernels, VTune for CPU).',
          'Optimize the identified bottleneck and re-profile to confirm improvement.',
          'Repeat — fixing one bottleneck often reveals the next one.',
        ],
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Profile Under Realistic Conditions',
        text: 'Bottlenecks shift dramatically with configuration. A model may be compute-bound at batch size 256 but memory-bound at batch size 8. Always profile with production-realistic batch sizes, data pipelines active, and distributed training enabled if applicable.',
      },
    ],
    order: 1,
    keyConcepts: [
      { term: 'Profiling', definition: 'The systematic measurement of resource utilization (time, memory, bandwidth) across system components to identify performance bottlenecks.' },
      { term: 'GPU Utilization', definition: 'The percentage of time GPU compute units are actively executing operations, a key indicator of whether computation is efficiently utilizing hardware.' },
    ],
  },
  {
    id: 'ch12-s3',
    heading: 'Roofline Analysis',
    body: 'The roofline model is a visual performance analysis framework that determines whether a workload is compute-bound or memory-bound. It plots achievable performance (FLOP/s) as a function of operational intensity (FLOPs per byte of memory accessed), with the hardware\'s peak compute and peak memory bandwidth forming the "roofline."\n\nA workload that falls on the sloped portion of the roofline is memory-bound: performance is limited by memory bandwidth rather than compute capability. Optimization should focus on reducing memory accesses through techniques like operator fusion, data layout optimization, or increased computation reuse.\n\nA workload that falls on the flat portion of the roofline is compute-bound: performance is limited by the hardware\'s peak computation rate. For compute-bound workloads, optimization should focus on using more efficient operations, lower precision formats, or hardware with higher peak throughput.\n\nIn practice, most neural network operations fall into one of two categories. Large matrix multiplications (convolutions, attention, linear layers with large batch sizes) tend to be compute-bound. Element-wise operations, batch normalization, and small matrix operations tend to be memory-bound. Understanding this distinction guides optimization strategy for each part of the model.',
    blocks: [
      {
        type: 'paragraph',
        text: 'The roofline model is a visual performance analysis framework that determines whether a workload is compute-bound or memory-bound. It plots achievable performance (FLOP/s) as a function of operational intensity (FLOPs per byte of memory accessed), with the hardware\'s peak compute and peak memory bandwidth forming the "roofline."',
      },
      {
        type: 'definition',
        term: 'Roofline Model',
        definition: 'A visual performance model that plots achievable computation throughput (FLOP/s) against operational intensity (FLOPs/byte). The "roofline" is formed by the hardware\'s peak compute rate (flat ceiling) and peak memory bandwidth (sloped ceiling), revealing whether a workload is compute-bound or memory-bound.',
      },
      {
        type: 'equation',
        latex: 'P = \\min\\left(\\pi, \\beta \\cdot I\\right)',
        label: 'Equation 12.1: Roofline performance model. P is attainable performance (FLOP/s), pi is peak compute throughput, beta is peak memory bandwidth (bytes/s), and I is operational intensity (FLOP/byte).',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Memory-Bound Workloads',
      },
      {
        type: 'paragraph',
        text: 'A workload that falls on the sloped portion of the roofline is memory-bound: performance is limited by memory bandwidth rather than compute capability. Optimization should focus on reducing memory accesses through techniques like operator fusion, data layout optimization, or increased computation reuse.',
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'Optimizing Memory-Bound Operations',
        text: 'For memory-bound operations, the key is to increase operational intensity — do more computation per byte loaded from memory. Operator fusion (combining multiple element-wise operations into a single kernel) is the most effective technique, as it eliminates intermediate memory reads and writes.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Compute-Bound Workloads',
      },
      {
        type: 'paragraph',
        text: 'A workload that falls on the flat portion of the roofline is compute-bound: performance is limited by the hardware\'s peak computation rate. For compute-bound workloads, optimization should focus on using more efficient operations, lower precision formats, or hardware with higher peak throughput.',
      },
      {
        type: 'table',
        headers: ['Operation Type', 'Typical Binding', 'Operational Intensity', 'Optimization Strategy'],
        rows: [
          ['Large GEMM / Convolution', 'Compute-bound', 'High (100+ FLOP/byte)', 'Lower precision (FP16/INT8), Tensor Cores'],
          ['Attention (large seq length)', 'Compute-bound', 'High', 'FlashAttention, mixed precision'],
          ['Element-wise (ReLU, add)', 'Memory-bound', 'Low (1-2 FLOP/byte)', 'Operator fusion, in-place operations'],
          ['Batch Normalization', 'Memory-bound', 'Low', 'Fuse with adjacent convolution'],
          ['Softmax', 'Memory-bound', 'Low', 'Fused attention kernels'],
          ['Small FC layers', 'Memory-bound', 'Low-Medium', 'Batching, operator fusion'],
        ],
        caption: 'Table 12.3: Common neural network operations and their typical roofline classification.',
      },
      {
        type: 'paragraph',
        text: 'In practice, most neural network operations fall into one of two categories. Large matrix multiplications (convolutions, attention, linear layers with large batch sizes) tend to be compute-bound. Element-wise operations, batch normalization, and small matrix operations tend to be memory-bound. Understanding this distinction guides optimization strategy for each part of the model.',
      },
      {
        type: 'callout',
        variant: 'example',
        title: 'Reading a Roofline Plot',
        text: 'Consider an NVIDIA A100 GPU with 312 TFLOP/s FP16 peak compute and 2 TB/s memory bandwidth. The ridge point (where sloped and flat regions meet) occurs at 312/2 = 156 FLOP/byte. Operations with intensity below 156 FLOP/byte are memory-bound; above 156 are compute-bound. A large GEMM at ~200 FLOP/byte is compute-bound and should use Tensor Cores. A ReLU at ~1 FLOP/byte is deeply memory-bound and should be fused with adjacent operations.',
      },
      {
        type: 'callout',
        variant: 'note',
        title: 'Operational Intensity',
        text: 'Operational intensity (also called arithmetic intensity) is the ratio of floating-point operations to bytes transferred from memory. It is the single most important metric for determining whether an operation will benefit more from faster compute or faster memory. Calculate it as: total FLOPs in the operation divided by total bytes read and written.',
      },
    ],
    order: 2,
    keyConcepts: [
      { term: 'Roofline Model', definition: 'A performance analysis framework that visualizes the relationship between computational throughput and memory bandwidth to identify whether workloads are compute-bound or memory-bound.' },
      { term: 'Compute-Bound', definition: 'A workload whose performance is limited by the hardware\'s computational throughput rather than memory bandwidth.' },
    ],
  },
  {
    id: 'ch12-s4',
    heading: 'Performance Measurement Methodology',
    body: 'Accurate performance measurement requires careful methodology to avoid common pitfalls. Warmup runs must precede measurement to ensure caches are populated, JIT compilation is complete, and GPU clock rates have stabilized. Without warmup, initial runs will be misleadingly slow.\n\nStatistical rigor is essential for meaningful performance comparisons. Report confidence intervals, not just averages. Use sufficient repetitions to establish statistical significance. Measure with and without competing system load to understand sensitivity. Small differences (under 5%) between configurations may not be meaningful given measurement noise.\n\nBenchmarking environments must be carefully controlled. GPU clock rates, power limits, driver versions, framework versions, and competing processes all affect measurements. Documenting and controlling these factors enables reproducible benchmarks. Containerized environments (Docker, Singularity) help standardize the software stack.\n\nCommon measurement mistakes include cherry-picking the best run instead of reporting statistics, measuring artificial workloads that do not represent production use, ignoring data loading and preprocessing overhead, and comparing across different batch sizes or precision without normalization. Honest benchmarking requires transparent reporting of all measurement conditions and limitations.',
    blocks: [
      {
        type: 'paragraph',
        text: 'Accurate performance measurement requires careful methodology to avoid common pitfalls. Warmup runs must precede measurement to ensure caches are populated, JIT compilation is complete, and GPU clock rates have stabilized. Without warmup, initial runs will be misleadingly slow.',
      },
      {
        type: 'definition',
        term: 'Warmup Runs',
        definition: 'Initial execution iterations performed before taking measurements, allowing caches to populate, JIT compilers to optimize hot paths, and GPU clock rates to boost to steady-state frequencies. Skipping warmup leads to misleadingly slow initial measurements.',
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'The Warmup Trap',
        text: 'GPU clock rates can take several seconds to ramp from idle to boost frequency. PyTorch\'s JIT (TorchScript, torch.compile) compiles on the first invocation. CUDA contexts must be initialized. Always discard the first 3-5 iterations before recording measurements. A single "cold" run can be 10x slower than steady-state performance.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Statistical Rigor',
      },
      {
        type: 'paragraph',
        text: 'Statistical rigor is essential for meaningful performance comparisons. Report confidence intervals, not just averages. Use sufficient repetitions to establish statistical significance. Measure with and without competing system load to understand sensitivity. Small differences (under 5%) between configurations may not be meaningful given measurement noise.',
      },
      {
        type: 'equation',
        latex: 'CI = \\bar{x} \\pm t_{\\alpha/2, n-1} \\cdot \\frac{s}{\\sqrt{n}}',
        label: 'Equation 12.2: Confidence interval for the mean measurement, where x-bar is the sample mean, t is the critical value, s is the sample standard deviation, and n is the number of trials.',
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'How Many Repetitions?',
        text: 'Run at least 10-30 repetitions after warmup. Compute the coefficient of variation (CV = std/mean). If CV > 5%, investigate sources of variance (thermal throttling, competing processes, NUMA effects) before drawing conclusions. For publication-quality benchmarks, use at least 50 repetitions and report median with interquartile range.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Controlling the Environment',
      },
      {
        type: 'paragraph',
        text: 'Benchmarking environments must be carefully controlled. GPU clock rates, power limits, driver versions, framework versions, and competing processes all affect measurements. Documenting and controlling these factors enables reproducible benchmarks.',
      },
      {
        type: 'list',
        ordered: false,
        items: [
          'Lock GPU clock rates using nvidia-smi to prevent frequency scaling during measurement.',
          'Record driver version, CUDA version, cuDNN version, and framework version.',
          'Disable GPU boost or set a fixed power limit for consistent thermal behavior.',
          'Use process isolation (taskset, numactl) to pin CPU cores and avoid NUMA effects.',
          'Use containerized environments (Docker, Singularity) to standardize the software stack.',
          'Report hardware SKU, memory configuration, and interconnect topology.',
        ],
      },
      {
        type: 'heading',
        level: 3,
        text: 'Common Measurement Mistakes',
      },
      {
        type: 'paragraph',
        text: 'Common measurement mistakes include cherry-picking the best run instead of reporting statistics, measuring artificial workloads that do not represent production use, ignoring data loading and preprocessing overhead, and comparing across different batch sizes or precision without normalization.',
      },
      {
        type: 'callout',
        variant: 'example',
        title: 'A Benchmarking Cautionary Tale',
        text: 'A team reported a 30% speedup from a new kernel implementation. On closer inspection, they had compared a single best-case run of the new kernel against the average of the old kernel. They had also disabled the data pipeline and measured only the compute portion. When measured end-to-end with proper statistics, the actual improvement was 4% — within measurement noise. Honest benchmarking requires transparent methodology.',
      },
    ],
    order: 3,
    keyConcepts: [
      { term: 'Warmup Runs', definition: 'Initial execution runs performed before measurement to populate caches, complete JIT compilation, and stabilize hardware clock rates.' },
      { term: 'Statistical Significance', definition: 'The confidence that observed performance differences are real rather than due to measurement noise, typically established through repeated trials and confidence intervals.' },
    ],
  },
  {
    id: 'ch12-s5',
    heading: 'Benchmarking Best Practices',
    body: 'Effective benchmarking starts with clearly defining what you want to measure and why. Are you comparing hardware platforms? Evaluating optimization techniques? Selecting between model architectures? The measurement approach should be tailored to answer the specific question at hand.\n\nEnd-to-end benchmarking captures the true system performance by measuring the complete pipeline from data loading through inference and postprocessing. Micro-benchmarks isolate individual operations or components for detailed analysis. Both perspectives are valuable, but end-to-end measurements are what ultimately matter for production performance.\n\nReproducibility is a key quality indicator for benchmarks. Others should be able to independently verify your results given the same hardware, software, and configuration. Publishing benchmark code, configurations, and raw measurement data (not just summary statistics) enables community verification and builds trust in the results.\n\nBenchmarking should be integrated into the CI/CD pipeline as a continuous practice, not a one-time event. Performance regression detection catches optimizations that inadvertently slow other parts of the system. Trend tracking over time reveals the compounding effect of many small improvements or regressions. Automated benchmarking ensures that performance is monitored consistently across all code changes.',
    blocks: [
      {
        type: 'paragraph',
        text: 'Effective benchmarking starts with clearly defining what you want to measure and why. Are you comparing hardware platforms? Evaluating optimization techniques? Selecting between model architectures? The measurement approach should be tailored to answer the specific question at hand.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'End-to-End vs. Micro-Benchmarks',
      },
      {
        type: 'paragraph',
        text: 'End-to-end benchmarking captures the true system performance by measuring the complete pipeline from data loading through inference and postprocessing. Micro-benchmarks isolate individual operations or components for detailed analysis. Both perspectives are valuable, but end-to-end measurements are what ultimately matter for production performance.',
      },
      {
        type: 'definition',
        term: 'End-to-End Benchmark',
        definition: 'A performance measurement that captures the complete system pipeline from data ingestion through model inference and postprocessing, reflecting the true production performance experienced by end users.',
      },
      {
        type: 'table',
        headers: ['Benchmark Type', 'Scope', 'Strengths', 'Limitations'],
        rows: [
          ['End-to-End', 'Full pipeline', 'Reflects real performance, captures interactions', 'Hard to diagnose root cause of issues'],
          ['Micro-Benchmark', 'Single operation', 'Easy to isolate and optimize', 'May miss pipeline-level bottlenecks'],
          ['Component Benchmark', 'Subsystem (e.g., data loader)', 'Good balance of scope and detail', 'May miss cross-component interactions'],
        ],
        caption: 'Table 12.4: Benchmarking at different scopes.',
      },
      {
        type: 'callout',
        variant: 'note',
        title: 'The Pipeline Paradox',
        text: 'A system composed of individually fast components can still be slow overall. Pipeline stalls, memory contention, and synchronization overhead between components can dominate total latency. This is why end-to-end benchmarks are essential — they capture the interactions that micro-benchmarks miss.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Reproducibility',
      },
      {
        type: 'paragraph',
        text: 'Reproducibility is a key quality indicator for benchmarks. Others should be able to independently verify your results given the same hardware, software, and configuration. Publishing benchmark code, configurations, and raw measurement data (not just summary statistics) enables community verification and builds trust in the results.',
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'Reproducibility Checklist',
        text: 'For every benchmark, publish: (1) the exact code or script used, (2) hardware configuration including GPU model, memory, and interconnect, (3) software versions for driver, CUDA, framework, and dependencies, (4) raw measurement data — not just summary statistics, (5) environment details including container image or Dockerfile.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Continuous Benchmarking in CI/CD',
      },
      {
        type: 'paragraph',
        text: 'Benchmarking should be integrated into the CI/CD pipeline as a continuous practice, not a one-time event. Performance regression detection catches optimizations that inadvertently slow other parts of the system. Trend tracking over time reveals the compounding effect of many small improvements or regressions.',
      },
      {
        type: 'code',
        language: 'yaml',
        code: '# Example: GitHub Actions benchmark workflow\nname: Performance Regression Check\non: [pull_request]\njobs:\n  benchmark:\n    runs-on: [self-hosted, gpu]\n    steps:\n      - uses: actions/checkout@v4\n      - name: Run benchmark suite\n        run: python benchmarks/run_all.py --output results.json\n      - name: Compare with baseline\n        run: python benchmarks/compare.py --baseline main --current results.json --threshold 5',
        caption: 'Example: Automated performance regression detection in CI/CD.',
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Regression Detection Thresholds',
        text: 'Set regression thresholds carefully. Too tight (e.g., 1%) triggers frequent false alarms from measurement noise. Too loose (e.g., 20%) misses real regressions. A 5% threshold with statistical significance testing is a reasonable starting point. Adjust based on your measurement variance.',
      },
    ],
    order: 4,
    keyConcepts: [
      { term: 'End-to-End Benchmark', definition: 'A benchmark that measures the complete system pipeline performance, including data loading, computation, and postprocessing.' },
      { term: 'Performance Regression', definition: 'An unintended decrease in system performance caused by a code or configuration change, detected through continuous benchmarking.' },
    ],
  },
];

export const glossary: GlossaryTerm[] = [
  { term: 'MLPerf', definition: 'The industry-standard benchmark suite for evaluating ML training and inference performance across hardware and software platforms.' },
  { term: 'Roofline Model', definition: 'A visual analysis framework for determining whether performance is limited by compute throughput or memory bandwidth.' },
  { term: 'Profiling', definition: 'Systematic measurement of resource utilization to identify performance bottlenecks in ML workloads.' },
  { term: 'Operational Intensity', definition: 'The ratio of computation (FLOPs) to data movement (bytes), determining whether a workload is compute-bound or memory-bound.' },
  { term: 'Throughput', definition: 'The total number of operations or predictions per unit time, a key metric for system performance evaluation.' },
  { term: 'Nsight', definition: 'NVIDIA\'s suite of GPU profiling and debugging tools for analyzing CUDA application performance.' },
];

export const keyTakeaways: string[] = [
  'MLPerf provides standardized benchmarks for fair comparison, but production workloads may differ significantly from benchmark workloads.',
  'Profiling is essential before optimization; without measurement, optimization is guesswork.',
  'The roofline model reveals whether each operation is compute-bound or memory-bound, directly guiding optimization strategy.',
  'Accurate benchmarking requires warmup runs, statistical rigor, controlled environments, and transparent reporting.',
  'Continuous benchmarking in CI/CD detects performance regressions and tracks optimization progress over time.',
];

export const learningObjectives: string[] = [
  'Explain the MLPerf benchmark suite and interpret training and inference benchmark results',
  'Apply profiling tools to identify performance bottlenecks across the ML stack',
  'Implement roofline analysis to classify operations as compute-bound or memory-bound',
  'Design rigorous benchmark experiments with proper warmup, statistical analysis, and controlled environments',
  'Evaluate the limitations of standard benchmarks and when custom benchmarks are necessary',
];
