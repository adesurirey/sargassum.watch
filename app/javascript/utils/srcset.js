export default source => source.map((src, i) => `${src} ${i + 1}x`).join(', ');
