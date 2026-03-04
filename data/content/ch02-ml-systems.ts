import type { ChapterSection, GlossaryTerm } from '~/types/chapter';

export const sections: ChapterSection[] = [
  {
    id: 'ch02-s1',
    heading: 'The ML Pipeline End-to-End',
    body: 'A production ML pipeline is far more than a model. It is a complex system of interconnected components that together transform raw data into actionable predictions. The pipeline typically begins with data ingestion, proceeds through feature engineering and model training, and culminates in serving predictions to end users or downstream systems.\n\nEach stage of the pipeline introduces its own set of engineering challenges. Data ingestion must handle varying formats, scales, and velocities. Feature engineering must be consistent between training and serving to avoid training-serving skew. Model training must efficiently utilize compute resources while maintaining reproducibility.\n\nThe end-to-end perspective is crucial because failures at any stage propagate through the entire system. A subtle data quality issue in ingestion can cause model degradation weeks later. A mismatch between training and serving feature computation can silently corrupt predictions. Systems engineers must design pipelines with observability and validation at every stage.\n\nModern ML pipelines are often implemented as directed acyclic graphs (DAGs) of dependent tasks, orchestrated by tools like Apache Airflow, Kubeflow Pipelines, or Prefect. These orchestration systems provide scheduling, dependency management, retry logic, and monitoring capabilities that are essential for reliable operation.',
    blocks: [
      {
        type: 'paragraph',
        text: 'A production ML pipeline is far more than a model. It is a complex system of interconnected components that together transform raw data into actionable predictions. The pipeline typically begins with data ingestion, proceeds through feature engineering and model training, and culminates in serving predictions to end users or downstream systems.',
      },
      {
        type: 'definition',
        term: 'ML Pipeline',
        definition: 'An automated, end-to-end sequence of data processing, feature engineering, model training, evaluation, and serving steps that transforms raw data into predictions in a reproducible and scalable manner.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Engineering Challenges at Each Stage',
      },
      {
        type: 'paragraph',
        text: 'Each stage of the pipeline introduces its own set of engineering challenges. Data ingestion must handle varying formats, scales, and velocities. Feature engineering must be consistent between training and serving to avoid training-serving skew. Model training must efficiently utilize compute resources while maintaining reproducibility.',
      },
      {
        type: 'table',
        headers: ['Pipeline Stage', 'Primary Challenge', 'Failure Mode'],
        rows: [
          ['Data Ingestion', 'Handling diverse formats, scales, and velocities', 'Schema changes or source outages corrupt downstream data'],
          ['Feature Engineering', 'Consistency between training and serving', 'Training-serving skew silently degrades predictions'],
          ['Model Training', 'Efficient compute utilization and reproducibility', 'Non-determinism or resource exhaustion causes wasted runs'],
          ['Model Evaluation', 'Meaningful offline metrics that predict online performance', 'Overfit to test set or wrong metric leads to bad deployments'],
          ['Model Serving', 'Low latency, high throughput, graceful degradation', 'Latency spikes or crashes under load impact user experience'],
        ],
        caption: 'Table 2.1: Key engineering challenges and failure modes at each pipeline stage.',
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Silent Failure Propagation',
        text: 'The end-to-end perspective is crucial because failures at any stage propagate through the entire system. A subtle data quality issue in ingestion can cause model degradation weeks later. A mismatch between training and serving feature computation can silently corrupt predictions. Unlike software bugs that produce errors, ML pipeline failures often produce plausible but wrong outputs.',
      },
      {
        type: 'paragraph',
        text: 'Systems engineers must design pipelines with observability and validation at every stage. This means implementing data quality checks between stages, tracking data lineage, and monitoring model performance metrics continuously.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Pipeline Orchestration with DAGs',
      },
      {
        type: 'definition',
        term: 'Directed Acyclic Graph (DAG)',
        definition: 'A graph structure where edges have direction and no cycles exist, used in ML pipelines to represent task dependencies. Each node is a processing step, and edges define the order of execution.',
      },
      {
        type: 'paragraph',
        text: 'Modern ML pipelines are often implemented as directed acyclic graphs (DAGs) of dependent tasks, orchestrated by tools like Apache Airflow, Kubeflow Pipelines, or Prefect. These orchestration systems provide scheduling, dependency management, retry logic, and monitoring capabilities that are essential for reliable operation.',
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'Choosing an Orchestrator',
        text: 'Apache Airflow excels at general-purpose workflow scheduling and has the largest community. Kubeflow Pipelines is purpose-built for ML on Kubernetes with native support for GPU workloads. Prefect offers a modern Python-native API with strong local development experience. Choose based on your infrastructure and team expertise.',
      },
      {
        type: 'code',
        language: 'python',
        code: '# Simplified Airflow DAG for an ML pipeline\nfrom airflow import DAG\nfrom airflow.operators.python import PythonOperator\nfrom datetime import datetime\n\nwith DAG(\'ml_pipeline\', start_date=datetime(2024, 1, 1),\n         schedule_interval=\'@daily\') as dag:\n    ingest = PythonOperator(task_id=\'ingest_data\', python_callable=ingest_fn)\n    features = PythonOperator(task_id=\'compute_features\', python_callable=feature_fn)\n    train = PythonOperator(task_id=\'train_model\', python_callable=train_fn)\n    evaluate = PythonOperator(task_id=\'evaluate\', python_callable=eval_fn)\n\n    ingest >> features >> train >> evaluate',
        caption: 'Example: A simple ML pipeline DAG in Apache Airflow.',
      },
    ],
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
    blocks: [
      {
        type: 'paragraph',
        text: 'ML systems are composed of several key components that must work together seamlessly. The data layer handles storage, retrieval, and transformation of training data and features. The compute layer provides the processing power for training and inference. The model layer encapsulates the trained parameters and inference logic. The serving layer exposes model predictions to applications and users.',
      },
      {
        type: 'table',
        headers: ['Layer', 'Responsibility', 'Key Technologies'],
        rows: [
          ['Data Layer', 'Storage, retrieval, and transformation of training data and features', 'Feast, Tecton, Delta Lake, Apache Hudi'],
          ['Compute Layer', 'Processing power for training and inference workloads', 'Kubernetes, Ray, NVIDIA Triton, AWS SageMaker'],
          ['Model Layer', 'Trained parameters, inference logic, model versioning', 'MLflow, TorchServe, ONNX Runtime'],
          ['Serving Layer', 'Exposes predictions to applications and users', 'REST APIs, gRPC, KServe, Seldon Core'],
        ],
        caption: 'Table 2.2: The four layers of an ML system architecture.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'The Data Layer and Feature Stores',
      },
      {
        type: 'definition',
        term: 'Feature Store',
        definition: 'A centralized platform for storing, managing, and serving machine learning features. Feature stores ensure that the same feature computation is used during both training and serving, solving the critical problem of training-serving skew.',
      },
      {
        type: 'paragraph',
        text: 'The data layer typically includes a feature store that provides a centralized repository for computed features. Feature stores solve the critical problem of feature reuse and consistency, ensuring that the same feature computation is used during both training and serving. Popular feature stores include Feast, Tecton, and built-in solutions from cloud providers.',
      },
      {
        type: 'callout',
        variant: 'note',
        title: 'Why Feature Stores Matter',
        text: 'Without a feature store, teams often reimplement the same feature computation in different languages or frameworks for training (Python/Spark) and serving (Java/Go). Even small numerical differences between implementations can cause training-serving skew that silently degrades model performance. A feature store enforces a single source of truth.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'The Compute Layer',
      },
      {
        type: 'paragraph',
        text: 'The compute layer must be flexible enough to handle diverse workloads. Training workloads are typically batch-oriented and GPU-intensive, while serving workloads are latency-sensitive and must handle variable request rates. Many organizations use Kubernetes to manage these heterogeneous compute requirements with a unified orchestration platform.',
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'Right-Sizing Compute',
        text: 'Training and serving have fundamentally different compute profiles. Training benefits from large GPU instances running for hours, while serving needs smaller instances that can scale horizontally in seconds. Use separate compute pools with autoscaling policies tuned to each workload\'s characteristics.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'The Serving Layer',
      },
      {
        type: 'paragraph',
        text: 'The serving layer is the interface between the ML system and the outside world. It must provide low-latency predictions, handle traffic spikes gracefully, support A/B testing and canary deployments, and enable easy rollback when issues are detected.',
      },
      {
        type: 'list',
        ordered: false,
        items: [
          'REST APIs — Simple HTTP endpoints, widely supported, human-readable JSON payloads',
          'gRPC — Binary protocol with strong typing, lower latency than REST, ideal for microservice communication',
          'Streaming pipelines — Kafka or Pulsar-based inference for high-throughput, event-driven applications',
        ],
      },
      {
        type: 'callout',
        variant: 'example',
        title: 'Canary Deployment Pattern',
        text: 'A team deploys a new recommendation model by routing 5% of traffic to the new version while 95% continues to the existing model. They monitor key metrics (click-through rate, latency p99, error rate) for 24 hours. If the new model performs well, traffic is gradually shifted. If any metric degrades, traffic is instantly routed back to the old model. This pattern limits blast radius while enabling safe iteration.',
      },
    ],
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
    blocks: [
      {
        type: 'paragraph',
        text: 'Every ML system design involves navigating a complex landscape of trade-offs. The most fundamental is the accuracy-latency trade-off: larger, more complex models generally achieve higher accuracy but require more computation and thus higher latency. Finding the right balance depends on the specific application requirements.',
      },
      {
        type: 'definition',
        term: 'Accuracy-Latency Trade-off',
        definition: 'The fundamental tension between model quality and inference speed. Larger, more complex models generally yield better predictions but require more computation time. This trade-off is the most common design constraint in production ML systems.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Latency vs. Throughput',
      },
      {
        type: 'paragraph',
        text: 'The latency-throughput trade-off is another critical consideration. Optimizing for low latency (fast individual predictions) often conflicts with maximizing throughput (predictions per second). Batching requests improves throughput by amortizing overhead but increases latency for individual requests. Dynamic batching strategies attempt to balance these competing objectives.',
      },
      {
        type: 'callout',
        variant: 'note',
        title: 'Dynamic Batching Explained',
        text: 'Dynamic batching collects incoming requests into a batch until either a maximum batch size or a maximum wait time is reached, whichever comes first. This bounds the worst-case latency while still capturing throughput benefits. NVIDIA Triton Inference Server and TensorFlow Serving both support dynamic batching out of the box.',
      },
      {
        type: 'equation',
        latex: '\\text{Throughput} = \\frac{\\text{Batch Size}}{\\text{Latency per Batch}} = \\frac{B}{L_\\text{batch}}',
        label: 'Equation 2.1: The relationship between throughput, batch size, and per-batch latency. Increasing batch size improves throughput up to hardware saturation.',
      },
      {
        type: 'table',
        headers: ['Trade-off', 'Optimize For A', 'Optimize For B', 'Resolution Strategy'],
        rows: [
          ['Accuracy vs. Latency', 'Large model, high accuracy', 'Small model, fast inference', 'Knowledge distillation, quantization'],
          ['Latency vs. Throughput', 'Single-request, low latency', 'Batched, high throughput', 'Dynamic batching with timeout'],
          ['Quality vs. Cost', 'Best model, any compute cost', 'Cheapest infrastructure', 'Spot instances, model compression'],
          ['Accuracy vs. Maintainability', 'Complex ensemble', 'Single simple model', 'Distill ensemble into one model'],
        ],
        caption: 'Table 2.3: Key trade-offs in ML system design and common resolution strategies.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Cost as a Pervasive Constraint',
      },
      {
        type: 'paragraph',
        text: 'Cost is a pervasive constraint that influences every design decision. Cloud compute costs for training and serving can be substantial. Organizations must balance model quality against compute cost, considering factors like instance types, spot versus on-demand pricing, and the total cost of ownership for different infrastructure choices.',
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'The Hidden Cost of Complexity',
        text: 'A complex ensemble of models may achieve the best accuracy on benchmarks but be nearly impossible to debug and maintain in production. The ML systems engineer must consider the long-term operational cost of complexity — on-call burden, debugging time, deployment risk — alongside short-term performance gains. In many cases, a simpler model that is 1% less accurate but 10x easier to maintain is the better engineering choice.',
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'Start Simple, Complicate Later',
        text: 'Begin with the simplest model that meets your requirements. Use a logistic regression or small neural network as a baseline. Only add complexity (deeper models, ensembles, feature crosses) when you have evidence that the simple approach falls short. This principle minimizes cost and maximizes maintainability.',
      },
      {
        type: 'paragraph',
        text: 'Reliability and maintainability are trade-offs that often receive insufficient attention. The ML systems engineer must consider the long-term operational cost of complexity alongside short-term performance gains.',
      },
    ],
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
    blocks: [
      {
        type: 'paragraph',
        text: 'Understanding system performance requires precise measurement of key metrics. Latency measures the time from when a request is received to when the response is returned. It is typically reported as percentiles (p50, p95, p99) rather than averages, because tail latency can dramatically impact user experience.',
      },
      {
        type: 'definition',
        term: 'Tail Latency',
        definition: 'The response time experienced by the slowest requests, typically measured at the 99th percentile (p99) or 99.9th percentile (p99.9). Tail latency disproportionately affects user experience in large-scale systems where even a small percentage of slow requests impacts many users.',
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Why Averages Lie',
        text: 'Average latency can mask severe performance problems. A system with 10ms average latency might have a p99 of 500ms, meaning 1 in 100 users waits 50x longer than average. In a system handling 10,000 requests per second, that means 100 users every second experience unacceptable delays. Always report and monitor percentile latencies.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Throughput and Hardware Utilization',
      },
      {
        type: 'paragraph',
        text: 'Throughput measures the total number of predictions the system can produce per unit time. It depends on factors like hardware capabilities, model complexity, batch size, and the efficiency of the serving stack. Maximizing throughput is essential for cost-effective operation at scale.',
      },
      {
        type: 'table',
        headers: ['Metric', 'What It Measures', 'Unit', 'Why It Matters'],
        rows: [
          ['p50 Latency', 'Median response time', 'Milliseconds', 'Typical user experience'],
          ['p95 Latency', '95th percentile response time', 'Milliseconds', 'Most users\' worst experience'],
          ['p99 Latency', '99th percentile response time', 'Milliseconds', 'Tail experience, SLO target'],
          ['Throughput (QPS)', 'Queries processed per second', 'Requests/sec', 'System capacity and cost efficiency'],
          ['GPU Utilization', 'Fraction of GPU compute used', 'Percentage', 'Hardware cost efficiency'],
          ['Error Rate', 'Fraction of failed requests', 'Percentage', 'System reliability'],
        ],
        caption: 'Table 2.4: Essential performance metrics for ML serving systems.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'ML-Specific Metrics',
      },
      {
        type: 'paragraph',
        text: 'Beyond latency and throughput, ML systems must track model-specific metrics like prediction quality, feature freshness, and data distribution statistics. These metrics form the basis of a comprehensive monitoring strategy that can detect issues before they impact end users.',
      },
      {
        type: 'list',
        ordered: false,
        items: [
          'Prediction quality — Accuracy, precision, recall, AUC tracked on live traffic',
          'Feature freshness — Age of the most recent feature values used in predictions',
          'Data distribution — Statistical measures (mean, variance, quantiles) of input features to detect drift',
          'Model staleness — Time since the model was last retrained',
        ],
      },
      {
        type: 'heading',
        level: 3,
        text: 'Service Level Objectives (SLOs)',
      },
      {
        type: 'definition',
        term: 'Service Level Objective (SLO)',
        definition: 'A measurable target for system performance or reliability, such as "99th percentile latency under 50ms" or "model accuracy above 92%." SLOs define acceptable operational behavior and are the basis for alerts, on-call response, and capacity planning.',
      },
      {
        type: 'paragraph',
        text: 'Service level objectives (SLOs) formalize performance requirements for ML systems. Defining and monitoring SLOs is a best practice borrowed from site reliability engineering that helps ML teams operate with accountability and transparency.',
      },
      {
        type: 'callout',
        variant: 'example',
        title: 'SLOs for a Search Ranking Model',
        text: 'A search team defines the following SLOs: (1) 99% of inference requests complete within 50ms, (2) model NDCG@10 remains above 0.65 on daily evaluation, (3) feature freshness is under 15 minutes for real-time features. When any SLO is breached, an automated alert triggers the on-call engineer. These concrete targets transform vague quality goals into actionable engineering requirements.',
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'Set SLOs Before You Build',
        text: 'Define latency, throughput, and quality SLOs before choosing a model architecture or infrastructure. These constraints narrow the design space and prevent wasted effort on solutions that cannot meet production requirements.',
      },
    ],
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
    blocks: [
      {
        type: 'paragraph',
        text: 'The full ML stack can be visualized as a layered architecture, with each layer building on the capabilities of the layer below. At the bottom is hardware: CPUs, GPUs, TPUs, and specialized accelerators. Above that is the systems software layer, including operating systems, device drivers, and runtime libraries.',
      },
      {
        type: 'definition',
        term: 'ML Stack',
        definition: 'The complete layered architecture of hardware, systems software, frameworks, infrastructure, and application components that together comprise a production ML system. Each layer abstracts the complexity below while exposing capabilities to the layer above.',
      },
      {
        type: 'table',
        headers: ['Layer', 'Components', 'Example Tools'],
        rows: [
          ['Application', 'Serving endpoints, monitoring dashboards, feedback collection', 'Grafana, Streamlit, custom APIs'],
          ['Infrastructure', 'Orchestration, distributed computing, cloud services', 'Kubernetes, Ray, AWS SageMaker, GCP Vertex AI'],
          ['Higher-Level Tools', 'Experiment management, hyperparameter tuning, AutoML', 'MLflow, Optuna, Weights & Biases, Auto-sklearn'],
          ['Framework', 'Model definition, training, evaluation APIs', 'PyTorch, TensorFlow, JAX, Keras'],
          ['Systems Software', 'OS, device drivers, runtime libraries, compilers', 'CUDA, cuDNN, TensorRT, XLA'],
          ['Hardware', 'Processing units and accelerators', 'CPUs, GPUs (NVIDIA), TPUs (Google), custom ASICs'],
        ],
        caption: 'Table 2.5: Layers of the full ML stack from application to hardware.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'The Framework Layer',
      },
      {
        type: 'paragraph',
        text: 'The framework layer provides high-level APIs for defining, training, and evaluating models. Frameworks like PyTorch, TensorFlow, and JAX abstract away the complexity of hardware-specific optimizations while still providing performance. Above frameworks sit higher-level tools for experiment management, hyperparameter tuning, and AutoML.',
      },
      {
        type: 'callout',
        variant: 'note',
        title: 'Framework Convergence',
        text: 'The ML framework landscape has consolidated significantly. PyTorch dominates research and is increasingly adopted in production. TensorFlow retains a strong presence in production environments, particularly for mobile and edge deployment via TensorFlow Lite. JAX, backed by Google, offers a functional programming model with strong support for XLA compilation and TPU hardware.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Infrastructure and Application Layers',
      },
      {
        type: 'paragraph',
        text: 'The infrastructure layer encompasses orchestration platforms, distributed computing systems, and cloud services. This layer handles resource allocation, scheduling, scaling, and fault tolerance. Tools like Kubernetes, Ray, and cloud-managed ML services operate at this layer.',
      },
      {
        type: 'paragraph',
        text: 'At the top of the stack are the application-specific components: model serving endpoints, monitoring dashboards, and feedback collection systems. Understanding how all these layers interact is essential for diagnosing performance issues, optimizing costs, and building reliable ML systems.',
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Cross-Layer Bottlenecks',
        text: 'A bottleneck at any layer can limit the performance of the entire stack. A slow data loading pipeline (infrastructure) can leave expensive GPUs (hardware) idle. An unoptimized model graph (framework) can negate the benefits of a powerful accelerator. Always profile across layers when diagnosing performance issues.',
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'Profiling Top-Down',
        text: 'When diagnosing performance issues, start at the application layer and work downward. Check serving latency first, then framework-level profiling (torch.profiler, TensorFlow Profiler), then hardware utilization (nvidia-smi, GPU memory). This top-down approach quickly identifies which layer is the bottleneck.',
      },
      {
        type: 'code',
        language: 'bash',
        code: '# Quick hardware utilization check\nnvidia-smi --query-gpu=utilization.gpu,utilization.memory,memory.used \\\n  --format=csv -l 1\n\n# PyTorch profiler for framework-level bottlenecks\n# python -c "import torch; torch.profiler.profile(...)"',
        caption: 'Quick commands for checking GPU utilization and profiling.',
      },
    ],
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
