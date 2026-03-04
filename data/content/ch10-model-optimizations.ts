import type { ChapterSection, GlossaryTerm } from '~/types/chapter';

export const sections: ChapterSection[] = [
  {
    id: 'ch10-s1',
    heading: 'Quantization',
    body: 'Quantization reduces the numerical precision of model weights and activations from floating-point (typically FP32) to lower-bit representations (INT8, INT4, or even binary). This directly reduces model size, memory bandwidth requirements, and computational cost, while leveraging integer arithmetic units that are faster and more energy-efficient on most hardware.\n\nPost-training quantization (PTQ) converts a pre-trained FP32 model to lower precision without retraining. The simplest approach uniformly maps the FP32 value range to the target precision. More sophisticated methods like per-channel quantization and dynamic range adjustment minimize the accuracy impact. PTQ is attractive because it requires no additional training, but it can struggle with models that have wide activation ranges.\n\nQuantization-aware training (QAT) simulates quantization during training, allowing the model to adapt its weights to the constraints of lower precision. During training, fake quantization nodes insert quantization and dequantization operations in the forward pass while using straight-through estimators for gradients. QAT typically achieves better accuracy than PTQ, especially at very low bit widths.\n\nRecent advances in quantization for large language models have pushed the boundaries to 4-bit and even 2-bit precision. Techniques like GPTQ, AWQ, and SqueezeLLM use sophisticated calibration methods to maintain quality at extreme compression ratios. These methods have made it possible to run large language models on consumer hardware, democratizing access to powerful AI capabilities.',
    order: 0,
    keyConcepts: [
      { term: 'Quantization', definition: 'The process of reducing the numerical precision of model parameters and activations to lower bit widths, reducing model size and improving inference speed.' },
      { term: 'Quantization-Aware Training', definition: 'A training procedure that simulates quantization during training, enabling the model to learn representations that are robust to lower precision.' },
    ],
  },
  {
    id: 'ch10-s2',
    heading: 'Pruning',
    body: 'Pruning removes unnecessary parameters from neural networks, creating sparse models that require less computation and memory. The key insight is that neural networks are typically over-parameterized, and many weights contribute little to the output. Identifying and removing these redundant parameters can yield significant efficiency gains.\n\nUnstructured pruning removes individual weights based on magnitude or other criteria, creating irregular sparsity patterns. While this can achieve high compression ratios, the irregular memory access patterns make it difficult to accelerate on standard hardware. Specialized sparse computation libraries and hardware are needed to realize the theoretical speedups.\n\nStructured pruning removes entire neurons, channels, or attention heads, producing models that maintain dense computation patterns. This is more hardware-friendly because standard dense matrix operations can be used on the smaller model. Channel pruning for CNNs and head pruning for Transformers are the most common structured pruning approaches.\n\nThe Lottery Ticket Hypothesis, proposed by Frankle and Carlin, suggests that dense networks contain sparse subnetworks (winning tickets) that can achieve comparable accuracy when trained in isolation. This finding has profound implications for understanding why neural networks work and has inspired new approaches to training efficient models from the start.',
    order: 1,
    keyConcepts: [
      { term: 'Pruning', definition: 'The removal of unnecessary neural network parameters to create smaller, faster models while maintaining accuracy.' },
      { term: 'Lottery Ticket Hypothesis', definition: 'The theory that dense neural networks contain sparse subnetworks that, when trained in isolation from random initialization, can match the accuracy of the full network.' },
    ],
  },
  {
    id: 'ch10-s3',
    heading: 'Knowledge Distillation',
    body: 'Knowledge distillation transfers the learned representations from a large, complex teacher model to a smaller, more efficient student model. Rather than training the student directly on hard labels, distillation trains it to match the soft probability distributions produced by the teacher, which contain richer information about class relationships.\n\nThe standard distillation loss combines the student\'s cross-entropy loss on ground truth labels with a KL divergence loss between the teacher\'s and student\'s softened output distributions. The temperature parameter controls the softness of the distributions: higher temperatures produce softer distributions that transfer more information but may introduce noise.\n\nFeature-based distillation extends the concept by matching intermediate representations rather than just outputs. The student is trained to mimic the teacher\'s internal feature maps at selected layers. Attention transfer, which matches attention maps between teacher and student, is another popular variant for Transformer models.\n\nDistillation has become a critical technique in the large language model era. Models like DistilBERT achieve 97% of BERT\'s performance with 40% fewer parameters by distilling during pre-training. For deployment on resource-constrained devices, distillation provides a principled way to compress knowledge from models that are too large to serve directly.',
    order: 2,
    keyConcepts: [
      { term: 'Knowledge Distillation', definition: 'A model compression technique that trains a smaller student model to mimic the behavior of a larger teacher model, transferring learned representations.' },
      { term: 'Temperature Scaling', definition: 'A parameter in distillation that controls the softness of probability distributions, with higher temperatures revealing more information about class relationships.' },
    ],
  },
  {
    id: 'ch10-s4',
    heading: 'Operator Fusion and Graph Optimization',
    body: 'Operator fusion combines multiple sequential operations into a single fused kernel, reducing memory traffic and kernel launch overhead. For example, fusing a convolution, batch normalization, and ReLU activation into a single operation avoids writing and reading intermediate results from memory, significantly improving performance.\n\nGraph-level optimizations analyze the computational graph to identify fusion opportunities, eliminate redundant operations, and optimize memory allocation. Common optimizations include constant folding (pre-computing operations with known inputs), dead code elimination (removing unused computations), and layout transformations (converting data layouts for optimal hardware utilization).\n\nML compilers like TensorRT, Apache TVM, and XLA automate these optimizations for specific hardware targets. TensorRT, for example, can automatically fuse operations, select optimal kernel implementations, and apply quantization for NVIDIA GPUs. These compilers can achieve 2-5x speedup over naive framework execution.\n\nCustom kernel development using CUDA, Triton, or other low-level languages enables optimizations that are impossible at the graph level. Flash Attention is a prominent example: by rewriting attention as a single fused kernel that is aware of the GPU memory hierarchy, it achieves both lower memory usage and faster execution than the standard multi-operation implementation.',
    order: 3,
    keyConcepts: [
      { term: 'Operator Fusion', definition: 'The combination of multiple sequential neural network operations into a single computation kernel, reducing memory traffic and overhead.' },
      { term: 'TensorRT', definition: 'NVIDIA\'s deep learning inference optimizer and runtime that automatically applies graph optimizations, quantization, and kernel selection for GPU deployment.' },
    ],
  },
  {
    id: 'ch10-s5',
    heading: 'Combined Optimization Strategies',
    body: 'In practice, the most effective optimization pipelines combine multiple techniques rather than relying on a single approach. A typical pipeline might start with architecture-level efficiency (choosing an efficient base architecture), apply knowledge distillation during training, follow with quantization-aware training, and finish with operator fusion during deployment.\n\nThe order of optimization matters because techniques interact. Pruning before quantization is generally better than the reverse because pruning can remove parameters that would have caused quantization errors. Similarly, distillation-then-quantization typically outperforms quantization-then-distillation because the distilled model starts from a stronger quality baseline.\n\nMeasuring the compound effect of optimizations requires careful benchmarking on the target hardware. Theoretical speedup predictions (e.g., "4x from INT8 quantization") rarely match real-world measurements due to memory bottlenecks, kernel launch overhead, and data loading constraints. End-to-end profiling on the target device is essential.\n\nThe choice of optimization strategy depends on the deployment scenario. For cloud serving with GPU access, operator fusion and FP16/INT8 quantization are usually sufficient. For mobile deployment, aggressive quantization and pruning may be needed. For microcontrollers, extreme optimization including binary quantization and specialized architectures may be necessary to meet the harsh resource constraints.',
    order: 4,
    keyConcepts: [
      { term: 'Optimization Pipeline', definition: 'A systematic sequence of complementary model optimization techniques applied in a specific order to maximize cumulative efficiency gains.' },
      { term: 'End-to-End Profiling', definition: 'Measuring the complete inference time on target hardware, including all preprocessing, computation, and postprocessing, to accurately assess optimization impact.' },
    ],
  },
];

