'use client';

import { Suspense, lazy, useMemo } from 'react';
import type { ChapterMeta } from '@/types/chapter';

export interface VisualizationProps {
  activeSection: number;
  onExerciseComplete: () => void;
}

// Lazy load visualizations - entries added as viz files are created
const vizMap: Record<string, () => Promise<{ default: React.ComponentType<VisualizationProps> }>> = {
  'ml-pipeline-flow': () => import('@/components/visualizations/ch01-introduction/MLPipelineFlow'),
  'neural-network-playground': () => import('@/components/visualizations/ch03-dl-primer/NeuralNetworkPlayground'),
  'loss-surface-3d': () => import('@/components/visualizations/ch08-ai-training/LossSurface3D'),
  'system-architecture': () => import('@/components/visualizations/ch02-ml-systems/SystemArchitectureBuilder'),
  'architecture-comparison': () => import('@/components/visualizations/ch04-dnn-architectures/ArchitectureComparison'),
  'workflow-designer': () => import('@/components/visualizations/ch05-model-lifecycle/WorkflowDesigner'),
  'data-pipeline': () => import('@/components/visualizations/ch06-data-engineering/DataPipelineSimulator'),
  'framework-comparison': () => import('@/components/visualizations/ch07-frameworks/FrameworkComparison'),
  'efficiency-frontier': () => import('@/components/visualizations/ch09-efficient-ai/EfficiencyFrontier'),
  'quantization-pruning': () => import('@/components/visualizations/ch10-model-optimizations/QuantizationPruningDemo'),
  'roofline-model': () => import('@/components/visualizations/ch11-hw-acceleration/RooflineModel'),
  'mlperf-dashboard': () => import('@/components/visualizations/ch12-benchmarking/MLPerfDashboard'),
  'cicd-pipeline': () => import('@/components/visualizations/ch13-training-infra/CICDPipelineSimulator'),
  'device-resource-allocator': () => import('@/components/visualizations/ch14-deployment/DeviceResourceAllocator'),
  'adversarial-playground': () => import('@/components/visualizations/ch15-security/AdversarialPlayground'),
  'noise-injection': () => import('@/components/visualizations/ch16-robustness/NoiseInjectionTester'),
  'bias-calculator': () => import('@/components/visualizations/ch17-fairness/BiasMetricCalculator'),
  'carbon-calculator': () => import('@/components/visualizations/ch18-sustainability/CarbonFootprintCalculator'),
  'impact-explorer': () => import('@/components/visualizations/ch19-applications/ImpactCaseExplorer'),
  'timeline-mapper': () => import('@/components/visualizations/ch20-responsible-ai/AGITimelineMapper'),
  'knowledge-map': () => import('@/components/visualizations/ch21-conclusion/KnowledgeMap'),
};

interface StickyVisualizationProps {
  chapter: ChapterMeta;
  activeSection: number;
  onExerciseComplete: () => void;
}

export default function StickyVisualization({
  chapter,
  activeSection,
  onExerciseComplete,
}: StickyVisualizationProps) {
  const VizComponent = useMemo(() => {
    const loader = vizMap[chapter.vizType];
    if (!loader) return null;
    return lazy(loader);
  }, [chapter.vizType]);

  if (!VizComponent) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-center gap-4">
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl border"
          style={{ borderColor: 'rgba(74,106,255,0.2)', backgroundColor: 'rgba(74,106,255,0.05)' }}
        >
          {String(chapter.number).padStart(2, '0')}
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">{chapter.title}</p>
          <p className="text-xs text-muted-foreground mt-1">Interactive visualization coming soon</p>
        </div>
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      }
    >
      <VizComponent
        activeSection={activeSection}
        onExerciseComplete={onExerciseComplete}
      />
    </Suspense>
  );
}
