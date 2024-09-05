import { __async, __spreadProps, __spreadValues } from './chunk-5K356HEJ.js';

// ../../node_modules/@trpc/server/dist/observable-ade1bad8.mjs
function identity(x) {
  return x;
}
function pipeFromArray(fns) {
  if (fns.length === 0) {
    return identity;
  }
  if (fns.length === 1) {
    return fns[0];
  }
  return function piped(input) {
    return fns.reduce((prev, fn) => fn(prev), input);
  };
}
function observable(subscribe) {
  const self = {
    subscribe(observer) {
      let teardownRef = null;
      let isDone = false;
      let unsubscribed = false;
      let teardownImmediately = false;
      function unsubscribe() {
        if (teardownRef === null) {
          teardownImmediately = true;
          return;
        }
        if (unsubscribed) {
          return;
        }
        unsubscribed = true;
        if (typeof teardownRef === 'function') {
          teardownRef();
        } else if (teardownRef) {
          teardownRef.unsubscribe();
        }
      }
      teardownRef = subscribe({
        next(value) {
          if (isDone) {
            return;
          }
          observer.next?.(value);
        },
        error(err) {
          if (isDone) {
            return;
          }
          isDone = true;
          observer.error?.(err);
          unsubscribe();
        },
        complete() {
          if (isDone) {
            return;
          }
          isDone = true;
          observer.complete?.();
          unsubscribe();
        }
      });
      if (teardownImmediately) {
        unsubscribe();
      }
      return {
        unsubscribe
      };
    },
    pipe(...operations) {
      return pipeFromArray(operations)(self);
    }
  };
  return self;
}

// ../../node_modules/@trpc/server/dist/observable/index.mjs
function share(_opts) {
  return (originalObserver) => {
    let refCount = 0;
    let subscription = null;
    const observers = [];
    function startIfNeeded() {
      if (subscription) {
        return;
      }
      subscription = originalObserver.subscribe({
        next(value) {
          for (const observer of observers) {
            observer.next?.(value);
          }
        },
        error(error) {
          for (const observer of observers) {
            observer.error?.(error);
          }
        },
        complete() {
          for (const observer of observers) {
            observer.complete?.();
          }
        }
      });
    }
    function resetIfNeeded() {
      if (refCount === 0 && subscription) {
        const _sub = subscription;
        subscription = null;
        _sub.unsubscribe();
      }
    }
    return {
      subscribe(observer) {
        refCount++;
        observers.push(observer);
        startIfNeeded();
        return {
          unsubscribe() {
            refCount--;
            resetIfNeeded();
            const index = observers.findIndex((v) => v === observer);
            if (index > -1) {
              observers.splice(index, 1);
            }
          }
        };
      }
    };
  };
}
function tap(observer) {
  return (originalObserver) => {
    return {
      subscribe(observer2) {
        return originalObserver.subscribe({
          next(v) {
            observer.next?.(v);
            observer2.next?.(v);
          },
          error(v) {
            observer.error?.(v);
            observer2.error?.(v);
          },
          complete() {
            observer.complete?.();
            observer2.complete?.();
          }
        });
      }
    };
  };
}
var ObservableAbortError = class _ObservableAbortError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ObservableAbortError';
    Object.setPrototypeOf(this, _ObservableAbortError.prototype);
  }
};
function observableToPromise(observable2) {
  let abort;
  const promise = new Promise((resolve, reject) => {
    let isDone = false;
    function onDone() {
      if (isDone) {
        return;
      }
      isDone = true;
      reject(new ObservableAbortError('This operation was aborted.'));
      obs$.unsubscribe();
    }
    const obs$ = observable2.subscribe({
      next(data) {
        isDone = true;
        resolve(data);
        onDone();
      },
      error(data) {
        isDone = true;
        reject(data);
        onDone();
      },
      complete() {
        isDone = true;
        onDone();
      }
    });
    abort = onDone;
  });
  return {
    promise,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    abort
  };
}

// ../../node_modules/@trpc/client/dist/splitLink-4c75f7be.mjs
function createChain(opts) {
  return observable((observer) => {
    function execute(index = 0, op = opts.op) {
      const next = opts.links[index];
      if (!next) {
        throw new Error(
          'No more links to execute - did you forget to add an ending link?'
        );
      }
      const subscription = next({
        op,
        next(nextOp) {
          const nextObserver = execute(index + 1, nextOp);
          return nextObserver;
        }
      });
      return subscription;
    }
    const obs$ = execute();
    return obs$.subscribe(observer);
  });
}
function asArray(value) {
  return Array.isArray(value) ? value : [value];
}
function splitLink(opts) {
  return (runtime) => {
    const yes = asArray(opts.true).map((link) => link(runtime));
    const no = asArray(opts.false).map((link) => link(runtime));
    return (props) => {
      return observable((observer) => {
        const links = opts.condition(props.op) ? yes : no;
        return createChain({
          op: props.op,
          links
        }).subscribe(observer);
      });
    };
  };
}

