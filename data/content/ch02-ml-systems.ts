import type { ChapterSection, GlossaryTerm } from '~/types/chapter';

export const sections: ChapterSection[] = [
  {
    id: 'ch02-s1',
    heading: 'The ML Pipeline End-to-End',
    body: 'A production ML pipeline is far more than a model. It is a complex system of interconnected components that together transform raw data into actionable predictions. The pipeline typically begins with data ingestion, proceeds through feature engineering and model training, and culminates in serving predictions to end users or downstream systems.\n\nEach stage of the pipeline introduces its own set of engineering challenges. Data ingestion must handle varying formats, scales, and velocities. Feature engineering must be consistent between training and serving to avoid training-serving skew. Model training must efficiently utilize compute resources while maintaining reproducibility.\n\nThe end-to-end perspective is crucial because failures at any stage propagate through the entire system. A subtle data quality issue in ingestion can cause model degradation weeks later. A mismatch between training and serving feature computation can silently corrupt predictions. Systems engineers must design pipelines with observability and validation at every stage.\n\nModern ML pipelines are often implemented as directed acyclic graphs (DAGs) of dependent tasks, orchestrated by tools like Apache Airflow, Kubeflow Pipelines, or Prefect. These orchestration systems provide scheduling, dependency management, retry logic, and monitoring capabilities that are essential for reliable operation.',
    order: 0,
    keyConcepts: [
      { term: 'ML Pipeline', definition: 'An automated sequence of data processing, model training, and serving steps that transforms raw data into predictions in a reproducible and scalable manner.' },
      { term: 'Training-Serving Skew', definition: 'A discrepancy between the data processing or feature computation applied during training versus serving, which can silently degrade model quality.' },
    ],
  },
  {
    id: 'ch02-s2',
    heading: 'System Components and Architecture',
    body: 'ML systems are composed of several key components that must work together seamlessly. The data layer handles storage, retrieval, and transformation of training data and features. The compute layer provides the processing power for training and inference. The model layer encapsulates the trained parameters and inference logic. The serving layer exposes model predictions to applications and users.\n\nThe data layer typically includes a feature store that provides a centralized repository for computed features. Feature stores solve the critical problem of feature reuse and consistency, ensuring that the same feature computation is used during both training and serving. Popular feature stores include Feast, Tecton, and built-in solutions from cloud providers.\n\nThe compute layer must be flexible enough to handle diverse workloads. Training workloads are typically batch-oriented and GPU-intensive, while serving workloads are latency-sensitive and must handle variable request rates. Many organizations use Kubernetes to manage these heterogeneous compute requirements with a unified orchestration platform.\n\nThe serving layer is the interface between the ML system and the outside world. It must provide low-latency predictions, handle traffic spikes gracefully, support A/B testing and canary deployments, and enable easy rollback when issues are detected. Common patterns include REST APIs, gRPC endpoints, and streaming inference pipelines.',
    order: 1,
    keyConcepts: [
      { term: 'Feature Store', definition: 'A centralized platform for storing, managing, and serving machine learning features, ensuring consistency between training and production environments.' },
      { term: 'Model Serving', definition: 'The infrastructure and processes that deliver trained model predictions to applications, typically through APIs or streaming interfaces.' },
    ],
  },
  {
    id: 'ch02-s3',
    heading: 'Trade-offs in ML System Design',
    body: 'Every ML system design involves navigating a complex landscape of trade-offs. The most fundamental is the accuracy-latency trade-off: larger, more complex models generally achieve higher accuracy but require more computation and thus higher latency. Finding the right balance depends on the specific application requirements.\n\nThe latency-throughput trade-off is another critical consideration. Optimizing for low latency (fast individual predictions) often conflicts with maximizing throughput (predictions per second). Batching requests improves throughput by amortizing overhead but increases latency for individual requests. Dynamic batching strategies attempt to balance these competing objectives.\n\nCost is a pervasive constraint that influences every design decision. Cloud compute costs for training and serving can be substantial. Organizations must balance model quality against compute cost, considering factors like instance types, spot versus on-demand pricing, and the total cost of ownership for different infrastructure choices.\n\nReliability and maintainability are trade-offs that often receive insufficient attention. A complex ensemble of models may achieve the best accuracy on benchmarks but be nearly impossible to debug and maintain in production. The ML systems engineer must consider the long-term operational cost of complexity alongside short-term performance gains.',
    order: 2,
    keyConcepts: [
      { term: 'Accuracy-Latency Trade-off', definition: 'The fundamental tension between model quality and inference speed, where more complex models yield better predictions but require more computation time.' },
      { term: 'Dynamic Batching', definition: 'A serving strategy that groups incoming inference requests into batches dynamically, balancing throughput and latency based on current load.' },
    ],
  },
  {
    id: 'ch02-s4',
    heading: 'Latency, Throughput, and Performance Metrics',
    body: 'Understanding system performance requires precise measurement of key metrics. Latency measures the time from when a request is received to when the response is returned. It is typically reported as percentiles (p50, p95, p99) rather than averages, because tail latency can dramatically impact user experience.\n\nThroughput measures the total number of predictions the system can produce per unit time. It depends on factors like hardware capabilities, model complexity, batch size, and the efficiency of the serving stack. Maximizing throughput is essential for cost-effective operation at scale.\n\nBeyond latency and throughput, ML systems must track model-specific metrics like prediction quality, feature freshness, and data distribution statistics. These metrics form the basis of a comprehensive monitoring strategy that can detect issues before they impact end users.\n\nService level objectives (SLOs) formalize performance requirements for ML systems. An SLO might specify that 99% of inference requests must complete within 50 milliseconds, or that model accuracy must remain above a certain threshold. Defining and monitoring SLOs is a best practice borrowed from site reliability engineering that helps ML teams operate with accountability and transparency.',
    order: 3,
    keyConcepts: [
      { term: 'Tail Latency', definition: 'The response time experienced by the slowest requests (typically measured at p99 or p99.9), which disproportionately affects user experience in large-scale systems.' },
      { term: 'Service Level Objective (SLO)', definition: 'A measurable target for system performance or reliability, such as 99th percentile latency under 50ms, that defines acceptable operational behavior.' },
    ],
  },
  {
    id: 'ch02-s5',
    heading: 'The Full ML Stack',
    body: 'The full ML stack can be visualized as a layered architecture, with each layer building on the capabilities of the layer below. At the bottom is hardware: CPUs, GPUs, TPUs, and specialized accelerators. Above that is the systems software layer, including operating systems, device drivers, and runtime libraries.\n\nThe framework layer provides high-level APIs for defining, training, and evaluating models. Frameworks like PyTorch, TensorFlow, and JAX abstract away the complexity of hardware-specific optimizations while still providing performance. Above frameworks sit higher-level tools for experiment management, hyperparameter tuning, and AutoML.\n\nThe infrastructure layer encompasses orchestration platforms, distributed computing systems, and cloud services. This layer handles resource allocation, scheduling, scaling, and fault tolerance. Tools like Kubernetes, Ray, and cloud-managed ML services operate at this layer.\n\nAt the top of the stack are the application-specific components: model serving endpoints, monitoring dashboards, and feedback collection systems. Understanding how all these layers interact is essential for diagnosing performance issues, optimizing costs, and building reliable ML systems. A bottleneck at any layer can limit the performance of the entire stack.',
    order: 4,
    keyConcepts: [
      { term: 'ML Stack', definition: 'The complete layered architecture of hardware, systems software, frameworks, infrastructure, and application components that together comprise a production ML system.' },
    ],
  },
];

