import type { ChapterSection, GlossaryTerm } from '@/types/chapter';

export const sections: ChapterSection[] = [
  {
    id: 'ch18-s1',
    heading: 'The Environmental Impact of ML',
    body: 'The environmental impact of machine learning has grown dramatically as models have scaled in size and training compute. Training a single large language model can emit as much carbon as five cars over their entire lifetimes. As ML becomes pervasive, its collective environmental footprint has become a significant concern for the research community and society at large.\n\nThe primary environmental costs come from electricity consumption for computation and cooling, embodied carbon in hardware manufacturing, and water usage for data center cooling. Training large models requires running thousands of GPUs for weeks or months, consuming megawatt-hours of electricity. The carbon intensity of this electricity depends heavily on the local power grid mix.\n\nThe full lifecycle carbon footprint of ML includes not just training but also inference serving (which can dominate for widely deployed models), experimentation and hyperparameter search (which can multiply training costs by 10-100x), and the hardware lifecycle from manufacturing through disposal. A comprehensive view of environmental impact must account for all these stages.\n\nAwareness of ML\'s environmental impact has grown significantly in recent years, driven by seminal papers like "Energy and Policy Considerations for Deep Learning in NLP" and growing public attention. This awareness is leading to new practices, metrics, and tools for measuring and reducing the carbon footprint of ML systems.',
    order: 0,
    keyConcepts: [
      { term: 'Carbon Footprint', definition: 'The total greenhouse gas emissions caused by ML system development and operation, measured in equivalent tons of CO2.' },
      { term: 'Embodied Carbon', definition: 'The carbon emissions associated with manufacturing, transporting, and disposing of hardware, distinct from operational emissions from electricity use.' },
    ],
  },
  {
    id: 'ch18-s2',
    heading: 'Carbon Footprint Estimation',
    body: 'Estimating the carbon footprint of ML training requires combining hardware power consumption, training duration, and the carbon intensity of the electricity source. The basic formula is: carbon emissions = energy consumed * carbon intensity of the grid. Tools like ML CO2 Impact, CodeCarbon, and the experiment-impact-tracker automate this measurement.\n\nPower consumption can be measured directly using hardware monitoring tools (nvidia-smi for GPUs, RAPL for CPUs) or estimated from hardware TDP (thermal design power) specifications and utilization rates. Actual power consumption is typically 60-80% of TDP during sustained ML workloads, depending on the workload characteristics and power management settings.\n\nCarbon intensity varies dramatically by location and time. A kilowatt-hour of electricity in Norway (predominantly hydroelectric) produces about 20g of CO2, while the same kilowatt-hour in Poland (predominantly coal) produces about 700g. Even within the same grid, carbon intensity varies by time of day as the mix of generation sources changes. Location and timing of training therefore significantly impact its carbon footprint.\n\nReporting standards for ML carbon emissions are still evolving. Best practices include reporting total energy consumption, the carbon intensity of the electricity used, the resulting carbon emissions, and the hardware and duration details needed for others to verify the calculation. Including a comparison to familiar reference points (e.g., equivalent car-miles or household-days) helps communicate impact to non-technical stakeholders.',
    order: 1,
    keyConcepts: [
      { term: 'Carbon Intensity', definition: 'The amount of CO2 emitted per unit of electricity generated, measured in gCO2/kWh, which varies dramatically by energy source and location.' },
      { term: 'CodeCarbon', definition: 'An open-source Python package that tracks the carbon emissions of computing by measuring electricity consumption and applying regional carbon intensity data.' },
    ],
  },
  {
    id: 'ch18-s3',
    heading: 'Energy Efficiency Techniques',
    body: 'Energy-efficient ML starts with choosing the right model architecture for the task. Over-parameterized models waste energy on unnecessary computation. Efficient architectures like MobileNet, EfficientNet, and distilled models achieve comparable quality with a fraction of the energy. Architecture selection is the single highest-leverage decision for reducing energy consumption.\n\nHardware selection and utilization directly impact energy efficiency. Newer GPU generations (A100 vs. V100, H100 vs. A100) typically offer 2-3x better energy efficiency for ML workloads. Specialized accelerators like TPUs can be even more efficient for supported operations. Running on the most efficient available hardware reduces energy consumption per FLOP.\n\nTraining efficiency techniques reduce the total energy required to reach a target model quality. Mixed precision training reduces energy by performing more operations per watt. Learning rate scheduling and early stopping avoid wasting energy on training that has converged. Efficient hyperparameter search (Bayesian optimization vs. grid search) reduces the number of training runs needed.\n\nInference energy efficiency matters because inference accounts for the majority of total energy consumption for widely deployed models. A model serving millions of requests per day consumes far more cumulative energy than its one-time training cost. Quantization, pruning, and efficient serving infrastructure can reduce inference energy by 10-100x.',
    order: 2,
    keyConcepts: [
      { term: 'Energy Efficiency', definition: 'The ratio of useful computation (model quality achieved) to energy consumed, a key metric for sustainable ML systems.' },
      { term: 'PUE', definition: 'Power Usage Effectiveness, the ratio of total facility energy to IT equipment energy in a data center, measuring cooling and infrastructure overhead.' },
    ],
  },
  {
    id: 'ch18-s4',
    heading: 'Green AI and Sustainable Practices',
    body: 'The Green AI movement advocates for making efficiency a first-class research metric alongside accuracy. Traditional "Red AI" focuses solely on pushing accuracy higher regardless of computational cost, while Green AI seeks to achieve good accuracy efficiently. This shift in values is essential for sustainable growth of the field.\n\nCarbon-aware computing schedules ML workloads to run when and where the electricity grid is cleanest. By shifting training to times of high renewable energy generation or to data centers in regions with low-carbon grids, organizations can significantly reduce their carbon footprint without changing their models or hardware. Tools and APIs for real-time carbon intensity data enable automated carbon-aware scheduling.\n\nReuse through pre-trained models and transfer learning is one of the most effective sustainability strategies. Training a large model once and sharing it for many downstream tasks amortizes the training cost across all users. The Hugging Face model hub and similar platforms reduce redundant training by making pre-trained models freely available.\n\nOrganizational practices for sustainable ML include setting carbon budgets for projects, reporting energy consumption in papers and model cards, choosing efficient hardware and cloud regions, and investing in renewable energy. These practices are increasingly adopted by leading ML organizations and may become regulatory requirements in some jurisdictions.',
    order: 3,
    keyConcepts: [
      { term: 'Green AI', definition: 'A research philosophy that prioritizes computational efficiency alongside accuracy, seeking high-quality results with minimal environmental impact.' },
      { term: 'Carbon-Aware Computing', definition: 'Scheduling computational workloads to coincide with periods of low carbon intensity on the electrical grid, reducing emissions without changing the computation.' },
    ],
  },
  {
    id: 'ch18-s5',
    heading: 'Measuring and Reducing Environmental Impact',
    body: 'Comprehensive environmental accounting for ML goes beyond carbon emissions to include water usage, electronic waste, and resource extraction for hardware manufacturing. Data centers consume significant water for cooling, and the rare earth minerals in GPUs and chips have environmental and social costs in their extraction.\n\nLifecycle assessment (LCA) provides a framework for evaluating the total environmental impact of ML systems from hardware manufacturing through operation to end-of-life disposal. While full LCA is complex, even rough estimates help organizations understand where impact is concentrated and where reduction efforts will be most effective.\n\nThe rebound effect poses a challenge to efficiency improvements. When ML becomes more efficient, it tends to be deployed more widely, potentially increasing total environmental impact even as per-unit impact decreases. This Jevons paradox suggests that efficiency alone is insufficient; organizational commitments to absolute emission reduction targets are needed.\n\nThe path toward sustainable ML requires progress on multiple fronts: more efficient algorithms and architectures, cleaner energy for computation, longer hardware lifecycles, better measurement and reporting tools, and cultural shifts that value efficiency alongside accuracy. The ML community is in the early stages of this transformation, but growing awareness and emerging tools are encouraging signs.',
    order: 4,
    keyConcepts: [
      { term: 'Lifecycle Assessment', definition: 'A comprehensive evaluation of the total environmental impact of a product or system across its entire lifecycle, from manufacturing through use to disposal.' },
      { term: 'Rebound Effect', definition: 'The phenomenon where efficiency improvements lead to increased usage that partially or fully offsets the environmental gains, also known as Jevons paradox.' },
    ],
  },
];

