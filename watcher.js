/**
 * 
 * @param {*} obj object which property you want to watch
 * @param {*} prop property of the object which you want to watch
 * @param {*} options { breakpoint: typeof(prop), trigger: typeof(prop), predicate(value:typeof(prop)): boolean, }
 */
const watch = (obj, prop, options) => {
    const privateName = `____watched_${prop}`;
    obj[privateName] = obj[prop];
    delete obj.prop;

    Object.defineProperty(obj, prop, {
        get() {
            console.log('%c[watcher]', 'background: #222; color: #bada55', `read the property ${prop} is ${obj[privateName]}`,);
            return obj[privateName];
        },
        set(value) {
            const log = (prefix='') => console.log('%c[watcher '+prefix+']', 'background: #222; color: #bada55', `changing the property ${prop} to ${value}`,);
            const assign = () => obj[privateName] = value;

            if (Object.keys(options).includes('predicate')) {
                if (options.predicate(value)) {
                    log('predicate');
                }
            } else if (Object.keys(options).includes('trigger')) {
                if (value === options.trigger) {
                    log('trigger');
                }
            } else if (Object.keys(options).includes('breakpoint')) {
                if (value === options.breakpoint) {
                    log('breakpoint');
                    debugger;
                }
            } else {
                log();
            }

            assign();
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
