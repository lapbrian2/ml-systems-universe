import type { ChapterQuiz } from '@/types/quiz';

export const ch07Quiz: ChapterQuiz = {
  chapterId: 'ch07',
  title: 'AI Frameworks Quiz',
  description: 'Test your understanding of ML frameworks including PyTorch, TensorFlow, JAX, and their systems trade-offs.',
  passingScore: 70,
  selectCount: 5,
  pool: [
    {
      id: 'ch07-q1',
      question: 'What is the fundamental difference between eager execution and graph-based execution in ML frameworks?',
      options: [
        'Eager execution is slower but more memory-efficient',
        'Eager execution runs operations immediately as Python calls; graph-based execution builds a computation graph first, then optimizes and runs it',
        'Graph-based execution only works on CPUs',
        'There is no practical difference between the two',
      ],
      correctIndex: 1,
      explanation:
        'Eager execution (default in PyTorch and TF2) runs each operation immediately, making debugging intuitive. Graph-based execution (TF1, JAX\'s JIT) first builds a symbolic graph, enabling optimizations like operator fusion and memory planning before execution.',
      difficulty: 'medium',
    },
    {
      id: 'ch07-q2',
      question: 'What is ONNX and why is it important in the ML ecosystem?',
      options: [
        'A new programming language for ML',
        'An open standard for representing ML models that enables interoperability between different frameworks',
        'A GPU hardware manufacturer',
        'A data labeling platform',
      ],
      correctIndex: 1,
      explanation:
        'ONNX (Open Neural Network Exchange) defines a common format for ML models, allowing models trained in one framework (e.g., PyTorch) to be deployed using another runtime (e.g., ONNX Runtime, TensorRT). This decouples training and serving toolchains.',
      difficulty: 'easy',
    },
    {
      id: 'ch07-q3',
      question: 'What distinguishes JAX from PyTorch and TensorFlow?',
      options: [
        'JAX is only for natural language processing',
        'JAX combines NumPy-like syntax with composable function transformations (jit, grad, vmap, pmap) for high-performance numerical computing',
        'JAX does not support GPU acceleration',
        'JAX is a proprietary framework that requires licensing',
      ],
      correctIndex: 1,
      explanation:
        'JAX takes a functional programming approach where transformations like automatic differentiation (grad), vectorization (vmap), parallelization (pmap), and JIT compilation are composable. This enables elegant expression of complex scientific computing patterns.',
      difficulty: 'medium',
    },
    {
      id: 'ch07-q4',
      question: 'What is a computational graph in the context of ML frameworks?',
      options: [
        'A visualization of training loss over time',
        'A data structure representing operations as nodes and data flow as edges, used to schedule and optimize computation',
        'A network diagram of distributed training nodes',
        'A graph neural network architecture',
      ],
      correctIndex: 1,
      explanation:
        'Computational graphs represent the chain of mathematical operations in a model. Frameworks use them for automatic differentiation (backpropagation), memory optimization, operator fusion, and scheduling work across hardware devices.',
      difficulty: 'easy',
    },
    {
      id: 'ch07-q5',
      question: 'Why does PyTorch dominate ML research while TensorFlow has been strong in production?',
      options: [
        'PyTorch is written in a better programming language',
        'PyTorch\'s eager execution and Pythonic API accelerate research iteration; TensorFlow\'s ecosystem (TFX, TF Serving, TFLite) provides more mature production tooling',
        'TensorFlow models are always more accurate',
        'PyTorch cannot be used in production at all',
      ],
      correctIndex: 1,
      explanation:
        'PyTorch\'s dynamic graphs and intuitive debugging made it the default for research. TensorFlow\'s mature ecosystem for serving, mobile deployment, and pipeline orchestration gave it an edge in production. The gap has narrowed as both ecosystems evolved.',
      difficulty: 'medium',
    },
    {
      id: 'ch07-q6',
      question: 'What is operator fusion in ML framework compilers?',
      options: [
        'Combining multiple ML models into one',
        'Merging separate mathematical operations (e.g., convolution + bias + ReLU) into a single kernel to reduce memory traffic and launch overhead',
        'Fusing CPU and GPU computation',
        'Combining training and inference into one step',
      ],
      correctIndex: 1,
      explanation:
        'Without fusion, each operation writes results to memory and the next reads them back. Fusing operations (e.g., conv + batch norm + ReLU into one kernel) reduces memory bandwidth usage and kernel launch overhead, significantly improving performance.',
      difficulty: 'hard',
    },
    {
      id: 'ch07-q7',
      question: 'What is the role of an ML compiler like XLA or TVM?',
      options: [
        'To convert Python code into C++ for faster execution',
        'To optimize and lower computational graphs into efficient hardware-specific code for CPUs, GPUs, and custom accelerators',
        'To check ML code for syntax errors',
        'To compress model weights for storage',
      ],
      correctIndex: 1,
      explanation:
        'ML compilers take a high-level computational graph and apply optimizations (fusion, tiling, vectorization, memory planning) to generate efficient code for specific hardware targets. This bridges the gap between framework abstractions and hardware performance.',
      difficulty: 'hard',
    },
    {
      id: 'ch07-q8',
      question: 'What does "define-by-run" mean in the context of PyTorch?',
      options: [
        'Models must be defined in a separate configuration file before running',
        'The computational graph is constructed dynamically during execution, allowing data-dependent control flow',
        'All model parameters are defined at runtime, not in code',
        'Models run automatically without any user code',
      ],
      correctIndex: 1,
      explanation:
        'In define-by-run (dynamic graph) frameworks, the graph is built on-the-fly as operations execute. This means standard Python control flow (if/else, loops) can depend on actual tensor values, making debugging and dynamic architectures straightforward.',
      difficulty: 'medium',
    },
    {
      id: 'ch07-q9',
      question: 'What is the purpose of TorchScript in the PyTorch ecosystem?',
      options: [
        'A JavaScript port of PyTorch for web browsers',
        'A way to convert PyTorch models into a serializable and optimizable intermediate representation for deployment without Python',
        'A testing framework for PyTorch models',
        'A data loading utility for PyTorch',
      ],
      correctIndex: 1,
      explanation:
        'TorchScript captures PyTorch models as a static graph that can be serialized, optimized, and run in environments without Python (like C++ serving systems or mobile devices). It bridges PyTorch\'s research flexibility with production deployment needs.',
      difficulty: 'hard',
    },
    {
      id: 'ch07-q10',
      question: 'What is automatic differentiation, and how do ML frameworks implement it?',
      options: [
        'It is the same as numerical differentiation using finite differences',
        'Frameworks track operations on tensors and apply the chain rule programmatically to compute exact gradients efficiently',
        'It estimates gradients by randomly sampling perturbations',
        'It requires users to manually derive and code gradient formulas',
      ],
      correctIndex: 1,
      explanation:
        'Automatic differentiation (autodiff) records each operation in a computational graph, then applies the chain rule backward to compute exact gradients. Unlike numerical differentiation, autodiff is both exact and efficient, scaling to millions of parameters.',
      difficulty: 'easy',
    },
  ],
};