export const glossary: GlossaryTerm[] = [
  { term: 'Feature Store', definition: 'A centralized system for managing, storing, and serving machine learning features for both training and inference.' },
  { term: 'Training-Serving Skew', definition: 'Inconsistencies between training and production environments that cause model quality degradation.' },
  { term: 'Throughput', definition: 'The number of predictions or operations a system can process per unit time, often measured in queries per second (QPS).' },
  { term: 'Latency', definition: 'The time elapsed between sending a request and receiving the response, typically measured in milliseconds.' },
  { term: 'DAG', definition: 'Directed Acyclic Graph, a data structure used to represent pipeline dependencies where tasks flow in one direction without cycles.' },
  { term: 'SLO', definition: 'Service Level Objective, a formal performance target that defines acceptable behavior for a production system.' },
  { term: 'Batch Inference', definition: 'Processing multiple input samples simultaneously to improve throughput and hardware utilization.' },
];

export const keyTakeaways: string[] = [
  'Production ML systems are complex pipelines with many components beyond the model itself, including data ingestion, feature engineering, serving, and monitoring.',
  'Trade-offs between accuracy, latency, throughput, and cost drive all ML system design decisions.',
  'Feature stores solve the critical problem of maintaining consistency between training and serving feature computation.',
  'Tail latency (p99) matters more than average latency for user-facing ML systems.',
  'The full ML stack spans from hardware accelerators through frameworks, infrastructure, and application-level tooling.',
];
