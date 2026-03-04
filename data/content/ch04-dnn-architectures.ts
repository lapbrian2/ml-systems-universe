import type { ChapterSection, GlossaryTerm } from '~/types/chapter';

export const sections: ChapterSection[] = [
  {
    id: 'ch04-s1',
    heading: 'Convolutional Neural Networks (CNNs)',
    body: 'Convolutional Neural Networks exploit spatial structure in data by applying learned filters that slide across the input. This weight-sharing mechanism dramatically reduces the number of parameters compared to fully connected layers, making CNNs both more efficient and more effective for grid-structured data like images, audio spectrograms, and time series.\n\nThe core building blocks of CNNs are convolutional layers, pooling layers, and fully connected layers. Convolutional layers apply filters that detect local patterns like edges and textures. Pooling layers reduce spatial dimensions, providing translation invariance and reducing computation. The hierarchical stacking of these layers enables progressively more abstract feature extraction.\n\nFrom a systems perspective, CNNs have predictable and regular memory access patterns, which makes them well-suited for GPU acceleration. The convolution operation can be implemented as matrix multiplication (im2col) or using specialized algorithms like Winograd or FFT-based convolution, each with different performance characteristics depending on filter size and input dimensions.\n\nArchitectural innovations like ResNets introduced skip connections that enable training of very deep networks (100+ layers) by providing gradient shortcuts. MobileNets introduced depthwise separable convolutions that factorize standard convolutions into cheaper operations, reducing computation by 8-9x with minimal accuracy loss. These efficiency-focused architectures are particularly important for edge deployment.',
    order: 0,
    keyConcepts: [
      { term: 'Convolution', definition: 'A mathematical operation that slides a learned filter across input data, detecting local patterns while sharing weights across spatial positions.' },
      { term: 'Depthwise Separable Convolution', definition: 'A factorization of standard convolution into depthwise and pointwise operations that dramatically reduces computation and parameters.' },
    ],
  },
  {
    id: 'ch04-s2',
    heading: 'Recurrent Neural Networks (RNNs)',
    body: 'Recurrent Neural Networks process sequential data by maintaining a hidden state that captures information from previous time steps. At each step, the RNN updates its hidden state based on the current input and the previous state, creating a form of memory that enables processing of variable-length sequences.\n\nVanilla RNNs suffer from the vanishing and exploding gradient problems, which make it difficult to learn long-range dependencies. Long Short-Term Memory (LSTM) networks address this through a gating mechanism with forget, input, and output gates that control information flow. Gated Recurrent Units (GRUs) provide a simpler alternative with fewer parameters and comparable performance.\n\nThe sequential nature of RNNs creates significant systems challenges. Because each time step depends on the previous output, RNN computation cannot be easily parallelized across the sequence dimension. This fundamentally limits throughput on parallel hardware like GPUs, which is a major motivation for the shift toward Transformer architectures.\n\nDespite their limitations, RNNs remain relevant for certain applications, particularly in resource-constrained environments. Their per-step memory footprint is constant regardless of sequence length, which can be advantageous for streaming applications on edge devices. Additionally, recent work on linear RNNs and state-space models has renewed interest in recurrent architectures with improved parallelism.',
    order: 1,
    keyConcepts: [
      { term: 'LSTM', definition: 'Long Short-Term Memory, a gated RNN variant that uses forget, input, and output gates to learn long-range dependencies in sequential data.' },
      { term: 'Hidden State', definition: 'The internal memory vector of a recurrent network that is updated at each time step, encoding information about the sequence processed so far.' },
    ],
  },
  {
    id: 'ch04-s3',
    heading: 'Transformers and Attention',
    body: 'The Transformer architecture, introduced in the "Attention Is All You Need" paper, has revolutionized deep learning by replacing recurrence with self-attention. Self-attention computes relationships between all positions in a sequence simultaneously, enabling rich contextual representations and full parallelism during training.\n\nThe core mechanism is scaled dot-product attention: queries, keys, and values are computed from the input, and attention weights are determined by the compatibility between queries and keys. Multi-head attention extends this by running multiple attention operations in parallel, allowing the model to attend to information from different representation subspaces.\n\nFrom a systems perspective, the self-attention mechanism has O(n^2) computational and memory complexity with respect to sequence length. This quadratic scaling is the primary bottleneck for processing long sequences and has motivated extensive research into efficient attention variants. Linear attention, sparse attention, and sliding window attention reduce this cost while preserving most of the modeling capacity.\n\nTransformers have become the dominant architecture across natural language processing, computer vision (Vision Transformers), and multimodal learning. Their uniform structure makes them particularly amenable to hardware optimization: the attention and feed-forward layers are composed of large matrix multiplications that map efficiently onto GPU tensor cores. This hardware compatibility, combined with strong scaling properties, has driven the trend toward ever-larger Transformer models.',
    order: 2,
    keyConcepts: [
      { term: 'Self-Attention', definition: 'A mechanism that computes weighted relationships between all positions in a sequence, enabling each element to attend to all other elements simultaneously.' },
      { term: 'Multi-Head Attention', definition: 'An extension of self-attention that runs multiple attention operations in parallel, each learning different relationship patterns in different subspaces.' },
    ],
  },
  {
    id: 'ch04-s4',
    heading: 'Neural Architecture Search (NAS)',
    body: 'Neural Architecture Search automates the design of neural network architectures by searching over a defined space of possible designs. Rather than relying on human intuition and manual experimentation, NAS uses optimization algorithms to discover architectures that are optimized for specific objectives like accuracy, latency, or model size.\n\nEarly NAS methods used reinforcement learning or evolutionary algorithms to search over discrete architecture spaces, requiring thousands of GPU hours per search. Modern approaches like differentiable NAS (DARTS) relax the discrete search space to be continuous, enabling gradient-based optimization that is orders of magnitude more efficient.\n\nHardware-aware NAS incorporates hardware constraints directly into the search objective. Rather than finding the most accurate architecture and then compressing it, hardware-aware NAS discovers architectures that are inherently efficient on the target platform. This approach has produced architectures like EfficientNet and MNASNet that achieve better accuracy-efficiency trade-offs than hand-designed models.\n\nFrom a systems engineering perspective, NAS raises important questions about the cost of architecture search versus the benefit of the discovered architecture. A search that requires 1000 GPU hours to find an architecture that saves 10% inference cost only pays for itself at sufficient deployment scale. Practitioners must weigh NAS costs against the expected lifetime benefits of improved architecture efficiency.',
    order: 3,
    keyConcepts: [
      { term: 'Neural Architecture Search', definition: 'Automated methods for discovering optimal neural network architectures by searching over a defined space of possible designs using optimization algorithms.' },
      { term: 'Hardware-Aware NAS', definition: 'NAS methods that incorporate hardware performance metrics (latency, energy, memory) directly into the search objective function.' },
    ],
  },
  {
    id: 'ch04-s5',
    heading: 'Architecture Design Principles',
    body: 'Effective architecture design is guided by several key principles that balance model capacity, computational efficiency, and practical deployability. The principle of progressive complexity suggests starting with simpler architectures and adding complexity only when justified by improved performance on the target task.\n\nDepth versus width is a fundamental design dimension. Deeper networks can represent more complex functions but are harder to train and more prone to gradient issues. Wider networks are more parallelizable and easier to train but may be less parameter-efficient. Modern architectures often combine moderate depth with strategic width variation across layers.\n\nCompound scaling, introduced by EfficientNet, provides a principled approach to scaling architectures. Rather than scaling only depth, width, or resolution independently, compound scaling adjusts all three dimensions simultaneously according to a fixed ratio. This approach consistently outperforms single-dimension scaling across different computational budgets.\n\nThe trend toward modular, composable architecture components has accelerated with the success of Transformers. Standard building blocks like attention layers, feed-forward networks, and normalization layers can be combined in various configurations. This modularity simplifies implementation, enables code reuse, and facilitates systematic ablation studies to understand the contribution of each component.',
    order: 4,
    keyConcepts: [
      { term: 'Compound Scaling', definition: 'A method for uniformly scaling network depth, width, and input resolution together using a fixed ratio, producing more balanced and efficient architectures.' },
      { term: 'Skip Connection', definition: 'A shortcut that adds the input of a layer directly to its output, enabling gradient flow through very deep networks and facilitating training.' },
    ],
  },
];