export const glossary: GlossaryTerm[] = [
  { term: 'Quantization', definition: 'Reducing numerical precision of model parameters to lower bit widths (e.g., FP32 to INT8) to decrease size and increase speed.' },
  { term: 'Pruning', definition: 'Removing unnecessary neural network parameters to create sparse, more efficient models.' },
  { term: 'Knowledge Distillation', definition: 'Training a smaller student model to replicate the behavior of a larger teacher model.' },
  { term: 'Operator Fusion', definition: 'Combining multiple sequential operations into a single kernel to reduce memory traffic and overhead.' },
  { term: 'Post-Training Quantization', definition: 'Applying quantization to an already-trained model without additional training, a simple but potentially less accurate approach.' },
  { term: 'Structured Pruning', definition: 'Removing entire groups of parameters (channels, heads) rather than individual weights, maintaining hardware-friendly dense computations.' },
  { term: 'GPTQ', definition: 'A quantization method for large language models that uses approximate second-order information for optimal weight rounding.' },
];

export const keyTakeaways: string[] = [
  'Quantization to INT8 can achieve near-lossless compression with 4x size reduction and significant speedup on hardware with integer units.',
  'Structured pruning is more hardware-friendly than unstructured pruning, though unstructured pruning achieves higher compression ratios.',
  'Knowledge distillation transfers rich information through soft probability distributions, not just hard label predictions.',
  'Operator fusion can provide 2-5x speedups by reducing memory traffic between sequential operations.',
  'Combined optimization pipelines achieve better results than any single technique, but the order of application matters.',
  'Always benchmark optimizations end-to-end on target hardware, as theoretical speedups rarely match real-world measurements.',
];
