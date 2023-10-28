/**
 * watcher
 * 
 * @param {*} obj object which property you want to watch
 * @param {*} prop property of the object which you want to watch
 * @param {*} options {
 *                          once:boolean,
 *                          breakpoint: value,
 *                          trigger: value,
 *                          predicate: (value) => boolean,
 *                          onchange: (value, previous) => void,
 *            }
 */
const watch = (obj, prop, options = {}) => {
    let cache = {};
    const sourcePropsDescriptor = Object.getOwnPropertyDescriptor(obj, prop);    

    const unwatch = () => {
        if (!cache) return;

        delete obj[prop];

        Object.defineProperty(obj, prop, {
            ...sourcePropsDescriptor,
            value: cache[prop],
        });

        delete cache[prop];
        cache = null;
    }

    Object.defineProperty(cache, prop, {        
        ...sourcePropsDescriptor,
        value: obj[prop],
    });
    delete obj.prop;

    Object.defineProperty(obj, prop, {
        enumerable: sourcePropsDescriptor.enumerable,
        get() {
            console.log('%c[watcher]', 'background: #222; color: #ba55fa', `reading the property ${prop} is ${cache[prop]}`,);
            return cache[prop];
        },
        set(value) {
            const log = (prefix='') => console.log('%c[watcher'+(prefix===''?'':' ')+prefix+']', 'background: #222; color: #bada55', `changing the property ${prop} to ${value}`,);
            const assign = () => cache[prop] = value;

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

            if (Object.keys(options).includes('onchange')) {
                options.onchange(value, cache[prop]);
            }

            assign();

            if (Object.keys(options).includes('once') && !!options.once) {
                unwatch();
            }
        },
    });

    return unwatch;
};

const watchAll = (obj, options) => {
    let unwatches = [];
    
    Object.keys(obj).forEach((key, i) => unwatches[i] = watch(obj, key, options));

    return () => unwatches.forEach(unwatch => unwatch());
};

export { watch, watchAll };