// ../../node_modules/@trpc/server/dist/codes-c924c3db.mjs
function invert(obj) {
  const newObj = /* @__PURE__ */ Object.create(null);
  for (const key in obj) {
    const v = obj[key];
    newObj[v] = key;
  }
  return newObj;
}
var TRPC_ERROR_CODES_BY_KEY = {
  /**
   * Invalid JSON was received by the server.
   * An error occurred on the server while parsing the JSON text.
   */
  PARSE_ERROR: -32700,
  /**
   * The JSON sent is not a valid Request object.
   */
  BAD_REQUEST: -32600,
  // Internal JSON-RPC error
  INTERNAL_SERVER_ERROR: -32603,
  NOT_IMPLEMENTED: -32603,
  // Implementation specific errors
  UNAUTHORIZED: -32001,
  FORBIDDEN: -32003,
  NOT_FOUND: -32004,
  METHOD_NOT_SUPPORTED: -32005,
  TIMEOUT: -32008,
  CONFLICT: -32009,
  PRECONDITION_FAILED: -32012,
  PAYLOAD_TOO_LARGE: -32013,
  UNPROCESSABLE_CONTENT: -32022,
  TOO_MANY_REQUESTS: -32029,
  CLIENT_CLOSED_REQUEST: -32099
};
var TRPC_ERROR_CODES_BY_NUMBER = invert(TRPC_ERROR_CODES_BY_KEY);

// ../../node_modules/@trpc/server/dist/index-f91d720c.mjs
var TRPC_ERROR_CODES_BY_NUMBER2 = invert(TRPC_ERROR_CODES_BY_KEY);
var noop = () => {};
function createInnerProxy(callback, path) {
  const proxy = new Proxy(noop, {
    get(_obj, key) {
      if (typeof key !== 'string' || key === 'then') {
        return void 0;
      }
      return createInnerProxy(callback, [...path, key]);
    },
    apply(_1, _2, args) {
      const isApply = path[path.length - 1] === 'apply';
      return callback({
        args: isApply ? (args.length >= 2 ? args[1] : []) : args,
        path: isApply ? path.slice(0, -1) : path
      });
    }
  });
  return proxy;
}
var createRecursiveProxy = (callback) => createInnerProxy(callback, []);
var createFlatProxy = (callback) => {
  return new Proxy(noop, {
    get(_obj, name) {
      if (typeof name !== 'string' || name === 'then') {
        return void 0;
      }
      return callback(name);
    }
  });
};

// ../../node_modules/@trpc/server/dist/getCauseFromUnknown-2d66414a.mjs
function isObject(value) {
  return !!value && !Array.isArray(value) && typeof value === 'object';
}
var UnknownCauseError = class extends Error {};
function getCauseFromUnknown(cause) {
  if (cause instanceof Error) {
    return cause;
  }
  const type = typeof cause;
  if (type === 'undefined' || type === 'function' || cause === null) {
    return void 0;
  }
  if (type !== 'object') {
    return new Error(String(cause));
  }
  if (isObject(cause)) {
    const err = new UnknownCauseError();
    for (const key in cause) {
      err[key] = cause[key];
    }
    return err;
  }
  return void 0;
}

// ../../node_modules/@trpc/client/dist/transformResult-ace864b8.mjs
function isObject2(value) {
  return !!value && !Array.isArray(value) && typeof value === 'object';
}
function transformResultInner(response, runtime) {
  if ('error' in response) {
    const error = runtime.transformer.deserialize(response.error);
    return {
      ok: false,
      error: __spreadProps(__spreadValues({}, response), {
        error
      })
    };
  }
  const result = __spreadValues(
    __spreadValues({}, response.result),
    (!response.result.type || response.result.type === 'data') && {
      type: 'data',
      data: runtime.transformer.deserialize(response.result.data)
    }
  );
  return {
    ok: true,
    result
  };
}
var TransformResultError = class extends Error {
  constructor() {
    super('Unable to transform response from server');
  }
};
function transformResult(response, runtime) {
  let result;
  try {
    result = transformResultInner(response, runtime);
  } catch (err) {
    throw new TransformResultError();
  }
  if (
    !result.ok &&
    (!isObject2(result.error.error) ||
      typeof result.error.error.code !== 'number')
  ) {
    throw new TransformResultError();
  }
  if (result.ok && !isObject2(result.result)) {
    throw new TransformResultError();
  }
  return result;
}

// ../../node_modules/@trpc/client/dist/TRPCClientError-38f9a32a.mjs
function isTRPCClientError(cause) {
  return (
    cause instanceof TRPCClientError /**
     * @deprecated
     * Delete in next major
     */ ||
    (cause instanceof Error && cause.name === 'TRPCClientError')
  );
}
function isTRPCErrorResponse(obj) {
  return (
    isObject2(obj) &&
    isObject2(obj.error) &&
    typeof obj.error.code === 'number' &&
    typeof obj.error.message === 'string'
  );
}
var TRPCClientError = class _TRPCClientError extends Error {
  static from(_cause, opts = {}) {
    const cause = _cause;
    if (isTRPCClientError(cause)) {
      if (opts.meta) {
        cause.meta = __spreadValues(__spreadValues({}, cause.meta), opts.meta);
      }
      return cause;
    }
    if (isTRPCErrorResponse(cause)) {
      return new _TRPCClientError(
        cause.error.message,
        __spreadProps(__spreadValues({}, opts), {
          result: cause
        })
      );
    }
    if (!(cause instanceof Error)) {
      return new _TRPCClientError(
        'Unknown error',
        __spreadProps(__spreadValues({}, opts), {
          cause
        })
      );
    }
    return new _TRPCClientError(
      cause.message,
      __spreadProps(__spreadValues({}, opts), {
        cause: getCauseFromUnknown(cause)
      })
    );
  }
  constructor(message, opts) {
    const cause = opts?.cause;
    super(message, {
      cause
    });
    this.meta = opts?.meta;
    this.cause = cause;
    this.shape = opts?.result?.error;
    this.data = opts?.result?.error.data;
    this.name = 'TRPCClientError';
    Object.setPrototypeOf(this, _TRPCClientError.prototype);
  }
};

