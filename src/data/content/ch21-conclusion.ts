import type { ChapterSection, GlossaryTerm } from '@/types/chapter';

export const sections: ChapterSection[] = [
  {
    id: 'ch21-s1',
    heading: 'Synthesis of Key Themes',
    body: 'Throughout this course, several key themes have emerged that define the practice of ML systems engineering. The most fundamental is that building production ML systems requires a holistic perspective that spans algorithms, hardware, software, data, and operations. No single component can be understood or optimized in isolation.\n\nThe theme of trade-off management recurs in every chapter. Accuracy versus latency, model size versus quality, training cost versus generalization, privacy versus utility, efficiency versus flexibility: every design decision involves navigating these tensions. The skill of an ML systems engineer lies not in finding perfect solutions but in making informed trade-offs that best serve the application\'s needs.\n\nThe importance of the full lifecycle, from data collection through deployment and monitoring, is another unifying theme. The majority of effort in production ML is spent outside of model development: in data engineering, infrastructure management, monitoring, and maintenance. Engineers who only focus on model accuracy miss the larger systems context that determines real-world success.\n\nFinally, the theme of responsible engineering runs throughout: building systems that are not only technically excellent but also fair, secure, private, sustainable, and beneficial. As ML systems become more capable and more pervasive, the responsibility of the engineers who build them grows proportionally.',
    order: 0,
    keyConcepts: [
      { term: 'Systems Perspective', definition: 'The holistic approach to ML engineering that considers how algorithms, hardware, software, data, and operations interact and influence each other.' },
      { term: 'Trade-off Management', definition: 'The engineering skill of making informed decisions between competing objectives, central to all ML system design.' },
    ],
  },
  {
    id: 'ch21-s2',
    heading: 'Key Takeaways from the Course',
    body: 'The foundations section established that ML systems are far more than models. They are complex systems of data pipelines, compute infrastructure, serving systems, and monitoring tools. Understanding deep learning from a systems perspective means knowing not just how models work but how they interact with hardware, memory, and the broader software stack.\n\nThe design principles section showed that systematic approaches to ML development, including experiment tracking, data engineering, framework selection, and training strategies, are essential for reproducibility, collaboration, and efficiency. These practices separate professional ML engineering from ad-hoc experimentation.\n\nThe performance engineering section demonstrated that efficiency is a first-class concern, not an afterthought. Techniques like quantization, pruning, and hardware-aware optimization can reduce costs by orders of magnitude without sacrificing quality. Understanding the hardware landscape, from GPUs to TPUs to MCUs, is essential for optimal deployment.\n\nThe deployment and trustworthy AI sections emphasized that production ML requires robust operations, security, fairness, and sustainability practices. These concerns are not optional extras but core requirements for systems that serve real users and impact real lives.',
    order: 1,
  },
  {
    id: 'ch21-s3',
    heading: 'Career Paths in ML Systems',
    body: 'ML systems engineering is a rapidly growing field with diverse career paths. ML engineers focus on building and maintaining production ML pipelines, combining software engineering skills with ML knowledge. ML infrastructure engineers build the platforms and tools that enable ML teams to develop and deploy models efficiently.\n\nResearch engineers bridge the gap between ML research and production, implementing novel algorithms in scalable systems. MLOps engineers specialize in the operational aspects of ML, including CI/CD, monitoring, and reliability. Data engineers build the data pipelines and platforms that feed ML systems with clean, reliable data.\n\nSpecialization is possible in areas like model optimization (quantization, pruning, efficient architectures), hardware-software co-design, ML security, fairness and ethics, or specific application domains like healthcare or climate. The field is broad enough that practitioners can find niches that match their interests and strengths.\n\nThe demand for ML systems skills far outpaces supply. Organizations across every industry are deploying ML systems and need engineers who understand not just algorithms but the complete systems context. Continuous learning is essential because the field evolves rapidly, with new architectures, frameworks, and deployment paradigms emerging regularly.',
    order: 2,
    keyConcepts: [
      { term: 'ML Engineer', definition: 'A role focused on building, deploying, and maintaining production ML systems, combining software engineering expertise with ML knowledge.' },
      { term: 'MLOps Engineer', definition: 'A specialization focused on the operational aspects of ML systems, including automation, monitoring, and reliability of model deployment and serving.' },
    ],
  },
  {
    id: 'ch21-s4',
    heading: 'Continuing Your Learning Journey',
    body: 'The field of ML systems moves fast, and the material in this course represents a foundation to build upon, not a comprehensive endpoint. Staying current requires engaging with multiple learning channels: research papers, open-source projects, industry conferences, and hands-on experimentation.\n\nPractical experience is the most effective teacher for ML systems engineering. Building real systems, even small ones, reveals challenges that are difficult to appreciate from reading alone. Contributing to open-source ML projects (PyTorch, TensorFlow, Hugging Face, MLflow) provides exposure to production-quality code and engineering practices.\n\nKey conferences and venues for ML systems include MLSys, NeurIPS (Systems for ML workshops), OSDI, and SOSP. Industry blogs from Google, Meta, Microsoft, and NVIDIA regularly publish insights on large-scale ML systems. Following these venues helps practitioners stay abreast of developments at the frontier.\n\nCommunity engagement accelerates learning. Participating in ML communities (forums, Discord servers, local meetups), sharing knowledge through blog posts and talks, and mentoring others all deepen understanding while building professional networks. The ML systems community is collaborative and welcoming, making it a rewarding field both technically and personally.',
    order: 3,
    keyConcepts: [
      { term: 'MLSys Conference', definition: 'The premier academic conference focused on ML systems research, covering topics from training optimization to deployment infrastructure.' },
      { term: 'Open-Source Contribution', definition: 'Contributing code, documentation, or bug reports to open-source ML projects, a highly effective way to learn production ML engineering practices.' },
    ],
  },
  {
    id: 'ch21-s5',
    heading: 'Building the Future of ML Systems',
    body: 'The ML systems field is at an inflection point. Foundation models are reshaping what is possible, new hardware is redefining performance boundaries, and societal expectations are evolving around safety, fairness, and sustainability. The engineers who build the next generation of ML systems will shape how AI impacts the world.\n\nOpen challenges abound. How do we make large models accessible on resource-constrained devices? How do we ensure that AI systems are fair and beneficial across diverse populations? How do we reduce the environmental footprint of ML while capabilities continue to grow? How do we build AI systems that are reliable and safe as they become more capable and autonomous?\n\nThe interdisciplinary nature of ML systems engineering is one of its greatest strengths. Progress requires knowledge spanning computer architecture, distributed systems, optimization, statistics, and increasingly ethics and policy. Engineers who can synthesize across these domains are uniquely positioned to make impactful contributions.\n\nAs you continue your journey in ML systems, remember that the goal is not just technical excellence but building systems that serve humanity well. The choices made by ML systems engineers, from architecture selection to fairness criteria to deployment targets, have real consequences for real people. Bringing both technical rigor and ethical awareness to these decisions is the highest aspiration of the field.',
    order: 4,
    keyConcepts: [
      { term: 'ML Systems Engineering', definition: 'The interdisciplinary practice of designing, building, and operating the complete infrastructure for production ML, spanning hardware, software, data, and operations.' },
    ],
  },
];

export const glossary: GlossaryTerm[] = [
  { term: 'ML Systems Engineering', definition: 'The holistic discipline of designing, building, and maintaining production ML systems across all layers of the stack.' },
  { term: 'Trade-off Analysis', definition: 'The systematic evaluation of competing design objectives to find the best balance for a specific application.' },
  { term: 'Production ML', definition: 'Machine learning systems deployed in real-world applications serving actual users, as opposed to research prototypes.' },
  { term: 'Technical Debt', definition: 'The accumulated cost of shortcuts and suboptimal decisions that increase future maintenance burden.' },
  { term: 'Continuous Learning', definition: 'The ongoing practice of staying current with new developments, tools, and best practices in the rapidly evolving ML field.' },
];

export const keyTakeaways: string[] = [
  'ML systems engineering is a holistic discipline requiring knowledge across algorithms, hardware, software, data, and operations.',
  'Trade-off management between competing objectives is the most important skill in ML systems design.',
  'The full lifecycle perspective, from data to deployment to monitoring, determines real-world system success.',
  'Responsible engineering that considers fairness, security, privacy, and sustainability is a core requirement, not an optional extra.',
  'Continuous learning through hands-on practice, community engagement, and staying current with research is essential in this rapidly evolving field.',
];
