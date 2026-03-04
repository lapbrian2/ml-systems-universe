import type { ChapterSection, GlossaryTerm } from '~/types/chapter';

export const sections: ChapterSection[] = [
  {
    id: 'ch09-s1',
    heading: 'Computational Efficiency in ML',
    body: 'Computational efficiency is the practice of achieving the best possible model quality within a given resource budget. As ML models have grown exponentially in size, efficiency has become not just a nice-to-have but a critical requirement for practical deployment. The gap between what is computationally possible and what is economically feasible continues to widen.\n\nEfficiency can be measured along multiple dimensions: computational cost (FLOPs), memory footprint, inference latency, energy consumption, and monetary cost. These dimensions are related but not equivalent; a model with fewer FLOPs may still have higher latency due to memory bottleneck operations, and a model with lower energy consumption may cost more due to specialized hardware requirements.\n\nThe Pareto frontier of efficiency represents the set of models where no dimension can be improved without degrading another. The goal of efficient AI research is to push this frontier, finding designs that achieve better trade-offs than previously possible. Techniques span the entire pipeline from architecture design through training to deployment.\n\nEfficiency considerations must be incorporated from the earliest stages of system design, not bolted on as an afterthought. Designing for efficiency from the start leads to fundamentally different architectural choices than designing for accuracy alone and then compressing. This "efficiency-first" mindset is increasingly important as models scale and deployment targets diversify.',
    blocks: [
      {
        type: 'paragraph',
        text: 'Computational efficiency is the practice of achieving the best possible model quality within a given resource budget. As ML models have grown exponentially in size, efficiency has become not just a nice-to-have but a critical requirement for practical deployment. The gap between what is computationally possible and what is economically feasible continues to widen.',
      },
      {
        type: 'definition',
        term: 'Computational Efficiency',
        definition: 'The practice of maximizing model quality relative to consumed resources. Efficiency is multidimensional, spanning FLOPs, memory footprint, inference latency, energy consumption, and monetary cost. Improving efficiency means pushing the Pareto frontier of these trade-offs.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Dimensions of Efficiency',
      },
      {
        type: 'paragraph',
        text: 'Efficiency can be measured along multiple dimensions: computational cost (FLOPs), memory footprint, inference latency, energy consumption, and monetary cost. These dimensions are related but not equivalent; a model with fewer FLOPs may still have higher latency due to memory bottleneck operations, and a model with lower energy consumption may cost more due to specialized hardware requirements.',
      },
      {
        type: 'table',
        headers: ['Dimension', 'Metric', 'What It Captures', 'Limitation'],
        rows: [
          ['Computational cost', 'FLOPs', 'Total arithmetic operations', 'Ignores memory bandwidth and parallelism'],
          ['Memory footprint', 'Peak MB/GB', 'Maximum memory required', 'Doesn\'t reflect bandwidth utilization'],
          ['Inference latency', 'Milliseconds', 'Time for a single prediction', 'Varies by batch size and hardware'],
          ['Energy consumption', 'Joules per inference', 'Power cost per prediction', 'Hard to measure, hardware-dependent'],
          ['Monetary cost', '$/1K inferences', 'Dollar cost of serving', 'Depends on cloud pricing and utilization'],
        ],
        caption: 'Table 9.1: The five key dimensions of ML efficiency.',
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'FLOPs Are Not Latency',
        text: 'A common mistake is equating fewer FLOPs with faster inference. A depthwise separable convolution has far fewer FLOPs than a standard convolution, but it has lower arithmetic intensity and may be memory-bandwidth-bound on GPUs. Always measure actual latency on target hardware rather than relying solely on FLOP counts.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'The Pareto Frontier',
      },
      {
        type: 'paragraph',
        text: 'The Pareto frontier of efficiency represents the set of models where no dimension can be improved without degrading another. The goal of efficient AI research is to push this frontier, finding designs that achieve better trade-offs than previously possible. Techniques span the entire pipeline from architecture design through training to deployment.',
      },
      {
        type: 'definition',
        term: 'Pareto Frontier',
        definition: 'The set of optimal designs where no efficiency dimension (accuracy, latency, memory, cost) can be improved without degrading at least one other dimension. Models on the frontier represent the best achievable trade-offs given current techniques.',
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'Design for Efficiency from Day One',
        text: 'Efficiency considerations must be incorporated from the earliest stages of system design, not bolted on as an afterthought. Designing for efficiency from the start leads to fundamentally different architectural choices than designing for accuracy alone and then compressing. Ask "what hardware will this model run on?" before choosing an architecture.',
      },
      {
        type: 'callout',
        variant: 'note',
        title: 'The Exponential Cost of Scale',
        text: 'Training costs for frontier models have increased roughly 10x per year. GPT-3 (2020) cost an estimated $4.6M to train. GPT-4 (2023) reportedly cost over $100M. This trajectory is unsustainable without fundamental efficiency improvements, making this chapter\'s techniques critically important for the future of AI.',
      },
    ],
    order: 0,
    keyConcepts: [
      { term: 'Computational Efficiency', definition: 'The practice of maximizing model quality relative to resource consumption across dimensions like FLOPs, memory, latency, and energy.' },
      { term: 'Pareto Frontier', definition: 'The set of optimal designs where no efficiency dimension can be improved without degrading another, representing the best achievable trade-offs.' },
    ],
  },
  {
    id: 'ch09-s2',
    heading: 'Efficient Model Design',
    body: 'Efficient model design builds efficiency into the architecture from the ground up rather than compressing an existing model. This approach often yields better accuracy-efficiency trade-offs because the architecture is optimized holistically rather than having efficiency applied as a post-processing step.\n\nMobileNets pioneered efficient architecture design for mobile devices by replacing standard convolutions with depthwise separable convolutions. MobileNetV2 introduced inverted residual blocks with linear bottlenecks. MobileNetV3 combined these with hardware-aware NAS to achieve state-of-the-art mobile efficiency.\n\nEfficientNet demonstrated that balanced scaling of depth, width, and resolution through compound scaling consistently outperforms scaling along a single dimension. The EfficientNet family achieved better accuracy than previous architectures at much lower computational cost, establishing a new accuracy-efficiency baseline.\n\nFor Transformer models, efficiency improvements focus on reducing the quadratic cost of self-attention. Efficient attention variants like Linformer, Performer, and Flash Attention reduce memory and computation through low-rank approximations, kernel methods, and memory-efficient implementations respectively. Flash Attention, in particular, has become standard practice by exploiting GPU memory hierarchy to reduce both memory usage and wall-clock time.',
    blocks: [
      {
        type: 'paragraph',
        text: 'Efficient model design builds efficiency into the architecture from the ground up rather than compressing an existing model. This approach often yields better accuracy-efficiency trade-offs because the architecture is optimized holistically rather than having efficiency applied as a post-processing step.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'MobileNets: Efficient Convolutions',
      },
      {
        type: 'paragraph',
        text: 'MobileNets pioneered efficient architecture design for mobile devices by replacing standard convolutions with depthwise separable convolutions. MobileNetV2 introduced inverted residual blocks with linear bottlenecks. MobileNetV3 combined these with hardware-aware NAS to achieve state-of-the-art mobile efficiency.',
      },
      {
        type: 'definition',
        term: 'Depthwise Separable Convolution',
        definition: 'A factorized convolution that splits a standard convolution into two steps: a depthwise convolution (one filter per input channel for spatial filtering) followed by a 1x1 pointwise convolution (for channel mixing). This reduces computation by a factor of roughly k^2 compared to standard convolutions, where k is the kernel size.',
      },
      {
        type: 'equation',
        latex: '\\text{Cost ratio} = \\frac{\\text{Depthwise Separable}}{\\text{Standard}} = \\frac{1}{C_{\\text{out}}} + \\frac{1}{k^2}',
        label: 'Equation 9.1: Depthwise separable convolutions reduce cost by approximately 1/k^2 for large output channel counts.',
      },
      {
        type: 'callout',
        variant: 'example',
        title: 'MobileNet Cost Savings',
        text: 'A 3x3 standard convolution with 256 input and 256 output channels on a 14x14 feature map requires 924M FLOPs. The equivalent depthwise separable convolution requires only 105M FLOPs — an 8.8x reduction. MobileNetV2 achieves 72% ImageNet accuracy at just 300M FLOPs, compared to ResNet-50 at 4,100M FLOPs (76% accuracy).',
      },
      {
        type: 'heading',
        level: 3,
        text: 'EfficientNet: Compound Scaling',
      },
      {
        type: 'paragraph',
        text: 'EfficientNet demonstrated that balanced scaling of depth, width, and resolution through compound scaling consistently outperforms scaling along a single dimension. The EfficientNet family achieved better accuracy than previous architectures at much lower computational cost, establishing a new accuracy-efficiency baseline.',
      },
      {
        type: 'equation',
        latex: 'd = \\alpha^\\phi, \\quad w = \\beta^\\phi, \\quad r = \\gamma^\\phi \\quad \\text{s.t.} \\quad \\alpha \\cdot \\beta^2 \\cdot \\gamma^2 \\approx 2',
        label: 'Equation 9.2: EfficientNet compound scaling — depth (d), width (w), and resolution (r) scale together with coefficient phi.',
      },
      {
        type: 'callout',
        variant: 'note',
        title: 'Why Compound Scaling Works',
        text: 'Scaling only depth creates vanishing gradient problems. Scaling only width leads to diminishing returns at large widths. Scaling only resolution increases FLOPs quadratically. Compound scaling balances all three dimensions, ensuring that each additional unit of compute is spent where it provides the most accuracy gain.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Efficient Attention for Transformers',
      },
      {
        type: 'paragraph',
        text: 'For Transformer models, efficiency improvements focus on reducing the quadratic cost of self-attention. Efficient attention variants reduce memory and computation through different approaches.',
      },
      {
        type: 'table',
        headers: ['Method', 'Approach', 'Time Complexity', 'Memory Complexity'],
        rows: [
          ['Standard Attention', 'Full N x N attention matrix', 'O(n^2 d)', 'O(n^2)'],
          ['Linformer', 'Low-rank projection of K, V', 'O(n k d)', 'O(n k)'],
          ['Performer', 'Kernel approximation (FAVOR+)', 'O(n d^2)', 'O(n d)'],
          ['Flash Attention', 'Tiled IO-aware computation', 'O(n^2 d)', 'O(n)'],
          ['Multi-Query Attention', 'Shared K, V heads', 'O(n^2 d)', 'O(n^2) but less memory for KV cache'],
        ],
        caption: 'Table 9.2: Efficient attention variants and their complexity profiles.',
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'Flash Attention Is Now Standard',
        text: 'Flash Attention does not change the mathematical output of attention — it produces the exact same result. It achieves its speedup by tiling the computation to minimize GPU HBM reads/writes, exploiting the much faster on-chip SRAM. Because it is mathematically equivalent and strictly better in both speed and memory, Flash Attention should be the default choice for all Transformer training and inference.',
      },
    ],
    order: 1,
    keyConcepts: [
      { term: 'MobileNet', definition: 'A family of efficient CNN architectures designed for mobile and edge devices, using depthwise separable convolutions to reduce computation.' },
      { term: 'Flash Attention', definition: 'A memory-efficient attention implementation that reduces memory usage from O(n^2) to O(n) by tiling computations to exploit GPU SRAM.' },
    ],
  },
  {
    id: 'ch09-s3',
    heading: 'Resource Constraints and Budget Analysis',
    body: 'Real-world ML deployments face resource constraints that vary dramatically depending on the target platform. Cloud deployments may have generous compute budgets but face cost optimization pressure. Mobile deployments are constrained by battery life and thermal limits. Edge deployments on microcontrollers may have only hundreds of kilobytes of memory.\n\nResource budget analysis quantifies the constraints that a model must satisfy. This includes peak memory (the maximum memory required at any point during inference), compute budget (total FLOPs per inference), latency budget (maximum acceptable response time), and energy budget (maximum energy per inference). These budgets define the feasible region for model selection.\n\nThe roofline model provides a framework for understanding whether a model is compute-bound or memory-bound on a given hardware platform. By plotting operational intensity (FLOPs per byte of memory access) against achieved throughput, the roofline model reveals whether optimization should focus on reducing computation or improving memory access patterns.\n\nCost analysis must consider the full lifecycle: training cost, serving cost, and the engineering cost of optimization. A model that is 10% more efficient to serve but requires 3x the engineering effort to optimize may not be worthwhile unless the deployment scale is large enough to justify the investment. This economic analysis is a critical but often overlooked aspect of efficiency engineering.',
    blocks: [
      {
        type: 'paragraph',
        text: 'Real-world ML deployments face resource constraints that vary dramatically depending on the target platform. Cloud deployments may have generous compute budgets but face cost optimization pressure. Mobile deployments are constrained by battery life and thermal limits. Edge deployments on microcontrollers may have only hundreds of kilobytes of memory.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Resource Budget Analysis',
      },
      {
        type: 'paragraph',
        text: 'Resource budget analysis quantifies the constraints that a model must satisfy. This includes peak memory (the maximum memory required at any point during inference), compute budget (total FLOPs per inference), latency budget (maximum acceptable response time), and energy budget (maximum energy per inference). These budgets define the feasible region for model selection.',
      },
      {
        type: 'table',
        headers: ['Deployment Target', 'Latency Budget', 'Memory Budget', 'Power Budget', 'Example Model'],
        rows: [
          ['Cloud (batch)', '100s of ms', '16-80 GB (GPU)', '200-300 W', 'LLaMA 70B on A100'],
          ['Cloud (real-time)', '<50 ms', '8-16 GB', '200-300 W', 'BERT-base for search'],
          ['Mobile', '<30 ms', '2-4 GB', '3-5 W', 'MobileNetV3 for camera'],
          ['Edge / IoT', '<10 ms', '256 KB - 4 MB', '1-100 mW', 'TinyML keyword detection'],
          ['Browser (WASM)', '<100 ms', '100-500 MB', 'N/A (user device)', 'MediaPipe hand tracking'],
        ],
        caption: 'Table 9.3: Resource budgets across common deployment targets.',
      },
      {
        type: 'definition',
        term: 'Resource Budget',
        definition: 'A quantified set of constraints that a deployed model must satisfy, typically including peak memory, compute (FLOPs), latency, energy, and monetary cost per inference. The budget defines the feasible region within which a model must operate on the target platform.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'The Roofline Model',
      },
      {
        type: 'paragraph',
        text: 'The roofline model provides a framework for understanding whether a model is compute-bound or memory-bound on a given hardware platform. By plotting operational intensity (FLOPs per byte of memory access) against achieved throughput, the roofline model reveals whether optimization should focus on reducing computation or improving memory access patterns.',
      },
      {
        type: 'definition',
        term: 'Roofline Model',
        definition: 'A visual performance model that plots achieved throughput (FLOP/s) against operational intensity (FLOPs per byte of memory transferred). The "roof" is formed by the hardware\'s peak compute (flat ceiling) and peak memory bandwidth (sloped line). A workload below the roof is either compute-bound or memory-bound depending on which ceiling it hits.',
      },
      {
        type: 'equation',
        latex: '\\text{Attainable FLOP/s} = \\min\\left(\\text{Peak FLOP/s},\\; \\text{Bandwidth} \\times \\text{Operational Intensity}\\right)',
        label: 'Equation 9.3: The roofline model — achievable performance is the minimum of compute peak and bandwidth-limited throughput.',
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'Using the Roofline in Practice',
        text: 'If your model sits on the sloped (memory-bound) portion of the roofline, reducing FLOPs won\'t help — you need to reduce memory traffic (via operator fusion, quantization, or increased batch size). If it sits on the flat (compute-bound) ceiling, reducing FLOPs directly reduces latency. Profile your model with tools like NVIDIA Nsight Compute or PyTorch Profiler to determine where you stand.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Full Lifecycle Cost Analysis',
      },
      {
        type: 'paragraph',
        text: 'Cost analysis must consider the full lifecycle: training cost, serving cost, and the engineering cost of optimization. A model that is 10% more efficient to serve but requires 3x the engineering effort to optimize may not be worthwhile unless the deployment scale is large enough to justify the investment.',
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Premature Optimization',
        text: 'Don\'t optimize for efficiency before you have validated that the model solves the right problem. A perfectly optimized model that solves the wrong problem has zero value. First validate accuracy and product-market fit with an unoptimized model, then invest in efficiency as serving costs become material.',
      },
    ],
    order: 2,
    keyConcepts: [
      { term: 'Roofline Model', definition: 'An analytical performance model that shows the achievable throughput as a function of operational intensity, revealing whether computation is memory-bound or compute-bound.' },
      { term: 'Operational Intensity', definition: 'The ratio of floating-point operations to bytes of memory accessed, determining whether a workload is limited by compute or memory bandwidth.' },
    ],
  },
  {
    id: 'ch09-s4',
    heading: 'FLOPs Analysis and Complexity',
    body: 'FLOPs (floating-point operations) provide a hardware-independent measure of computational cost that enables comparison across different models and architectures. Understanding FLOPs complexity is essential for predicting inference time, training cost, and energy consumption.\n\nFor fully connected layers, the FLOPs count is straightforward: 2 * input_size * output_size (one multiply and one add per operation). For convolutional layers, FLOPs depend on kernel size, input dimensions, and number of channels. For Transformer self-attention, FLOPs scale quadratically with sequence length: 2 * n^2 * d for attention computation.\n\nHowever, FLOPs are an imperfect proxy for actual performance. Memory bandwidth, operation scheduling, and hardware utilization all affect real-world speed. A model with fewer FLOPs may actually be slower if it uses operations that are poorly supported by the target hardware or has irregular memory access patterns.\n\nMACs (multiply-accumulate operations) are an alternative measure that counts each multiply-add pair as a single operation, resulting in values roughly half the FLOP count. When comparing published efficiency numbers, it is important to verify whether the metric is FLOPs or MACs, as confusion between the two can lead to 2x errors in reported efficiency.',
    blocks: [
      {
        type: 'paragraph',
        text: 'FLOPs (floating-point operations) provide a hardware-independent measure of computational cost that enables comparison across different models and architectures. Understanding FLOPs complexity is essential for predicting inference time, training cost, and energy consumption.',
      },
      {
        type: 'definition',
        term: 'FLOPs (Floating-Point Operations)',
        definition: 'A hardware-independent count of arithmetic operations (additions and multiplications) required to execute a computation. FLOPs enable comparing model efficiency across different architectures without reference to specific hardware. Note: "FLOP/s" (with lowercase s) refers to operations per second, a throughput metric.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'FLOPs by Layer Type',
      },
      {
        type: 'paragraph',
        text: 'For fully connected layers, the FLOPs count is straightforward: 2 * input_size * output_size (one multiply and one add per operation). For convolutional layers, FLOPs depend on kernel size, input dimensions, and number of channels. For Transformer self-attention, FLOPs scale quadratically with sequence length.',
      },
      {
        type: 'table',
        headers: ['Layer Type', 'FLOPs Formula', 'Scaling'],
        rows: [
          ['Fully Connected', '2 * C_in * C_out', 'Linear in dimensions'],
          ['Convolution (k x k)', '2 * k^2 * C_in * C_out * H_out * W_out', 'Linear in spatial size, quadratic in kernel size'],
          ['Self-Attention', '2 * n^2 * d + 2 * n * d^2', 'Quadratic in sequence length n'],
          ['Depthwise Conv (k x k)', '2 * k^2 * C * H_out * W_out', 'Linear in channels (no cross-channel)'],
        ],
        caption: 'Table 9.4: FLOPs formulas for common neural network layers.',
      },
      {
        type: 'equation',
        latex: '\\text{FLOPs}_{\\text{attention}} = 2n^2d + 2nd^2 = 2nd(n + d)',
        label: 'Equation 9.4: Self-attention FLOPs — the n^2 term dominates for long sequences, the d^2 term dominates for short sequences.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Why FLOPs Are an Imperfect Proxy',
      },
      {
        type: 'paragraph',
        text: 'However, FLOPs are an imperfect proxy for actual performance. Memory bandwidth, operation scheduling, and hardware utilization all affect real-world speed. A model with fewer FLOPs may actually be slower if it uses operations that are poorly supported by the target hardware or has irregular memory access patterns.',
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'The FLOPs-Latency Gap',
        text: 'Consider: a standard convolution has more FLOPs than a depthwise separable convolution, yet on GPUs the depthwise version can be slower because it has lower arithmetic intensity and underutilizes tensor cores. Similarly, operations like gather, scatter, and non-maximum suppression have few FLOPs but high latency due to irregular memory access. Always measure real latency on target hardware.',
      },
      {
        type: 'callout',
        variant: 'example',
        title: 'FLOPs vs. Real-World Speed',
        text: 'EfficientNet-B0 has 390M FLOPs and achieves 77.1% ImageNet accuracy. RegNetY-400M also has ~400M FLOPs and achieves 74.1% accuracy. But on an NVIDIA V100 GPU, RegNet runs 3x faster because its regular structure maps better to GPU parallelism. FLOPs are the same, but throughput differs dramatically.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'FLOPs vs. MACs',
      },
      {
        type: 'paragraph',
        text: 'MACs (multiply-accumulate operations) are an alternative measure that counts each multiply-add pair as a single operation, resulting in values roughly half the FLOP count. When comparing published efficiency numbers, it is important to verify whether the metric is FLOPs or MACs, as confusion between the two can lead to 2x errors in reported efficiency.',
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'Always Check the Unit',
        text: 'When reading a paper that claims "X GFLOPs," verify whether they mean FLOPs or MACs. Some papers use "FLOPs" to mean MACs, leading to a 2x discrepancy. The safest approach is to compute FLOPs yourself using tools like torchprofile, fvcore, or ptflops, and to always state your convention explicitly.',
      },
    ],
    order: 3,
    keyConcepts: [
      { term: 'FLOPs', definition: 'Floating-point operations per second or total count, a hardware-independent measure of computational cost for comparing model efficiency.' },
      { term: 'MACs', definition: 'Multiply-accumulate operations, counting each fused multiply-add as one operation; approximately half the FLOP count for the same computation.' },
    ],
  },
  {
    id: 'ch09-s5',
    heading: 'Efficient Training Strategies',
    body: 'Training efficiency is as important as inference efficiency, especially for large models where training costs can reach millions of dollars. Efficient training strategies reduce the time, compute, and energy required to reach a target model quality.\n\nTransfer learning and fine-tuning are among the most effective efficiency strategies. Starting from a pre-trained model and fine-tuning on the target task requires far less data and compute than training from scratch. Foundation models have made this approach dominant: most practitioners now start from pre-trained checkpoints rather than random initialization.\n\nProgressive training starts with a smaller model or lower resolution and gradually increases capacity during training. This approach trains faster because early learning happens on a cheaper model, and complexity is added only when needed. Progressive resizing for image models and progressive layer unfreezing for language models are common instantiations.\n\nCurriculum learning orders training examples from easy to hard, mimicking how humans learn. By presenting simpler examples first, the model develops basic representations before tackling difficult cases. Combined with data filtering to remove noisy or redundant examples, curriculum learning can achieve the same accuracy with significantly less compute.',
    blocks: [
      {
        type: 'paragraph',
        text: 'Training efficiency is as important as inference efficiency, especially for large models where training costs can reach millions of dollars. Efficient training strategies reduce the time, compute, and energy required to reach a target model quality.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Transfer Learning and Fine-Tuning',
      },
      {
        type: 'paragraph',
        text: 'Transfer learning and fine-tuning are among the most effective efficiency strategies. Starting from a pre-trained model and fine-tuning on the target task requires far less data and compute than training from scratch. Foundation models have made this approach dominant: most practitioners now start from pre-trained checkpoints rather than random initialization.',
      },
      {
        type: 'definition',
        term: 'Transfer Learning',
        definition: 'The practice of reusing a model\'s learned representations from one task (typically a large-scale pretraining task) as the starting point for a different target task. This dramatically reduces both the data and compute needed to achieve good performance on the target task, because the model starts with useful features rather than random weights.',
      },
      {
        type: 'callout',
        variant: 'note',
        title: 'The Foundation Model Paradigm',
        text: 'Transfer learning has evolved into the foundation model paradigm: train one large model on a massive, general dataset (e.g., all of the internet), then fine-tune it for thousands of specific tasks. This is radically more efficient than training a separate model from scratch for each task. A single GPT-4 training run, amortized across millions of downstream applications, is far cheaper per application than individual training.',
      },
      {
        type: 'table',
        headers: ['Strategy', 'Training Cost', 'Data Required', 'When to Use'],
        rows: [
          ['Train from scratch', '100% (baseline)', 'Large dataset', 'Novel domain with no relevant pre-trained model'],
          ['Fine-tune all layers', '5-20%', 'Moderate dataset', 'Target task differs significantly from pretraining'],
          ['Fine-tune last layers', '1-5%', 'Small dataset', 'Target task is similar to pretraining task'],
          ['LoRA / Adapters', '<1%', 'Small dataset', 'Resource-constrained fine-tuning of large models'],
          ['Prompt tuning', '<0.1%', 'Few examples', 'Very large models, minimal compute available'],
        ],
        caption: 'Table 9.5: Training efficiency strategies ordered by cost and data requirements.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Progressive Training',
      },
      {
        type: 'paragraph',
        text: 'Progressive training starts with a smaller model or lower resolution and gradually increases capacity during training. This approach trains faster because early learning happens on a cheaper model, and complexity is added only when needed. Progressive resizing for image models and progressive layer unfreezing for language models are common instantiations.',
      },
      {
        type: 'callout',
        variant: 'example',
        title: 'Progressive Resizing',
        text: 'Training an image classifier: start at 64x64 resolution for the first 30% of epochs, increase to 128x128 for the next 30%, then train at full 224x224 resolution for the final 40%. The low-resolution phases are 4-16x cheaper per step. Overall training time drops by 40-60% with negligible accuracy loss, because early training mostly learns coarse features that don\'t require high resolution.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Curriculum Learning',
      },
      {
        type: 'paragraph',
        text: 'Curriculum learning orders training examples from easy to hard, mimicking how humans learn. By presenting simpler examples first, the model develops basic representations before tackling difficult cases. Combined with data filtering to remove noisy or redundant examples, curriculum learning can achieve the same accuracy with significantly less compute.',
      },
      {
        type: 'definition',
        term: 'Curriculum Learning',
        definition: 'A training strategy that presents examples in a meaningful order, typically from easy to hard. The "difficulty" can be measured by loss magnitude, prediction confidence, or data complexity metrics. This mirrors pedagogical practice: master fundamentals before advanced topics.',
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'Data Pruning for Efficiency',
        text: 'Not all training data contributes equally to model quality. Studies show that training on a carefully selected 50% subset of the data can match the accuracy of training on the full dataset. Use techniques like influence functions, data Shapley values, or simple heuristics (remove near-duplicates and low-confidence examples) to identify the most valuable training examples.',
      },
    ],
    order: 4,
    keyConcepts: [
      { term: 'Transfer Learning', definition: 'The practice of reusing a model trained on one task as the starting point for training on a different but related task, dramatically reducing required data and compute.' },
      { term: 'Curriculum Learning', definition: 'A training strategy that presents examples in order of increasing difficulty, improving training efficiency and sometimes final model quality.' },
    ],
  },
];