// ../../node_modules/@trpc/client/dist/httpUtils-b9d0cb48.mjs
var isFunction = (fn) => typeof fn === 'function';
function getFetch(customFetchImpl) {
  if (customFetchImpl) {
    return customFetchImpl;
  }
  if (typeof window !== 'undefined' && isFunction(window.fetch)) {
    return window.fetch;
  }
  if (typeof globalThis !== 'undefined' && isFunction(globalThis.fetch)) {
    return globalThis.fetch;
  }
  throw new Error('No fetch implementation found');
}
function getAbortController(customAbortControllerImpl) {
  if (customAbortControllerImpl) {
    return customAbortControllerImpl;
  }
  if (typeof window !== 'undefined' && window.AbortController) {
    return window.AbortController;
  }
  if (typeof globalThis !== 'undefined' && globalThis.AbortController) {
    return globalThis.AbortController;
  }
  return null;
}
function resolveHTTPLinkOptions(opts) {
  return {
    url: opts.url.toString().replace(/\/$/, ''),
    fetch: opts.fetch,
    AbortController: getAbortController(opts.AbortController)
  };
}
function arrayToDict(array) {
  const dict = {};
  for (let index = 0; index < array.length; index++) {
    const element = array[index];
    dict[index] = element;
  }
  return dict;
}
var METHOD = {
  query: 'GET',
  mutation: 'POST'
};
function getInput(opts) {
  return 'input' in opts
    ? opts.runtime.transformer.serialize(opts.input)
    : arrayToDict(
        opts.inputs.map((_input) => opts.runtime.transformer.serialize(_input))
      );
}
var getUrl = (opts) => {
  let url = opts.url + '/' + opts.path;
  const queryParts = [];
  if ('inputs' in opts) {
    queryParts.push('batch=1');
  }
  if (opts.type === 'query') {
    const input = getInput(opts);
    if (input !== void 0) {
      queryParts.push(`input=${encodeURIComponent(JSON.stringify(input))}`);
    }
  }
  if (queryParts.length) {
    url += '?' + queryParts.join('&');
  }
  return url;
};
var getBody = (opts) => {
  if (opts.type === 'query') {
    return void 0;
  }
  const input = getInput(opts);
  return input !== void 0 ? JSON.stringify(input) : void 0;
};
var jsonHttpRequester = (opts) => {
  return httpRequest(
    __spreadProps(__spreadValues({}, opts), {
      contentTypeHeader: 'application/json',
      getUrl,
      getBody
    })
  );
};
function fetchHTTPResponse(opts, ac) {
  return __async(this, null, function* () {
    const url = opts.getUrl(opts);
    const body = opts.getBody(opts);
    const { type } = opts;
    const resolvedHeaders = yield opts.headers();
    if (type === 'subscription') {
      throw new Error('Subscriptions should use wsLink');
    }
    const headers = __spreadValues(
      __spreadValues(
        __spreadValues(
          {},
          opts.contentTypeHeader
            ? {
                'content-type': opts.contentTypeHeader
              }
            : {}
        ),
        opts.batchModeHeader
          ? {
              'trpc-batch-mode': opts.batchModeHeader
            }
          : {}
      ),
      resolvedHeaders
    );
    return getFetch(opts.fetch)(url, {
      method: METHOD[type],
      signal: ac?.signal,
      body,
      headers
    });
  });
}
function httpRequest(opts) {
  const ac = opts.AbortController ? new opts.AbortController() : null;
  const meta = {};
  let done = false;
  const promise = new Promise((resolve, reject) => {
    fetchHTTPResponse(opts, ac)
      .then((_res) => {
        meta.response = _res;
        done = true;
        return _res.json();
      })
      .then((json) => {
        meta.responseJSON = json;
        resolve({
          json,
          meta
        });
      })
      .catch((err) => {
        done = true;
        reject(
          TRPCClientError.from(err, {
            meta
          })
        );
      });
  });
  const cancel = () => {
    if (!done) {
      ac?.abort();
    }
  };
  return {
    promise,
    cancel
  };
}

