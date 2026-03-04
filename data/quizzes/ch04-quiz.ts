import type { ChapterQuiz } from '~/types/quiz';

export const ch04Quiz: ChapterQuiz = {
  chapterId: 'ch04',
  title: 'DNN Architectures Quiz',
  description: 'Test your understanding of CNN, RNN, Transformer architectures, and attention mechanisms.',
  passingScore: 70,
  selectCount: 5,
  pool: [
    {
      id: 'ch04-q1',
      question: 'What is the key advantage of convolutional layers over fully connected layers for image processing?',
      options: [
        'Convolutional layers are faster to compute on CPUs',
        'Convolutional layers exploit spatial locality and parameter sharing, drastically reducing parameter count',
        'Fully connected layers cannot process images at all',
        'Convolutional layers always achieve 100% accuracy on images',
      ],
      correctIndex: 1,
      explanation:
        'A convolutional layer uses a small kernel that slides across the input, sharing parameters across spatial locations. This captures local spatial patterns with far fewer parameters than a fully connected layer, which treats every input pixel independently.',
      difficulty: 'easy',
    },
    {
      id: 'ch04-q2',
      question: 'What problem do residual connections (skip connections) in ResNets solve?',
      options: [
        'They reduce the number of parameters in the network',
        'They allow gradients to flow through shortcut paths, enabling training of much deeper networks',
        'They eliminate the need for activation functions',
        'They replace pooling layers entirely',
      ],
      correctIndex: 1,
      explanation:
        'In very deep networks, gradients can vanish or explode during backpropagation. Residual connections add the input of a block directly to its output (y = F(x) + x), providing a gradient highway that enables effective training of networks with hundreds of layers.',
      difficulty: 'medium',
    },
    {
      id: 'ch04-q3',
      question: 'Why do standard RNNs struggle with long-range dependencies?',
      options: [
        'They can only process fixed-length sequences',
        'Gradients either vanish or explode when backpropagating through many time steps',
        'RNNs do not have learnable parameters',
        'They process sequences in parallel rather than sequentially',
      ],
      correctIndex: 1,
      explanation:
        'RNNs process sequences one step at a time, multiplying gradients at each step during backpropagation through time. Over many steps, these repeated multiplications cause gradients to shrink (vanish) or grow (explode), losing long-range context.',
      difficulty: 'medium',
    },
    {
      id: 'ch04-q4',
      question: 'How does the attention mechanism in Transformers differ from the recurrence in RNNs?',
      options: [
        'Attention uses loops while RNNs do not',
        'Attention directly computes relationships between all positions in parallel, while RNNs process sequentially',
        'Attention can only handle short sequences',
        'There is no practical difference; they produce identical outputs',
      ],
      correctIndex: 1,
      explanation:
        'Self-attention computes pairwise relationships between all positions in a sequence simultaneously, enabling parallelization and direct long-range dependencies. RNNs must process tokens one by one, creating a sequential bottleneck and information loss over distance.',
      difficulty: 'medium',
    },
    {
      id: 'ch04-q5',
      question: 'What are the Query, Key, and Value in scaled dot-product attention?',
      options: [
        'Three separate neural networks that process the input independently',
        'Linear projections of the input: Query defines what to look for, Key defines what is available, Value carries the content to aggregate',
        'Hyperparameters that control the learning rate',
        'The input, hidden state, and output of the Transformer',
      ],
      correctIndex: 1,
      explanation:
        'In self-attention, each input token is linearly projected into Q, K, and V vectors. The attention weight between two tokens is computed as the scaled dot product of Q and K, and these weights are used to produce a weighted sum of V vectors.',
      difficulty: 'hard',
    },
    {
      id: 'ch04-q6',
      question: 'What is the computational complexity of self-attention with respect to sequence length n?',
      options: [
        'O(n)',
        'O(n log n)',
        'O(n^2)',
        'O(n^3)',
      ],
      correctIndex: 2,
      explanation:
        'Self-attention computes pairwise interactions between all n tokens, resulting in an n x n attention matrix. This O(n^2) complexity is why processing very long sequences is expensive and motivates research into efficient attention variants.',
      difficulty: 'hard',
    },
    {
      id: 'ch04-q7',
      question: 'What is the purpose of pooling layers in CNNs?',
      options: [
        'To increase the spatial resolution of feature maps',
        'To add non-linearity to the network',
        'To progressively reduce spatial dimensions, providing translation invariance and reducing computation',
        'To generate new training data through augmentation',
      ],
      correctIndex: 2,
      explanation:
        'Pooling (e.g., max pooling) reduces the spatial size of feature maps, making representations more compact and providing a degree of translation invariance. This reduces computation in subsequent layers and helps the network generalize spatial patterns.',
      difficulty: 'easy',
    },
    {
      id: 'ch04-q8',
      question: 'What is Neural Architecture Search (NAS)?',
      options: [
        'A manual process of designing neural network layers',
        'An automated method for discovering optimal network architectures using search algorithms',
        'A technique for finding bugs in neural network code',
        'A database of pre-trained model architectures',
      ],
      correctIndex: 1,
      explanation:
        'NAS uses algorithms (reinforcement learning, evolutionary methods, or differentiable search) to automatically explore the space of possible network architectures and find designs that optimize a target objective like accuracy or efficiency.',
      difficulty: 'easy',
    },
    {
      id: 'ch04-q9',
      question: 'Why do Transformers use positional encodings?',
      options: [
        'To reduce the model size',
        'Because self-attention is permutation-invariant and has no inherent notion of token order',
        'To improve the visual quality of generated images',
        'To replace the need for embedding layers',
      ],
      correctIndex: 1,
      explanation:
        'Unlike RNNs, self-attention treats the input as a set with no inherent ordering. Positional encodings inject sequence position information into the representations so the model can distinguish "the cat sat on the mat" from "the mat sat on the cat."',
      difficulty: 'medium',
    },
    {
      id: 'ch04-q10',
      question: 'What distinguishes depthwise separable convolutions from standard convolutions?',
      options: [
        'They use larger kernel sizes for better accuracy',
        'They split the convolution into depthwise (per-channel spatial) and pointwise (1x1 cross-channel) operations, reducing computation',
        'They only work with 1D input sequences',
        'They eliminate the need for activation functions',
      ],
      correctIndex: 1,
      explanation:
        'Standard convolutions jointly learn spatial and cross-channel patterns. Depthwise separable convolutions factorize this into a spatial convolution per channel followed by a 1x1 convolution across channels, reducing computation by roughly k^2x for kernel size k.',
      difficulty: 'hard',
    },
  ],
};