export const glossary: GlossaryTerm[] = [
  { term: 'FLOPs', definition: 'Floating-point operations, a hardware-independent measure of computational cost used to compare model efficiency.' },
  { term: 'Roofline Model', definition: 'A visual performance model that shows whether a workload is limited by compute throughput or memory bandwidth.' },
  { term: 'Transfer Learning', definition: 'Reusing knowledge from a pre-trained model as the starting point for a new task, reducing training requirements.' },
  { term: 'Depthwise Separable Convolution', definition: 'A factorized convolution operation that reduces computation by separating spatial filtering from channel mixing.' },
  { term: 'Flash Attention', definition: 'An IO-aware attention algorithm that reduces memory usage by tiling computation to minimize reads from GPU high-bandwidth memory.' },
  { term: 'Compound Scaling', definition: 'A method for scaling neural network depth, width, and resolution simultaneously using a fixed ratio.' },
];

export const keyTakeaways: string[] = [
  'Efficiency must be designed in from the start, not bolted on as an afterthought through post-training compression.',
  'FLOPs are a useful but imperfect measure of efficiency; actual performance depends on memory access patterns and hardware utilization.',
  'The roofline model reveals whether inference is compute-bound or memory-bound, guiding optimization strategy.',
  'Transfer learning from pre-trained models is the most effective efficiency strategy for most practical applications.',
  'Resource budget analysis must consider the full lifecycle cost, including training, serving, and engineering effort.',
];

export const learningObjectives: string[] = [
  'Analyze the five dimensions of ML efficiency: FLOPs, memory, latency, energy, and monetary cost',
  'Apply the roofline model to determine whether an operation is compute-bound or memory-bound',
  'Evaluate efficient model design strategies including transfer learning and architecture search',
  'Compare resource budget trade-offs across training, inference, and full lifecycle costs',
  'Design an efficiency-first ML system that meets target quality within a given resource budget',
];