// ../../node_modules/@trpc/client/dist/httpBatchLink-d0f9eac9.mjs
var throwFatalError = () => {
  throw new Error(
    'Something went wrong. Please submit an issue at https://github.com/trpc/trpc/issues/new'
  );
};
function dataLoader(batchLoader) {
  let pendingItems = null;
  let dispatchTimer = null;
  const destroyTimerAndPendingItems = () => {
    clearTimeout(dispatchTimer);
    dispatchTimer = null;
    pendingItems = null;
  };
  function groupItems(items) {
    const groupedItems = [[]];
    let index = 0;
    while (true) {
      const item = items[index];
      if (!item) {
        break;
      }
      const lastGroup = groupedItems[groupedItems.length - 1];
      if (item.aborted) {
        item.reject?.(new Error('Aborted'));
        index++;
        continue;
      }
      const isValid = batchLoader.validate(
        lastGroup.concat(item).map((it) => it.key)
      );
      if (isValid) {
        lastGroup.push(item);
        index++;
        continue;
      }
      if (lastGroup.length === 0) {
        item.reject?.(new Error('Input is too big for a single dispatch'));
        index++;
        continue;
      }
      groupedItems.push([]);
    }
    return groupedItems;
  }
  function dispatch() {
    const groupedItems = groupItems(pendingItems);
    destroyTimerAndPendingItems();
    for (const items of groupedItems) {
      if (!items.length) {
        continue;
      }
      const batch = {
        items,
        cancel: throwFatalError
      };
      for (const item of items) {
        item.batch = batch;
      }
      const unitResolver = (index, value) => {
        const item = batch.items[index];
        item.resolve?.(value);
        item.batch = null;
        item.reject = null;
        item.resolve = null;
      };
      const { promise, cancel } = batchLoader.fetch(
        batch.items.map((_item) => _item.key),
        unitResolver
      );
      batch.cancel = cancel;
      promise
        .then((result) => {
          for (let i = 0; i < result.length; i++) {
            const value = result[i];
            unitResolver(i, value);
          }
          for (const item of batch.items) {
            item.reject?.(new Error('Missing result'));
            item.batch = null;
          }
        })
        .catch((cause) => {
          for (const item of batch.items) {
            item.reject?.(cause);
            item.batch = null;
          }
        });
    }
  }
  function load(key) {
    const item = {
      aborted: false,
      key,
      batch: null,
      resolve: throwFatalError,
      reject: throwFatalError
    };
    const promise = new Promise((resolve, reject) => {
      item.reject = reject;
      item.resolve = resolve;
      if (!pendingItems) {
        pendingItems = [];
      }
      pendingItems.push(item);
    });
    if (!dispatchTimer) {
      dispatchTimer = setTimeout(dispatch);
    }
    const cancel = () => {
      item.aborted = true;
      if (item.batch?.items.every((item2) => item2.aborted)) {
        item.batch.cancel();
        item.batch = null;
      }
    };
    return {
      promise,
      cancel
    };
  }
  return {
    load
  };
}
function createHTTPBatchLink(requester) {
  return function httpBatchLink2(opts) {
    const resolvedOpts = resolveHTTPLinkOptions(opts);
    const maxURLLength = opts.maxURLLength ?? Infinity;
    return (runtime) => {
      const batchLoader = (type) => {
        const validate = (batchOps) => {
          if (maxURLLength === Infinity) {
            return true;
          }
          const path = batchOps.map((op) => op.path).join(',');
          const inputs = batchOps.map((op) => op.input);
          const url = getUrl(
            __spreadProps(__spreadValues({}, resolvedOpts), {
              runtime,
              type,
              path,
              inputs
            })
          );
          return url.length <= maxURLLength;
        };
        const fetch = requester(
          __spreadProps(__spreadValues({}, resolvedOpts), {
            runtime,
            type,
            opts
          })
        );
        return {
          validate,
          fetch
        };
      };
      const query = dataLoader(batchLoader('query'));
      const mutation = dataLoader(batchLoader('mutation'));
      const subscription = dataLoader(batchLoader('subscription'));
      const loaders = {
        query,
        subscription,
        mutation
      };
      return ({ op }) => {
        return observable((observer) => {
          const loader = loaders[op.type];
          const { promise, cancel } = loader.load(op);
          let _res = void 0;
          promise
            .then((res) => {
              _res = res;
              const transformed = transformResult(res.json, runtime);
              if (!transformed.ok) {
                observer.error(
                  TRPCClientError.from(transformed.error, {
                    meta: res.meta
                  })
                );
                return;
              }
              observer.next({
                context: res.meta,
                result: transformed.result
              });
              observer.complete();
            })
            .catch((err) => {
              observer.error(
                TRPCClientError.from(err, {
                  meta: _res?.meta
                })
              );
            });
          return () => {
            cancel();
          };
        });
      };
    };
  };
}
var batchRequester = (requesterOpts) => {
  return (batchOps) => {
    const path = batchOps.map((op) => op.path).join(',');
    const inputs = batchOps.map((op) => op.input);
    const { promise, cancel } = jsonHttpRequester(
      __spreadProps(__spreadValues({}, requesterOpts), {
        path,
        inputs,
        headers() {
          if (!requesterOpts.opts.headers) {
            return {};
          }
          if (typeof requesterOpts.opts.headers === 'function') {
            return requesterOpts.opts.headers({
              opList: batchOps
            });
          }
          return requesterOpts.opts.headers;
        }
      })
    );
    return {
      promise: promise.then((res) => {
        const resJSON = Array.isArray(res.json)
          ? res.json
          : batchOps.map(() => res.json);
        const result = resJSON.map((item) => ({
          meta: res.meta,
          json: item
        }));
        return result;
      }),
      cancel
    };
  };
};
var httpBatchLink = createHTTPBatchLink(batchRequester);

