export default {
  input: 'src/index.js',
  output: {
    file: 'lib/monitor.js',
    format: 'umd',
    name: 'Monitor'
  },
  watch: {
    include: 'src/**'
  }
};
