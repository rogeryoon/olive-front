import { OrderShipOutSummaryUnitDto as OrderShipOutSummaryUnit } from './order-ship-out-summary-unit.model';

export class OrderShipOutSummary {
    totalCountIn: number;
    totalCountOut: number;

    warehouses: OrderShipOutSummaryUnit[];
    marketSellers: OrderShipOutSummaryUnit[];
}
