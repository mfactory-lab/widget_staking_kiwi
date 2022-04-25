// like lodash.debounce, but also avoids async invocations to overlap
export function debounceAsync<CB extends (...args: any[]) => Promise<R>, R>(
  callback: CB,
  wait = 100,
  { leading = false, maxWait = Infinity } = {},
) {
  let started = 0; // latest callback invocation
  let runningCallback: Promise<R> | undefined; // latest callback invocation result
  let runningDebouncer: Promise<R | undefined>; // latest wrapper invocation
  let waitingSince = 0; // we are delaying invocation since
  let whoIsWaiting: undefined | any[]; // args' array object identifies the pending instance, and incidentally stores args
  // eslint-disable-next-line prefer-spread
  const interceptingWrapper = (...args: any[]) => (runningDebouncer = debouncer.apply(null, args));
  return Object.assign(interceptingWrapper, {
    cancel: () => (whoIsWaiting = undefined),
    flush() {
      // eslint-disable-next-line prefer-spread
      return whoIsWaiting ? callback.apply(null, whoIsWaiting) : this.cancel();
    },
  });

  async function debouncer(...args: any[]) {
    whoIsWaiting = args;
    waitingSince ||= Date.now();
    await runningCallback;
    const waitingCap = maxWait - (Date.now() - (waitingSince || started));
    const waitFor = Math.min(waitingCap, leading ? wait - (Date.now() - started) : wait);
    if (waitFor > 0) await new Promise((resolve) => setTimeout(resolve, waitFor));
    if (!whoIsWaiting)
      // canceled
      return void (waitingSince = 0);
    if (whoIsWaiting !== args)
      // another fresher call is waiting
      return runningDebouncer;
    waitingSince = 0;
    whoIsWaiting = undefined;
    started = Date.now();
    try {
      // eslint-disable-next-line prefer-spread
      runningCallback = callback.apply(null, args);
      return await runningCallback;
    } finally {
      runningCallback = undefined;
    }
  }
}
