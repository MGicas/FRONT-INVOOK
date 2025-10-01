interface InsideStatesValues {
    count: number;
    percentage: number;
    ids: string[] | null;
}

type OpenStartedToday = InsideStatesValues;
type ClosedOpenedToday = InsideStatesValues;
type OverdueOpen = InsideStatesValues;

export interface Stats {
    date: string;
    open_started_today: OpenStartedToday;
    closed_opened_today: ClosedOpenedToday;
    overdue_open: OverdueOpen;
    total: number;
}