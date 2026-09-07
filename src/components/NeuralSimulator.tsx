'use strict';

/**
 * @file NeuralSimulator.tsx
 * @description Core optimized export module for the Neural Simulator and AGI Cognitive Dashboard components.
 * @version 4.9.1
 * @module NeuralSimulator
 */

export type { NeuralSimulatorProps, AgiCognitiveDashboardProps } from './AgiCognitiveDashboard';

export {
  NeuralSimulator,
  AgiCognitiveDashboard,
} from './AgiCognitiveDashboard';

import { NeuralSimulator as DefaultNeuralSimulator } from './AgiCognitiveDashboard';
export default DefaultNeuralSimulator;