// ../../node_modules/@trpc/client/dist/links/httpLink.mjs
function httpLinkFactory(factoryOpts) {
  return (opts) => {
    const resolvedOpts = resolveHTTPLinkOptions(opts);
    return (runtime) =>
      ({ op }) =>
        observable((observer) => {
          const { path, input, type } = op;
          const { promise, cancel } = factoryOpts.requester(
            __spreadProps(__spreadValues({}, resolvedOpts), {
              runtime,
              type,
              path,
              input,
              headers() {
                if (!opts.headers) {
                  return {};
                }
                if (typeof opts.headers === 'function') {
                  return opts.headers({
                    op
                  });
                }
                return opts.headers;
              }
            })
          );
          let meta = void 0;
          promise
            .then((res) => {
              meta = res.meta;
              const transformed = transformResult(res.json, runtime);
              if (!transformed.ok) {
                observer.error(
                  TRPCClientError.from(transformed.error, {
                    meta
                  })
                );
                return;
              }
              observer.next({
                context: res.meta,
                result: transformed.result
              });
              observer.complete();
            })
            .catch((cause) => {
              observer.error(
                TRPCClientError.from(cause, {
                  meta
                })
              );
            });
          return () => {
            cancel();
          };
        });
  };
}
var httpLink = httpLinkFactory({
  requester: jsonHttpRequester
});

// ../../node_modules/@trpc/client/dist/links/loggerLink.mjs
function isFormData(value) {
  if (typeof FormData === 'undefined') {
    return false;
  }
  return value instanceof FormData;
}
var palettes = {
  css: {
    query: ['72e3ff', '3fb0d8'],
    mutation: ['c5a3fc', '904dfc'],
    subscription: ['ff49e1', 'd83fbe']
  },
  ansi: {
    regular: {
      // Cyan background, black and white text respectively
      query: ['\x1B[30;46m', '\x1B[97;46m'],
      // Magenta background, black and white text respectively
      mutation: ['\x1B[30;45m', '\x1B[97;45m'],
      // Green background, black and white text respectively
      subscription: ['\x1B[30;42m', '\x1B[97;42m']
    },
    bold: {
      query: ['\x1B[1;30;46m', '\x1B[1;97;46m'],
      mutation: ['\x1B[1;30;45m', '\x1B[1;97;45m'],
      subscription: ['\x1B[1;30;42m', '\x1B[1;97;42m']
    }
  }
};
function constructPartsAndArgs(opts) {
  const { direction, type, path, id, input } = opts;
  const parts = [];
  const args = [];
  if (opts.colorMode === 'ansi') {
    const [lightRegular, darkRegular] = palettes.ansi.regular[type];
    const [lightBold, darkBold] = palettes.ansi.bold[type];
    const reset = '\x1B[0m';
    parts.push(
      direction === 'up' ? lightRegular : darkRegular,
      direction === 'up' ? '>>' : '<<',
      type,
      direction === 'up' ? lightBold : darkBold,
      `#${id}`,
      path,
      reset
    );
    if (direction === 'up') {
      args.push({
        input: opts.input
      });
    } else {
      args.push({
        input: opts.input,
        // strip context from result cause it's too noisy in terminal wihtout collapse mode
        result: 'result' in opts.result ? opts.result.result : opts.result,
        elapsedMs: opts.elapsedMs
      });
    }
    return {
      parts,
      args
    };
  }
  const [light, dark] = palettes.css[type];
  const css = `
    background-color: #${direction === 'up' ? light : dark}; 
    color: ${direction === 'up' ? 'black' : 'white'};
    padding: 2px;
  `;
  parts.push(
    '%c',
    direction === 'up' ? '>>' : '<<',
    type,
    `#${id}`,
    `%c${path}%c`,
    '%O'
  );
  args.push(css, `${css}; font-weight: bold;`, `${css}; font-weight: normal;`);
  if (direction === 'up') {
    args.push({
      input,
      context: opts.context
    });
  } else {
    args.push({
      input,
      result: opts.result,
      elapsedMs: opts.elapsedMs,
      context: opts.context
    });
  }
  return {
    parts,
    args
  };
}
var defaultLogger =
  ({ c = console, colorMode = 'css' }) =>
  (props) => {
    const rawInput = props.input;
    const input = isFormData(rawInput)
      ? Object.fromEntries(rawInput)
      : rawInput;
    const { parts, args } = constructPartsAndArgs(
      __spreadProps(__spreadValues({}, props), {
        colorMode,
        input
      })
    );
    const fn =
      props.direction === 'down' &&
      props.result &&
      (props.result instanceof Error || 'error' in props.result.result)
        ? 'error'
        : 'log';
    c[fn].apply(null, [parts.join(' ')].concat(args));
  };
function loggerLink(opts = {}) {
  const { enabled = () => true } = opts;
  const colorMode =
    opts.colorMode ?? (typeof window === 'undefined' ? 'ansi' : 'css');
  const {
    logger = defaultLogger({
      c: opts.console,
      colorMode
    })
  } = opts;
  return () => {
    return ({ op, next }) => {
      return observable((observer) => {
        enabled(
          __spreadProps(__spreadValues({}, op), {
            direction: 'up'
          })
        ) &&
          logger(
            __spreadProps(__spreadValues({}, op), {
              direction: 'up'
            })
          );
        const requestStartTime = Date.now();
        function logResult(result) {
          const elapsedMs = Date.now() - requestStartTime;
          enabled(
            __spreadProps(__spreadValues({}, op), {
              direction: 'down',
              result
            })
          ) &&
            logger(
              __spreadProps(__spreadValues({}, op), {
                direction: 'down',
                elapsedMs,
                result
              })
            );
        }
        return next(op)
          .pipe(
            tap({
              next(result) {
                logResult(result);
              },
              error(result) {
                logResult(result);
              }
            })
          )
          .subscribe(observer);
      });
    };
  };
}

