import type { ChapterSection, GlossaryTerm } from '~/types/chapter';

export const sections: ChapterSection[] = [
  {
    id: 'ch08-s1',
    heading: 'Distributed Training Fundamentals',
    body: 'As models grow larger and datasets expand, training on a single accelerator becomes impractical. Distributed training splits the workload across multiple devices, potentially across multiple machines, to reduce training time from weeks to hours. Understanding distributed training is essential for any engineer working with modern large-scale ML systems.\n\nThe fundamental challenge of distributed training is maintaining the mathematical equivalence of optimization while dividing work across devices. Communication overhead between devices, synchronization strategies, and fault tolerance all add complexity that does not exist in single-device training.\n\nDistributed training introduces new failure modes that single-device training does not have. Network partitions, device failures, stragglers (slow devices), and communication deadlocks can all disrupt training. Production distributed training systems must handle these failures gracefully, typically through checkpointing and automatic restart mechanisms.\n\nThe choice of distribution strategy depends on model size, data volume, hardware topology, and network bandwidth. Data parallelism is the simplest and most common approach, but larger models may require model parallelism, pipeline parallelism, or hybrid strategies. Understanding when to use each approach is a critical skill for ML systems engineers.',
    order: 0,
    keyConcepts: [
      { term: 'Distributed Training', definition: 'Training a model across multiple accelerators or machines to reduce total training time by parallelizing computation.' },
      { term: 'Straggler Problem', definition: 'The performance degradation caused by the slowest device in a distributed training setup, which forces all other devices to wait during synchronization.' },
    ],
  },
  {
    id: 'ch08-s2',
    heading: 'Data Parallelism',
    body: 'Data parallelism is the most common distributed training strategy, where each device holds a complete copy of the model and processes a different subset of the training data. After computing local gradients, devices synchronize by aggregating (typically averaging) their gradients before updating model parameters.\n\nSynchronous data parallelism uses an all-reduce operation to aggregate gradients from all devices before any device updates its parameters. This maintains mathematical equivalence with single-device training (up to floating-point precision) and is the default approach in most frameworks. The all-reduce operation can be implemented using ring all-reduce, which achieves optimal bandwidth utilization.\n\nAsynchronous data parallelism allows devices to update parameters independently without waiting for all gradients to arrive. This eliminates the synchronization bottleneck but introduces gradient staleness, where devices may use slightly outdated parameters. Asynchronous methods converge faster in wall-clock time for some problems but can be less stable and harder to reproduce.\n\nScaling data parallelism effectively requires careful attention to the relationship between batch size and learning rate. The linear scaling rule suggests increasing the learning rate proportionally to the number of devices, but this breaks down at very large batch sizes. Techniques like learning rate warmup and LARS/LAMB optimizers enable stable training with very large effective batch sizes across hundreds of devices.',
    order: 1,
    keyConcepts: [
      { term: 'Data Parallelism', definition: 'A distributed training strategy where each device holds a full model copy and processes different data subsets, synchronizing gradients across devices.' },
      { term: 'All-Reduce', definition: 'A collective communication operation that aggregates values from all devices and distributes the result back to all devices, commonly used for gradient synchronization.' },
    ],
  },
  {
    id: 'ch08-s3',
    heading: 'Model Parallelism and Pipeline Parallelism',
    body: 'When a model is too large to fit in a single device\'s memory, model parallelism distributes different parts of the model across devices. Tensor parallelism splits individual layers across devices, while pipeline parallelism assigns different layers to different devices. Both approaches are essential for training the largest foundation models.\n\nTensor parallelism partitions weight matrices across devices and uses collective communication to combine partial results. For Transformer models, the attention and feed-forward layers can be split across devices along specific dimensions. Megatron-LM popularized efficient tensor parallelism strategies for large language models.\n\nPipeline parallelism assigns sequential groups of layers to different devices, creating a pipeline where micro-batches flow through devices in sequence. GPipe and PipeDream introduced techniques to reduce the "pipeline bubble" (idle time when devices wait for data), including micro-batch interleaving and asynchronous scheduling.\n\nIn practice, the largest models use a combination of all three parallelism strategies. A typical setup might use tensor parallelism within a node (where NVLink provides high bandwidth), pipeline parallelism across nodes, and data parallelism across groups of nodes. Frameworks like Megatron-LM, DeepSpeed, and FSDP (Fully Sharded Data Parallel) implement these hybrid strategies.',
    order: 2,
    keyConcepts: [
      { term: 'Model Parallelism', definition: 'A strategy that distributes different parts of a model across devices, enabling training of models that exceed single-device memory capacity.' },
      { term: 'Pipeline Parallelism', definition: 'A form of model parallelism that assigns sequential groups of layers to different devices, processing micro-batches in a pipeline fashion.' },
    ],
  },
  {
    id: 'ch08-s4',
    heading: 'Mixed Precision Training',
    body: 'Mixed precision training uses lower-precision number formats (typically FP16 or BF16) for most computations while maintaining FP32 for critical operations. This approach can nearly double training throughput on modern GPUs with tensor cores while using significantly less memory.\n\nThe key technique is maintaining a FP32 master copy of weights while performing forward and backward passes in half precision. Gradients are computed in FP16/BF16 and then cast to FP32 for the weight update. This preserves the precision of the update step, which is most sensitive to numerical errors.\n\nLoss scaling is essential for FP16 training to prevent gradient underflow. Small gradient values that are representable in FP32 may round to zero in FP16. Loss scaling multiplies the loss by a large factor before backpropagation (scaling up gradients) and then divides the gradients after the backward pass. Dynamic loss scaling automatically adjusts the scale factor during training.\n\nBFloat16 (BF16), developed for Google\'s TPUs and now supported on NVIDIA Ampere and newer GPUs, uses the same exponent range as FP32 but with reduced mantissa precision. This eliminates the need for loss scaling because BF16 can represent the same range of values as FP32. BF16 is increasingly preferred over FP16 for training due to this simplicity, though FP16 remains important for inference on older hardware.',
    order: 3,
    keyConcepts: [
      { term: 'Mixed Precision Training', definition: 'A technique that uses lower-precision formats (FP16/BF16) for most computation while maintaining FP32 for numerically sensitive operations, improving speed and reducing memory.' },
      { term: 'Loss Scaling', definition: 'A technique used in FP16 training that scales the loss value up before backpropagation to prevent small gradients from underflowing to zero.' },
    ],
  },
  {
    id: 'ch08-s5',
    heading: 'Gradient Management and Communication',
    body: 'Efficient gradient communication is often the bottleneck in distributed training. For a model with billions of parameters, each gradient synchronization step must transfer gigabytes of data across the network. Optimizing this communication is essential for achieving good scaling efficiency.\n\nGradient compression reduces communication volume by transmitting approximate gradients. Techniques include gradient quantization (reducing precision of transmitted gradients), sparsification (transmitting only the largest gradients), and error feedback (accumulating compression error for future correction). These methods can reduce communication by 10-100x with minimal impact on convergence.\n\nGradient accumulation is a practical technique for simulating larger batch sizes without additional devices. Instead of synchronizing gradients after every micro-batch, gradients are accumulated locally over multiple micro-batches before synchronization. This reduces communication frequency and allows training with effectively larger batch sizes on limited hardware.\n\nOverlapping computation with communication is critical for hiding communication latency. By starting gradient communication for earlier layers while later layers are still computing, the communication overhead can be partially or fully masked. Modern frameworks implement this through bucket-based gradient reduction, where gradients are grouped into buckets that are communicated as soon as all gradients in the bucket are available.',
    order: 4,
    keyConcepts: [
      { term: 'Gradient Compression', definition: 'Techniques that reduce the volume of gradient data communicated between devices during distributed training, including quantization and sparsification.' },
      { term: 'Gradient Accumulation', definition: 'A technique that sums gradients over multiple micro-batches before performing a weight update, effectively simulating larger batch sizes.' },
    ],
  },
];

