import type { ChapterQuiz } from '~/types/quiz';

export const ch08Quiz: ChapterQuiz = {
  chapterId: 'ch08',
  title: 'AI Training Quiz',
  description: 'Test your understanding of distributed training, gradient descent optimization, and training at scale.',
  passingScore: 70,
  selectCount: 5,
  pool: [
    {
      id: 'ch08-q1',
      question: 'What is data parallelism in distributed training?',
      options: [
        'Splitting the model across multiple GPUs',
        'Replicating the model on each worker and splitting the training data, then aggregating gradients across workers',
        'Processing data sequentially on a single GPU',
        'Using different datasets for different experiments',
      ],
      correctIndex: 1,
      explanation:
        'In data parallelism, each worker holds a full copy of the model and processes a different mini-batch. After computing local gradients, workers synchronize by all-reducing gradients before updating parameters, effectively scaling the batch size.',
      difficulty: 'easy',
    },
    {
      id: 'ch08-q2',
      question: 'What is the key difference between data parallelism and model parallelism?',
      options: [
        'They are the same technique with different names',
        'Data parallelism splits data across devices; model parallelism splits the model itself across devices when it cannot fit in one GPU\'s memory',
        'Model parallelism is always faster than data parallelism',
        'Data parallelism requires more GPUs than model parallelism',
      ],
      correctIndex: 1,
      explanation:
        'Data parallelism works when the model fits on each GPU and scales by increasing effective batch size. Model parallelism becomes necessary when a model is too large for one GPU\'s memory, splitting layers or tensors across devices with inter-device communication.',
      difficulty: 'medium',
    },
    {
      id: 'ch08-q3',
      question: 'What is gradient accumulation and when is it useful?',
      options: [
        'Storing all gradients in memory for later analysis',
        'Summing gradients over multiple forward-backward passes before updating, simulating a larger effective batch size with limited GPU memory',
        'Accumulating errors during training',
        'A method for gradient clipping',
      ],
      correctIndex: 1,
      explanation:
        'When GPU memory is insufficient for the desired batch size, gradient accumulation performs multiple forward-backward passes at a smaller batch size, sums the gradients, and then updates parameters. This achieves the effect of a larger batch without increasing memory.',
      difficulty: 'medium',
    },
    {
      id: 'ch08-q4',
      question: 'What is mixed precision training?',
      options: [
        'Training with both labeled and unlabeled data',
        'Using lower precision (FP16) for most computations while keeping critical operations in FP32 to speed up training without losing accuracy',
        'Mixing different optimizers during training',
        'Training on a mix of different hardware types',
      ],
      correctIndex: 1,
      explanation:
        'Mixed precision uses FP16 for forward/backward passes (faster, less memory) and FP32 for gradient accumulation and weight updates (maintaining numerical stability). Loss scaling prevents small FP16 gradients from underflowing to zero.',
      difficulty: 'medium',
    },
    {
      id: 'ch08-q5',
      question: 'Why is the Adam optimizer widely used compared to vanilla SGD?',
      options: [
        'Adam always achieves higher accuracy than SGD',
        'Adam adapts the learning rate per-parameter using running estimates of first and second moments of gradients',
        'Adam does not require setting any hyperparameters',
        'Adam uses less memory than SGD',
      ],
      correctIndex: 1,
      explanation:
        'Adam maintains per-parameter adaptive learning rates using exponential moving averages of the gradient (first moment) and squared gradient (second moment). This makes it less sensitive to learning rate choice and effective across diverse architectures, though SGD with momentum can generalize better in some cases.',
      difficulty: 'medium',
    },
    {
      id: 'ch08-q6',
      question: 'What is gradient clipping and why is it important?',
      options: [
        'Removing the smallest gradients to speed up training',
        'Capping gradient magnitude to a threshold to prevent exploding gradients that destabilize training',
        'Compressing gradients for distributed communication',
        'Storing gradients in a clipboard for later use',
      ],
      correctIndex: 1,
      explanation:
        'In deep networks, especially RNNs and Transformers, gradients can grow exponentially (exploding gradients), causing huge parameter updates and training instability. Gradient clipping rescales the gradient vector when its norm exceeds a threshold.',
      difficulty: 'easy',
    },
    {
      id: 'ch08-q7',
      question: 'What is a learning rate schedule and why is it used?',
      options: [
        'The calendar date when training starts',
        'A policy that adjusts the learning rate over the course of training, typically starting higher and decreasing over time',
        'The rate at which new training data arrives',
        'A schedule for when to add more layers to the network',
      ],
      correctIndex: 1,
      explanation:
        'Learning rate schedules (cosine annealing, step decay, warmup + decay) help training converge: larger rates early help escape poor regions, while smaller rates later help fine-tune into sharp minima. Warmup prevents instability in the initial phase.',
      difficulty: 'easy',
    },
    {
      id: 'ch08-q8',
      question: 'What is the "communication bottleneck" in distributed training?',
      options: [
        'The time developers spend discussing model architecture',
        'The overhead of synchronizing gradients or activations across GPUs/nodes, which can dominate total training time',
        'Network latency when downloading training data',
        'Slow logging of metrics to experiment tracking systems',
      ],
      correctIndex: 1,
      explanation:
        'In distributed training, workers must exchange gradients or activations over interconnects (PCIe, NVLink, network). As model size grows and the number of workers increases, this communication can become the bottleneck, limiting scaling efficiency.',
      difficulty: 'hard',
    },
    {
      id: 'ch08-q9',
      question: 'What is the purpose of loss scaling in mixed precision training?',
      options: [
        'To make the loss function produce larger values for better visualization',
        'To multiply the loss by a large factor before backpropagation so small gradient values do not underflow to zero in FP16',
        'To normalize the loss across different batch sizes',
        'To balance losses from multiple tasks in multi-task learning',
      ],
      correctIndex: 1,
      explanation:
        'FP16 has a limited range. Small gradient values that are representable in FP32 underflow to zero in FP16. Loss scaling multiplies the loss (and hence gradients) by a large factor before FP16 backpropagation, then divides back after converting to FP32 for the update.',
      difficulty: 'hard',
    },
    {
      id: 'ch08-q10',
      question: 'What is the relationship between batch size and learning rate in distributed training?',
      options: [
        'They are completely independent and can be set separately',
        'When scaling batch size by k workers, the learning rate is typically scaled proportionally (linear scaling rule) to maintain training dynamics',
        'Larger batch sizes always require smaller learning rates',
        'The learning rate must always be 0.001 regardless of batch size',
      ],
      correctIndex: 1,
      explanation:
        'The linear scaling rule (Goyal et al., 2017) suggests increasing the learning rate linearly with the batch size to maintain the same effective update magnitude. Combined with a warmup period, this enables scaling to very large batch sizes across many GPUs.',
      difficulty: 'hard',
    },
  ],
};
