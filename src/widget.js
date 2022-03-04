window.onload = function () {
  const stakingKiwiWidthMobNum = 423;
  const stakingKiwiWidthDesk = '470px';
  const stakingKiwiHeightDesk = '302px';
  const stakingKiwiWidthMob = `${stakingKiwiWidthMobNum}px`;
  const stakingKiwiHeightMob = '466px';
  let stakingKiwiIframeHeight = stakingKiwiHeightDesk;
  let stakingKiwiIframeWidth = stakingKiwiWidthDesk;
  const stakingKiwiOnResize = function () {
    let stakingKiwiIframeHeightNew = stakingKiwiHeightDesk,
      stakingKiwiIframeWidthNew = stakingKiwiWidthDesk;
    const stakingKiwiIframe = document.getElementById('staking-kiwi-widget-0');
    const pWidth = stakingKiwiIframe.parentElement.offsetWidth;
    if (pWidth < 447) {
      stakingKiwiIframeWidthNew =
        pWidth > stakingKiwiWidthMobNum ? stakingKiwiWidthMob : `${pWidth}px`;
      stakingKiwiIframeHeightNew = stakingKiwiHeightMob;
    }
    if (
      stakingKiwiIframeHeight !== stakingKiwiIframeHeightNew ||
      stakingKiwiIframeWidth !== stakingKiwiIframeWidthNew
    ) {
      stakingKiwiIframe.style.width = stakingKiwiIframeWidthNew;
      stakingKiwiIframe.style.height = stakingKiwiIframeHeightNew;
      stakingKiwiIframeHeight = stakingKiwiIframeHeightNew;
      stakingKiwiIframeWidth = stakingKiwiIframeHeightNew;
    }
  };

  let stakingKiwiIframe = document.getElementById('staking-kiwi-widget-0');
  if (!stakingKiwiIframe) {
    let timerIteration = 0;
    const timer = setInterval(() => {
      if (timerIteration > 100) {
        return clearInterval(timer);
      }
      timerIteration++;
      stakingKiwiIframe = document.getElementById('staking-kiwi-widget-0');
      if (stakingKiwiIframe) {
        clearInterval(timer);
        stakingKiwiOnResize();
        window.addEventListener('resize', stakingKiwiOnResize);
      }
    }, 50);
  } else {
    stakingKiwiOnResize();
    window.addEventListener('resize', stakingKiwiOnResize);
  }
};
