import type { ChapterQuiz } from '~/types/quiz';

export const ch03Quiz: ChapterQuiz = {
  chapterId: 'ch03',
  title: 'DL Primer Quiz',
  description: 'Test your understanding of deep learning fundamentals including neural networks, backpropagation, and optimization.',
  passingScore: 70,
  selectCount: 5,
  pool: [
    {
      id: 'ch03-q1',
      question: 'What is the primary purpose of an activation function in a neural network?',
      options: [
        'To speed up training by reducing the number of parameters',
        'To introduce non-linearity, allowing the network to learn complex patterns',
        'To normalize the input data before processing',
        'To regularize the model and prevent overfitting',
      ],
      correctIndex: 1,
      explanation:
        'Without activation functions, a deep neural network would collapse into a single linear transformation regardless of its depth. Non-linear activations enable networks to approximate complex, non-linear functions essential for real-world tasks.',
      difficulty: 'easy',
    },
    {
      id: 'ch03-q2',
      question: 'What problem does the ReLU activation function solve compared to sigmoid?',
      options: [
        'ReLU produces probabilities while sigmoid does not',
        'ReLU mitigates the vanishing gradient problem by maintaining a constant gradient for positive inputs',
        'ReLU is differentiable everywhere while sigmoid is not',
        'ReLU outputs values between 0 and 1',
      ],
      correctIndex: 1,
      explanation:
        'Sigmoid squashes values to (0, 1), causing gradients to shrink exponentially in deep networks (vanishing gradients). ReLU (max(0, x)) maintains a gradient of 1 for positive inputs, enabling much deeper networks to train effectively.',
      difficulty: 'medium',
    },
    {
      id: 'ch03-q3',
      question: 'What does backpropagation compute?',
      options: [
        'The optimal learning rate for each layer',
        'The forward pass predictions for each training sample',
        'The gradient of the loss function with respect to each parameter using the chain rule',
        'The number of epochs needed for convergence',
      ],
      correctIndex: 2,
      explanation:
        'Backpropagation efficiently computes partial derivatives of the loss with respect to every weight by propagating error signals backward through the network using the chain rule. These gradients indicate how to adjust each parameter to reduce the loss.',
      difficulty: 'medium',
    },
    {
      id: 'ch03-q4',
      question: 'What is the difference between a loss function and a metric in ML?',
      options: [
        'They are the same thing',
        'A loss function is differentiable and used for optimization; a metric is used for human-interpretable evaluation',
        'A metric is always more accurate than a loss function',
        'Loss functions are only used during inference',
      ],
      correctIndex: 1,
      explanation:
        'The loss function must be differentiable for gradient-based optimization during training. Metrics (like accuracy, F1-score) may not be differentiable but provide interpretable performance measures. They serve complementary roles.',
      difficulty: 'medium',
    },
    {
      id: 'ch03-q5',
      question: 'Why might cross-entropy loss be preferred over mean squared error for classification tasks?',
      options: [
        'Cross-entropy is simpler to compute',
        'Mean squared error always converges faster',
        'Cross-entropy produces stronger gradients when predictions are confidently wrong, leading to faster learning',
        'Mean squared error cannot be used with neural networks',
      ],
      correctIndex: 2,
      explanation:
        'When a classifier makes a confident but wrong prediction, MSE gradients can be small (plateau near 0 or 1), slowing learning. Cross-entropy loss produces large gradients in this case, providing a stronger learning signal to correct confident mistakes.',
      difficulty: 'hard',
    },
    {
      id: 'ch03-q6',
      question: 'What is a computational graph in the context of deep learning?',
      options: [
        'A visual chart showing model accuracy over time',
        'A directed graph representing the sequence of mathematical operations, enabling automatic differentiation',
        'A diagram of the GPU hardware architecture',
        'A plot of the loss function landscape',
      ],
      correctIndex: 1,
      explanation:
        'A computational graph represents each operation in a neural network as a node, with edges showing data dependencies. This structure enables automatic differentiation frameworks to efficiently compute gradients via backpropagation.',
      difficulty: 'medium',
    },
    {
      id: 'ch03-q7',
      question: 'What is the "dying ReLU" problem?',
      options: [
        'ReLU activations slow down as training progresses',
        'Neurons with ReLU can become permanently inactive if they consistently receive negative inputs, outputting zero for all data',
        'ReLU functions cause memory leaks in GPU computation',
        'ReLU cannot be used in the output layer',
      ],
      correctIndex: 1,
      explanation:
        'When a ReLU neuron\'s weights shift such that its input is always negative, the output is always zero and the gradient is always zero, so the neuron can never recover. Variants like Leaky ReLU and ELU address this by allowing small negative outputs.',
      difficulty: 'hard',
    },
    {
      id: 'ch03-q8',
      question: 'What is the role of the learning rate in gradient descent?',
      options: [
        'It determines the size of the training dataset',
        'It controls the step size for parameter updates, balancing convergence speed against stability',
        'It sets the number of layers in the network',
        'It determines the batch size for training',
      ],
      correctIndex: 1,
      explanation:
        'The learning rate scales the gradient to determine how much to adjust each parameter. Too large a learning rate causes overshooting and divergence; too small a rate causes painfully slow convergence or getting stuck in local minima.',
      difficulty: 'easy',
    },
    {
      id: 'ch03-q9',
      question: 'What is the purpose of softmax in the output layer of a classification network?',
      options: [
        'To reduce the number of output classes',
        'To convert raw logits into a probability distribution that sums to 1 across all classes',
        'To apply dropout regularization',
        'To normalize the input features',
      ],
      correctIndex: 1,
      explanation:
        'Softmax exponentiates each logit and normalizes by the sum, converting arbitrary real-valued outputs into a valid probability distribution. This makes the output interpretable as class probabilities, which is essential for classification tasks.',
      difficulty: 'easy',
    },
    {
      id: 'ch03-q10',
      question: 'Why is mini-batch gradient descent preferred over full-batch or purely stochastic gradient descent?',
      options: [
        'It always converges to the global minimum',
        'It balances computational efficiency of batched operations with the regularization effect of noisy gradient estimates',
        'It eliminates the need for a learning rate',
        'It requires less memory than processing a single sample',
      ],
      correctIndex: 1,
      explanation:
        'Full-batch gradient descent is computationally expensive and can overfit. Purely stochastic (single sample) gradient descent is noisy and cannot leverage GPU parallelism. Mini-batch balances both: efficient GPU utilization and beneficial noise that helps escape local minima.',
      difficulty: 'hard',
    },
  ],
};
