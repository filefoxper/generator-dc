import {useMemo, useRef, useState} from "react";

export type Option<T> = {
    key?: keyof T
}

export type SelectionStatus = 'ALL' | 'NONE' | 'PART';

export type SelectionMethods<T> = {
    update(range: Array<T>, selected?: Array<T>): void,
    select(selection: Array<T>): void,
    unSelect(selection: Array<T>): void,
    selectAll(): void,
    unSelectAll(): void,
    toggle(selection: Array<T>): void,
    toggleAll(): void,
};

function computeSelected<T>(range: Array<T>, selection: Array<T>, option: Option<T>): Array<T> {
    const {key} = option;
    if (!key) {
        const selectedSet = new Set<T>(selection);
        return range.filter((d) => selectedSet.has(d));
    }
    const keys: Array<string | undefined> = selection.map((d) => {
        const keyData = d[key];
        return typeof keyData === 'string' ? keyData : undefined;
    });
    const availableKeys = keys.filter((o): o is string => typeof o === 'string');
    const selectedKeySet = new Set<string>(availableKeys);
    return range.filter((d) => {
        const keyData = d[key];
        if (typeof keyData !== 'string') {
            return false;
        }
        return selectedKeySet.has(keyData);
    });
}

export class Selection<T> {

    range: Array<T>;

    private selection: Array<T>;

    private option: Option<T>;

    constructor(range: Array<T>, selected?: Array<T> | Option<T>, opt?: Option<T>) {
        const selection: Array<T> = Array.isArray(selected) ? selected : [];
        const option = selected && !Array.isArray(selected) ? selected : opt;
        this.range = range;
        this.selection = selection;
        this.option = option || {};
    }

    get current() {
        this.selection = computeSelected(this.range, this.selection, this.option);
        return this.selection;
    }

    update(range: Array<T>, selected?: Array<T>) {
        this.range = range;
        this.selection = computeSelected(this.range, selected || this.selection, this.option);
        return this;
    }

    select(selection: Array<T>) {
        this.selection = computeSelected(this.range, selection, this.option);
        return this;
    }

    unSelect(selection: Array<T>) {
        const {key} = this.option;
        if (!key) {
            const unSelectionSet = new Set(selection);
            this.selection = this.selection.filter((d) => !unSelectionSet.has(d));
        } else {
            const unSelectionKeySet = new Set(selection.map((d) => d[key]));
            this.selection = this.selection.filter((d) => !unSelectionKeySet.has(d[key]));
        }
        this.selection = computeSelected(this.range, this.selection, this.option);
        return this;
    }

    selectAll() {
        this.selection = computeSelected(this.range, this.range, this.option);
        return this;
    }

    unSelectAll() {
        this.selection = computeSelected(this.range, [], this.option);
        return this;
    }

    toggle(selection: Array<T>) {
        const {key} = this.option;
        if (!key) {
            const toggleSet = new Set(selection);
            const selectionSet = new Set(this.selection);
            const padding = selection.filter((s) => !selectionSet.has(s));
            this.selection = this.selection.filter((d) => !toggleSet.has(d)).concat(padding);
        } else {
            const toggleKeySet = new Set(selection.map((d) => d[key]));
            const selectionKeySet = new Set(this.selection.map((d) => d[key]));
            const paddingByKey = selection.filter((s) => !selectionKeySet.has(s[key]));
            this.selection = this.selection.filter((d) => !toggleKeySet.has(d[key])).concat(paddingByKey);
        }
        this.selection = computeSelected(this.range, this.selection, this.option);
        return this;
    }

    toggleAll() {
        this.toggle(this.range);
        return this;
    }

}

export function useSelection<T>(
    range: Array<T>,
    selected?: Array<T> | Option<T>,
    opt?: Option<T>
): [Array<T>, SelectionStatus, SelectionMethods<T>] {
    const selectionRef = useRef(new Selection(range, selected, opt));
    const [selection, setSelection] = useState(selectionRef.current.current);
    const utils = useMemo<SelectionMethods<T>>((): SelectionMethods<T> => {
        return {
            update(range: Array<T>, selected?: Array<T>) {
                const {current} = selectionRef.current.update(range, selected);
                setSelection(current);
            },
            select(selection: Array<T>) {
                const {current} = selectionRef.current.select(selection);
                setSelection(current);
            },
            unSelect(selection: Array<T>) {
                const {current} = selectionRef.current.unSelect(selection);
                setSelection(current);
            },
            selectAll() {
                const {current} = selectionRef.current.selectAll();
                setSelection(current);
            },
            unSelectAll() {
                const {current} = selectionRef.current.unSelectAll();
                setSelection(current);
            },
            toggle(selection: Array<T>) {
                const {current} = selectionRef.current.toggle(selection);
                setSelection(current);
            },
            toggleAll() {
                const {current} = selectionRef.current.toggleAll();
                setSelection(current);
            }
        }
    }, []);

    const selectionStatus = useMemo<SelectionStatus>(() => {
        const {current, range} = selectionRef.current;
        const currentSize = current.length;
        const rangeSize = range.length;
        if (!rangeSize || !currentSize) {
            return 'NONE';
        }
        if (currentSize === rangeSize) {
            return 'ALL'
        }
        return 'PART';
    }, [selection]);

    return [selection, selectionStatus, utils];
}