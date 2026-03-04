import type { ChapterQuiz } from '@/types/quiz';

export const ch20Quiz: ChapterQuiz = {
  chapterId: 'ch20',
  title: 'AGI Systems Quiz',
  description: 'Test your understanding of frontier models, generative AI, foundation models, and emerging AI trends.',
  passingScore: 70,
  selectCount: 5,
  pool: [
    {
      id: 'ch20-q1',
      question: 'What is a foundation model?',
      options: [
        'The first model trained by a research lab',
        'A large model trained on broad data at scale that can be adapted to a wide range of downstream tasks through fine-tuning or prompting',
        'A model that forms the foundation layer of a neural network',
        'A model used only for foundational research, not applications',
      ],
      correctIndex: 1,
      explanation:
        'Foundation models (Bommasani et al., 2021) are trained on diverse, large-scale data (text, images, code) and exhibit emergent capabilities that transfer to many downstream tasks. Examples include GPT, BERT, CLIP, and LLaMA. Their breadth creates both opportunities and risks.',
      difficulty: 'easy',
    },
    {
      id: 'ch20-q2',
      question: 'What is the "scaling hypothesis" in the context of large language models?',
      options: [
        'Scaling down models always improves performance',
        'The observation that increasing model size, training data, and compute leads to predictable and continuous improvements in capability, following power laws',
        'Scaling only refers to increasing the number of users',
        'Performance plateaus after a certain model size',
      ],
      correctIndex: 1,
      explanation:
        'Scaling laws (Kaplan et al., 2020) show that loss decreases as a power law with model parameters, dataset size, and compute. This predictability has driven the trend toward ever-larger models, though the sustainability and limits of scaling remain debated.',
      difficulty: 'medium',
    },
    {
      id: 'ch20-q3',
      question: 'What are emergent abilities in large language models?',
      options: [
        'Abilities that were explicitly programmed into the model',
        'Capabilities that appear suddenly at certain model scales, not present in smaller models, such as in-context learning and chain-of-thought reasoning',
        'The ability to generate emergency alerts',
        'Performance improvements from more training data',
      ],
      correctIndex: 1,
      explanation:
        'Emergent abilities are capabilities that are absent in smaller models but appear as models scale up — including few-shot learning, arithmetic, code generation, and complex reasoning. Whether these are truly "emergent" or a measurement artifact is actively debated.',
      difficulty: 'hard',
    },
    {
      id: 'ch20-q4',
      question: 'What systems challenges does serving large generative models introduce?',
      options: [
        'Large models have no special serving challenges',
        'High memory requirements, long autoregressive decoding latency, KV-cache management, the need for model parallelism, and significant infrastructure costs',
        'The only challenge is writing a good API',
        'Serving is easier for large models than small ones',
      ],
      correctIndex: 1,
      explanation:
        'Serving billion-parameter models requires multi-GPU inference, careful KV-cache management (which grows with sequence length), speculative decoding for latency reduction, batching strategies for throughput, and substantial infrastructure investment — all unique systems challenges.',
      difficulty: 'medium',
    },
    {
      id: 'ch20-q5',
      question: 'What is Reinforcement Learning from Human Feedback (RLHF)?',
      options: [
        'Training robots to perform physical tasks with human supervision',
        'A technique for aligning language models with human preferences by training a reward model on human comparisons and fine-tuning the LLM to maximize that reward',
        'Humans directly editing model weights based on feedback',
        'A reinforcement learning algorithm that does not require any human input',
      ],
      correctIndex: 1,
      explanation:
        'RLHF trains a reward model from human preference rankings (e.g., "response A is better than B"), then uses RL (like PPO) to fine-tune the language model to generate outputs that score highly on this reward model. This aligns model behavior with human values and preferences.',
      difficulty: 'hard',
    },
    {
      id: 'ch20-q6',
      question: 'What is the distinction between narrow AI and artificial general intelligence (AGI)?',
      options: [
        'There is no meaningful distinction',
        'Narrow AI excels at specific tasks it was trained for; AGI would possess human-level ability to learn and perform any intellectual task across domains',
        'Narrow AI is less accurate than AGI',
        'AGI already exists in current language models',
      ],
      correctIndex: 1,
      explanation:
        'Current AI systems (including large language models) are narrow: they excel at trained tasks but lack true understanding, common sense, and the ability to transfer knowledge flexibly across all domains. AGI, if achieved, would exhibit general-purpose intellectual capability.',
      difficulty: 'easy',
    },
    {
      id: 'ch20-q7',
      question: 'What is multimodal AI?',
      options: [
        'AI that runs on multiple types of hardware',
        'Models that can process and generate multiple types of data (text, images, audio, video) in a unified architecture',
        'AI deployed across multiple data centers',
        'Using multiple models for the same task',
      ],
      correctIndex: 1,
      explanation:
        'Multimodal models (like GPT-4V, Gemini) process and relate information across modalities — understanding images with text context, generating images from descriptions, or answering questions about videos. This mirrors human-like multi-sensory understanding.',
      difficulty: 'easy',
    },
    {
      id: 'ch20-q8',
      question: 'What is the "alignment problem" in advanced AI systems?',
      options: [
        'Ensuring GPU memory is properly aligned for computation',
        'The challenge of ensuring AI systems pursue goals that are aligned with human values and intentions, especially as systems become more capable',
        'Aligning the outputs of multiple models to agree',
        'Formatting model outputs to align with a specific layout',
      ],
      correctIndex: 1,
      explanation:
        'The alignment problem addresses the risk that highly capable AI systems might optimize for objectives that diverge from human intent — either through misspecified reward functions, unintended goal pursuit, or deceptive alignment. It is a central concern in AI safety research.',
      difficulty: 'medium',
    },
    {
      id: 'ch20-q9',
      question: 'What is the role of retrieval-augmented generation (RAG) in modern AI systems?',
      options: [
        'Retrieving old model checkpoints for comparison',
        'Combining a language model with a retrieval system to ground generation in relevant documents, reducing hallucination and enabling access to up-to-date information',
        'Generating augmented reality content using AI',
        'Retrieving and replacing faulty model weights',
      ],
      correctIndex: 1,
      explanation:
        'RAG addresses LLM limitations by retrieving relevant documents from a knowledge base at inference time and conditioning the generation on this context. This reduces hallucination, enables access to current information, and provides verifiable sources for generated content.',
      difficulty: 'medium',
    },
    {
      id: 'ch20-q10',
      question: 'What is a key concern about the concentration of frontier AI development?',
      options: [
        'Too many organizations are developing frontier AI',
        'Only a few organizations have the resources (compute, data, talent) for frontier model training, raising concerns about power concentration, access equity, and democratic governance',
        'Concentration makes AI development faster and better for everyone',
        'There is no concentration; anyone can train frontier models',
      ],
      correctIndex: 1,
      explanation:
        'Training frontier models costs hundreds of millions of dollars. This concentration means a few companies control the most capable AI, raising concerns about market power, equitable access, democratic governance of transformative technology, and the values embedded in these systems.',
      difficulty: 'hard',
    },
  ],
};
