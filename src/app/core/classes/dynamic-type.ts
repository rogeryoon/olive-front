interface ParameterlessConstructor<T> {
    new(): T;
}

export class Creator<T> {
    constructor(private ctor: ParameterlessConstructor<T>) {

    }
    getNew() {
        return new this.ctor();
    }
}
