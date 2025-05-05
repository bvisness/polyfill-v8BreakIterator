// Intl.v8BreakIterator is ever so slightly documented here:
// https://code.google.com/archive/p/v8-i18n/wikis/BreakIterator.wiki
//
// The standard Intl.Segmenter API is documented here:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter
if (typeof Intl.v8BreakIterator === 'undefined') {
  const type2granularity = {
    "character": "grapheme",
    "word": "word",
    "sentence": "sentence",
  };

  Intl.v8BreakIterator = function (locales, options = {}) {
    const granularity = type2granularity[options.type ?? "word"];
    if (!granularity) {
      throw new Error(`Type "${options.type}" is not supported.`);
    }
    const segmenter = new Intl.Segmenter(locales, { granularity });

    let segments = [];
    let segmentIndex = -1;
    let originalText = '';

    return {
      // Assigns text to be segmented to the iterator.
      adoptText(text) {
        originalText = text;
        segments = Array.from(segmenter.segment(text));
        segmentIndex = -1;
      },

      // Returns index of the first break and moves pointer to it.
      first() {
        segmentIndex = 0;
        return this.current();
      },

      // Returns index of the next break and moves pointer to it.
      next() {
        if (segmentIndex < segments.length) {
          segmentIndex++;
          return this.current();
        }
        return -1;
      },

      // Returns index of the current break.
      current() {
        if (0 <= segmentIndex && segmentIndex < segments.length) {
          return segments[segmentIndex].index;
        }
        if (segmentIndex == segments.length) {
          // Special case to handle the last "break", at the end of the string
          return originalText.length;
        }
        return -1;
      },

      // Returns the type of the break - 'none', 'number', 'letter', 'kana',
      // 'ideo' or 'unknown'.
      breakType() {
        // TODO
        return 'none';
      },

      // The documentation hints at a `resolvedOptions` method...perhaps this
      // ought to be polyfilled as well.
    };
  };
}
