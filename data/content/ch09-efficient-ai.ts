import type { ChapterSection, GlossaryTerm } from '~/types/chapter';

export const sections: ChapterSection[] = [
  {
    id: 'ch09-s1',
    heading: 'Computational Efficiency in ML',
    body: 'Computational efficiency is the practice of achieving the best possible model quality within a given resource budget. As ML models have grown exponentially in size, efficiency has become not just a nice-to-have but a critical requirement for practical deployment. The gap between what is computationally possible and what is economically feasible continues to widen.\n\nEfficiency can be measured along multiple dimensions: computational cost (FLOPs), memory footprint, inference latency, energy consumption, and monetary cost. These dimensions are related but not equivalent; a model with fewer FLOPs may still have higher latency due to memory bottleneck operations, and a model with lower energy consumption may cost more due to specialized hardware requirements.\n\nThe Pareto frontier of efficiency represents the set of models where no dimension can be improved without degrading another. The goal of efficient AI research is to push this frontier, finding designs that achieve better trade-offs than previously possible. Techniques span the entire pipeline from architecture design through training to deployment.\n\nEfficiency considerations must be incorporated from the earliest stages of system design, not bolted on as an afterthought. Designing for efficiency from the start leads to fundamentally different architectural choices than designing for accuracy alone and then compressing. This "efficiency-first" mindset is increasingly important as models scale and deployment targets diversify.',
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