// ../../node_modules/@trpc/client/dist/links/wsLink.mjs
var retryDelay = (attemptIndex) =>
  attemptIndex === 0 ? 0 : Math.min(1e3 * 2 ** attemptIndex, 3e4);
function createWSClient(opts) {
  const {
    url,
    WebSocket: WebSocketImpl = WebSocket,
    retryDelayMs: retryDelayFn = retryDelay,
    onOpen,
    onClose
  } = opts;
  if (!WebSocketImpl) {
    throw new Error(
      "No WebSocket implementation found - you probably don't want to use this on the server, but if you do you need to pass a `WebSocket`-ponyfill"
    );
  }
  let outgoing = [];
  const pendingRequests = /* @__PURE__ */ Object.create(null);
  let connectAttempt = 0;
  let dispatchTimer = null;
  let connectTimer = null;
  let activeConnection = createWS();
  let state = 'connecting';
  function dispatch() {
    if (state !== 'open' || dispatchTimer) {
      return;
    }
    dispatchTimer = setTimeout(() => {
      dispatchTimer = null;
      if (outgoing.length === 1) {
        activeConnection.send(JSON.stringify(outgoing.pop()));
      } else {
        activeConnection.send(JSON.stringify(outgoing));
      }
      outgoing = [];
    });
  }
  function tryReconnect() {
    if (connectTimer !== null || state === 'closed') {
      return;
    }
    const timeout = retryDelayFn(connectAttempt++);
    reconnectInMs(timeout);
  }
  function reconnect() {
    state = 'connecting';
    const oldConnection = activeConnection;
    activeConnection = createWS();
    closeIfNoPending(oldConnection);
  }
  function reconnectInMs(ms) {
    if (connectTimer) {
      return;
    }
    state = 'connecting';
    connectTimer = setTimeout(reconnect, ms);
  }
  function closeIfNoPending(conn) {
    const hasPendingRequests = Object.values(pendingRequests).some(
      (p) => p.ws === conn
    );
    if (!hasPendingRequests) {
      conn.close();
    }
  }
  function closeActiveSubscriptions() {
    Object.values(pendingRequests).forEach((req) => {
      if (req.type === 'subscription') {
        req.callbacks.complete();
      }
    });
  }
  function resumeSubscriptionOnReconnect(req) {
    if (outgoing.some((r) => r.id === req.op.id)) {
      return;
    }
    request(req.op, req.callbacks);
  }
  function createWS() {
    const urlString = typeof url === 'function' ? url() : url;
    const conn = new WebSocketImpl(urlString);
    clearTimeout(connectTimer);
    connectTimer = null;
    conn.addEventListener('open', () => {
      if (conn !== activeConnection) {
        return;
      }
      connectAttempt = 0;
      state = 'open';
      onOpen?.();
      dispatch();
    });
    conn.addEventListener('error', () => {
      if (conn === activeConnection) {
        tryReconnect();
      }
    });
    const handleIncomingRequest = (req) => {
      if (req.method === 'reconnect' && conn === activeConnection) {
        if (state === 'open') {
          onClose?.();
        }
        reconnect();
        for (const pendingReq of Object.values(pendingRequests)) {
          if (pendingReq.type === 'subscription') {
            resumeSubscriptionOnReconnect(pendingReq);
          }
        }
      }
    };
    const handleIncomingResponse = (data) => {
      const req = data.id !== null && pendingRequests[data.id];
      if (!req) {
        return;
      }
      req.callbacks.next?.(data);
      if (req.ws !== activeConnection && conn === activeConnection) {
        const oldWs = req.ws;
        req.ws = activeConnection;
        closeIfNoPending(oldWs);
      }
      if (
        'result' in data &&
        data.result.type === 'stopped' &&
        conn === activeConnection
      ) {
        req.callbacks.complete();
      }
    };
    conn.addEventListener('message', ({ data }) => {
      const msg = JSON.parse(data);
      if ('method' in msg) {
        handleIncomingRequest(msg);
      } else {
        handleIncomingResponse(msg);
      }
      if (conn !== activeConnection || state === 'closed') {
        closeIfNoPending(conn);
      }
    });
    conn.addEventListener('close', ({ code }) => {
      if (state === 'open') {
        onClose?.({
          code
        });
      }
      if (activeConnection === conn) {
        tryReconnect();
      }
      for (const [key, req] of Object.entries(pendingRequests)) {
        if (req.ws !== conn) {
          continue;
        }
        if (state === 'closed') {
          delete pendingRequests[key];
          req.callbacks.complete?.();
          continue;
        }
        if (req.type === 'subscription') {
          resumeSubscriptionOnReconnect(req);
        } else {
          delete pendingRequests[key];
          req.callbacks.error?.(
            TRPCClientError.from(
              new TRPCWebSocketClosedError('WebSocket closed prematurely')
            )
          );
        }
      }
    });
    return conn;
  }
  function request(op, callbacks) {
    const { type, input, path, id } = op;
    const envelope = {
      id,
      method: type,
      params: {
        input,
        path
      }
    };
    pendingRequests[id] = {
      ws: activeConnection,
      type,
      callbacks,
      op
    };
    outgoing.push(envelope);
    dispatch();
    return () => {
      const callbacks2 = pendingRequests[id]?.callbacks;
      delete pendingRequests[id];
      outgoing = outgoing.filter((msg) => msg.id !== id);
      callbacks2?.complete?.();
      if (
        activeConnection.readyState === WebSocketImpl.OPEN &&
        op.type === 'subscription'
      ) {
        outgoing.push({
          id,
          method: 'subscription.stop'
        });
        dispatch();
      }
    };
  }
  return {
    close: () => {
      state = 'closed';
      onClose?.();
      closeActiveSubscriptions();
      closeIfNoPending(activeConnection);
      clearTimeout(connectTimer);
      connectTimer = null;
    },
    request,
    getConnection() {
      return activeConnection;
    }
  };
}
var TRPCWebSocketClosedError = class _TRPCWebSocketClosedError extends Error {
  constructor(message) {
    super(message);
    this.name = 'TRPCWebSocketClosedError';
    Object.setPrototypeOf(this, _TRPCWebSocketClosedError.prototype);
  }
};
function wsLink(opts) {
  return (runtime) => {
    const { client } = opts;
    return ({ op }) => {
      return observable((observer) => {
        const { type, path, id, context } = op;
        const input = runtime.transformer.serialize(op.input);
        const unsub = client.request(
          {
            type,
            path,
            input,
            id,
            context
          },
          {
            error(err) {
              observer.error(err);
              unsub();
            },
            complete() {
              observer.complete();
            },
            next(message) {
              const transformed = transformResult(message, runtime);
              if (!transformed.ok) {
                observer.error(TRPCClientError.from(transformed.error));
                return;
              }
              observer.next({
                result: transformed.result
              });
              if (op.type !== 'subscription') {
                unsub();
                observer.complete();
              }
            }
          }
        );
        return () => {
          unsub();
        };
      });
    };
  };
}