export const glossary: GlossaryTerm[] = [
  { term: 'CNN', definition: 'Convolutional Neural Network, an architecture that uses learned filters and weight sharing to efficiently process grid-structured data like images.' },
  { term: 'RNN', definition: 'Recurrent Neural Network, an architecture that processes sequential data by maintaining and updating a hidden state across time steps.' },
  { term: 'Transformer', definition: 'An architecture based on self-attention mechanisms that processes all sequence positions in parallel, dominant in modern NLP and vision.' },
  { term: 'Attention Mechanism', definition: 'A learned weighting scheme that allows models to focus on the most relevant parts of the input when producing each output.' },
  { term: 'NAS', definition: 'Neural Architecture Search, automated methods for discovering optimal network architectures through algorithmic search.' },
  { term: 'ResNet', definition: 'Residual Network, a CNN architecture that uses skip connections to enable training of very deep networks (100+ layers).' },
  { term: 'Vision Transformer (ViT)', definition: 'A Transformer architecture adapted for image processing by treating image patches as sequence tokens.' },
];

export const keyTakeaways: string[] = [
  'CNNs exploit spatial structure through weight sharing and are highly efficient on parallel hardware due to regular computation patterns.',
  'The sequential nature of RNNs fundamentally limits their parallelism, motivating the shift to Transformer architectures.',
  'Transformers achieve strong performance through self-attention but face O(n^2) scaling challenges with sequence length.',
  'Hardware-aware NAS discovers architectures optimized for specific deployment targets, outperforming hand-designed models.',
  'Architecture design involves balancing depth, width, and resolution, with compound scaling providing a principled approach.',
  'The choice of architecture has profound systems implications for memory usage, computational cost, and hardware utilization.',
];
