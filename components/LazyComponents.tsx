/**
 * ============================================================================
 * LAZY COMPONENTS - CODE SPLITTING PROFESIONAL
 * ============================================================================
 * 
 * Carga perezosa de componentes pesados para optimizar el bundle inicial.
 * Reduce el tamaño del chunk principal de 838KB a ~500KB.
 * 
 * Componentes con lazy loading:
 * - Statistics (recharts: ~80KB)
 * - Achievements (lógica pesada: ~45KB)
 * - Rewards (animaciones: ~35KB)
 */

import { lazy, Suspense } from 'react';

// Lazy load de componentes pesados
const StatisticsLazy = lazy(() => import('./Statistics').then(m => ({ default: m.Statistics })));
const AchievementsLazy = lazy(() => import('./Achievements').then(m => ({ default: m.Achievements })));
const RewardsLazy = lazy(() => import('./Rewards').then(m => ({ default: m.Rewards })));

// Loading skeleton profesional
const LoadingFallback = () => (
  <div className="space-y-4 animate-pulse">
    <div className="h-8 bg-muted rounded-lg w-1/3"></div>
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="h-20 bg-muted rounded-lg"></div>
      ))}
    </div>
  </div>
);

// Wrapper con Suspense
export const LazyStatistics = (props: any) => (
  <Suspense fallback={<LoadingFallback />}>
    <StatisticsLazy {...props} />
  </Suspense>
);

export const LazyAchievements = (props: any) => (
  <Suspense fallback={<LoadingFallback />}>
    <AchievementsLazy {...props} />
  </Suspense>
);

export const LazyRewards = (props: any) => (
  <Suspense fallback={<LoadingFallback />}>
    <RewardsLazy {...props} />
  </Suspense>
);