export const glossary: GlossaryTerm[] = [
  { term: 'Data Parallelism', definition: 'Distributing training data across devices, each holding a complete model copy, and synchronizing gradients after each step.' },
  { term: 'Model Parallelism', definition: 'Distributing different parts of a model across devices to handle models that exceed single-device memory.' },
  { term: 'Mixed Precision', definition: 'Using lower-precision number formats for most computations while maintaining higher precision for sensitive operations.' },
  { term: 'All-Reduce', definition: 'A collective communication primitive that aggregates data from all devices and distributes the result back.' },
  { term: 'FSDP', definition: 'Fully Sharded Data Parallel, a PyTorch strategy that shards model parameters, gradients, and optimizer states across devices.' },
  { term: 'DeepSpeed', definition: 'A Microsoft optimization library for distributed training that provides ZeRO optimizer states sharding and other efficiency techniques.' },
  { term: 'BFloat16', definition: 'A 16-bit floating-point format with the same exponent range as FP32, enabling mixed precision training without loss scaling.' },
];

export const keyTakeaways: string[] = [
  'Data parallelism is the simplest and most common distributed training approach, but model parallelism is essential for the largest models.',
  'Mixed precision training can nearly double throughput and halve memory usage with minimal impact on model quality.',
  'The linear scaling rule for learning rate breaks down at very large batch sizes, requiring warmup and specialized optimizers.',
  'Gradient communication is often the bottleneck in distributed training, motivating compression and overlap techniques.',
  'Production training systems combine data, tensor, and pipeline parallelism in hybrid configurations matched to hardware topology.',
];
