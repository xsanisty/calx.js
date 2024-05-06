/**
 * Available sheet events.
 */
export enum SheetEvent {
    CALCULATION_STARTED     = 'calculation.started',
    CALCULATION_PAUSED      = 'calculation.paused',
    CALCULATION_RESUMED     = 'calculation.resumed',
    CALCULATION_FINISHED    = 'calculation.finished',

    CELL_ADDED          = 'cell.added',
    CELL_REMOVED        = 'cell.removed',
    CELL_CREATED        = "CELL_CREATED",

    ELEMENT_ATTACHED    = 'element.attached',
    ELEMENT_DETACHED    = 'element.detached',
}

export enum SheetState {
    CALCULATION_STARTED     = 'calculation.started',
    CALCULATION_PAUSED      = 'calculation.paused',
    CALCULATION_RESUMED     = 'calculation.resumed',
    CALCULATION_FINISHED    = 'calculation.finished',
    CALCULATION_IDLE        = 'calculation.idle',
}