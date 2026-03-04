import type { ChapterSection, GlossaryTerm } from '@/types/chapter';

export const sections: ChapterSection[] = [
  {
    id: 'ch12-s1',
    heading: 'MLPerf and Standard Benchmarks',
    body: 'MLPerf is the industry-standard benchmark suite for measuring ML system performance. Developed by a consortium of industry and academic organizations, MLPerf provides standardized workloads, datasets, and measurement rules that enable fair comparison across different hardware platforms, frameworks, and system configurations.\n\nMLPerf includes separate benchmark suites for training and inference. The training benchmarks measure time-to-train for workloads spanning image classification (ResNet-50), object detection (SSD, RetinaNet), natural language processing (BERT), recommendation (DLRM), and reinforcement learning. The inference benchmarks measure throughput and latency across similar workloads under different scenarios (server, offline, single-stream).\n\nStandardized benchmarks serve a critical role in the ML ecosystem by providing objective comparison points. However, they also have limitations. Benchmark workloads may not represent actual production workloads. Optimizations specific to benchmark rules may not generalize. And the competitive pressure to achieve top benchmark results can distort engineering priorities.\n\nBeyond MLPerf, domain-specific benchmarks serve particular needs. DAWNBench focuses on training cost efficiency. DeepBench isolates individual operation performance. Application-specific benchmarks in areas like autonomous driving, medical imaging, and natural language understanding provide more relevant metrics for practitioners in those domains.',
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
