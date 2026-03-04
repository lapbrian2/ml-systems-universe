import type { ChapterQuiz } from '@/types/quiz';

export const ch02Quiz: ChapterQuiz = {
  chapterId: 'ch02',
  title: 'ML Systems Quiz',
  description: 'Test your understanding of ML system architecture, pipelines, and design trade-offs.',
  passingScore: 70,
  selectCount: 5,
  pool: [
    {
      id: 'ch02-q1',
      question: 'What are the main stages of an end-to-end ML pipeline?',
      options: [
        'Data collection, model training, deployment',
        'Data ingestion, feature engineering, training, evaluation, deployment, and monitoring',
        'Coding, testing, and releasing',
        'Research, prototyping, and publishing',
      ],
      correctIndex: 1,
      explanation:
        'A production ML pipeline includes data ingestion, preprocessing and feature engineering, model training, evaluation, deployment, and ongoing monitoring. Each stage has distinct systems requirements and failure modes.',
      difficulty: 'easy',
    },
    {
      id: 'ch02-q2',
      question: 'What is the difference between latency and throughput in ML systems?',
      options: [
        'They are two names for the same concept',
        'Latency measures total data processed; throughput measures time per request',
        'Latency is the time for a single inference; throughput is the number of inferences per unit time',
        'Latency only applies to training; throughput only applies to inference',
      ],
      correctIndex: 2,
      explanation:
        'Latency measures the delay for processing a single request (e.g., milliseconds per inference), while throughput measures the volume of work completed over time (e.g., inferences per second). Optimizing one often comes at the cost of the other.',
      difficulty: 'medium',
    },
    {
      id: 'ch02-q3',
      question: 'Why is data feedback important in production ML systems?',
      options: [
        'It reduces the cost of cloud storage',
        'It enables the system to detect drift, retrain, and improve from real-world signals',
        'It is only useful for debugging during development',
        'It eliminates the need for manual labeling entirely',
      ],
      correctIndex: 1,
      explanation:
        'Data feedback loops allow ML systems to capture production data, detect distribution shifts, identify model degradation, and trigger retraining. This continuous learning cycle is what makes production ML systems adaptive and resilient.',
      difficulty: 'medium',
    },
    {
      id: 'ch02-q4',
      question: 'What role does a feature store play in an ML system?',
      options: [
        'It stores trained model weights for deployment',
        'It provides a centralized repository for computing, storing, and serving ML features consistently across training and inference',
        'It replaces the need for a database in the pipeline',
        'It is a visualization tool for model performance',
      ],
      correctIndex: 1,
      explanation:
        'A feature store ensures consistency between training and serving by providing a single source of truth for feature definitions and values. This prevents training-serving skew, one of the most common and hard-to-debug production ML issues.',
      difficulty: 'medium',
    },
    {
      id: 'ch02-q5',
      question: 'What is training-serving skew?',
      options: [
        'The difference in GPU utilization between training and inference',
        'A mismatch between the data or feature transformations used during training and those used during serving',
        'The time difference between when a model is trained and when it is deployed',
        'The accuracy gap between training metrics and test metrics',
      ],
      correctIndex: 1,
      explanation:
        'Training-serving skew occurs when the features or data processing in the serving environment differ from those used in training. Even small discrepancies can cause significant accuracy drops in production, making it a critical systems concern.',
      difficulty: 'hard',
    },
    {
      id: 'ch02-q6',
      question: 'Which of the following is a key system-level trade-off when designing ML systems?',
      options: [
        'Using Python vs. using Java',
        'Model complexity vs. inference latency and resource consumption',
        'Number of developers vs. lines of code',
        'Open-source vs. proprietary frameworks',
      ],
      correctIndex: 1,
      explanation:
        'One of the fundamental trade-offs in ML system design is between model complexity (which often improves accuracy) and the operational costs of serving that model (latency, memory, compute). Systems engineers must balance these competing concerns.',
      difficulty: 'easy',
    },
    {
      id: 'ch02-q7',
      question: 'What does "model serving" refer to in the ML system stack?',
      options: [
        'The process of training a model on a distributed cluster',
        'Making a trained model available to handle inference requests in production',
        'Storing model artifacts in a version control system',
        'Evaluating model performance on a test dataset',
      ],
      correctIndex: 1,
      explanation:
        'Model serving is the infrastructure that loads a trained model, accepts input requests, performs inference, and returns predictions. It involves concerns like batching, scaling, load balancing, and managing model versions in production.',
      difficulty: 'easy',
    },
    {
      id: 'ch02-q8',
      question: 'Why is monitoring essential in production ML systems, beyond traditional software monitoring?',
      options: [
        'ML systems never crash, so monitoring is about performance logging only',
        'ML systems can silently degrade in prediction quality without throwing errors, due to data drift or concept drift',
        'Monitoring is only needed during the first week after deployment',
        'ML monitoring replaces the need for evaluation during development',
      ],
      correctIndex: 1,
      explanation:
        'Unlike traditional software where bugs produce errors, ML models can fail silently — they continue making predictions but with degraded quality. Monitoring for data drift, concept drift, and prediction quality is essential to catch these invisible failures.',
      difficulty: 'hard',
    },
    {
      id: 'ch02-q9',
      question: 'What is a common pattern for handling ML model updates in production?',
      options: [
        'Replacing the old model immediately and discarding it',
        'Using blue-green or canary deployment strategies to gradually shift traffic to the new model',
        'Stopping the service entirely during the update',
        'Only updating models once per year',
      ],
      correctIndex: 1,
      explanation:
        'Blue-green and canary deployments allow teams to roll out new model versions incrementally, comparing their performance against the current production model. This minimizes risk and enables quick rollback if the new model underperforms.',
      difficulty: 'hard',
    },
  ],
};