// ../../node_modules/@trpc/client/dist/index.mjs
var TRPCUntypedClient = class {
  $request({ type, input, path, context = {} }) {
    const chain$ = createChain({
      links: this.links,
      op: {
        id: ++this.requestId,
        type,
        path,
        input,
        context
      }
    });
    return chain$.pipe(share());
  }
  requestAsPromise(opts) {
    const req$ = this.$request(opts);
    const { promise, abort } = observableToPromise(req$);
    const abortablePromise = new Promise((resolve, reject) => {
      opts.signal?.addEventListener('abort', abort);
      promise
        .then((envelope) => {
          resolve(envelope.result.data);
        })
        .catch((err) => {
          reject(TRPCClientError.from(err));
        });
    });
    return abortablePromise;
  }
  query(path, input, opts) {
    return this.requestAsPromise({
      type: 'query',
      path,
      input,
      context: opts?.context,
      signal: opts?.signal
    });
  }
  mutation(path, input, opts) {
    return this.requestAsPromise({
      type: 'mutation',
      path,
      input,
      context: opts?.context,
      signal: opts?.signal
    });
  }
  subscription(path, input, opts) {
    const observable$ = this.$request({
      type: 'subscription',
      path,
      input,
      context: opts?.context
    });
    return observable$.subscribe({
      next(envelope) {
        if (envelope.result.type === 'started') {
          opts.onStarted?.();
        } else if (envelope.result.type === 'stopped') {
          opts.onStopped?.();
        } else {
          opts.onData?.(envelope.result.data);
        }
      },
      error(err) {
        opts.onError?.(err);
      },
      complete() {
        opts.onComplete?.();
      }
    });
  }
  constructor(opts) {
    this.requestId = 0;
    const combinedTransformer = (() => {
      const transformer = opts.transformer;
      if (!transformer) {
        return {
          input: {
            serialize: (data) => data,
            deserialize: (data) => data
          },
          output: {
            serialize: (data) => data,
            deserialize: (data) => data
          }
        };
      }
      if ('input' in transformer) {
        return opts.transformer;
      }
      return {
        input: transformer,
        output: transformer
      };
    })();
    this.runtime = {
      transformer: {
        serialize: (data) => combinedTransformer.input.serialize(data),
        deserialize: (data) => combinedTransformer.output.deserialize(data)
      },
      combinedTransformer
    };
    this.links = opts.links.map((link) => link(this.runtime));
  }
};
function createTRPCUntypedClient(opts) {
  return new TRPCUntypedClient(opts);
}
function createTRPCClient(opts) {
  const client = new TRPCUntypedClient(opts);
  return client;
}
var clientCallTypeMap = {
  query: 'query',
  mutate: 'mutation',
  subscribe: 'subscription'
};
var clientCallTypeToProcedureType = (clientCallType) => {
  return clientCallTypeMap[clientCallType];
};
function createTRPCClientProxy(client) {
  return createFlatProxy((key) => {
    if (client.hasOwnProperty(key)) {
      return client[key];
    }
    if (key === '__untypedClient') {
      return client;
    }
    return createRecursiveProxy(({ path, args }) => {
      const pathCopy = [key, ...path];
      const procedureType = clientCallTypeToProcedureType(pathCopy.pop());
      const fullPath = pathCopy.join('.');
      return client[procedureType](fullPath, ...args);
    });
  });
}
function createTRPCProxyClient(opts) {
  const client = new TRPCUntypedClient(opts);
  const proxy = createTRPCClientProxy(client);
  return proxy;
}
function getUntypedClient(client) {
  return client.__untypedClient;
}
function getTextDecoder(customTextDecoder) {
  if (customTextDecoder) {
    return customTextDecoder;
  }
  if (typeof window !== 'undefined' && window.TextDecoder) {
    return new window.TextDecoder();
  }
  if (typeof globalThis !== 'undefined' && globalThis.TextDecoder) {
    return new globalThis.TextDecoder();
  }
  throw new Error('No TextDecoder implementation found');
}
function parseJSONStream(opts) {
  return __async(this, null, function* () {
    const parse = opts.parse ?? JSON.parse;
    const onLine = (line) => {
      if (opts.signal?.aborted) return;
      if (!line || line === '}') {
        return;
      }
      const indexOfColon = line.indexOf(':');
      const indexAsStr = line.substring(2, indexOfColon - 1);
      const text = line.substring(indexOfColon + 1);
      opts.onSingle(Number(indexAsStr), parse(text));
    };
    yield readLines(opts.readableStream, onLine, opts.textDecoder);
  });
}
function readLines(readableStream, onLine, textDecoder) {
  return __async(this, null, function* () {
    let partOfLine = '';
    const onChunk = (chunk) => {
      const chunkText = textDecoder.decode(chunk);
      const chunkLines = chunkText.split('\n');
      if (chunkLines.length === 1) {
        partOfLine += chunkLines[0];
      } else if (chunkLines.length > 1) {
        onLine(partOfLine + chunkLines[0]);
        for (let i = 1; i < chunkLines.length - 1; i++) {
          onLine(chunkLines[i]);
        }
        partOfLine = chunkLines[chunkLines.length - 1];
      }
    };
    if ('getReader' in readableStream) {
      yield readStandardChunks(readableStream, onChunk);
    } else {
      yield readNodeChunks(readableStream, onChunk);
    }
    onLine(partOfLine);
  });
}
function readNodeChunks(stream, onChunk) {
  return new Promise((resolve) => {
    stream.on('data', onChunk);
    stream.on('end', resolve);
  });
}
function readStandardChunks(stream, onChunk) {
  return __async(this, null, function* () {
    const reader = stream.getReader();
    let readResult = yield reader.read();
    while (!readResult.done) {
      onChunk(readResult.value);
      readResult = yield reader.read();
    }
  });
}
var streamingJsonHttpRequester = (opts, onSingle) => {
  const ac = opts.AbortController ? new opts.AbortController() : null;
  const responsePromise = fetchHTTPResponse(
    __spreadProps(__spreadValues({}, opts), {
      contentTypeHeader: 'application/json',
      batchModeHeader: 'stream',
      getUrl,
      getBody
    }),
    ac
  );
  const cancel = () => ac?.abort();
  const promise = responsePromise.then((res) =>
    __async(void 0, null, function* () {
      if (!res.body) throw new Error('Received response without body');
      const meta = {
        response: res
      };
      return parseJSONStream({
        readableStream: res.body,
        onSingle,
        parse: (string) => ({
          json: JSON.parse(string),
          meta
        }),
        signal: ac?.signal,
        textDecoder: opts.textDecoder
      });
    })
  );
  return {
    cancel,
    promise
  };
};
var streamRequester = (requesterOpts) => {
  const textDecoder = getTextDecoder(requesterOpts.opts.textDecoder);
  return (batchOps, unitResolver) => {
    const path = batchOps.map((op) => op.path).join(',');
    const inputs = batchOps.map((op) => op.input);
    const { cancel, promise } = streamingJsonHttpRequester(
      __spreadProps(__spreadValues({}, requesterOpts), {
        textDecoder,
        path,
        inputs,
        headers() {
          if (!requesterOpts.opts.headers) {
            return {};
          }
          if (typeof requesterOpts.opts.headers === 'function') {
            return requesterOpts.opts.headers({
              opList: batchOps
            });
          }
          return requesterOpts.opts.headers;
        }
      }),
      (index, res) => {
        unitResolver(index, res);
      }
    );
    return {
      /**
       * return an empty array because the batchLoader expects an array of results
       * but we've already called the `unitResolver` for each of them, there's
       * nothing left to do here.
       */
      promise: promise.then(() => []),
      cancel
    };
  };
};
var unstable_httpBatchStreamLink = createHTTPBatchLink(streamRequester);
var getBody2 = (opts) => {
  if (!('input' in opts)) {
    return void 0;
  }
  if (!(opts.input instanceof FormData)) {
    throw new Error('Input is not FormData');
  }
  return opts.input;
};
var formDataRequester = (opts) => {
  if (opts.type !== 'mutation') {
    throw new Error('We only handle mutations with formdata');
  }
  return httpRequest(
    __spreadProps(__spreadValues({}, opts), {
      getUrl() {
        return `${opts.url}/${opts.path}`;
      },
      getBody: getBody2
    })
  );
};
var experimental_formDataLink = httpLinkFactory({
  requester: formDataRequester
});
export {
  TRPCClientError,
  TRPCUntypedClient,
  clientCallTypeToProcedureType,
  createTRPCClient,
  createTRPCClientProxy,
  createTRPCProxyClient,
  createTRPCUntypedClient,
  createWSClient,
  experimental_formDataLink,
  getFetch,
  getUntypedClient,
  httpBatchLink,
  httpLink,
  httpLinkFactory,
  loggerLink,
  splitLink,
  unstable_httpBatchStreamLink,
  wsLink
};
/*! Bundled license information:

@trpc/client/dist/httpUtils-b9d0cb48.mjs:
  (* istanbul ignore if -- @preserve *)

@trpc/client/dist/links/wsLink.mjs:
  (* istanbul ignore next -- @preserve *)
*/
//# sourceMappingURL=@trpc_client.js.map
