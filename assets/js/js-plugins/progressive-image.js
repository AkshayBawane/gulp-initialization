/*--------------------------------------------------
	Progressive Image
	https://github.com/craigbuckler/progressive-image.js
--------------------------------------------------*/
if (window.addEventListener && window.requestAnimationFrame && document.getElementsByClassName) window.addEventListener('load', function () {

	// start
	var pItem = document.getElementsByClassName('progressive replace'),
		pCount, timer;

	// scroll and resize events
	window.addEventListener('scroll', scroller, false);
	window.addEventListener('resize', scroller, false);

	// DOM mutation observer
	if (MutationObserver) {

		var observer = new MutationObserver(function () {
			if (pItem.length !== pCount) inView();
		});
		observer.observe(document.body, {
			subtree: true,
			childList: true,
			attributes: true,
			characterData: true
		});

	}

	// initial check
	inView();


	// throttled scroll/resize
	function scroller() {

		timer = timer || setTimeout(function () {
			timer = null;
			inView();
		}, 300);

	}


	// image in view?
	function inView() {

		if (pItem.length) requestAnimationFrame(function () {

			var wT = window.pageYOffset,
				wB = wT + window.innerHeight,
				cRect, pT, pB, p = 0;
			while (p < pItem.length) {

				cRect = pItem[p].getBoundingClientRect();
				pT = wT + cRect.top;
				pB = pT + cRect.height;

				if (wT < pB && wB > pT) {
					loadFullImage(pItem[p]);
					pItem[p].classList.remove('replace');
				} else p++;

			}

			pCount = pItem.length;

		});

	}


	// replace with full image
	function loadFullImage(item) {

		var href = item && (item.getAttribute('data-href') || item.href);
		if (!href) return;

		// load image
		var img = new Image();
		if (item.dataset) {
			img.srcset = item.dataset.srcset || '';
			img.sizes = item.dataset.sizes || '';
		}
		img.src = href;
		img.className = 'reveal';
		if (img.complete) addImg();
		else img.onload = addImg;

		// replace image
		function addImg() {

			requestAnimationFrame(function () {

				// disable click
				if (href === item.href) {
					item.style.cursor = 'default';
					item.addEventListener('click', function (e) {
						e.preventDefault();
					}, false);
				}

				// add full image
				item.appendChild(img).addEventListener('animationend', function (e) {

					// remove preview image
					var pImg = item.querySelector && item.querySelector('img.preview');
					if (pImg) {
						e.target.alt = pImg.alt || '';
						item.removeChild(pImg);
						e.target.classList.remove('reveal');
					}

				});

			});

		}

	}

}, false);