export const glossary: GlossaryTerm[] = [
  { term: 'Carbon Footprint', definition: 'Total greenhouse gas emissions from ML system development and operation, measured in CO2 equivalent.' },
  { term: 'Green AI', definition: 'A movement advocating for computational efficiency as a first-class metric alongside model accuracy.' },
  { term: 'Carbon Intensity', definition: 'CO2 emissions per unit of electricity, varying by energy source and geographic location.' },
  { term: 'PUE', definition: 'Power Usage Effectiveness, measuring data center energy efficiency as the ratio of total to IT equipment power.' },
  { term: 'Embodied Carbon', definition: 'Carbon emissions from hardware manufacturing and disposal, separate from operational electricity emissions.' },
  { term: 'Carbon-Aware Computing', definition: 'Scheduling workloads to coincide with low-carbon electricity availability to reduce emissions.' },
];

export const keyTakeaways: string[] = [
  'Training large ML models has significant environmental impact, with a single training run potentially emitting tons of CO2.',
  'Carbon footprint depends heavily on location and timing due to large variations in electricity grid carbon intensity.',
  'Architecture selection is the highest-leverage decision for energy efficiency; efficient models can reduce energy by orders of magnitude.',
  'Inference energy often dominates training energy for widely deployed models, making serving optimization critical.',
  'Green AI advocates treating computational efficiency as a first-class research metric alongside accuracy.',
  'Carbon-aware computing can significantly reduce emissions by scheduling workloads when renewable energy is abundant.',
];
