export var areClipPathShapesSupported = function() {
	var base = 'clipPath',
		prefixes = ['webkit', 'moz', 'ms', 'o'],
		properties = [base],
		testElement = document.createElement('testelement'),
		attribute = 'polygon(50% 0%, 0% 100%, 100% 100%)';

	// Push the prefixed properties into the array of properties.
	for (var i = 0, l = prefixes.length; i < l; i++) {
		var prefixedProperty =
			prefixes[i] + base.charAt(0).toUpperCase() + base.slice(1); // remember to capitalize!
		properties.push(prefixedProperty);
	}

	// Interate over the properties and see if they pass two tests.
	for (var i = 0, l = properties.length; i < l; i++) {
		var property = properties[i];

		// First, they need to even support clip-path (IE <= 11 does not)...
		if (testElement.style[property] === '') {
			// Second, we need to see what happens when we try to create a CSS shape...
			testElement.style[property] = attribute;
			if (testElement.style[property] !== '') {
				return true;
			}
		}
	}

	return false;
};

export const isBackgroundClipTextSupported = () => {
	const testEl = document.createElement('x-test');
	return (
		typeof testEl.style.webkitBackgroundClip !== 'undefined' &&
		((testEl.style.webkitBackgroundClip = 'text'),
		testEl.style.webkitBackgroundClip === 'text')
	);
};

export function copyToClipboard(text, cb) {
	//@ts-ignore
	if (window.clipboardData && window.clipboardData.setData) {
		// IE specific code path to prevent textarea being shown while dialog is visible.
		//@ts-ignore
		return clipboardData.setData('Text', text);
	} else if (
		document.queryCommandSupported &&
		document.queryCommandSupported('copy')
	) {
		var textarea = document.createElement('textarea');
		textarea.textContent = text;
		textarea.style.position = 'fixed'; // Prevent scrolling to bottom of page in MS Edge.
		document.body.appendChild(textarea);
		textarea.select();
		try {
			return document.execCommand('copy'); // Security exception may be thrown by some browsers.
		} catch (ex) {
			console.warn('Copy to clipboard failed.', ex);
			return false;
		} finally {
			document.body.removeChild(textarea);
			typeof cb === 'function' && cb();
		}
	}
}
