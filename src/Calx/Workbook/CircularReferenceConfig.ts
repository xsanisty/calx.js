export interface CircularReferenceConfig {
    /** Enable iterative calculation for circular references */
    enabled: boolean;
    /** Maximum number of iterations to perform */
    maxIterations: number;
    /** Maximum change threshold - stop when all changes are below this value */
    maxChange: number;
}
