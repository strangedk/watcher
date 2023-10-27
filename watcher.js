const watch = (obj, prop) => {
    const privateName = `____watched_${prop}`;
    obj[privateName] = obj[prop];
    delete obj.prop;

    Object.defineProperty(obj, prop, {
        get() {
            console.log('%c[watcher]', 'background: #222; color: #bada55', `read the property ${prop}`,);
            return obj[privateName];
        },
        set(value) {
            console.log('%c[watcher]', 'background: #222; color: #bada55', `changing the property ${prop} to ${value}`,);
            obj[privateName] = value;
        },
    });
}

const unwatch = (obj, prop) => {
    const privateName = `____watched_${prop}`;
    const privateValue = obj[privateName];

    delete obj[prop];
    delete obj[privateName];

    obj[prop] = privateValue;
}

export {watch, unwatch};
