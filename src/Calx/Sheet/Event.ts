export enum Event {
    ELEMENT_ATTACHED    = 'element.attached',
    ELEMENT_DETACHED    = 'element.detached',

    CALCULATION_STARTED = 'calculation.started',
    CALCULATION_PAUSED  = 'calculation.paused',
    CALCULATION_RESUMED = 'calculation.resumed',
    CALCULATION_ENDED   = 'calculation.ended',

    CELL_CREATED        = 'cell.created',
    CELL_REMOVED        = 'cell.removed'
}